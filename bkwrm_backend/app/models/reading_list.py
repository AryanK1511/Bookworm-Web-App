from app import db

# ========== READING LIST MODEL ==========
class ReadingList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    status = db.Column(db.String(50))  # Enum can be implemented differently depending on the use case
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
