----------------------------------------------------------------
--ESTE PROCEDIMIENTO ES PARA REGISTRAR UNA RESEÑA              |
----------------------------------------------------------------
create procedure sp_reseñasClientes
@usuId int,
@proId int,
@calificacion tinyint,
@comentario varchar(1000)
as
begin
    if exists (
        select 1 from reseñas
        where res_usuId = @usuId and res_proId = @proId
    )
    begin
        -- Actualiza la reseña existente
        update reseñas
        set 
            res_calificacion = @calificacion,
            res_comentario = @comentario,
            res_fecha = getdate()
        where res_usuId = @usuId and res_proId = @proId;
    end
    else
    begin
        insert into reseñas(res_usuId, res_proId, res_calificacion, res_comentario)
        values (@usuId, @proId, @calificacion, @comentario);
    end
end
go

select * from productos
select * from usuarios
select * from reseñas

exec sp_reseñasClientes 7,1,4,'la pc esta muy bien es muy rapida'
-----------------------------------------------------------------
--ESTE PROCEDIMENTO ES PARA MOSTRAR TODOS LOS COMENTARIOS       |
-----------------------------------------------------------------
alter procedure sp_mostrarReseñas
    @proId int
as
begin
    select 
        r.res_calificacion,
        r.res_comentario,
		u.usu_nombres as nombreUsuario,
        r.res_fecha
    from reseñas r
    inner join usuarios u on u.usu_id = r.res_usuId
    where r.res_proId = @proId
    order by r.res_fecha desc
end
go

exec sp_mostrarReseñas 1