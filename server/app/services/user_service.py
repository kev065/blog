from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password
from fastapi_cache.decorator import cache
from app.utils.cache_key_builder import user_key_builder, users_key_builder, user_by_email_key_builder

class UserService:
    @cache(expire=60, key_builder=user_key_builder)
    def get_user(self, db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @cache(expire=60, key_builder=user_by_email_key_builder)
    def get_user_by_email(self, db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @cache(expire=60, key_builder=users_key_builder)
    def get_users(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(User).offset(skip).limit(limit).all()

    def create_user(self, db: Session, user: UserCreate):
        hashed_password = get_password_hash(user.password)
        db_user = User(email=user.email, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def authenticate_user(self, db: Session, email: str, password: str):
        user = self.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

user_service = UserService()
