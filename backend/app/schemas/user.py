from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "citizen"

class UserRead(BaseModel):
    id: int
    name: str
    email: str
    role: str
    
    class Config:
        from_attributes = True  # ou orm_mode = True si vous avez Pydantic < 2

class UserLogin(BaseModel):
    username: str
    password: str