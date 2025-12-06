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
    }
}