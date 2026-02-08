-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'COMPANY_USER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "SubmissionStatus" AS ENUM ('NOT_STARTED', 'DRAFT', 'SUBMITTED', 'GRADED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'COMPANY_USER',
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "primaryLanguage" TEXT,
    "framework" TEXT,
    "contactEmail" TEXT,
    "teamSize" INTEGER,
    "githubUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Baseline" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "data" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Baseline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "SprintReport" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "data" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SprintReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "GovernanceChecklist" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "data" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Score" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "agenticEvidence" INTEGER NOT NULL DEFAULT 0,
    "cycleTimeImprovement" INTEGER NOT NULL DEFAULT 0,
    "reviewEfficiency" INTEGER NOT NULL DEFAULT 0,
    "qualityReliability" INTEGER NOT NULL DEFAULT 0,
    "governanceReadiness" INTEGER NOT NULL DEFAULT 0,
    "repeatability" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "notes" VARCHAR(280),
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Announcement" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProgramSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "programName" TEXT NOT NULL DEFAULT 'AI Velocity Pack',
    "dayZero" TIMESTAMP(3) NOT NULL,
    "baselineDue" TIMESTAMP(3) NOT NULL,
    "sprintDue" TIMESTAMP(3) NOT NULL,
    "aiModel" TEXT NOT NULL DEFAULT 'anthropic/claude-sonnet-4.5',
    "autoAnalyze" BOOLEAN NOT NULL DEFAULT false,
    "maxAnalysesPerDay" INTEGER NOT NULL DEFAULT 3,
    "requireAiBeforeManual" BOOLEAN NOT NULL DEFAULT false,
    "notifyWelcome" BOOLEAN NOT NULL DEFAULT true,
    "notify48h" BOOLEAN NOT NULL DEFAULT true,
    "notify24h" BOOLEAN NOT NULL DEFAULT true,
    "notifySubmission" BOOLEAN NOT NULL DEFAULT true,
    "notifyScore" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AiAnalysis" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "aiScores" JSONB NOT NULL,
    "finalScores" JSONB,
    "adminEdits" JSONB,
    "adminNotes" TEXT,
    "savedBy" TEXT,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "CodebaseAudit" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "auditSummary" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodebaseAudit_pkey" PRIMARY KEY ("id")
);

-- Add missing columns to Company (if table already exists without them)
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "teamSize" INTEGER;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "githubUrl" TEXT;
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true;

-- Add missing columns to ProgramSettings (if table already exists without them)
ALTER TABLE "ProgramSettings" ADD COLUMN IF NOT EXISTS "aiModel" TEXT NOT NULL DEFAULT 'anthropic/claude-sonnet-4.5';
ALTER TABLE "ProgramSettings" ADD COLUMN IF NOT EXISTS "autoAnalyze" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ProgramSettings" ADD COLUMN IF NOT EXISTS "maxAnalysesPerDay" INTEGER NOT NULL DEFAULT 3;
ALTER TABLE "ProgramSettings" ADD COLUMN IF NOT EXISTS "requireAiBeforeManual" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ProgramSettings" ADD COLUMN IF NOT EXISTS "notifyWelcome" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ProgramSettings" ADD COLUMN IF NOT EXISTS "notify48h" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ProgramSettings" ADD COLUMN IF NOT EXISTS "notify24h" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ProgramSettings" ADD COLUMN IF NOT EXISTS "notifySubmission" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ProgramSettings" ADD COLUMN IF NOT EXISTS "notifyScore" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Baseline_companyId_key" ON "Baseline"("companyId");
CREATE UNIQUE INDEX IF NOT EXISTS "SprintReport_companyId_key" ON "SprintReport"("companyId");
CREATE UNIQUE INDEX IF NOT EXISTS "GovernanceChecklist_companyId_key" ON "GovernanceChecklist"("companyId");
CREATE UNIQUE INDEX IF NOT EXISTS "Score_companyId_key" ON "Score"("companyId");
CREATE UNIQUE INDEX IF NOT EXISTS "CodebaseAudit_companyId_key" ON "CodebaseAudit"("companyId");

-- AddForeignKey (ignore if already exists)
DO $$ BEGIN
    ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Baseline" ADD CONSTRAINT "Baseline_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "SprintReport" ADD CONSTRAINT "SprintReport_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "GovernanceChecklist" ADD CONSTRAINT "GovernanceChecklist_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Score" ADD CONSTRAINT "Score_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "CodebaseAudit" ADD CONSTRAINT "CodebaseAudit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
