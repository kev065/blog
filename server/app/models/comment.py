from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime


class Comment(Base):
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, index=True)
    post_id = Column(Integer, ForeignKey("post.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    post = relationship("Post", back_populates="comments")
    user = relationship("User", back_populates="comments")
