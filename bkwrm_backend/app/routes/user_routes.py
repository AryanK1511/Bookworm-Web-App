from app import app, db
from flask import request, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models.review import Review
from app.models.reading_list import ReadingList
from app.models.book import Book
from sqlalchemy import text
from passlib.hash import pbkdf2_sha256
import asyncio
from datetime import timedelta

# Configure JWT for authorization
jwt = JWTManager(app)

# ========== ROUTE TO CHECK API RUNS ==========
@app.route('/', methods=['GET'])
def check_for_run():
    return jsonify({'message': 'API runs successfully'}), 201

# ========== ENDPOINT FOR USER LOGIN ===========
@app.route('/api/users/login', methods=["POST"])
def login_user():
    user_data = request.get_json()

    # Extract user info from the request
    login_credential = user_data.get('login_credential')  # Can be either username or email
    password = user_data.get('password')

    # Fetch user by username or email
    user = User.query.filter((User.username == login_credential) | (User.email == login_credential)).first()

    # Check if user exists and the password is correct
    if user and pbkdf2_sha256.verify(password, user.password_hash):
        # Define custom claims with user data
        user_claims = {
            "id": user.id,
            "fullname": user.fullname,
            "username": user.username,
            "email": user.email,
            "profile_picture": user.profile_picture
        }

        # Create JWT token for the new user
        jwt_access_token = create_access_token(identity=user.id, additional_claims=user_claims, expires_delta=timedelta(days=365))

        # Return the JWT token in the response body
        return jsonify({
            "message": "User logged in successfully",
            "jwt_token": jwt_access_token,
        }), 200

    else:
        # Authentication failed
        return jsonify({'message': 'Invalid login credentials'}), 401

# ========== ENDPOINT FOR USER REGISTRATION ==========
@app.route('/api/users/register', methods=['POST'])
def register_user():
    user_data = request.get_json()

    # Extract user info from the request
    fullname = user_data.get('fullname')
    username = user_data.get('username')
    email = user_data.get('email')
    password = user_data.get('password')

    # Check if the user already exists
    existing_user = User.query.filter(User.username == username).first()
    if existing_user:
        return jsonify({'message': 'Username or email already exists'}), 400

    # Hash the password
    password_hash = pbkdf2_sha256.hash(password)

    # Create a new user if the user doesn't exist already
    new_user = User(fullname=fullname, username=username, email=email, password_hash=password_hash)

    # Add the new user to DB
    try:
        db.session.add(new_user)
        db.session.commit()

        # Return message
        return jsonify({
            "message": "User registered successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        # Handle any exceptions, such as database errors
        return jsonify({'message': 'Failed to register user. Server Error.', 'error': str(e)}), 500

# ========== ENDPOINT FOR USER ACCOUNT DEACTIVATION ==========
@app.route('/api/users/deactivate/<user_id>', methods=['POST'])
def deactivate_user(user_id):
    # Retrieve the user to be deleted
    user_to_be_deleted = User.query.get(user_id)

    # If invalid user id is passed, return error message
    if not user_to_be_deleted:
        return jsonify({'message': 'User not found'}), 404

    # If it is a valid user, delete user data from all tables in DB
    try:
        # Delete reviews by the user
        Review.query.filter_by(user_id=user_id).delete()

        # Delete reading list entries by the user
        ReadingList.query.filter_by(user_id=user_id).delete()

        # Delete the user account
        db.session.delete(user_to_be_deleted)
        db.session.commit()

        return jsonify({'message': 'User account and associated data successfully deleted'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to deactivate user', 'error': str(e)}), 500