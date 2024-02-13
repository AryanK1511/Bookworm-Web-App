from app import app, db
from flask import request, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models.review import Review
from app.models.reading_list import ReadingList
from sqlalchemy import text
from passlib.hash import pbkdf2_sha256
import asyncio
from datetime import timedelta
import cloudinary
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
import cloudinary.api
from werkzeug.utils import secure_filename

# Configure JWT for authorization
jwt = JWTManager(app)

# Cloudinary configuration
cloudinary.config(
    cloud_name=app.config['CLOUDINARY_CLOUD_NAME'],
    api_key=app.config['CLOUDINARY_API_KEY'],
    api_secret=app.config['CLOUDINARY_API_SECRET']
)

@app.route('/', methods=["GET"])
def test():
    return jsonify({'message': 'Welcome to the BKWRM API'}), 200

# ========== ENDPOINT FOR USER PROFILE ===========


@app.route('/api/users/profile/<user_id>', methods=["GET"])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)

    # If user not found, return error message
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # If user is found, return user data
    user_data = {
        "id": user.id,
        "fullname": user.fullname,
        "username": user.username,
        "email": user.email,
        "date_joined": user.date_joined.strftime("%Y-%m-%d"),
        "profile_picture": user.profile_picture,
        "role": user.role
    }

    # Return user data
    return jsonify({
        'message': 'User found',
        'user': user_data
    }), 200

# ========== ENDPOINT FOR USER PROFILE UPDATE ===========


@app.route('/api/users/profile/update/<user_id>', methods=["PUT"])
@jwt_required()
def update_user_profile(user_id):
    user = User.query.get(user_id)

    # If user not found, return error message
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # This assumes that the form data is sent as multipart/form-data
    fullname = request.form.get('fullname')
    username = request.form.get('username')

    # Update user data
    user.fullname = fullname if fullname else user.fullname
    user.username = username if username else user.username

    # Set to default profile picture
    if 'profile_picture' in request.form and request.form['profile_picture'] == 'reset':
        user.profile_picture = f"https://res.cloudinary.com/{app.config['CLOUDINARY_CLOUD_NAME']}/image/upload/default_profile_pic.avif"
    # Check if a new profile picture file is included
    elif 'profile_picture' in request.files:
        file_to_upload = request.files['profile_picture']
        filename = secure_filename(file_to_upload.filename)

        # Check if the user already has a profile picture
        if user.profile_picture:
            # Delete the existing profile picture
            cloudinary.uploader.destroy(user_id+"_profile_picture")

        # Upload the new file
        result = cloudinary.uploader.upload(
            file_to_upload, public_id=user_id+"_profile_picture")

        # Update the profile picture URL in the database
        user.profile_picture = result['secure_url']

    # Save the updated user data
    try:
        db.session.commit()

        user = User.query.get(user_id)

        # Create a new JWT token with the new user details
        user_claims = {
            "id": user.id,
            "fullname": user.fullname,
            "username": user.username,
            "email": user.email,
            "profile_picture": user.profile_picture
        }

        # Create JWT token for the new user
        jwt_access_token = create_access_token(
            identity=user_claims, expires_delta=timedelta(days=365))

        # Return message with new JWT token
        return jsonify({
            "message": "User profile updated successfully",
            "jwt_token": jwt_access_token
        }), 200

    except Exception as e:
        db.session.rollback()
        # Handle any exceptions, such as database errors
        return jsonify({'message': 'Failed to update user profile', 'error': str(e)}), 500

# ========== ENDPOINT FOR USER LOGIN ===========


@app.route('/api/users/login', methods=["POST"])
def login_user():
    user_data = request.get_json()

    # Extract user info from the request
    # Can be either username or email
    login_credential = user_data.get('login_credential')
    password = user_data.get('password')

    # Fetch user by username or email
    user = User.query.filter((User.username == login_credential) | (
        User.email == login_credential)).first()

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
        jwt_access_token = create_access_token(
            identity=user_claims, expires_delta=timedelta(days=365))

        # Return the JWT token in the response body
        return jsonify({
            "message": "User logged in successfully",
            "jwt_token": jwt_access_token,
        }), 200

    else:
        # Authentication failed
        return jsonify({'message': 'Invalid username or password. Please try again'}), 400

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
    new_user = User(fullname=fullname, username=username, email=email, password_hash=password_hash,
                    profile_picture=f"https://res.cloudinary.com/{app.config['CLOUDINARY_CLOUD_NAME']}/image/upload/default_profile_pic.avif")

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


@app.route('/api/users/deactivate', methods=['DELETE'])
@jwt_required()
def deactivate_user():
    # Get the user's details from the JWT token
    current_user = get_jwt_identity()

    # Retrieve the user to be deleted
    user_to_be_deleted = User.query.get(current_user['id'])

    # If invalid user id is passed, return error message
    if not user_to_be_deleted:
        return jsonify({'message': 'User not found'}), 404

    # If it is a valid user, start the deletion process
    try:
        # Delete reviews by the user
        Review.query.filter_by(user_id=current_user['id']).delete()

        # Delete reading list entries by the user
        ReadingList.query.filter_by(user_id=current_user['id']).delete()

        # Check if the user has a profile picture and it's not the default one
        if user_to_be_deleted.profile_picture and user_to_be_deleted.profile_picture != f"https://res.cloudinary.com/{app.config['CLOUDINARY_CLOUD_NAME']}/image/upload/default_profile_pic.avif":
            # Extract the public_id from the user's profile picture URL
            public_id = user_to_be_deleted.profile_picture.split('/')[-1].split('.')[0]
            # Delete the existing profile picture from Cloudinary
            cloudinary.uploader.destroy(public_id)

        # Delete the user account
        db.session.delete(user_to_be_deleted)
        db.session.commit()

        return jsonify({'message': 'User account and associated data successfully deleted'}), 200

    except Exception as e:
        db.session.rollback()
        # Handle any exceptions, such as database errors
        return jsonify({'message': 'Failed to deactivate user', 'error': str(e)}), 500
