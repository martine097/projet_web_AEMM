from fastapi import APIRouter, Depends, Response, HTTPException, status
from sqlalchemy.orm import Session
# Importation de UserLogin (attention à ce que ce schéma ait bien un champ 'username')
from app.schemas.user import UserRead, UserCreate, UserLogin
from app.services.user_services import get_all_users, create_user, authenticate_user
# Note: create_access_token est importé de app.auth (assurez-vous que cette fonction existe)
from app.auth import create_access_token, verify_current_user, is_admin
from app.db import get_db
from app.models import User
from datetime import timedelta # Importation nécessaire si ACCESS_TOKEN_EXPIRE_MINUTES est utilisé ailleurs
# Si ACCESS_TOKEN_EXPIRE_MINUTES n'est pas défini ici, assurez-vous qu'il est importé de app.config

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserRead)
def get_current_user(user_id: int = Depends(verify_current_user), db: Session = Depends(get_db)):
    """Vérifie le cookie de session et retourne les infos utilisateur si valide."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur non trouvé")
    return user

@router.get("/", response_model=list[UserRead])
# CORRECTION : Suppression de 'admin_user = Depends(is_admin)' pour que la liste soit accessible au public (pour le frontend)
def read_users(db: Session = Depends(get_db)):
    """Récupère la liste de tous les utilisateurs (publique pour le frontend)."""
    return get_all_users(db)

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def add_user(user: UserCreate, db: Session = Depends(get_db)):
    """Création d'un nouvel utilisateur."""
    # Assurez-vous que user.name correspond à l'identifiant
    return create_user(db, name=user.name, email=user.email, password=user.password, role=user.role)

@router.post("/login")
# CORRECTION MAJEURE : Utilisation de user_login.name au lieu de user_login.email
def login(response: Response, user_login: UserLogin, db: Session = Depends(get_db)):
    """
    Authentifie l'utilisateur en utilisant l'identifiant (name/username).
    ATTENTION : Votre schéma UserLogin doit avoir un champ 'name' ou 'username'.
    """
   
    user = authenticate_user(db, user_login.username, user_login.password)
       
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiant ou mot de passe incorrect")
    
    # 2. Le token doit être créé avec une donnée unique de l'utilisateur
    token = create_access_token({"sub": str(user.id)})
    
    # Définition du cookie
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
    """Supprime le cookie d'accès pour déconnecter l'utilisateur."""
    response.delete_cookie("access_token")
    return {"message": "Déconnecté avec succès"}