import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../Service/auth.service'; // Ajusta la ruta a tu servicio
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean | UrlTree {
    
    // 1. Obtener el usuario actual
    const usuario = this.authService.usuarioActual;

    // 2. Verificar si está logueado
    if (!usuario) {
      // Si no hay usuario, mandarlo al login
      return this.router.createUrlTree(['login']);
    }

    // 3. Verificar Roles (Opcional pero recomendado)
    // Buscamos si la ruta pide roles específicos en su "data"
    const rolesEsperados = route.data['roles'] as Array<number>;

    if (rolesEsperados) {
      // Si la ruta exige roles y el usuario NO tiene ese rol
      if (!rolesEsperados.includes(usuario.rol)) {
        // Redirigir a home o a una página de "Acceso Denegado"
        alert('No tienes permisos para acceder a esta sección.');
        return this.router.createUrlTree(['/home']);
      }
    }

    // Si pasa todas las pruebas, permitir acceso
    return true;
  }
}