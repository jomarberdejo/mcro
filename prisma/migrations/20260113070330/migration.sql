-- CreateTable
CREATE TABLE `SupportingDocument` (
    `id` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NULL,
    `mimeType` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('BIRTH_CERTIFICATE', 'DEATH_CERTIFICATE', 'MARRIAGE_CERTIFICATE', 'IDENTIFICATION', 'AUTHORIZATION_LETTER', 'OTHER') NOT NULL DEFAULT 'OTHER',
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

-- AddForeignKey
ALTER TABLE `SupportingDocument` ADD CONSTRAINT `SupportingDocument_birthRecordId_fkey` FOREIGN KEY (`birthRecordId`) REFERENCES `BirthRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingDocument` ADD CONSTRAINT `SupportingDocument_deathRecordId_fkey` FOREIGN KEY (`deathRecordId`) REFERENCES `DeathRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingDocument` ADD CONSTRAINT `SupportingDocument_marriageRecordId_fkey` FOREIGN KEY (`marriageRecordId`) REFERENCES `MarriageRecord`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportingDocument` ADD CONSTRAINT `SupportingDocument_marriageCertificateApplicationId_fkey` FOREIGN KEY (`marriageCertificateApplicationId`) REFERENCES `MarriageCertificateApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
