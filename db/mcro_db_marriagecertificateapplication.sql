-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: mcro_db
-- ------------------------------------------------------
-- Server version	9.5.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '8822b915-d725-11f0-b644-88aedd2072c1:1-1768';

--
-- Table structure for table `marriagecertificateapplication`
--

DROP TABLE IF EXISTS `marriagecertificateapplication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marriagecertificateapplication` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registryNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bookNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pageNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateOfRegistration` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groomFirstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `groomMiddleName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groomLastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `groomDateOfBirth` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brideFirstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brideMiddleName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brideLastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brideDateOfBirth` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `MarriageCertificateApplication_registryNo_idx` (`registryNo`),
  KEY `MarriageCertificateApplication_groomLastName_groomFirstName_idx` (`groomLastName`,`groomFirstName`),
  KEY `MarriageCertificateApplication_brideLastName_brideFirstName_idx` (`brideLastName`,`brideFirstName`),
  KEY `MarriageCertificateApplication_userId_fkey` (`userId`),
  CONSTRAINT `MarriageCertificateApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marriagecertificateapplication`
--

LOCK TABLES `marriagecertificateapplication` WRITE;
/*!40000 ALTER TABLE `marriagecertificateapplication` DISABLE KEYS */;
INSERT INTO `marriagecertificateapplication` VALUES ('cmkev6l5c0000eofslwgr3bbj','2021-25444','88','30','January 2, 2002','jomar','','berdejo','test','test','test','test','test','2026-01-15 03:02:38.733','2026-01-15 03:02:38.733',NULL);
/*!40000 ALTER TABLE `marriagecertificateapplication` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-16 15:02:49
