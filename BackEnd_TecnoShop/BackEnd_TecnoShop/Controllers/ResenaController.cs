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
    [EnableCors(origins: "*", headers: "*", methods: "GET, POST, DELETE, PUT, OPTIONS")]

    public class ResenaController : ApiController
    {
        ClsGestorResenas gestor = new ClsGestorResenas();

        // GET: api/resena/todas
        [HttpGet]
        [Route("api/resena/todas")]
        public IEnumerable<ClsResenas> GetTodas()
        {
            return gestor.GetTodasLasResenas();
        }

        // PUT: api/resena/responder
        [HttpPut]
        [Route("api/resena/responder")]
        public IHttpActionResult Responder([FromBody] ClsResenas resena)
        {
            // Usamos idResena y respuesta del objeto
            bool exito = gestor.ResponderResena(resena.idResena, resena.respuesta, resena.usuId);
            if (exito) return Ok(new { mensaje = "Respuesta guardada" });
            return BadRequest("Error al guardar respuesta");
        }

        // GET: api/resena/5
        [HttpGet]
        [Route("api/resena/{proId}")]
        public IHttpActionResult Get(int proId)
        {
            var resena = gestor.GetResena(proId);

            if (resena == null || resena.Count == 0)
                return NotFound();

            return Ok(resena);
        }


        // POST: api/resena
        [HttpPost]
        [Route("api/resena/agregarResena")]
        public IHttpActionResult registrar([FromBody] ClsResenas resena)
        {
            if (!ModelState.IsValid || resena == null)
            {
                return BadRequest("Datos del modelo inválidos.");
            }

            ClsGestorResenas GesResena = new ClsGestorResenas();
            try
            {
                bool guardado = GesResena.agregarResena(resena);
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

        // DELETE: api/Resena/5
        public void Delete(int id)
        {
        }
    }
}
