'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface ScoreData {
  agenticEvidence: number;
  cycleTimeImprovement: number;
  reviewEfficiency: number;
  qualityReliability: number;
  governanceReadiness: number;
  repeatability: number;
  notes: string;
}

interface AiDimension {
  name: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  rationale: string;
  evidence: string[];
}

interface AiResult {
  dimensions: AiDimension[];
  overallSummary: string;
  recommendations: string[];
  analyzedAt: string;
}

interface ScoringFormProps {
  companyId: string;
  companyName: string;
  existingScore: ScoreData | null;
  hasSubmissions: boolean;
  existingAiAnalysis?: AiResult | null;
}

const categories = [
  { key: 'agenticEvidence', aiName: 'Agentic Evidence', label: 'Agentic Evidence', description: 'Use of AI coding tools with clear logs/artifacts' },
  { key: 'cycleTimeImprovement', aiName: 'Cycle Time Improvement', label: 'Cycle Time Improvement', description: 'PR cycle time reduction vs baseline' },
  { key: 'reviewEfficiency', aiName: 'Review Efficiency', label: 'Review Efficiency', description: 'Fewer review iterations, cleaner PRs' },
  { key: 'qualityReliability', aiName: 'Quality & Reliability', label: 'Quality & Reliability', description: 'Test coverage, CI pass rate, post-merge issues' },
  { key: 'governanceReadiness', aiName: 'Governance Readiness', label: 'Governance Readiness', description: 'Security, compliance, audit trail completeness' },
  { key: 'repeatability', aiName: 'Repeatability', label: 'Repeatability', description: 'Documented processes, templates, team adoption' },
] as const;

const confidenceColors = {
  high: 'bg-emerald-400',
  medium: 'bg-amber-400',
  low: 'bg-red-400',
};

export function ScoringForm({ companyId, companyName, existingScore, hasSubmissions, existingAiAnalysis }: ScoringFormProps) {
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
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(existingAiAnalysis || null);
  const [aiScoresMap, setAiScoresMap] = useState<Record<string, number>>(() => {
    if (!existingAiAnalysis) return {};
    const map: Record<string, number> = {};
    existingAiAnalysis.dimensions?.forEach((d) => {
      const cat = categories.find((c) => c.aiName === d.name);
      if (cat) map[cat.key] = d.score;
    });
    return map;
  });
  const [editedDimensions, setEditedDimensions] = useState<Record<string, boolean>>({});
  const [expandedRationale, setExpandedRationale] = useState<Record<string, boolean>>({});
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const total = scores.agenticEvidence + scores.cycleTimeImprovement + scores.reviewEfficiency +
    scores.qualityReliability + scores.governanceReadiness + scores.repeatability;

  const handleRunAi = async () => {
    setAnalyzing(true);
    setMessage(null);
    try {
      const res = await fetch('/api/scoring/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setAiResult(data.data);
      // Pre-populate scores from AI
      const newScores = { ...scores };
      const newAiMap: Record<string, number> = {};
      data.data.dimensions.forEach((d: AiDimension) => {
        const cat = categories.find((c) => c.aiName === d.name);
        if (cat) {
          const key = cat.key as keyof ScoreData;
          (newScores as any)[key] = d.score;
          newAiMap[cat.key] = d.score;
        }
      });
      setScores(newScores);
      setAiScoresMap(newAiMap);
      setEditedDimensions({});
      setMessage({ type: 'success', text: 'AI analysis complete — scores pre-filled' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleScoreClick = (key: string, val: number) => {
    setScores((s) => ({ ...s, [key]: val }));
    if (aiScoresMap[key] !== undefined && aiScoresMap[key] !== val) {
      setEditedDimensions((e) => ({ ...e, [key]: true }));
    } else if (aiScoresMap[key] === val) {
      setEditedDimensions((e) => { const n = { ...e }; delete n[key]; return n; });
    }
  };

  const getAiDimension = (aiName: string): AiDimension | undefined => {
    return aiResult?.dimensions?.find((d) => d.name === aiName);
  };

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
      {/* Header with AI button */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900">{companyName}</h3>
        <button
          onClick={handleRunAi}
          disabled={analyzing || !hasSubmissions}
          title={!hasSubmissions ? 'No submissions to analyze' : 'Run AI analysis'}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </button>
      </div>

      {/* Scoring dimensions */}
      <div className="space-y-2">
        {categories.map(({ key, aiName, label, description }) => {
          const aiDim = getAiDimension(aiName);
          const isEdited = editedDimensions[key];
          const hasAiScore = aiScoresMap[key] !== undefined;
          const isExpanded = expandedRationale[key];

          return (
            <div key={key}>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                    {/* Confidence dot */}
                    {aiDim && (
                      <span className={`h-2 w-2 rounded-full ${confidenceColors[aiDim.confidence]}`} title={`AI confidence: ${aiDim.confidence}`} />
                    )}
                    {/* AI / Edited badge */}
                    {hasAiScore && !isEdited && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded">AI</span>
                    )}
                    {isEdited && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 rounded" title={`AI suggested: ${aiScoresMap[key]}`}>Edited</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleScoreClick(key, val)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        scores[key as keyof ScoreData] === val
                          ? hasAiScore && !isEdited ? 'bg-purple-600 text-white' : 'bg-indigo-600 text-white'
                          : aiScoresMap[key] === val ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
              {/* Rationale toggle */}
              {aiDim && (
                <div className="ml-0 mt-1">
                  <button
                    onClick={() => setExpandedRationale((e) => ({ ...e, [key]: !e[key] }))}
                    className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-0.5"
                  >
                    {isExpanded ? 'Hide AI rationale' : 'Show AI rationale'}
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {isExpanded && (
                    <div className="mt-1 bg-purple-50 border border-purple-100 rounded-md p-3 text-xs space-y-1">
                      <p className="text-slate-700">{aiDim.rationale}</p>
                      {aiDim.evidence?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium text-slate-600 mb-1">Evidence:</p>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                            {aiDim.evidence.map((e, i) => <li key={i}>{e}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Recommendations */}
      {aiResult && (
        <div className="mt-4">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium"
          >
            {showRecommendations ? 'Hide' : 'Show'} AI Summary & Recommendations
            {showRecommendations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showRecommendations && (
            <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-purple-800 mb-1">Overall Summary</p>
                <p className="text-sm text-slate-700">{aiResult.overallSummary}</p>
              </div>
              {aiResult.recommendations?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-purple-800 mb-1">Recommendations</p>
                  <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    {aiResult.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              <p className="text-xs text-slate-500">Analyzed {new Date(aiResult.analyzedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
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

      {/* Footer */}
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
