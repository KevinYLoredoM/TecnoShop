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

    public class ResenaController : ApiController
    {
        ClsGestorResenas gestor = new ClsGestorResenas();

        // GET: api/Resena
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
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

        // PUT: api/Resena/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Resena/5
        public void Delete(int id)
        {
        }
    }
}
