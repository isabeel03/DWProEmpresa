import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Si Angular está procesando la página en el Servidor (SSR), lo dejamos pasar sin validar
  // para que el Navegador (Cliente) tome la decisión final con el localStorage real.
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  const token = localStorage.getItem('bank_token');
  const tipoUsuario = localStorage.getItem('tipo_usuario');

  if (token) {
    // Validamos que un cliente no intente entrar a rutas de empleado y viceversa
    if (state.url.startsWith('/admin') && tipoUsuario !== 'empleado') {
      router.navigate(['/']);
      return false;
    }
    if (state.url.startsWith('/creditos') && tipoUsuario !== 'cliente') {
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  // Si no hay sesión en el navegador, al home de cabeza
  router.navigate(['/']);
  return false;
};