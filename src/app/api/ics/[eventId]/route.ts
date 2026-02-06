import { calendarEvents } from '@/data/ics-events';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = calendarEvents.find((e) => e.id === eventId);

  if (!event) {
    return new Response('Event not found', { status: 404 });
  }

  return new Response(event.icsContent, {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="${eventId}.ics"`,
    },
  });
}
