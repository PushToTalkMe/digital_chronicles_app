/*
  Warnings:

  - You are about to drop the column `image` on the `violations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."violations" DROP COLUMN "image",
ADD COLUMN     "files" TEXT[];
