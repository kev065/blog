from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.api.deps import get_db
from app.models.user import User
from app.core.config import settings
from app.services.user_service import user_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")
