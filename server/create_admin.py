
import asyncio
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.services.user_service import user_service
from app.schemas.user import UserCreate
from app.core.config import settings
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "adminpassword"

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
        user = await user_service.get_user_by_email(db, email=ADMIN_EMAIL)
        if user:
            print(f"User with email '{ADMIN_EMAIL}' already exists.")
            return

        admin_user = UserCreate(email=ADMIN_EMAIL, password=ADMIN_PASSWORD)
        user_service.create_user(db=db, user=admin_user)
        print(f"Successfully created admin user with email: {ADMIN_EMAIL}")

    finally:
        db.close()

async def main():
    """
    Main function to initialize db, cache and create admin user.
    """
    redis = aioredis.from_url(f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    init_db()
    await create_admin_user()

if __name__ == "__main__":
    asyncio.run(main())
