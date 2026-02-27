from pydantic import BaseModel
from typing import Optional


class LoginRequest(BaseModel):
    role: Optional[str] = None
    identifier: str
    password: str


class SignupRequest(BaseModel):
    name: str
    role: str
    identifier: str
    password: str
    department: str = None
    profileData: Optional[dict] = {}  # <--- Added this line
