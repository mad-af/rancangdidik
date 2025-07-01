-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "attachmentUrl" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);
