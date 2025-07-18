-- Миграция для добавления поддержки организаций
-- Создаем таблицы организаций

-- 1. Создаем таблицу Organization
CREATE TABLE "Organization" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- 2. Создаем таблицу UserOrganization
CREATE TABLE "UserOrganization" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserOrganization_userId_organizationId_key" UNIQUE ("userId", "organizationId")
);

-- 3. Создаем дефолтную организацию
INSERT INTO "Organization" ("name", "description", "createdAt", "updatedAt", "active") 
VALUES ('Основная организация', 'Организация по умолчанию', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true);

-- 4. Добавляем organizationId в таблицу Product
ALTER TABLE "Product" ADD COLUMN "organizationId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Добавляем organizationId в таблицу Receipt
ALTER TABLE "Receipt" ADD COLUMN "organizationId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 6. Добавляем organizationId в таблицу ShiftReport
ALTER TABLE "ShiftReport" ADD COLUMN "organizationId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "ShiftReport" ADD CONSTRAINT "ShiftReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 7. Добавляем organizationId в таблицу AllowedPhone
ALTER TABLE "AllowedPhone" ADD COLUMN "organizationId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "AllowedPhone" ADD CONSTRAINT "AllowedPhone_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 8. Добавляем связи в таблицу UserOrganization для существующих пользователей
INSERT INTO "UserOrganization" ("userId", "organizationId", "role", "isOwner", "createdAt", "updatedAt")
SELECT 
    u."id" as "userId",
    1 as "organizationId",
    u."role",
    CASE WHEN u."role" = 'OWNER' THEN true ELSE false END as "isOwner",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "User" u
WHERE u."active" = true;

-- 9. Удаляем уникальное ограничение на name в Product и добавляем составное
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_name_key";
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_name_key" UNIQUE ("organizationId", "name");

-- 10. Удаляем дефолтные значения organizationId
ALTER TABLE "Product" ALTER COLUMN "organizationId" DROP DEFAULT;
ALTER TABLE "Receipt" ALTER COLUMN "organizationId" DROP DEFAULT;
ALTER TABLE "ShiftReport" ALTER COLUMN "organizationId" DROP DEFAULT;
ALTER TABLE "AllowedPhone" ALTER COLUMN "organizationId" DROP DEFAULT; 