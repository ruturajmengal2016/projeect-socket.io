/*
  Warnings:

  - Made the column `connectionId` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `Messages_connectionId_fkey`;

-- AlterTable
ALTER TABLE `messages` MODIFY `connectionId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_connectionId_fkey` FOREIGN KEY (`connectionId`) REFERENCES `Connection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
