import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Carrito } from '../models/carrito';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:3000/api/carrito'; // ajusta si es necesario

  private carritoSubject = new BehaviorSubject<Carrito[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private loadCart() {
    this.getCart().subscribe((items) => this.carritoSubject.next(items));
  }

  getCart(): Observable<Carrito[]> {
    return this.http.get<Carrito[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  addToCart(item: Carrito): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar`, item, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.loadCart()) // actualiza el observable después de agregar
    );
  }

  removeFromCart(idProducto: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${idProducto}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.loadCart())
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/vaciar`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.loadCart())
    );
  }

  // Método para usar en cualquier componente que quiera observar el carrito
  getCarritoObservable(): Observable<Carrito[]> {
    return this.carrito$;
  }
}
