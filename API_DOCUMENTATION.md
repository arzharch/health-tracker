# API Documentation

This project uses FastAPI to provide synchronization endpoints for WatermelonDB. 

## Base URL
`http://localhost:8000/sync` (or your production domain)

## Authentication
All endpoints require a valid Supabase JWT Bearer token in the `Authorization` header.
```
Authorization: Bearer <SUPABASE_JWT_TOKEN>
```

---

## Endpoints

### 1. `GET /sync/pull`
Fetches changes from the server that occurred after a specific timestamp.

**Query Parameters:**
- `lastPulledAt` (integer, required): Unix timestamp of the last successful pull. Pass `0` for the initial sync.

**Response (200 OK):**
```json
{
  "changes": {
    "habit_logs": {
      "created": [],
      "updated": [],
      "deleted": []
    },
    "tasks": { ... },
    "journal_entries": { ... }
  },
  "timestamp": 1717800000000
}
```

### 2. `POST /sync/push`
Pushes offline changes from the mobile device to the server. Includes strict time-spoofing validation to prevent users from manipulating their device clock to fake habit streaks.

**Body (JSON):**
```json
{
  "lastPulledAt": 1717800000000,
  "changes": {
    "habit_logs": {
      "created": [
        {
          "id": "uuid",
          "habit_id": "1",
          "log_date": 1717800000000,
          "current_value": 8,
          "is_completed": true,
          "created_at": 1717800000000,
          "updated_at": 1717800000000
        }
      ],
      "updated": [],
      "deleted": []
    }
  }
}
```

**Gamification Hook:**
When `habit_logs` are pushed, the FastAPI server evaluates if 8/8 habits were completed for the `log_date`. If so, the server's Gamification Engine calculates the new streak and freeze bank, and updates the `profiles` table directly.

**Response (200 OK):**
```json
{
  "success": true
}
```

**Errors:**
- `401 Unauthorized`: Invalid or expired JWT token.
- `400 Bad Request`: Time-spoofing detected (timestamps exceed current server UTC + 5 minutes tolerance).
