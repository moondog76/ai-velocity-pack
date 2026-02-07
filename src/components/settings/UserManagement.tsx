'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil } from 'lucide-react';

interface UserManagementProps {
  users: any[];
  companies: any[];
}

export function UserManagement({ users: initialUsers, companies }: UserManagementProps) {
  const router = useRouter();
  const [showInvite, setShowInvite] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({ email: '', name: '', role: 'COMPANY_USER', companyId: '' });
  const [editForm, setEditForm] = useState({ role: '', companyId: '' });

  const handleInvite = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: 'success', text: `User invited. Temp password: ${data.tempPassword}` });
      setShowInvite(false);
      setForm({ email: '', name: '', role: 'COMPANY_USER', companyId: '' });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRole = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: editForm.role, companyId: editForm.companyId || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditingId(null);
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
        <p><span className="font-semibold text-slate-700">Admin:</span> Full access to all features</p>
        <p><span className="font-semibold text-slate-700">Company User:</span> Can only see their own company's data, materials, and feedback</p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">{initialUsers.length} users</h3>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Invite User
        </button>
      </div>

      {message && (
        <div className={`text-sm px-3 py-2 rounded-md ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {showInvite && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ADMIN">Admin</option>
                <option value="COMPANY_USER">Company User</option>
              </select>
            </div>
            {form.role === 'COMPANY_USER' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Assign to Company</label>
                <select
                  value={form.companyId}
                  onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select...</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowInvite(false)} className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
            <button
              onClick={handleInvite}
              disabled={saving || !form.name || !form.email}
              className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
            >
              {saving ? 'Inviting...' : 'Invite User'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 font-medium text-slate-600">Name</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Email</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Role</th>
              <th className="text-left py-2 px-3 font-medium text-slate-600">Company</th>
              <th className="text-right py-2 px-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3 font-medium text-slate-900">{u.name}</td>
                <td className="py-2 px-3 text-slate-600">{u.email}</td>
                <td className="py-2 px-3">
                  {editingId === u.id ? (
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="px-2 py-1 text-xs border border-slate-300 rounded"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="COMPANY_USER">Company User</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role === 'ADMIN' ? 'Admin' : 'Company User'}
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-slate-600">
                  {editingId === u.id ? (
                    <select
                      value={editForm.companyId}
                      onChange={(e) => setEditForm({ ...editForm, companyId: e.target.value })}
                      className="px-2 py-1 text-xs border border-slate-300 rounded"
                    >
                      <option value="">None</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    u.company?.name || '—'
                  )}
                </td>
                <td className="py-2 px-3 text-right">
                  {editingId === u.id ? (
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleUpdateRole(u.id)} disabled={saving} className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-2 py-1 text-xs text-slate-500">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingId(u.id); setEditForm({ role: u.role, companyId: u.companyId || '' }); }}
                      className="p-1 text-slate-400 hover:text-indigo-600"
                      title="Edit role"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
