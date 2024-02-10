from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config
from flask_cors import CORS

# Create a Flask app
app = Flask(__name__)

# This will enable CORS for all routes and domains
CORS(app, supports_credentials=True) 

# Load the config from the config.py file
app.config.from_object(Config)

# Create a SQLAlchemy database
db = SQLAlchemy(app)

# Import the routes
from app.routes import user_routes, book_routes, review_routes
