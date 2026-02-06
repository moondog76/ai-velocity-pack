import { prisma } from '@/lib/prisma';
import { StatusBadge } from '@/components/shared/status-badge';
import { format } from 'date-fns';
import Link from 'next/link';

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

  return (
    <div className="space-y-6">
      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          {announcements.map((announcement) => (
            <p key={announcement.id} className="text-sm text-indigo-900">
              📢 {announcement.message}
            </p>
          ))}
        </div>
      )}

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
              href="/deliverables"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {company.baseline ? 'View/Edit' : 'Start Now'} →
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
              href="/deliverables"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {company.sprintReport ? 'View/Edit' : 'Start Now'} →
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
              href="/deliverables"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {company.governanceChecklist ? 'View/Edit' : 'Start Now'} →
            </Link>
          </div>
        </div>
      </div>

      {/* Score Card (if graded) */}
      {company.scores?.gradedAt && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Score</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-indigo-600">{company.scores.totalScore}</div>
            <div className="text-2xl text-slate-400">/</div>
            <div className="text-2xl text-slate-600">18</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Agentic Evidence</span>
              <span className="font-medium">{company.scores.agenticEvidence}/3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Cycle Time Improvement</span>
              <span className="font-medium">{company.scores.cycleTimeImprovement}/3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Review Efficiency</span>
              <span className="font-medium">{company.scores.reviewEfficiency}/3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Quality & Reliability</span>
              <span className="font-medium">{company.scores.qualityReliability}/3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Governance Readiness</span>
              <span className="font-medium">{company.scores.governanceReadiness}/3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Repeatability</span>
              <span className="font-medium">{company.scores.repeatability}/3</span>
            </div>
          </div>
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
