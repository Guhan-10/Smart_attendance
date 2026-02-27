from fastapi import APIRouter, HTTPException
from app.services.analytics_service import get_dashboard_analytics

router = APIRouter()


@router.get("/dashboard")
async def fetch_dashboard_data():
    try:
        data = get_dashboard_analytics()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
