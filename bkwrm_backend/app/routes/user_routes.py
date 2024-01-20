from app import app, db
from flask import request, jsonify
from app.models.user import User
import asyncio

# ========== ENDPOINT FOR USER REGISTRATION ==========
@app.route('/api/users/register', methods=['POST'])
async def register_user():
    user_data = await request.get_json()

    # Extract user info from the request
    username = user_data.get('username')
    email = user_data.get('email')
    password = user_data.get('password')

    # Check if the user already exists
    existing_user = User.query.filter(username=username).first()
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    # Create a new user if the user doesn't exist already
    new_user = User(username=username, email=email, password=password)

    # Add the new user to DB
    try:
        db.session.add(new_user)
        await db.session.commit() 
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        # Handle any exceptions, such as database errors
        return jsonify({'message': 'Failed to register user', 'error': str(e)}), 500