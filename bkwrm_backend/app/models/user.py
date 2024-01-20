from app import db
from datetime import datetime

# ========== USER MODEL ==========
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)  
    profile_picture = db.Column(db.String(255))  

    def __init__(self, username, email, password_hash, profile_picture=None):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.profile_picture = profile_picture