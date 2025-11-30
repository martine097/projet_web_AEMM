from fastapi import APIRouter, Depends, Response, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserRead, UserCreate, UserLogin
from app.services.user_services import get_all_users, create_user, authenticate_user
from app.auth import create_access_token, verify_current_user, is_admin
from app.db import get_db
from app.models import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserRead)
def get_current_user(user_id: int = Depends(verify_current_user), db: Session = Depends(get_db)):
    """Vérifie le cookie de session et retourne les infos utilisateur si valide."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")
    return user

@router.get("/", response_model=list[UserRead])
def read_users(db: Session = Depends(get_db), admin_user = Depends(is_admin)):
    return get_all_users(db)

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def add_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, name=user.name, email=user.email, password=user.password, role=user.role)

@router.post("/login")
def login(response: Response, user_login: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants non valides")
    
    token = create_access_token({"sub": str(user.id)})
    response.set_cookie(key="access_token", value=f"Bearer {token}", httponly=True, samesite="Lax")
    
    return {
        "message": "Logged in", 
        "user": {
            "id": user.id, 
            "name": user.name, 
            "email": user.email, 
            "role": user.role
        }
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Déconnecté avec succès"}