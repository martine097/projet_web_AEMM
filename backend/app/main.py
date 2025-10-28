from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from . import models
from .database import SessionLocal, engine

# Crée les tables si elles n’existent pas
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dépendance pour obtenir une session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "API connectée à PostgreSQL ✅"}

@app.post("/users/")
def create_user(name: str, db: Session = Depends(get_db)):
    user = models.User(name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.get("/users/")
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()
