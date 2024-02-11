from app import app, db
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Create all tables
with app.app_context():
    db.create_all()

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=8000)
