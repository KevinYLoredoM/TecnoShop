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

        public List<VentaDetalle> Detalles { get; set; }
    }

    public class VentaDetalle
    {
        public int vdet_proId { get; set; }
        public int vdet_cantidad { get; set; }
        public decimal vdet_precioUnitario { get; set; }
        public decimal vdet_subtotal { get; set; }
    }
}
