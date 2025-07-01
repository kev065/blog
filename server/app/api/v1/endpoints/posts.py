from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.post import PostCreate, PostUpdate, Post
from app.services.post_service import post_service
from app.services.auth_service import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=Post)
def create_post(post: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return post_service.create_post(db=db, post=post)

@router.get("/", response_model=list[Post])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return post_service.get_posts(db, skip=skip, limit=limit)

@router.get("/{post_id}", response_model=Post)
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = post_service.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@router.put("/{post_id}", response_model=Post)
def update_post(post_id: int, post: PostUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return post_service.update_post(db=db, post_id=post_id, post=post)

@router.delete("/{post_id}", response_model=Post)
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return post_service.delete_post(db=db, post_id=post_id)
