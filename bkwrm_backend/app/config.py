import os

class Config:
    # ===== POSTGRESQL CONFIG =====
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

    # ===== CLOUDINARY CONFIG =====
    CLOUDINARY_CLOUD_NAME=os.environ.get('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY=os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET=os.environ.get('CLOUDINARY_API_SECRET')

    # ==== JWT SECRET ====
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
