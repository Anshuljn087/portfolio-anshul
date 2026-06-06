-- CreateTable
CREATE TABLE "ResumeAsset" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResumeAsset_filePath_key" ON "ResumeAsset"("filePath");

-- CreateIndex
CREATE INDEX "ResumeAsset_isCurrent_deletedAt_idx" ON "ResumeAsset"("isCurrent", "deletedAt");

-- CreateIndex
CREATE INDEX "ResumeAsset_createdAt_idx" ON "ResumeAsset"("createdAt");
