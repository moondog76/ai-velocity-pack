'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CompanyManagement } from './CompanyManagement';
import { UserManagement } from './UserManagement';
import { ProgramConfig } from './ProgramConfig';
import { AiConfig } from './AiConfig';

const tabs = [
  { id: 'companies', label: 'Company Management' },
  { id: 'users', label: 'User Management' },
  { id: 'program', label: 'Program Configuration' },
  { id: 'ai', label: 'AI Configuration' },
] as const;

type TabId = typeof tabs[number]['id'];

interface SettingsTabsProps {
  companies: any[];
  users: any[];
  settings: any;
}

export function SettingsTabs({ companies, users, settings }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('companies');

  return (
    <div>
      {/* Tab header */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-0 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'companies' && <CompanyManagement companies={companies} />}
      {activeTab === 'users' && <UserManagement users={users} companies={companies} />}
      {activeTab === 'program' && <ProgramConfig settings={settings} />}
      {activeTab === 'ai' && <AiConfig settings={settings} />}
    </div>
  );
}
