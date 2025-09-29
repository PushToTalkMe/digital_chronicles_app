/*
  Warnings:

  - Added the required column `status` to the `actsOfOpeningFacility` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."StatusActOfOpening" AS ENUM ('WAITING_APPROVE', 'IN_PROCESS', 'DONE');

-- AlterTable
ALTER TABLE "public"."actsOfOpeningFacility" ADD COLUMN     "status" "public"."StatusActOfOpening" NOT NULL;
