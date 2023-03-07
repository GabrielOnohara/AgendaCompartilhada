/*
  Warnings:

  - You are about to drop the column `time` on the `scheduletime` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `scheduletime` DROP COLUMN `time`,
    ADD COLUMN `timeDay` INTEGER NOT NULL DEFAULT 4,
    ADD COLUMN `timeMonth` INTEGER NOT NULL DEFAULT 3,
    ADD COLUMN `timeYear` INTEGER NOT NULL DEFAULT 2023;
