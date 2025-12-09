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

    }
}
