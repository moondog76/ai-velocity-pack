import { requireAuth } from '@/lib/auth-utils';
import { calendarEvents } from '@/data/ics-events';
import { format } from 'date-fns';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

const typeColors = {
  WEBINAR: 'bg-blue-100 text-blue-700 border-blue-200',
  TRAINING: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  OFFICE_HOURS: 'bg-amber-100 text-amber-700 border-amber-200',
  DEADLINE: 'bg-red-100 text-red-700 border-red-200',
};

export default async function CalendarPage() {
  await requireAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Program Calendar</h1>
        <p className="text-sm text-slate-600 mt-1">
          All times are in CET (Central European Time)
        </p>
      </div>

      <div className="space-y-4">
        {calendarEvents.map((event) => {
          const startDate = new Date(event.startISO);
          const endDate = new Date(event.endISO);

          return (
            <div
              key={event.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        typeColors[event.type]
                      }`}
                    >
                      {event.type.replace('_', ' ')}
                    </span>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {event.title}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(startDate, 'MMMM d, yyyy')}</span>
                    </div>
                    <div>
                      {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')} CET
                    </div>
                  </div>
                </div>
                <Link
                  href={`/api/ics/${event.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  <Download className="h-4 w-4" />
                  Download .ics
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          <strong>Note:</strong> Click "Download .ics" to add events to your calendar app (Google Calendar, Outlook, Apple Calendar, etc.)
        </p>
      </div>
    </div>
  );
}
