from fastapi import APIRouter, HTTPException
import boto3

router = APIRouter()

# Initialize DynamoDB
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("mindflix-users")

@router.get("/{username}")
def get_profile(username: str):
    """
    Retrieve the profile information of a user.
    """
    # Fetch user from DynamoDB
    user = table.get_item(Key={"username": username})
    if "Item" not in user:
        raise HTTPException(status_code=404, detail="User not found")

    # Exclude sensitive data like password
    profile = user["Item"]
    profile.pop("password", None)
    return profile
