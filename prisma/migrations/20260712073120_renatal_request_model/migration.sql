-- DropIndex
DROP INDEX "rentalRequests_tenantId_propertyId_key";

-- AlterTable
ALTER TABLE "rentalRequests" ADD COLUMN     "message" TEXT;
