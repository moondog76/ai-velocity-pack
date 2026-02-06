import { prisma } from '@/lib/prisma';
import { StatCard } from './stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Building2, FileText, ClipboardCheck, BarChart3, Trophy } from 'lucide-react';
import Link from 'next/link';

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
      companies
        .filter((c) => c.scores?.totalScore)
        .reduce((sum, c) => sum + (c.scores?.totalScore || 0), 0) /
        companies.filter((c) => c.scores?.totalScore).length || 0,
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

      {/* Companies Table */}
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
                  Language/Framework
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Baseline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Sprint Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Governance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Total Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{company.name}</div>
                    <div className="text-sm text-slate-500">{company.website}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{company.primaryLanguage}</div>
                    <div className="text-sm text-slate-500">{company.framework}</div>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {company.scores?.totalScore !== null && company.scores?.totalScore !== undefined
                        ? `${company.scores.totalScore}/18`
                        : '-'}
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
