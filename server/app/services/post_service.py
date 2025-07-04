from sqlalchemy.orm import Session
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate
from app.utils.html_sanitizer import sanitize_html
from fastapi_cache.decorator import cache
from app.utils.cache_key_builder import post_key_builder, posts_key_builder

class PostService:
    @cache(expire=60, key_builder=post_key_builder)
    def get_post(self, db: Session, post_id: int):
        return db.query(Post).filter(Post.id == post_id).first()

    @cache(expire=60, key_builder=posts_key_builder)
    def get_posts(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Post).offset(skip).limit(limit).all()

    def create_post(self, db: Session, post: PostCreate, owner_id: int = 1):
        sanitized_content = sanitize_html(post.content)
        db_post = Post(title=post.title, content=sanitized_content, owner_id=owner_id)
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post

    def update_post(self, db: Session, post_id: int, post: PostUpdate):
        db_post = self.get_post(db, post_id)
        if db_post:
            sanitized_content = sanitize_html(post.content)
            db_post.title = post.title
            db_post.content = sanitized_content
            db.commit()
            db.refresh(db_post)
        return db_post

    def delete_post(self, db: Session, post_id: int):
        db_post = self.get_post(db, post_id)
        if db_post:
            db.delete(db_post)
            db.commit()
        return db_post

post_service = PostService()
