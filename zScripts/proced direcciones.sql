alter PROCEDURE sp_agregarDireccion
    @dir_usuId INT,
    @dir_calle VARCHAR(100),
    @dir_codigoPostal VARCHAR(10),
    @dir_ciuId INT,
    @dir_esPrincipal BIT = 0,
    @NuevoId INT OUTPUT
AS
BEGIN
    -- Si la nueva dirección será principal, desmarcamos las anteriores
    IF @dir_esPrincipal = 1
    BEGIN
        UPDATE direcciones
        SET dir_esPrincipal = 0
        WHERE dir_usuId = @dir_usuId;
    END

    -- Insertar nueva dirección
    INSERT INTO direcciones (dir_usuId, dir_calle, dir_codigoPostal, dir_ciuId, dir_esPrincipal)
    VALUES (@dir_usuId, @dir_calle, @dir_codigoPostal, @dir_ciuId, @dir_esPrincipal);

    -- Devolver el ID generado
    SET @NuevoId = SCOPE_IDENTITY();
END
GO

DECLARE @NuevoId INT;

EXEC sp_agregarDireccion
    @dir_usuId = 6,
    @dir_calle = 'Calle Falsa 1234',
    @dir_codigoPostal = '45000',
    @dir_ciuId = 1,
    @dir_esPrincipal = 1,  -- 1 = principal, 0 = no principal
    @NuevoId = @NuevoId OUTPUT;

-- Mostrar el ID generado
SELECT @NuevoId AS IdDireccion;
select * from direcciones
-------------------------------------------------------------------------------------------
CREATE PROCEDURE sp_obtenerDireccionesPorUsuario
    @usuId INT
AS
BEGIN
    SELECT 
        dir_id,
        dir_usuId,
        dir_calle,
        dir_codigoPostal,
        dir_ciuId,
        dir_esPrincipal
    FROM direcciones
    WHERE dir_usuId = @usuId
    ORDER BY dir_esPrincipal DESC, dir_id;
END
GO
