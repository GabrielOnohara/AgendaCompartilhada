/*
  Warnings:

  - Made the column `companyId` on table `contribuitor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `contribuitor` DROP FOREIGN KEY `Contribuitor_companyId_fkey`;

-- AlterTable
ALTER TABLE `contribuitor` MODIFY `companyId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Contribuitor` ADD CONSTRAINT `Contribuitor_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
