'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sprintReportSchema } from '@/schemas/deliverables';
import { ChevronDown, ChevronRight, Save, Send, CheckCircle2, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';

interface SprintReportFormProps {
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

export function SprintReportForm({ companyId, existingData, existingStatus }: SprintReportFormProps) {
  const isReadOnly = existingStatus === 'SUBMITTED' || existingStatus === 'GRADED';
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sprintInfo: true, scope: true, agenticEvidence: false, deltas: false, improvements: false, degradations: false, decision: false,
  });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { register, handleSubmit, control, getValues, formState } = useForm({
    resolver: zodResolver(sprintReportSchema),
    defaultValues: existingData || {
      sprintInfo: { startDate: '', endDate: '', engineersInvolved: 1 },
      scope: { featureDescription: '', filesTouched: '', risk: 'LOW', riskRationale: '' },
      agenticEvidence: { toolsUsed: '', commandsRun: '', prLink: '', ciRunLink: '' },
      deltas: { engineerTime: 0, calendarTime: '', reviewIterations: 0, ciFailures: 0, testsUpdated: false, testsNotes: '', docsUpdated: false, docsNotes: '', postMergeIssues: '' },
      improvements: [],
      degradations: [],
      decision: { nextStep: 'MAINTAIN', nextUseCases: [], policyToolingChanges: '' },
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = formState.errors as any;

  const { fields: improvementFields, append: addImprovement, remove: removeImprovement } = useFieldArray({ control, name: 'improvements' });
  const { fields: degradationFields, append: addDegradation, remove: removeDegradation } = useFieldArray({ control, name: 'degradations' });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (submit: boolean) => {
    if (submit) setSubmitting(true);
    else setSaving(true);
    setMessage(null);

    const data = getValues();
    try {
      const res = await fetch('/api/deliverables/sprint-report', {
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
        setMessage({ type: 'success', text: submit ? 'Sprint report submitted!' : 'Draft saved' });
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

  const sections = [
    {
      key: 'sprintInfo', title: 'Sprint Info', num: 1,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Start Date" error={errors.sprintInfo?.startDate?.message}>
            <input type="date" {...register('sprintInfo.startDate')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <FormField label="End Date" error={errors.sprintInfo?.endDate?.message}>
            <input type="date" {...register('sprintInfo.endDate')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <FormField label="Engineers Involved" error={errors.sprintInfo?.engineersInvolved?.message}>
            <input type="number" {...register('sprintInfo.engineersInvolved')} disabled={isReadOnly} min={1} className={inputClass} />
          </FormField>
        </div>
      ),
    },
    {
      key: 'scope', title: 'Scope & Feature', num: 2,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField label="Feature Description" error={errors.scope?.featureDescription?.message}>
              <textarea {...register('scope.featureDescription')} disabled={isReadOnly} rows={3} placeholder="Describe the feature built during the sprint" className={inputClass} />
            </FormField>
          </div>
          <FormField label="Files Touched" error={errors.scope?.filesTouched?.message}>
            <textarea {...register('scope.filesTouched')} disabled={isReadOnly} rows={2} placeholder="Key files modified" className={inputClass} />
          </FormField>
          <div className="space-y-4">
            <FormField label="Risk Level" error={errors.scope?.risk?.message}>
              <select {...register('scope.risk')} disabled={isReadOnly} className={inputClass}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </FormField>
            <FormField label="Risk Rationale" error={errors.scope?.riskRationale?.message}>
              <input {...register('scope.riskRationale')} disabled={isReadOnly} placeholder="Why this risk level?" className={inputClass} />
            </FormField>
          </div>
        </div>
      ),
    },
    {
      key: 'agenticEvidence', title: 'Agentic Evidence', num: 3,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="AI Tools Used" error={errors.agenticEvidence?.toolsUsed?.message}>
            <textarea {...register('agenticEvidence.toolsUsed')} disabled={isReadOnly} rows={2} placeholder="e.g., Claude Code, Cursor, GitHub Copilot" className={inputClass} />
          </FormField>
          <FormField label="Commands / Prompts Run" error={errors.agenticEvidence?.commandsRun?.message}>
            <textarea {...register('agenticEvidence.commandsRun')} disabled={isReadOnly} rows={2} placeholder="Key prompts or commands used" className={inputClass} />
          </FormField>
          <FormField label="PR Link (optional)" error={errors.agenticEvidence?.prLink?.message}>
            <input {...register('agenticEvidence.prLink')} disabled={isReadOnly} placeholder="https://github.com/..." className={inputClass} />
          </FormField>
          <FormField label="CI Run Link (optional)" error={errors.agenticEvidence?.ciRunLink?.message}>
            <input {...register('agenticEvidence.ciRunLink')} disabled={isReadOnly} placeholder="https://github.com/.../actions/runs/..." className={inputClass} />
          </FormField>
        </div>
      ),
    },
    {
      key: 'deltas', title: 'Deltas & Metrics', num: 4,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Engineer Time (minutes)" error={errors.deltas?.engineerTime?.message}>
            <input type="number" {...register('deltas.engineerTime')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <FormField label="Calendar Time" error={errors.deltas?.calendarTime?.message}>
            <input {...register('deltas.calendarTime')} disabled={isReadOnly} placeholder="e.g., 2.5 hours" className={inputClass} />
          </FormField>
          <FormField label="Review Iterations" error={errors.deltas?.reviewIterations?.message}>
            <input type="number" {...register('deltas.reviewIterations')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <FormField label="CI Failures" error={errors.deltas?.ciFailures?.message}>
            <input type="number" {...register('deltas.ciFailures')} disabled={isReadOnly} className={inputClass} />
          </FormField>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" {...register('deltas.testsUpdated')} disabled={isReadOnly} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Tests updated
              </label>
              <FormField label="Test Notes" error={errors.deltas?.testsNotes?.message}>
                <input {...register('deltas.testsNotes')} disabled={isReadOnly} placeholder="Optional details" className={inputClass} />
              </FormField>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" {...register('deltas.docsUpdated')} disabled={isReadOnly} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Docs updated
              </label>
              <FormField label="Docs Notes" error={errors.deltas?.docsNotes?.message}>
                <input {...register('deltas.docsNotes')} disabled={isReadOnly} placeholder="Optional details" className={inputClass} />
              </FormField>
            </div>
          </div>
          <div className="md:col-span-2">
            <FormField label="Post-Merge Issues" error={errors.deltas?.postMergeIssues?.message}>
              <textarea {...register('deltas.postMergeIssues')} disabled={isReadOnly} rows={2} placeholder="Any issues after merging?" className={inputClass} />
            </FormField>
          </div>
        </div>
      ),
    },
    {
      key: 'improvements', title: 'Improvements Observed', num: 5,
      content: (
        <div className="space-y-3">
          {improvementFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start">
              <FormField label="" error={errors.improvements?.[i]?.item?.message}>
                <input {...register(`improvements.${i}.item`)} disabled={isReadOnly} placeholder="Describe an improvement" className={inputClass} />
              </FormField>
              {!isReadOnly && (
                <button type="button" onClick={() => removeImprovement(i)} className="mt-1 p-1.5 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <button type="button" onClick={() => addImprovement({ item: '' })} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <Plus className="h-4 w-4" /> Add Improvement
            </button>
          )}
        </div>
      ),
    },
    {
      key: 'degradations', title: 'Degradations / Issues', num: 6,
      content: (
        <div className="space-y-3">
          {degradationFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start">
              <FormField label="" error={errors.degradations?.[i]?.item?.message}>
                <input {...register(`degradations.${i}.item`)} disabled={isReadOnly} placeholder="Describe an issue or degradation" className={inputClass} />
              </FormField>
              {!isReadOnly && (
                <button type="button" onClick={() => removeDegradation(i)} className="mt-1 p-1.5 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {!isReadOnly && (
            <button type="button" onClick={() => addDegradation({ item: '' })} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <Plus className="h-4 w-4" /> Add Degradation
            </button>
          )}
        </div>
      ),
    },
    {
      key: 'decision', title: 'Go / No-Go Decision', num: 7,
      content: (
        <div className="space-y-4">
          <FormField label="Next Step" error={errors.decision?.nextStep?.message}>
            <select {...register('decision.nextStep')} disabled={isReadOnly} className={inputClass}>
              <option value="EXPAND">Expand — Roll out to more areas</option>
              <option value="MAINTAIN">Maintain — Continue current scope</option>
              <option value="PAUSE">Pause — Reassess approach</option>
              <option value="STOP">Stop — Not viable at this time</option>
            </select>
          </FormField>
          <FormField label="Policy / Tooling Changes Needed" error={errors.decision?.policyToolingChanges?.message}>
            <textarea {...register('decision.policyToolingChanges')} disabled={isReadOnly} rows={2} placeholder="Any changes needed?" className={inputClass} />
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
