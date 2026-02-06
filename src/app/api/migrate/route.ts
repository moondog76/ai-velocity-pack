import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Run Prisma db push
    const { stdout, stderr } = await execAsync('./node_modules/.bin/prisma db push --skip-generate', {
      cwd: process.cwd(),
    });

    return NextResponse.json({
      message: 'Migration completed successfully',
      stdout,
      stderr
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({
      error: 'Failed to run migration',
      details: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    }, { status: 500 });
  }
}
