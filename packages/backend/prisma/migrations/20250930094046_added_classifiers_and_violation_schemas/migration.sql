-- CreateEnum
CREATE TYPE "public"."CategoryOfClassifier" AS ENUM ('COMPLETED_WORKS', 'PRODUCTION_CULTURE', 'DOCUMENTATION', 'PRODUCTION_TECHNOLOGY', 'ABP_LAYING_TECHNOLOGY', 'PROJECT_SOLUTION', 'OLX_INSTALLATION_TECHNOLOGY', 'LAWN_TECHNOLOGY');

-- CreateEnum
CREATE TYPE "public"."ViewOfClassifier" AS ENUM ('AVOIDABLE', 'UNAVOIDABLE');

-- CreateEnum
CREATE TYPE "public"."TypeOfClassifier" AS ENUM ('ROUGH', 'SIMPLE');

-- CreateTable
CREATE TABLE "public"."Violation" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classifierId" INTEGER NOT NULL,
    "facilityId" TEXT NOT NULL,

    CONSTRAINT "Violation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Classifier" (
    "id" SERIAL NOT NULL,
    "deadline" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "category" "public"."CategoryOfClassifier" NOT NULL,
    "view" "public"."ViewOfClassifier" NOT NULL,
    "type" "public"."TypeOfClassifier" NOT NULL,

    CONSTRAINT "Classifier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Violation" ADD CONSTRAINT "Violation_classifierId_fkey" FOREIGN KEY ("classifierId") REFERENCES "public"."Classifier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Violation" ADD CONSTRAINT "Violation_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
