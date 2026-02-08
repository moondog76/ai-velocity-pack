import { auth } from './auth';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: session.user.id as string,
    email: session.user.email as string,
    name: session.user.name as string,
    role: (session.user as any).role as string,
    companyId: (session.user as any).companyId as string | null,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  return user;
}
