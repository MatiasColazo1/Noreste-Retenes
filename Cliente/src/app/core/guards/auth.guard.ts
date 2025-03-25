import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // Esto es obligatorio para que Angular lo registre como servicio
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('token'); // Verifica si hay un token

    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redirige a login si no está autenticado
      return false;
    }
    return true;
  }
}
