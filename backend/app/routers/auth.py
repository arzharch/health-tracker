from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta, timezone
import jwt
import os
import bcrypt
from app.database import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("SUPABASE_JWT_SECRET", "super-secret-fallback-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserData(BaseModel):
    id: str
    email: str
    display_name: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    user: Optional[UserData] = None

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hash_bytes)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=Token)
def register_user(user: UserCreate):
    # Check if user exists
    res = supabase.table('users').select('id').eq('email', user.email).execute()
    if len(res.data) > 0:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    
    # Insert new user
    insert_res = supabase.table('users').insert({
        'email': user.email,
        'password_hash': hashed_password,
        'token_version': 1
    }).execute()
    
    if len(insert_res.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to create user")
        
    new_user = insert_res.data[0]
    
    # Also create a profile
    supabase.table('profiles').insert({
        'id': new_user['id'],
        'display_name': user.full_name or user.email.split('@')[0]
    }).execute()
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user['id'], "token_version": new_user['token_version']}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_id": new_user['id'],
        "user": {
            "id": new_user['id'],
            "email": user.email,
            "display_name": user.full_name or user.email.split('@')[0]
        }
    }

@router.post("/login", response_model=Token)
def login_user(user: UserLogin):
    res = supabase.table('users').select('*').eq('email', user.email).execute()
    if len(res.data) == 0:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    db_user = res.data[0]
    if not verify_password(user.password, db_user['password_hash']):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user['id'], "token_version": db_user['token_version']}, 
        expires_delta=access_token_expires
    )
    
    profile_res = supabase.table('profiles').select('display_name').eq('id', db_user['id']).execute()
    display_name = profile_res.data[0]['display_name'] if len(profile_res.data) > 0 else db_user['email'].split('@')[0]
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_id": db_user['id'],
        "user": {
            "id": db_user['id'],
            "email": db_user['email'],
            "display_name": display_name
        }
    }

@router.post("/revoke")
def revoke_tokens(user_id: str):
    # Find current version
    res = supabase.table('users').select('token_version').eq('id', user_id).execute()
    if len(res.data) == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    current_version = res.data[0]['token_version']
    
    # Increment version to invalidate all existing tokens
    supabase.table('users').update({'token_version': current_version + 1}).eq('id', user_id).execute()
    
    return {"success": True, "detail": "All active sessions revoked"}
