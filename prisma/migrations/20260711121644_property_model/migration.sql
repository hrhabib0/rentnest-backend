/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "size" INTEGER;
