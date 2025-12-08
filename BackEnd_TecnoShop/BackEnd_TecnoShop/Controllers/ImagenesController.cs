using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BackEnd_TecnoShop.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "GET, POST, DELETE, OPTIONS")]
    [RoutePrefix("api/imagenes")]
    public class ImagenesController : ApiController
    {
        // GET: api/Imagenes
        [HttpGet]
        [Route("producto/{nombreProducto}/{nombreImagen}")]
        public HttpResponseMessage GetImagen(string nombreProducto, string nombreImagen)
        {
            string rutaDirectorio = HttpContext.Current.Server.MapPath("~/ImagenesProductos");
            string rutaCompleta = Path.Combine(rutaDirectorio, nombreProducto, nombreImagen);

            // 2. Verificar si el archivo existe
            if (!File.Exists(rutaCompleta))
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Imagen no encontrada.");
            }

            // 3. Leer el archivo y convertirlo a respuesta HTTP
            try
            {
                var fileData = File.ReadAllBytes(rutaCompleta);
                var response = new HttpResponseMessage(HttpStatusCode.OK);

                // Cargar los bytes en el contenido
                response.Content = new ByteArrayContent(fileData);

                // 4. Configurar el tipo de contenido (MIME Type)
                string extension = Path.GetExtension(rutaCompleta).ToLower();
                string mimeType = "image/jpeg"; // Default

                switch (extension)
                {
                    case ".png": mimeType = "image/png"; break;
                    case ".gif": mimeType = "image/gif"; break;
                    case ".webp": mimeType = "image/webp"; break;
                        // Agrega más si necesitas
                }

                response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);
                return response;
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
