'use client';

interface RAGStatusProps {
  scores: {
    agenticEvidence: number;
    cycleTimeImprovement: number;
    reviewEfficiency: number;
    qualityReliability: number;
    governanceReadiness: number;
    repeatability: number;
  };
}

const dimensions = [
  { key: 'agenticEvidence', label: 'Agentic Evidence' },
  { key: 'cycleTimeImprovement', label: 'Cycle Time' },
  { key: 'reviewEfficiency', label: 'Review Efficiency' },
  { key: 'qualityReliability', label: 'Quality & Reliability' },
  { key: 'governanceReadiness', label: 'Governance' },
  { key: 'repeatability', label: 'Repeatability' },
];

function getRAG(score: number): { color: string; bg: string; bar: string; label: string } {
  if (score >= 2) return { color: 'text-emerald-700', bg: 'bg-emerald-50', bar: 'bg-emerald-500', label: 'Good' };
  if (score >= 1) return { color: 'text-amber-700', bg: 'bg-amber-50', bar: 'bg-amber-500', label: 'Needs Work' };
  return { color: 'text-red-700', bg: 'bg-red-50', bar: 'bg-red-500', label: 'No Evidence' };
}

export function RAGStatus({ scores }: RAGStatusProps) {
  return (
    <div className="space-y-2">
      {dimensions.map(({ key, label }) => {
        const score = scores[key as keyof typeof scores] || 0;
        const rag = getRAG(score);
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm text-slate-600 w-36 shrink-0">{label}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2">
              <div
                className={`${rag.bar} h-2 rounded-full transition-all`}
                style={{ width: `${(score / 3) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-900 w-8 text-right">{score}/3</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${rag.bg} ${rag.color} w-24 text-center`}>
              {rag.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
