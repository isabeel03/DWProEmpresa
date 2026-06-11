from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from supabase import create_client, Client
import os

router = APIRouter()

# Inicialización del cliente de Supabase usando variables de entorno o credenciales fijas
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://bynposzofxldbieiwjaa.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_hKOyOzHCfHgBRk6bqZG5bg_3Ckhymyg")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Modelo de validación para los datos que enviará Angular
class LoginCredentials(BaseModel):
    email: str
    password: str

@router.post("/auth/login")
async def login_bancario(credentials: LoginCredentials):
    try:
        # 1. Autenticar el usuario en el módulo nativo Auth de Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        # Verificar que la sesión se haya generado de manera exitosa
        if not auth_response.user or not auth_response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Credenciales bancarias incorrectas"
            )
            
        uuid_usuario = auth_response.user.id
        token_acceso = auth_response.session.access_token

        # 2. Consultar los datos financieros del cliente en tu tabla 'public.usuarios'
        resultado_perfil = supabase.table("usuarios") \
                                   .select("*") \
                                   .eq("id", uuid_usuario) \
                                   .single() \
                                   .execute()
        
        # Si el usuario existe en Auth pero no tiene registro en tu tabla de negocio
        if not resultado_perfil.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="El perfil financiero de este cliente no se encuentra registrado en el sistema del banco"
            )

        # 3. Retornar el token de seguridad junto a la data del Core Bancario
        return {
            "access_token": token_acceso,
            "token_type": "bearer",
            "cliente": {
                "id": resultado_perfil.data["id"],
                "nombre": resultado_perfil.data["nombre"],
                "dni": resultado_perfil.data["dni"],
                "celular": resultado_perfil.data["celular"],
                "numero_cuenta": resultado_perfil.data["numero_cuenta"],
                "saldo_ahorros": float(resultado_perfil.data["saldo_ahorros"])
            }
        }

    except Exception as error:
        # Captura errores de credenciales inválidas o fallas de red
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Error de Autenticación: {str(error)}"
        )