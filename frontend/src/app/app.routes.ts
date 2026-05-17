import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginLandingComponent } from './components/login-landing/login-landing';
import { LoginFormComponent } from './components/login-form/login-form';
import { DashboardComponent } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // [C1] Pagina Home (index) con branding ProEmpresa
  { path: '', component: HomeComponent },
  
  // [C2] Interfaz previa: Pantalla de "Banca por Internet"
  { path: 'banca-por-internet', component: LoginLandingComponent },
  
  // [C3] Formulario de Login conectado a la BD
  { path: 'login', component: LoginFormComponent },
  
  // [C5] Dashboard con los datos del usuario (Protegido por el guardia)
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  
  // Redirección por defecto si la ruta no existe
  { path: '**', redirectTo: '' }
];