import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginLandingComponent } from './components/login-landing/login-landing';
import { LoginFormComponent } from './components/login-form/login-form';
import { DashboardComponent } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

// Nuevas páginas públicas importadas con tu misma estructura limpia
import { ProductosComponent } from './components/productos/productos';
import { ServiciosComponent } from './components/servicios/servicios';
import { CanalesComponent } from './components/canales/canales';
import { ContactoComponent } from './components/contacto/contacto';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'canales', component: CanalesComponent },
  { path: 'contacto', component: ContactoComponent },
  
  // Rutas de Banca por Internet
  { path: 'banca-por-internet', component: LoginLandingComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  
  { path: '**', redirectTo: '' }
];