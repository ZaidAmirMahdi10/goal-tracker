/*
  Warnings:

  - Made the column `deadline` on table `Goal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Goal` ADD COLUMN `completed` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `deadline` DATETIME(3) NOT NULL;
