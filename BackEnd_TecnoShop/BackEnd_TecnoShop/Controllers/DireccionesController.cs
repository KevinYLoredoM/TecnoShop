using BackEnd_TecnoShop.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Numerics;
using System.Web.Http;

namespace BackEnd_TecnoShop.Controllers
{
    public class DireccionesController : ApiController
    {
        ClsGestorDirecciones gestor = new ClsGestorDirecciones();

        // GET: api/Direcciones
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet]
        [Route("api/direcciones/usuario/{usuId}")]
        public IHttpActionResult ObtenerDireccionesUsuario(int usuId)
        {
            var lista = gestor.ObtenerDireccionesPorUsuario(usuId);
            return Ok(lista);
        }

        [HttpPost]
        [Route("api/direcciones/agregar")]
        public IHttpActionResult AgregarDireccion([FromBody] ClsDirecciones direccion)
        {
            // Agregamos la dirección, devuelve el ID generado
            var id = gestor.AgregarDireccion(direccion);
            return Ok(new { id = id, mensaje = "Dirección agregada correctamente" });
        }

        // PUT: api/Direcciones/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Direcciones/5
        public void Delete(int id)
        {
        }
    }
}
