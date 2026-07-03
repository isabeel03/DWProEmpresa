import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Este método traerá la data de tus tablas de Supabase
  getReporteData(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/reportes/${endpoint}`);
  }
}