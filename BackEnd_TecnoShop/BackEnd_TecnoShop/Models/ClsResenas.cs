using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsResenas
    {
        public int idResena;
        public int usuId;
        public int proId;
        public byte calificacion;
        public string comentario;
        public DateTime fecha;
        public string nombre;

        public ClsResenas() { }

        public ClsResenas(int idResena, int usuId, int proId, byte calificacion, string comentario, DateTime fecha, string nombre)
        {
            this.idResena = idResena;
            this.usuId = usuId;
            this.proId = proId;
            this.calificacion = calificacion;
            this.comentario = comentario;
            this.fecha = fecha;
            this.nombre = nombre;
        }
    }
}