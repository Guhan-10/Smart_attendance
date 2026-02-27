from pydantic import BaseModel
from typing import Optional


class LoginRequest(BaseModel):
<<<<<<< HEAD
    role: Optional[str] = None
=======
    role: str
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
    identifier: str
    password: str


class SignupRequest(BaseModel):
    name: str
    role: str
    identifier: str
    password: str
    profileData: Optional[dict] = {}  # <--- Added this line
