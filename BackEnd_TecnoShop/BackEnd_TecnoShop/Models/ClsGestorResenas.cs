using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Configuration;

namespace BackEnd_TecnoShop.Models
{
    public class ClsGestorResenas
    {
        string strconn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

        public List<ClsResenas> GetResena(int proId)
        {
            List<ClsResenas> ListResena = new List<ClsResenas>();

            using (SqlConnection conn = new SqlConnection(strconn))
            {
                conn.Open();

                SqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "sp_mostrarReseñas";
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@proId", proId);

                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    ClsResenas resena = new ClsResenas();
                    resena.calificacion = Convert.ToByte(r["res_calificacion"]);
                    resena.comentario = r["res_comentario"].ToString();
                    resena.nombre = r["nombreUsuario"].ToString();
                    resena.fecha =Convert.ToDateTime( r["res_fecha"]);
                    if (r["resp_texto"] != DBNull.Value)
                    {
                        resena.respuesta = r["resp_texto"].ToString();
                    }
                    if (r["resp_fecha"] != DBNull.Value)
                    {
                        resena.fechaRespuesta = Convert.ToDateTime(r["resp_fecha"]);
                    }

                    ListResena.Add(resena);
                }

                conn.Close();
            }
            return ListResena;
        }

        public bool agregarResena(ClsResenas resena)
        {

            bool res = false;
            using (SqlConnection conn = new SqlConnection(strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "sp_reseñasClientes";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@usuId", resena.usuId);
                cmd.Parameters.AddWithValue("@proId", resena.proId);
                cmd.Parameters.AddWithValue("@calificacion", resena.calificacion);
                cmd.Parameters.AddWithValue("@comentario", resena.comentario);

                try
                {
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    res = true;
                }
                catch (SqlException ex)
                {
                    Console.WriteLine(ex.Message);
                    res = false;
                    throw;
                }
                finally
                {
                    cmd.Parameters.Clear();
                    conn.Close();
                }
                return res;
            }
        }
        public List<ClsResenas> GetTodasLasResenas()
        {
            List<ClsResenas> lista = new List<ClsResenas>();
            using (SqlConnection conn = new SqlConnection(strconn))
            {
                conn.Open();
                SqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "sp_resenasListarTodas"; // El SP que creamos arriba
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    ClsResenas res = new ClsResenas();
                    res.idResena = Convert.ToInt32(r["res_id"]);
                    res.nombreUsuario = r["nombreUsuario"].ToString();
                    res.nombreProducto = r["nombreProducto"].ToString();
                    res.calificacion = Convert.ToByte(r["res_calificacion"]);
                    res.comentario = r["res_comentario"].ToString();
                    res.fecha = Convert.ToDateTime(r["res_fecha"]);

                    // Validamos nulos para la respuesta
                    if (r["res_respuesta"] != DBNull.Value)
                        res.respuesta = r["res_respuesta"].ToString();

                    if (r["res_fechaRespuesta"] != DBNull.Value)
                        res.fechaRespuesta = Convert.ToDateTime(r["res_fechaRespuesta"]);

                    lista.Add(res);
                }
                conn.Close();
            }
            return lista;
        }

        public bool ResponderResena(int idResena, string respuesta, int adminId)
        {
            bool res = false;
            using (SqlConnection conn = new SqlConnection(strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                // Usamos el nuevo SP
                cmd.CommandText = "sp_resenasResponder";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@resId", idResena);
                cmd.Parameters.AddWithValue("@usuId", adminId); // ID del Admin
                cmd.Parameters.AddWithValue("@texto", respuesta);

                try
                {
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    res = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    res = false;
                }
                finally { conn.Close(); }
            }
            return res;
        }
    }
}