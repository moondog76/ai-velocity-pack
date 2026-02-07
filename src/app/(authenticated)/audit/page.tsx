import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { codebaseAuditPrompt, auditInstructions } from '@/data/audit-prompt';
import { Upload, FileText, CheckCircle, Download } from 'lucide-react';
import { CopyButton } from '@/components/CopyButton';
import { AuditUploadForm } from '@/components/AuditUploadForm';

export const dynamic = 'force-dynamic';

export default async function CodebaseAuditPage() {
  const user = await requireAuth();

  // For admin users without a companyId, use the first company
  let companyId: string | null = user.companyId;
  if (!companyId && user.role === 'ADMIN') {
    const firstCompany = await prisma.company.findFirst({ select: { id: true } });
    companyId = firstCompany?.id ?? null;
  }

  // Get existing audit if any
  const existingAudit = companyId
    ? await prisma.codebaseAudit.findUnique({
        where: { companyId },
      })
    : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Codebase Audit</h1>
        <p className="text-sm text-slate-600 mt-1">
          Run a standardized AI audit of your codebase and upload the results
        </p>
      </div>

      <div className="space-y-6">
        {/* Status Card */}
        {existingAudit ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-900">Audit Submitted</h3>
                <p className="text-sm text-emerald-700 mt-1">
                  Uploaded on {new Date(existingAudit.submittedAt).toLocaleDateString()}
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">File:</span>{' '}
                    <span className="font-medium text-slate-900">{existingAudit.fileName}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Size:</span>{' '}
                    <span className="font-medium text-slate-900">
                      {(existingAudit.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-3">
                  You can upload a new audit to replace this one
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Upload className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">No Audit Uploaded</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Follow the instructions below to run and upload your codebase audit
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Instructions</h2>
          <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap">
            {auditInstructions}
          </div>
        </div>

        {/* Audit Prompt */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Standardized Audit Prompt</h2>
            <CopyButton
              text={codebaseAuditPrompt}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md transition-colors"
            />
          </div>
          <pre className="bg-slate-50 border border-slate-200 rounded p-4 text-xs overflow-x-auto whitespace-pre-wrap">
            <code>{codebaseAuditPrompt}</code>
          </pre>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Upload Audit Report</h2>
          <AuditUploadForm
            companyId={companyId!}
            existingAudit={existingAudit}
          />
        </div>
      </div>
    </div>
  );
}
