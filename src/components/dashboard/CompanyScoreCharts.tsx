'use client';

import { ScoreRadar } from './RadarChart';
import { RAGStatus } from './RAGStatus';

interface CompanyScoreChartsProps {
  scores: {
    agenticEvidence: number;
    cycleTimeImprovement: number;
    reviewEfficiency: number;
    qualityReliability: number;
    governanceReadiness: number;
    repeatability: number;
  };
}

export function CompanyScoreCharts({ scores }: CompanyScoreChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium text-slate-500 mb-2">Score Radar</h3>
        <ScoreRadar scores={scores} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500 mb-2">Dimension Breakdown</h3>
        <RAGStatus scores={scores} />
      </div>
    </div>
  );
}
