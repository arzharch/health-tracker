from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import sync, auth

app = FastAPI(
    title="Health Tracker API",
    description="Offline-first sync API for Health Tracker",
    version="1.0.0"
)

# CORS config for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(sync.router)
app.include_router(auth.router)
