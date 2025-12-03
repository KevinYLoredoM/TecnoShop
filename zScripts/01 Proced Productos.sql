
USE BDTecnoShop


CREATE PROC Productos_All
    @Categoria VARCHAR(150) = NULL,
	@Marca VARCHAR(150) = NULL,
	@Nombre VARCHAR(150) = NULL
AS
BEGIN
	SELECT 
		p.pro_id AS ID,
		p.pro_nombre AS Nombre,
		p.pro_descripcion AS Descripcion,
		p.pro_especificaciones AS Especificaciones,
		p.pro_precioVenta AS PrecioVenta,
		p.pro_precioCompra AS PrecioCompra,
		p.pro_stock AS Stock,
		p.pro_catId AS CategoriaId,
		Cat.cat_nombre AS Categoria,
		p.pro_activo AS Activo,
		p.pro_marId AS MarcaId,
		m.mar_nombre AS Marca,
        m.mar_logoUrl AS LogoUrl,
		p.pro_imgUrl AS ImgUrl
		
	FROM productos p
	LEFT JOIN categorias Cat ON p.pro_catId = Cat.cat_id
	LEFT JOIN marcas m ON p.pro_marId = m.mar_id
	WHERE
    (@Nombre IS NULL OR p.pro_nombre LIKE '%' + @Nombre + '%') AND
    (@Categoria IS NULL OR Cat.cat_nombre LIKE '%' + @Categoria + '%') AND
    (@Marca IS NULL OR m.mar_nombre LIKE '%' + @Marca + '%')
	ORDER BY p.pro_id ASC;
END;


exec Productos_All

------------------------------------------------------------------------------------------


CREATE PROC Productos_ADD
	@Nombre NVARCHAR(100),
	@Descripcion NVARCHAR(255),
	@Especificaciones NVARCHAR(MAX),
	@PrecioVenta DECIMAL(10,2),
	@PrecioCompra DECIMAL(10,2),
	@Stock INT,
	@CategoriaId INT,
	@MarcaId INT,
	@ImgUrl NVARCHAR(MAX)
AS
BEGIN
	-- Insertar producto
	INSERT INTO productos (
		pro_nombre, pro_descripcion, pro_especificaciones,
		pro_precioVenta, pro_precioCompra, pro_stock,
		pro_catId, pro_marId, pro_activo, pro_imgUrl )
	VALUES (
		@Nombre, @Descripcion, @Especificaciones,
		@PrecioVenta, @PrecioCompra, @Stock,
		@CategoriaId, @MarcaId, 1, @ImgUrl );
END;

--------------------------------------------------------------------------------------


CREATE PROC Productos_Update
	@ProductoId INT,
	@Nombre NVARCHAR(100),
	@Descripcion NVARCHAR(255),
	@Especificaciones NVARCHAR(MAX),
	@ImgUrl NVARCHAR(MAX)
AS
BEGIN
	UPDATE productos
	SET 
		pro_nombre = @Nombre,
		pro_descripcion = @Descripcion,
		pro_especificaciones = @Especificaciones,
		pro_imgUrl = @ImgUrl
	WHERE pro_id = @ProductoId;
END;

--------------------------------------------------------------------------------------


CREATE PROC Productos_Delete
	@ProductoId INT,
	@Activo BIT
AS
BEGIN
	UPDATE productos
	SET pro_activo = @Activo
	WHERE pro_id = @ProductoId;
END;