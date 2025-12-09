using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsDirecciones
    {
        
            public int dir_id { get; set; }
            public int dir_usuId { get; set; }
            public string dir_calle { get; set; }
            public string dir_codigoPostal { get; set; }
            public int dir_ciuId { get; set; }
            public bool dir_esPrincipal { get; set; }
        
    }
}