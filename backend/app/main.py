from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(title="API ProEmpresa - Home Banking")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "online", "proyecto": "Home Banking ProEmpresa"}

# ❌ BORRA EL @app.post DE AQUÍ, YA NO VA EN ESTE ARCHIVO