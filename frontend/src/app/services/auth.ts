import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // 🚀 LOGIN PARA CLIENTES (Homebanking)
  login(emailOrCode: string, password: string): Observable<any> {
    const payload = { 
      username_or_email: emailOrCode,
      password: password 
    };
    
    return this.http.post(`${this.apiUrl}/auth/login`, payload).pipe(
      tap((res: any) => {
        if (res && res.access_token && this.isBrowser) {
          localStorage.setItem('bank_token', res.access_token);
          localStorage.setItem('tipo_usuario', 'cliente');
          localStorage.setItem('cliente_session', JSON.stringify(res));
        }
      })
    );
  }

 
  // 🚀 LOGIN EXCLUSIVO PARA ADMINISTRADORES Y PERSONAL CORE
  loginAdmin(dni: string, password: string): Observable<any> {
    const payload = { 
      dni: dni,
      password: password 
    };
  

    return this.http.post(this.apiUrl + '/auth/login-admin', payload).pipe(
      tap((res: any) => {
        if (res && res.access_token) {
          localStorage.setItem('bank_token', res.access_token);
          localStorage.setItem('tipo_usuario', 'empleado');
          localStorage.setItem('empleado_session', JSON.stringify(res));
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isBrowser ? !!localStorage.getItem('bank_token') : false;
  }

  getTipoUsuario(): string | null {
    return this.isBrowser ? localStorage.getItem('tipo_usuario') : null;
  }

  getUserEmail(): string {
    if (!this.isBrowser) return 'Usuario Bancario';

    const clienteData = localStorage.getItem('cliente_session');
    if (clienteData) {
      try {
        const session = JSON.parse(clienteData);
        return session.perfil?.nombre || 'Cliente ProEmpresa';
      } catch (e) { return 'Cliente ProEmpresa'; }
    }
    
    const empleadoData = localStorage.getItem('empleado_session');
    if (empleadoData) {
      try {
        const session = JSON.parse(empleadoData);
        return session.perfil?.nombre || 'Administrador Core';
      } catch (e) { return 'Administrador Core'; }
    }

    return 'Usuario Bancario';
  }

  logout() {
    if (this.isBrowser) {
      localStorage.clear();
    }
  }
}