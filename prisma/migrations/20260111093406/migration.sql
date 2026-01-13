/*
  Warnings:

  - Added the required column `verifiedBy` to the `BirthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verifierPosition` to the `BirthRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `birthrecord` ADD COLUMN `verifiedBy` VARCHAR(191) NOT NULL,
    ADD COLUMN `verifierPosition` VARCHAR(191) NOT NULL;
