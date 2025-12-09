import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoItem } from '../../Models/models';
import { CarritoService } from '../../Service/carrito.service';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, SuperiorComponent, InferiorComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {

  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // URL base para imágenes (Mismo que en Home)
  private apiUrlBase = 'https://localhost:44308'; 

  items: CarritoItem[] = [];
  total: number = 0;
  cargando: boolean = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    const usuario = this.authService.usuarioActual;

    if (usuario && usuario.id) {
      this.carritoService.getCarrito(usuario.id).subscribe({
        next: (data) => {
          this.items = data;
          this.calcularTotal();
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error cargando carrito', err);
          this.cargando = false;
        }
      });
    } else {
      this.cargando = false;
    }
  }

  calcularTotal() {
    // Sumamos los subtotales que vienen de la BD
    this.total = this.items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  }

  cambiarCantidad(item: CarritoItem, delta: number) {
  // 1. Calcular nueva cantidad
  const nuevaCantidad = item.cantidad + delta;
  const cantidadAnterior = item.cantidad; // Guardamos por si falla

  // Validación: No permitir menos de 1
  if (nuevaCantidad < 1) return;

  // 2. ACTUALIZACIÓN VISUAL INMEDIATA (Optimista)
  item.cantidad = nuevaCantidad;
  if (item.precio) {
    item.subtotal = item.precio * nuevaCantidad;
  }
  this.calcularTotal();

  // 3. Preparar datos para el servidor
  // Usamos el ID del item, o el del usuario logueado como respaldo si viene vacío
  const idUsuarioReal = item.idUsuario || this.authService.usuarioActual?.id || 0;

  const payload: CarritoItem = {
    idUsuario: idUsuarioReal,
    idProducto: item.idProducto,
    cantidad: nuevaCantidad
  };

  // 4. Enviar al servidor en segundo plano
  this.carritoService.actualizarCantidad(payload).subscribe({
    next: () => {
      // Todo salió bien, no hacemos nada más
      console.log('Cantidad actualizada en servidor');
    },
    error: (err) => {
      console.error('Error al actualizar en servidor:', err);
      
      // 5. SI FALLA, REVERTIMOS LOS CAMBIOS VISUALES
      alert('Hubo un error al actualizar el carrito.');
      item.cantidad = cantidadAnterior;
      if (item.precio) {
        item.subtotal = item.precio * cantidadAnterior;
      }
      this.calcularTotal();
    }
  });
}

  eliminarItem(item: CarritoItem) {
  if(confirm('¿Deseas eliminar este producto?')) {
    
    // USAR EL ID DEL AUTH SERVICE SI EL DEL ITEM VIENE VACIO
    const idUsuarioReal = item.idUsuario || this.authService.usuarioActual?.id || 0;

    this.carritoService.eliminarItem(idUsuarioReal, item.idProducto).subscribe({
      next: () => {
        this.cargarDatos();
        this.router.navigate(['/carrito']);
      },
      error: (err) => console.error('Error al eliminar', err)
    });
  }
}

  // --- LÓGICA DE IMAGENES ---
  // Nota: Tu SP de carrito no devuelve la URL de imagen, así que la construimos 
  // basándonos en el nombre del producto, igual que en el Home.
  obtenerImagen(nombreProducto: string | undefined): string {
    if (!nombreProducto) return 'assets/no-image.png';
    
    // Asumimos que la imagen principal es siempre la primera (ej: foto1.jpg o similar)
    // O intentamos adivinar. Lo ideal seria que tu SP devuelva la ImgUrl.
    // Por ahora usaremos una logica generica o imagen por defecto si no carga.
    const nombreCarpeta = encodeURIComponent(nombreProducto.trim());
    
    // Intenta cargar una imagen por defecto o necesitas ajustar esto si tus imagenes tienen nombres especificos
    // Si no tienes el nombre exacto del archivo, esto podría fallar.
    // RECOMENDACIÓN: Modifica tu SP 'sp_carritoListar' para que devuelva la columna ImgUrl.
    
    return `${this.apiUrlBase}/api/imagenes/producto/${nombreCarpeta}/foto1.jpg`; 
  }

  manejarErrorImagen(event: any) {
    event.target.src = 'assets/no-image.png';
  }
}