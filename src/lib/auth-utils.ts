import { auth } from './auth';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  // TEMPORARY: Auth bypass for testing - REMOVE IN PRODUCTION
  return {
    id: 'temp-admin-id',
    email: 'admin@asort.vc',
    name: 'Asort Admin',
    role: 'ADMIN',
    companyId: null,
  };

  // Original auth code (commented out temporarily):
  // const session = await auth();
  // return session?.user || null;
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
