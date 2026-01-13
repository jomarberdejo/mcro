-- AlterTable
ALTER TABLE `birthrecord` ADD COLUMN `certifyingOfficerName` VARCHAR(191) NULL,
    ADD COLUMN `certifyingOfficerPosition` VARCHAR(191) NULL,
    ADD COLUMN `requestPurpose` VARCHAR(191) NULL,
    ADD COLUMN `requestorName` VARCHAR(191) NULL;
