/*
  Warnings:

  - Changed the type of `completed` on the `checkListItemsForActOfOpening` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."CheckListItemStatus" AS ENUM ('YES', 'NO', 'OPTIONAL');

-- AlterTable
ALTER TABLE "public"."checkListItemsForActOfOpening" DROP COLUMN "completed",
ADD COLUMN     "completed" "public"."CheckListItemStatus" NOT NULL;
