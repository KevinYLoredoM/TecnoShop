export interface Usuario {
  id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  telefono: string;
  rol: number;
}

export interface Usuario {
  id?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  telefono: string;
  rol: number;
}

export interface Producto {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Especificaciones: string;
  PrecioVenta: number;
  PrecioCompra: number;
  Stock: number;
  CategoriaId: number;
  Categoria: string;       
  Activo: boolean;
  MarcaId: number;
  Marca: string;           
  LogoUrl: string;
  ImgUrl: string[]; // Tu backend envía una lista de strings
}

export interface CarritoItem {
  idCarrito?: number;
  idUsuario: number;
  idProducto: number;
  cantidad: number;
  proNombre?: string;
  precio?: number;
  subtotal?: number;
  fecha?: string;
}

export interface Resena {
  idResena?: number;
  usuId: number;
  proId: number;
  calificacion: number;
  comentario: string;
  fecha?: string;  // Viene del servidor
  nombre?: string; // Nombre del usuario que comentó (viene del SP)
  respuesta?: string;
  nombreProducto?: string; // Nombre del producto (viene del SP)
  nombreUsuario?: string; // Nombre del usuario (viene del SP)
  fechaRespuesta?: string; // Fecha de la respuesta (viene del SP)
}