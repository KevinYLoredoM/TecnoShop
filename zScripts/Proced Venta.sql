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
