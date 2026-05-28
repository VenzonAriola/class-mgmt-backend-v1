-- CreateEnum
CREATE TYPE "class_status" AS ENUM ('active', 'inactive', 'archived');

-- CreateTable
CREATE TABLE "Classes" (
    "id" SERIAL NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "teacherId" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "bannerCldPubId" TEXT,
    "bannerUrl" TEXT,
    "description" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 50,
    "status" "class_status" NOT NULL DEFAULT 'active',
    "schedule" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollments" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Classes_inviteCode_key" ON "Classes"("inviteCode");

-- CreateIndex
CREATE INDEX "Classes_subjectId_idx" ON "Classes"("subjectId");

-- CreateIndex
CREATE INDEX "Classes_teacherId_idx" ON "Classes"("teacherId");

-- CreateIndex
CREATE INDEX "Enrollments_studentId_idx" ON "Enrollments"("studentId");

-- CreateIndex
CREATE INDEX "Enrollments_classId_idx" ON "Enrollments"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollments_studentId_classId_key" ON "Enrollments"("studentId", "classId");

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classes" ADD CONSTRAINT "Classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollments" ADD CONSTRAINT "Enrollments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
