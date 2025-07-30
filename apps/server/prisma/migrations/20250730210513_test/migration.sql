-- CreateEnum
CREATE TYPE "Role" AS ENUM ('IT', 'OWNER', 'GUEST', 'OPERATOR', 'ADMIN', 'BLOCKED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "telegramId" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "test" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOrganization" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "minThreshold" DECIMAL(65,30) NOT NULL,
    "unit" TEXT DEFAULT 'ед',
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" SERIAL NOT NULL,
    "operatorId" INTEGER,
    "receipts" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER,
    "organizationId" INTEGER NOT NULL,
    "operatorData" JSONB,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "consumptions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "operatorId" INTEGER,
    "organizationId" INTEGER NOT NULL,
    "operatorData" JSONB,

    CONSTRAINT "ShiftReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllowedPhone" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "AllowedPhone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllowedPhoneOrganization" (
    "id" SERIAL NOT NULL,
    "allowedPhoneId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowedPhoneOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE INDEX "User_telegramId_idx" ON "User"("telegramId");

-- CreateIndex
CREATE INDEX "User_active_idx" ON "User"("active");

-- CreateIndex
CREATE INDEX "UserOrganization_userId_idx" ON "UserOrganization"("userId");

-- CreateIndex
CREATE INDEX "UserOrganization_organizationId_idx" ON "UserOrganization"("organizationId");

-- CreateIndex
CREATE INDEX "UserOrganization_userId_organizationId_idx" ON "UserOrganization"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOrganization_userId_organizationId_key" ON "UserOrganization"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "Product_organizationId_idx" ON "Product"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_organizationId_name_key" ON "Product"("organizationId", "name");

-- CreateIndex
CREATE INDEX "Receipt_organizationId_idx" ON "Receipt"("organizationId");

-- CreateIndex
CREATE INDEX "ShiftReport_organizationId_idx" ON "ShiftReport"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "AllowedPhone_phone_key" ON "AllowedPhone"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "AllowedPhone_userId_key" ON "AllowedPhone"("userId");

-- CreateIndex
CREATE INDEX "AllowedPhone_phone_idx" ON "AllowedPhone"("phone");

-- CreateIndex
CREATE INDEX "AllowedPhone_userId_idx" ON "AllowedPhone"("userId");

-- CreateIndex
CREATE INDEX "AllowedPhoneOrganization_allowedPhoneId_idx" ON "AllowedPhoneOrganization"("allowedPhoneId");

-- CreateIndex
CREATE INDEX "AllowedPhoneOrganization_organizationId_idx" ON "AllowedPhoneOrganization"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "AllowedPhoneOrganization_allowedPhoneId_organizationId_key" ON "AllowedPhoneOrganization"("allowedPhoneId", "organizationId");

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftReport" ADD CONSTRAINT "ShiftReport_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftReport" ADD CONSTRAINT "ShiftReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowedPhone" ADD CONSTRAINT "AllowedPhone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowedPhoneOrganization" ADD CONSTRAINT "AllowedPhoneOrganization_allowedPhoneId_fkey" FOREIGN KEY ("allowedPhoneId") REFERENCES "AllowedPhone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowedPhoneOrganization" ADD CONSTRAINT "AllowedPhoneOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
