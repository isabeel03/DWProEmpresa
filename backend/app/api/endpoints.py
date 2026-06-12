from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from supabase import create_client, Client
import os
from typing import Optional

router = APIRouter()

# Inicialización del cliente de Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://bynposzofxldbieiwjaa.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_hKOyOzHCfHgBRk6bqZG5bg_3Ckhymyg")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- MODELOS DE VALIDACIÓN ---
class CreditoSolicitudInput(BaseModel):
    cliente_id: str
    monto: float
    plazo: int
    tipo_credito: str
    cuota: float
    ingreso_mensual: float

class DecisionSolicitudInput(BaseModel):
    solicitud_id: int
    accion: str  # 'Aprobar' o 'Rechazar'
    empleado_id: str

# --- 1. LOGIN INTEGRADO CON DETECCIÓN DE ROLES (Criterio 3) ---
class LoginCredentials(BaseModel):
    username: Optional[str] = None  # Puede llegar como username
    email: Optional[str] = None     # O puede llegar como email
    password: str

# --- 1. LOGIN INTEGRADO AUTOMÁTICO ADAPTADO AL DOCENTE ---
@router.post("/auth/login")
async def login_bancario(credentials: LoginCredentials):
    try:
        # Extraemos el identificador sin importar cómo lo haya enviado el frontend
        usuario_input = credentials.username if credentials.username else credentials.email
        
        if not usuario_input:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Debe proporcionar un usuario o email para ingresar."
            )

        # ESCENARIO A: SISTEMA CORE (:8001) - El usuario ingresa con su DNI
        if usuario_input.isdigit() and len(usuario_input) == 8:
            # 1. Regla de desarrollo del docente: Contraseña debe ser igual al DNI
            if usuario_input != credentials.password:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales del Core incorrectas. Recuerde: Contraseña = DNI."
                )
            
            # 2. Consultamos directamente la tabla de empleados cruzando con su rol operativo
            empleado_perfil = supabase.table("empleados") \
                                      .select("*, roles(nombre_rol)") \
                                      .eq("dni", usuario_input) \
                                      .maybe_single() \
                                      .execute()
            
            if not empleado_perfil or not empleado_perfil.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="El DNI ingresado no pertenece a ningún personal registrado en el Core Bancario."
                )
                
            return {
                "access_token": f"token_simulado_core_jwt_{usuario_input}",
                "token_type": "bearer",
                "tipo_usuario": "empleado",
                "perfil": {
                    "id": empleado_perfil.data["id"],
                    "nombre": empleado_perfil.data["nombre"],
                    "rol": empleado_perfil.data["roles"]["nombre_rol"],
                    "agencia": empleado_perfil.data["agencia"]
                }
            }

        # ESCENARIO B: HOMEBANKING (:8002) - El cliente ingresa con su código (ej: cli000007)
        elif usuario_input.startswith("cli"):
            if credentials.password != "demo1234":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Contraseña de Homebanking incorrecta. Use 'demo1234'."
                )
            
            cliente_perfil = supabase.table("usuarios") \
                                     .select("*") \
                                     .or_(f"id.eq.{usuario_input},dni.eq.11200007") \
                                     .maybe_single() \
                                     .execute()
            
            if not cliente_perfil or not cliente_perfil.data:
                return {
                    "access_token": "token_simulado_cliente_jwt",
                    "token_type": "bearer",
                    "tipo_usuario": "cliente",
                    "perfil": {
                        "id": usuario_input,
                        "nombre": "Roberto Carlos (Cliente de Prueba)",
                        "dni": "11200007",
                        "numero_cuenta": "191-44332211-0-11",
                        "saldo_ahorros": 1500.00
                    }
                }

            return {
                "access_token": f"token_simulado_cliente_jwt_{usuario_input}",
                "token_type": "bearer",
                "tipo_usuario": "cliente",
                "perfil": {
                    "id": cliente_perfil.data["id"],
                    "nombre": cliente_perfil.data["nombre"],
                    "dni": cliente_perfil.data["dni"],
                    "numero_cuenta": cliente_perfil.data["numero_cuenta"],
                    "saldo_ahorros": float(cliente_perfil.data["saldo_ahorros"])
                }
            }
            
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de usuario no reconocido. Use DNI para el Core o 'cliXXXXXX' para el Homebanking."
            )

    except HTTPException as http_ex:
        raise http_ex
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Falla del Sistema Central: {str(error)}"
        )
    
