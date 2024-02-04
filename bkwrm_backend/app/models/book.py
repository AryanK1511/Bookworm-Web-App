from app import db
from datetime import datetime

# ========== BOOK MODEL ==========
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_books_id = db.Column(db.String(120), unique=True, nullable=False)
