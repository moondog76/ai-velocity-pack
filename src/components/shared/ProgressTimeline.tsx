'use client';

import { CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Milestone {
  label: string;
  status: 'complete' | 'in_progress' | 'pending';
  date?: Date | string | null;
}

interface ProgressTimelineProps {
  milestones: Milestone[];
}

export function ProgressTimeline({ milestones }: ProgressTimelineProps) {
  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {milestones.map((m, i) => {
        const isComplete = m.status === 'complete';
        const isInProgress = m.status === 'in_progress';
        const isLast = i === milestones.length - 1;

        return (
          <div key={i} className="flex items-start flex-1 min-w-[100px]">
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                isComplete
                  ? 'bg-emerald-100 border-emerald-500'
                  : isInProgress
                  ? 'bg-amber-100 border-amber-500'
                  : 'bg-slate-100 border-slate-300'
              }`}>
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Clock className={`h-4 w-4 ${isInProgress ? 'text-amber-600' : 'text-slate-400'}`} />
                )}
              </div>

              {/* Label */}
              <span className={`text-xs mt-1.5 text-center leading-tight ${
                isComplete ? 'text-emerald-700 font-medium' : isInProgress ? 'text-amber-700 font-medium' : 'text-slate-500'
              }`}>
                {m.label}
              </span>

              {/* Date */}
              {m.date && (
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {format(new Date(m.date), 'MMM d')}
                </span>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className={`flex-1 h-0.5 mt-4 mx-1 ${
                isComplete ? 'bg-emerald-300' : 'bg-slate-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
