import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../Models/models';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  private apiUrl = 'https://localhost:44308/api/Productos';
  private http = inject(HttpClient);

  // Obtener todos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // Filtrar (Conecta con [HttpGet] Route("api/Productos/Filtro"))
  filtrarProductos(categoria: string, marca: string, nombre: string): Observable<Producto[]> {
    let params = new HttpParams();
    
    // Validamos para no enviar 'undefined'
    if (categoria) params = params.set('Categoria', categoria);
    if (marca) params = params.set('Marca', marca);
    if (nombre) params = params.set('Nombre', nombre);

    return this.http.get<Producto[]>(`${this.apiUrl}/Filtro`, { params });
  }
}