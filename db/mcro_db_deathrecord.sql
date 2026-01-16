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
-- Table structure for table `deathrecord`
--

DROP TABLE IF EXISTS `deathrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deathrecord` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registryNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bookNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pageNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deceasedLastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deceasedFirstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deceasedMiddleName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sex` enum('Male','Female') COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `civilStatus` enum('Single','Married','Widowed','Divorced') COLLATE utf8mb4_unicode_ci NOT NULL,
  `citizenship` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateOfDeath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `placeOfDeath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `causeOfDeath` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateOfRegistration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requestorName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestPurpose` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registrarName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verifiedBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verifierPosition` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `processFeeInfo` text COLLATE utf8mb4_unicode_ci,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certifyingOfficerName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certifyingOfficerPosition` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signatureImagePath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `DeathRecord_registryNo_key` (`registryNo`),
  KEY `DeathRecord_registryNo_idx` (`registryNo`),
  KEY `DeathRecord_deceasedLastName_deceasedFirstName_idx` (`deceasedLastName`,`deceasedFirstName`),
  KEY `DeathRecord_userId_fkey` (`userId`),
  CONSTRAINT `DeathRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deathrecord`
--

LOCK TABLES `deathrecord` WRITE;
/*!40000 ALTER TABLE `deathrecord` DISABLE KEYS */;
INSERT INTO `deathrecord` VALUES ('cmkewjr7r0000ckfs83sed8se','286','5','10','PLATILLA','JUANITA','','Female','9','Single','Filipino','August 28, 1966','Sogod Carigara, Leyte','Acute Bronchitis','August 29, 1966','COLITA PLATILLA FAMI','upon her request','DARRYL U. MONTEALEGRE, MM','LIGAYA B. BRIER','Admin. Aide III','O.R No. : 1365062\nAmount Paid: Ph50.00\nDate Paid: December 11, 2025\nDoc. Authentication Fee: Ph10.00 doc. Stamp tax: Ph30.00','','2026-01-15 03:40:52.737','2026-01-16 03:59:15.756',NULL,'','','');
/*!40000 ALTER TABLE `deathrecord` ENABLE KEYS */;
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
