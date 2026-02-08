import { getCurrentUser } from '@/lib/auth-utils';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0">
        <Sidebar user={user} />
      </aside>

      {/* Mobile navigation */}
      <MobileNav user={user} />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 bg-[#F8F6F0]">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
