-- AlterTable
ALTER TABLE `birthrecord` ADD COLUMN `certificateDate` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `deathrecord` ADD COLUMN `certificateDate` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `marriagerecord` ADD COLUMN `certificateDate` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `supportingdocument` ADD COLUMN `certificateDate` VARCHAR(191) NULL;
