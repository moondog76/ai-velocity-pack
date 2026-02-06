import { getCurrentUser } from '@/lib/auth-utils';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { CompanyDashboard } from '@/components/dashboard/company-dashboard';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">
          Welcome back, {user.name}
        </p>
      </div>

      {user.role === 'ADMIN' ? (
        <AdminDashboard />
      ) : (
        user.companyId && <CompanyDashboard companyId={user.companyId} />
      )}
    </div>
  );
}
