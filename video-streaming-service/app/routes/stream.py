from fastapi import APIRouter, HTTPException
import boto3

router = APIRouter()

CLOUDFRONT_DOMAIN = "https://d2ovbhychdxdcx.cloudfront.net"


dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("mindflix-videos")

@router.get("/{video_id}")
def get_stream(video_id: str):
    """
    Retrieve CloudFront URL for a video and its metadata.
    """

    response = table.get_item(Key={"video_id": video_id})
    if "Item" not in response:
        raise HTTPException(status_code=404, detail="Video not found")


    video_url = f"{CLOUDFRONT_DOMAIN}/{video_id}.m3u8"

    return {
        "stream_url": video_url,
        "metadata": response["Item"]
    }
