'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, ChevronDown, ChevronUp, Loader2, Check } from 'lucide-react';

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
  { key: 'cycleTimeImprovement', aiName: 'Cycle Time Improvement', label: 'Cycle Time', description: 'PR cycle time reduction vs baseline' },
  { key: 'reviewEfficiency', aiName: 'Review Efficiency', label: 'Review Efficiency', description: 'Fewer review iterations, cleaner PRs' },
  { key: 'qualityReliability', aiName: 'Quality & Reliability', label: 'Quality & Reliability', description: 'Test coverage, CI pass rate' },
  { key: 'governanceReadiness', aiName: 'Governance Readiness', label: 'Governance', description: 'Security, compliance, audit trail' },
  { key: 'repeatability', aiName: 'Repeatability', label: 'Repeatability', description: 'Documented processes, team adoption' },
] as const;

const confidenceColors = {
  high: 'bg-emerald-400',
  medium: 'bg-amber-400',
  low: 'bg-red-400',
};

const confidenceLabels = {
  high: 'High',
  medium: 'Med',
  low: 'Low',
};

export function ScoringForm({ companyId, existingScore, hasSubmissions, existingAiAnalysis }: ScoringFormProps) {
  const router = useRouter();
  const hasTriggered = useRef(false);

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
  const [expandedRationale, setExpandedRationale] = useState<Record<string, boolean>>({});
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Build a map of AI scores by category key
  const getAiScoresMap = (result: AiResult | null): Record<string, number> => {
    if (!result) return {};
    const map: Record<string, number> = {};
    result.dimensions?.forEach((d) => {
      const cat = categories.find((c) => c.aiName === d.name);
      if (cat) map[cat.key] = d.score;
    });
    return map;
  };

  const aiScoresMap = getAiScoresMap(aiResult);

  const aiTotal = Object.values(aiScoresMap).reduce((sum, v) => sum + v, 0);
  const finalTotal = scores.agenticEvidence + scores.cycleTimeImprovement + scores.reviewEfficiency +
    scores.qualityReliability + scores.governanceReadiness + scores.repeatability;

  const getAiDimension = (aiName: string): AiDimension | undefined => {
    return aiResult?.dimensions?.find((d) => d.name === aiName);
  };

  // Auto-trigger AI analysis on mount if there are submissions but no existing analysis
  useEffect(() => {
    if (hasSubmissions && !existingAiAnalysis && !hasTriggered.current) {
      hasTriggered.current = true;
      runAiAnalysis();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const runAiAnalysis = async () => {
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

      // Pre-fill final scores from AI only if no existing manual scores
      if (!existingScore) {
        const newScores = { ...scores };
        data.data.dimensions.forEach((d: AiDimension) => {
          const cat = categories.find((c) => c.aiName === d.name);
          if (cat) {
            (newScores as any)[cat.key] = d.score;
          }
        });
        setScores(newScores);
      }

      setMessage({ type: 'success', text: 'AI analysis complete' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setAnalyzing(false);
    }
  };

  const acceptAllAiScores = () => {
    const newScores = { ...scores };
    Object.entries(aiScoresMap).forEach(([key, val]) => {
      (newScores as any)[key] = val;
    });
    setScores(newScores);
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
    <div>
      {/* Error banner — shown prominently at top */}
      {message?.type === 'error' && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
          <span className="text-sm text-red-700">{message.text}</span>
          <button
            onClick={runAiAnalysis}
            disabled={analyzing}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      )}

      {/* Table header */}
      <div className="grid grid-cols-[1fr,80px,80px,160px] gap-2 mb-2 px-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dimension</div>
        <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider text-center flex items-center justify-center gap-1">
          AI
          {!analyzing && hasSubmissions && (
            <button
              onClick={runAiAnalysis}
              title={aiResult ? 'Re-analyze' : 'Run AI analysis'}
              className="text-purple-400 hover:text-purple-600 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Conf.</div>
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider text-center">Final Score</div>
      </div>

      {/* Scoring rows */}
      <div className="space-y-1">
        {categories.map(({ key, aiName, label, description }) => {
          const aiDim = getAiDimension(aiName);
          const aiScore = aiScoresMap[key];
          const finalScore = scores[key as keyof ScoreData] as number;
          const isExpanded = expandedRationale[key];
          const matchesAi = aiScore !== undefined && finalScore === aiScore;

          return (
            <div key={key}>
              <div className="grid grid-cols-[1fr,80px,80px,160px] gap-2 items-center py-2 px-1 rounded-md hover:bg-slate-50">
                {/* Dimension info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    {aiDim && (
                      <button
                        onClick={() => setExpandedRationale((e) => ({ ...e, [key]: !e[key] }))}
                        className="text-purple-400 hover:text-purple-600"
                        title="Show AI rationale"
                      >
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>

                {/* AI Score */}
                <div className="flex items-center justify-center">
                  {analyzing ? (
                    <div className="h-8 w-8 rounded bg-purple-50 animate-pulse" />
                  ) : aiScore !== undefined ? (
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded bg-purple-100 text-purple-700 font-bold text-sm">
                      {aiScore}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-center">
                  {analyzing ? (
                    <div className="h-4 w-12 rounded bg-purple-50 animate-pulse" />
                  ) : aiDim ? (
                    <div className="flex items-center gap-1">
                      <span className={`h-2 w-2 rounded-full ${confidenceColors[aiDim.confidence]}`} />
                      <span className="text-xs text-slate-600">{confidenceLabels[aiDim.confidence]}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </div>

                {/* Final Score buttons */}
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setScores((s) => ({ ...s, [key]: val }))}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        finalScore === val
                          ? matchesAi ? 'bg-purple-600 text-white' : 'bg-indigo-600 text-white'
                          : aiScore === val ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expanded rationale */}
              {isExpanded && aiDim && (
                <div className="ml-1 mb-2 bg-purple-50 border border-purple-100 rounded-md p-3 text-xs space-y-1">
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
          );
        })}
      </div>

      {/* Totals row */}
      <div className="grid grid-cols-[1fr,80px,80px,160px] gap-2 items-center mt-2 pt-2 border-t border-slate-200 px-1">
        <div className="text-sm font-bold text-slate-900">Total</div>
        <div className="text-center">
          {aiResult && (
            <span className="text-sm font-bold text-purple-700">{aiTotal}/18</span>
          )}
        </div>
        <div />
        <div className="text-center">
          <span className="text-sm font-bold text-indigo-700">{finalTotal}/18</span>
        </div>
      </div>

      {/* Accept all + AI status */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {analyzing && (
            <span className="flex items-center gap-1.5 text-xs text-purple-600">
              <Loader2 className="h-3 w-3 animate-spin" />
              Running AI analysis...
            </span>
          )}
          {aiResult && !analyzing && (
            <button
              onClick={acceptAllAiScores}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors border border-purple-200"
            >
              <Check className="h-3 w-3" />
              Accept All AI Scores
            </button>
          )}
          {aiResult && (
            <span className="text-xs text-slate-400">
              Analyzed {new Date(aiResult.analyzedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      {aiResult && (
        <div className="mt-3">
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium"
          >
            {showRecommendations ? 'Hide' : 'Show'} AI Summary & Recommendations
            {showRecommendations ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
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
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="mt-3">
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
        <input
          type="text"
          maxLength={280}
          value={scores.notes}
          onChange={(e) => setScores((s) => ({ ...s, notes: e.target.value }))}
          placeholder="Brief scoring rationale..."
          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Save */}
      <div className="mt-3 flex items-center justify-end gap-2">
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
          {saving ? 'Saving...' : 'Save Scores'}
        </button>
      </div>
    </div>
  );
}
