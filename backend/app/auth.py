from fastapi import Cookie, HTTPException, status, Depends
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.db import get_db
from sqlalchemy.orm import Session
from app.models import User 

SECRET_KEY = "unicorn" # ⚠️ CHANGEZ CECI EN PRODUCTION !
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

def hash_password(password: str):
    """Hache un mot de passe en utilisant Argon2."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    """Vérifie un mot de passe clair contre le hachage stocké."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    """Crée un token JWT avec une date d'expiration."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    """Décode et vérifie la validité du token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

def verify_current_user(access_token: str = Cookie(None)):
    """
    Dépendance FastAPI pour valider le cookie et extraire l'ID utilisateur.
    Lance une 401 si non valide.
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Non authentifié"
        )

    try:
        # Le cookie arrive au format "Bearer <token>", on retire "Bearer "
        token = access_token.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Token invalide"
            )
        return int(user_id)
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    
def is_admin(user_id: int = Depends(verify_current_user), db: Session = Depends(get_db)):
    """
    Dépendance FastAPI pour s'assurer que l'utilisateur est un administrateur.
    Lance une 403 (Accès refusé) si ce n'est pas le cas.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Accès refusé")
    return user_id