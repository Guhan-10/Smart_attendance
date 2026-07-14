# Smart Attendance – Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                 │
│                                                     │
│   React 19 + Vite + React Router (HashRouter)       │
│                                                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│   │ Student  │  │ Faculty  │  │     Advisor       │ │
│   │Dashboard │  │Dashboard │  │    Dashboard      │ │
│   └──────────┘  └──────────┘  └──────────────────┘ │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │            DashboardLayout (Sidebar+Topbar) │   │
│   └─────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────┘
                         │ HTTP/REST (fetch)
┌────────────────────────▼────────────────────────────┐
│                   BACKEND (FastAPI)                 │
│                                                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│   │   Auth   │  │Attendance│  │   Face Recog.     │ │
│   │  Routes  │  │  Routes  │  │    Service        │ │
│   └──────────┘  └──────────┘  └──────────────────┘ │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │              MongoDB (via Motor)            │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Routing | React Router v7 (HashRouter) |
| Icons | Lucide React |
| Styling | Vanilla CSS |
| Hosting | GitHub Pages (static) |

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | FastAPI (Python) |
| Database | MongoDB (Motor async driver) |
| Auth | JWT / Session-based |
| Face Recognition | OpenCV / face_recognition |
| Hosting | (Deploy separately – Render/Railway) |

## Project Structure

```
Smart_attendance/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD – auto deploys frontend to GH Pages
├── backend/
│   ├── app/
│   │   ├── config/             # DB connection, env settings
│   │   ├── models/             # Pydantic models
│   │   ├── routes/             # FastAPI routers
│   │   ├── services/           # Business logic (face recog, attendance)
│   │   └── utils/              # Helpers
│   ├── data/                   # Local data (face encodings, etc.)
│   └── main.py                 # FastAPI entry point
├── docs/
│   └── ARCHITECTURE.md         # This file
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, fonts
│   ├── components/             # Reusable UI components
│   │   ├── ProgressRing.jsx
│   │   └── UI.jsx
│   ├── layouts/                # Page shells
│   │   ├── DashboardLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── pages/                  # Route-level page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── DailyAttendance.jsx
│   │   ├── ConsolidatedReport.jsx
│   │   ├── LeaveApplication.jsx
│   │   ├── AdvisorDashboard.jsx
│   │   ├── LeaveApprovals.jsx
│   │   ├── FacultyDashboard.jsx
│   │   └── LiveSession.jsx
│   ├── App.jsx                 # Root component + router
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.js
├── requirement.txt             # Python deps for backend
└── README.md
```

## User Roles

| Role | Routes | Capabilities |
|------|--------|-------------|
| **Student** | `/#/student/*` | View attendance, apply leave, view reports |
| **Faculty** | `/#/faculty/*` | Start live sessions, mark attendance |
| **Advisor** | `/#/advisor/*` | Approve/reject leaves, view class overview |

## Authentication Flow

1. User navigates to `/#/` → `Login.jsx`
2. Credentials sent to FastAPI `/auth/login`
3. JWT token + user data stored in `localStorage` as `syncedu_user`
4. App reads role from `localStorage` and redirects to the appropriate dashboard
5. Logout clears `localStorage` and redirects to `/#/`
