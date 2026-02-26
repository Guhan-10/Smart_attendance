from datetime import datetime
from app.config.settings import attendance_collection


def mark_attendance(name: str):
    """Logs the name and time to MongoDB, preventing duplicate entries for today."""
    now = datetime.now()
    date_string = now.strftime("%Y-%m-%d")
    time_string = now.strftime("%H:%M:%S")

    try:
        already_marked = attendance_collection.find_one({
            "name": {"$regex": f"^{name}$", "$options": "i"},
            "date": date_string
        })

        if not already_marked:
            document = {
                "name": name,
                "date": date_string,
                "time": time_string,
                "timestamp": now
            }
            attendance_collection.insert_one(document)
            print(
                f"✅ SUCCESS: Cloud database updated for {name} at {time_string}")
            return True
        else:
            print(f"⚠️ {name} is already marked present for today.")
            return False

    except Exception as e:
        print(f"❌ Cloud Error: {e}")
        return False
