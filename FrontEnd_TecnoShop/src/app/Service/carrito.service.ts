import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarritoItem } from '../Models/models';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  
  private http = inject(HttpClient);
  // Asegúrate de que este puerto sea el correcto
  private apiUrl = 'https://localhost:44308/api/carrito';

  constructor() { }

  // GET: api/carrito/{usuId}
  getCarrito(usuId: number): Observable<CarritoItem[]> {
    return this.http.get<CarritoItem[]>(`${this.apiUrl}/${usuId}`);
  }

  // POST: api/carrito/agregarCarrito
  agregarCarrito(item: CarritoItem): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarCarrito`, item);
  }

  // PUT: api/carrito/actualizarCarrito
  actualizarCantidad(item: CarritoItem): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizarCarrito`, item);
  }

  // DELETE: api/carrito/{usuId}/{proId}
  eliminarItem(usuId: number, proId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${usuId}/${proId}`);
  }

  // DELETE: api/carrito/{usuId} (Vaciar todo)
  vaciarCarrito(usuId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${usuId}`);
  }
}