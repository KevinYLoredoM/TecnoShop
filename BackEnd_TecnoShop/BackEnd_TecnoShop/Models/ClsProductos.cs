using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsProductos
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Especificaciones { get; set; }
        public decimal PrecioVenta { get; set; }
        public decimal PrecioCompra { get; set; }
        public int Stock { get; set; }
        public int CategoriaId { get; set; }
        public string Categoria { get; set; }
        public bool Activo { get; set; }
        public int MarcaId { get; set; }
        public string Marca { get; set; }
        public string LogoUrl { get; set; }
        public List<string> ImgUrl { get; set; }

        public ClsProductos()
        {

        }
        public ClsProductos(int id, string nombre, string descripcion, string especificaciones,
            decimal precioVenta, decimal precioCompra, int stock, int categoriaid, string categorianombre,
            bool activo, int marcaid, string marcanombre, string logoUrl, List<string> imgUrl)
        {
            Id = id;
            Nombre = nombre;
            Descripcion = descripcion;
            Especificaciones = especificaciones;
            PrecioVenta = precioVenta;
            PrecioCompra = precioCompra;
            Stock = stock;
            CategoriaId = categoriaid;
            Categoria = categorianombre;
            Activo = activo;
            MarcaId = marcaid;
            Marca = marcanombre;
            LogoUrl = logoUrl;
            ImgUrl = imgUrl;
        }
    }
}