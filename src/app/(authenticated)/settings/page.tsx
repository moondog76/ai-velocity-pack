import { requireAdmin } from '@/lib/auth-utils';

export default async function SettingsPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Settings</h1>
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <p className="text-slate-600">Settings coming soon...</p>
      </div>
    </div>
  );
}
