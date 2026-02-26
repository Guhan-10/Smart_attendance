from pydantic import BaseModel


class ClassSetup(BaseModel):
    faculty_name: str
    dept: str
    year: str
    section: str
    subject: str
