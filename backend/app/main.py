from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.user_router import router as user_router_api
from app.config import Base, engine

# Créer les tables au démarrage
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Parking Management API")

# CORS - DOIT être avant les routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(user_router_api)  # Les routes seront sur /users/

@app.get("/")
async def read_root():
    return {"message": "Bienvenue sur l'API Parking"}

@app.get("/health")
async def health():
    return {"status": "ok"}