import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../Models/models';
import { Router } from '@angular/router'; // Importar Router

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'https://localhost:44308/api/usuarios';
  private http = inject(HttpClient);
  private router = inject(Router); // Inyectar Router para redirigir al salir

  constructor() { }

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }

  login(correo: string, contrasena: string): Observable<Usuario> {
    const body = { correo, contrasena };
    return this.http.post<Usuario>(`${this.apiUrl}/Login`, body);
  }

  guardarSesion(usuario: Usuario) {
    localStorage.setItem('usuarioSesion', JSON.stringify(usuario));
  }

  // --- NUEVOS MÉTODOS ---

  // Obtener el usuario actual desde LocalStorage
  get usuarioActual(): Usuario | null {
    const userJson = localStorage.getItem('usuarioSesion');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  // Verificar si hay sesión activa
  estalogueado(): boolean {
    return this.usuarioActual !== null;
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('usuarioSesion');
    this.router.navigate(['/login']);
  }
}