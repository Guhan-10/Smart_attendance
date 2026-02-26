from pydantic import BaseModel
from typing import Optional


class LoginRequest(BaseModel):
    role: str
    identifier: str
    password: str


class SignupRequest(BaseModel):
    name: str
    role: str
    identifier: str
    password: str
    profileData: Optional[dict] = {}  # <--- Added this line
