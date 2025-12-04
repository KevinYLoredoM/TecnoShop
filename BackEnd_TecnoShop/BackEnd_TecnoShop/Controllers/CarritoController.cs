using BackEnd_TecnoShop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BackEnd_TecnoShop.Controllers
{
    public class CarritoController : ApiController
    {
        ClsGestorCarrito gestor = new ClsGestorCarrito();

        // GET: api/Carrito
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Carrito/5
        [HttpGet]
        [Route("api/carrito/{usuId}")]
        public IHttpActionResult Get(int usuId)
        {
            var carrito = gestor.GetCarrito(usuId);

            if(carrito == null || carrito.Count == 0) 
                return NotFound();

            return Ok(carrito);
        }

        // POST: api/Carrito
        public IHttpActionResult registrar([FromBody] ClsCarrito carrito)
        {
            if (!ModelState.IsValid || carrito == null)
            {
                return BadRequest("Datos del modelo inválidos.");
            }

            ClsGestorCarrito GesCarrito = new ClsGestorCarrito();
            try
            {
                bool guardado = GesCarrito.agregarCarrito(carrito);
                if (guardado)
                {
                    return Ok(new { mensaje = "Se Guardo Correcta Mente" });
                }
                else
                {
                    return BadRequest("No se pudo guardar en la base de datos.");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // PUT: api/Carrito/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Carrito/5
        public void Delete(int id)
        {
        }
    }
}
