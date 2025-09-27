-- CreateTable
CREATE TABLE `Alert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coinId` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(4) NOT NULL DEFAULT 'usd',
    `operator` ENUM('GREATER_THAN', 'LESS_THAN') NOT NULL DEFAULT 'GREATER_THAN',
    `target` DOUBLE NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Alert_coinId_active_idx`(`coinId`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
