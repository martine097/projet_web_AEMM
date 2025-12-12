from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email:str
    password:str
    role: str = "user"

class UserRead(BaseModel):
    id: int
    name: str
    email:str
    role: str

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: str
    password:str