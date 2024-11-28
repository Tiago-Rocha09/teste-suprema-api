-- AlterTable
ALTER TABLE `Component` MODIFY `type` ENUM('text', 'richText', 'image', 'grid', 'banner') NOT NULL;