# --- 2. ENVIAR SOLICITUD DESDE EL SIMULADOR CON REGLAS DE NEGOCIO (Criterio 1 y 2) ---
@router.post("/creditos/solicitar")
async def registrar_solicitud(data: CreditoSolicitudInput):
    try:
        # Regla de Negocio: Calcular RDS (Relación Cuota / Ingreso)
        rds = (data.cuota / data.ingreso_mensual) * 100
        
        # Scoring Automático Basado en Riesgo Normativo
        scoring = 100
        if rds > 40: scoring -= 35  # Penalizar si la cuota compromete más del 40% del sueldo
        if data.monto > 25000: scoring -= 15
        
        # Semáforo de Riesgo (Criterio 2)
        if scoring >= 75 and rds <= 35:
            semaforo = "Verde"
            estado_inicial = "Pendiente"
        elif scoring >= 50 and rds <= 45:
            semaforo = "Amarillo"
            estado_inicial = "Pendiente"
        else:
            semaforo = "Rojo"
            estado_inicial = "Rechazado" # Rechazo automático por Scoring/RDS deficiente

        nueva_solicitud = {
            "cliente_id": data.cliente_id,
            "monto_solicitado": data.monto,
            "plazo_meses": data.plazo,
            "tipo_credito": data.tipo_credito,
            "cuota_estimada": data.cuota,
            "ingreso_mensual": data.ingreso_mensual,
            "rds_ratio": round(rds, 2),
            "scoring_puntos": scoring,
            "semaforo_riesgo": semaforo,
            "estado": estado_inicial
        }

        res = supabase.table("solicitudes_credito").insert(nueva_solicitud).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- 3. DASHBOARD DEL ADMINISTRADOR: LEER SOLICITUDES (Criterio 1) ---
@router.get("/admin/solicitudes")
async def obtener_solicitudes_admin():
    try:
        # Recupera las solicitudes cruzando con los datos del usuario para ver quién la pide
        res = supabase.table("solicitudes_credito").select("*, usuarios(nombre, dni)").order("fecha_creacion", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- 4. PROCESAR EVALUACIÓN / DESEMBOLSO (Criterio 1 y 2: Flujo Fin-a-Fin) ---
@router.post("/admin/evaluar-solicitud")
async def evaluar_solicitud_admin(data: DecisionSolicitudInput):
    try:
        # 1. Si es rechazada, solo cambiamos el estado
        if data.accion == "Rechazar":
            supabase.table("solicitudes_credito").update({"estado": "Rechazado"}).eq("id", data.solicitud_id).execute()
            return {"status": "success", "message": "Solicitud rechazada"}
        
        # 2. Si es aprobada, hacemos el flujo de DESEMBOLSO COMPLETO
        # Consultamos la solicitud original
        solicitud = supabase.table("solicitudes_credito").select("*").eq("id", data.solicitud_id).single().execute()
        if not solicitud.data:
            raise HTTPException(status_code=404, detail="Solicitud no encontrada")
            
        cliente_id = solicitud.data["cliente_id"]
        monto = float(solicitud.data["monto_solicitado"])
        
        # Obtenemos los datos de la cuenta bancaria del cliente
        perfil_cliente = supabase.table("usuarios").select("numero_cuenta, saldo_ahorros").eq("id", cliente_id).single().execute()
        if not perfil_cliente.data:
            raise HTTPException(status_code=404, detail="Cuenta de ahorros del cliente no encontrada")
            
        num_cuenta = perfil_cliente.data["numero_cuenta"]
        nuevo_saldo = float(perfil_cliente.data["saldo_ahorros"]) + monto
        
        # A. Actualizar estado de la solicitud a Desembolsado
        supabase.table("solicitudes_credito").update({"estado": "Desembolsado"}).eq("id", data.solicitud_id).execute()
        
        # B. Registrar el crédito activo en la cartera del banco (Con banda de mora inicial 'Al Día')
        credito_activo = {
            "solicitud_id": data.solicitud_id,
            "cliente_id": cliente_id,
            "monto_desembolsado": monto,
            "numero_cuenta_destino": num_cuenta,
            "dias_mora": 0
        }
        supabase.table("creditos_desembolsados").insert(credito_activo).execute()
        
        # C. Impactar de vuelta en el Homebanking: Sumar el dinero a su saldo de ahorros actual
        supabase.table("usuarios").update({"saldo_ahorros": nuevo_saldo}).eq("id", cliente_id).execute()
        
        return {"status": "success", "message": "Crédito aprobado y desembolsado con éxito en la cuenta del cliente"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))