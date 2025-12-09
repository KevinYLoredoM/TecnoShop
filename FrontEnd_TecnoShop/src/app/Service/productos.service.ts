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

  // Agrega este método a tu ProductoService existente
  getProductoById(id: number): Observable<Producto> {
  // Como tu API actual devuelve TODOS, filtramos en el cliente por ahora.
  // Lo ideal sería tener un endpoint api/productos/{id} en el backend.
    return this.http.get<Producto[]>('https://localhost:44308/api/Productos').pipe(
      map((productos: Producto[]) => {
        const encontrado = productos.find(p => p.Id == id);
        if (!encontrado) throw new Error('Producto no encontrado');
        return encontrado;
      })
    );
  }
}