-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `office` VARCHAR(191) NULL DEFAULT 'MCRO',
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportingDocument` (
    `id` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NULL,
    `mimeType` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('BIRTH_CERTIFICATE', 'DEATH_CERTIFICATE', 'MARRIAGE_CERTIFICATE', 'MARRIAGE_CERTIFICATE_APPLICATION', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `birthRecordId` VARCHAR(191) NULL,
    `deathRecordId` VARCHAR(191) NULL,
    `marriageRecordId` VARCHAR(191) NULL,
    `marriageCertificateApplicationId` VARCHAR(191) NULL,
    `uploadedBy` VARCHAR(191) NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SupportingDocument_birthRecordId_idx`(`birthRecordId`),
    INDEX `SupportingDocument_deathRecordId_idx`(`deathRecordId`),
    INDEX `SupportingDocument_marriageRecordId_idx`(`marriageRecordId`),
    INDEX `SupportingDocument_marriageCertificateApplicationId_idx`(`marriageCertificateApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BirthRecord` (
    `id` VARCHAR(191) NOT NULL,
    `registryNo` VARCHAR(191) NOT NULL,
    `dateOfRegistration` VARCHAR(191) NOT NULL,
    `bookNo` VARCHAR(191) NULL,
    `pageNo` VARCHAR(191) NULL,
    `childLastName` VARCHAR(191) NOT NULL,
    `childFirstName` VARCHAR(191) NOT NULL,
    `childMiddleName` VARCHAR(191) NULL,
    `sex` ENUM('Male', 'Female') NOT NULL,
    `dateOfBirth` VARCHAR(191) NOT NULL,
    `placeOfBirth` VARCHAR(191) NULL,
    `isTwin` BOOLEAN NOT NULL DEFAULT false,
    `typeOfBirth` VARCHAR(191) NULL,
    `birthOrder` VARCHAR(191) NULL,
    `timeOfBirth` VARCHAR(191) NULL,
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
    `remarks` TEXT NULL,
    `registrarName` VARCHAR(191) NULL,
    `signatureImagePath` VARCHAR(191) NULL,
    `processFeeInfo` TEXT NULL,
    `requestorName` VARCHAR(191) NULL,
    `requestPurpose` VARCHAR(191) NULL,
    `verifiedBy` VARCHAR(191) NOT NULL,
    `verifierPosition` VARCHAR(191) NOT NULL,
    `certifyingOfficerName` VARCHAR(191) NULL,
    `certifyingOfficerPosition` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `BirthRecord_registryNo_key`(`registryNo`),
    INDEX `BirthRecord_registryNo_idx`(`registryNo`),
    INDEX `BirthRecord_childLastName_childFirstName_idx`(`childLastName`, `childFirstName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeathRecord` (
    `id` VARCHAR(191) NOT NULL,
    `registryNo` VARCHAR(191) NOT NULL,
    `pageNo` VARCHAR(191) NULL,
    `bookNo` VARCHAR(191) NULL,
    `deceasedLastName` VARCHAR(191) NOT NULL,
    `deceasedFirstName` VARCHAR(191) NOT NULL,
    `deceasedMiddleName` VARCHAR(191) NULL,
    `sex` ENUM('Male', 'Female') NOT NULL,
    `age` VARCHAR(191) NOT NULL,
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
    `certifyingOfficerName` VARCHAR(191) NULL,
    `certifyingOfficerPosition` VARCHAR(191) NULL,
    `processFeeInfo` TEXT NULL,
    `remarks` TEXT NULL,
    `signatureImagePath` VARCHAR(191) NULL,
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
    `husbandAge` VARCHAR(191) NOT NULL,
    `husbandNationality` VARCHAR(191) NOT NULL,
    `husbandCivilStatus` ENUM('Single', 'Married', 'Widowed', 'Divorced') NOT NULL,
    `husbandMotherName` VARCHAR(191) NULL,
    `husbandFatherName` VARCHAR(191) NULL,
    `wifeLastName` VARCHAR(191) NOT NULL,
    `wifeFirstName` VARCHAR(191) NOT NULL,
    `wifeMiddleName` VARCHAR(191) NULL,
    `wifeAge` VARCHAR(191) NOT NULL,
    `wifeNationality` VARCHAR(191) NOT NULL,
    `wifeCivilStatus` ENUM('Single', 'Married', 'Widowed', 'Divorced') NOT NULL,
    `wifeMotherName` VARCHAR(191) NULL,
    `wifeFatherName` VARCHAR(191) NULL,
    `requestorName` VARCHAR(191) NULL,
    `requestPurpose` VARCHAR(191) NULL,
    `registrarName` VARCHAR(191) NULL,
    `verifiedBy` VARCHAR(191) NULL,
    `verifierPosition` VARCHAR(191) NULL,
    `certifyingOfficerName` VARCHAR(191) NULL,
    `certifyingOfficerPosition` VARCHAR(191) NULL,
    `processFeeInfo` VARCHAR(191) NULL,
    `remarks` TEXT NULL,
    `signatureImagePath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `MarriageRecord_registryNo_key`(`registryNo`),
    INDEX `MarriageRecord_registryNo_idx`(`registryNo`),
    INDEX `MarriageRecord_husbandLastName_husbandFirstName_idx`(`husbandLastName`, `husbandFirstName`),
    INDEX `MarriageRecord_wifeLastName_wifeFirstName_idx`(`wifeLastName`, `wifeFirstName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarriageCertificateApplication` (
    `id` VARCHAR(191) NOT NULL,
    `registryNo` VARCHAR(191) NOT NULL,
    `bookNo` VARCHAR(191) NULL,
    `pageNo` VARCHAR(191) NULL,
    `dateOfRegistration` VARCHAR(191) NULL,
    `groomFirstName` VARCHAR(191) NOT NULL,
    `groomMiddleName` VARCHAR(191) NULL,
    `groomLastName` VARCHAR(191) NOT NULL,
    `groomDateOfBirth` VARCHAR(191) NOT NULL,
    `brideFirstName` VARCHAR(191) NOT NULL,
    `brideMiddleName` VARCHAR(191) NULL,
    `brideLastName` VARCHAR(191) NOT NULL,
    `brideDateOfBirth` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `MarriageCertificateApplication_registryNo_idx`(`registryNo`),
    INDEX `MarriageCertificateApplication_groomLastName_groomFirstName_idx`(`groomLastName`, `groomFirstName`),
    INDEX `MarriageCertificateApplication_brideLastName_brideFirstName_idx`(`brideLastName`, `brideFirstName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SupportingDocument` ADD CONSTRAINT `SupportingDocument_birthRecordId_fkey` FOREIGN KEY (`birthRecordId`) REFERENCES `BirthRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingDocument` ADD CONSTRAINT `SupportingDocument_deathRecordId_fkey` FOREIGN KEY (`deathRecordId`) REFERENCES `DeathRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingDocument` ADD CONSTRAINT `SupportingDocument_marriageRecordId_fkey` FOREIGN KEY (`marriageRecordId`) REFERENCES `MarriageRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingDocument` ADD CONSTRAINT `SupportingDocument_marriageCertificateApplicationId_fkey` FOREIGN KEY (`marriageCertificateApplicationId`) REFERENCES `MarriageCertificateApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BirthRecord` ADD CONSTRAINT `BirthRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeathRecord` ADD CONSTRAINT `DeathRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarriageRecord` ADD CONSTRAINT `MarriageRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarriageCertificateApplication` ADD CONSTRAINT `MarriageCertificateApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
