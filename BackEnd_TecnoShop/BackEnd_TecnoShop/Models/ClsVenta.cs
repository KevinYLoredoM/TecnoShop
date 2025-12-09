using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsVenta
    {
        public int ven_id { get; set; }
        public int ven_usuId { get; set; }
        public decimal ven_total { get; set; }
        public decimal ven_subtotal { get; set; }
        public decimal ven_impuestos { get; set; }
        public int ven_dirEnvioId { get; set; }
        public int ven_mpId { get; set; }
        public string ven_idPago { get; set; }
        public int ven_estadoId { get; set; }

        // Campos extra para mostrar en dashboard
        public DateTime ven_fechaVenta { get; set; }
        public string usu_nombre { get; set; }
        public string usu_correo { get; set; }
        public string dir_calle { get; set; }
        public string dir_codigoPostal { get; set; }
        public string MetodoPago { get; set; }
        public string EstadoVenta { get; set; }

        public List<VentaDetalle> Detalles { get; set; } = new List<VentaDetalle>();
    }

    public class VentaDetalle
    {
        public int vdet_proId { get; set; }
        public string pro_nombre { get; set; } // nombre del producto

        public int vdet_cantidad { get; set; }
        public decimal vdet_precioUnitario { get; set; }
        public decimal vdet_subtotal { get; set; }
    }
}
