/*
SQLyog Ultimate v9.63 
MySQL - 5.5.5-10.1.13-MariaDB : Database - totem_entrada
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `cita` */

DROP TABLE IF EXISTS `cita`;

CREATE TABLE `cita` (
  `id_cita` int(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` int(11) DEFAULT NULL,
  `id_tipo_doc` int(11) DEFAULT NULL,
  `numero_documento` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cita`),
  KEY `id_empleado` (`id_empleado`),
  KEY `id_tipo_doc` (`id_tipo_doc`),
  KEY `numero_documento` (`numero_documento`),
  CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE NO ACTION,
  CONSTRAINT `cita_ibfk_2` FOREIGN KEY (`id_tipo_doc`) REFERENCES `visitante` (`id_tipo_doc`) ON DELETE NO ACTION,
  CONSTRAINT `cita_ibfk_3` FOREIGN KEY (`numero_documento`) REFERENCES `visitante` (`numero_documento`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `empleado` */

DROP TABLE IF EXISTS `empleado`;

CREATE TABLE `empleado` (
  `id_empleado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_apellido` varchar(100) DEFAULT NULL,
  `interno` int(11) DEFAULT NULL,
  `direccion_general` varchar(100) DEFAULT NULL,
  `subsecretaria` varchar(100) DEFAULT NULL,
  `slack` varchar(20) DEFAULT NULL,
  `mail` varchar(50) DEFAULT NULL,
  `activo` smallint(2) DEFAULT '1',
  PRIMARY KEY (`id_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=751 DEFAULT CHARSET=latin1;

/*Table structure for table `tipo_doc` */

DROP TABLE IF EXISTS `tipo_doc`;

CREATE TABLE `tipo_doc` (
  `id_tipo_doc` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_tipo_doc`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Table structure for table `visitante` */

DROP TABLE IF EXISTS `visitante`;

CREATE TABLE `visitante` (
  `id_tipo_doc` int(11) NOT NULL,
  `numero_documento` varchar(50) NOT NULL DEFAULT '',
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_tipo_doc`,`numero_documento`),
  KEY `numero_documento` (`numero_documento`),
  CONSTRAINT `visitante_ibfk_1` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipo_doc` (`id_tipo_doc`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
