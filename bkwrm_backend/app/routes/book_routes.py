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
        print("Google Books ID:", google_books_id)

        # Create a new reading list entry
        reading_list_entry = ReadingList(
            user_id=current_user["id"],
            google_books_id=google_books_id
        )

        # Add the entry to the database session
        db.session.add(reading_list_entry)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Book added to reading list successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))  # Print the error message for debugging
        return jsonify({"message": "Something went wrong"}), 500

# ========== ENDPOINT FOR GETTING THE DETAILS OF A BOOK ===========
@app.route('/api/books/get-details/<book_id>', methods=["GET"])
@jwt_required()
def get_book_details(book_id):
    GOOGLE_BOOKS_API_KEY = os.environ.get('GOOGLE_BOOKS_API_KEY')
    print("Google Books API Key:", GOOGLE_BOOKS_API_KEY)
    # Set the URL
    google_books_api_url = f"https://www.googleapis.com/books/v1/volumes/{book_id}?key={GOOGLE_BOOKS_API_KEY}"

    try:
        # Fetch book details from the google books API
        response = requests.get(google_books_api_url)
        response.raise_for_status()  # Raises an HTTPError if the response status code is 4XX/5XX
        book_details = response.json()

        # Fetch and join reviews with user information
        reviews = db.session.query(Review, User).join(User).filter(Review.google_books_id == book_id).all()
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