using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace BackEnd_TecnoShop.Models
{
    public class ClsGestorProductos
    {
        string Strconn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();
        public List<ClsProductos> GetProductos(string Categoria = "", string Marca = "", string Nombre = "")
        {
            List<ClsProductos> ListProductos = new List<ClsProductos>();

            using (SqlConnection conn = new SqlConnection(Strconn))
            {
                conn.Open();

                SqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "Productos_ALL";
                cmd.CommandType = CommandType.StoredProcedure;

                // 👇 Agregar parámetro del filtro
                if (string.IsNullOrWhiteSpace(Categoria))
                    cmd.Parameters.AddWithValue("@Categoria", DBNull.Value);
                else
                    cmd.Parameters.AddWithValue("@Categoria", Categoria);
                
                if (string.IsNullOrWhiteSpace(Marca))
                    cmd.Parameters.AddWithValue("@Marca", DBNull.Value);
                else
                    cmd.Parameters.AddWithValue("@Marca", Marca);
                
                if (string.IsNullOrWhiteSpace(Nombre))
                    cmd.Parameters.AddWithValue("@Nombre", DBNull.Value);
                else
                    cmd.Parameters.AddWithValue("@Nombre", Nombre);

                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    int id = r.GetInt32(0);
                    string nombre = r.GetString(1);
                    string descripcion = r.GetString(2);
                    string especificaciones = r.GetString(3);
                    decimal precioVenta = r.GetDecimal(4);
                    decimal precioCompra = r.GetDecimal(5);
                    int stock = r.GetInt32(6);
                    int categoriaid = r.GetInt32(7);
                    string categoria = r.GetString(8);
                    bool activo = r.GetBoolean(9);
                    int marcaid = r.GetInt32(10);
                    string marca = r.GetString(11);
                    string logoUrl = r.GetString(12);
                    string imgUrl = r.GetString(13);

                    // Convertir string → List<string>
                    List<string> listaImg = imgUrl.Split(',').ToList();

                    ClsProductos productos = new ClsProductos(id, nombre, descripcion, especificaciones, precioVenta, precioCompra,
                        stock, categoriaid, categoria, activo, marcaid, marca, logoUrl, listaImg);

                    ListProductos.Add(productos);
                }
                r.Close();
                conn.Close();
            }
            return ListProductos;
        }

        public bool AddProductos(ClsProductos productos)
        {
            bool res = false;
            using (SqlConnection conn = new SqlConnection(Strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "Productos_ADD";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Nombre", productos.Nombre);
                cmd.Parameters.AddWithValue("@Descripcion", productos.Descripcion);
                cmd.Parameters.AddWithValue("@Especificaciones", productos.Especificaciones);
                cmd.Parameters.AddWithValue("@PrecioVenta", productos.PrecioVenta);
                cmd.Parameters.AddWithValue("@PrecioCompra", productos.PrecioCompra);
                cmd.Parameters.AddWithValue("@Stock", productos.Stock);
                cmd.Parameters.AddWithValue("@CategoriaId", productos.CategoriaId);
                cmd.Parameters.AddWithValue("@MarcaId", productos.MarcaId);
                cmd.Parameters.AddWithValue("@ImgUrl", productos.ImgUrl);

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


        public bool UpdateProductos(int IdProducto, ClsProductos productos)
        {
            bool res = false;
            using (SqlConnection conn = new SqlConnection(Strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "Productos_Update";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ProductoId", IdProducto);
                cmd.Parameters.AddWithValue("@Nombre", productos.Nombre);
                cmd.Parameters.AddWithValue("@Descripcion", productos.Descripcion);
                cmd.Parameters.AddWithValue("@Especificaciones", productos.Especificaciones);
                cmd.Parameters.AddWithValue("@ImgUrl", productos.ImgUrl);

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

        public bool DeleteProductos(int Id)
        {
            bool res = false;
            using (SqlConnection conn = new SqlConnection(Strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "Productos_Delete";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ProductoId", Id);
                cmd.Parameters.AddWithValue("@Activo", 0);

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