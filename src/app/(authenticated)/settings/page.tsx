import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { SettingsTabs } from '@/components/settings/SettingsTabs';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await requireAdmin();

  const [companies, users, settings] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ include: { company: { select: { name: true } } }, orderBy: { name: 'asc' } }),
    prisma.programSettings.findUnique({ where: { id: 'default' } }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage companies, users, and program configuration
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <SettingsTabs
          companies={JSON.parse(JSON.stringify(companies))}
          users={JSON.parse(JSON.stringify(users))}
          settings={JSON.parse(JSON.stringify(settings))}
        />
      </div>
    </div>
  );
}
