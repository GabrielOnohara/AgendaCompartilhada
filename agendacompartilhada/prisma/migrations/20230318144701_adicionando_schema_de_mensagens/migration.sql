-- AlterTable
ALTER TABLE `scheduletime` ADD COLUMN `messageId` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `scheduleTimeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_scheduleTimeId_fkey` FOREIGN KEY (`scheduleTimeId`) REFERENCES `ScheduleTime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
