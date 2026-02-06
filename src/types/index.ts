import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    companyId: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    companyId: string | null;
  }
}

export type ServerActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
