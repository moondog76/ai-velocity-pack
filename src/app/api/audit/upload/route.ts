import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    let companyId = formData.get('companyId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // For admin users without a companyId, resolve one from the database
    if (!companyId && user.role === 'ADMIN') {
      const firstCompany = await prisma.company.findFirst({ select: { id: true } });
      companyId = firstCompany?.id ?? null;
    }

    if (!companyId) {
      return NextResponse.json({ error: 'No company associated with this account' }, { status: 400 });
    }

    // Verify user belongs to the company
    if (user.companyId !== companyId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const fileName = file.name;
    const fileSize = file.size;

    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Store as base64 data URL
    const mimeType = fileName.endsWith('.pdf') ? 'application/pdf' : 'text/plain';
    const fileUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

    // Extract summary from text content (first 500 chars for text files)
    let auditSummary = '';
    if (!fileName.endsWith('.pdf')) {
      const textContent = buffer.toString('utf-8');
      auditSummary = textContent.substring(0, 500);
    } else {
      auditSummary = `PDF audit report: ${fileName}`;
    }

    // Upsert the audit (create or update)
    const audit = await prisma.codebaseAudit.upsert({
      where: { companyId },
      create: {
        companyId,
        fileName,
        fileSize,
        fileUrl,
        auditSummary,
        uploadedBy: user.name || user.email,
      },
      update: {
        fileName,
        fileSize,
        fileUrl,
        auditSummary,
        uploadedBy: user.name || user.email,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, audit });
  } catch (error: any) {
    console.error('Audit upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload audit' },
      { status: 500 }
    );
  }
}
