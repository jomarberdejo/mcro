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
ALTER TABLE `MarriageCertificateApplication` ADD CONSTRAINT `MarriageCertificateApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
