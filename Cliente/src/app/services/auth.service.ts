import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private router: Router) { }

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
    localStorage.removeItem('role'); // También eliminamos el rol
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  getUsers(): Observable<any> {
    const token = localStorage.getItem('token'); // ⚠️ Asegúrate de guardar el token al hacer login
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.apiUrl, { headers });
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
  
}
