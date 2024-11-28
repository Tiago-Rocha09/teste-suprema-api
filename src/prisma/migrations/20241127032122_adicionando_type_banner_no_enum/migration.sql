/*
  Warnings:

  - The values [banner] on the enum `Component_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Component` MODIFY `type` ENUM('text', 'richText', 'image', 'grid') NOT NULL;
