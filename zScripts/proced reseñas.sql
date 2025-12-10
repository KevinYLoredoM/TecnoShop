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
        r.res_fecha,
		resp.resp_texto,
		resp.resp_fecha
    from reseñas r
    inner join usuarios u on u.usu_id = r.res_usuId
	inner join respuestasReseña resp on r.res_id = resp.resp_id
    where r.res_proId = @proId
    order by r.res_fecha desc
end
go

exec sp_mostrarReseñas 1


-- 1. SP PARA RESPONDER (INSERTAR EN TABLA NUEVA)
CREATE PROCEDURE sp_resenasResponder
    @resId int,
    @usuId int, -- ID del Admin que responde
    @texto varchar(1000)
AS
BEGIN
    INSERT INTO respuestasReseña (resp_resId, resp_usuId, resp_texto)
    VALUES (@resId, @usuId, @texto)
END

GO

-- 2. SP PARA LISTAR (ACTUALIZADO CON LEFT JOIN)
-- Esto trae la reseña y, si existe, la respuesta asociada.
ALTER PROCEDURE sp_resenasListarTodas
AS
BEGIN
    SELECT 
        r.res_id,
        r.res_usuId,
        u.usu_nombres + ' ' + u.usu_apellidos as nombreUsuario,
        r.res_proId,
        p.pro_nombre as nombreProducto,
        r.res_calificacion,
        r.res_comentario,
        r.res_fecha,
        -- Datos de la respuesta (pueden ser NULL si nadie ha contestado)
        resp.resp_texto as res_respuesta, 
        resp.resp_fecha as res_fechaRespuesta
    FROM reseñas r
    INNER JOIN Usuarios u ON r.res_usuId = u.usu_id
    INNER JOIN Productos p ON r.res_proId = p.pro_id
    -- Unimos con la tabla de respuestas
    LEFT JOIN respuestasReseña resp ON r.res_id = resp.resp_resId
    ORDER BY r.res_fecha DESC
END

exec sp_resenasListarTodas