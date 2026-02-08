export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startISO: string;
  endISO: string;
  type: 'WEBINAR' | 'TRAINING' | 'OFFICE_HOURS' | 'DEADLINE';
  icsContent: string;
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: 'executive-webinar',
    title: 'Executive Webinar',
    description: 'Introduction to AI Velocity Pack program for CEOs and CTOs',
    startISO: '2026-02-10T10:00:00+01:00',
    endISO: '2026-02-10T11:00:00+01:00',
    type: 'WEBINAR',
    icsContent: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Luminar Ventures//AI Velocity Pack//EN
BEGIN:VEVENT
UID:executive-webinar-2026@luminarventures.com
DTSTAMP:20260201T120000Z
DTSTART:20260210T090000Z
DTEND:20260210T100000Z
SUMMARY:AI Velocity Pack - Executive Webinar
DESCRIPTION:Introduction to the AI Velocity Pack program for CEOs and CTOs. Learn about the program structure\\, deliverables\\, and success criteria.
LOCATION:https://meet.luminarventures.com/executive-webinar
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: Executive Webinar starts in 15 minutes
END:VALARM
END:VEVENT
END:VCALENDAR`
  },
  {
    id: 'training-1',
    title: 'Training 1: Workflow Shift',
    description: 'Hands-on training on shifting from manual coding to agentic workflows',
    startISO: '2026-02-12T13:00:00+01:00',
    endISO: '2026-02-12T14:15:00+01:00',
    type: 'TRAINING',
    icsContent: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Luminar Ventures//AI Velocity Pack//EN
BEGIN:VEVENT
UID:training-1-2026@luminarventures.com
DTSTAMP:20260201T120000Z
DTSTART:20260212T120000Z
DTEND:20260212T131500Z
SUMMARY:AI Velocity Pack - Training 1: Workflow Shift
DESCRIPTION:Hands-on training on shifting from manual coding to agentic workflows. Learn prompt patterns and best practices.
LOCATION:https://meet.luminarventures.com/training-1
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: Training 1 starts in 15 minutes
END:VALARM
END:VEVENT
END:VCALENDAR`
  },
  {
    id: 'training-2',
    title: 'Training 2: Roadmap + QA Shift',
    description: 'Training on using AI for roadmap planning and automated QA',
    startISO: '2026-02-17T13:00:00+01:00',
    endISO: '2026-02-17T14:15:00+01:00',
    type: 'TRAINING',
    icsContent: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Luminar Ventures//AI Velocity Pack//EN
BEGIN:VEVENT
UID:training-2-2026@luminarventures.com
DTSTAMP:20260201T120000Z
DTSTART:20260217T120000Z
DTEND:20260217T131500Z
SUMMARY:AI Velocity Pack - Training 2: Roadmap + QA Shift
DESCRIPTION:Training on using AI for roadmap planning and automated QA. Learn to leverage AI for test generation and quality assurance.
LOCATION:https://meet.luminarventures.com/training-2
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: Training 2 starts in 15 minutes
END:VALARM
END:VEVENT
END:VCALENDAR`
  },
  {
    id: 'training-3',
    title: 'Training 3: Customer Feedback Loop',
    description: 'Training on closing the loop from customer feedback to shipped features',
    startISO: '2026-02-19T13:00:00+01:00',
    endISO: '2026-02-19T14:15:00+01:00',
    type: 'TRAINING',
    icsContent: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Luminar Ventures//AI Velocity Pack//EN
BEGIN:VEVENT
UID:training-3-2026@luminarventures.com
DTSTAMP:20260201T120000Z
DTSTART:20260219T120000Z
DTEND:20260219T131500Z
SUMMARY:AI Velocity Pack - Training 3: Customer Feedback Loop
DESCRIPTION:Training on closing the loop from customer feedback to shipped features using agentic AI workflows.
LOCATION:https://meet.luminarventures.com/training-3
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: Training 3 starts in 15 minutes
END:VALARM
END:VEVENT
END:VCALENDAR`
  }
];
