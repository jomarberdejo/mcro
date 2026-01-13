-- AlterTable
ALTER TABLE `birthrecord` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `deathrecord` ADD COLUMN `certifyingOfficerName` VARCHAR(191) NULL,
    ADD COLUMN `certifyingOfficerPosition` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `marriagerecord` ADD COLUMN `certifyingOfficerName` VARCHAR(191) NULL,
    ADD COLUMN `certifyingOfficerPosition` VARCHAR(191) NULL;
