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
    [EnableCors(origins: "*", headers:"*", methods:"GET, POST, DELETE, OPTIONS")]
    public class UsuariosController : ApiController
    {
        // GET: api/Usuarios
        [HttpGet]
        [Route("api/usuarios")]
        public IEnumerable<ClsUsuarios> Get()
        {
            ClsGestorUsuarios GesUsuarios = new ClsGestorUsuarios();
            return GesUsuarios.GetUsuarios();
        }

        // GET: api/Usuarios/5
        [HttpGet]
        [Route("api/usuarios")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Usuarios
        [HttpPost]
        [Route("api/usuarios/registrar")]
        public IHttpActionResult Registrar([FromBody] ClsUsuarios usuarios)
        {
            if (!ModelState.IsValid || usuarios == null)
            {
                return BadRequest("Datos del modelo inválidos.");
            }

            ClsGestorUsuarios GesUsuarios = new ClsGestorUsuarios();
            try
            {
                bool guardado = GesUsuarios.AddUsuarios(usuarios);
                if (guardado)
                {
                    return Ok(new { mensaje = "Usuario registrado exitosamente" });
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

        // POST: api/Usuarios/Login
        [HttpPost]
        [Route("api/Usuarios/login")]
        public IHttpActionResult Login([FromBody] ClsUsuarios loginData)
        {
            ClsGestorUsuarios GesUsuarios = new ClsGestorUsuarios();

            ClsUsuarios usuarioValido = GesUsuarios.ValidarUsuario(loginData.correo, loginData.contrasena);

            if (usuarioValido != null)
            {
                return Ok(usuarioValido); // Retorna 200 OK y el objeto usuario
            }
            else
            {
                return Unauthorized(); // Retorna 401 si falló
            }
        }

        // PUT: api/Usuarios/5
        [HttpPut]
        [Route("api/usuarios/update")]
        public bool Put(int id, [FromBody] ClsUsuarios usuarios)
        {
            ClsGestorUsuarios GesUsuarios = new ClsGestorUsuarios();
            bool res = GesUsuarios.UpdateProductos(id, usuarios);

            return res;
        }

        // DELETE: api/Usuarios/5
        [HttpGet]
        [Route("api/usuarios/delete")]
        public void Delete(int id)
        {
        }
    }
}
