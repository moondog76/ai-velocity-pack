import { calendarEvents } from '@/data/ics-events';

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const event = calendarEvents.find((e) => e.id === params.eventId);

  if (!event) {
    return new Response('Event not found', { status: 404 });
  }

  return new Response(event.icsContent, {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="${params.eventId}.ics"`,
    },
  });
}
