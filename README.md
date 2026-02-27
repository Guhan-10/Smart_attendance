# 🎓 Syncedu - AI-Powered Smart Attendance System

Syncedu is a modern, full-stack web application designed to automate classroom attendance using facial recognition. It provides dedicated dashboards for Students, Faculty, and Class Advisors to manage attendance, track real-time analytics, and process leave applications seamlessly.

## ✨ Features

- **🤖 AI Facial Recognition:** Uses `DeepFace` (ArcFace model + RetinaFace detector) for strict, highly accurate, multi-face detection in real-time.
- **📸 Live Camera Integration:** Captures frames directly from the browser using HTML5 Canvas and transmits them to the Python backend.
- **👨‍🏫 Role-Based Dashboards:** Secure, tailored views for Students, Faculty, and Advisors.
- **📊 Automated Analytics:** Generates daily attendance grids, consolidated subject reports, and threshold warnings dynamically.
- **📝 Leave Management:** Built-in system for students to request medical/casual leaves and for advisors to approve/reject them.
- **☁️ Cloud Database:** Completely integrated with MongoDB Atlas for persistent storage of logs, users, classes, and leave requests.

## 🛠️ Technology Stack

**Frontend:**

- React.js (User Interface)
- Tailwind CSS (Styling)
- Lucide React (Icons)
- React Router (Navigation)

**Backend:**

- FastAPI (High-performance Python API framework)
- Uvicorn (ASGI Server)
- DeepFace & TensorFlow (Facial Recognition AI)
- OpenCV (Image processing)

**Database:**

- MongoDB Atlas (Cloud NoSQL Database)
- PyMongo (Python driver)

---

## 📁 Project Structure

```text
syncedu/
│
├── frontend/                 # React UI
│   ├── src/
│   │   ├── components/       # Reusable UI cards, buttons, etc.
│   │   ├── pages/            # Dashboards, LiveSession, Login, etc.
│   │   └── App.js            # React Router setup
│   └── package.json
│
└── backend/                  # FastAPI & AI Logic
    ├── app/
    │   ├── config/           # MongoDB connection settings
    │   ├── models/           # Pydantic data validation schemas
    │   ├── routes/           # API Endpoints (auth, attendance, faculty, etc.)
    │   └── services/         # Core business logic & AI processing
    ├── data/
    │   ├── known_face/       # 📸 Reference photos of students go here!
    │   └── temp/             # Temporary folder for incoming webcam frames
    ├── main.py               # FastAPI application entry point
    └── requirements.txt      # Python dependencies
```
