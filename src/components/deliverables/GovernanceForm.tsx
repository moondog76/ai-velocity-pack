'use client';

import { useState } from 'react';
import { governanceItems } from '@/data/governance-items';
import { ChevronDown, ChevronRight, Save, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface GovernanceFormProps {
  companyId: string;
  existingData: any | null;
  existingStatus: string;
}

type ItemStatus = 'YES' | 'NO' | 'PARTIAL' | 'NA';

interface ChecklistItem {
  item: string;
  status: ItemStatus;
  notes: string;
}

const STATUS_OPTIONS: { value: ItemStatus; label: string; color: string }[] = [
  { value: 'YES', label: 'Yes', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { value: 'NO', label: 'No', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'PARTIAL', label: 'Partial', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { value: 'NA', label: 'N/A', color: 'bg-slate-100 text-slate-600 border-slate-300' },
];

function initSection(sectionKey: string, existingData: any): ChecklistItem[] {
  const items = governanceItems[sectionKey as keyof typeof governanceItems]?.items || [];
  const existing = existingData?.[sectionKey] as ChecklistItem[] | undefined;
  return items.map((itemText, i) => ({
    item: itemText,
    status: existing?.[i]?.status || 'NO',
    notes: existing?.[i]?.notes || '',
  }));
}

export function GovernanceForm({ companyId, existingData, existingStatus }: GovernanceFormProps) {
  const isReadOnly = existingStatus === 'SUBMITTED' || existingStatus === 'GRADED';

  const [sectionA, setSectionA] = useState<ChecklistItem[]>(() => initSection('sectionA', existingData));
  const [sectionB, setSectionB] = useState<ChecklistItem[]>(() => initSection('sectionB', existingData));
  const [sectionC, setSectionC] = useState<ChecklistItem[]>(() => initSection('sectionC', existingData));
  const [sectionD, setSectionD] = useState<ChecklistItem[]>(() => initSection('sectionD', existingData));
  const [operationalOwners, setOperationalOwners] = useState(existingData?.sectionE?.operationalOwners || '');
  const [incidentProcess, setIncidentProcess] = useState(existingData?.sectionE?.incidentProcess || false);
  const [dataMap, setDataMap] = useState(existingData?.sectionE?.dataMap || false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sectionA: true, sectionB: true, sectionC: true, sectionD: true, sectionE: true,
  });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateItem = (
    section: ChecklistItem[],
    setSect: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    index: number,
    field: 'status' | 'notes',
    value: string
  ) => {
    const updated = [...section];
    updated[index] = { ...updated[index], [field]: value };
    setSect(updated);
  };

  const buildData = () => ({
    sectionA,
    sectionB,
    sectionC,
    sectionD,
    sectionE: { operationalOwners, incidentProcess, dataMap },
  });

  const handleSave = async (submit: boolean) => {
    if (submit) setSubmitting(true);
    else setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/deliverables/governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, data: buildData(), submit }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        setMessage({ type: 'error', text: result.error || 'Failed to save' });
      } else {
        setMessage({ type: 'success', text: submit ? 'Governance checklist submitted!' : 'Draft saved' });
        if (submit) window.location.reload();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
      setSubmitting(false);
    }
  };

  const sections = [
    { key: 'sectionA', data: sectionA, setData: setSectionA, ...governanceItems.sectionA },
    { key: 'sectionB', data: sectionB, setData: setSectionB, ...governanceItems.sectionB },
    { key: 'sectionC', data: sectionC, setData: setSectionC, ...governanceItems.sectionC },
    { key: 'sectionD', data: sectionD, setData: setSectionD, ...governanceItems.sectionD },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
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

      {/* Checklist Sections A-D */}
      {sections.map((section, sIdx) => (
        <div key={section.key} className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection(section.key)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {sIdx + 1}
              </span>
              <h3 className="font-semibold text-slate-900 text-sm">{section.title}</h3>
            </div>
            {openSections[section.key] ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
          </button>

          {openSections[section.key] && (
            <div className="px-4 pb-4 space-y-4">
              {section.data.map((item, i) => (
                <div key={i} className="border border-slate-100 rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium text-slate-800">{item.item}</p>
                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={isReadOnly}
                        onClick={() => updateItem(section.data, section.setData, i, 'status', opt.value)}
                        className={`px-3 py-1 rounded-md text-xs font-medium border transition-all ${
                          item.status === opt.value
                            ? opt.color + ' ring-2 ring-offset-1 ring-indigo-400'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        } ${isReadOnly ? 'cursor-not-allowed opacity-70' : ''}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={item.notes}
                    disabled={isReadOnly}
                    onChange={(e) => updateItem(section.data, section.setData, i, 'notes', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Section E: Operations */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection('sectionE')}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">5</span>
            <h3 className="font-semibold text-slate-900 text-sm">Section E: Operations</h3>
          </div>
          {openSections.sectionE ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
        </button>

        {openSections.sectionE && (
          <div className="px-4 pb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Operational Owners</label>
              <input
                type="text"
                value={operationalOwners}
                disabled={isReadOnly}
                onChange={(e) => setOperationalOwners(e.target.value)}
                placeholder="e.g., Jane Doe (CTO), John Smith (Lead Engineer)"
                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={incidentProcess}
                  disabled={isReadOnly}
                  onChange={(e) => setIncidentProcess(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Incident response process documented
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={dataMap}
                  disabled={isReadOnly}
                  onChange={(e) => setDataMap(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Data map documented
              </label>
            </div>
          </div>
        )}
      </div>

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
            onClick={() => handleSave(true)}
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
