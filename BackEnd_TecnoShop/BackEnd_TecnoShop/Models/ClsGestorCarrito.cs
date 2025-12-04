using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsGestorCarrito
    {
        string strconn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

        public List<ClsCarrito> GetCarrito(int usuId)
        {
            List<ClsCarrito> ListarCarrito = new List<ClsCarrito>();

            using (SqlConnection conn = new SqlConnection(strconn))
            {
                conn.Open();

                SqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "sp_carritoListar";
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@usuId", usuId);

                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    ClsCarrito carrito = new ClsCarrito();

                    carrito.idCarrito = Convert.ToInt32(r["car_id"]);
                    carrito.idProducto = Convert.ToInt32(r["pro_id"]);
                    carrito.proNombre = r["pro_nombre"].ToString();
                    carrito.precio = Convert.ToDecimal(r["pro_precioVenta"]);
                    carrito.cantidad = Convert.ToInt32(r["car_cantidad"]);
                    carrito.subtotal = Convert.ToDecimal(r["subtotal"]);
                    carrito.fecha = Convert.ToDateTime(r["car_fechaAgregado"]);

                    ListarCarrito.Add(carrito);
                }
            }

            return ListarCarrito;
        }

        public bool agregarCarrito(ClsCarrito carrito)
        {

            bool res = false;
            using (SqlConnection conn = new SqlConnection(strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "sp_agregarCarrito";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@usuId", carrito.idUsuario);
                cmd.Parameters.AddWithValue("@proId", carrito.idProducto);
                cmd.Parameters.AddWithValue("@cantidad", carrito.cantidad);

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
        public bool actualizarCarrito(ClsCarrito carrito)
        {
            bool res = false;
            using (SqlConnection conn = new SqlConnection(strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "sp_carritoActualizarCantidad";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@usuId", carrito.idUsuario);
                cmd.Parameters.AddWithValue("@proId", carrito.idProducto);
                cmd.Parameters.AddWithValue("@cantidad", carrito.cantidad);
              
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
                    throw;
                }
                finally
                {
                    cmd.Parameters.Clear();
                    conn.Close();
                }
            }
            return res;
        }

        public bool eliminarCarrito(ClsCarrito carrito)
        {
            bool res = false;
            using (SqlConnection conn = new SqlConnection(strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "sp_carritoEliminar";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@usuId", carrito.idUsuario);
                cmd.Parameters.AddWithValue("@proId", carrito.idProducto);

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
                    throw;
                }
                finally
                {
                    cmd.Parameters.Clear();
                    conn.Close();
                }
            }
            return res;
        }

        public bool vaciarCarrito(ClsCarrito carrito)
        {
            bool res = false;
            using (SqlConnection conn = new SqlConnection(strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "sp_vaciarCarrito";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@usuId", carrito.idUsuario);

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
                    throw;
                }
                finally
                {
                    cmd.Parameters.Clear();
                    conn.Close();
                }
            }
            return res;
        }
    }
}
   