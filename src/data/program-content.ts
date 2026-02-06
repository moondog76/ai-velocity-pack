export const programOverview = {
  purpose: `The AI Velocity Pack is a 14-day program designed to measure and accelerate software delivery velocity using agentic AI tools. Portfolio companies integrate AI coding assistants into their workflows and submit structured evidence of improved cycle times, code quality, and governance readiness.`,
  timeline: `Day 0-3: Baseline measurement and micro-runs. Day 3-14: Sprint execution with AI tools. Day 14: Final submissions and scoring.`,
  agenticCriteria: [
    'AI generates multi-file changes spanning multiple concerns',
    'AI handles ambiguous requirements and proposes solutions',
    'AI executes multi-step workflows (research, code, test, document)',
    'Human acts as reviewer/director, not line-by-line author'
  ],
  exclusions: [
    'Simple autocomplete or code suggestions',
    'Copy-paste from AI chat without integration',
    'AI-generated boilerplate only',
    'Tools that require manual file-by-file editing'
  ]
};

export const ctoMemo = `# CEO/CTO Memo: AI Velocity Pack Program

## Purpose

This 14-day program measures how agentic AI coding tools improve your team's delivery velocity, code quality, and governance posture. You'll submit three deliverables:

1. **Baseline Report** (Day 3): Current metrics and micro-runs
2. **Sprint Report** (Day 14): Evidence of velocity gains
3. **Governance Checklist** (Day 14): Security and compliance readiness

## What to Expect

- **Webinar** (Feb 10): Executive overview and expectations
- **Training Sessions** (Feb 12, 17, 19): Hands-on workshops
- **Office Hours** (Wednesdays & Fridays): Support from Asort team
- **Scoring** (Post-Day 14): Assessment across 6 dimensions

## Success Criteria

We're looking for evidence of:
- Reduced PR cycle times
- Fewer review iterations
- Higher test coverage
- Better documentation
- Governance compliance

## Key Dates

- **Feb 9**: Baseline due
- **Feb 20**: Sprint Report & Governance due

Questions? Email velocity@asort.vc or join office hours.

---
**Asort Ventures** | Accelerating AI-powered software teams`;

export const webinarSlides = [
  {
    slideNumber: 1,
    title: 'Welcome to AI Velocity Pack',
    bullets: [
      'Introduction to the 14-day program',
      'Goals and expected outcomes',
      'Timeline and key dates'
    ]
  },
  {
    slideNumber: 2,
    title: 'What is "Agentic" AI?',
    bullets: [
      'Multi-file, multi-concern code generation',
      'Autonomous workflow execution',
      'Human as reviewer, not author',
      'Examples: Claude Code, Cursor, Copilot Workspace'
    ]
  },
  {
    slideNumber: 3,
    title: 'Program Structure',
    bullets: [
      'Phase 1: Baseline measurement (Day 0-3)',
      'Phase 2: Sprint execution (Day 3-14)',
      'Phase 3: Reporting and scoring (Day 14+)'
    ]
  },
  {
    slideNumber: 4,
    title: 'Deliverable 1: Baseline Report',
    bullets: [
      'Current PR cycle times and review iterations',
      'Two micro-runs with agentic tools',
      'Identified blockers (tooling, policy, codebase)',
      'Selected sprint item for Phase 2'
    ]
  },
  {
    slideNumber: 5,
    title: 'Deliverable 2: Sprint Report',
    bullets: [
      'Evidence of agentic workflow (PR links, commands)',
      'Measured deltas (time, reviews, CI failures)',
      'Improvements and degradations',
      'Decision on next steps (expand, adjust, pause)'
    ]
  },
  {
    slideNumber: 6,
    title: 'Deliverable 3: Governance Checklist',
    bullets: [
      'Data handling compliance',
      'Secrets hygiene',
      'Access controls',
      'Change safety mechanisms'
    ]
  },
  {
    slideNumber: 7,
    title: 'Scoring Rubric',
    bullets: [
      '6 dimensions, 0-3 points each (max 18 points)',
      'Agentic Evidence, Cycle Time, Review Efficiency',
      'Quality/Reliability, Governance, Repeatability'
    ]
  },
  {
    slideNumber: 8,
    title: 'Support Resources',
    bullets: [
      'Training sessions: Feb 12, 17, 19',
      'Office hours: Wednesdays & Fridays 9:00 CET',
      'Email: velocity@asort.vc',
      'This portal for submissions and tracking'
    ]
  }
];

