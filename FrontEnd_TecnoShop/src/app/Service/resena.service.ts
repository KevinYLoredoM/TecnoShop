import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resena } from '../Models/models';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:44308/api/resena';

  // Obtener reseñas por producto
  getResenas(proId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/${proId}`);
  }

  getTodasLasResenas(): Observable<Resena[]> {
  return this.http.get<Resena[]>(`${this.apiUrl}/todas`);
}

  // Agregar nueva reseña
  agregarResena(resena: Resena): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarResena`, resena);
  }

  responderResena(idResena: number, respuesta: string, adminId: number): Observable<any> {
  const body = { 
    idResena: idResena, 
    respuesta: respuesta,
    usuId: adminId // Enviamos el ID del admin para la tabla respuestasReseña
  };
    return this.http.put(`${this.apiUrl}/responder`, body);
  }
}