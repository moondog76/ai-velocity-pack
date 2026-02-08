import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { StatusBadge } from '@/components/shared/status-badge';
import { format } from 'date-fns';
import { FileText, ClipboardCheck, Shield, FileSearch, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function DeliverableCard({
  title,
  icon: Icon,
  status,
  submittedAt,
  data,
  href,
  summary,
}: {
  title: string;
  icon: typeof FileText;
  status: string;
  submittedAt: Date | null;
  data: any;
  href: string;
  summary?: string;
}) {
  const isSubmitted = status === 'SUBMITTED' || status === 'GRADED';

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        <StatusBadge status={status as any} />
      </div>

      {submittedAt && (
        <p className="text-xs text-slate-500 mb-3">
          Submitted {format(new Date(submittedAt), 'MMM d, yyyy h:mm a')}
        </p>
      )}

      {summary && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{summary}</p>
      )}

      {status === 'DRAFT' && !summary && (
        <p className="text-sm text-amber-600 mb-3">Draft in progress — not yet submitted</p>
      )}

      {status === 'NOT_STARTED' && (
        <p className="text-sm text-slate-500 mb-3">Not started yet</p>
      )}

      <Link
        href={href}
        className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-4 py-2 transition-colors ${
          status === 'NOT_STARTED'
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : status === 'DRAFT'
            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
        }`}
      >
        {status === 'NOT_STARTED' && 'Start Now'}
        {status === 'DRAFT' && 'Continue Editing'}
        {(status === 'SUBMITTED' || status === 'GRADED') && 'View Submission'}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function getBaselineSummary(data: any): string {
  if (!data) return '';
  const parts: string[] = [];
  if (data.repoContext?.primaryRepos) parts.push(data.repoContext.primaryRepos);
  if (data.sprintItem?.description) parts.push(`Sprint: ${data.sprintItem.description}`);
  return parts.join(' | ');
}

function getSprintSummary(data: any): string {
  if (!data) return '';
  const parts: string[] = [];
  if (data.scope?.featureDescription) parts.push(data.scope.featureDescription);
  if (data.agenticEvidence?.toolsUsed) parts.push(`Tools: ${data.agenticEvidence.toolsUsed}`);
  return parts.join(' | ');
}

function getGovernanceSummary(data: any): string {
  if (!data?.sectionA) return '';
  const allItems = [
    ...(data.sectionA || []),
    ...(data.sectionB || []),
    ...(data.sectionC || []),
    ...(data.sectionD || []),
  ];
  const yesCount = allItems.filter((i: any) => i.status === 'YES').length;
  return `${yesCount}/${allItems.length} items compliant`;
}

function CompanyDeliverables({
  company,
}: {
  company: {
    id: string;
    name: string;
    baseline: any;
    sprintReport: any;
    governanceChecklist: any;
    codebaseAudit: any;
    scores: any;
  };
}) {
  const deliverables = [
    {
      title: 'Baseline Report',
      icon: FileText,
      record: company.baseline,
      href: '/deliverables/baseline',
      getSummary: getBaselineSummary,
    },
    {
      title: 'Sprint Report',
      icon: ClipboardCheck,
      record: company.sprintReport,
      href: '/deliverables/sprint-report',
      getSummary: getSprintSummary,
    },
    {
      title: 'Governance Checklist',
      icon: Shield,
      record: company.governanceChecklist,
      href: '/deliverables/governance',
      getSummary: getGovernanceSummary,
    },
  ];

  const completedCount = deliverables.filter(
    (d) => d.record?.status === 'SUBMITTED' || d.record?.status === 'GRADED'
  ).length;
  const hasAudit = !!company.codebaseAudit;
  const totalItems = deliverables.length + 1;
  const totalCompleted = completedCount + (hasAudit ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
          <span className="text-sm font-semibold text-slate-900">{totalCompleted}/{totalItems}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${(totalCompleted / totalItems) * 100}%` }}
          />
        </div>
      </div>

      {/* Deliverable cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deliverables.map((d) => (
          <DeliverableCard
            key={d.title}
            title={d.title}
            icon={d.icon}
            status={d.record?.status || 'NOT_STARTED'}
            submittedAt={d.record?.submittedAt || null}
            data={d.record?.data || null}
            href={d.href}
            summary={d.record?.data ? d.getSummary(d.record.data) : undefined}
          />
        ))}
      </div>

      {/* Codebase Audit card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">Codebase Audit</h3>
          </div>
          {hasAudit ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              Uploaded
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              Not Uploaded
            </span>
          )}
        </div>
        {company.codebaseAudit ? (
          <div className="space-y-1 mb-3">
            <p className="text-sm text-slate-700">
              <span className="text-slate-500">File:</span> {company.codebaseAudit.fileName}
            </p>
            <p className="text-sm text-slate-700">
              <span className="text-slate-500">Size:</span> {(company.codebaseAudit.fileSize / 1024).toFixed(1)} KB
            </p>
            <p className="text-xs text-slate-500">
              Uploaded {format(new Date(company.codebaseAudit.submittedAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 mb-3">No audit uploaded yet</p>
        )}
        <Link
          href="/audit"
          className="inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
        >
          {hasAudit ? 'View / Replace Audit' : 'Upload Audit'}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Score summary if graded */}
      {company.scores?.gradedAt && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900">Score</h3>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl font-bold text-indigo-600">{company.scores.totalScore}</span>
            <span className="text-lg text-slate-400">/18</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Agentic Evidence</span><span className="font-medium">{company.scores.agenticEvidence}/3</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Cycle Time</span><span className="font-medium">{company.scores.cycleTimeImprovement}/3</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Review Efficiency</span><span className="font-medium">{company.scores.reviewEfficiency}/3</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Quality</span><span className="font-medium">{company.scores.qualityReliability}/3</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Governance</span><span className="font-medium">{company.scores.governanceReadiness}/3</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Repeatability</span><span className="font-medium">{company.scores.repeatability}/3</span></div>
          </div>
          {company.scores.notes && (
            <p className="mt-3 text-sm text-slate-600 italic border-t border-slate-100 pt-3">{company.scores.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default async function DeliverablesPage() {
  const user = await requireAuth();
  const isAdmin = user.role === 'ADMIN';

  if (isAdmin) {
    const companies = await prisma.company.findMany({
      include: {
        baseline: true,
        sprintReport: true,
        governanceChecklist: true,
        codebaseAudit: true,
        scores: true,
      },
      orderBy: { name: 'asc' },
    });

    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Deliverables</h1>
          <p className="text-sm text-slate-600 mt-1">
            Review all company submissions
          </p>
        </div>

        <div className="space-y-8">
          {companies.map((company) => (
            <div key={company.id}>
              <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">
                {company.name}
                <span className="text-sm font-normal text-slate-500 ml-2">
                  {company.primaryLanguage}{company.framework ? ` / ${company.framework}` : ''}
                </span>
              </h2>
              <CompanyDeliverables company={company} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Company user view
  const companyId = user.companyId;
  if (!companyId) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Deliverables</h1>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <p className="text-slate-600">No company associated with your account.</p>
        </div>
      </div>
    );
  }

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
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Deliverables</h1>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <p className="text-slate-600">Company not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Your Deliverables</h1>
        <p className="text-sm text-slate-600 mt-1">
          Complete and submit all deliverables for the AI Velocity Pack program
        </p>
      </div>
      <CompanyDeliverables company={company} />
    </div>
  );
}
