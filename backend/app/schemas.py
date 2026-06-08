from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class TimestampMixin(BaseModel):
    created_at: int # WatermelonDB uses unix timestamps
    updated_at: int
    deleted_at: Optional[int] = None

class HabitLogBase(BaseModel):
    id: str
    habit_id: int
    log_date: int # Storing date as timestamp or YYYY-MM-DD
    current_value: int
    is_completed: bool

class HabitLog(HabitLogBase, TimestampMixin):
    pass

class TaskBase(BaseModel):
    id: str
    title: str
    is_completed: bool
    due_date: Optional[int] = None
    reminder_minutes_before: Optional[int] = None

class Task(TaskBase, TimestampMixin):
    pass

class JournalEntryBase(BaseModel):
    id: str
    content: str
    entry_date: int

class JournalEntry(JournalEntryBase, TimestampMixin):
    pass

# WatermelonDB Sync Payload Schemas
class TableChanges(BaseModel):
    created: List[Dict[str, Any]]
    updated: List[Dict[str, Any]]
    deleted: List[str] # List of IDs

class SyncChanges(BaseModel):
    habits: Optional[TableChanges] = None
    habit_logs: Optional[TableChanges] = None
    tasks: Optional[TableChanges] = None
    journal_entries: Optional[TableChanges] = None

class SyncPushRequest(BaseModel):
    changes: SyncChanges
    lastPulledAt: int

class SyncPullResponse(BaseModel):
    changes: SyncChanges
    timestamp: int
