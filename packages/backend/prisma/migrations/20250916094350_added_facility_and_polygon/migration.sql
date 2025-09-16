-- CreateEnum
CREATE TYPE "public"."StatusFacility" AS ENUM ('IN_PROCESS', 'DONE');

-- CreateTable
CREATE TABLE "public"."facilities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Объект',
    "status" "public"."StatusFacility" NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Polygon" (
    "id" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "area" DOUBLE PRECISION,
    "facilityId" TEXT NOT NULL,

    CONSTRAINT "Polygon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_FacilityToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FacilityToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Polygon_facilityId_key" ON "public"."Polygon"("facilityId");

-- CreateIndex
CREATE INDEX "_FacilityToUser_B_index" ON "public"."_FacilityToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."Polygon" ADD CONSTRAINT "Polygon_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FacilityToUser" ADD CONSTRAINT "_FacilityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."facilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FacilityToUser" ADD CONSTRAINT "_FacilityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