export const promptPatterns = [
  {
    name: 'Planning Prompt',
    description: 'Use this to have AI break down a feature into implementation steps',
    promptTemplate: `I need to implement [FEATURE DESCRIPTION].

Please:
1. Analyze the existing codebase structure
2. Identify all files that need changes
3. Propose a step-by-step implementation plan
4. Highlight potential edge cases or risks
5. Suggest tests to add

Context: [RELEVANT CODEBASE INFO]`
  },
  {
    name: 'Patch Prompt',
    description: 'Generate a targeted fix for a specific issue',
    promptTemplate: `There's a bug: [BUG DESCRIPTION]

Current behavior: [WHAT HAPPENS]
Expected behavior: [WHAT SHOULD HAPPEN]

Please:
1. Locate the source of the bug
2. Propose a minimal fix
3. Add tests to prevent regression
4. Update any affected documentation`
  },
  {
    name: 'Test Expansion Prompt',
    description: 'Generate comprehensive tests for existing code',
    promptTemplate: `The [COMPONENT/MODULE] needs better test coverage.

Current tests: [DESCRIBE EXISTING TESTS]

Please add tests for:
- Happy path scenarios
- Edge cases and error conditions
- Integration with dependencies
- Performance/load considerations

Use [TESTING FRAMEWORK] and follow our existing test patterns.`
  },
  {
    name: 'PR Review Prompt',
    description: 'Have AI review your PR before human review',
    promptTemplate: `Please review this PR: [PR LINK or DIFF]

Focus on:
- Code correctness and potential bugs
- Performance implications
- Security vulnerabilities
- Test coverage gaps
- Documentation completeness

Provide specific, actionable feedback.`
  }
];

export const runbook = [
  {
    step: '1. Setup',
    description: 'Install Claude Code or your chosen agentic tool. Configure repository access and environment.'
  },
  {
    step: '2. Select Task',
    description: 'Choose a well-scoped feature or bug fix from your backlog. Ensure it has clear acceptance criteria.'
  },
  {
    step: '3. Context Gathering',
    description: 'Use AI to analyze relevant code, understand dependencies, and identify potential risks.'
  },
  {
    step: '4. Implementation',
    description: 'Execute the task using agentic workflows. Let AI handle multi-file changes, tests, and documentation.'
  },
  {
    step: '5. Review & Iterate',
    description: 'Review AI-generated code. Request fixes or improvements. Iterate until ready for PR.'
  },
  {
    step: '6. Create PR',
    description: 'Submit PR with clear description. Link to AI conversation/logs for transparency.'
  },
  {
    step: '7. Measure',
    description: 'Track time saved, review iterations, CI failures, and overall quality vs baseline.'
  }
];

export const kpiRubric = [
  {
    dimension: 'Agentic Evidence',
    criteria0: 'No evidence or only autocomplete usage',
    criteria1: 'Single-file AI generations, manual assembly required',
    criteria2: 'Multi-file changes with human-in-loop for integration',
    criteria3: 'End-to-end autonomous workflows (code + tests + docs)'
  },
  {
    dimension: 'Cycle Time Improvement',
    criteria0: 'No improvement or degradation',
    criteria1: '10-25% reduction in PR cycle time',
    criteria2: '25-50% reduction in PR cycle time',
    criteria3: '>50% reduction in PR cycle time'
  },
  {
    dimension: 'Review Efficiency',
    criteria0: 'More review iterations than baseline',
    criteria1: 'Same as baseline',
    criteria2: 'Fewer iterations, cleaner first submission',
    criteria3: 'One-pass reviews, comprehensive first draft'
  },
  {
    dimension: 'Quality & Reliability',
    criteria0: 'Increased CI failures or post-merge defects',
    criteria1: 'Same quality as baseline',
    criteria2: 'Improved test coverage, fewer CI failures',
    criteria3: 'Measurably higher quality + zero post-merge issues'
  },
  {
    dimension: 'Governance Readiness',
    criteria0: 'Major compliance gaps or unaddressed risks',
    criteria1: 'Partial compliance, some gaps remain',
    criteria2: 'Mostly compliant, minor improvements needed',
    criteria3: 'Full compliance with data, secrets, access controls'
  },
  {
    dimension: 'Repeatability',
    criteria0: 'One-off experiment, no plan for scaling',
    criteria1: 'Documented learnings, unclear adoption path',
    criteria2: 'Clear next use cases, some process changes',
    criteria3: 'Systematic rollout plan with templates/prompts'
  }
];
