
USE BDTecnoShop


INSERT INTO Productos (
    pro_nombre, 
    pro_descripcion, 
    pro_especificaciones, 
    pro_precioVenta, 
    pro_precioCompra, 
    pro_stock, 
    pro_catId, -- FK a Categorias
    pro_marId, -- FK a Marcas
    pro_activo, 
    pro_imgUrl
) VALUES 
-- Ejemplo 1: Una Laptop (Asus / Laptops Gaming)
(
    'Laptop Asus ROG Strix G15',
    'Laptop gamer potente con pantalla de 144Hz ideal para esports.',
    '"cpu": "Ryzen 7", "ram": "16GB", "gpu": "RTX 3050", "screen": "15.6 inch"',
    25000.00, 
    18000.00, 
    15, 
    1, -- ID de Laptops Gaming
    1, -- ID de Asus
    1, 
    'asus-rog.jpg'
),

-- Ejemplo 2: Un Procesador (AMD / Procesadores)
(
    'Procesador AMD Ryzen 7 5800X', 
    'Procesador de alto rendimiento para gaming y renderizado.', 
    '"cores": 8, "threads": 16, "socket": "AM4", "speed": "4.7GHz"', 
    5800.00, 
    4200.00, 
    50, 
    3, -- ID de Procesadores
    5, -- ID de AMD
    1, 
    'ryzen7.jpg'
),

-- Ejemplo 3: Una Tarjeta de Video (MSI / Tarjetas de Video)
(
    'Tarjeta de Video MSI RTX 4060 Ventus', 
    'Gráficos de última generación con DLSS 3.0.', 
    '"vram": "8GB GDDR6", "fans": 2, "interface": "PCIe 4.0"', 
    7500.00, 
    6000.00, 
    10, 
    4, -- ID de Tarjetas de Video
    2, -- ID de MSI
    1, 
    'msi-4060.jpg'
),

-- Ejemplo 4: Memoria RAM (Kingston / RAM)
(
    'Memoria RAM Kingston Fury Beast 16GB', 
    'Módulo DDR4 optimizado para Intel y AMD.', 
    '"type": "DDR4", "speed": "3200MHz", "capacity": "16GB", "color": "Black"', 
    950.00, 
    600.00, 
    100, 
    5, -- ID de Memorias RAM
    7, -- ID de Kingston
    1, 
    'kingston-ram.jpg'
),

-- Ejemplo 5: Almacenamiento (Samsung / SSD)
(
    'SSD Samsung 970 EVO Plus 1TB', 
    'Unidad de estado sólido NVMe M.2 de ultra velocidad.', 
    '"interface": "NVMe M.2", "read_speed": "3500MB/s", "capacity": "1TB"', 
    1800.00, 
    1200.00, 
    45, 
    6, -- ID de Almacenamiento
    8, -- ID de Samsung
    1, 
    'samsung-ssd.jpg'
);