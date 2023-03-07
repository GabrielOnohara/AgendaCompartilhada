/*
  Warnings:

  - You are about to drop the column `timeDay` on the `scheduletime` table. All the data in the column will be lost.
  - You are about to drop the column `timeMonth` on the `scheduletime` table. All the data in the column will be lost.
  - You are about to drop the column `timeYear` on the `scheduletime` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `scheduletime` DROP COLUMN `timeDay`,
    DROP COLUMN `timeMonth`,
    DROP COLUMN `timeYear`,
    ADD COLUMN `dateDay` INTEGER NOT NULL DEFAULT 4,
    ADD COLUMN `dateMonth` INTEGER NOT NULL DEFAULT 3,
    ADD COLUMN `dateYear` INTEGER NOT NULL DEFAULT 2023,
    ADD COLUMN `time` VARCHAR(191) NOT NULL DEFAULT '';
