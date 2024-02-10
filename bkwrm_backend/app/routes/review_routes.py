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
@app.route('/api/reviews/add', methods=["POST"])
@jwt_required()
def add_user_review():
    try:
        # Get the current user's ID from the JWT token
        current_user = get_jwt_identity()

        # Get the body
        data = request.get_json()

        # Extract the google_books_id from the request
        google_books_id = data.get('google_books_id')
        print("Google Books ID:", google_books_id)

        # Extract the review from the request
        review = data.get('review')
        print("Review:", review)

        # Create a new review entry
        review_entry = Review(
            user_id=current_user["id"],
            google_books_id=google_books_id,
            review=review
        )

        # Add the entry to the database session
        db.session.add(review_entry)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Review added successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))