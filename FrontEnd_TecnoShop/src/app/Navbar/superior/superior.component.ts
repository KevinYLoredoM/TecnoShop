import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd, Event } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { Usuario } from '../../Models/models';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-superior',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './superior.component.html',
  styleUrls: ['./superior.component.scss']
})
export class SuperiorComponent implements OnInit {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  
  usuario: Usuario | null = null;
  filtroTexto: string = '';
  mostrarBuscador: boolean = false;

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;
    this.verificarRuta(this.router.url);

    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.verificarRuta(event.urlAfterRedirects);
    });
  }

  verificarRuta(url: string): void {
    const rutaLimpia = url.split('?')[0];
    const rutasPermitidas = ['/home', '/catalogo', '/'];
    this.mostrarBuscador = rutasPermitidas.includes(rutaLimpia);
  }

  get esAdmin(): boolean { return this.usuario?.rol === 1; }
  get esCliente(): boolean { return this.usuario?.rol === 2; }

  // --- AQUI ESTA EL CAMBIO IMPORTANTE ---
  aplicarFiltros(): void {
    const texto = this.filtroTexto.trim();
    
    // Obtenemos la ruta actual sin parámetros (ej: '/home')
    const rutaActual = this.router.url.split('?')[0];

    // Configuración de navegación
    const queryParams = texto ? { buscar: texto } : {}; // Si está vacío, quita el param

    if (rutaActual === '/home') {
      // Si estoy en home, me quedo en home y actualizo la URL
      this.router.navigate(['/home'], { queryParams: queryParams });
    } else {
      // Si estoy en catalogo O cualquier otro lado, voy a catalogo
      this.router.navigate(['/catalogo'], { queryParams: queryParams });
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.usuario = null;
    this.router.navigate(['/home']);
  }
}