-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('PERSONAL', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "siteDescription" VARCHAR(320) NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "email" TEXT,
    "socialLinks" JSONB,
    "metadata" JSONB,
    "profileImage" TEXT,
    "profileImageAlt" TEXT,
    "profileImageBlurDataUrl" TEXT,
    "profileImageWidth" INTEGER,
    "profileImageHeight" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "SiteSettings" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "projectType" "ProjectType" NOT NULL DEFAULT 'PROFESSIONAL',
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "summary" VARCHAR(400) NOT NULL,
    "duration" TEXT NOT NULL,
    "category" TEXT,
    "businessDomain" TEXT,
    "responsibilities" TEXT,
    "myContributions" TEXT,
    "keyAchievements" TEXT,
    "teamSize" TEXT,
    "content" TEXT,
    "coverImage" TEXT,
    "galleryImages" TEXT[],
    "stack" TEXT[],
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "architectureNotes" TEXT,
    "challenges" TEXT,
    "solutions" TEXT,
    "metrics" JSONB,
    "seo" JSONB,
    "previewImage" TEXT,
    "showGithub" BOOLEAN NOT NULL DEFAULT true,
    "showLiveUrl" BOOLEAN NOT NULL DEFAULT true,
    "showScreenshots" BOOLEAN NOT NULL DEFAULT true,
    "showMetrics" BOOLEAN NOT NULL DEFAULT true,
    "showArchitecture" BOOLEAN NOT NULL DEFAULT true,
    "showChallenges" BOOLEAN NOT NULL DEFAULT true,
    "showSolutions" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" VARCHAR(280) NOT NULL,
    "content" TEXT NOT NULL,
    "markdown" TEXT,
    "coverImage" TEXT,
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "readingTime" INTEGER NOT NULL DEFAULT 0,
    "seo" JSONB,
    "publishedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "location" TEXT,
    "summary" VARCHAR(400) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" INTEGER,
    "description" VARCHAR(280),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategoryOnBlog" (
    "blogId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "BlogCategoryOnBlog_pkey" PRIMARY KEY ("blogId","categoryId")
);

-- CreateTable
CREATE TABLE "BlogTagOnBlog" (
    "blogId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "BlogTagOnBlog_pkey" PRIMARY KEY ("blogId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_status_featured_idx" ON "Project"("status", "featured");

-- CreateIndex
CREATE INDEX "Project_projectType_featured_idx" ON "Project"("projectType", "featured");

-- CreateIndex
CREATE INDEX "Project_sortOrder_idx" ON "Project"("sortOrder");

-- CreateIndex
CREATE INDEX "Project_deletedAt_idx" ON "Project"("deletedAt");

-- CreateIndex
CREATE INDEX "Project_publishedAt_idx" ON "Project"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_status_idx" ON "Blog"("status");

-- CreateIndex
CREATE INDEX "Blog_featured_idx" ON "Blog"("featured");

-- CreateIndex
CREATE INDEX "Blog_deletedAt_idx" ON "Blog"("deletedAt");

-- CreateIndex
CREATE INDEX "Blog_publishedAt_idx" ON "Blog"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_slug_key" ON "Experience"("slug");

-- CreateIndex
CREATE INDEX "Experience_featured_idx" ON "Experience"("featured");

-- CreateIndex
CREATE INDEX "Experience_deletedAt_idx" ON "Experience"("deletedAt");

-- CreateIndex
CREATE INDEX "Experience_startDate_endDate_idx" ON "Experience"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE INDEX "Skill_category_featured_idx" ON "Skill"("category", "featured");

-- CreateIndex
CREATE INDEX "Skill_deletedAt_idx" ON "Skill"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeAsset_filePath_key" ON "ResumeAsset"("filePath");

-- CreateIndex
CREATE INDEX "ResumeAsset_isCurrent_deletedAt_idx" ON "ResumeAsset"("isCurrent", "deletedAt");

-- CreateIndex
CREATE INDEX "ResumeAsset_createdAt_idx" ON "ResumeAsset"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE INDEX "BlogCategory_slug_idx" ON "BlogCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogTag_slug_key" ON "BlogTag"("slug");

-- CreateIndex
CREATE INDEX "BlogTag_slug_idx" ON "BlogTag"("slug");

-- CreateIndex
CREATE INDEX "BlogCategoryOnBlog_categoryId_idx" ON "BlogCategoryOnBlog"("categoryId");

-- CreateIndex
CREATE INDEX "BlogTagOnBlog_tagId_idx" ON "BlogTagOnBlog"("tagId");

-- AddForeignKey
ALTER TABLE "BlogCategoryOnBlog" ADD CONSTRAINT "BlogCategoryOnBlog_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryOnBlog" ADD CONSTRAINT "BlogCategoryOnBlog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogTagOnBlog" ADD CONSTRAINT "BlogTagOnBlog_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogTagOnBlog" ADD CONSTRAINT "BlogTagOnBlog_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "BlogTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
