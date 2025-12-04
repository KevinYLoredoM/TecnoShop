use BDTecnoShop
go

------------------------------------------------------------------------|
--este procedimiento es para agregar al carrito productos por usuario   |
------------------------------------------------------------------------|
create procedure sp_agregarCarrito
@usuId int,
@proId int,
@cantidad int
as
begin
	if exists(select 1 from carrito
			  where car_usuId = @usuId and car_proId = @proId)
	begin
		update carrito set car_cantidad = car_cantidad + @cantidad
		where car_usuId = @usuId and car_proId = @proId
	end
	else
	begin
		insert into carrito(car_usuId,car_proId,car_cantidad)
		values(@usuId,@proId,@cantidad)
	end
end
go
select * from categorias
select * from usuarios
select * from productos
 exec Productos_ADD 'lap','azus','moderna',120,100,10,1,1,''
exec sp_agregarCarrito 6,2,2
---------------------------------------------------------------|
--este procedimiento es para actualizar el carrito             |
---------------------------------------------------------------|
create procedure sp_carritoActualizarCantidad
@usuId int,
@proId int,
@cantidad int
as
begin
	update carrito set car_cantidad = @cantidad
	where car_usuId = @usuId and car_proId = @proId
end
go

select * from carrito
exec sp_carritoActualizarCantidad 4,1,2
-------------------------------------------------------------|
--este procedimiento es para eliminar carrito                |
-------------------------------------------------------------|
create procedure sp_carritoEliminar
@usuId int,
@proId int
as
begin
	delete carrito 
	where car_usuId = @usuId and car_proId = @proId
end
go

exec sp_carritoEliminar 7,1

--------------------------------------------------------------|
--este procedimiento es para vaciar el carrito                |
--------------------------------------------------------------|
create procedure sp_vaciarCarrito
@usuId int
as
begin
	delete from carrito
	where car_usuId = @usuId
end
go

select * from carrito
exec sp_vaciarCarrito 6

----------------------------------------------------------------------|
--este procedimiento va mostrar los productos del carrito del usuario |
----------------------------------------------------------------------|
create procedure sp_carritoListar
    @usuId int
as
begin
    select 
        c.car_id,
        c.car_cantidad,
        c.car_fechaAgregado,
        p.pro_id,
        p.pro_nombre,
        p.pro_precioVenta,
        (p.pro_precioVenta * c.car_cantidad) as subtotal
    from carrito c
    inner join productos p on c.car_proId = p.pro_id
    where c.car_usuId = @usuId;
end
go

exec sp_carritoListar 7