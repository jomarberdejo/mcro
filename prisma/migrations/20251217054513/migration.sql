/*
  Warnings:

  - You are about to drop the `birthcertificate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `birthcertificate` DROP FOREIGN KEY `BirthCertificate_createdById_fkey`;

-- DropTable
DROP TABLE `birthcertificate`;

-- CreateTable
CREATE TABLE `BirthRecord` (
    `id` VARCHAR(191) NOT NULL,
    `registryNo` VARCHAR(191) NOT NULL,
    `dateOfRegistration` VARCHAR(191) NOT NULL,
    `childLastName` VARCHAR(191) NOT NULL,
    `childFirstName` VARCHAR(191) NOT NULL,
    `childMiddleName` VARCHAR(191) NULL,
    `sex` VARCHAR(191) NOT NULL,
    `dateOfBirth` VARCHAR(191) NOT NULL,
    `placeOfBirth` VARCHAR(191) NULL,
    `isTwin` BOOLEAN NOT NULL DEFAULT false,
    `birthOrder` VARCHAR(191) NULL,
    `motherLastName` VARCHAR(191) NULL,
    `motherFirstName` VARCHAR(191) NULL,
    `motherMiddleName` VARCHAR(191) NULL,
    `motherCitizenship` VARCHAR(191) NULL,
    `fatherLastName` VARCHAR(191) NULL,
    `fatherFirstName` VARCHAR(191) NULL,
    `fatherMiddleName` VARCHAR(191) NULL,
    `fatherCitizenship` VARCHAR(191) NULL,
    `dateOfMarriage` VARCHAR(191) NULL,
    `placeOfMarriage` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `registrarName` VARCHAR(191) NULL,
    `signatureImagePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `BirthRecord_registryNo_key`(`registryNo`),
    INDEX `BirthRecord_registryNo_idx`(`registryNo`),
    INDEX `BirthRecord_childLastName_childFirstName_idx`(`childLastName`, `childFirstName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BirthRecord` ADD CONSTRAINT `BirthRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
