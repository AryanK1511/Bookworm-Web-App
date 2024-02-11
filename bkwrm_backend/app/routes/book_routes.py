import os
from app import app, db
from flask import request, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models.review import Review
from app.models.reading_list import ReadingList
from sqlalchemy import text
from datetime import timedelta
import requests

# Configure JWT for authorization
jwt = JWTManager(app)

# ========== ENDPOINT FOR GETTING A USER'S READING LIST ===========
@app.route('/api/books/readinglist', methods=["GET"])
@jwt_required()
def get_reading_list():
    try:
        # Get the current user's ID from the JWT token
        user = get_jwt_identity()

        # Fetch the reading list from the database
        reading_list = ReadingList.query.filter_by(user_id=user['id']).all()
        
        # Convert the reading list to JSON
        reading_list_json = [
            {
                'id': item.id,
                'user_id': item.user_id,
                'google_books_id': item.google_books_id,
                'title': item.title,
                'author': item.author,
                'image_url': item.image_url,
                'status': item.status,
                'date_added': item.date_added.isoformat()
            } for item in reading_list
        ]

        # Return the reading list
        return jsonify({"message": "Reading list fetched successfully", "reading_list": reading_list_json}), 200

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred while fetching reading list"}), 500

# ========== ENDPOINT FOR REMOVING BOOK FROM READING LIST ===========
@app.route('/api/books/remove', methods=["DELETE"])
@jwt_required()
def remove_book_from_reading_list():
    try:
        # Get the current user's ID from the JWT token
        current_user = get_jwt_identity()

        # Get the body
        data = request.get_json()

        print("Hello")

        # Extract the google_books_id from the request
        google_books_id = data.get('google_books_id')

        print("GOOGLE BOOKS ID:", google_books_id)

        # Remove the book from the reading list
        ReadingList.query.filter_by(user_id=current_user["id"], google_books_id=google_books_id).delete()

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Book removed from reading list successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Something went wrong"}), 500

# ========== ENDPOINT FOR DELETING ALL BOOKS FOR A USER ===========
@app.route('/api/books/remove-all', methods=["DELETE"])
@jwt_required()
def remove_all_books_from_reading_list():
    try:
        # Get the current user's ID from the JWT token
        current_user = get_jwt_identity()

        # Remove all books from the reading list
        ReadingList.query.filter_by(user_id=current_user["id"]).delete()

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "All books removed from reading list successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Something went wrong"}), 500

# ========== ENDPOINT FOR UPDATING BOOK STATUS ===========
@app.route('/api/books/update', methods=["PUT"])
@jwt_required()
def update_book_status():
    try:
        # Get the current user's ID from the JWT token
        current_user = get_jwt_identity()

        # Get the body
        data = request.get_json()

        # Extract the google_books_id and status from the request
        google_books_id = data.get('google_books_id')
        status = data.get('status')

        # Update the book status
        ReadingList.query.filter_by(user_id=current_user["id"], google_books_id=google_books_id).update({"status": status})

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Book status updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Something went wrong"}), 500

# ========== ENDPOINT FOR ADDING BOOK TO LIST ===========
@app.route('/api/books/add', methods=["POST"])
@jwt_required()
def add_book_to_reading_list():
    try:
        # Get the current user's ID from the JWT token
        current_user = get_jwt_identity()

        # Get the body
        data = request.get_json()

        # Extract the google_books_id from the request
        google_books_id = data.get('google_books_id')

        # Create a new reading list entry
        reading_list_entry = ReadingList(
            user_id=current_user["id"],
            google_books_id=google_books_id,
            title=data.get('title'),
            author=data.get('authors'),
            image_url=data.get('image_url')
        )

        # Add the entry to the database session
        db.session.add(reading_list_entry)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Book added to reading list successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Something went wrong"}), 500

# ========== ENDPOINT FOR GETTING THE DETAILS OF A BOOK ===========
@app.route('/api/books/get-details/<book_id>', methods=["GET"])
@jwt_required()
def get_book_details(book_id):
    # Set the URL
    google_books_api_url = f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={os.environ.get('GOOGLE_BOOKS_API_KEY')}"

    try:
        # Fetch book details from the google books API
        response = requests.get(google_books_api_url)
        response.raise_for_status()  # Raises an HTTPError if the response status code is 4XX/5XX
        book_details = response.json()

        # Fetch and join reviews with user information
        reviews = (db.session.query(Review, User)
                   .join(User)
                   .filter(Review.google_books_id == book_id)
                   .order_by(Review.date_posted.desc())  # This will order the results
                   .all())
                   
        reviews_list = [{
            'id': review.Review.id,
            'google_books_id': review.Review.google_books_id,
            'user_id': review.User.id,
            'username': review.User.username,
            'fullname': review.User.fullname,
            'profile_picture': review.User.profile_picture,
            'rating': review.Review.rating,
            'review_text': review.Review.review_text,
            'date_posted': review.Review.date_posted.isoformat()
        } for review in reviews]

        # Return Book details
        return jsonify({"message": "Book details fetched successfully", "book_details": book_details, "reviews": reviews_list}), 200

    except Exception as e:
        # Handle any errors that occur during the request
        print(e)
        return jsonify({"message": "An error occurred while fetching book and reviews details"}), 500