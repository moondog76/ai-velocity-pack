// NextAuth v5 type extensions
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

export type ServerActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
