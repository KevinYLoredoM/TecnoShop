import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../Service/productos.service';
import { Producto } from '../../Models/models';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InferiorComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  private productoService = inject(ProductoService);
  
  // URL base donde residen las imágenes en tu servidor C# (AJUSTA ESTO SI ES NECESARIO)
  readonly IMAGE_BASE_URL = 'local'; // EJEMPLO: Si tu API expone las imágenes en esta ruta
  
  productos: Producto[] = [];
  categorias: string[] = [];
  marcas: string[] = [];
  
  filtroTexto: string = '';
  categoriaSeleccionada: string = '';
  marcaSeleccionada: string = '';
  
  cargando: boolean = true;

  ngOnInit(): void {
    this.cargarProductos();
  }

  // NUEVA FUNCIÓN: Construye la URL completa de la imagen
  getImagenUrl(producto: Producto): string {
    const defaultImage = 'assets/no-image.png';
    
    if (!producto.ImgUrl || producto.ImgUrl.length === 0) {
      return defaultImage;
    }
    
    const relativePath = producto.ImgUrl[0];

    // Si la ruta es absoluta (empieza con http), la usamos directamente
    if (relativePath.startsWith('http')) {
      return relativePath;
    }

    // Si la ruta es relativa (como "/Laptop Xenia/01.png"), concatenamos la base
    // Usamos replace(/\s/g, '') si tu Web API no soporta espacios en las URLs
    // Dejaremos la ruta sin modificar para ser más fieles a tu backend, asumiendo que funciona
    return `${this.IMAGE_BASE_URL}${relativePath.replace(/\\/g, '/')}`; // Reemplaza \ por /

  }

  cargarProductos() {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.extraerFiltros(data);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err, 'Asegúrate de que la API y la ruta de la imagen sean correctas.');
        this.cargando = false;
      }
    });
  }

  extraerFiltros(lista: Producto[]) {
    const catSet = new Set(lista.map(p => p.Categoria));
    this.categorias = Array.from(catSet).filter((c): c is string => !!c);

    const marSet = new Set(lista.map(p => p.Marca));
    this.marcas = Array.from(marSet).filter((m): m is string => !!m);
  }

  aplicarFiltros() {
    this.cargando = true;
    this.productoService.filtrarProductos(
      this.categoriaSeleccionada, 
      this.marcaSeleccionada, 
      this.filtroTexto
    ).subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
      }
    });
  }

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada = this.categoriaSeleccionada === cat ? '' : cat;
    this.aplicarFiltros();
  }

  seleccionarMarca(marca: string) {
    this.marcaSeleccionada = this.marcaSeleccionada === marca ? '' : marca;
    this.aplicarFiltros();
  }

  limpiarTodo() {
    this.filtroTexto = '';
    this.categoriaSeleccionada = '';
    this.marcaSeleccionada = '';
    this.cargarProductos();
  }
}