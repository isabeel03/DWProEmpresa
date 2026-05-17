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
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('bank_token', res.token);
          localStorage.setItem('user_email', res.usuario.email);
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