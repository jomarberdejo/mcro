/*
  Warnings:

  - The values [IDENTIFICATION,AUTHORIZATION_LETTER] on the enum `SupportingDocument_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `supportingdocument` MODIFY `type` ENUM('BIRTH_CERTIFICATE', 'DEATH_CERTIFICATE', 'MARRIAGE_CERTIFICATE', 'MARRIAGE_CERTIFICATE_APPLICATION', 'OTHER') NOT NULL DEFAULT 'OTHER';
