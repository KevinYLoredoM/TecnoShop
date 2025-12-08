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

    // 1. Verificar ruta inicial al cargar
    this.verificarRuta(this.router.url);

    // 2. Suscribirse a cambios de ruta (Cada vez que navegues)
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.verificarRuta(event.urlAfterRedirects);
    });
  }

  // Lógica para decidir si mostramos el buscador
  verificarRuta(url: string): void {
    // Limpiamos la url de parámetros (ej: /catalogo?buscar=pc -> /catalogo)
    const rutaLimpia = url.split('?')[0];

    // Definimos dónde SÍ queremos el buscador
    const rutasPermitidas = ['/home', '/catalogo', '/'];

    // Condición final:
    this.mostrarBuscador = rutasPermitidas.includes(rutaLimpia);
  }

  get esAdmin(): boolean {
    return this.usuario?.rol === 1;
  }

  get esCliente(): boolean {
    return this.usuario?.rol === 2;
  }

  aplicarFiltros(): void {
    if (this.filtroTexto.trim()) {
      this.router.navigate(['/catalogo'], { queryParams: { buscar: this.filtroTexto } });
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.usuario = null;
    this.router.navigate(['/login']);
  }
}