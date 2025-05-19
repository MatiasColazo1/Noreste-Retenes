import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aplicacion } from '../models/aplicacion';

@Injectable({
  providedIn: 'root'
})
export class AplicacionService {

  private baseUrl = 'http://localhost:3000/api/aplicacion'; // adaptalo si usás proxy/backend en otro puerto

  constructor(private http: HttpClient) { }

  getAplicacionesByProducto(productoId: string, token: string): Observable<Aplicacion[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Aplicacion[]>(`${this.baseUrl}/producto/${productoId}`, { headers });
  }

  createAplicacion(aplicacion: Aplicacion, token: string): Observable<Aplicacion> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Aplicacion>(this.baseUrl, aplicacion, { headers });
  }

  updateAplicacion(id: string, aplicacion: Aplicacion, token: string): Observable<Aplicacion> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Aplicacion>(`${this.baseUrl}/${id}`, aplicacion, { headers });
  }

  deleteAplicacion(id: string, token: string): Observable<{ message: string }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, { headers });
  }

  getMarcasUnicas(token: string): Observable<string[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<string[]>(`${this.baseUrl}/filtro/marcas`, { headers });
  }

  getModelosPorMarca(marca: string, token: string): Observable<string[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<string[]>(`${this.baseUrl}/filtro/modelos/${marca}`, { headers });
  }

  getRubrosPorMarcaYModelo(marca: string, modelo: string, token: string): Observable<string[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<string[]>(`${this.baseUrl}/filtro/rubros/${marca}/${modelo}`, { headers });
}

getDescripcionesPorMarcaModeloYRubro(marca: string, modelo: string, rubro: string, token: string): Observable<string[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const encodedMarca = encodeURIComponent(marca);
  const encodedModelo = encodeURIComponent(modelo);
  const encodedRubro = encodeURIComponent(rubro);
  
  return this.http.get<string[]>(
    `${this.baseUrl}/descripciones/${encodedMarca}/${encodedModelo}/${encodedRubro}`,
    { headers }
  );
}

getProductosFiltrados(
  marca: string,
  modelo: string,
  rubro: string,
  descripcion: string,
  token: string
): Observable<any[]> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const encodedMarca = encodeURIComponent(marca);
  const encodedModelo = encodeURIComponent(modelo);
  const encodedRubro = encodeURIComponent(rubro);
  const encodedDescripcion = encodeURIComponent(descripcion);

  return this.http.get<any[]>(
    `${this.baseUrl}/productos/${encodedMarca}/${encodedModelo}/${encodedRubro}/${encodedDescripcion}`,
    { headers }
  );
}

}
