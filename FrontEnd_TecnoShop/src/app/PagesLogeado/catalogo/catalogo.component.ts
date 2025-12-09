import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Servicios y Modelos
import { ProductoService } from '../../Service/productos.service';
import { CarritoService } from '../../Service/carrito.service';
import { AuthService } from '../../Service/auth.service';
import { Producto } from '../../Models/models';
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SuperiorComponent, InferiorComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {

  // Inyecciones
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  // Variables de Datos
  productos: Producto[] = [];
  productosFiltrados: Producto[] = []; // Usaremos esta lista para mostrar en el HTML
  
  // Variables de Filtros
  categorias: string[] = [];
  marcas: string[] = [];
  
  filtroTexto: string = '';
  categoriaSeleccionada: string = '';
  marcaSeleccionada: string = '';

  // Estados
  cargando: boolean = true;
  agregandoId: number | null = null; // Para mostrar feedback en el botón específico

  // Configuración API
  private apiUrlBase = 'https://localhost:44308';

  ngOnInit(): void {
    // 1. Escuchar la URL por si viene una búsqueda desde el Navbar
    this.route.queryParams.subscribe(params => {
      this.filtroTexto = params['buscar'] || '';
      this.cargarProductos(); // Recargamos y aplicamos filtros
    });
  }

  cargarProductos() {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.extraerFiltros(data);
        this.aplicarFiltrosLocales(); // Aplicamos filtros en memoria
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando catálogo', err);
        this.cargando = false;
      }
    });
  }

  // Filtramos en el cliente (Frontend) para mayor rapidez visual
  aplicarFiltrosLocales() {
    this.productosFiltrados = this.productos.filter(p => {
      const matchCategoria = this.categoriaSeleccionada ? p.Categoria === this.categoriaSeleccionada : true;
      const matchMarca = this.marcaSeleccionada ? p.Marca === this.marcaSeleccionada : true;
      const matchTexto = this.filtroTexto 
        ? p.Nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) || 
          p.Descripcion.toLowerCase().includes(this.filtroTexto.toLowerCase())
        : true;

      return matchCategoria && matchMarca && matchTexto;
    });
  }

  extraerFiltros(lista: Producto[]) {
    const catSet = new Set(lista.map(p => p.Categoria));
    this.categorias = Array.from(catSet).filter(c => !!c);

    const marSet = new Set(lista.map(p => p.Marca));
    this.marcas = Array.from(marSet).filter(m => !!m);
  }

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada = this.categoriaSeleccionada === cat ? '' : cat;
    this.aplicarFiltrosLocales();
  }

  seleccionarMarca(marca: string) {
    this.marcaSeleccionada = this.marcaSeleccionada === marca ? '' : marca;
    this.aplicarFiltrosLocales();
  }

  limpiarFiltros() {
    this.categoriaSeleccionada = '';
    this.marcaSeleccionada = '';
    this.filtroTexto = '';
    this.aplicarFiltrosLocales();
  }

  // --- LOGICA DE COMPRA ---
  agregarAlCarrito(prod: Producto) {
    if (!this.authService.usuarioActual) {
      alert('Debes iniciar sesión para comprar');
      return;
    }

    this.agregandoId = prod.Id; // Activa estado de carga en el botón

    const payload = {
      idUsuario: this.authService.usuarioActual.id!,
      idProducto: prod.Id,
      cantidad: 1
    };

    this.carritoService.agregarCarrito(payload).subscribe({
      next: () => {
        alert(`¡${prod.Nombre} agregado al carrito!`);
        this.agregandoId = null;
      },
      error: (err) => {
        console.error(err);
        alert('Error al agregar al carrito');
        this.agregandoId = null;
      }
    });
  }

  // --- IMAGENES ---
  obtenerImagen(prod: Producto): string {
    if (!prod.ImgUrl || prod.ImgUrl.length === 0) return 'assets/no-image.png';
    const nombreArchivo = prod.ImgUrl[0];
    const nombreCarpeta = encodeURIComponent(prod.Nombre.trim());
    return `${this.apiUrlBase}/api/imagenes/producto/${nombreCarpeta}/${nombreArchivo}`;
  }

  manejarErrorImagen(event: any) {
    event.target.src = 'assets/no-image.png';
  }
}