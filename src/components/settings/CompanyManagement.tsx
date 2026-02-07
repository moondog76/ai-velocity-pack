'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface CompanyManagementProps {
  companies: any[];
}

const languageOptions = ['TypeScript', 'Python', 'JavaScript', 'Go', 'Rust', 'Java', 'C#', 'Ruby', 'Other'];

function CompanyForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    contactEmail: initial?.contactEmail || '',
    primaryLanguage: initial?.primaryLanguage || '',
    framework: initial?.framework || '',
    teamSize: initial?.teamSize?.toString() || '',
    githubUrl: initial?.githubUrl || '',
  });

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Company Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Contact Email *</label>
          <input
            type="email"
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Language</label>
          <select
            value={form.primaryLanguage}
            onChange={(e) => setForm({ ...form, primaryLanguage: e.target.value })}
            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select...</option>
            {languageOptions.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Framework</label>
          <input
            type="text"
            value={form.framework}
            onChange={(e) => setForm({ ...form, framework: e.target.value })}
            placeholder="e.g. Next.js, Django, Rails"
            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Team Size</label>
          <input
            type="number"
            value={form.teamSize}
            onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">GitHub URL</label>
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            placeholder="https://github.com/org"
            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.name || !form.contactEmail}
          className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
        >
          {saving ? 'Saving...' : initial ? 'Update' : 'Add Company'}
        </button>
      </div>
    </div>
  );
}

export function CompanyManagement({ companies: initialCompanies }: CompanyManagementProps) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAdd = async (data: any) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMessage({ type: 'success', text: 'Company added' });
      setShowAdd(false);
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...data }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMessage({ type: 'success', text: 'Company updated' });
      setEditingId(null);
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: string, currentActive: boolean) => {
    if (!confirm(currentActive ? 'Deactivate this company? Historical data will be preserved.' : 'Reactivate this company?')) return;
    try {
      const res = await fetch('/api/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">{initialCompanies.length} companies enrolled</h3>
        <button
          onClick={() => { setShowAdd(true); setEditingId(null); }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Company
        </button>
      </div>

      {message && (
        <div className={`text-sm px-3 py-2 rounded-md ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {showAdd && (
        <CompanyForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 font-medium text-slate-600">Name</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Contact</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Lang / Framework</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Team</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Status</th>
              <th className="text-right py-2 px-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialCompanies.map((c) => (
              editingId === c.id ? (
                <tr key={c.id}>
                  <td colSpan={6} className="py-2 px-3">
                    <CompanyForm initial={c} onSave={handleUpdate} onCancel={() => setEditingId(null)} saving={saving} />
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium text-slate-900">{c.name}</td>
                  <td className="py-2 px-3 text-slate-600">{c.contactEmail || '—'}</td>
                  <td className="py-2 px-3 text-slate-600">
                    {c.primaryLanguage || '—'}{c.framework ? ` / ${c.framework}` : ''}
                  </td>
                  <td className="py-2 px-3 text-slate-600">{c.teamSize || '—'}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {c.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setEditingId(c.id); setShowAdd(false); }} className="p-1 text-slate-400 hover:text-indigo-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeactivate(c.id, c.active !== false)} className="p-1 text-slate-400 hover:text-red-600" title={c.active !== false ? 'Deactivate' : 'Reactivate'}>
                        {c.active !== false ? <Trash2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
