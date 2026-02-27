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
    email: Optional[str] = None
    department: Optional[str] = None
    section: Optional[str] = None
    advisorYear: Optional[str] = None
    profileData: Optional[dict] = {}  # Extra profile info
