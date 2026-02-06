# AI Velocity Pack Platform

Portfolio management platform for Asort Ventures' AI Velocity Pack program.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: react-hook-form + zod validation
- **Charts**: recharts
- **Deployment**: Railway

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or pnpm

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update with your database URL
4. Run migrations: `npm run db:push`
5. Seed database: `npm run db:seed`
6. Start dev server: `npm run dev`

### Default Credentials

- **Admin**: `admin@asort.vc` / `asort2026`
- **Company**: `alex@greenroute.com` / `password123`

## Database Commands

- `npm run db:push` - Push schema changes
- `npm run db:seed` - Seed demo data
- `npm run db:studio` - Open Prisma Studio

## Deployment

Deploy to Railway with PostgreSQL addon. Set `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET`.
