from app.config.settings import attendance_collection

# --- FUNCTION 1: Used by the Consolidated Class Report ---


def generate_consolidated_report(start_date: str, end_date: str):
    """Fetches attendance between two dates and calculates percentages per student."""
    date_query = {"date": {"$gte": start_date, "$lte": end_date}}

    unique_dates = attendance_collection.distinct("date", date_query)
    total_conducted = len(unique_dates) if len(unique_dates) > 0 else 1

    pipeline = [
        {"$match": date_query},
        {"$group": {"_id": "$name", "attended": {"$sum": 1}}}
    ]

    results = attendance_collection.aggregate(pipeline)

    report_data = []
    for res in results:
        attended = res["attended"]
        percentage = round((attended / total_conducted) * 100, 2)

        report_data.append({
            "name": res["_id"],
            "conducted": total_conducted,
            "attended": attended,
            "percentage": percentage
        })

    report_data.sort(key=lambda x: x["name"])
    return {"total_conducted": total_conducted, "data": report_data}


# --- FUNCTION 2: Used by the Daily 8-Hour Grid ---
def get_daily_student_grid(student_name: str, start_date: str, end_date: str):
    """Fetches a specific student's attendance and maps it to an 8-hour daily grid."""
    date_query = {"date": {"$gte": start_date, "$lte": end_date}}
    active_dates = attendance_collection.distinct("date", date_query)
    active_dates.sort()

    student_logs = list(attendance_collection.find({
        "name": {"$regex": f"^{student_name}$", "$options": "i"},
        "date": {"$gte": start_date, "$lte": end_date}
    }))

    student_present_dates = [log["date"] for log in student_logs]

    report_data = []
    for current_date in active_dates:
        formatted_date = "-".join(current_date.split("-")[::-1])
        is_present = current_date in student_present_dates

        hours = ['P'] * 8 if is_present else ['A'] * 8

        report_data.append({
            "dateStr": formatted_date,
            "isHoliday": False,
            "holidayName": "",
            "hours": hours
        })

    return {"student": student_name, "data": report_data}
