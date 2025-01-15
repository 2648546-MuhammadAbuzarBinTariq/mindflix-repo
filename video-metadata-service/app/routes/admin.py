from fastapi import APIRouter, UploadFile, Form, HTTPException, Depends
import boto3
import uuid

router = APIRouter()

# Initialize AWS clients
s3 = boto3.client("s3", region_name="us-east-1")
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
video_table = dynamodb.Table("mindflix-videos")
user_table = dynamodb.Table("mindflix-users")
BUCKET_NAME = "mymindflix-videos"

def verify_admin(username: str):
    """
    Verify if the user is an admin.
    """
    user = user_table.get_item(Key={"username": username})
    if "Item" not in user or user["Item"].get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied: Admins only")

@router.post("/upload")
def admin_upload(
    file: UploadFile,
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    username: str = Form(..., alias="username")  # Get the username from the request form
):
    """
    Admin uploads a video and its metadata.
    """
    # Verify if the user is an admin
    verify_admin(username)

    video_id = str(uuid.uuid4())

    # Upload video to S3
    s3.upload_fileobj(
        file.file,
        BUCKET_NAME,
        f"raw/{video_id}.mp4",
        ExtraArgs={"ContentType": file.content_type}
    )

    # Store metadata in DynamoDB
    metadata = {
        "video_id": video_id,
        "title": title,
        "category": category,
        "description": description,
        "video_url": f"https://{BUCKET_NAME}.s3.amazonaws.com/processed/{video_id}.m3u8"
    }
    video_table.put_item(Item=metadata)

    return {"message": "Video uploaded successfully", "video_id": video_id}
