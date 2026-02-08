import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

const SCORING_SYSTEM_PROMPT = `You are an AI scoring assistant for Asort Ventures' AI Velocity Pack program. You evaluate portfolio companies' submissions against a standardized rubric.

## Scoring Rubric (0–3 per dimension)

### 1. Agentic Evidence (Use of AI coding tools with clear logs/artifacts)
- 0: No evidence of AI tool usage
- 1: Minimal usage — occasional AI suggestions accepted, no systematic workflow
- 2: Regular usage — AI tools integrated into daily workflow, logs show consistent interaction
- 3: Advanced — agentic workflows (Claude Code, Cursor agents) running autonomously, clear before/after artifacts

### 2. Cycle Time Improvement (PR cycle time reduction vs baseline)
- 0: No measurable improvement or no data provided
- 1: Minor improvement (<15% reduction in PR cycle time)
- 2: Moderate improvement (15–35% reduction)
- 3: Significant improvement (>35% reduction with supporting data)

### 3. Review Efficiency (Fewer review iterations, cleaner PRs)
- 0: No improvement in review process
- 1: Slight reduction in review rounds
- 2: Measurable improvement — fewer iterations, better PR descriptions, AI-assisted reviews
- 3: Systematic improvement — AI pre-reviews, automated quality checks, consistently clean first submissions

### 4. Quality & Reliability (Test coverage, CI pass rate, post-merge issues)
- 0: No quality metrics provided or no improvement
- 1: Basic test coverage exists but no improvement
- 2: Improved coverage and CI stability, some AI-generated tests
- 3: Comprehensive — high coverage, AI-generated test suites, reduced post-merge incidents

### 5. Governance Readiness (Security, compliance, audit trail completeness)
- 0: No governance measures in place
- 1: Basic awareness but incomplete implementation
- 2: Documented policies, some automated checks, partial audit trail
- 3: Complete — security scanning, compliance checks, full audit trail, documented AI usage policies

### 6. Repeatability (Documented processes, templates, team adoption)
- 0: No documentation or process standardization
- 1: Some informal practices shared within team
- 2: Documented workflows, templates created, partial team adoption
- 3: Fully documented playbook, templates for all workflows, team-wide adoption, onboarding materials

## Instructions
- Score each dimension based on the evidence in the submissions
- Cite specific evidence from the submissions for each score
- If evidence is insufficient for a dimension, score conservatively and mark confidence as "low"
- A score of 0 means NO evidence. Don't give 0 if there's any indication of effort.
- Be fair but rigorous. Most companies in a 14-day sprint will score 1–2 on average.

## Output Format
Respond ONLY with valid JSON matching this exact schema:
{
  "dimensions": [
    {
      "name": "Agentic Evidence",
      "score": 0,
      "confidence": "high|medium|low",
      "rationale": "Detailed explanation of why this score was given",
      "evidence": ["Specific quote or reference from submission"]
    }
  ],
  "overallSummary": "2-3 sentence summary of the company's AI adoption progress",
  "recommendations": ["Specific actionable recommendation 1", "Recommendation 2"]
}`;

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = await request.json();
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Check rate limit (max 3 per company per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const analysesCount = await prisma.aiAnalysis.count({
      where: {
        companyId,
        analyzedAt: { gte: today },
      },
    });

    const settings = await prisma.programSettings.findUnique({ where: { id: 'default' } });
    const maxPerDay = settings?.maxAnalysesPerDay ?? 3;

    if (analysesCount >= maxPerDay) {
      return NextResponse.json({
        success: false,
        error: `Maximum ${maxPerDay} analyses per company per day reached. Try again tomorrow.`,
      }, { status: 429 });
    }

    // Fetch all submissions
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        baseline: true,
        sprintReport: true,
        governanceChecklist: true,
        codebaseAudit: { select: { fileName: true, auditSummary: true, submittedAt: true } },
      },
    });

    if (!company) {
      return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 });
    }

    const hasSubmissions = company.baseline || company.sprintReport || company.governanceChecklist || company.codebaseAudit;
    if (!hasSubmissions) {
      return NextResponse.json({
        success: false,
        error: 'No submissions found. Submit at least one deliverable before running AI analysis.',
      }, { status: 400 });
    }

    // Build submission content for the prompt
    const submissionParts: string[] = [];
    submissionParts.push(`Company: ${company.name}`);
    submissionParts.push(`Language/Framework: ${company.primaryLanguage || 'Not specified'} / ${company.framework || 'Not specified'}`);

    if (company.baseline) {
      submissionParts.push(`\n--- BASELINE SUBMISSION (Status: ${company.baseline.status}) ---`);
      submissionParts.push(JSON.stringify(company.baseline.data, null, 2));
    }
    if (company.sprintReport) {
      submissionParts.push(`\n--- SPRINT REPORT (Status: ${company.sprintReport.status}) ---`);
      submissionParts.push(JSON.stringify(company.sprintReport.data, null, 2));
    }
    if (company.governanceChecklist) {
      submissionParts.push(`\n--- GOVERNANCE CHECKLIST (Status: ${company.governanceChecklist.status}) ---`);
      submissionParts.push(JSON.stringify(company.governanceChecklist.data, null, 2));
    }
    if (company.codebaseAudit) {
      submissionParts.push(`\n--- CODEBASE AUDIT (File: ${company.codebaseAudit.fileName}) ---`);
      submissionParts.push(company.codebaseAudit.auditSummary || 'No summary available');
    }

    const submissionContent = submissionParts.join('\n');

    // Call Opper API (OpenAI-compatible endpoint)
    const apiKey = process.env.OPPER_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'AI analysis temporarily unavailable. OPPER_KEY not configured.',
      }, { status: 503 });
    }

    // Ensure model name has provider prefix (old DB values may lack it)
    let aiModel = settings?.aiModel || 'anthropic/claude-sonnet-4-5-20250929';
    if (!aiModel.includes('/')) {
      aiModel = `anthropic/${aiModel}`;
    }

    let aiResult: any;
    let lastError = '';

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[AI Analysis] Attempt ${attempt + 1} for ${company.name} | model: ${aiModel} | key: ${apiKey.substring(0, 8)}...`);

        const response = await fetch('https://api.opper.ai/compat/openai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer -',
            'x-opper-api-key': apiKey,
          },
          body: JSON.stringify({
            model: aiModel,
            messages: [
              { role: 'system', content: SCORING_SYSTEM_PROMPT },
              { role: 'user', content: `Please analyze the following company submissions and provide scores:\n\n${submissionContent}` },
            ],
            max_tokens: 4096,
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          lastError = `Opper API ${response.status}: ${errText.substring(0, 200)}`;
          console.error('[AI Analysis] API error:', lastError);
          throw new Error(lastError);
        }

        const data = await response.json();
        console.log('[AI Analysis] Response received, parsing...');

        const content = data.choices?.[0]?.message?.content || '';
        if (!content) {
          lastError = 'Empty response from AI model';
          throw new Error(lastError);
        }

        // Strip markdown code fences if present
        const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        aiResult = JSON.parse(cleaned);
        break;
      } catch (err: any) {
        lastError = err.message || 'Unknown error';
        console.error(`[AI Analysis] Attempt ${attempt + 1} failed:`, lastError);
        if (attempt >= 1) {
          return NextResponse.json({
            success: false,
            error: `AI analysis failed: ${lastError}`,
          }, { status: 503 });
        }
      }
    }

    // Store the analysis
    const analysis = await prisma.aiAnalysis.create({
      data: {
        companyId,
        aiScores: aiResult,
        analyzedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: analysis.id,
        ...aiResult,
        analyzedAt: analysis.analyzedAt,
      },
    });
  } catch (error: any) {
    console.error('[AI Analysis] Unhandled error:', error);
    return NextResponse.json({
      success: false,
      error: `AI analysis error: ${error.message || 'Unknown error'}`,
    }, { status: 500 });
  }
}
