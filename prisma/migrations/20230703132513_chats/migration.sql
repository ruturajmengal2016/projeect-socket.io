-- CreateTable
CREATE TABLE `Connection` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NULL,

    UNIQUE INDEX `Connection_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `id` VARCHAR(191) NOT NULL,
    `data` VARCHAR(191) NOT NULL,
    `connectionId` VARCHAR(191) NULL,

    UNIQUE INDEX `Messages_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_connectionId_fkey` FOREIGN KEY (`connectionId`) REFERENCES `Connection`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
