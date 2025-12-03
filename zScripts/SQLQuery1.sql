
	@Nombre NVARCHAR(100),
	@Descripcion NVARCHAR(255),
	@Especificaciones NVARCHAR(MAX),
	@PrecioVenta DECIMAL(10,2),
	@PrecioCompra DECIMAL(10,2),
	@Stock INT,
	@CategoriaId INT,
	@MarcaId INT,
	@ImgUrl NVARCHAR(MAX)

exec Productos_ADD 'Laptop Gamer Xpg Xenia 15', 'I7-11800h 32gb 1tb Ssd Rtx 3070', 'Especificaciones principales:
• Procesador: Intel Core i7-11800H (8 núcleos / 16 hilos)
• Tarjeta gráfica: NVIDIA GeForce RTX 3070 Laptop GPU (8 GB GDDR6)
• Memoria RAM: 32 GB DDR4 @ 3200 MHz
• Almacenamiento: SSD NVMe 1 TB
• Pantalla: 15.6” Full HD 144 Hz
• Teclado: RGB personalizable
• Sistema operativo: Windows 11 Home original activado', 32999, 25000, 20, 1, 10,
'/Laptop Gamer Xpg Xenia 15/01.png,
/Laptop Gamer Xpg Xenia 15/02.png,
/Laptop Gamer Xpg Xenia 15/03.png,
/Laptop Gamer Xpg Xenia 15/04.png'