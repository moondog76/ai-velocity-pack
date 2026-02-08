import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.score.deleteMany();
  await prisma.governanceChecklist.deleteMany();
  await prisma.sprintReport.deleteMany();
  await prisma.baseline.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.programSettings.deleteMany();

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('luminar2026', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@luminarventures.com',
      name: 'Luminar Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create program settings
  const programSettings = await prisma.programSettings.create({
    data: {
      id: 'default',
      programName: 'AI Velocity Pack',
      dayZero: new Date('2026-02-06'),
      baselineDue: new Date('2026-02-09'),
      sprintDue: new Date('2026-02-20'),
    },
  });
  console.log('Created program settings');

  // Create announcement
  await prisma.announcement.create({
    data: {
      message: 'Welcome to the AI Velocity Pack program! Baseline deliverables are due February 9.',
      active: true,
    },
  });
  console.log('Created announcement');

  const userPasswordHash = await bcrypt.hash('password123', 10);

  // 1. NovaPay - Fintech, Python/Django, baseline submitted, sprint in draft
  const novapay = await prisma.company.create({
    data: {
      name: 'NovaPay',
      website: 'https://novapay.io',
      primaryLanguage: 'Python',
      framework: 'Django',
      enrolledAt: new Date('2026-02-01'),
      users: {
        create: [
          {
            email: 'sarah@novapay.io',
            name: 'Sarah Chen',
            passwordHash: userPasswordHash,
            role: 'COMPANY_USER',
          },
        ],
      },
      baseline: {
        create: {
          status: 'SUBMITTED',
          submittedAt: new Date('2026-02-08'),
          data: {
            repoContext: {
              primaryRepos: 'github.com/novapay/payment-api, github.com/novapay/mobile-app',
              language: 'Python',
              framework: 'Django REST Framework',
              buildCommand: 'docker build -t novapay .',
              testCommand: 'pytest tests/',
              ciSystem: 'GitHub Actions',
              deployCadence: 'Daily to staging, weekly to production',
            },
            baselineMetrics: {
              medianPRCycleTime: '12 hours',
              medianReviewIterations: 2,
              ciFailureRate: 8,
              flakyTests: true,
              flakyTestsNotes: 'Payment webhook tests occasionally timeout',
              deployFrequency: '5-7 deploys per week',
              rollbacksIncidents: 1,
            },
            microRun1: {
              targetArea: 'Payment processing validation',
              outputDescription: 'Added currency conversion edge case handling',
              humanTimeMinutes: 45,
              result: 'PR_MERGED',
              notes: 'Claude identified missing validation for zero-amount transactions',
            },
            microRun2: {
              targetArea: 'API error responses',
              outputDescription: 'Standardized error response format across endpoints',
              humanTimeMinutes: 30,
              result: 'PR_CREATED',
              notes: 'Awaiting security team review',
            },
            blockers: {
              tooling: 'Limited Claude Code access due to security policy - only senior engineers approved',
              policy: 'All AI-generated code must be reviewed by security team before merge',
              codebase: 'Legacy payment processing code lacks test coverage',
            },
            sprintItem: {
              description: 'Implement recurring payment subscription management',
              rationale: 'Well-scoped feature with clear acceptance criteria. Safe because it\'s a new feature addition with no changes to existing payment flows.',
            },
          },
        },
      },
      sprintReport: {
        create: {
          status: 'DRAFT',
          data: {
            sprintInfo: {
              startDate: '2026-02-10',
              endDate: '2026-02-17',
              engineersInvolved: 2,
            },
            scope: {
              featureDescription: 'Recurring payment subscription management - partial implementation',
              filesTouched: 'subscriptions/models.py, subscriptions/views.py, subscriptions/serializers.py',
              risk: 'MEDIUM',
              riskRationale: 'New feature but touches payment processing logic',
            },
          },
        },
      },
    },
  });
  console.log('Created NovaPay');

  // 2. GreenRoute - Logistics, TypeScript/Next.js, all 3 submitted & graded (14/18)
  const greenroute = await prisma.company.create({
    data: {
      name: 'GreenRoute',
      website: 'https://greenroute.com',
      primaryLanguage: 'TypeScript',
      framework: 'Next.js',
      enrolledAt: new Date('2026-02-01'),
      users: {
        create: [
          {
            email: 'alex@greenroute.com',
            name: 'Alex Rodriguez',
            passwordHash: userPasswordHash,
            role: 'COMPANY_USER',
          },
          {
            email: 'maya@greenroute.com',
            name: 'Maya Patel',
            passwordHash: userPasswordHash,
            role: 'COMPANY_USER',
          },
        ],
      },
      baseline: {
        create: {
          status: 'GRADED',
          submittedAt: new Date('2026-02-07'),
          data: {
            repoContext: {
              primaryRepos: 'github.com/greenroute/platform',
              language: 'TypeScript',
              framework: 'Next.js 14, Prisma, tRPC',
              buildCommand: 'pnpm build',
              testCommand: 'pnpm test',
              ciSystem: 'Vercel CI',
              deployCadence: 'Continuous deployment to preview, manual to production',
            },
            baselineMetrics: {
              medianPRCycleTime: '4 hours',
              medianReviewIterations: 1,
              ciFailureRate: 5,
              flakyTests: false,
              flakyTestsNotes: '',
              deployFrequency: '10-15 deploys per week',
              rollbacksIncidents: 0,
            },
            microRun1: {
              targetArea: 'Route optimization algorithm',
              outputDescription: 'Improved distance calculation for multi-stop routes',
              humanTimeMinutes: 60,
              result: 'PR_MERGED',
              notes: 'Claude suggested using Haversine formula, reduced calculation time by 40%',
            },
            microRun2: {
              targetArea: 'Dashboard data fetching',
              outputDescription: 'Implemented parallel data loading with React Server Components',
              humanTimeMinutes: 40,
              result: 'PR_MERGED',
              notes: 'Reduced initial load time from 3.2s to 1.1s',
            },
            blockers: {
              tooling: 'None - team is using Claude Code extensively',
              policy: 'Minimal restrictions, trust-based approach',
              codebase: 'Some legacy REST endpoints need migration to tRPC',
            },
            sprintItem: {
              description: 'Real-time driver location tracking with WebSocket updates',
              rationale: 'High-value feature for customers. Safe because it\'s a new isolated service with well-defined interfaces.',
            },
          },
        },
      },
      sprintReport: {
        create: {
          status: 'GRADED',
          submittedAt: new Date('2026-02-18'),
          data: {
            sprintInfo: {
              startDate: '2026-02-10',
              endDate: '2026-02-18',
              engineersInvolved: 2,
            },
            scope: {
              featureDescription: 'Real-time driver location tracking with WebSocket server and React UI',
              filesTouched: 'apps/api/src/websocket/, apps/web/src/components/DriverMap/, libs/shared/types/',
              risk: 'LOW',
              riskRationale: 'New service with isolated deployment, does not affect existing features',
            },
            agenticEvidence: {
              toolsUsed: 'Claude Code, Cursor',
              commandsRun: 'claude "implement WebSocket server with Socket.io", "create real-time map component"',
              prLink: 'https://github.com/greenroute/platform/pull/234',
              ciRunLink: 'https://vercel.com/greenroute/platform/deployments/abc123',
            },
            deltas: {
              engineerTime: 180,
              calendarTime: '8 hours',
              reviewIterations: 1,
              ciFailures: 0,
              testsUpdated: true,
              testsNotes: 'Added integration tests for WebSocket connections and 15 unit tests',
              docsUpdated: true,
              docsNotes: 'Updated API documentation with WebSocket protocol specification',
              postMergeIssues: '',
            },
            improvements: [
              { item: 'PR cycle time reduced from 4h to 2h with AI-generated tests' },
              { item: 'Zero review iterations due to comprehensive implementation' },
              { item: 'Documentation generated automatically by Claude' },
            ],
            degradations: [],
            decision: {
              nextStep: 'EXPAND',
              nextUseCases: ['Implement predictive ETA calculations', 'Add automated route re-optimization'],
              policyToolingChanges: 'Create template prompts for WebSocket features',
            },
          },
        },
      },
      governanceChecklist: {
        create: {
          status: 'GRADED',
          submittedAt: new Date('2026-02-19'),
          data: {
            sectionA: [
              { item: 'No customer data in AI prompts', status: 'YES', notes: 'Strict data sanitization policy enforced' },
              { item: 'Data retention < 30 days', status: 'YES', notes: 'Using local Claude Code only' },
              { item: 'DPA with AI vendor', status: 'NA', notes: 'Not using cloud AI services' },
            ],
            sectionB: [
              { item: 'No secrets in prompts', status: 'YES', notes: 'Pre-commit hooks check for secrets' },
              { item: 'AI tools excluded from secrets access', status: 'YES', notes: '.env files in .gitignore and .claud eignore' },
              { item: 'Secret rotation post-exposure', status: 'YES', notes: 'Automated rotation via Vault' },
            ],
            sectionC: [
              { item: 'RBAC enforced', status: 'YES', notes: 'Role-based access via GitHub teams' },
              { item: 'AI tools respect permissions', status: 'YES', notes: 'Claude Code uses developer\'s SSH keys' },
              { item: 'Code review required', status: 'YES', notes: 'All PRs require approval from tech lead' },
              { item: 'Audit logs enabled', status: 'YES', notes: 'GitHub audit log + custom logging' },
            ],
            sectionD: [
              { item: 'PR previews deployed', status: 'YES', notes: 'Vercel preview deployments for all PRs' },
              { item: 'Automated testing', status: 'YES', notes: 'Unit, integration, E2E tests in CI' },
              { item: 'Rollback capability', status: 'YES', notes: 'One-click rollback via Vercel' },
            ],
            sectionE: {
              operationalOwners: 'Alex Rodriguez (CTO), Maya Patel (Lead Engineer)',
              incidentProcess: true,
              dataMap: true,
            },
          },
        },
      },
      scores: {
        create: {
          agenticEvidence: 3,
          cycleTimeImprovement: 3,
          reviewEfficiency: 2,
          qualityReliability: 2,
          governanceReadiness: 2,
          repeatability: 2,
          totalScore: 14,
          notes: 'Excellent adoption and clear velocity gains. Further improvements needed in quality metrics and repeatability processes.',
          gradedAt: new Date('2026-02-19'),
        },
      },
    },
  });
  console.log('Created GreenRoute with score');

  // 3. MediTrack - Healthtech, Go/React, baseline only
  const meditrack = await prisma.company.create({
    data: {
      name: 'MediTrack',
      website: 'https://meditrack.health',
      primaryLanguage: 'Go',
      framework: 'React',
      enrolledAt: new Date('2026-02-02'),
      users: {
        create: [
          {
            email: 'jordan@meditrack.health',
            name: 'Jordan Kim',
            passwordHash: userPasswordHash,
            role: 'COMPANY_USER',
          },
        ],
      },
      baseline: {
        create: {
          status: 'SUBMITTED',
          submittedAt: new Date('2026-02-09'),
          data: {
            repoContext: {
              primaryRepos: 'github.com/meditrack/backend, github.com/meditrack/web',
              language: 'Go, TypeScript',
              framework: 'Go 1.21, React 18, PostgreSQL',
              buildCommand: 'make build',
              testCommand: 'make test',
              ciSystem: 'CircleCI',
              deployCadence: 'Weekly releases',
            },
            baselineMetrics: {
              medianPRCycleTime: '48 hours',
              medianReviewIterations: 4,
              ciFailureRate: 15,
              flakyTests: true,
              flakyTestsNotes: 'Database integration tests fail intermittently',
              deployFrequency: '1-2 deploys per week',
              rollbacksIncidents: 3,
            },
            microRun1: {
              targetArea: 'Patient data export',
              outputDescription: 'Added FHIR-compliant export endpoint',
              humanTimeMinutes: 90,
              result: 'PR_CREATED',
              notes: 'Compliance review pending',
            },
            microRun2: {
              targetArea: 'Appointment scheduling logic',
              outputDescription: 'Fixed timezone handling bug',
              humanTimeMinutes: 25,
              result: 'PR_MERGED',
              notes: 'Claude identified edge case we missed',
            },
            blockers: {
              tooling: 'Claude Code access restricted to senior engineers only due to HIPAA concerns',
              policy: 'Healthcare compliance requires extensive review process, slows AI adoption',
              codebase: 'Monolithic architecture makes isolated testing difficult',
            },
            sprintItem: {
              description: 'Automated appointment reminder system',
              rationale: 'Clear requirements, isolated from PHI data. Safe because reminders use anonymized references only.',
            },
          },
        },
      },
    },
  });
  console.log('Created MediTrack');

  // 4. BuildOS - Construction, Ruby on Rails, nothing submitted
  const buildos = await prisma.company.create({
    data: {
      name: 'BuildOS',
      website: 'https://buildos.io',
      primaryLanguage: 'Ruby',
      framework: 'Ruby on Rails',
      enrolledAt: new Date('2026-02-03'),
      users: {
        create: [
          {
            email: 'tom@buildos.io',
            name: 'Tom Harrison',
            passwordHash: userPasswordHash,
            role: 'COMPANY_USER',
          },
        ],
      },
    },
  });
  console.log('Created BuildOS');

  // 5. DataForge - Data infra, Rust/Python, baseline + governance submitted
  const dataforge = await prisma.company.create({
    data: {
      name: 'DataForge',
      website: 'https://dataforge.dev',
      primaryLanguage: 'Rust',
      framework: 'Python',
      enrolledAt: new Date('2026-02-01'),
      users: {
        create: [
          {
            email: 'priya@dataforge.dev',
            name: 'Priya Sharma',
            passwordHash: userPasswordHash,
            role: 'COMPANY_USER',
          },
        ],
      },
      baseline: {
        create: {
          status: 'SUBMITTED',
          submittedAt: new Date('2026-02-08'),
          data: {
            repoContext: {
              primaryRepos: 'github.com/dataforge/engine, github.com/dataforge/sdk',
              language: 'Rust, Python',
              framework: 'Actix Web, FastAPI',
              buildCommand: 'cargo build --release && poetry build',
              testCommand: 'cargo test && pytest',
              ciSystem: 'GitLab CI',
              deployCadence: 'Continuous deployment',
            },
            baselineMetrics: {
              medianPRCycleTime: '6 hours',
              medianReviewIterations: 2,
              ciFailureRate: 10,
              flakyTests: false,
              flakyTestsNotes: '',
              deployFrequency: '20+ deploys per week',
              rollbacksIncidents: 1,
            },
            microRun1: {
              targetArea: 'Query optimizer',
              outputDescription: 'Implemented cost-based query plan selection',
              humanTimeMinutes: 120,
              result: 'PR_MERGED',
              notes: 'Complex algorithm, Claude helped with edge cases',
            },
            microRun2: {
              targetArea: 'Python SDK error handling',
              outputDescription: 'Added retry logic with exponential backoff',
              humanTimeMinutes: 35,
              result: 'PR_MERGED',
              notes: 'Generated comprehensive test cases',
            },
            blockers: {
              tooling: 'Rust support in AI tools is improving but still limited',
              policy: 'No major policy blockers',
              codebase: 'Performance-critical code requires careful manual review',
            },
            sprintItem: {
              description: 'Streaming query results with async iterators',
              rationale: 'Well-defined API surface. Safe because it\'s backward-compatible and doesn\'t change existing query execution.',
            },
          },
        },
      },
      governanceChecklist: {
        create: {
          status: 'SUBMITTED',
          submittedAt: new Date('2026-02-18'),
          data: {
            sectionA: [
              { item: 'No customer data in AI prompts', status: 'YES', notes: 'Using synthetic data for examples' },
              { item: 'Data retention < 30 days', status: 'YES', notes: '' },
              { item: 'DPA with AI vendor', status: 'YES', notes: 'Using Anthropic with DPA signed' },
            ],
            sectionB: [
              { item: 'No secrets in prompts', status: 'YES', notes: 'Automated scanning in place' },
              { item: 'AI tools excluded from secrets access', status: 'YES', notes: '' },
              { item: 'Secret rotation post-exposure', status: 'YES', notes: 'Policy documented' },
            ],
            sectionC: [
              { item: 'RBAC enforced', status: 'YES', notes: '' },
              { item: 'AI tools respect permissions', status: 'YES', notes: '' },
              { item: 'Code review required', status: 'YES', notes: 'At least one approval required' },
              { item: 'Audit logs enabled', status: 'YES', notes: 'GitLab audit events' },
            ],
            sectionD: [
              { item: 'PR previews deployed', status: 'YES', notes: 'Ephemeral environments via K8s' },
              { item: 'Automated testing', status: 'YES', notes: 'Comprehensive test suite' },
              { item: 'Rollback capability', status: 'YES', notes: 'Blue-green deployment' },
            ],
            sectionE: {
              operationalOwners: 'Priya Sharma (CTO)',
              incidentProcess: true,
              dataMap: false,
            },
          },
        },
      },
    },
  });
  console.log('Created DataForge');

  console.log('Seed completed successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin: admin@luminarventures.com / luminar2026');
  console.log('Companies: sarah@novapay.io, alex@greenroute.com, etc. / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
