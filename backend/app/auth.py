from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from dotenv import load_dotenv
from app.database import supabase

load_dotenv()

security = HTTPBearer()

SECRET_KEY = os.getenv("SUPABASE_JWT_SECRET", "super-secret-fallback-key")
ALGORITHM = "HS256"

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=[ALGORITHM]
            # removed audience="authenticated" because we're not using Supabase Auth anymore
        )
        user_id = payload.get("sub")
        token_version = payload.get("token_version")
        
        if user_id is None or token_version is None:
            raise ValueError("Invalid payload")
            
        # Verify token version against database
        res = supabase.table('users').select('token_version').eq('id', user_id).execute()
        if len(res.data) == 0:
            raise HTTPException(status_code=401, detail="User not found")
            
        current_version = res.data[0]['token_version']
        if token_version != current_version:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
