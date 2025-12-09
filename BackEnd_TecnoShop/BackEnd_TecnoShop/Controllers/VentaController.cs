using BackEnd_TecnoShop.Models;
using BackEnd_TecnoShop.Models;
using Stripe;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Numerics;
using System.Web.Http;

namespace BackEnd_TecnoShop.Controllers
{
    public class VentaController : ApiController
    {
        ClsGestorVenta gestor = new ClsGestorVenta();
        // GET: api/Venta
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Venta/5
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        [Route("api/ventas/registrar")]
        public IHttpActionResult RegistrarVenta([FromBody] ClsVenta venta)
        {
            bool res = gestor.RegistrarVenta(venta);
            return Ok(res);
        }
        
        // PUT: api/Venta/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Venta/5
        public void Delete(int id)
        {
        }
    }
}
