/*
  Warnings:

  - You are about to drop the `Email_Verification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Email_Verification" DROP CONSTRAINT "Email_Verification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "Email_Verification";

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "sessios" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_userId_key" ON "email_verification"("userId");

-- AddForeignKey
ALTER TABLE "sessios" ADD CONSTRAINT "sessios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
