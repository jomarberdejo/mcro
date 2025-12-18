/*
  Warnings:

  - You are about to alter the column `sex` on the `birthrecord` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `birthrecord` MODIFY `sex` ENUM('Male', 'Female') NOT NULL;
