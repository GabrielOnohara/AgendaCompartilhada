/*
  Warnings:

  - You are about to drop the column `dateDay` on the `scheduletime` table. All the data in the column will be lost.
  - You are about to drop the column `dateMonth` on the `scheduletime` table. All the data in the column will be lost.
  - You are about to drop the column `dateYear` on the `scheduletime` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `scheduletime` DROP COLUMN `dateDay`,
    DROP COLUMN `dateMonth`,
    DROP COLUMN `dateYear`;
