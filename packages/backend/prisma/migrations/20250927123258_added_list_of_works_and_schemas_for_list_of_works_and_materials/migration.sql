-- CreateEnum
CREATE TYPE "public"."ListOfMeasurement" AS ENUM ('RUNNING_METER', 'SQUARE_METER', 'PIECE');

-- CreateTable
CREATE TABLE "public"."ListOfWorks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "count" DOUBLE PRECISION NOT NULL,
    "measurement" "public"."ListOfMeasurement" NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "facilityId" TEXT NOT NULL,

    CONSTRAINT "ListOfWorks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Materials" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "listOfWorkId" INTEGER NOT NULL,

    CONSTRAINT "Materials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ListOfWorks" ADD CONSTRAINT "ListOfWorks_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Materials" ADD CONSTRAINT "Materials_listOfWorkId_fkey" FOREIGN KEY ("listOfWorkId") REFERENCES "public"."ListOfWorks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
