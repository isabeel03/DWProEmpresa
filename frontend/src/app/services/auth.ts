import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root' // <-- Esto le dice a Angular que se puede inyectar en cualquier componente
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) {}

login(email: string, password: string): Observable<any> {
  // 1. Añadimos '/auth' para corregir el error 404
  return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
    tap((res: any) => {
      // 2. Ajustamos las propiedades según lo que devuelve nuestro nuevo backend de FastAPI
      if (res && res.access_token) {
        // Guardamos el token JWT exigido por la rúbrica (Criterio 3)
        localStorage.setItem('bank_token', res.access_token);
        
        // Guardamos el tipo de usuario para que sirva de control en los guardianes de rutas
        localStorage.setItem('tipo_usuario', res.tipo_usuario);
      }
    })
  );
}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('bank_token');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  logout() {
    localStorage.removeItem('bank_token');
    localStorage.removeItem('user_email');
  }
}