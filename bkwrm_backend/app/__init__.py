from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)  # This will enable CORS for all routes and domains
app.config.from_object(Config)
db = SQLAlchemy(app)

from app.routes import user_routes
