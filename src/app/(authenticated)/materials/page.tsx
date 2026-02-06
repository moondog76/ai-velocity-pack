import { requireAuth } from '@/lib/auth-utils';
import {
  programOverview,
  ctoMemo,
  webinarSlides,
  promptPatterns,
  kpiRubric,
} from '@/data/program-content';
import { Check, X, Copy } from 'lucide-react';

export default async function MaterialsPage() {
  await requireAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Program Materials</h1>
        <p className="text-sm text-slate-600 mt-1">
          Reference materials for the AI Velocity Pack program
        </p>
      </div>

      <div className="space-y-6">
        {/* Program Overview */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Program Overview</h2>
          <p className="text-sm text-slate-600 mb-4">{programOverview.purpose}</p>
          <p className="text-sm text-slate-600 mb-4"><strong>Timeline:</strong> {programOverview.timeline}</p>

          <h3 className="text-sm font-semibold text-slate-900 mt-4 mb-2">What Counts as "Agentic"?</h3>
          <ul className="space-y-2">
            {programOverview.agenticCriteria.map((criterion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-semibold text-slate-900 mt-4 mb-2">What Doesn't Count:</h3>
          <ul className="space-y-2">
            {programOverview.exclusions.map((exclusion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{exclusion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CEO/CTO Memo */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">CEO/CTO Memo</h2>
            <button
              onClick={() => navigator.clipboard.writeText(ctoMemo)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </button>
          </div>
          <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap">
            {ctoMemo}
          </div>
        </div>

        {/* Webinar Outline */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Webinar Outline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {webinarSlides.map((slide) => (
              <div key={slide.slideNumber} className="border border-slate-200 rounded-lg p-4">
                <div className="text-xs font-medium text-indigo-600 mb-1">
                  Slide {slide.slideNumber}
                </div>
                <h3 className="font-medium text-slate-900 mb-2">{slide.title}</h3>
                <ul className="space-y-1">
                  {slide.bullets.map((bullet, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Patterns */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Prompt Patterns</h2>
          <div className="space-y-4">
            {promptPatterns.map((pattern) => (
              <div key={pattern.name} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{pattern.name}</h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(pattern.promptTemplate)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
                <p className="text-sm text-slate-600 mb-3">{pattern.description}</p>
                <pre className="bg-slate-50 border border-slate-200 rounded p-3 text-xs overflow-x-auto">
                  <code>{pattern.promptTemplate}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Rubric */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">KPI Rubric</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Dimension</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">0 Points</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">1 Point</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">2 Points</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">3 Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {kpiRubric.map((rubric, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-medium text-slate-900">{rubric.dimension}</td>
                    <td className="px-4 py-3 text-slate-600">{rubric.criteria0}</td>
                    <td className="px-4 py-3 text-slate-600">{rubric.criteria1}</td>
                    <td className="px-4 py-3 text-slate-600">{rubric.criteria2}</td>
                    <td className="px-4 py-3 text-slate-600">{rubric.criteria3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
