from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.config.settings import attendance_collection, leaves_collection

router = APIRouter()


@router.get("/{student_name}/dashboard")
async def get_student_dashboard(student_name: str):
    try:
        # 1. Calculate Attendance
        total_working_days = len(attendance_collection.distinct("date"))
        if total_working_days == 0:
            total_working_days = 1  # Prevent division by zero

        days_attended = attendance_collection.count_documents({
            "name": {"$regex": f"^{student_name}$", "$options": "i"}
        })

        overall_percentage = round(
            (days_attended / total_working_days) * 100, 1)

        # 2. Calculate Leaves
        leaves_approved = leaves_collection.count_documents({
            "student_name": {"$regex": f"^{student_name}$", "$options": "i"},
            "status": "Approved"
        })

        leaves_pending = leaves_collection.count_documents({
            "student_name": {"$regex": f"^{student_name}$", "$options": "i"},
            "status": "Pending"
        })

        # 3. Today's Status
        today_string = datetime.now().strftime("%Y-%m-%d")
        present_today = attendance_collection.find_one({
            "name": {"$regex": f"^{student_name}$", "$options": "i"},
            "date": today_string
        }) is not None

        # Standard CS schedule mapping based on today's AI scan
        base_status = "Present" if present_today else "Absent"

        today_classes = [
            {"time": '09:00 AM', "subject": 'Data Structures', "status": base_status},
            {"time": '10:00 AM', "subject": 'Machine Learning', "status": base_status},
            {"time": '11:15 AM', "subject": 'Computer Networks', "status": 'Upcoming'},
            {"time": '01:00 PM', "subject": 'Python Programming', "status": 'Upcoming'},
        ]

        return {
            "overallAttendance": min(overall_percentage, 100),
            "totalClasses": total_working_days,
            "classesAttended": days_attended,
            "leavesTaken": leaves_approved,
            "pendingLeaves": leaves_pending,
            "todayClasses": today_classes
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
