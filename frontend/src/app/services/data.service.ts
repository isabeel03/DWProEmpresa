import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) {}

  // Este método traerá la data de tus tablas de Supabase
  getReporteData(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/reportes/${endpoint}`);
  }
}