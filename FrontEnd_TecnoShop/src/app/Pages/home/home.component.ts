import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../Service/productos.service';
import { Producto } from '../../Models/models';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';
import { SuperiorComponent } from '../../Navbar/superior/superior.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SuperiorComponent, InferiorComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  private productoService = inject(ProductoService);
  
  // ⚠️ CAMBIA ESTO POR EL PUERTO REAL DE TU API
  private apiUrlBase = 'https://localhost:44308';

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

  // ... (Tus funciones de cargarProductos, extraerFiltros, aplicarFiltros quedan IGUAL) ...
  cargarProductos() {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.extraerFiltros(data);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
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