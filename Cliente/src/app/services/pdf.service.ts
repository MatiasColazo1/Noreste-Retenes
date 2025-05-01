import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = 'http://localhost:3000/api/pdf';
  constructor(private http: HttpClient, private authService: AuthService) {}

  generarPDF(userId: string): Observable<Blob> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
  
    return this.http.post<Blob>(`${this.apiUrl}/carrito/pdf`, { userId }, { headers, responseType: 'blob' as 'json' });
  }
  
  
}
