from fastapi import APIRouter, Depends, HTTPException
from app.schemas import SyncPushRequest, SyncPullResponse

router = APIRouter(prefix="/sync", tags=["sync"])

@router.get("/pull", response_model=SyncPullResponse)
def pull_changes(lastPulledAt: int):
    # TODO: Fetch changes from Supabase where updated_at > lastPulledAt
    return {
        "changes": {},
        "timestamp": 0
    }

@router.post("/push")
def push_changes(payload: SyncPushRequest):
    # TODO: Process payload.changes, apply time-spoofing validation, and save to Supabase
    return {"success": True}
