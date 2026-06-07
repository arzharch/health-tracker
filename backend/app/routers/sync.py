from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import SyncPushRequest, SyncPullResponse
from app.auth import get_current_user
from app.database import supabase
from datetime import datetime, timezone
from app.gamification import GamificationEngine

router = APIRouter(prefix="/sync", tags=["sync"])

@router.get("/pull", response_model=SyncPullResponse)
def pull_changes(lastPulledAt: int, user_id: str = Depends(get_current_user)):
    # Calculate server time in ms
    server_time = int(datetime.now(timezone.utc).timestamp() * 1000)
    
    # Normally here we query the database for all records WHERE updated_at > lastPulledAt AND user_id = user_id
    # For now, returning empty to satisfy WatermelonDB
    return {
        "changes": {
            "habit_logs": {"created": [], "updated": [], "deleted": []},
            "tasks": {"created": [], "updated": [], "deleted": []},
            "journal_entries": {"created": [], "updated": [], "deleted": []},
        },
        "timestamp": server_time
    }

@router.post("/push")
def push_changes(payload: SyncPushRequest, user_id: str = Depends(get_current_user)):
    current_time_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
    tolerance_ms = 5 * 60 * 1000 # 5 minutes future tolerance
    
    changes = payload.changes
    
    # 1. TIME SPOOFING GUARD
    # Validate that none of the timestamps in the payload are further in the future than current_time + tolerance
    def validate_timestamps(records):
        for record in records:
            if record.get("created_at", 0) > current_time_ms + tolerance_ms:
                raise HTTPException(status_code=400, detail="Time-spoofing detected: Future timestamp")
            if record.get("updated_at", 0) > current_time_ms + tolerance_ms:
                raise HTTPException(status_code=400, detail="Time-spoofing detected: Future timestamp")
                
    if changes.habit_logs:
        validate_timestamps(changes.habit_logs.created)
        validate_timestamps(changes.habit_logs.updated)
    
    # 2. SAVE TO DATABASE (Supabase RPC or direct inserts)
    # Using Supabase python client to upsert data...
    
    # 3. TRIGGER GAMIFICATION ENGINE
    # After saving habit logs, we check if 8/8 habits are completed for a day, and run the Gamification Engine
    # gamification = GamificationEngine.calculate_streak(...)
    # supabase.table('profiles').update({'current_streak': gamification[0]}).eq('id', user_id).execute()

    return {"success": True}
