# Health Tracker

An offline-first, mobile habit tracking application with a minimalist Cream & White aesthetic, built with React Native (Expo), WatermelonDB, FastAPI, and Supabase.

## Architecture
- **Frontend**: React Native (Expo) - Single codebase for iOS/Android.
- **Local Database**: WatermelonDB (SQLite) - For offline-first capabilities.
- **Backend Middleware**: FastAPI (Python) - Handles gamification logic and guards against time-spoofing.
- **Database**: Supabase (PostgreSQL) - Source of truth with Row Level Security (RLS).

## Features
- Offline-first tracking (Habits, Todos, Journal).
- Last-Write-Wins synchronization protocol.
- Time-spoofing prevention via backend validation.
- "Instagram-style" persistent login using `expo-secure-store` and Supabase Refresh Tokens.
- Gamification: Track streaks, earn freezes, and view 7-day progress.

## Setup Instructions
Please refer to `HANDOVER.md` for detailed instructions on how to set up the environments, connect Supabase, and launch the application.
