from app import db

# ========== REVIEW MODEL ==========
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer)
    review_text = db.Column(db.Text)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
