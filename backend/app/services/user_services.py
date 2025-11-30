from sqlalchemy.orm import Session
from app.models import User
from app.auth import hash_password, verify_password

def get_all_users(db: Session):
    """Récupère tous les utilisateurs de la base de données."""
    return db.query(User).all()

def create_user(db: Session, name: str, email: str, password: str, role: str = "citizen"):
    """Crée un nouvel utilisateur après avoir haché son mot de passe."""
    hashed_password = hash_password(password)
    user = User(name=name, email=email, password=hashed_password, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str):
    """Authentifie un utilisateur."""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        return None
    
    if not verify_password(password, user.password):
        return None
        
    return user