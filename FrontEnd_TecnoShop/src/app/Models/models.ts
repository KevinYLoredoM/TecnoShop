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