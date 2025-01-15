from fastapi import APIRouter
import boto3

router = APIRouter()

# Initialize DynamoDB
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("mindflix-videos")

@router.get("/all-videos")
def get_all_videos():
    """
    Fetch all videos grouped by category.
    """
    response = table.scan()
    grouped_videos = {}
    for video in response.get("Items", []):
        category = video["category"]
        grouped_videos.setdefault(category, []).append(video)
    return grouped_videos

@router.get("/categories")
def get_categories():
    """
    Fetch unique video categories.
    """
    response = table.scan()
    categories = sorted(set(video["category"] for video in response.get("Items", [])))
    return {"categories": categories}

@router.get("/categories/{category_name}")
def get_videos_by_category(category_name: str):
    """
    Fetch videos by category.
    """
    response = table.scan(
        FilterExpression="category = :category",
        ExpressionAttributeValues={":category": category_name}
    )
    videos = response.get("Items", [])
    if not videos:
        return {"message": "No videos found in this category"}
    return {"category": category_name, "videos": videos}

@router.get("/{video_id}")
def get_video_metadata(video_id: str):
    """
    Fetch metadata for a specific video.
    """
    response = table.get_item(Key={"video_id": video_id})
    if "Item" not in response:
        return {"message": "Video not found"}
    return response["Item"]
