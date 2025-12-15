-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'REGISTRAR', 'STAFF') NOT NULL,
    `office` VARCHAR(191) NOT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_publicId_key`(`publicId`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BirthCertificate` (
    `id` VARCHAR(191) NOT NULL,
    `publicId` VARCHAR(191) NOT NULL,
    `registryNo` VARCHAR(191) NULL,
    `dateOfRegistration` DATETIME(3) NULL,
    `childLastName` VARCHAR(191) NOT NULL,
    `childFirstName` VARCHAR(191) NOT NULL,
    `childMiddleName` VARCHAR(191) NULL,
    `sex` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `placeOfBirth` VARCHAR(191) NOT NULL,
    `motherLastName` VARCHAR(191) NOT NULL,
    `motherFirstName` VARCHAR(191) NOT NULL,
    `motherMiddleName` VARCHAR(191) NULL,
    `motherCitizenship` VARCHAR(191) NULL,
    `fatherLastName` VARCHAR(191) NULL,
    `fatherFirstName` VARCHAR(191) NULL,
    `fatherMiddleName` VARCHAR(191) NULL,
    `fatherCitizenship` VARCHAR(191) NULL,
    `dateOfMarriage` DATETIME(3) NULL,
    `placeOfMarriage` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `signatureUrl` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BirthCertificate_publicId_key`(`publicId`),
    INDEX `BirthCertificate_publicId_idx`(`publicId`),
    INDEX `BirthCertificate_childLastName_childFirstName_idx`(`childLastName`, `childFirstName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BirthCertificate` ADD CONSTRAINT `BirthCertificate_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
