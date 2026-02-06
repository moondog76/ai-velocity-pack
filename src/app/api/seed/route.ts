import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST() {
  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({ message: 'Database already seeded' }, { status: 400 });
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('asort2026', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@asort.vc',
        name: 'Asort Admin',
        passwordHash: adminPassword,
        role: 'ADMIN',
      },
    });

    // Create companies with users
    const companies = [
      {
        name: 'GreenRoute Logistics',
        email: 'alex@greenroute.com',
        userName: 'Alex Chen',
        password: 'password123',
      },
      {
        name: 'HealthTech AI',
        email: 'sarah@healthtechai.com',
        userName: 'Sarah Johnson',
        password: 'password123',
      },
      {
        name: 'EduLearn Platform',
        email: 'michael@edulearn.com',
        userName: 'Michael Roberts',
        password: 'password123',
      },
      {
        name: 'FinanceIQ',
        email: 'priya@financeiq.com',
        userName: 'Priya Patel',
        password: 'password123',
      },
      {
        name: 'SmartHome Solutions',
        email: 'david@smarthomesol.com',
        userName: 'David Kim',
        password: 'password123',
      },
    ];

    for (const companyData of companies) {
      const hashedPassword = await bcrypt.hash(companyData.password, 10);

      const company = await prisma.company.create({
        data: {
          name: companyData.name,
        },
      });

      await prisma.user.create({
        data: {
          email: companyData.email,
          name: companyData.userName,
          passwordHash: hashedPassword,
          role: 'COMPANY_USER',
          companyId: company.id,
        },
      });
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      users: companies.length + 1,
      companies: companies.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
