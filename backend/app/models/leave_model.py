from pydantic import BaseModel
from typing import Optional


class LeaveModel(BaseModel):
    student_name: str
    leave_type: str
    day_type: str
    from_date: str
    to_date: str
    reason: str
    description: Optional[str] = ""
    status: str = "Pending"
