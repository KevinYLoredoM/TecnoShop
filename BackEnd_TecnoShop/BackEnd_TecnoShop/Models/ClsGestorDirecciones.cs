using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsGestorDirecciones
    {

            string strconn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

            // Agregar dirección
            public int AgregarDireccion(ClsDirecciones direccion)
            {
                int nuevoId = 0;
                using (SqlConnection conn = new SqlConnection(strconn))
                {
                    SqlCommand cmd = new SqlCommand("sp_agregarDireccion", conn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@dir_usuId", direccion.dir_usuId);
                    cmd.Parameters.AddWithValue("@dir_calle", direccion.dir_calle);
                    cmd.Parameters.AddWithValue("@dir_codigoPostal", direccion.dir_codigoPostal);
                    cmd.Parameters.AddWithValue("@dir_ciuId", direccion.dir_ciuId);
                    cmd.Parameters.AddWithValue("@dir_esPrincipal", direccion.dir_esPrincipal);

                    // Parámetro de salida
                    SqlParameter pID = new SqlParameter("@NuevoId", SqlDbType.Int);
                    pID.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(pID);

                    conn.Open();
                    cmd.ExecuteNonQuery();

                    // Obtenemos el ID generado
                    nuevoId = Convert.ToInt32(pID.Value);
                }
                return nuevoId;
            }

            // Obtener direcciones por usuario
            public List<ClsDirecciones> ObtenerDireccionesPorUsuario(int usuId)
            {
                List<ClsDirecciones> lista = new List<ClsDirecciones>();
                using (SqlConnection conn = new SqlConnection(strconn))
                {
                    SqlCommand cmd = new SqlCommand("sp_obtenerDireccionesPorUsuario", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@usuId", usuId);

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        ClsDirecciones dir = new ClsDirecciones
                        {
                            dir_id = Convert.ToInt32(reader["dir_id"]),
                            dir_usuId = Convert.ToInt32(reader["dir_usuId"]),
                            dir_calle = reader["dir_calle"].ToString(),
                            dir_codigoPostal = reader["dir_codigoPostal"].ToString(),
                            dir_ciuId = Convert.ToInt32(reader["dir_ciuId"]),
                            dir_esPrincipal = Convert.ToBoolean(reader["dir_esPrincipal"])
                        };
                        lista.Add(dir);
                    }
                }
                return lista;
            }
    }

}

