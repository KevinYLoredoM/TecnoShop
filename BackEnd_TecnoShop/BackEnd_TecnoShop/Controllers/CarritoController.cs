using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BackEnd_TecnoShop.Models;
namespace BackEnd_TecnoShop.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "GET, POST, DELETE, OPTIONS")]

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
        [HttpPost]
        [Route("api/carrito/agregarCarrito")]
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
        [HttpPut]
        [Route("api/carrito/actualizarCarrito")]
        public IHttpActionResult actualizar([FromBody] ClsCarrito carrito)
        {
            if (carrito == null)
                return BadRequest("El cuerpo de la solicitud está vacío.");

            if (!ModelState.IsValid)
                return BadRequest("Modelo inválido.");

            try
            {
                var gestor = new ClsGestorCarrito();
                bool actualizado = gestor.actualizarCarrito(carrito);

                if (!actualizado)
                    return BadRequest("No se actualizó el carrito. Revisa usuId y proId.");

                return Ok(new { mensaje = "Actualización correcta", success = true });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        // DELETE: api/Carrito/5
        [HttpDelete]
        [Route("api/carrito/{usuId}/{proId}")]
        public IHttpActionResult elimiarCarrito(int usuId, int proId)
        {
            var carrito = new ClsCarrito
            {
                idUsuario = usuId,
                idProducto = proId
            };

            bool res = gestor.eliminarCarrito(carrito);

            if (res)
                return Ok(new { mensaje = "Producto eliminado del carrito" });

            return BadRequest("No se pudo eliminar o no existe en el carrito");
        }

        // DELETE: api/Carrito/5
        [HttpDelete]
        [Route("api/carrito/{usuId}")]
        public IHttpActionResult vaciarCarrito(int usuId)
        {
            var carrito = new ClsCarrito
            {
                idUsuario = usuId
            };

            bool res = gestor.vaciarCarrito(carrito);

            if (res)
                return Ok(new { mensaje = "Carrito vaciado correctamente" });

            return BadRequest("No se pudo vaciar el carrito");
        }
    }
}
