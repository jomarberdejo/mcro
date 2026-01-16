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
-- Table structure for table `supportingdocument`
--

DROP TABLE IF EXISTS `supportingdocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supportingdocument` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filePath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` int DEFAULT NULL,
  `mimeType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('BIRTH_CERTIFICATE','DEATH_CERTIFICATE','MARRIAGE_CERTIFICATE','MARRIAGE_CERTIFICATE_APPLICATION','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OTHER',
  `birthRecordId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deathRecordId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marriageRecordId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marriageCertificateApplicationId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploadedBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploadedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `SupportingDocument_birthRecordId_idx` (`birthRecordId`),
  KEY `SupportingDocument_deathRecordId_idx` (`deathRecordId`),
  KEY `SupportingDocument_marriageRecordId_idx` (`marriageRecordId`),
  KEY `SupportingDocument_marriageCertificateApplicationId_idx` (`marriageCertificateApplicationId`),
  CONSTRAINT `SupportingDocument_birthRecordId_fkey` FOREIGN KEY (`birthRecordId`) REFERENCES `birthrecord` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SupportingDocument_deathRecordId_fkey` FOREIGN KEY (`deathRecordId`) REFERENCES `deathrecord` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SupportingDocument_marriageCertificateApplicationId_fkey` FOREIGN KEY (`marriageCertificateApplicationId`) REFERENCES `marriagecertificateapplication` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SupportingDocument_marriageRecordId_fkey` FOREIGN KEY (`marriageRecordId`) REFERENCES `marriagerecord` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supportingdocument`
--

LOCK TABLES `supportingdocument` WRITE;
/*!40000 ALTER TABLE `supportingdocument` DISABLE KEYS */;
/*!40000 ALTER TABLE `supportingdocument` ENABLE KEYS */;
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

-- Dump completed on 2026-01-16 15:02:48
