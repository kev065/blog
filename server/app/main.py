from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api_router import api_router

def include_router(app):
    app.include_router(api_router, prefix="/api/v1")

def start_application():
    app = FastAPI(title="Blog API", version="1.0.0")
    
    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],  
        allow_headers=["*"], 
    )
    
    include_router(app)
    return app

app = start_application()

@app.get("/")
def home():
    return {"message": "Welcome to the Blog API"}
