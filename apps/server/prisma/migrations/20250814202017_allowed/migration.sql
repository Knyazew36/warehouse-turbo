/*
  Warnings:

  - You are about to drop the `AllowedPhone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AllowedPhoneOrganization` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AllowedPhone" DROP CONSTRAINT "AllowedPhone_userId_fkey";

-- DropForeignKey
ALTER TABLE "AllowedPhoneOrganization" DROP CONSTRAINT "AllowedPhoneOrganization_allowedPhoneId_fkey";

-- DropForeignKey
ALTER TABLE "AllowedPhoneOrganization" DROP CONSTRAINT "AllowedPhoneOrganization_organizationId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ALTER COLUMN "telegramId" DROP NOT NULL;

-- DropTable
DROP TABLE "AllowedPhone";

-- DropTable
DROP TABLE "AllowedPhoneOrganization";

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");
