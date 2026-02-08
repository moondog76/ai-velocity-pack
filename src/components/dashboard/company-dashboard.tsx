import { prisma } from '@/lib/prisma';
import { StatusBadge } from '@/components/shared/status-badge';
import { ProgressTimeline } from '@/components/shared/ProgressTimeline';
import { format } from 'date-fns';
import Link from 'next/link';
import { CompanyScoreCharts } from './CompanyScoreCharts';

interface CompanyDashboardProps {
  companyId: string;
}

export async function CompanyDashboard({ companyId }: CompanyDashboardProps) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      baseline: true,
      sprintReport: true,
      governanceChecklist: true,
      codebaseAudit: true,
      scores: true,
    },
  });

  if (!company) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <p className="text-slate-600">Company not found.</p>
      </div>
    );
  }

  const announcements = await prisma.announcement.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });

  const programSettings = await prisma.programSettings.findUnique({
    where: { id: 'default' },
  });

  // Build progress timeline milestones
  const milestones = [
    {
      label: 'Enrolled',
      status: 'complete' as const,
      date: company.enrolledAt,
    },
    {
      label: 'Baseline',
      status: company.baseline?.status === 'SUBMITTED' || company.baseline?.status === 'GRADED'
        ? 'complete' as const
        : company.baseline?.status === 'DRAFT' ? 'in_progress' as const : 'pending' as const,
      date: company.baseline?.submittedAt,
    },
    {
      label: 'Audit',
      status: company.codebaseAudit ? 'complete' as const : 'pending' as const,
      date: company.codebaseAudit?.submittedAt,
    },
    {
      label: 'Sprint Report',
      status: company.sprintReport?.status === 'SUBMITTED' || company.sprintReport?.status === 'GRADED'
        ? 'complete' as const
        : company.sprintReport?.status === 'DRAFT' ? 'in_progress' as const : 'pending' as const,
      date: company.sprintReport?.submittedAt,
    },
    {
      label: 'Governance',
      status: company.governanceChecklist?.status === 'SUBMITTED' || company.governanceChecklist?.status === 'GRADED'
        ? 'complete' as const
        : company.governanceChecklist?.status === 'DRAFT' ? 'in_progress' as const : 'pending' as const,
      date: company.governanceChecklist?.submittedAt,
    },
    {
      label: 'Scored',
      status: company.scores?.gradedAt ? 'complete' as const : 'pending' as const,
      date: company.scores?.gradedAt,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          {announcements.map((announcement) => (
            <p key={announcement.id} className="text-sm text-indigo-900">
              {announcement.message}
            </p>
          ))}
        </div>
      )}

      {/* Progress Timeline */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Program Progress</h2>
        <ProgressTimeline milestones={milestones} />
      </div>

      {/* Deliverables Status */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Deliverables</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Baseline */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">Baseline</h3>
              <StatusBadge status={company.baseline?.status || 'NOT_STARTED'} />
            </div>
            {company.baseline?.submittedAt && (
              <p className="text-xs text-slate-500 mb-3">
                Submitted {format(new Date(company.baseline.submittedAt), 'MMM d, yyyy')}
              </p>
            )}
            <Link
              href="/deliverables/baseline"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {company.baseline?.status === 'SUBMITTED' || company.baseline?.status === 'GRADED'
                ? 'View Submission'
                : company.baseline?.status === 'DRAFT' ? 'Continue Editing' : 'Start Now'} &rarr;
            </Link>
          </div>

          {/* Sprint Report */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">Sprint Report</h3>
              <StatusBadge status={company.sprintReport?.status || 'NOT_STARTED'} />
            </div>
            {company.sprintReport?.submittedAt && (
              <p className="text-xs text-slate-500 mb-3">
                Submitted {format(new Date(company.sprintReport.submittedAt), 'MMM d, yyyy')}
              </p>
            )}
            <Link
              href="/deliverables/sprint-report"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {company.sprintReport?.status === 'SUBMITTED' || company.sprintReport?.status === 'GRADED'
                ? 'View Submission'
                : company.sprintReport?.status === 'DRAFT' ? 'Continue Editing' : 'Start Now'} &rarr;
            </Link>
          </div>

          {/* Governance */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">Governance Checklist</h3>
              <StatusBadge status={company.governanceChecklist?.status || 'NOT_STARTED'} />
            </div>
            {company.governanceChecklist?.submittedAt && (
              <p className="text-xs text-slate-500 mb-3">
                Submitted {format(new Date(company.governanceChecklist.submittedAt), 'MMM d, yyyy')}
              </p>
            )}
            <Link
              href="/deliverables/governance"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {company.governanceChecklist?.status === 'SUBMITTED' || company.governanceChecklist?.status === 'GRADED'
                ? 'View Submission'
                : company.governanceChecklist?.status === 'DRAFT' ? 'Continue Editing' : 'Start Now'} &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Score Card with Radar Chart + RAG Status (if graded) */}
      {company.scores?.gradedAt && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Score</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl font-bold text-indigo-600">{company.scores.totalScore}</div>
            <div className="text-2xl text-slate-400">/</div>
            <div className="text-2xl text-slate-600">18</div>
          </div>

          <CompanyScoreCharts scores={{
            agenticEvidence: company.scores.agenticEvidence,
            cycleTimeImprovement: company.scores.cycleTimeImprovement,
            reviewEfficiency: company.scores.reviewEfficiency,
            qualityReliability: company.scores.qualityReliability,
            governanceReadiness: company.scores.governanceReadiness,
            repeatability: company.scores.repeatability,
          }} />

          {company.scores.notes && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 italic">{company.scores.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Deadlines */}
      {programSettings && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {!company.baseline?.submittedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Baseline Deliverable</span>
                <span className="text-sm font-medium text-red-600">
                  Due {format(new Date(programSettings.baselineDue), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            {!company.sprintReport?.submittedAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Sprint Report & Governance</span>
                <span className="text-sm font-medium text-red-600">
                  Due {format(new Date(programSettings.sprintDue), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
