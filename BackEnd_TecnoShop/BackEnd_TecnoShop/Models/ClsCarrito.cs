using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsCarrito
    {
        public int idCarrito;
        public int idUsuario;
        public int idProducto;
        public int cantidad;
        public string proNombre;
        public decimal precio;
        public decimal subtotal;
        public DateTime fecha;

        public ClsCarrito() { }

        public ClsCarrito(int idCarrito, int idUsuario, int idProducto, int cantidad, string proNombre, decimal precio, decimal subtotal, DateTime fecha)
        {
            this.idCarrito = idCarrito;
            this.idUsuario = idUsuario;
            this.idProducto = idProducto;
            this.cantidad = cantidad;
            this.proNombre = proNombre;
            this.precio = precio;
            this.subtotal = subtotal;
            this.fecha = fecha;
        }
    }
}