/*
  Warnings:

  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Department` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Subjects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Subjects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `departmentId` on the `Subjects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Subjects" DROP CONSTRAINT "Subjects_departmentId_fkey";

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Subjects" DROP CONSTRAINT "Subjects_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" INTEGER NOT NULL,
ADD CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Subjects" ADD CONSTRAINT "Subjects_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
