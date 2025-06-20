import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CarritoService } from './carrito.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private router: Router, private carritoService: CarritoService) { }

  // Registro de usuario
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Inicio de sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Guardar token y rol en localStorage
  saveAuthData(token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role); // Guardamos también el rol
  }

  // Guardar token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtener token de localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener el rol de localStorage
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Cerrar sesión
logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');

  // Limpiar el observable del carrito
  this.carritoService.resetCarrito(); // creá este método en el servicio

  this.router.navigate(['/login']);
}

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  // traer todos los usuarios
getUsers(page: number = 1, limit: number = 10): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const params = new HttpParams()
    .set('page', page.toString())
    .set('limit', limit.toString());

  return this.http.get<any>(this.apiUrl, { headers, params });
}

// Buscar usuarios con filtro parcial
searchUsersByFiltroParcial(filtro: string, page: number = 1, limit: number = 10): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const params = new HttpParams()
    .set('filtro', filtro)
    .set('page', page.toString())
    .set('limit', limit.toString());

  return this.http.get<any>(`${this.apiUrl}/buscar`, { headers, params });
}

  // Obtener usuario por ID con token
  getUserById(id: string): Observable<any> {
    const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Agrega el token a los headers

    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // Actualizar un usuario por ID
  updateUserById(id: string, userData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.apiUrl}/${id}`, userData, { headers });
  }

  // Guardar usuario completo
  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Obtener usuario completo
  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Verifica que el usuario esté bien formateado
  }

  // Obtener los descuentos del usuario
  getDescuentos(): any[] {
    return this.getUser()?.descuentos ?? [];
  }

  // Actualizar descuentos de un usuario por ID
  // PUT /api/users/:userId/descuentos
  // En auth.service.ts
  updateUserDiscounts(userId: string, descuentos: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${userId}/descuentos`, { descuentos }, { headers });
  }

  getTipoCliente(): string | null {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.tipoCliente ?? null;
}


getUserIdFromToken(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded._id || decoded.id || null; // Usá el campo que estás enviando desde tu backend
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

getCurrentUser(): Observable<any> {
  const userId = this.getUserIdFromToken();
  if (!userId) {
    return throwError(() => new Error('ID de usuario no encontrado en el token.'));
  }
  return this.getUserById(userId);
}

forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/forgot-password`, { email });
}

resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/reset-password/${token}`, { newPassword });
}

}
