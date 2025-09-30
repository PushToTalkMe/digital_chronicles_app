/*
  Warnings:

  - You are about to drop the `Classifier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Violation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Violation" DROP CONSTRAINT "Violation_classifierId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Violation" DROP CONSTRAINT "Violation_facilityId_fkey";

-- DropTable
DROP TABLE "public"."Classifier";

-- DropTable
DROP TABLE "public"."Violation";

-- CreateTable
CREATE TABLE "public"."violations" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classifierId" INTEGER NOT NULL,
    "facilityId" TEXT NOT NULL,

    CONSTRAINT "violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classifiers" (
    "id" SERIAL NOT NULL,
    "deadline" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "category" "public"."CategoryOfClassifier" NOT NULL,
    "view" "public"."ViewOfClassifier" NOT NULL,
    "type" "public"."TypeOfClassifier" NOT NULL,

    CONSTRAINT "classifiers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."violations" ADD CONSTRAINT "violations_classifierId_fkey" FOREIGN KEY ("classifierId") REFERENCES "public"."classifiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."violations" ADD CONSTRAINT "violations_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
