CREATE TABLE IF NOT EXISTS "SiteSettings" (
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

CREATE INDEX IF NOT EXISTS "SiteSettings_deletedAt_idx" ON "SiteSettings" ("deletedAt");

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'SiteSettings'
      AND column_name = 'updatedAt'
      AND column_default IS DISTINCT FROM 'CURRENT_TIMESTAMP'
  ) THEN
    ALTER TABLE "SiteSettings"
      ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;
