
import asyncio
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.services.user_service import user_service
from app.schemas.user import UserCreate

# --- Configuration ---
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "adminpassword"
# -------------------

def init_db():
    """Initializes the database and creates tables."""
    print("Initializing database...")
    Base.metadata.create_all(bind=engine)
    print("Database initialized.")

async def create_admin_user():
    """
    Creates an admin user in the database.
    """
    print("Attempting to create admin user...")
    db = SessionLocal()
    try:
        user = user_service.get_user_by_email(db, email=ADMIN_EMAIL)
        if user:
            print(f"User with email '{ADMIN_EMAIL}' already exists.")
            return

        admin_user = UserCreate(email=ADMIN_EMAIL, password=ADMIN_PASSWORD)
        user_service.create_user(db=db, user=admin_user)
        print(f"Successfully created admin user with email: {ADMIN_EMAIL}")

    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    asyncio.run(create_admin_user())
