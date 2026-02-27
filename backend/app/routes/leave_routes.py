from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId  # <--- Required to search MongoDB by ID
from app.models.leave_model import LeaveModel
from app.config.settings import leaves_collection

router = APIRouter()

# 1. Pydantic model just for the status update


class StatusUpdate(BaseModel):
    status: str


@router.post("/apply")
async def submit_leave(leave_data: LeaveModel):
    try:
        document = leave_data.model_dump()
        result = leaves_collection.insert_one(document)
        document["id"] = str(result.inserted_id)
        del document["_id"]
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. NEW: Fetch ALL leaves for the Advisor Dashboard
# (Must be placed BEFORE the /{student_name} route so FastAPI doesn't confuse the word "all" for a student's name!)


@router.get("/all")
async def get_all_leaves():
    try:
        leaves = list(leaves_collection.find().sort("_id", -1))
        for leave in leaves:
            leave["id"] = str(leave.pop("_id"))
        return leaves
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. NEW: Update the status of a specific leave request


@router.patch("/{leave_id}/status")
async def update_leave_status(leave_id: str, status_update: StatusUpdate):
    try:
        result = leaves_collection.update_one(
            {"_id": ObjectId(leave_id)},  # Find the exact document
            {"$set": {"status": status_update.status}}  # Update just the status
        )

        if result.modified_count == 1:
            return {"message": "Status updated successfully"}
        else:
            raise HTTPException(
                status_code=404, detail="Leave request not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{student_name}")
async def get_student_leaves(student_name: str):
    try:
        leaves = list(leaves_collection.find(
            {"student_name": student_name}).sort("_id", -1))
        for leave in leaves:
            leave["id"] = str(leave.pop("_id"))
        return leaves
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
