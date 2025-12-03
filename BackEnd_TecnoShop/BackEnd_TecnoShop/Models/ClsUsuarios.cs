using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsUsuarios
    {
        public int id { get; set; }
        public string nombres { get; set; }
        public string apellidos { get; set; }
        public string correo { get; set; }
        public string contrasena { get; set; }
        public string telefono { get; set; }
        public int rol { get; set; }

        public ClsUsuarios()
        {

        }

        public ClsUsuarios(int id, string nombres, string apellidos, string correo,
            string contrasena, string telefono, int rol)
        {
            this.id = id;
            this.nombres = nombres;
            this.apellidos = apellidos;
            this.correo = correo;
            this.contrasena = contrasena;
            this.telefono = telefono;
            this.rol = rol;
        }
    }
}
