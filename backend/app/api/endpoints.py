from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.supabase_client import supabase

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login_usuario(datos: LoginRequest):
    try:
        respuesta = supabase.auth.sign_in_with_password({
            "email": datos.email,
            "password": datos.password
        })
        return {
            "mensaje": "Login exitoso",
            "token": respuesta.session.access_token,
            "usuario": {
                "email": respuesta.user.email,
                "id": respuesta.user.id
            }
        }
    except Exception:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")