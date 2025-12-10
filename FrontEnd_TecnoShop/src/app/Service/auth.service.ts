import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../Models/models';
import { Router } from '@angular/router'; // Importar Router
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'https://localhost:44308/api/usuarios';
  private http = inject(HttpClient);
  private router = inject(Router);
  // Inyectamos el identificador de plataforma para saber si estamos en server o browser
  private platformId = inject(PLATFORM_ID);

  constructor() { }

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, usuario);
  }

  login(correo: string, contrasena: string): Observable<Usuario> {
    const body = { correo, contrasena };
    return this.http.post<Usuario>(`${this.apiUrl}/Login`, body);
  }
  actualizarUsuario(usuario: Usuario): Observable<any> {
    // Nota: El endpoint en tu controlador C# se llama "update"
    return this.http.put(`${this.apiUrl}/update`, usuario);
  }
  actualizarSesionLocal(usuario: Usuario) {
    if (isPlatformBrowser(this.platformId)) {
      // Sobreescribimos los datos viejos con los nuevos
      localStorage.setItem('usuarioSesion', JSON.stringify(usuario));
    }
  }

  guardarSesion(usuario: Usuario) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('usuarioSesion', JSON.stringify(usuario));
    }
  }

  // --- NUEVOS MÉTODOS ---

  // Obtener el usuario actual desde LocalStorage
  get usuarioActual(): Usuario | null {
    // Solo leemos si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('usuarioSesion');
      if (userJson) {
        return JSON.parse(userJson);
      }
    }
    return null;
  }

  // Verificar si hay sesión activa
  estalogueado(): boolean {
    return this.usuarioActual !== null;
  }

  // Cerrar sesión
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioSesion');
    }
    this.router.navigate(['/login']);
  }
}