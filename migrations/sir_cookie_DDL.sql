|DROP DATABASE IF EXISTS sir_cookie;
CREATE DATABASE sir_cookie;

USE sir_cookie;

-- ----- TABLA ROLES ---------
CREATE TABLE roles (
  id int AUTO_INCREMENT NOT NULL,
  rol varchar(255) NOT NULL,
  descripcion varchar(255) DEFAULT NULL,
  acceso INT DEFAULT 0,
  aniadir INT DEFAULT 0,
  eliminar INT DEFAULT 0,
  modificar INT DEFAULT 0,
  PRIMARY KEY (id)
);

INSERT INTO roles(rol, descripcion, acceso, aniadir, eliminar, modificar) VALUES ('ADMINISTRADOR', "ADMINISTRADOR", 1, 1, 1, 1);

-- ----- TABLA USUARIOS ---------
CREATE TABLE usuarios (
  id int  AUTO_INCREMENT NOT NULL,
  usuario varchar(80) NOT NULL,
  correo varchar(120) NOT NULL,
  contrasenia BLOB NOT NULL,
  rol_id int(11) NOT NULL,
  status INT DEFAULT 1,
  PRIMARY KEY (id),
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE logs(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario int not null,
    accion varchar(20) not null,
    fecha_accion datetime DEFAULT now(),
    tabla varchar(80),
    id_tabla varchar(80),
    foreign key (id_usuario) references usuarios(id)

);

-- Módulo de Proveedores
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    rfc VARCHAR(100),
    correo VARCHAR(255),
    telefono VARCHAR(20),
    status INT DEFAULT 1
);

-- Inventario de Materias Primas
CREATE TABLE materias_primas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    stock DOUBLE NOT NULL,
    unidad_medida VARCHAR(2)
);

CREATE TABLE detalles_materias_primas(
	id INT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT NOT NULL,
    id_materia_prima INT NOT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores (id),
    FOREIGN KEY (id_materia_prima) REFERENCES materias_primas (id)
);

CREATE TABLE compras(
	id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_proveedor INT NOT NULL,
    total FLOAT NOT NULL,
    unidad_medida VARCHAR(100) NOT NULL,
    fecha datetime DEFAULT now(),
    FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY(id_proveedor) REFERENCES proveedores (id)
);

CREATE TABLE detalles_compra(
	id INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL,
    id_materia_prima INT NOT NULL,
    precio_unidad INT NOT NULL,
    cantidad FLOAT NOT NULL,
    unidad_medida VARCHAR(100) NOT NULL,
    FOREIGN KEY(id_compra) REFERENCES compras (id),
    FOREIGN KEY(id_materia_prima) REFERENCES materias_primas (id)
);

-- ----- TABLA GALLLETAS ---------
CREATE TABLE galletas (
  id int AUTO_INCREMENT NOT NULL,
  nombre_galleta varchar(80) NOT NULL,
  precio_unitario float(10) NOT NULL,
  precio_kilo float(10) NOT NULL,
  descripcion varchar(120) NOT NULL,
  peso_galeta float(10) NOT NULL,
  PRIMARY KEY (id)
);

-- Recetas
CREATE TABLE recetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion VARCHAR(255),
    id_galleta INT NOT NULL,
    cantidad_produccion INT NOT NULL,
    FOREIGN KEY(id_galleta) REFERENCES galletas(id)
);

CREATE TABLE detalles_receta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_receta INT,
    id_materia_prima INT,
    cantidad INT NOT NULL,
    unidad_medida VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_receta) REFERENCES Recetas(id),
    FOREIGN KEY (id_materia_prima) REFERENCES materias_primas(id)
);

CREATE TABLE merma(
	id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    id_galleta INT,
    id_materia_prima INT,
    unidad_medida VARCHAR(5),
    cantidad FLOAT NOT NULL,
    motivo VARCHAR(100),
    FOREIGN KEY(id_galleta) REFERENCES galletas(id),
    FOREIGN KEY(id_materia_prima) REFERENCES materias_primas(id)
);

-- ----- TABLA LOTES GALLETA ---------
CREATE TABLE produccion(
  id int AUTO_INCREMENT NOT NULL,
  unidades_disponibles int NOT NULL,	
  fecha_produccion datetime DEFAULT NULL,
  fecha_caducidad datetime DEFAULT NULL,
  galleta_id int,
  id_merma INT,
  status VARCHAR(25) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (galleta_id) REFERENCES galletas(id),
  FOREIGN KEY (id_merma) REFERENCES merma(id)
);

CREATE TABLE lotes_galletas(
	id INT AUTO_INCREMENT NOT NULL,
    id_produccion INT NOT NULL,
    id_galleta INT NOT NULL,
    cantidad FLOAT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_produccion) REFERENCES produccion(id),
    FOREIGN KEY (id_galleta) REFERENCES galletas(id)
);

CREATE TABLE solicitud_produccion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,
    status INT DEFAULT 1, -- 1: Pendiente, 2: Aceptado, 3: Rechazado
    fecha_solicitud datetime DEFAULT now(),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_receta) REFERENCES recetas(id)
);

-- ----- TABLA VENTAS ---------
CREATE TABLE ventas(
  id int NOT NULL,
  id_usuario INT NOT NULL,
  total float NOT NULL,
  fecha datetime,
  FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
  PRIMARY KEY (id)
);
-- ----- TABLA DETALLES_VENTA ---------
CREATE TABLE detalles_venta(
  id int NOT NULL,
  id_venta int NOT NULL,
  id_galleta int NOT NULL,
  id_lote_galleta int NOT NULL,
  presentacion varchar(120) NOT NULL,
  precio float NOT NULL,
  cantidad float NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_venta) REFERENCES ventas(id),
  FOREIGN KEY (id_galleta) REFERENCES galletas(id),
  FOREIGN KEY (id_lote_galleta) REFERENCES lotes_galletas(id)
);

SELECT * FROM proveedores;

SELECT * FROM usuarios;

INSERT INTO usuarios (usuario, correo, contrasenia, rol_id, status) VALUES ('dany123', 'danyalexlg@gmail.com', 'admin', 1, 1);

SELECT * FROM roles;