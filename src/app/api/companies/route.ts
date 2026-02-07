import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, contactEmail, primaryLanguage, framework, teamSize, githubUrl } = await request.json();
    if (!name || !contactEmail) {
      return NextResponse.json({ error: 'Name and contact email are required' }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: { name, contactEmail, primaryLanguage, framework, teamSize: teamSize ? parseInt(teamSize) : null, githubUrl },
    });

    return NextResponse.json({ success: true, company });
  } catch (error: any) {
    console.error('Company create error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create company' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, contactEmail, primaryLanguage, framework, teamSize, githubUrl, active } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(primaryLanguage !== undefined && { primaryLanguage }),
        ...(framework !== undefined && { framework }),
        ...(teamSize !== undefined && { teamSize: teamSize ? parseInt(teamSize) : null }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({ success: true, company });
  } catch (error: any) {
    console.error('Company update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update company' }, { status: 500 });
  }
}
