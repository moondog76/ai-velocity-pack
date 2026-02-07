'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ScoreData {
  agenticEvidence: number;
  cycleTimeImprovement: number;
  reviewEfficiency: number;
  qualityReliability: number;
  governanceReadiness: number;
  repeatability: number;
  notes: string;
}

interface ScoringFormProps {
  companyId: string;
  companyName: string;
  existingScore: ScoreData | null;
}

const categories = [
  { key: 'agenticEvidence', label: 'Agentic Evidence', description: 'Use of AI coding tools with clear logs/artifacts' },
  { key: 'cycleTimeImprovement', label: 'Cycle Time Improvement', description: 'PR cycle time reduction vs baseline' },
  { key: 'reviewEfficiency', label: 'Review Efficiency', description: 'Fewer review iterations, cleaner PRs' },
  { key: 'qualityReliability', label: 'Quality & Reliability', description: 'Test coverage, CI pass rate, post-merge issues' },
  { key: 'governanceReadiness', label: 'Governance Readiness', description: 'Security, compliance, audit trail completeness' },
  { key: 'repeatability', label: 'Repeatability', description: 'Documented processes, templates, team adoption' },
] as const;

export function ScoringForm({ companyId, companyName, existingScore }: ScoringFormProps) {
  const router = useRouter();
  const [scores, setScores] = useState<ScoreData>({
    agenticEvidence: existingScore?.agenticEvidence ?? 0,
    cycleTimeImprovement: existingScore?.cycleTimeImprovement ?? 0,
    reviewEfficiency: existingScore?.reviewEfficiency ?? 0,
    qualityReliability: existingScore?.qualityReliability ?? 0,
    governanceReadiness: existingScore?.governanceReadiness ?? 0,
    repeatability: existingScore?.repeatability ?? 0,
    notes: existingScore?.notes ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const total = scores.agenticEvidence + scores.cycleTimeImprovement + scores.reviewEfficiency +
    scores.qualityReliability + scores.governanceReadiness + scores.repeatability;

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, ...scores }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save scores');
      }
      setMessage({ type: 'success', text: 'Scores saved' });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <h3 className="font-semibold text-slate-900 mb-3">{companyName}</h3>
      <div className="space-y-3">
        {categories.map(({ key, label, description }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700">{label}</p>
              <p className="text-xs text-slate-500">{description}</p>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setScores((s) => ({ ...s, [key]: val }))}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    scores[key as keyof ScoreData] === val
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
        <input
          type="text"
          maxLength={280}
          value={scores.notes}
          onChange={(e) => setScores((s) => ({ ...s, notes: e.target.value }))}
          placeholder="Brief scoring rationale..."
          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-900">Total: {total}/18</span>
        <div className="flex items-center gap-2">
          {message && (
            <span className={`text-xs ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {message.text}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
