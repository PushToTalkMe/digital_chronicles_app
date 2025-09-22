/*
  Warnings:

  - The values [ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Polygon` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `plannedStartAt` to the `facilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."StatusFacility" ADD VALUE 'WAITING';

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('CUSTOMER', 'TECHNICAL_CUSTOMER', 'CONTRACTOR');
ALTER TABLE "public"."users" ALTER COLUMN "role" TYPE "public"."UserRole_new" USING ("role"::text::"public"."UserRole_new");
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Polygon" DROP CONSTRAINT "Polygon_facilityId_fkey";

-- AlterTable
ALTER TABLE "public"."facilities" ADD COLUMN     "plannedStartAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."Polygon";

-- CreateTable
CREATE TABLE "public"."polygons" (
    "coordinates" JSONB NOT NULL,
    "area" DOUBLE PRECISION,
    "facilityId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."actsOfOpeningFacility" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,

    CONSTRAINT "actsOfOpeningFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checkListsForActOfOpening" (
    "id" SERIAL NOT NULL,
    "facilityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "checkListsForActOfOpening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checkListItemsForActOfOpening" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "checklistId" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "checkListItemsForActOfOpening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ActOfOpeningFacilityToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActOfOpeningFacilityToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "polygons_facilityId_key" ON "public"."polygons"("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "actsOfOpeningFacility_facilityId_key" ON "public"."actsOfOpeningFacility"("facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "checkListsForActOfOpening_facilityId_key" ON "public"."checkListsForActOfOpening"("facilityId");

-- CreateIndex
CREATE INDEX "_ActOfOpeningFacilityToUser_B_index" ON "public"."_ActOfOpeningFacilityToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."polygons" ADD CONSTRAINT "polygons_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."actsOfOpeningFacility" ADD CONSTRAINT "actsOfOpeningFacility_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkListsForActOfOpening" ADD CONSTRAINT "checkListsForActOfOpening_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."actsOfOpeningFacility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkListItemsForActOfOpening" ADD CONSTRAINT "checkListItemsForActOfOpening_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "public"."checkListsForActOfOpening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkListItemsForActOfOpening" ADD CONSTRAINT "checkListItemsForActOfOpening_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."checkListItemsForActOfOpening"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ActOfOpeningFacilityToUser" ADD CONSTRAINT "_ActOfOpeningFacilityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."actsOfOpeningFacility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ActOfOpeningFacilityToUser" ADD CONSTRAINT "_ActOfOpeningFacilityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
