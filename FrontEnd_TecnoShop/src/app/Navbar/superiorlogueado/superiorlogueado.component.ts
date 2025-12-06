import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Service/auth.service'; // Asegura la ruta correcta
import { Usuario } from '../../Models/models';

@Component({
  selector: 'app-superiorlogueado',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './superiorlogueado.component.html',
  styleUrl: './superiorlogueado.component.scss'
})
export class SuperiorlogueadoComponent implements OnInit {
  
  // Inyección de dependencias
  private authService = inject(AuthService);
  
  usuario: Usuario | null = null;

  ngOnInit(): void {
    // Al iniciar el componente, obtenemos el usuario
    this.usuario = this.authService.usuarioActual;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.usuario = null; // Limpiamos la variable local
  }
}