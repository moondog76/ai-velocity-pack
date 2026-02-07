import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { StatusBadge } from '@/components/shared/status-badge';
import { format } from 'date-fns';
import {
  Building2, Mail, Code2, Users, Calendar, FileText,
  ClipboardCheck, Shield, FileSearch, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      users: { select: { id: true, name: true, email: true, role: true } },
      baseline: true,
      sprintReport: true,
      governanceChecklist: true,
      codebaseAudit: true,
      scores: true,
      aiAnalyses: { orderBy: { analyzedAt: 'desc' }, take: 1 },
    },
  });

  if (!company) {
    notFound();
  }

  const latestAi = company.aiAnalyses?.[0];
  const aiData = latestAi?.aiScores as any;

  // Timeline events
  const timeline: { label: string; date: Date | null; done: boolean }[] = [
    { label: 'Enrolled', date: company.enrolledAt, done: true },
    { label: 'Baseline Submitted', date: company.baseline?.submittedAt || null, done: !!company.baseline?.submittedAt },
    { label: 'Sprint Report Submitted', date: company.sprintReport?.submittedAt || null, done: !!company.sprintReport?.submittedAt },
    { label: 'Governance Submitted', date: company.governanceChecklist?.submittedAt || null, done: !!company.governanceChecklist?.submittedAt },
    { label: 'Audit Uploaded', date: company.codebaseAudit?.submittedAt || null, done: !!company.codebaseAudit?.submittedAt },
    { label: 'Scored', date: company.scores?.gradedAt || null, done: !!company.scores?.gradedAt },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
            <p className="text-sm text-slate-500">
              {company.primaryLanguage}{company.framework ? ` / ${company.framework}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <Mail className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Contact</p>
            <p className="text-sm font-medium text-slate-900">{company.contactEmail || company.website || '—'}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <Code2 className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Stack</p>
            <p className="text-sm font-medium text-slate-900">{company.primaryLanguage || '—'}{company.framework ? ` / ${company.framework}` : ''}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <Users className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Team</p>
            <p className="text-sm font-medium text-slate-900">{company.teamSize || company.users.length} {company.teamSize ? 'engineers' : 'users'}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center gap-3">
          <Calendar className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Enrolled</p>
            <p className="text-sm font-medium text-slate-900">{format(new Date(company.enrolledAt), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Progress Timeline</h2>
        <div className="flex items-center gap-0 overflow-x-auto">
          {timeline.map((event, i) => (
            <div key={event.label} className="flex items-center">
              <div className="flex flex-col items-center min-w-[100px]">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  event.done ? 'bg-emerald-100' : 'bg-slate-100'
                }`}>
                  {event.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <p className="text-xs font-medium text-slate-700 mt-1 text-center">{event.label}</p>
                {event.date && (
                  <p className="text-[10px] text-slate-500">{format(new Date(event.date), 'MMM d')}</p>
                )}
              </div>
              {i < timeline.length - 1 && (
                <div className={`h-0.5 w-8 ${event.done ? 'bg-emerald-300' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Deliverable Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Baseline */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">Baseline</h3>
            </div>
            <StatusBadge status={company.baseline?.status || 'NOT_STARTED'} />
          </div>
          {company.baseline?.submittedAt && (
            <p className="text-xs text-slate-500">Submitted {format(new Date(company.baseline.submittedAt), 'MMM d, yyyy')}</p>
          )}
          {company.baseline?.data && (
            <details className="mt-2">
              <summary className="text-xs text-indigo-600 cursor-pointer">View data</summary>
              <pre className="mt-1 text-xs text-slate-600 bg-slate-50 rounded p-2 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {JSON.stringify(company.baseline.data, null, 2)}
              </pre>
            </details>
          )}
        </div>

        {/* Sprint Report */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">Sprint Report</h3>
            </div>
            <StatusBadge status={company.sprintReport?.status || 'NOT_STARTED'} />
          </div>
          {company.sprintReport?.submittedAt && (
            <p className="text-xs text-slate-500">Submitted {format(new Date(company.sprintReport.submittedAt), 'MMM d, yyyy')}</p>
          )}
          {company.sprintReport?.data && (
            <details className="mt-2">
              <summary className="text-xs text-indigo-600 cursor-pointer">View data</summary>
              <pre className="mt-1 text-xs text-slate-600 bg-slate-50 rounded p-2 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {JSON.stringify(company.sprintReport.data, null, 2)}
              </pre>
            </details>
          )}
        </div>

        {/* Governance */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">Governance Checklist</h3>
            </div>
            <StatusBadge status={company.governanceChecklist?.status || 'NOT_STARTED'} />
          </div>
          {company.governanceChecklist?.submittedAt && (
            <p className="text-xs text-slate-500">Submitted {format(new Date(company.governanceChecklist.submittedAt), 'MMM d, yyyy')}</p>
          )}
          {company.governanceChecklist?.data && (
            <details className="mt-2">
              <summary className="text-xs text-indigo-600 cursor-pointer">View data</summary>
              <pre className="mt-1 text-xs text-slate-600 bg-slate-50 rounded p-2 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {JSON.stringify(company.governanceChecklist.data, null, 2)}
              </pre>
            </details>
          )}
        </div>

        {/* Codebase Audit */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">Codebase Audit</h3>
            </div>
            {company.codebaseAudit ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Uploaded</span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Not Uploaded</span>
            )}
          </div>
          {company.codebaseAudit && (
            <>
              <p className="text-xs text-slate-600">File: {company.codebaseAudit.fileName} ({(company.codebaseAudit.fileSize / 1024).toFixed(1)} KB)</p>
              <p className="text-xs text-slate-500">Uploaded {format(new Date(company.codebaseAudit.submittedAt), 'MMM d, yyyy')} by {company.codebaseAudit.uploadedBy}</p>
            </>
          )}
        </div>
      </div>

      {/* Scoring */}
      {company.scores && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Score Summary</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-bold text-indigo-600">{company.scores.totalScore}</span>
            <span className="text-lg text-slate-400">/18</span>
            {company.scores.gradedAt && (
              <span className="ml-4 text-xs text-slate-500">Graded {format(new Date(company.scores.gradedAt), 'MMM d, yyyy')}</span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Agentic Evidence', value: company.scores.agenticEvidence },
              { label: 'Cycle Time', value: company.scores.cycleTimeImprovement },
              { label: 'Review Efficiency', value: company.scores.reviewEfficiency },
              { label: 'Quality & Reliability', value: company.scores.qualityReliability },
              { label: 'Governance', value: company.scores.governanceReadiness },
              { label: 'Repeatability', value: company.scores.repeatability },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-slate-900">{value}</span>
                  <span className="text-xs text-slate-400">/3</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${(value / 3) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {company.scores.notes && (
            <p className="mt-3 text-sm text-slate-600 italic border-t border-slate-100 pt-3">{company.scores.notes}</p>
          )}
        </div>
      )}

      {/* AI Analysis */}
      {aiData && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">AI Analysis</h2>
          {latestAi?.analyzedAt && (
            <p className="text-xs text-slate-500 mb-3">Analyzed {format(new Date(latestAi.analyzedAt), 'MMM d, yyyy h:mm a')}</p>
          )}
          {aiData.overallSummary && (
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-3">
              <p className="text-sm text-slate-700">{aiData.overallSummary}</p>
            </div>
          )}
          {aiData.recommendations?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">Recommendations</p>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {aiData.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
