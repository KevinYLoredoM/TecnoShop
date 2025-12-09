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
using System.Web.Http.Cors;

namespace BackEnd_TecnoShop.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "GET, POST, DELETE, PUT, OPTIONS")]
    public class VentaController : ApiController
    {
        ClsGestorVenta gestor = new ClsGestorVenta();
        // GET: api/Venta
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet]
        [Route("api/ventas/usuario/{usuId}")]
        public IHttpActionResult MostrarVentasUsuario(int usuId)
        {
            var ventas = gestor.MostrarVentasPorUsuario(usuId);
            return Ok(ventas);
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
