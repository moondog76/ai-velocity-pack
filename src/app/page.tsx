import { redirect } from 'next/navigation';

export default async function HomePage() {
  // TEMPORARY: Direct redirect to dashboard (auth bypass)
  redirect('/dashboard');
}
