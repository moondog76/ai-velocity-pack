import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';
import { baselineSchema } from '@/schemas/deliverables';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const companyId = request.nextUrl.searchParams.get('companyId') || user.companyId;
  if (!companyId) return NextResponse.json({ error: 'No company associated' }, { status: 400 });
  if (user.companyId !== companyId && user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const baseline = await prisma.baseline.findUnique({ where: { companyId } });
  return NextResponse.json({ success: true, data: baseline });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { companyId: reqCompanyId, data, submit } = body;
  const companyId = reqCompanyId || user.companyId;

  if (!companyId) return NextResponse.json({ error: 'No company associated' }, { status: 400 });
  if (user.companyId !== companyId && user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Check if already submitted
  const existing = await prisma.baseline.findUnique({ where: { companyId } });
  if (existing && (existing.status === 'SUBMITTED' || existing.status === 'GRADED')) {
    return NextResponse.json({ error: 'Baseline already submitted and cannot be modified' }, { status: 400 });
  }

  // Only validate strictly on submit
  if (submit) {
    const validation = baselineSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        errors: validation.error.flatten(),
      }, { status: 400 });
    }
  }

  const baseline = await prisma.baseline.upsert({
    where: { companyId },
    create: {
      companyId,
      data: data || {},
      status: submit ? 'SUBMITTED' : 'DRAFT',
      submittedAt: submit ? new Date() : null,
    },
    update: {
      data: data || {},
      status: submit ? 'SUBMITTED' : 'DRAFT',
      ...(submit && { submittedAt: new Date() }),
    },
  });

  return NextResponse.json({ success: true, data: baseline });
}
