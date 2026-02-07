import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { StatusBadge } from '@/components/shared/status-badge';
import { ScoringForm } from '@/components/ScoringForm';
import { FileSearch, FileText, ClipboardCheck, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ScoringPage() {
  await requireAdmin();

  const companies = await prisma.company.findMany({
    include: {
      baseline: { select: { status: true, submittedAt: true } },
      sprintReport: { select: { status: true, submittedAt: true } },
      governanceChecklist: { select: { status: true, submittedAt: true } },
      codebaseAudit: { select: { id: true, fileName: true, submittedAt: true } },
      scores: true,
    },
    orderBy: { name: 'asc' },
  });

  const gradedCount = companies.filter((c) => c.scores?.gradedAt).length;
  const avgScore = companies
    .filter((c) => c.scores?.totalScore)
    .reduce((sum, c) => sum + (c.scores?.totalScore || 0), 0) /
    (gradedCount || 1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Scoring & Reports</h1>
        <p className="text-sm text-slate-600 mt-1">
          Grade companies across 6 dimensions (0-3 each, 18 max)
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <p className="text-sm text-slate-600">Companies</p>
          <p className="text-2xl font-bold text-slate-900">{companies.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <p className="text-sm text-slate-600">Graded</p>
          <p className="text-2xl font-bold text-slate-900">{gradedCount} / {companies.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <p className="text-sm text-slate-600">Average Score</p>
          <p className="text-2xl font-bold text-slate-900">
            {gradedCount > 0 ? `${avgScore.toFixed(1)}/18` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Per-company scoring */}
      <div className="space-y-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            {/* Company header with submission context */}
            <div className="mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{company.name}</h2>
                  <p className="text-sm text-slate-500">
                    {company.primaryLanguage}{company.framework ? ` / ${company.framework}` : ''}
                  </p>
                </div>
                {company.scores?.gradedAt && (
                  <span className="text-xs text-slate-500">
                    Last graded: {new Date(company.scores.gradedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Baseline:</span>
                  <StatusBadge status={company.baseline?.status || 'NOT_STARTED'} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  <span>Sprint:</span>
                  <StatusBadge status={company.sprintReport?.status || 'NOT_STARTED'} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Governance:</span>
                  <StatusBadge status={company.governanceChecklist?.status || 'NOT_STARTED'} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <FileSearch className="h-3.5 w-3.5" />
                  <span>Audit:</span>
                  {company.codebaseAudit ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      Uploaded
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Not Uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Scoring form */}
            <ScoringForm
              companyId={company.id}
              companyName={company.name}
              existingScore={company.scores ? {
                agenticEvidence: company.scores.agenticEvidence,
                cycleTimeImprovement: company.scores.cycleTimeImprovement,
                reviewEfficiency: company.scores.reviewEfficiency,
                qualityReliability: company.scores.qualityReliability,
                governanceReadiness: company.scores.governanceReadiness,
                repeatability: company.scores.repeatability,
                notes: company.scores.notes || '',
              } : null}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
