from pymongo import MongoClient
import certifi

MONGO_URI = "mongodb+srv://harish_rahul:YdEVwK3FUGE7gUUR@cluster0.ew5ipsn.mongodb.net/?appName=Cluster0"

try:
    # certifi fixes the SSL handshake error!
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client["smart_attendance"]
    attendance_collection = db["attendance_logs"]
    leaves_collection = db["leave_applications"]
    classes_collection = db["classes"]
    users_collection = db["users"]

    print("✅ Connected to MongoDB Atlas!")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
