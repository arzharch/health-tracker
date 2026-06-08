from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import SyncPushRequest, SyncPullResponse
from app.auth import get_current_user
from app.database import supabase
from datetime import datetime, timezone
import logging

router = APIRouter(prefix="/sync", tags=["sync"])

def to_unix_ms(dt_str: str) -> int:
    if not dt_str: return 0
    try:
        dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        return int(dt.timestamp() * 1000)
    except:
        return 0

def to_iso_str(unix_ms: int) -> str:
    if not unix_ms: return None
    dt = datetime.fromtimestamp(unix_ms / 1000.0, tz=timezone.utc)
    return dt.isoformat()

def get_changes(table: str, user_id: str, last_pulled_at_iso: str):
    if last_pulled_at_iso:
        res = supabase.table(table).select('*').eq('user_id', user_id).gt('updated_at', last_pulled_at_iso).execute()
    else:
        res = supabase.table(table).select('*').eq('user_id', user_id).is_('deleted_at', 'null').execute()
        
    records = res.data

    created = []
    updated = []
    deleted = []

    for r in records:
        w_record = dict(r)
        
        # Remove user_id from payload sent to client (optional, but good practice)
        if 'user_id' in w_record: del w_record['user_id']
        
        # Convert ISO to unix ms
        if 'created_at' in w_record: w_record['created_at'] = to_unix_ms(w_record['created_at'])
        if 'updated_at' in w_record: w_record['updated_at'] = to_unix_ms(w_record['updated_at'])
        if 'deleted_at' in w_record and w_record['deleted_at']: w_record['deleted_at'] = to_unix_ms(w_record['deleted_at'])
        
        # Handle specific field naming mismatches
        if table == 'habit_logs':
            if 'log_date' in w_record: w_record['log_date'] = to_unix_ms(w_record['log_date'] + "T00:00:00Z")
            if 'habit_id' in w_record: w_record['habit_id'] = str(w_record['habit_id'])
        if table == 'tasks':
            if 'due_date' in w_record and w_record['due_date']: w_record['due_date'] = to_unix_ms(w_record['due_date'])
        if table == 'journal_entries':
            if 'entry_date' in w_record: w_record['entry_date'] = to_unix_ms(w_record['entry_date'] + "T00:00:00Z")

        if r.get('deleted_at'):
            deleted.append(r['id'])
        elif last_pulled_at_iso and r.get('created_at') <= last_pulled_at_iso:
            updated.append(w_record)
        else:
            created.append(w_record)

    return {"created": created, "updated": updated, "deleted": deleted}

@router.get("/pull", response_model=SyncPullResponse)
def pull_changes(lastPulledAt: int, user_id: str = Depends(get_current_user)):
    server_time = int(datetime.now(timezone.utc).timestamp() * 1000)
    last_pulled_at_iso = to_iso_str(lastPulledAt) if lastPulledAt > 0 else None
    
    # We also pull habits because the user needs the list of habits locally
    habits_res = supabase.table('habits').select('*').execute()
    habits_created = []
    if lastPulledAt == 0:
        for r in habits_res.data:
            w_record = dict(r)
            if 'id' in w_record: w_record['id'] = str(w_record['id']) # WDB needs string IDs
            habits_created.append(w_record)
    
    habit_logs_changes = get_changes('habit_logs', user_id, last_pulled_at_iso)
    tasks_changes = get_changes('tasks', user_id, last_pulled_at_iso)
    journal_entries_changes = get_changes('journal_entries', user_id, last_pulled_at_iso)
    
    return {
        "changes": {
            "habits": {"created": habits_created, "updated": [], "deleted": []},
            "habit_logs": habit_logs_changes,
            "tasks": tasks_changes,
            "journal_entries": journal_entries_changes,
        },
        "timestamp": server_time
    }

def apply_changes(table: str, user_id: str, changes, current_time_iso: str):
    if not changes: return
    
    def process_record(record):
        r = dict(record)
        r['user_id'] = user_id
        if 'created_at' in r: r['created_at'] = to_iso_str(r['created_at'])
        if 'updated_at' in r: r['updated_at'] = to_iso_str(r['updated_at'])
        
        if table == 'habit_logs':
            if 'log_date' in r: r['log_date'] = to_iso_str(r['log_date']).split('T')[0]
            if 'habit_id' in r: r['habit_id'] = int(r['habit_id'])
        if table == 'tasks':
            if 'due_date' in r and r['due_date']: r['due_date'] = to_iso_str(r['due_date'])
        if table == 'journal_entries':
            if 'entry_date' in r: r['entry_date'] = to_iso_str(r['entry_date']).split('T')[0]
        return r

    # Upsert created and updated records
    upsert_data = []
    for record in getattr(changes, 'created', []) + getattr(changes, 'updated', []):
        upsert_data.append(process_record(record))
        
    if upsert_data:
        try:
            supabase.table(table).upsert(upsert_data).execute()
        except Exception as e:
            logging.error(f"Error upserting {table}: {e}")

    # Handle deleted (Soft delete)
    for id in getattr(changes, 'deleted', []):
        try:
            supabase.table(table).update({'deleted_at': current_time_iso}).eq('id', id).eq('user_id', user_id).execute()
        except Exception as e:
            logging.error(f"Error deleting {table}: {e}")

@router.post("/push")
def push_changes(payload: SyncPushRequest, user_id: str = Depends(get_current_user)):
    current_time_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
    current_time_iso = to_iso_str(current_time_ms)
    
    changes = payload.changes
    
    if getattr(changes, 'habit_logs', None):
        apply_changes('habit_logs', user_id, changes.habit_logs, current_time_iso)
        
    if getattr(changes, 'tasks', None):
        apply_changes('tasks', user_id, changes.tasks, current_time_iso)
        
    if getattr(changes, 'journal_entries', None):
        apply_changes('journal_entries', user_id, changes.journal_entries, current_time_iso)
        
    return {"success": True}
