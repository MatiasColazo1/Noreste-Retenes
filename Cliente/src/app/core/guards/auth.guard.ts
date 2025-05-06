import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token || this.isTokenExpired(token)) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp; // segundos desde UNIX epoch
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (err) {
      return true; // Si falla el decode, lo tratamos como expirado o inválido
    }
  }
}
