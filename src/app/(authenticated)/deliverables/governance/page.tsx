import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { GovernanceForm } from '@/components/deliverables/GovernanceForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GovernancePage() {
  const user = await requireAuth();
  const companyId = user.companyId;

  if (!companyId && user.role !== 'ADMIN') {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <p className="text-slate-600">No company associated with your account.</p>
      </div>
    );
  }

  const targetCompanyId = companyId || '';
  const governance = targetCompanyId
    ? await prisma.governanceChecklist.findUnique({ where: { companyId: targetCompanyId } })
    : null;

  return (
    <div>
      <div className="mb-6">
        <Link href="/deliverables" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-3">
          <ArrowLeft className="h-4 w-4" />
          Back to Deliverables
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Governance Checklist</h1>
        <p className="text-sm text-slate-600 mt-1">
          Complete the AI governance and compliance checklist for your organization.
        </p>
      </div>
      <GovernanceForm
        companyId={targetCompanyId}
        existingData={(governance?.data as any) || null}
        existingStatus={governance?.status || 'NOT_STARTED'}
      />
    </div>
  );
}
