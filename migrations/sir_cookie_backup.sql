CREATE DATABASE  IF NOT EXISTS `sir_cookie` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sir_cookie`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: sir_cookie
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_proveedor` int NOT NULL,
  `total` float NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,1,1,699.98,'2024-04-01 18:10:00'),(2,1,2,449.99,'2024-04-04 18:13:00'),(3,1,2,1599.99,'2024-04-16 21:42:00');
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_receta`
--

DROP TABLE IF EXISTS `detalle_receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_receta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_receta` int DEFAULT NULL,
  `id_materia_prima` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_receta` (`id_receta`),
  KEY `id_materia_prima` (`id_materia_prima`),
  CONSTRAINT `detalle_receta_ibfk_1` FOREIGN KEY (`id_receta`) REFERENCES `recetas` (`id`),
  CONSTRAINT `detalle_receta_ibfk_2` FOREIGN KEY (`id_materia_prima`) REFERENCES `materias_primas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_receta`
--

LOCK TABLES `detalle_receta` WRITE;
/*!40000 ALTER TABLE `detalle_receta` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_compra`
--

DROP TABLE IF EXISTS `detalles_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_compra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `id_materia_prima` int NOT NULL,
  `precio_lote` float NOT NULL,
  `contenido_unidad` float NOT NULL,
  `cantidad` float NOT NULL,
  `unidad_medida` varchar(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_compra` (`id_compra`),
  KEY `id_materia_prima` (`id_materia_prima`),
  CONSTRAINT `detalles_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id`),
  CONSTRAINT `detalles_compra_ibfk_2` FOREIGN KEY (`id_materia_prima`) REFERENCES `materias_primas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_compra`
--

LOCK TABLES `detalles_compra` WRITE;
/*!40000 ALTER TABLE `detalles_compra` DISABLE KEYS */;
INSERT INTO `detalles_compra` VALUES (1,1,1,399.99,5,10,'kg'),(2,1,3,299.99,2,10,'kg'),(3,2,1,150,600,10,'g'),(4,2,2,299.99,12,10,'pz'),(5,3,2,1299.99,12,10,'pz'),(6,3,4,300,5,10,'L');
/*!40000 ALTER TABLE `detalles_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_materias_primas`
--

DROP TABLE IF EXISTS `detalles_materias_primas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_materias_primas` (
  `id_proveedor` int NOT NULL,
  `id_materia_prima` int NOT NULL,
  PRIMARY KEY (`id_proveedor`,`id_materia_prima`),
  KEY `id_materia_prima` (`id_materia_prima`),
  CONSTRAINT `detalles_materias_primas_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id`),
  CONSTRAINT `detalles_materias_primas_ibfk_2` FOREIGN KEY (`id_materia_prima`) REFERENCES `materias_primas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_materias_primas`
--

LOCK TABLES `detalles_materias_primas` WRITE;
/*!40000 ALTER TABLE `detalles_materias_primas` DISABLE KEYS */;
INSERT INTO `detalles_materias_primas` VALUES (1,1),(2,1),(2,2),(1,3),(1,4),(2,4);
/*!40000 ALTER TABLE `detalles_materias_primas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_venta`
--

DROP TABLE IF EXISTS `detalles_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_venta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_venta` int DEFAULT NULL,
  `id_galleta` int DEFAULT NULL,
  `presentacion` varchar(120) DEFAULT NULL,
  `cantidad` float DEFAULT NULL,
  `precio` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_venta` (`id_venta`),
  KEY `id_galleta` (`id_galleta`),
  CONSTRAINT `detalles_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`),
  CONSTRAINT `detalles_venta_ibfk_2` FOREIGN KEY (`id_galleta`) REFERENCES `galletas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_venta`
--

LOCK TABLES `detalles_venta` WRITE;
/*!40000 ALTER TABLE `detalles_venta` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalles_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `galletas`
--

DROP TABLE IF EXISTS `galletas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `galletas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_galleta` varchar(120) DEFAULT NULL,
  `precio_unitario` float DEFAULT NULL,
  `precio_kilo` float DEFAULT NULL,
  `descripcion` varchar(120) DEFAULT NULL,
  `peso_galleta` float DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galletas`
--

LOCK TABLES `galletas` WRITE;
/*!40000 ALTER TABLE `galletas` DISABLE KEYS */;
/*!40000 ALTER TABLE `galletas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intentos_login`
--

DROP TABLE IF EXISTS `intentos_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intentos_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `consecutive_fails` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `intentos_login_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intentos_login`
--

LOCK TABLES `intentos_login` WRITE;
/*!40000 ALTER TABLE `intentos_login` DISABLE KEYS */;
/*!40000 ALTER TABLE `intentos_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_materia_prima` int DEFAULT NULL,
  `stock_inicial` float DEFAULT NULL,
  `stock` float DEFAULT NULL,
  `lote` varchar(100) NOT NULL,
  `fecha_caducidad` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_compra` datetime DEFAULT CURRENT_TIMESTAMP,
  `en_stock` int DEFAULT '1',
  PRIMARY KEY (`id`,`lote`),
  UNIQUE KEY `ix_inventario_lote` (`lote`),
  KEY `id_materia_prima` (`id_materia_prima`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_materia_prima`) REFERENCES `materias_primas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,1,50,0,'Har202404161813191','2024-04-16 18:30:00','2024-04-01 18:10:00',0),(2,3,20,0,'Azu202404161813191','2024-04-16 18:30:00','2024-04-01 18:10:00',0),(3,1,6,0,'Har202404161815542','2024-04-16 18:50:00','2024-04-04 18:13:00',0),(4,2,120,0,'Hue202404161815541','2024-04-16 18:45:00','2024-04-04 18:13:00',0),(5,2,120,118,'Hue202404162146455','2024-04-17 10:01:00','2024-04-16 21:42:00',1),(6,4,50,46,'Lec202404162146451','2024-04-17 10:20:00','2024-04-16 21:42:00',1);
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario_galletas`
--

DROP TABLE IF EXISTS `inventario_galletas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario_galletas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_produccion` int DEFAULT NULL,
  `id_galleta` int DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `lote` varchar(100) DEFAULT NULL,
  `fecha_caducidad` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_produccion` (`id_produccion`),
  KEY `id_galleta` (`id_galleta`),
  CONSTRAINT `inventario_galletas_ibfk_1` FOREIGN KEY (`id_produccion`) REFERENCES `produccion` (`id`),
  CONSTRAINT `inventario_galletas_ibfk_2` FOREIGN KEY (`id_galleta`) REFERENCES `galletas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario_galletas`
--

LOCK TABLES `inventario_galletas` WRITE;
/*!40000 ALTER TABLE `inventario_galletas` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventario_galletas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `accion` varchar(100) NOT NULL,
  `fecha_accion` datetime DEFAULT CURRENT_TIMESTAMP,
  `tabla` varchar(80) DEFAULT NULL,
  `id_tabla` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (1,1,'insert','2024-04-16 18:04:30','suppliers','1'),(2,1,'insert','2024-04-16 18:05:03','suppliers','2'),(3,1,'Se ha registrado una materia prima: Harina','2024-04-16 18:05:24','materias_primas','1'),(4,1,'Se ha registrado una materia prima: Huevos','2024-04-16 18:05:39','materias_primas','2'),(5,1,'Se ha registrado una materia prima: Azucar','2024-04-16 18:05:57','materias_primas','3'),(6,1,'Se ha registrado una materia prima: Leche','2024-04-16 18:06:45','materias_primas','4'),(7,1,'insert','2024-04-16 18:08:18','detalles_materias_primas','1-3'),(8,1,'insert','2024-04-16 18:08:18','detalles_materias_primas','1-1'),(9,1,'insert','2024-04-16 18:08:18','detalles_materias_primas','1-4'),(10,1,'insert','2024-04-16 18:08:27','detalles_materias_primas','2-4'),(11,1,'insert','2024-04-16 18:08:27','detalles_materias_primas','2-2'),(12,1,'insert','2024-04-16 18:08:27','detalles_materias_primas','2-1'),(13,1,'login','2024-04-16 18:58:37','users','1'),(14,1,'Se ha registrado una merma de 120 pz de la materia prima Huevos','2024-04-16 19:53:59','Mermas','3'),(15,1,'login','2024-04-16 21:38:35','users','1'),(16,1,'Se ha registrado una merma de 20 kg de la materia prima Azucar','2024-04-16 21:38:54','Mermas','4'),(17,1,'login','2024-04-16 21:39:39','users','1'),(18,1,'Se ha registrado una merma de 6 kg de la materia prima Harina','2024-04-16 21:40:29','Mermas','5'),(19,1,'Se ha registrado una merma de 50 kg de la materia prima Harina','2024-04-16 21:41:26','Mermas','6'),(20,1,'login','2024-04-16 22:15:50','users','1'),(21,1,'login','2024-04-16 22:19:30','users','1'),(22,1,'Se ha registrado una merma de 2 L de la materia prima Leche','2024-04-16 22:42:58','Mermas','7'),(23,1,'Se ha registrado una merma de 600 ml de la materia prima Leche','2024-04-16 22:58:44','Mermas','8'),(24,1,'Se ha registrado una merma de 400 ml de la materia prima Leche','2024-04-16 23:09:14','Mermas','11'),(25,1,'Se ha registrado una merma de 600 ml de la materia prima Leche','2024-04-16 23:18:25','Mermas','12'),(26,1,'Se ha registrado una merma de 400 ml de la materia prima Leche','2024-04-16 23:22:47','Mermas','13'),(27,1,'Se ha registrado una merma de 2 pz de la materia prima Huevos','2024-04-16 23:29:11','Mermas','14'),(28,1,'login','2024-04-16 23:59:50','users','1');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias_primas`
--

DROP TABLE IF EXISTS `materias_primas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materias_primas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `min_stock` float DEFAULT NULL,
  `max_stock` float DEFAULT NULL,
  `stock` float DEFAULT NULL,
  `unidad_medida` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias_primas`
--

LOCK TABLES `materias_primas` WRITE;
/*!40000 ALTER TABLE `materias_primas` DISABLE KEYS */;
INSERT INTO `materias_primas` VALUES (1,'Harina','Harina',10,1000,0,'kg'),(2,'Huevos','Huevos',12,1200,118,'pz'),(3,'Azucar','Azucar',10,1000,0,'kg'),(4,'Leche','Leche',10,1000,46,'L');
/*!40000 ALTER TABLE `materias_primas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mermas`
--

DROP TABLE IF EXISTS `mermas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mermas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_materia_prima` int DEFAULT NULL,
  `lote` varchar(100) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `comentario` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `unidad_medida` varchar(2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_materia_prima` (`id_materia_prima`),
  KEY `lote` (`lote`),
  CONSTRAINT `mermas_ibfk_1` FOREIGN KEY (`id_materia_prima`) REFERENCES `materias_primas` (`id`),
  CONSTRAINT `mermas_ibfk_2` FOREIGN KEY (`lote`) REFERENCES `inventario` (`lote`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mermas`
--

LOCK TABLES `mermas` WRITE;
/*!40000 ALTER TABLE `mermas` DISABLE KEYS */;
INSERT INTO `mermas` VALUES (3,2,'Hue202404161815541',120,'Insumo caducado','2024-04-16 18:45:00','pz'),(4,3,'Azu202404161813191',20,'Insumo caducado','2024-04-16 18:30:00','kg'),(5,1,'Har202404161815542',6,'Insumo caducado','2024-04-16 18:50:00','kg'),(6,1,'Har202404161813191',50,'Insumo caducado','2024-04-16 18:30:00','kg'),(7,4,'Lec202404162146451',2,'Se tiraron los litros','2024-04-16 22:42:00','L'),(8,4,'Lec202404162146451',600,'Le cayo sal','2024-04-16 22:58:00','ml'),(11,4,'Lec202404162146451',400,'Se cayo al piso','2024-04-16 23:08:00','ml'),(12,4,'Lec202404162146451',600,'Se cayo al piso','2024-04-16 23:18:00','ml'),(13,4,'Lec202404162146451',400,'Al mover el lote de lugar se tiro un poco','2024-04-16 23:22:00','ml'),(14,2,'Hue202404162146455',2,'Se cayeron al acomodar el lote','2024-04-16 22:29:00','pz');
/*!40000 ALTER TABLE `mermas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passwords_history`
--

DROP TABLE IF EXISTS `passwords_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passwords_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `contrasenia` blob,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `passwords_history_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passwords_history`
--

LOCK TABLES `passwords_history` WRITE;
/*!40000 ALTER TABLE `passwords_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `passwords_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produccion`
--

DROP TABLE IF EXISTS `produccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad_producida` int DEFAULT NULL,
  `fecha_produccion` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_receta` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_receta` (`id_receta`),
  CONSTRAINT `produccion_ibfk_1` FOREIGN KEY (`id_receta`) REFERENCES `recetas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produccion`
--

LOCK TABLES `produccion` WRITE;
/*!40000 ALTER TABLE `produccion` DISABLE KEYS */;
/*!40000 ALTER TABLE `produccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `rfc` varchar(100) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'Aurrera','aurrera12434','aurrera@gmail.com','43545776',1),(2,'Costco','costco435456','costco@gmail.com','32545667',1);
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas`
--

DROP TABLE IF EXISTS `recetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_receta` varchar(120) DEFAULT NULL,
  `descripcion` varchar(120) DEFAULT NULL,
  `cantidad_produccion` int DEFAULT NULL,
  `id_galleta` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_galleta` (`id_galleta`),
  CONSTRAINT `recetas_ibfk_1` FOREIGN KEY (`id_galleta`) REFERENCES `galletas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas`
--

LOCK TABLES `recetas` WRITE;
/*!40000 ALTER TABLE `recetas` DISABLE KEYS */;
/*!40000 ALTER TABLE `recetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `acceso` int DEFAULT NULL,
  `aniadir` int DEFAULT NULL,
  `eliminar` int DEFAULT NULL,
  `modificar` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMINISTRADOR','ADMINISTRADOR',1,1,1,1),(2,'FINANZAS','FINANZAS',1,1,1,1),(3,'PRODUCCION','PRODUCCION',1,1,1,1);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(80) DEFAULT NULL,
  `correo` varchar(120) DEFAULT NULL,
  `contrasenia` blob,
  `rol_id` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'dany123','danyalexlg@gmail.com',_binary 'scrypt:32768:8:1$KClgGGba3AEt3Yds$de58600bf681d6f282e2862b08a85562d1a01c1ee90a67a61012c9928933933e367d42a0b1e31d30642b49a840a9a3eb0cedd87f8d3a7ad1af6412385056239b',1,1),(2,'mario1234','mario@gmail.com',_binary 'scrypt:32768:8:1$KClgGGba3AEt3Yds$de58600bf681d6f282e2862b08a85562d1a01c1ee90a67a61012c9928933933e367d42a0b1e31d30642b49a840a9a3eb0cedd87f8d3a7ad1af6412385056239b',2,1),(3,'ricardo12','ricardo@gmail.com',_binary 'scrypt:32768:8:1$KClgGGba3AEt3Yds$de58600bf681d6f282e2862b08a85562d1a01c1ee90a67a61012c9928933933e367d42a0b1e31d30642b49a840a9a3eb0cedd87f8d3a7ad1af6412385056239b',3,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `total` float DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'sir_cookie'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-17 23:57:35
