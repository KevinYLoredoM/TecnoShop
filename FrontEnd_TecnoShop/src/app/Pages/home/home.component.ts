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

  productos: Producto[] = [];
  
  // Listas para llenar el Sidebar
  categorias: string[] = [];
  marcas: string[] = [];
  
  // Variables para el binding de los filtros
  filtroTexto: string = '';
  categoriaSeleccionada: string = '';
  marcaSeleccionada: string = '';
  
  cargando: boolean = true;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.extraerFiltros(data); // Generamos los filtros dinámicamente
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.cargando = false;
      }
    });
  }

  // Extrae categorías y marcas únicas de la lista de productos
  extraerFiltros(lista: Producto[]) {
    // 1. Categorías
    const catSet = new Set(lista.map(p => p.Categoria));
    // El filtro '(c): c is string => !!c' elimina nulos y undefined para calmar a TypeScript
    this.categorias = Array.from(catSet).filter((c): c is string => !!c);

    // 2. Marcas
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
        console.error('Error filtrando:', err);
        this.cargando = false;
      }
    });
  }

  // Click en una categoría del sidebar
  seleccionarCategoria(cat: string) {
    // Si ya estaba seleccionada, la quitamos (toggle). Si no, la ponemos.
    this.categoriaSeleccionada = this.categoriaSeleccionada === cat ? '' : cat;
    this.aplicarFiltros();
  }

  // Click en una marca del sidebar
  seleccionarMarca(marca: string) {
    this.marcaSeleccionada = this.marcaSeleccionada === marca ? '' : marca;
    this.aplicarFiltros();
  }

  limpiarTodo() {
    this.filtroTexto = '';
    this.categoriaSeleccionada = '';
    this.marcaSeleccionada = '';
    this.cargarProductos(); // Recarga inicial
  }
}