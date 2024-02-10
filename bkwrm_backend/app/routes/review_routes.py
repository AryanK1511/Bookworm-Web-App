from app import app, db
from flask import request, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models.review import Review
from app.models.reading_list import ReadingList
from sqlalchemy import text
from datetime import timedelta

# Configure JWT for authorization
jwt = JWTManager(app)

# ========== ENDPOINT FOR ADDING A REVIEW FOR A BOOK ===========
@app.route('/api/reviews/add', methods=["POST"])
@jwt_required()
def add_user_review():
    try:
        # Get the current user's ID from the JWT token
        current_user = get_jwt_identity()

        # Get the body
        data = request.get_json()

        # Extract the details from the body sent by user
        google_books_id = data.get('bookId')
        review_text = data.get('reviewText')
        rating = data.get('rating')

        # Create a new review entry
        review_entry = Review(
            user_id=current_user["id"],
            google_books_id=google_books_id,
            review_text=review_text,
            rating=rating
        )

        # Add the entry to the database session
        db.session.add(review_entry)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Review added successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Review could not be added. Server error."}), 500

# ========== ENDPOINT FOR DELETING A REVIEW FOR A BOOK ===========
@app.route('/api/reviews/delete', methods=["POST"])
@jwt_required()
def delete_user_review():
    try:
        # Get the current user's ID from the JWT token
        current_user = get_jwt_identity()

        # Get the body
        data = request.get_json()

        # Extract the details from the body sent by user
        id = data.get('reviewId')

        # Find the review entry in the database
        review_entry = Review.query.filter_by(id=id, user_id=current_user["id"]).first()

        # If the review entry exists, delete it
        if review_entry:
            db.session.delete(review_entry)
            db.session.commit()
            return jsonify({"message": "Review deleted successfully"}), 200
        else:
            return jsonify({"message": "Review does not exist"}), 404

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Review could not be deleted. Server error."}), 500