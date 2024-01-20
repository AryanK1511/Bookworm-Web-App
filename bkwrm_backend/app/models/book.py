from app import db
from datetime import datetime

# ========== BOOK MODEL ==========
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_books_id = db.Column(db.String(120), unique=True, nullable=False)
    title = db.Column(db.String(120), nullable=False)
    author = db.Column(db.String(120))
    publication_date = db.Column(db.Date)
    isbn = db.Column(db.String(120))
