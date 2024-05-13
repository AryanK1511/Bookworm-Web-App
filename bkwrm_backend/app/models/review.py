from app import db
from datetime import datetime


# ========== REVIEW MODEL ==========
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_books_id = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    rating = db.Column(db.Integer)
    review_text = db.Column(db.Text)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, google_books_id, user_id, rating, review_text):
        self.google_books_id = google_books_id
        self.user_id = user_id
        self.rating = rating
        self.review_text = review_text
