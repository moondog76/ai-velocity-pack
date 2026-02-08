'use client';

import { RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface ScoreRadarProps {
  scores: {
    agenticEvidence: number;
    cycleTimeImprovement: number;
    reviewEfficiency: number;
    qualityReliability: number;
    governanceReadiness: number;
    repeatability: number;
  };
}

const dimensionLabels = [
  { key: 'agenticEvidence', label: 'Agentic' },
  { key: 'cycleTimeImprovement', label: 'Cycle Time' },
  { key: 'reviewEfficiency', label: 'Review' },
  { key: 'qualityReliability', label: 'Quality' },
  { key: 'governanceReadiness', label: 'Governance' },
  { key: 'repeatability', label: 'Repeatability' },
];

export function ScoreRadar({ scores }: ScoreRadarProps) {
  const data = dimensionLabels.map(({ key, label }) => ({
    dimension: label,
    score: scores[key as keyof typeof scores] || 0,
    fullMark: 3,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsRadar cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: '#64748b', fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 3]}
          tickCount={4}
          tick={{ fill: '#94a3b8', fontSize: 10 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#265039"
          fill="#265039"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
