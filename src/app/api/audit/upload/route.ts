import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId, fileName, fileSize, fileContent } = await request.json();

    // Verify user belongs to the company
    if (session.user.companyId !== companyId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // For simplicity, we'll store the file content as a base64 string in the database
    // In production, you'd want to upload to S3/CloudFlare R2/etc.
    const fileUrl = `data:text/plain;base64,${Buffer.from(fileContent).toString('base64')}`;

    // Extract summary from first 500 characters
    const auditSummary = fileContent.substring(0, 500);

    // Upsert the audit (create or update)
    const audit = await prisma.codebaseAudit.upsert({
      where: { companyId },
      create: {
        companyId,
        fileName,
        fileSize,
        fileUrl,
        auditSummary,
        uploadedBy: session.user.name || session.user.email,
      },
      update: {
        fileName,
        fileSize,
        fileUrl,
        auditSummary,
        uploadedBy: session.user.name || session.user.email,
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
