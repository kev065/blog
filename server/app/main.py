from fastapi import FastAPI
from app.api.v1.api_router import api_router
from app.db.session import engine
from app.db.base import Base

def create_tables():
    Base.metadata.create_all(bind=engine)

def include_router(app):
    app.include_router(api_router, prefix="/api/v1")

def start_application():
    app = FastAPI(title="Blog API", version="1.0.0")
    create_tables()
    include_router(app)
    return app

app = start_application()

@app.get("/")
def home():
    return {"message": "Welcome to the Blog API"}
