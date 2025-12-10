import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../Service/productos.service';
import { Producto } from '../../Models/models';
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';

// Interfaz auxiliar para los selects
interface ItemSelect {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SuperiorComponent, InferiorComponent],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss']
})
export class AdminProductosComponent implements OnInit {

  private productoService = inject(ProductoService);
  private fb = inject(FormBuilder);

  productos: Producto[] = [];
  cargando: boolean = true;
  mostrarModal: boolean = false;
  esEdicion: boolean = false;

  productoForm: FormGroup;

  // Listas Dinámicas (ya no están quemadas)
  listaCategorias: ItemSelect[] = [];
  listaMarcas: ItemSelect[] = [];

  constructor() {
    this.productoForm = this.fb.group({
      Id: [0],
      Nombre: ['', Validators.required],
      Descripcion: ['', Validators.required],
      Especificaciones: [''],
      PrecioVenta: [0, [Validators.required, Validators.min(0)]],
      PrecioCompra: [0, [Validators.required, Validators.min(0)]],
      Stock: [0, [Validators.required, Validators.min(0)]],
      CategoriaId: [null, Validators.required], // Iniciamos en null para obligar a elegir
      MarcaId: [null, Validators.required],
      ImgUrlString: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        // 1. Aquí ocurre la magia: Extraemos las listas de la DB
        this.extraerListas(data); 
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  // --- NUEVA FUNCIÓN: Extrae Categorías y Marcas únicas ---
  extraerListas(productos: Producto[]) {
    // Usamos Map para evitar duplicados (La clave es el ID)
    const catMap = new Map<number, string>();
    const marMap = new Map<number, string>();

    productos.forEach(p => {
      // Si no tenemos este ID registrado, lo guardamos
      if (p.CategoriaId && !catMap.has(p.CategoriaId)) {
        catMap.set(p.CategoriaId, p.Categoria);
      }
      if (p.MarcaId && !marMap.has(p.MarcaId)) {
        marMap.set(p.MarcaId, p.Marca);
      }
    });

    // Convertimos los Mapas a Arrays para el HTML
    this.listaCategorias = Array.from(catMap, ([id, nombre]) => ({ id, nombre }));
    this.listaMarcas = Array.from(marMap, ([id, nombre]) => ({ id, nombre }));
  }

  abrirModal(producto?: Producto) {
    this.mostrarModal = true;
    
    if (producto) {
      // MODO EDICIÓN
      this.esEdicion = true;
      const imgString = producto.ImgUrl ? producto.ImgUrl.join(', ') : '';
      
      this.productoForm.patchValue({
        ...producto,
        ImgUrlString: imgString
      });
    } else {
      // MODO CREAR
      this.esEdicion = false;
      this.productoForm.reset({
        Id: 0,
        PrecioVenta: 0, PrecioCompra: 0, Stock: 0, 
        // Si hay items en las listas, pre-seleccionamos el primero, si no null
        CategoriaId: this.listaCategorias.length > 0 ? this.listaCategorias[0].id : null,
        MarcaId: this.listaMarcas.length > 0 ? this.listaMarcas[0].id : null,
        Activo: true
      });
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarProducto() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formValue = this.productoForm.value;
    const imagenesArray = formValue.ImgUrlString.split(',').map((url: string) => url.trim());

    // Buscamos el nombre correspondiente al ID seleccionado para enviarlo completo (opcional)
    const catNombre = this.listaCategorias.find(c => c.id == formValue.CategoriaId)?.nombre || '';
    const marNombre = this.listaMarcas.find(m => m.id == formValue.MarcaId)?.nombre || '';

    const productoFinal: Producto = {
      ...formValue,
      ImgUrl: imagenesArray,
      Categoria: catNombre,
      Marca: marNombre,
      Activo: true,
      LogoUrl: '' 
    };

    if (this.esEdicion) {
      this.productoService.actualizarProducto(productoFinal).subscribe({
        next: () => {
          alert('Producto actualizado');
          this.cerrarModal();
          this.cargarProductos();
        },
        error: () => alert('Error al actualizar')
      });
    } else {
      this.productoService.registrarProducto(productoFinal).subscribe({
        next: () => {
          alert('Producto creado');
          this.cerrarModal();
          this.cargarProductos();
        },
        error: () => alert('Error al crear')
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
        },
        error: (err) => console.error(err)
      });
    }
  }
}