-- ######################################
-- # CREACIÓN DE LA BASE DE DATOS
-- ######################################
create database BDTecnoShop
go

use BDTecnoShop
go

-- ######################################
-- # I. GEOGRAFÍA (NORMALIZACIÓN DE DIRECCIONES)
-- ######################################

-- 1. Países
create table paises(
    pais_id int identity primary key,
    pais_nombre varchar(100) not null unique,
)
go

-- 2. Estados/Provincias
create table estados(
    est_id int identity primary key,
    est_nombre varchar(100) not null,
    est_paisId int foreign key references paises(pais_id) not null,
    unique (est_nombre, est_paisId)
)
go

-- 3. Ciudades
create table ciudades(
    ciu_id int identity primary key,
    ciu_nombre varchar(100) not null,
    ciu_estId int foreign key references estados(est_id) not null,
    unique (ciu_nombre, ciu_estId)
)
go

-- ######################################
-- # II. USUARIOS Y ROLES
-- ######################################

-- 4. Roles
create table roles(
    rol_id int identity primary key,
    rol_nombre varchar(30) not null unique -- Ej: 'Administrador', 'Cliente'
)
go

-- 5. Usuarios
create table usuarios(
    usu_id int identity primary key,
    usu_nombres varchar(50) not null,
    usu_apellidos varchar(50) not null,
    usu_correo varchar(50) unique not null,
    -- Aumentado para hash de seguridad (bcrypt, SHA-256)
    usu_contrasena varchar(255) not null, 
    usu_telefono varchar(15),
    usu_rolId int foreign key references roles(rol_id) not null
)
go

-- 6. Direcciones (Usa la clave foránea a 'ciudades')
create table direcciones(
    dir_id int identity primary key,
    dir_usuId int foreign key references usuarios(usu_id) not null,
    dir_calle varchar(100) not null,
    dir_codigoPostal varchar(10) not null,
    dir_ciuId int foreign key references ciudades(ciu_id) not null, 
    dir_esPrincipal bit default 0
)
go

-- ######################################
-- # III. INVENTARIO Y CATÁLOGO
-- ######################################

-- 7. Categorías (Permite subcategorías)
create table categorias(
    cat_id int identity primary key,
    cat_nombre varchar(100) not null
)
go

INSERT INTO Categorias (cat_nombre) VALUES 
('Laptops Gaming'),
('Laptops Oficina'),
('Procesadores (CPU)'),
('Tarjetas de Video (GPU)'),
('Memorias RAM'),
('Almacenamiento (SSD/HDD)'),
('Placas Madre'),
('Fuentes de Poder'),
('Gabinetes'),
('Periféricos');

-- ######################################
-- # TABLA DE MARCAS DE PRODUCTOS
-- ######################################
create table marcas(
    mar_id int identity primary key,
    mar_nombre varchar(50) not null unique,
    mar_descripcion varchar(255),
    mar_logoUrl varchar(255)
)
go

INSERT INTO Marcas (mar_nombre, mar_descripcion, mar_logoUrl) VALUES 
('Asus', '', 'asus.png'),
('MSI', '', 'msi.png'),
('Gigabyte', '', 'gigabyte.png'),
('Intel', '', 'intel.png'),
('AMD', '', 'amd.png'),
('NVIDIA', '', 'nvidia.png'),
('Kingston', '', 'kingston.png'),
('HP', '', 'hp.png'),
('Logitech', '', 'logitech.png'),
('XPG', '', 'xpg.png');


-- 8. Productos
create table productos(
    pro_id int identity primary key,
    pro_nombre varchar(100) not null,
    pro_descripcion varchar(500),
    pro_especificaciones varchar(500), 
    pro_precioVenta decimal(10,2) not null, 
    pro_precioCompra decimal(10,2), 
    pro_stock int not null default 0, 
    pro_catId int foreign key references categorias(cat_id) not null,
    pro_activo bit default 1,
    pro_marId int foreign key references marcas(mar_id),
	pro_imgUrl varchar(max) not null
)
go

-- 10. Reseñas y Calificaciones
create table reseñas(
    res_id int identity primary key,
    res_usuId int foreign key references usuarios(usu_id) not null,
    res_proId int foreign key references productos(pro_id) not null,
    res_calificacion tinyint not null check (res_calificacion between 1 and 5),
    res_comentario varchar(1000),
    res_fecha datetime default getdate(),
    unique (res_usuId, res_proId)
)
go

-- 11. Respuestas a Reseñas (Para el staff)
create table respuestasReseña(
    resp_id int identity primary key,
    resp_resId int foreign key references reseñas(res_id) not null, 
    resp_usuId int foreign key references usuarios(usu_id) not null, -- Asumimos que es un Admin
    resp_texto varchar(1000) not null,
    resp_fecha datetime default getdate()
)
go


-- ######################################
-- # IV. PROCESO DE VENTA Y TRANSACCIONES
-- ######################################

-- 12. Carrito de Compras (Items en espera de ser comprados)
create table carrito(
    car_id int identity primary key,
    car_usuId int foreign key references usuarios(usu_id) not null,
    car_proId int foreign key references productos(pro_id) not null,
    car_cantidad int not null,
    car_fechaAgregado datetime default getdate(),
    unique (car_usuId, car_proId)
)
go

-- 13. Métodos de Pago
create table metodoPago(
    mp_id int identity primary key,
    mp_nombre varchar(50) not null unique -- Ej: 'Tarjeta de Crédito', 'PayPal', 'Transferencia'
)
go

-- 14. Estados de la Venta/Pedido
create table estadoVenta(
    est_id int identity primary key,
    est_nombre varchar(30) default 'Pendiente' unique -- Ej: 'Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'
)
go

-- 15. Ventas/Pedidos (La transacción principal)
create table ventas(
    ven_id int identity primary key,
    ven_usuId int foreign key references usuarios(usu_id) not null,
    ven_fechaVenta datetime default getdate(),
    ven_total decimal(10,2) not null,
    ven_subtotal decimal(10,2) not null,
    ven_impuestos decimal(10,2) default 0.00,
    ven_dirEnvioId int foreign key references direcciones(dir_id) not null, 
    ven_mpId int foreign key references metodoPago(mp_id) not null,
    ven_estadoId int foreign key references estadoVenta(est_id) not null
)
go

-- 16. Detalle de la Venta (Los productos de cada pedido)
create table ventaDetalle(
    vdet_venId int foreign key references ventas(ven_id) not null,
    vdet_proId int foreign key references productos(pro_id) not null,
    vdet_cantidad int not null,
    vdet_precioUnitario decimal(10,2) not null, 
    vdet_subtotal decimal(10,2) not null
)
go
