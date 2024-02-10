from app import db
from datetime import datetime

# ========== READING LIST MODEL ==========
class ReadingList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    google_books_id = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="unread")  # Enum can be implemented differently depending on the use case
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, user_id, google_books_id):
        self.user_id = user_id
        self.google_books_id = google_books_id