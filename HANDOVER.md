# Project Handover Document

Welcome to the Health Tracker codebase! This document provides the exact steps needed to get your local environment running and connected to Supabase.

## 1. Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open the `backend/supabase_schema.sql` file from this repository, copy its contents, and run it in the Supabase SQL Editor. This will create all your tables, RLS policies, and Gamification triggers.
4. Go to **Project Settings -> API**.
5. You need three pieces of information:
   - `Project URL`
   - `anon` `public` API Key
   - `service_role` `secret` API Key (Keep this completely secret!)

## 2. Environment Variables
1. Copy `backend/.env.example` to `backend/.env`.
2. Fill in the `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_JWT_SECRET` (found in Supabase API settings under JWT Settings).
3. Copy `frontend/.env.example` to `frontend/.env`.
4. Fill in the `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

## 3. Running the Backend
The backend is built with FastAPI and runs on Python.
```bash
cd backend
# Activate the virtual environment
.\venv\Scripts\Activate.ps1  # Windows
# OR
source venv/bin/activate     # Mac/Linux

# Install dependencies if you haven't
pip install -r requirements.txt # (Dependencies are already installed in the venv)

# Run the server
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8001`. You can view the interactive Swagger docs at `http://localhost:8001/docs`.

## 4. Running the Frontend
The frontend is built with React Native and Expo.
```bash
cd frontend

# Install packages
npm install

# Start the Expo bundler
npx expo start
```
You can press `a` to run on an Android emulator, `i` to run on an iOS simulator, or scan the QR code with the Expo Go app on your physical device.

## Architectural Notes
- **Sync Protocol**: The WatermelonDB sync manager (`frontend/src/db/sync.ts`) is configured to hit `http://localhost:8001/sync/pull` and `push`. If you run on a physical device, you must change `EXPO_PUBLIC_API_URL` to your computer's local IP address (e.g., `http://192.168.1.5:8000/sync`).
- **Gamification**: The streak calculation logic lives in `backend/app/gamification.py`. It is triggered during the `/sync/push` phase if habit logs are submitted.
- **UI System**: All reusable components are in `frontend/src/components/` and rely heavily on the centralized theme in `frontend/src/theme/colors.ts`.
