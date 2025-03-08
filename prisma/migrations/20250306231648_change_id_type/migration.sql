/*
  Warnings:

  - The primary key for the `VCard` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "VCard" DROP CONSTRAINT "VCard_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "VCard_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VCard_id_seq";
