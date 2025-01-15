from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import boto3
from passlib.hash import bcrypt

router = APIRouter()

# Define Pydantic models for request bodies
class SignupRequest(BaseModel):
    username: str
    name: str
    email: str
    password: str
    role: str = "user"

class LoginRequest(BaseModel):
    username: str
    password: str

class AddToFavouritesRequest(BaseModel):
    username: str
    video: dict  # Video object with video_id, title, etc.

# Initialize DynamoDB
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("mindflix-users")

@router.post("/signup")
def signup(request: SignupRequest):
    """
    Signup endpoint for registering new users.
    """
    # Check if the user already exists
    existing_user = table.get_item(Key={"username": request.username})
    if "Item" in existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash the password
    hashed_password = bcrypt.hash(request.password)

    # Store the user in DynamoDB
    table.put_item(
        Item={
            "username": request.username,
            "name": request.name,
            "email": request.email,
            "password": hashed_password,
            "role": request.role,
            "favourites": [],  # Initialize an empty favourites list
        }
    )
    return {"message": "Signup successful"}

@router.post("/login")
def login(request: LoginRequest):
    """
    Login endpoint for authenticating users.
    """
    # Fetch the user from DynamoDB
    user = table.get_item(Key={"username": request.username})
    if "Item" not in user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Verify the password
    if not bcrypt.verify(request.password, user["Item"]["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful", "username": request.username, "role": user["Item"]["role"]}

@router.post("/add-to-favourites")
def add_to_favourites(request: AddToFavouritesRequest):
    """
    Add a video to the user's favourites collection.
    """
    # Fetch the user from DynamoDB
    user = table.get_item(Key={"username": request.username})
    if "Item" not in user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if the video is already in favourites
    favourites = user["Item"].get("favourites", [])
    if any(fav["video_id"] == request.video["video_id"] for fav in favourites):
        raise HTTPException(status_code=400, detail="Video already in favourites")

    # Add the video to favourites
    favourites.append(request.video)
    table.update_item(
        Key={"username": request.username},
        UpdateExpression="SET favourites = :f",
        ExpressionAttributeValues={":f": favourites}
    )
    return {"message": "Video added to favourites"}

@router.get("/favourites/{username}")
def get_favourites(username: str):
    """
    Retrieve the user's favourites collection.
    """
    # Fetch the user from DynamoDB
    user = table.get_item(Key={"username": username})
    if "Item" not in user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"favourites": user["Item"].get("favourites", [])}

@router.get("/profile/{username}")
def get_profile(username: str):
    # This route should be removed now that the profile service is handling it.
    pass
