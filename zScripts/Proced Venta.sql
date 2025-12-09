ALTER PROCEDURE sp_insertarVenta
@ven_usuId INT,
@ven_total DECIMAL(10,2),
@ven_subtotal DECIMAL(10,2),
@ven_impuestos DECIMAL(10,2),
@ven_dirEnvioId INT,
@ven_mpId INT,
@ven_estadoId INT,
@ven_idPago VARCHAR(100),
@NuevoId INT OUTPUT
AS
BEGIN
    INSERT INTO ventas (
        ven_usuId, ven_total, ven_subtotal, ven_impuestos,
        ven_dirEnvioId, ven_mpId, ven_estadoId, ven_idPago
    )
    VALUES (
        @ven_usuId, @ven_total, @ven_subtotal, @ven_impuestos,
        @ven_dirEnvioId, @ven_mpId, @ven_estadoId, @ven_idPago
    );

    SET @NuevoId = SCOPE_IDENTITY();
END;
GO


-------------------------------------------------------------

CREATE PROCEDURE sp_insertarVentaDetalle
@vdet_venId INT,
@vdet_proId INT,
@vdet_cantidad INT,
@vdet_precioUnitario DECIMAL(10,2),
@vdet_subtotal DECIMAL(10,2)
AS
BEGIN
    INSERT INTO ventaDetalle (
        vdet_venId, vdet_proId, vdet_cantidad, 
        vdet_precioUnitario, vdet_subtotal
    )
    VALUES (
        @vdet_venId, @vdet_proId, @vdet_cantidad,
        @vdet_precioUnitario, @vdet_subtotal
    );
END;
GO

------------------------------------------------------
CREATE PROCEDURE sp_mostrarVentasPorUsuario
    @usuId INT
AS
BEGIN
    SELECT 
        v.ven_id,
        v.ven_fechaVenta,
        v.ven_total,
        v.ven_subtotal,
        v.ven_impuestos,
        u.usu_nombres,
        u.usu_correo,
        d.dir_calle,
        d.dir_codigoPostal,
        mp.mp_nombre AS MetodoPago,
        ev.est_nombre AS EstadoVenta,
        vd.vdet_proId,
        p.pro_nombre,
        vd.vdet_cantidad,
        vd.vdet_precioUnitario,
        vd.vdet_subtotal
    FROM ventas v
    INNER JOIN usuarios u ON v.ven_usuId = u.usu_id
    INNER JOIN direcciones d ON v.ven_dirEnvioId = d.dir_id
    INNER JOIN metodoPago mp ON v.ven_mpId = mp.mp_id
    INNER JOIN estadoVenta ev ON v.ven_estadoId = ev.est_id
    INNER JOIN ventaDetalle vd ON vd.vdet_venId = v.ven_id
    INNER JOIN productos p ON vd.vdet_proId = p.pro_id
    WHERE v.ven_usuId = @usuId
    ORDER BY v.ven_fechaVenta DESC;
END;
GO

exec sp_mostrarVentasPorUsuario 6