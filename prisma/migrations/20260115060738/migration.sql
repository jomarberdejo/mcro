-- AlterTable
ALTER TABLE `deathrecord` MODIFY `age` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `marriagerecord` MODIFY `husbandAge` VARCHAR(191) NOT NULL,
    MODIFY `wifeAge` VARCHAR(191) NOT NULL;
