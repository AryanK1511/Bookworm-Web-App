from app import app, db
from flask import request, jsonify
from app.models.user import User
from sqlalchemy import text
import asyncio

# ========== ROUTE TO CHECK API RUNS ==========
@app.route('/', methods=['GET'])
def check_for_run():
    return jsonify({'message': 'API runs successfully'}), 201

# ========== ENDPOINT FOR USER REGISTRATION ==========
@app.route('/api/users/register', methods=['POST'])
def register_user():
    user_data = request.get_json()

    # Extract user info from the request
    username = user_data.get('username')
    email = user_data.get('email')
    password = user_data.get('password')

    # Check if the user already exists
    existing_user = db.session.execute(
        text("SELECT * FROM \"user\" WHERE username = :username"),
        {"username": username}
    ).fetchone()

    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    # Create a new user if the user doesn't exist already
    new_user = User(username=username, email=email, password=password)

    # Add the new user to DB
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        # Handle any exceptions, such as database errors
        return jsonify({'message': 'Failed to register user', 'error': str(e)}), 500

# ========== ENDPOINT FOR USER ACCOUNT DEACTIVATION ==========
@app.route('/api/users/deactivate', methods=['POST'])
def deactivate_user():
    pass