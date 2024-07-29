/*
  Warnings:

  - The primary key for the `user_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id", "userId");
DROP SEQUENCE "user_profiles_id_seq";
