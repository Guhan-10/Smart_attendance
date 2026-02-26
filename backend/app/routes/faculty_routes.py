from fastapi import APIRouter, HTTPException
from app.models.faculty_model import ClassSetup
from app.config.settings import classes_collection

router = APIRouter()


@router.post("/classes")
async def create_class(class_data: ClassSetup):
    """Saves a new class setup to MongoDB"""
    try:
        document = class_data.model_dump()
        result = classes_collection.insert_one(document)

        # Return the saved data with the MongoDB string ID so React can use it as a 'key'
        document["id"] = str(result.inserted_id)
        del document["_id"]  # Remove the raw Mongo ObjectId object

        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/classes")
async def get_classes():
    """Fetches all configured classes from MongoDB"""
    try:
        classes = list(classes_collection.find())

        # Convert MongoDB ObjectIds to strings for React
        for cls in classes:
            cls["id"] = str(cls.pop("_id"))

        return classes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
