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

updateProductImage(productId: string, imageUrl: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/${productId}/image`, { Imagen: imageUrl }, {
    headers: this.getAuthHeaders()
  });
  
}

// Agregar una equivalencia a un producto
addEquivalencia(productId: string, equivalencia: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/${productId}/equivalencias`, { equivalencia }, {
    headers: this.getAuthHeaders(),
  });
}

// Actualizar (reemplazar) una equivalencia específica de un producto
updateEquivalencia(productId: string, equivalenciaAntigua: string, nuevaEquivalencia: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/${productId}/equivalencias/${equivalenciaAntigua}`, 
    { nuevaEquivalencia }, {
    headers: this.getAuthHeaders(),
  });
}

// Eliminar una equivalencia de un producto
removeEquivalencia(productId: string, equivalencia: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${productId}/equivalencias/${equivalencia}`, {
    headers: this.getAuthHeaders(),
  });
}

// Obtener productos filtrados por equivalencia
getProductsByEquivalencia(equivalencia: string, page: number = 1, limit: number = 20): Observable<Product[]> {
  const url = `${this.apiUrl}/equivalencias/buscar?equivalencia=${equivalencia}&page=${page}&limit=${limit}`;
  return this.http.get<Product[]>(url, {
    headers: this.getAuthHeaders(),
  });
}

getProductsByMedidas(interior?: number, exterior?: number, ancho?: number, page: number = 1, limit: number = 20): Observable<any> {
  let url = `${this.apiUrl}/medidas/buscar?page=${page}&limit=${limit}`;
  if (interior !== undefined) {
    url += `&INTERIOR=${interior}`;
  }
  if (exterior !== undefined) {
    url += `&EXTERIOR=${exterior}`;
  }
  if (ancho !== undefined) {
    url += `&ANCHO=${ancho}`;
  }
  return this.http.get(url, {
    headers: this.getAuthHeaders(),
  });
}

// Obtener nombres únicos de rubros
getRubros(): Observable<string[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<string[]>(`${this.apiUrl}/rubros`, { headers });
}

// Obtener el precio individual de un producto con descuento aplicado
getPrecioProductoById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}/precio`, {
    headers: this.getAuthHeaders(),
  });
}

}
