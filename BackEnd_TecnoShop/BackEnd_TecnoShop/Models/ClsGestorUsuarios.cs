using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
//using System.Web.Helpers;

namespace BackEnd_TecnoShop.Models
{
    public class ClsGestorUsuarios
    {
        string strconn = ConfigurationManager.ConnectionStrings["BDLocal"].ToString();

        public List<ClsUsuarios> GetUsuarios()
        {
            List<ClsUsuarios> ListUsuarios = new List<ClsUsuarios>();

            using (SqlConnection conn = new SqlConnection(strconn))
            {
                conn.Open();

                SqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "sp_usuariosMostrarClienteALL2";
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    ClsUsuarios usuario = new ClsUsuarios();
                    usuario.id = Convert.ToInt32(r["usu_id"]);
                    usuario.nombres = r["usu_nombres"].ToString();
                    usuario.apellidos = r["usu_apellidos"].ToString();
                    usuario.correo = r["usu_correo"].ToString();
                    usuario.contrasena = r["usu_contrasena"].ToString();
                    usuario.telefono = r["usu_telefono"].ToString();

                    ListUsuarios.Add(usuario);
                }

                conn.Close();
            }
            return ListUsuarios;
        }
        public bool AddUsuarios(ClsUsuarios usuarios)
        {
            string hashContrasena = BCrypt.Net.BCrypt.HashPassword(usuarios.contrasena);
            bool res = false;
            using (SqlConnection conn = new SqlConnection(strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "sp_usuariosADD";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@nombres", usuarios.nombres);
                cmd.Parameters.AddWithValue("@apellidos", usuarios.apellidos);
                cmd.Parameters.AddWithValue("@correo", usuarios.correo);
                cmd.Parameters.AddWithValue("@contrasena", hashContrasena);
                cmd.Parameters.AddWithValue("@telefono", usuarios.telefono);
                cmd.Parameters.AddWithValue("@rolUsuario", 2);

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
        public ClsUsuarios ValidarUsuario(string correo, string contrasena)
        {
            List<ClsUsuarios> todos = GetUsuarios();

            ClsUsuarios usuarioEncontrado = todos.FirstOrDefault(u => u.correo == correo);

            if (usuarioEncontrado != null)
            {
                bool passwordValido = BCrypt.Net.BCrypt.Verify(contrasena, usuarioEncontrado.contrasena);

                if (passwordValido)
                {
                    usuarioEncontrado.contrasena = "";
                    return usuarioEncontrado;
                }
            }

            return null;
        }
        public bool UpdateProductos(int IdProducto, ClsUsuarios usuarios)
        {
            bool res = false;
            using (SqlConnection conn = new SqlConnection(strconn))
            {
                SqlCommand cmd = conn.CreateCommand();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                cmd.CommandText = "sp_usuariosInformacionUPDATE";
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@id", usuarios.id);
                cmd.Parameters.AddWithValue("@nombres", usuarios.nombres);
                cmd.Parameters.AddWithValue("@apellidos", usuarios.apellidos);
                cmd.Parameters.AddWithValue("@correo", usuarios.correo);
                cmd.Parameters.AddWithValue("@telefono", usuarios.telefono);

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