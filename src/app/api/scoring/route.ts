import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      companyId,
      agenticEvidence,
      cycleTimeImprovement,
      reviewEfficiency,
      qualityReliability,
      governanceReadiness,
      repeatability,
      notes,
    } = await request.json();

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const totalScore =
      agenticEvidence + cycleTimeImprovement + reviewEfficiency +
      qualityReliability + governanceReadiness + repeatability;

    const score = await prisma.score.upsert({
      where: { companyId },
      create: {
        companyId,
        agenticEvidence,
        cycleTimeImprovement,
        reviewEfficiency,
        qualityReliability,
        governanceReadiness,
        repeatability,
        totalScore,
        notes: notes || null,
        gradedAt: new Date(),
      },
      update: {
        agenticEvidence,
        cycleTimeImprovement,
        reviewEfficiency,
        qualityReliability,
        governanceReadiness,
        repeatability,
        totalScore,
        notes: notes || null,
        gradedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, score });
  } catch (error: any) {
    console.error('Scoring error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save scores' },
      { status: 500 }
    );
  }
}
