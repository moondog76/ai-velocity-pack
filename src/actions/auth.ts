'use server';

import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/schemas/auth';
import bcrypt from 'bcrypt';
import type { ServerActionResult } from '@/types';

export async function register(
  data: unknown
): Promise<ServerActionResult<{ email: string }>> {
  try {
    const validated = registerSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validated.password, 10);

    // Create company and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: validated.companyName,
          website: validated.website || null,
          primaryLanguage: validated.primaryLanguage,
          framework: validated.framework,
        },
      });

      const user = await tx.user.create({
        data: {
          name: validated.name,
          email: validated.email,
          passwordHash,
          role: 'COMPANY_USER',
          companyId: company.id,
        },
      });

      return user;
    });

    return {
      success: true,
      data: { email: result.email },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Failed to create account. Please try again.',
    };
  }
}
