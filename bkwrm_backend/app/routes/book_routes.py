from app import app, db
from flask import request, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models.review import Review
from app.models.reading_list import ReadingList
from app.models.book import Book
from sqlalchemy import text
from datetime import timedelta

# Configure JWT for authorization
jwt = JWTManager(app)

# ========== ENDPOINT FOR ADDING BOOK TO LIST ===========
@app.route('/api/books/add', methods=["POST"])
@jwt_required()
def add_book_to_reading_list():
    try:
        # Get the current user's ID from the JWT token
        current_user = get_jwt_identity()
        print("Current User:", current_user)

        # Get the body
        data = request.get_json()
        print("Request Data:", data)

        # Extract the google_books_id from the request
        google_books_id = data.get('google_books_id')
        print("Google Books ID:", google_books_id)

        # Create a new reading list entry
        reading_list_entry = ReadingList(
            user_id=current_user["id"],
            google_books_id=google_books_id
        )

        # Create a new book entry
        book_entry = Book(
            google_books_id=google_books_id
        )

        # Add the entry to the database session
        db.session.add(book_entry)
        db.session.add(reading_list_entry)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Book added to reading list successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))  # Print the error message for debugging
        return jsonify({"message": "Something went wrong"}), 500