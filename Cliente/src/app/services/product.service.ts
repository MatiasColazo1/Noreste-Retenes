import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products'; // Asegúrate de que la URL es correcta

  constructor(private http: HttpClient) { }

  // Obtener el token desde localStorage o cualquier otro almacenamiento seguro
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Asegúrate de guardar el token al iniciar sesión
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener productos con paginación
  getProducts(page: number = 1, limit: number = 20): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Obtener producto por ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Agregar el archivo al FormData

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  // Subir archivo de precios (Excel)
uploadPrices(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file); // Agregar el archivo al FormData

  return this.http.post(`${this.apiUrl}/upload-prices`, formData, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }),
  });
}

// Obtener productos filtrados según el usuario (precios según rol)
getProductsByUser(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/by-user`, {
    headers: this.getAuthHeaders(),
  });
}

//filtro codigo
getProductsByPartialCode(codigo: string | null, pagina: number = 1, limite: number = 20): Observable<any> {
  let url = `${this.apiUrl}/buscar?page=${pagina}&limit=${limite}`;

  // Si hay código, lo agregamos como parámetro
  if (codigo) {
    url += `&codigo=${codigo}`;
  }

  return this.http.get(url, {
    headers: this.getAuthHeaders(),
  });
}

}
