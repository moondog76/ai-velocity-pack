import { z } from 'zod';

// --- BASELINE SCHEMA ---
export const repoContextSchema = z.object({
  primaryRepos: z.string().min(1, 'At least one repo URL is required'),
  language: z.string().min(1, 'Primary language is required'),
  framework: z.string().min(1, 'Framework is required'),
  buildCommand: z.string().min(1, 'Build command is required'),
  testCommand: z.string().min(1, 'Test command is required'),
  ciSystem: z.string().min(1, 'CI system is required'),
  deployCadence: z.string().min(1, 'Deploy cadence is required'),
});

export const baselineMetricsSchema = z.object({
  medianPRCycleTime: z.string().min(1, 'PR cycle time is required'),
  medianReviewIterations: z.coerce.number().int().min(0),
  ciFailureRate: z.coerce.number().min(0).max(100),
  flakyTests: z.boolean(),
  flakyTestsNotes: z.string().optional().default(''),
  deployFrequency: z.string().min(1, 'Deploy frequency is required'),
  rollbacksIncidents: z.coerce.number().int().min(0),
});

export const microRunSchema = z.object({
  targetArea: z.string().min(1, 'Target area is required'),
  outputDescription: z.string().min(1, 'Output description is required'),
  humanTimeMinutes: z.coerce.number().int().min(0),
  result: z.enum(['PR_CREATED', 'PR_MERGED', 'COMMITTED', 'NOT_COMPLETED']),
  notes: z.string().optional().default(''),
});

export const blockersSchema = z.object({
  tooling: z.string().optional().default(''),
  policy: z.string().optional().default(''),
  codebase: z.string().optional().default(''),
});

export const sprintItemSchema = z.object({
  description: z.string().min(1, 'Sprint item description is required'),
  rationale: z.string().min(1, 'Rationale is required'),
});

export const baselineSchema = z.object({
  repoContext: repoContextSchema,
  baselineMetrics: baselineMetricsSchema,
  microRun1: microRunSchema,
  microRun2: microRunSchema,
  blockers: blockersSchema,
  sprintItem: sprintItemSchema,
});

export type BaselineData = z.infer<typeof baselineSchema>;

// --- SPRINT REPORT SCHEMA ---
export const sprintInfoSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  engineersInvolved: z.coerce.number().int().min(1, 'At least 1 engineer required'),
});

export const scopeSchema = z.object({
  featureDescription: z.string().min(1, 'Feature description is required'),
  filesTouched: z.string().min(1, 'Files touched is required'),
  risk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  riskRationale: z.string().min(1, 'Risk rationale is required'),
});

export const agenticEvidenceSchema = z.object({
  toolsUsed: z.string().min(1, 'Tools used is required'),
  commandsRun: z.string().min(1, 'Commands run is required'),
  prLink: z.string().optional().default(''),
  ciRunLink: z.string().optional().default(''),
});

export const deltasSchema = z.object({
  engineerTime: z.coerce.number().int().min(0),
  calendarTime: z.string().min(1, 'Calendar time is required'),
  reviewIterations: z.coerce.number().int().min(0),
  ciFailures: z.coerce.number().int().min(0),
  testsUpdated: z.boolean(),
  testsNotes: z.string().optional().default(''),
  docsUpdated: z.boolean(),
  docsNotes: z.string().optional().default(''),
  postMergeIssues: z.string().optional().default(''),
});

export const improvementItemSchema = z.object({
  item: z.string().min(1, 'Description is required'),
});

export const decisionSchema = z.object({
  nextStep: z.enum(['EXPAND', 'MAINTAIN', 'PAUSE', 'STOP']),
  nextUseCases: z.array(z.string()).optional().default([]),
  policyToolingChanges: z.string().optional().default(''),
});

export const sprintReportSchema = z.object({
  sprintInfo: sprintInfoSchema,
  scope: scopeSchema,
  agenticEvidence: agenticEvidenceSchema,
  deltas: deltasSchema,
  improvements: z.array(improvementItemSchema).optional().default([]),
  degradations: z.array(improvementItemSchema).optional().default([]),
  decision: decisionSchema,
});

export type SprintReportData = z.infer<typeof sprintReportSchema>;

// --- GOVERNANCE CHECKLIST SCHEMA ---
export const governanceItemSchema = z.object({
  item: z.string(),
  status: z.enum(['YES', 'NO', 'PARTIAL', 'NA']),
  notes: z.string().optional().default(''),
});

export const sectionESchema = z.object({
  operationalOwners: z.string().min(1, 'Operational owners are required'),
  incidentProcess: z.boolean(),
  dataMap: z.boolean(),
});

export const governanceChecklistSchema = z.object({
  sectionA: z.array(governanceItemSchema).min(1),
  sectionB: z.array(governanceItemSchema).min(1),
  sectionC: z.array(governanceItemSchema).min(1),
  sectionD: z.array(governanceItemSchema).min(1),
  sectionE: sectionESchema,
});

export type GovernanceChecklistData = z.infer<typeof governanceChecklistSchema>;
