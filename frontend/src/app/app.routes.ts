import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginLandingComponent } from './components/login-landing/login-landing.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // [C1] Pagina Home (index) - Ruta por defecto
  { path: '', component: HomeComponent },
  
  // [C2] Interfaz de Banca por Internet (pantalla previa)
  { path: 'banca-por-internet', component: LoginLandingComponent },
  
  // [C3] Formulario de Login
  { path: 'login', component: LoginFormComponent },
  
  // [C5] Dashboard protegido (solo entra si está autenticado)
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  
  // Si ponen cualquier otra ruta, los manda al Home
  { path: '**', redirectTo: '' }
];