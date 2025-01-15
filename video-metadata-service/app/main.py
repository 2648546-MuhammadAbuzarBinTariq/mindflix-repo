from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.metadata import router as metadata_router
from app.routes.admin import router as admin_router

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development only)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def root():
    return {"message": "Welcome to the Video Metadata Service!"}

app.include_router(metadata_router, prefix="/metadata")
app.include_router(admin_router, prefix="/admin")
