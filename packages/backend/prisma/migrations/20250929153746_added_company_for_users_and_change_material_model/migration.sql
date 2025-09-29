/*
  Warnings:

  - You are about to drop the column `name` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `materials` table. All the data in the column will be lost.
  - Added the required column `cargo` to the `materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."materials" DROP COLUMN "name",
DROP COLUMN "volume",
ADD COLUMN     "cargo" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "weight" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "company" TEXT NOT NULL;
