
USE BDTecnoShop


--este procedimeinto inserta un usuario en la tabla usuarios 
create proc sp_usuariosADD
@nombres varchar(50) = '',
@apellidos varchar(50) = '',
@correo varchar(50) = '',
@contrasena varchar(255) = '',
@telefono varchar(15) = '',
@rolUsuario int 
as
begin
	--insertar usuario
	insert into usuarios(usu_nombres,usu_apellidos,usu_correo,usu_contrasena,usu_telefono,usu_rolId)
	values(@nombres,@apellidos,@correo,@contrasena,@telefono,@rolUsuario)
end

exec sp_usuariosADD 'Super', 'Admin', 'Admin@hotmail.com', 'Admin123', '6871589327', 1
-------------------------------------------------------------------------------------------------
--este procedimento actualizara la contraseña de un usuario buscandolo por el correo electronico
create procedure sp_usuariosContrasenaUPDATE
@contrasena varchar(250) = '',
@correo varchar(50) = ''
as
begin
	update usuarios set usu_contrasena = @contrasena where usu_correo = @correo
end
---------------------------------------------------------------------------------------------------
--este procedimento va actualizar la informacion del usuario excepto contrasena 
create proc sp_usuariosInformacionUPDATE
@id int,
@nombres varchar(50) = '',
@apellidos varchar(50) = '',
@correo varchar(50) = '',
@telefono varchar(15) = ''
as
begin
	update usuarios set usu_nombres = @nombres, usu_apellidos = @apellidos, usu_correo = @correo, usu_telefono = @telefono
	where usu_id = @id
end
------------------------------------------------------------------------------------------------------
--este procedimiento me va mostrar todos los usuarios(CLIENTES)
CREATE proc sp_usuariosMostrarClienteALL
as
begin
	select usu_id, usu_nombres, usu_apellidos, usu_correo, usu_contrasena, usu_telefono
	from usuarios where usu_rolId = 2
end

create proc sp_usuariosMostrarClienteALL2
as
begin
	select usu_id, usu_nombres, usu_apellidos, usu_correo, usu_contrasena, usu_telefono
	from usuarios
end

exec sp_usuariosMostrarClienteALL2