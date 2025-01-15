from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.stream import router as stream_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

@app.get("/")
def root():
    return {"message": "Welcome to the Video Streaming Service!"}

app.include_router(stream_router, prefix="/stream")
