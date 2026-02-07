'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProgramConfigProps {
  settings: any;
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

export function ProgramConfig({ settings }: ProgramConfigProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const formatDate = (d: any) => {
    if (!d) return '';
    return new Date(d).toISOString().split('T')[0];
  };

  const [form, setForm] = useState({
    dayZero: formatDate(settings?.dayZero),
    baselineDue: formatDate(settings?.baselineDue),
    sprintDue: formatDate(settings?.sprintDue),
    notifyWelcome: settings?.notifyWelcome ?? true,
    notify48h: settings?.notify48h ?? true,
    notify24h: settings?.notify24h ?? true,
    notifySubmission: settings?.notifySubmission ?? true,
    notifyScore: settings?.notifyScore ?? true,
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMessage({ type: 'success', text: 'Settings saved' });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Program Dates */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Program Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Program Start</label>
            <input
              type="date"
              value={form.dayZero}
              onChange={(e) => setForm({ ...form, dayZero: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Baseline Deadline</label>
            <input
              type="date"
              value={form.baselineDue}
              onChange={(e) => setForm({ ...form, baselineDue: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Sprint Deadline</label>
            <input
              type="date"
              value={form.sprintDue}
              onChange={(e) => setForm({ ...form, sprintDue: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Notification Preferences</h3>
        <div className="divide-y divide-slate-100">
          <Toggle label="Welcome email" description="Send welcome email when a company enrolls" checked={form.notifyWelcome} onChange={(v) => setForm({ ...form, notifyWelcome: v })} />
          <Toggle label="48-hour reminder" description="Remind companies 48 hours before deadlines" checked={form.notify48h} onChange={(v) => setForm({ ...form, notify48h: v })} />
          <Toggle label="24-hour reminder" description="Remind companies 24 hours before deadlines" checked={form.notify24h} onChange={(v) => setForm({ ...form, notify24h: v })} />
          <Toggle label="Submission confirmation" description="Confirm when a deliverable is submitted" checked={form.notifySubmission} onChange={(v) => setForm({ ...form, notifySubmission: v })} />
          <Toggle label="Score release" description="Notify companies when scores are published" checked={form.notifyScore} onChange={(v) => setForm({ ...form, notifyScore: v })} />
        </div>
      </div>

      {message && (
        <div className={`text-sm px-3 py-2 rounded-md ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
      >
        {saving ? 'Saving...' : 'Save Configuration'}
      </button>
    </div>
  );
}
