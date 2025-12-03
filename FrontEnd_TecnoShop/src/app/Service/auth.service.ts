import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../Models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'https://localhost:44308/api/usuarios';
  private http = inject(HttpClient);

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
}