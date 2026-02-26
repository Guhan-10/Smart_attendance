from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import attendance_routes, advisor_routes
from app.routes import faculty_routes
from app.routes import leave_routes
from app.routes import auth_routes
from app.routes import student_routes

app = FastAPI(title="Syncedu Attendance API")

# This allows your friend's React app to talk to your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows connections from any IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach the routes we just built
app.include_router(attendance_routes.router,
                   prefix="/attendance", tags=["Attendance"])
app.include_router(advisor_routes.router, prefix="/advisor",
                   tags=["Advisor Dashboard"])
app.include_router(faculty_routes.router, prefix="/faculty",
                   tags=["Faculty"])
app.include_router(leave_routes.router, prefix="/leave",
                   tags=["Leave Management"])
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(student_routes.router, prefix="/student",
                   tags=["Student Dashboard"])


@app.get("/")
def read_root():
    return {"message": "Syncedu Backend is up and running!"}
