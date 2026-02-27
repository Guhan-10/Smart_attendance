from fastapi import APIRouter, HTTPException
from app.models.auth_model import LoginRequest, SignupRequest
from app.config.settings import users_collection

router = APIRouter()


@router.post("/register")
async def register_user(data: SignupRequest):
    """Creates a new user account."""
    # Check if user already exists
    existing_user = users_collection.find_one({
        "role": data.role,
        "identifier": data.identifier
    })

    if existing_user:
        raise HTTPException(
            status_code=400, detail="Account with this ID already exists.")

    # Save to MongoDB
    user_doc = data.model_dump()
    users_collection.insert_one(user_doc)

    return {"status": "success", "message": "Account created!"}


@router.post("/login")
async def login_user(data: LoginRequest):
    """Verifies credentials against MongoDB."""
    user = users_collection.find_one({
        "identifier": data.identifier,
        "password": data.password
    })

    if not user:
        raise HTTPException(
            status_code=401, detail="Invalid credentials. Please try again.")

    return {
        "status": "success",
        "name": user["name"],
        "role": user["role"],
        "identifier": user["identifier"]
    }
