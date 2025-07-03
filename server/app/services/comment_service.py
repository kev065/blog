from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentUpdate

class CommentService:
    def create_comment(self, db: Session, post_id: int, user_id: int, comment: CommentCreate) -> Comment:
        db_comment = Comment(**comment.dict(), post_id=post_id, user_id=user_id)
        db.add(db_comment)
        db.commit()
        db.refresh(db_comment)
        return db_comment

    def get_comment(self, db: Session, comment_id: int) -> Comment:
        return db.query(Comment).filter(Comment.id == comment_id).first()

    def get_comments_for_post(self, db: Session, post_id: int, skip: int = 0, limit: int = 10) -> list[Comment]:
        return db.query(Comment).filter(Comment.post_id == post_id).offset(skip).limit(limit).all()

    def update_comment(self, db: Session, comment_id: int, comment: CommentUpdate) -> Comment:
        db_comment = self.get_comment(db, comment_id)
        if db_comment:
            update_data = comment.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_comment, key, value)
            db.commit()
            db.refresh(db_comment)
        return db_comment

    def delete_comment(self, db: Session, comment_id: int) -> Comment:
        db_comment = self.get_comment(db, comment_id)
        if db_comment:
            db.delete(db_comment)
            db.commit()
        return db_comment

comment_service = CommentService()
