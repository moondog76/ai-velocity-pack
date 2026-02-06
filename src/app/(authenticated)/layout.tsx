import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0">
        <Sidebar />
      </aside>

      {/* Mobile navigation */}
      <MobileNav />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 bg-slate-50">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
