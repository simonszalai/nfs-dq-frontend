/*
  Warnings:

  - You are about to drop the column `created_at` on the `Field` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `GlobalIssue` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Warning` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Field" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "GlobalIssue" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Warning" DROP COLUMN "created_at";
