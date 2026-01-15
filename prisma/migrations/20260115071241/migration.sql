/*
  Warnings:

  - You are about to drop the column `publicId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_publicId_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `publicId`,
    DROP COLUMN `role`,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `office` VARCHAR(191) NULL DEFAULT 'MCRO';
