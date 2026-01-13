/*
  Warnings:

  - You are about to drop the column `registrationFeeInfo` on the `birthrecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `birthrecord` DROP COLUMN `registrationFeeInfo`,
    ADD COLUMN `bookNo` VARCHAR(191) NULL,
    ADD COLUMN `pageNo` VARCHAR(191) NULL,
    ADD COLUMN `processFeeInfo` TEXT NULL;

-- CreateTable
CREATE TABLE `DeathRecord` (
    `id` VARCHAR(191) NOT NULL,
    `registryNo` VARCHAR(191) NOT NULL,
    `bookNo` VARCHAR(191) NULL,
    `pageNo` VARCHAR(191) NULL,
    `deceasedLastName` VARCHAR(191) NOT NULL,
    `deceasedFirstName` VARCHAR(191) NOT NULL,
    `deceasedMiddleName` VARCHAR(191) NULL,
    `sex` ENUM('Male', 'Female') NOT NULL,
    `age` INTEGER NOT NULL,
    `civilStatus` ENUM('Single', 'Married', 'Widowed', 'Divorced') NOT NULL,
    `citizenship` VARCHAR(191) NOT NULL,
    `dateOfDeath` VARCHAR(191) NOT NULL,
    `placeOfDeath` VARCHAR(191) NOT NULL,
    `causeOfDeath` VARCHAR(191) NOT NULL,
    `dateOfRegistration` VARCHAR(191) NOT NULL,
    `requestorName` VARCHAR(191) NULL,
    `requestPurpose` VARCHAR(191) NULL,
    `registrarName` VARCHAR(191) NULL,
    `verifiedBy` VARCHAR(191) NULL,
    `verifierPosition` VARCHAR(191) NULL,
    `processFeeInfo` TEXT NULL,
    `remarks` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `DeathRecord_registryNo_key`(`registryNo`),
    INDEX `DeathRecord_registryNo_idx`(`registryNo`),
    INDEX `DeathRecord_deceasedLastName_deceasedFirstName_idx`(`deceasedLastName`, `deceasedFirstName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarriageRecord` (
    `id` VARCHAR(191) NOT NULL,
    `registryNo` VARCHAR(191) NOT NULL,
    `bookNo` VARCHAR(191) NULL,
    `pageNo` VARCHAR(191) NULL,
    `dateOfMarriage` VARCHAR(191) NOT NULL,
    `placeOfMarriage` VARCHAR(191) NOT NULL,
    `dateOfRegistration` VARCHAR(191) NULL,
    `husbandLastName` VARCHAR(191) NOT NULL,
    `husbandFirstName` VARCHAR(191) NOT NULL,
    `husbandMiddleName` VARCHAR(191) NULL,
    `husbandAge` INTEGER NOT NULL,
    `husbandNationality` VARCHAR(191) NOT NULL,
    `husbandCivilStatus` ENUM('Single', 'Married', 'Widowed', 'Divorced') NOT NULL,
    `husbandMotherName` VARCHAR(191) NULL,
    `husbandFatherName` VARCHAR(191) NULL,
    `wifeLastName` VARCHAR(191) NOT NULL,
    `wifeFirstName` VARCHAR(191) NOT NULL,
    `wifeMiddleName` VARCHAR(191) NULL,
    `wifeAge` INTEGER NOT NULL,
    `wifeNationality` VARCHAR(191) NOT NULL,
    `wifeCivilStatus` ENUM('Single', 'Married', 'Widowed', 'Divorced') NOT NULL,
    `wifeMotherName` VARCHAR(191) NULL,
    `wifeFatherName` VARCHAR(191) NULL,
    `requestorName` VARCHAR(191) NULL,
    `requestPurpose` VARCHAR(191) NULL,
    `registrarName` VARCHAR(191) NULL,
    `verifiedBy` VARCHAR(191) NULL,
    `verifierPosition` VARCHAR(191) NULL,
    `processFeeInfo` VARCHAR(191) NULL,
    `remarks` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `MarriageRecord_registryNo_key`(`registryNo`),
    INDEX `MarriageRecord_registryNo_idx`(`registryNo`),
    INDEX `MarriageRecord_husbandLastName_husbandFirstName_idx`(`husbandLastName`, `husbandFirstName`),
    INDEX `MarriageRecord_wifeLastName_wifeFirstName_idx`(`wifeLastName`, `wifeFirstName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DeathRecord` ADD CONSTRAINT `DeathRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarriageRecord` ADD CONSTRAINT `MarriageRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
