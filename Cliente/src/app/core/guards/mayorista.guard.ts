import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MayoristaGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const tipoCliente = this.authService.getTipoCliente();

    if (token && tipoCliente === 'Mayorista') {
      return true;
    }

    alert('Acceso solo para mayoristas. Contactá al administrador para cambiar tu tipo de cliente.');
    this.router.navigate(['/catalogo']);
    return false;
  }
}
