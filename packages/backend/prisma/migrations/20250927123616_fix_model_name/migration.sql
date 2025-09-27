/*
  Warnings:

  - You are about to drop the `ListOfWorks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Materials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ListOfWorks" DROP CONSTRAINT "ListOfWorks_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Materials" DROP CONSTRAINT "Materials_listOfWorkId_fkey";

-- DropTable
DROP TABLE "public"."ListOfWorks";

-- DropTable
DROP TABLE "public"."Materials";

-- CreateTable
CREATE TABLE "public"."listOfWorks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "count" DOUBLE PRECISION NOT NULL,
    "measurement" "public"."ListOfMeasurement" NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "facilityId" TEXT NOT NULL,

    CONSTRAINT "listOfWorks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."materials" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "listOfWorkId" INTEGER NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."listOfWorks" ADD CONSTRAINT "listOfWorks_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."materials" ADD CONSTRAINT "materials_listOfWorkId_fkey" FOREIGN KEY ("listOfWorkId") REFERENCES "public"."listOfWorks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
