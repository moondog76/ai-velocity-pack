import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, name, role, companyId } = await request.json();
    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-10);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: role || 'COMPANY_USER',
        companyId: companyId || null,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      tempPassword,
    });
  } catch (error: any) {
    console.error('User create error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, role, companyId, name } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role !== undefined && { role }),
        ...(companyId !== undefined && { companyId }),
        ...(name !== undefined && { name }),
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error('User update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}
