'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { baselineSchema } from '@/schemas/deliverables';
import { ChevronDown, ChevronRight, Save, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface BaselineFormProps {
  companyId: string;
  existingData: any | null;
  existingStatus: string;
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export function BaselineForm({ companyId, existingData, existingStatus }: BaselineFormProps) {
  const isReadOnly = existingStatus === 'SUBMITTED' || existingStatus === 'GRADED';
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    repoContext: true, baselineMetrics: true, microRun1: false, microRun2: false, blockers: false, sprintItem: false,
  });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { register, handleSubmit, getValues, formState } = useForm({
    resolver: zodResolver(baselineSchema),
    defaultValues: existingData || {
      repoContext: { primaryRepos: '', language: '', framework: '', buildCommand: '', testCommand: '', ciSystem: '', deployCadence: '' },
      baselineMetrics: { medianPRCycleTime: '', medianReviewIterations: 0, ciFailureRate: 0, flakyTests: false, flakyTestsNotes: '', deployFrequency: '', rollbacksIncidents: 0 },
      microRun1: { targetArea: '', outputDescription: '', humanTimeMinutes: 0, result: 'NOT_COMPLETED', notes: '' },
      microRun2: { targetArea: '', outputDescription: '', humanTimeMinutes: 0, result: 'NOT_COMPLETED', notes: '' },
      blockers: { tooling: '', policy: '', codebase: '' },
      sprintItem: { description: '', rationale: '' },
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = formState.errors as any;

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (submit: boolean) => {
    if (submit) setSubmitting(true);
    else setSaving(true);
    setMessage(null);

    const data = getValues();
    try {
      const res = await fetch('/api/deliverables/baseline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, data, submit }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        const errorMsg = result.errors?.fieldErrors
          ? Object.values(result.errors.fieldErrors).flat().join(', ')
          : result.error || 'Failed to save';
        setMessage({ type: 'error', text: errorMsg });
      } else {
        setMessage({ type: 'success', text: submit ? 'Baseline submitted!' : 'Draft saved' });
        if (submit) window.location.reload();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500";
  const selectClass = inputClass;

  const sections = [
    {
      key: 'repoContext', title: 'Repository Context', num: 1,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Primary Repos (URLs)" error={errors.repoContext?.primaryRepos?.message}>
            <textarea {...register('repoContext.primaryRepos')} disabled={isReadOnly} rows={2} placeholder="e.g., github.com/org/repo" className={inputClass} />
          </FormField>
          <FormField label="Primary Language" error={errors.repoContext?.language?.message}>
            <input {...register('repoContext.language')} disabled={isReadOnly} placeholder="e.g., TypeScript" className={inputClass} />
          </FormField>
          <FormField label="Framework" error={errors.repoContext?.framework?.message}>
            <input {...register('repoContext.framework')} disabled={isReadOnly} placeholder="e.g., Next.js" className={inputClass} />
          </FormField>
          <FormField label="Build Command" error={errors.repoContext?.buildCommand?.message}>
            <input {...register('repoContext.buildCommand')} disabled={isReadOnly} placeholder="e.g., npm run build" className={inputClass} />
          </FormField>
          <FormField label="Test Command" error={errors.repoContext?.testCommand?.message}>
            <input {...register('repoContext.testCommand')} disabled={isReadOnly} placeholder="e.g., npm test" className={inputClass} />
          </FormField>
          <FormField label="CI System" error={errors.repoContext?.ciSystem?.message}>
            <input {...register('repoContext.ciSystem')} disabled={isReadOnly} placeholder="e.g., GitHub Actions" className={inputClass} />
          </FormField>
          <FormField label="Deploy Cadence" error={errors.repoContext?.deployCadence?.message}>
            <input {...register('repoContext.deployCadence')} disabled={isReadOnly} placeholder="e.g., Weekly" className={inputClass} />
          </FormField>
        </div>
      ),
    },
    {
      key: 'baselineMetrics', title: 'Baseline Metrics', num: 2,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Median PR Cycle Time" error={errors.baselineMetrics?.medianPRCycleTime?.message}>
            <input {...register('baselineMetrics.medianPRCycleTime')} disabled={isReadOnly} placeholder="e.g., 4.2 hours" className={inputClass} />
          </FormField>
          <FormField label="Median Review Iterations" error={errors.baselineMetrics?.medianReviewIterations?.message}>
            <input type="number" {...register('baselineMetrics.medianReviewIterations')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <FormField label="CI Failure Rate (%)" error={errors.baselineMetrics?.ciFailureRate?.message}>
            <input type="number" step="0.1" {...register('baselineMetrics.ciFailureRate')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <FormField label="Deploy Frequency" error={errors.baselineMetrics?.deployFrequency?.message}>
            <input {...register('baselineMetrics.deployFrequency')} disabled={isReadOnly} placeholder="e.g., 3x per week" className={inputClass} />
          </FormField>
          <FormField label="Rollbacks / Incidents (last 30d)" error={errors.baselineMetrics?.rollbacksIncidents?.message}>
            <input type="number" {...register('baselineMetrics.rollbacksIncidents')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register('baselineMetrics.flakyTests')} disabled={isReadOnly} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              Flaky tests present
            </label>
            <FormField label="Flaky Tests Notes" error={errors.baselineMetrics?.flakyTestsNotes?.message}>
              <input {...register('baselineMetrics.flakyTestsNotes')} disabled={isReadOnly} placeholder="Optional details" className={inputClass} />
            </FormField>
          </div>
        </div>
      ),
    },
    {
      key: 'microRun1', title: 'Micro-Run 1 (AI Coding Trial)', num: 3,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Target Area" error={errors.microRun1?.targetArea?.message}>
            <input {...register('microRun1.targetArea')} disabled={isReadOnly} placeholder="e.g., API endpoint generation" className={inputClass} />
          </FormField>
          <FormField label="Output Description" error={errors.microRun1?.outputDescription?.message}>
            <textarea {...register('microRun1.outputDescription')} disabled={isReadOnly} rows={2} placeholder="What did the AI produce?" className={inputClass} />
          </FormField>
          <FormField label="Human Time (minutes)" error={errors.microRun1?.humanTimeMinutes?.message}>
            <input type="number" {...register('microRun1.humanTimeMinutes')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <FormField label="Result" error={errors.microRun1?.result?.message}>
            <select {...register('microRun1.result')} disabled={isReadOnly} className={selectClass}>
              <option value="NOT_COMPLETED">Not Completed</option>
              <option value="COMMITTED">Committed</option>
              <option value="PR_CREATED">PR Created</option>
              <option value="PR_MERGED">PR Merged</option>
            </select>
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Notes" error={errors.microRun1?.notes?.message}>
              <textarea {...register('microRun1.notes')} disabled={isReadOnly} rows={2} placeholder="Optional notes" className={inputClass} />
            </FormField>
          </div>
        </div>
      ),
    },
    {
      key: 'microRun2', title: 'Micro-Run 2 (AI Coding Trial)', num: 4,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Target Area" error={errors.microRun2?.targetArea?.message}>
            <input {...register('microRun2.targetArea')} disabled={isReadOnly} placeholder="e.g., Test generation" className={inputClass} />
          </FormField>
          <FormField label="Output Description" error={errors.microRun2?.outputDescription?.message}>
            <textarea {...register('microRun2.outputDescription')} disabled={isReadOnly} rows={2} placeholder="What did the AI produce?" className={inputClass} />
          </FormField>
          <FormField label="Human Time (minutes)" error={errors.microRun2?.humanTimeMinutes?.message}>
            <input type="number" {...register('microRun2.humanTimeMinutes')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <FormField label="Result" error={errors.microRun2?.result?.message}>
            <select {...register('microRun2.result')} disabled={isReadOnly} className={selectClass}>
              <option value="NOT_COMPLETED">Not Completed</option>
              <option value="COMMITTED">Committed</option>
              <option value="PR_CREATED">PR Created</option>
              <option value="PR_MERGED">PR Merged</option>
            </select>
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Notes" error={errors.microRun2?.notes?.message}>
              <textarea {...register('microRun2.notes')} disabled={isReadOnly} rows={2} placeholder="Optional notes" className={inputClass} />
            </FormField>
          </div>
        </div>
      ),
    },
    {
      key: 'blockers', title: 'Blockers & Risks', num: 5,
      content: (
        <div className="space-y-4">
          <FormField label="Tooling Blockers" error={errors.blockers?.tooling?.message}>
            <textarea {...register('blockers.tooling')} disabled={isReadOnly} rows={2} placeholder="Any AI tooling issues?" className={inputClass} />
          </FormField>
          <FormField label="Policy Blockers" error={errors.blockers?.policy?.message}>
            <textarea {...register('blockers.policy')} disabled={isReadOnly} rows={2} placeholder="Any policy restrictions?" className={inputClass} />
          </FormField>
          <FormField label="Codebase Blockers" error={errors.blockers?.codebase?.message}>
            <textarea {...register('blockers.codebase')} disabled={isReadOnly} rows={2} placeholder="Any codebase-specific challenges?" className={inputClass} />
          </FormField>
        </div>
      ),
    },
    {
      key: 'sprintItem', title: 'Sprint Item Selection', num: 6,
      content: (
        <div className="space-y-4">
          <FormField label="Sprint Item Description" error={errors.sprintItem?.description?.message}>
            <textarea {...register('sprintItem.description')} disabled={isReadOnly} rows={3} placeholder="Describe the work item you'll tackle during the sprint" className={inputClass} />
          </FormField>
          <FormField label="Rationale" error={errors.sprintItem?.rationale?.message}>
            <textarea {...register('sprintItem.rationale')} disabled={isReadOnly} rows={3} placeholder="Why is this a good candidate for AI-assisted development?" className={inputClass} />
          </FormField>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Status badge */}
      <div className="flex items-center justify-between">
        <div>
          {existingStatus === 'DRAFT' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Draft</span>
          )}
          {existingStatus === 'SUBMITTED' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Submitted</span>
          )}
          {existingStatus === 'GRADED' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">Graded</span>
          )}
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Accordion sections */}
      {sections.map((section) => (
        <div key={section.key} className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection(section.key)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {section.num}
              </span>
              <h3 className="font-semibold text-slate-900 text-sm">{section.title}</h3>
            </div>
            {openSections[section.key] ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
          </button>

          {openSections[section.key] && (
            <div className="px-4 pb-4">
              {section.content}
            </div>
          )}
        </div>
      ))}

      {/* Action buttons */}
      {!isReadOnly && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving || submitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => { handleSubmit(() => handleSave(true))(); }}
            disabled={saving || submitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Submit for Review
          </button>
        </div>
      )}
    </div>
  );
}
