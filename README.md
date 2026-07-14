<div align="center">

# 🎓 Smart Attendance

**AI-powered face-recognition attendance system with role-based dashboards**

[![Deploy to GitHub Pages](https://github.com/Guhan-10/Smart_attendance/actions/workflows/deploy.yml/badge.svg)](https://github.com/Guhan-10/Smart_attendance/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Motor-47A248?logo=mongodb)

**[🚀 Live Demo →](https://guhan-10.github.io/Smart_attendance/)**

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **Face Recognition** | Real-time AI-powered attendance marking via webcam |
| 👨‍🎓 **Student Portal** | View daily & consolidated attendance, apply for leave |
| 👩‍🏫 **Faculty Portal** | Launch live sessions, mark students present/absent |
| 🧑‍💼 **Advisor Portal** | Class overview, leave approvals/rejections |
| 🔐 **JWT Auth** | Secure role-based login and signup |
| 📊 **Reports** | Consolidated attendance reports with percentage tracking |

---

## 🏗️ Architecture

```
Browser (React + Vite)  ──── HTTP/REST ──── FastAPI Backend
         │                                        │
   HashRouter                              MongoDB (Motor)
  (GH Pages)                          + Face Recognition
```

> See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for full system architecture, project structure, and data flow.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- MongoDB (local or Atlas)

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirement.txt

# Start FastAPI server
cd backend
uvicorn main:app --reload --port 8000
```

---

## 📁 Project Structure

```
Smart_attendance/
├── .github/workflows/deploy.yml   # CI/CD – auto deploy to GitHub Pages
├── backend/                       # FastAPI backend
│   ├── app/
│   │   ├── config/    # Settings & DB connection
│   │   ├── models/    # Pydantic models
│   │   ├── routes/    # API endpoints
│   │   ├── services/  # Face recognition, attendance logic
│   │   └── utils/     # Helpers
│   └── main.py
├── docs/                          # Architecture docs
├── src/                           # React frontend
│   ├── components/                # Reusable components
│   ├── layouts/                   # DashboardLayout, Sidebar, Topbar
│   ├── pages/                     # Route-level pages
│   └── App.jsx                    # Root + Router
├── index.html
├── vite.config.js
└── package.json
```

---

## 👥 User Roles

| Role | Entry Point | Capabilities |
|------|-------------|-------------|
| **Student** | `/#/student` | View attendance calendar, consolidated report, apply leave |
| **Faculty** | `/#/faculty` | Start live face-recognition sessions |
| **Advisor** | `/#/advisor` | Class overview, approve/reject leave applications |

---

## 🌐 Deployment

### GitHub Pages (Frontend)

The frontend is automatically deployed via GitHub Actions on every push to `main`.

**Manual Setup (once):**
1. Go to **Settings → Pages**
2. Set source to **Deploy from branch → `gh-pages`**
3. Push to `main` — the workflow handles the rest ✅

Live at: `https://guhan-10.github.io/Smart_attendance/`

### Backend

Deploy the FastAPI backend separately on:
- [Render](https://render.com) (free tier)
- [Railway](https://railway.app)
- Any VPS / cloud VM

Update the backend API URL in frontend services after deployment.

---

## 🛠️ Tech Stack

**Frontend:** React 19, Vite 7, React Router v7, Lucide React, Vanilla CSS  
**Backend:** FastAPI, Motor (async MongoDB), OpenCV, face_recognition  
**CI/CD:** GitHub Actions → GitHub Pages

---

## 📄 License

MIT © [Guhan-10](https://github.com/Guhan-10)
