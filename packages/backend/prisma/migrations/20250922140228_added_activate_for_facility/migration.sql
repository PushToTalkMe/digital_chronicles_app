-- DropForeignKey
ALTER TABLE "public"."checkListItemsForActOfOpening" DROP CONSTRAINT "checkListItemsForActOfOpening_checklistId_fkey";

-- AlterTable
ALTER TABLE "public"."checkListItemsForActOfOpening" ADD COLUMN     "description" TEXT,
ALTER COLUMN "checklistId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."checkListItemsForActOfOpening" ADD CONSTRAINT "checkListItemsForActOfOpening_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "public"."checkListsForActOfOpening"("id") ON DELETE SET NULL ON UPDATE CASCADE;
