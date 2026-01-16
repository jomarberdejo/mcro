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
-- Table structure for table `birthrecord`
--

DROP TABLE IF EXISTS `birthrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `birthrecord` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registryNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateOfRegistration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `childLastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `childFirstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `childMiddleName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sex` enum('Male','Female') COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateOfBirth` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `placeOfBirth` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isTwin` tinyint(1) NOT NULL DEFAULT '0',
  `birthOrder` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherLastName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherFirstName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherMiddleName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherCitizenship` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherLastName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherFirstName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherMiddleName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherCitizenship` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateOfMarriage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `placeOfMarriage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `registrarName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signatureImagePath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) DEFAULT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timeOfBirth` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeOfBirth` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certifyingOfficerName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certifyingOfficerPosition` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestPurpose` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestorName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bookNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pageNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `processFeeInfo` text COLLATE utf8mb4_unicode_ci,
  `verifiedBy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verifierPosition` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BirthRecord_registryNo_key` (`registryNo`),
  KEY `BirthRecord_registryNo_idx` (`registryNo`),
  KEY `BirthRecord_childLastName_childFirstName_idx` (`childLastName`,`childFirstName`),
  KEY `BirthRecord_userId_fkey` (`userId`),
  CONSTRAINT `BirthRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `birthrecord`
--

LOCK TABLES `birthrecord` WRITE;
/*!40000 ALTER TABLE `birthrecord` DISABLE KEYS */;
INSERT INTO `birthrecord` VALUES ('cmj9plqap000064fsorzzx7vm','2021-25431','January 2, 2002','Berdejo','Jomar','Macalinao','Male','January 1, 2002','Carigara, Leyte',1,'1st','Berdejo','Teresita','Macalinao','Filipino','Berdejo','Raul','Añover','Filipino','June 3, 1998','Carigara, Leyte','PURSUANT TO THE DECISION RENDERED BY MCR DARRYL U. MONTEALEGRE DATED JUNE 27, 2025 AND AFFIRMED BY CRG UNDER OCRG NUMBER 25-2820504 DATED SEPTEMBER 24, 2025 THE CHILD\'S MIDDLE NAME IS HEREBY CORRECTED FROM \"M\" TO \"MORANO\".\n\nPURSUANT TO THE DECISION RENDERED BY MCR DARRYL U. MONTEALEGRE DATED JULY 14, 2025 AND AFFIRMED BY CRG UNDER OCRG NUMBER 25-2820504 DATED SEPTEMBER 24, 2025 THE CHILD\'S DATE OF BIRTH IS HEREBY CORRECTED FROM \"JUNE 27, 1956\" TO \"JULY 3, 1956\".\n','Darryl U. Montealegre, MM','','2025-12-17 07:47:54.335','2026-01-13 08:00:03.653',NULL,'','','','','','','1','1','','Darryl U. Montealegre, MM','Registration Officer I');
/*!40000 ALTER TABLE `birthrecord` ENABLE KEYS */;
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
