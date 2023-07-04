/*
  Warnings:

  - A unique constraint covering the columns `[mob]` on the table `Messages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mob` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `messages` ADD COLUMN `mob` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Messages_mob_key` ON `Messages`(`mob`);
