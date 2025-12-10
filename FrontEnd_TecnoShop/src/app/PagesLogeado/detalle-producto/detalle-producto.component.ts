import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Componentes
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';
// Servicios
import { ProductoService } from '../../Service/productos.service';
import { CarritoService } from '../../Service/carrito.service';
import { AuthService } from '../../Service/auth.service';
import { ResenaService } from '../../Service/resena.service';
import { Producto, Resena } from '../../Models/models';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SuperiorComponent, InferiorComponent],
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent implements OnInit {

  // Inyecciones
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  public authService = inject(AuthService);
  private resenaService = inject(ResenaService);

  // Variables
  producto: Producto | null = null;
  cargando: boolean = true;
  agregando: boolean = false;
  
  // Variables para la imagen
  imagenSeleccionada: string = '';
  private apiUrlBase = 'https://localhost:44308';

  // Variables Reseñas
  listaResenas: Resena[] = [];
  calificacionNueva: number = 0;
  comentarioNuevo: string = '';
  enviandoResena: boolean = false;
  promedioCalificacion: number = 0;

  ngOnInit(): void {
    // Obtener el ID de la URL
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.cargarProducto(id);
        this.cargarResenas(id);
      } else {
        this.router.navigate(['/catalogo']); // Si no hay ID, regresar
      }
    });
  }

  cargarProducto(id: number) {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (lista) => {
        const encontrado = lista.find(p => p.Id === id);
        if (encontrado) {
          this.producto = encontrado;
          // Inicializar la imagen principal
          this.imagenSeleccionada = this.obtenerImagen(encontrado);
        } else {
          alert('Producto no encontrado');
          this.router.navigate(['/catalogo']);
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  agregarAlCarrito() {
    if (!this.producto) return;

    if (!this.authService.usuarioActual) {
      alert('Debes iniciar sesión para comprar');
      this.router.navigate(['/login']);
      return;
    }

    this.agregando = true;

    const payload = {
      idUsuario: this.authService.usuarioActual.id!,
      idProducto: this.producto.Id,
      cantidad: 1
    };

    this.carritoService.agregarCarrito(payload).subscribe({
      next: () => {
        alert('Producto agregado al carrito 🛒');
        this.agregando = false;
      },
      error: () => {
        alert('Error al agregar al carrito');
        this.agregando = false;
      }
    });
  }

  // --- LOGICA IMAGENES ---
  obtenerImagen(prod: Producto): string {
    if (!prod.ImgUrl || prod.ImgUrl.length === 0) return 'assets/no-image.png';
    const nombreArchivo = prod.ImgUrl[0]; // Tomamos la primera imagen
    const nombreCarpeta = encodeURIComponent(prod.Nombre.trim());
    return `${this.apiUrlBase}/api/imagenes/producto/${nombreCarpeta}/${nombreArchivo}`;
  }

  // --- LÓGICA DE RESEÑAS ---

  cargarResenas(proId: number) {
    this.resenaService.getResenas(proId).subscribe({
      next: (data) => {
        this.listaResenas = data;
        this.calcularPromedio();
      },
      error: (err) => console.log('Sin reseñas o error', err)
    });
  }

  calcularPromedio() {
    if (this.listaResenas.length === 0) {
      this.promedioCalificacion = 0;
      return;
    }
    const suma = this.listaResenas.reduce((acc, curr) => acc + curr.calificacion, 0);
    this.promedioCalificacion = suma / this.listaResenas.length;
  }

  // Al hacer clic en una estrella del formulario
  seleccionarEstrella(valor: number) {
    this.calificacionNueva = valor;
  }

  enviarResena() {
    if (!this.authService.usuarioActual) {
      alert('Inicia sesión para opinar.');
      this.router.navigate(['/login']);
      return;
    }
    if (this.calificacionNueva === 0) {
      alert('Por favor selecciona una calificación de estrellas.');
      return;
    }
    if (!this.comentarioNuevo.trim()) {
      alert('Escribe un comentario.');
      return;
    }

    this.enviandoResena = true;

    const nuevaResena: Resena = {
      usuId: this.authService.usuarioActual.id!,
      proId: this.producto!.Id,
      calificacion: this.calificacionNueva,
      comentario: this.comentarioNuevo
    };

    this.resenaService.agregarResena(nuevaResena).subscribe({
      next: () => {
        alert('¡Gracias por tu opinión!');
        this.enviandoResena = false;
        // Limpiar form
        this.calificacionNueva = 0;
        this.comentarioNuevo = '';
        // Recargar lista
        this.cargarResenas(this.producto!.Id);
      },
      error: (err) => {
        console.error(err);
        alert('Error al enviar reseña.');
        this.enviandoResena = false;
      }
    });
  }

  manejarErrorImagen(event: any) {
    event.target.src = 'assets/no-image.png';
  }
}