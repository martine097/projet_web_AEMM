# Correction de l'importation vers config.py (qui est au même niveau)
from .config import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()