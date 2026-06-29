  import { Routes } from '@angular/router';
  import { HomeComponent } from './components/home/home';
  import { LoginLandingComponent } from './components/login-landing/login-landing';
  import { LoginFormComponent } from './components/login-form/login-form';
  import { DashboardComponent } from './components/dashboard/dashboard';
  import { authGuard } from './guards/auth-guard';

  import { ReporteResumen } from './components/reporte-resumen/reporte-resumen';
  import { ReporteMora } from './components/reporte-mora/reporte-mora';
  import { ReporteDesembolsos } from './components/reporte-desembolsos/reporte-desembolsos';

  import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin';
  import { SolicitarCreditoComponent } from './components/solicitar-credito/solicitar-credito';

  // Nuevas páginas públicas importadas con tu misma estructura limpia
  import { ProductosComponent } from './components/productos/productos';
  import { ServiciosComponent } from './components/servicios/servicios';
  import { CanalesComponent } from './components/canales/canales';
  import { ContactoComponent } from './components/contacto/contacto';
  import { SimuladorComponent } from './components/simulador/simulador';

  export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'productos', component: ProductosComponent },
    { path: 'servicios', component: ServiciosComponent },
    { path: 'canales', component: CanalesComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'simulador', component: SimuladorComponent },
    { path: 'core-bancario', component: DashboardAdminComponent },
    { path: 'solicitar-credito', component: SolicitarCreditoComponent },

    { path: 'admin/resumen', component: ReporteResumen },
  { path: 'admin/mora', component: ReporteMora },
  { path: 'admin/desembolsos', component: ReporteDesembolsos },
    
    // Rutas de Banca por Internet
    { path: 'banca-por-internet', component: LoginLandingComponent },
    { path: 'login', component: LoginFormComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    
    { path: '**', redirectTo: '' }
  ];