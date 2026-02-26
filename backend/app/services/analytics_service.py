from datetime import datetime
from app.config.settings import attendance_collection


def get_dashboard_analytics():
    """Calculates attendance stats based on existing database logs."""

    # 1. Find all unique dates the camera was run (Total Working Days)
    unique_dates = attendance_collection.distinct("date")
    total_working_days = len(unique_dates) if len(
        unique_dates) > 0 else 1  # Avoid divide by zero

    today_string = datetime.now().strftime("%Y-%m-%d")

    # 2. Get the count of how many times each student was marked present
    pipeline = [
        {"$group": {"_id": "$name", "days_present": {"$sum": 1}}}
    ]
    student_logs = list(attendance_collection.aggregate(pipeline))

    # 3. Calculate percentages
    students_data = []
    below_threshold_count = 0
    total_percentage_sum = 0

    # Figure out who was present today to calculate absentees
    present_today_cursor = attendance_collection.find({"date": today_string})
    present_today_names = [doc["name"] for doc in present_today_cursor]

    for student in student_logs:
        name = student["_id"]
        days_present = student["days_present"]

        # Calculate percentage (capped at 100%)
        percentage = min(
            round((days_present / total_working_days) * 100, 1), 100)
        total_percentage_sum += percentage

        if percentage < 75.0:
            below_threshold_count += 1
            status = "Danger"
        else:
            status = "Safe"

        students_data.append({
            "name": name,
            "days_present": days_present,
            "percentage": percentage,
            "status": status
        })

    # Sort students alphabetically
    students_data.sort(key=lambda x: x["name"])

    # 4. Calculate Master Stats
    total_students = len(students_data)
    class_average = round(total_percentage_sum /
                          total_students, 1) if total_students > 0 else 0
    today_absentees = total_students - len(present_today_names)

    return {
        "stats": {
            "totalStrength": total_students,
            "classAverage": class_average,
            "belowThreshold": below_threshold_count,
            # Prevent negative numbers
            "todayAbsentees": max(today_absentees, 0),
            "todayDate": today_string
        },
        "students": students_data
    }
