import sys

# En Windows, la consola por defecto usa cp1252 y no puede imprimir emojis,
# lo que hacía crashear cualquier print() con caracteres Unicode (ej. en
# endpoints.py) y devolvía 500 aunque la operación en Supabase ya hubiera
# funcionado. Forzamos UTF-8 para que los logs no tumben el proceso.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(title="API ProEmpresa - Home Banking")

app.add_middleware(
    CORSMiddleware,
    # Combina todas las URLs permitidas en una sola lista
    allow_origins=[
        "http://localhost:4200", 
        "http://127.0.0.1:4200", 
        "https://dw-pro-empresa.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "online", "proyecto": "Home Banking ProEmpresa"}