using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsGestorVenta
    {
        public bool RegistrarVenta(ClsVenta venta)
        {
            string strconn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

            bool exito = false;

            using (SqlConnection con = new SqlConnection(strconn))
            {
                con.Open();
                SqlTransaction trans = con.BeginTransaction();

                try
                {
                    // Insertar venta (obtener ID)
                    SqlCommand cmdVenta = new SqlCommand("sp_insertarVenta", con, trans);
                    cmdVenta.CommandType = CommandType.StoredProcedure;

                    cmdVenta.Parameters.AddWithValue("@ven_usuId", venta.ven_usuId);
                    cmdVenta.Parameters.AddWithValue("@ven_total", venta.ven_total);
                    cmdVenta.Parameters.AddWithValue("@ven_subtotal", venta.ven_subtotal);
                    cmdVenta.Parameters.AddWithValue("@ven_impuestos", venta.ven_impuestos);
                    cmdVenta.Parameters.AddWithValue("@ven_dirEnvioId", venta.ven_dirEnvioId);
                    cmdVenta.Parameters.AddWithValue("@ven_mpId", venta.ven_mpId);
                    cmdVenta.Parameters.AddWithValue("@ven_estadoId", venta.ven_estadoId);
                    cmdVenta.Parameters.AddWithValue("@ven_idPago", venta.ven_idPago);


                    SqlParameter pID = new SqlParameter("@NuevoId", SqlDbType.Int);
                    pID.Direction = ParameterDirection.Output;
                    cmdVenta.Parameters.Add(pID);

                    cmdVenta.ExecuteNonQuery();
                    int nuevoIdVenta = Convert.ToInt32(pID.Value);

                    // Insertar detalle
                    foreach (var det in venta.Detalles)
                    {
                        SqlCommand cmdDet = new SqlCommand("sp_insertarVentaDetalle", con, trans);
                        cmdDet.CommandType = CommandType.StoredProcedure;

                        cmdDet.Parameters.AddWithValue("@vdet_venId", nuevoIdVenta);
                        cmdDet.Parameters.AddWithValue("@vdet_proId", det.vdet_proId);
                        cmdDet.Parameters.AddWithValue("@vdet_cantidad", det.vdet_cantidad);
                        cmdDet.Parameters.AddWithValue("@vdet_precioUnitario", det.vdet_precioUnitario);
                        cmdDet.Parameters.AddWithValue("@vdet_subtotal", det.vdet_subtotal);

                        cmdDet.ExecuteNonQuery();
                    }

                    trans.Commit();
                    exito = true;
                }
                catch
                {
                    trans.Rollback();
                    exito = false;
                }
            }

            return exito;
        }
        public List<ClsVenta> MostrarVentasPorUsuario(int usuId)
        {
            string strconn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

            List<ClsVenta> listaVentas = new List<ClsVenta>();

            using (SqlConnection conn = new SqlConnection(strconn))
            {
                SqlCommand cmd = new SqlCommand("sp_mostrarVentasPorUsuario", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@usuId", usuId);

                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                // Diccionario para evitar duplicados y agrupar detalles
                Dictionary<int, ClsVenta> dictVentas = new Dictionary<int, ClsVenta>();

                while (reader.Read())
                {
                    int venId = Convert.ToInt32(reader["ven_id"]);

                    ClsVenta venta;
                    if (!dictVentas.ContainsKey(venId))
                    {
                        venta = new ClsVenta
                        {
                            ven_id = venId,
                            ven_fechaVenta = Convert.ToDateTime(reader["ven_fechaVenta"]),
                            ven_total = Convert.ToDecimal(reader["ven_total"]),
                            ven_subtotal = Convert.ToDecimal(reader["ven_subtotal"]),
                            ven_impuestos = Convert.ToDecimal(reader["ven_impuestos"]),

                            usu_nombre = reader["usu_nombres"].ToString(),
                            usu_correo = reader["usu_correo"].ToString(),

                            dir_calle = reader["dir_calle"].ToString(),
                            dir_codigoPostal = reader["dir_codigoPostal"].ToString(),

                            MetodoPago = reader["MetodoPago"].ToString(),
                            EstadoVenta = reader["EstadoVenta"].ToString()
                        };

                        dictVentas.Add(venId, venta);
                        listaVentas.Add(venta);
                    }
                    else
                    {
                        venta = dictVentas[venId];
                    }

                    // Agregar detalle de producto
                    VentaDetalle detalle = new VentaDetalle
                    {
                        vdet_proId = Convert.ToInt32(reader["vdet_proId"]),
                        pro_nombre = reader["pro_nombre"].ToString(),
                        vdet_cantidad = Convert.ToInt32(reader["vdet_cantidad"]),
                        vdet_precioUnitario = Convert.ToDecimal(reader["vdet_precioUnitario"]),
                        vdet_subtotal = Convert.ToDecimal(reader["vdet_subtotal"])
                    };

                    venta.Detalles.Add(detalle);
                }

                reader.Close();
            }

            return listaVentas;
        }


    }
}
