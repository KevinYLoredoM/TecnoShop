import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../Models/models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  private apiUrl = 'https://localhost:44308/api/Productos';
  private http = inject(HttpClient);

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  filtrarProductos(categoria: string, marca: string, nombre: string): Observable<Producto[]> {
    let params = new HttpParams();
    if (categoria) params = params.set('Categoria', categoria);
    if (marca) params = params.set('Marca', marca);
    if (nombre) params = params.set('Nombre', nombre);
    return this.http.get<Producto[]>(`${this.apiUrl}/Filtro`, { params });
  }

  // --- NUEVOS MÉTODOS CRUD ---

  registrarProducto(producto: Producto): Observable<any> {
    return this.http.post(`${this.apiUrl}/Registrar`, producto);
  }

  actualizarProducto(producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/Update`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    // Enviamos el ID como parámetro query: api/Productos/Delete?id=5
    let params = new HttpParams().set('id', id);
    return this.http.delete(`${this.apiUrl}/Delete`, { params });
  }
}