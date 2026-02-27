from fastapi import APIRouter, UploadFile, File, HTTPException, Query
import os
import shutil

# --- THE CORRECTED IMPORTS ---
from app.services.face_services import recognize_multiple_faces
from app.services.attendance_service import mark_attendance
from app.services.report_service import generate_consolidated_report, get_daily_student_grid

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))
TEMP_DIR = os.path.join(BASE_DIR, "data", "temp")

os.makedirs(TEMP_DIR, exist_ok=True)


@router.post("/mark")
async def mark_student_attendance(file: UploadFile = File(...)):
    try:
        temp_path = os.path.join(TEMP_DIR, "react_upload.jpg")
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1. Get a LIST of all recognized names
        recognized_names = recognize_multiple_faces(temp_path)

        if not recognized_names:
            return {"status": "failed", "message": "No recognized faces found."}

        # 2. Loop through the list and log each person to MongoDB
        for name in recognized_names:
            mark_attendance(name)

        # 3. Send the entire list back to React
        return {
            "status": "success",
            "message": f"Successfully recognized {len(recognized_names)} student(s)!",
            "student_names": recognized_names
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/report")
async def get_attendance_report(start_date: str = Query(...), end_date: str = Query(...)):
    """API Endpoint for the Consolidated Report React Component"""
    try:
        data = generate_consolidated_report(start_date, end_date)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/daily")
async def fetch_daily_grid(student_name: str = Query(...), start_date: str = Query(...), end_date: str = Query(...)):
    """API Endpoint for the 8-Hour Daily Attendance Grid"""
    try:
        data = get_daily_student_grid(student_name, start_date, end_date)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
