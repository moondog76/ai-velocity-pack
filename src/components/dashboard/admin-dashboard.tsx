import { prisma } from '@/lib/prisma';
import { StatCard } from './stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Building2, FileText, ClipboardCheck, BarChart3, Trophy } from 'lucide-react';
import Link from 'next/link';

function scoreColor(score: number | null | undefined): string {
  if (score === null || score === undefined) return '';
  if (score >= 3) return 'bg-emerald-100 text-emerald-800';
  if (score >= 2) return 'bg-emerald-50 text-emerald-700';
  if (score >= 1) return 'bg-amber-50 text-amber-700';
  return 'bg-red-50 text-red-700';
}

export async function AdminDashboard() {
  const companies = await prisma.company.findMany({
    include: {
      baseline: true,
      sprintReport: true,
      governanceChecklist: true,
      scores: true,
      users: true,
    },
    orderBy: { enrolledAt: 'desc' },
  });

  const scoredCompanies = companies.filter((c) => c.scores?.totalScore);
  const stats = {
    totalCompanies: companies.length,
    baselinesSubmitted: companies.filter(
      (c) => c.baseline?.status === 'SUBMITTED' || c.baseline?.status === 'GRADED'
    ).length,
    sprintReportsSubmitted: companies.filter(
      (c) => c.sprintReport?.status === 'SUBMITTED' || c.sprintReport?.status === 'GRADED'
    ).length,
    governanceSubmitted: companies.filter(
      (c) => c.governanceChecklist?.status === 'SUBMITTED' || c.governanceChecklist?.status === 'GRADED'
    ).length,
    averageScore:
      scoredCompanies.length > 0
        ? scoredCompanies.reduce((sum, c) => sum + (c.scores?.totalScore || 0), 0) / scoredCompanies.length
        : 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Companies Enrolled" value={stats.totalCompanies} icon={Building2} />
        <StatCard title="Baselines Submitted" value={stats.baselinesSubmitted} icon={FileText} />
        <StatCard title="Sprint Reports" value={stats.sprintReportsSubmitted} icon={ClipboardCheck} />
        <StatCard title="Governance Checklists" value={stats.governanceSubmitted} icon={BarChart3} />
        <StatCard
          title="Average Score"
          value={stats.averageScore > 0 ? `${stats.averageScore.toFixed(1)}/18` : 'N/A'}
          icon={Trophy}
        />
      </div>

      {/* Submission Progress Overview */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Submission Progress</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Baselines', count: stats.baselinesSubmitted, total: stats.totalCompanies },
            { label: 'Sprint Reports', count: stats.sprintReportsSubmitted, total: stats.totalCompanies },
            { label: 'Governance', count: stats.governanceSubmitted, total: stats.totalCompanies },
          ].map(({ label, count, total }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">{label}</span>
                <span className="text-sm font-medium text-slate-900">{count}/{total}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Companies Table with Score Heatmap */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Portfolio Companies</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Baseline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Sprint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Gov.
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">AG</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">CT</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">RE</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">QR</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">GV</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">RP</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {companies.map((company) => {
                const s = company.scores;
                return (
                  <tr key={company.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{company.name}</div>
                      <div className="text-xs text-slate-500">
                        {company.primaryLanguage}{company.framework ? ` / ${company.framework}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={company.baseline?.status || 'NOT_STARTED'} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={company.sprintReport?.status || 'NOT_STARTED'} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={company.governanceChecklist?.status || 'NOT_STARTED'} />
                    </td>
                    {/* Score heatmap cells */}
                    {(['agenticEvidence', 'cycleTimeImprovement', 'reviewEfficiency', 'qualityReliability', 'governanceReadiness', 'repeatability'] as const).map((dim) => (
                      <td key={dim} className="px-3 py-4 whitespace-nowrap text-center">
                        {s?.[dim] !== null && s?.[dim] !== undefined ? (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold ${scoreColor(s[dim])}`}>
                            {s[dim]}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-slate-900">
                        {s?.totalScore !== null && s?.totalScore !== undefined
                          ? `${s.totalScore}`
                          : '-'}
                      </span>
                      {s?.totalScore !== null && s?.totalScore !== undefined && (
                        <span className="text-xs text-slate-400">/18</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/company/${company.id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
