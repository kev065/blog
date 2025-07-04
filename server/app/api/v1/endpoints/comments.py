from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.comment_service import comment_service
from app.schemas.comment import Comment, CommentCreate, CommentUpdate
from app.api.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/posts/{post_id}/comments", response_model=Comment)
def create_comment_for_post(
    post_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return comment_service.create_comment(
        db=db, post_id=post_id, user_id=current_user.id, comment=comment
    )

@router.get("/posts/{post_id}/comments", response_model=list[Comment])
async def read_comments_for_post(
    post_id: int, db: Session = Depends(get_db), skip: int = 0, limit: int = 10
):
    return await comment_service.get_comments_for_post(db, post_id=post_id, skip=skip, limit=limit)

@router.put("/comments/{comment_id}", response_model=Comment)
async def update_comment(
    comment_id: int,
    comment: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_comment = await comment_service.get_comment(db, comment_id)
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return comment_service.update_comment(db=db, comment_id=comment_id, comment=comment)

@router.delete("/comments/{comment_id}", response_model=Comment)
async def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_comment = await comment_service.get_comment(db, comment_id)
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return comment_service.delete_comment(db=db, comment_id=comment_id)