'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  FileSearch,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'COMPANY_USER'],
  },
  {
    name: 'Program Materials',
    href: '/materials',
    icon: BookOpen,
    roles: ['ADMIN', 'COMPANY_USER'],
  },
  {
    name: 'Codebase Audit',
    href: '/audit',
    icon: FileSearch,
    roles: ['ADMIN', 'COMPANY_USER'],
  },
  {
    name: 'Deliverables',
    href: '/deliverables',
    icon: FileText,
    roles: ['ADMIN', 'COMPANY_USER'],
  },
  {
    name: 'Best Practices',
    href: '/best-practices',
    icon: Lightbulb,
    roles: ['ADMIN', 'COMPANY_USER'],
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: CalendarDays,
    roles: ['ADMIN', 'COMPANY_USER'],
  },
  {
    name: 'Scoring & Reports',
    href: '/scoring',
    icon: BarChart3,
    roles: ['ADMIN'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
];

interface SidebarProps {
  onClose?: () => void;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function Sidebar({ onClose, user }: SidebarProps) {
  const pathname = usePathname();
  const userRole = user?.role || 'COMPANY_USER';

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-white text-lg font-bold">Asort Ventures</h1>
        <p className="text-xs text-slate-400 mt-1">AI Velocity Pack</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      {user && (
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user.email}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300">
                {userRole === 'ADMIN' ? 'Admin' : 'Company User'}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
