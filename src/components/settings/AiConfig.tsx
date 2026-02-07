'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface AiConfigProps {
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

export function AiConfig({ settings }: AiConfigProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    aiModel: settings?.aiModel || 'claude-sonnet-4-5-20250929',
    autoAnalyze: settings?.autoAnalyze ?? false,
    maxAnalysesPerDay: settings?.maxAnalysesPerDay ?? 3,
    requireAiBeforeManual: settings?.requireAiBeforeManual ?? false,
  });

  const apiKeyDisplay = process.env.NEXT_PUBLIC_ANTHROPIC_KEY_HINT || 'Configured via environment variable';

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // Test by attempting a minimal AI analysis call
      const res = await fetch('/api/scoring/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: '__test__' }),
      });
      // A 404 (company not found) or 400 means the API key works, just no company
      // A 503 means the key is missing/invalid
      if (res.status === 503) {
        setTestResult('error');
      } else {
        setTestResult('success');
      }
    } catch {
      setTestResult('error');
    } finally {
      setTesting(false);
    }
  };

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
      setMessage({ type: 'success', text: 'AI configuration saved' });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">API Key Management</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              readOnly
              value={apiKeyDisplay}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-500"
            />
            <p className="text-xs text-slate-500 mt-1">API key is stored as an environment variable on the server (ANTHROPIC_API_KEY)</p>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
        {testResult === 'success' && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Connected
          </div>
        )}
        {testResult === 'error' && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-red-600">
            <XCircle className="h-4 w-4" /> Failed — check ANTHROPIC_API_KEY environment variable
          </div>
        )}
      </div>

      {/* Model Selection */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Model Selection</h3>
        <select
          value={form.aiModel}
          onChange={(e) => setForm({ ...form, aiModel: e.target.value })}
          className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="claude-sonnet-4-5-20250929">Claude Sonnet 4.5 (Better quality, recommended)</option>
          <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (Faster, lower cost)</option>
        </select>
        <p className="text-xs text-slate-500 mt-1">Sonnet produces higher quality analyses. Haiku is faster and cheaper for iterative use.</p>
      </div>

      {/* Scoring Behavior */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Scoring Behavior</h3>
        <div className="divide-y divide-slate-100">
          <Toggle
            label="Auto-run AI analysis"
            description="Automatically analyze submissions when a deliverable is submitted"
            checked={form.autoAnalyze}
            onChange={(v) => setForm({ ...form, autoAnalyze: v })}
          />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-slate-700">Max re-analyses per day</p>
              <p className="text-xs text-slate-500">Limit AI analysis calls per company per day</p>
            </div>
            <input
              type="number"
              min={1}
              max={10}
              value={form.maxAnalysesPerDay}
              onChange={(e) => setForm({ ...form, maxAnalysesPerDay: parseInt(e.target.value) || 3 })}
              className="w-20 px-2 py-1 text-sm border border-slate-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Toggle
            label="Require AI analysis before manual scoring"
            description="Admin must run AI analysis before manually scoring a company"
            checked={form.requireAiBeforeManual}
            onChange={(v) => setForm({ ...form, requireAiBeforeManual: v })}
          />
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
