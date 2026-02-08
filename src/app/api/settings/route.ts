import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const settings = await prisma.programSettings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        programName: data.programName || 'AI Velocity Pack',
        dayZero: new Date(data.dayZero),
        baselineDue: new Date(data.baselineDue),
        sprintDue: new Date(data.sprintDue),
        aiModel: data.aiModel || 'anthropic/claude-sonnet-4.5',
        autoAnalyze: data.autoAnalyze ?? false,
        maxAnalysesPerDay: data.maxAnalysesPerDay ?? 3,
        requireAiBeforeManual: data.requireAiBeforeManual ?? false,
        notifyWelcome: data.notifyWelcome ?? true,
        notify48h: data.notify48h ?? true,
        notify24h: data.notify24h ?? true,
        notifySubmission: data.notifySubmission ?? true,
        notifyScore: data.notifyScore ?? true,
      },
      update: {
        ...(data.programName !== undefined && { programName: data.programName }),
        ...(data.dayZero !== undefined && { dayZero: new Date(data.dayZero) }),
        ...(data.baselineDue !== undefined && { baselineDue: new Date(data.baselineDue) }),
        ...(data.sprintDue !== undefined && { sprintDue: new Date(data.sprintDue) }),
        ...(data.aiModel !== undefined && { aiModel: data.aiModel }),
        ...(data.autoAnalyze !== undefined && { autoAnalyze: data.autoAnalyze }),
        ...(data.maxAnalysesPerDay !== undefined && { maxAnalysesPerDay: data.maxAnalysesPerDay }),
        ...(data.requireAiBeforeManual !== undefined && { requireAiBeforeManual: data.requireAiBeforeManual }),
        ...(data.notifyWelcome !== undefined && { notifyWelcome: data.notifyWelcome }),
        ...(data.notify48h !== undefined && { notify48h: data.notify48h }),
        ...(data.notify24h !== undefined && { notify24h: data.notify24h }),
        ...(data.notifySubmission !== undefined && { notifySubmission: data.notifySubmission }),
        ...(data.notifyScore !== undefined && { notifyScore: data.notifyScore }),
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
