/*
  Warnings:

  - You are about to drop the column `address` on the `adoption_centers` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `adoption_centers` table. All the data in the column will be lost.
  - Added the required column `country` to the `adoption_centers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landmark` to the `adoption_centers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `adoption_centers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `adoption_centers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `adoption_centers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `adoption_centers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adoption_centers" DROP COLUMN "address",
DROP COLUMN "phoneNumber",
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "landmark" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "pincode" INTEGER NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;
