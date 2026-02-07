import { requireAuth } from '@/lib/auth-utils';
import { ExternalLink, Quote, Zap, GitBranch, Shield, Users, Brain, Workflow } from 'lucide-react';

export const dynamic = 'force-dynamic';

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Zap;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Icon className="h-4 w-4 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function QuoteBlock({
  quote,
  author,
  role,
  source,
  sourceUrl,
}: {
  quote: string;
  author: string;
  role: string;
  source?: string;
  sourceUrl?: string;
}) {
  return (
    <div className="bg-slate-50 border-l-4 border-indigo-400 rounded-r-lg p-4 my-4">
      <div className="flex gap-2">
        <Quote className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-slate-700 italic">{quote}</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xs font-medium text-slate-900">{author}</p>
            <span className="text-xs text-slate-400">|</span>
            <p className="text-xs text-slate-500">{role}</p>
            {source && sourceUrl && (
              <>
                <span className="text-xs text-slate-400">|</span>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  {source} <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PracticeItem({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 py-3">
      <div className="h-6 w-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

export default async function BestPracticesPage() {
  await requireAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Best Practices</h1>
        <p className="text-sm text-slate-600 mt-1">
          How top engineering teams are adopting agentic coding to ship faster and build better products
        </p>
      </div>

      <div className="space-y-6">

        {/* ── Industry Context ── */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-indigo-900 mb-2">The Shift Is Happening Now</h2>
          <p className="text-sm text-indigo-800 mb-3">
            Engineers are shifting from writing code to coordinating agents that write code, focusing their expertise on
            architecture, system design, and strategic decisions. Roughly 85% of developers now regularly use AI tools,
            and the most effective teams treat agentic workflows as core infrastructure rather than optional add-ons.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/70 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-indigo-700">55%</p>
              <p className="text-xs text-slate-600">faster development with AI coding tools (GitHub)</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-indigo-700">30-50%</p>
              <p className="text-xs text-slate-600">productivity increase on routine tasks (Gartner)</p>
            </div>
            <div className="bg-white/70 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-indigo-700">80%</p>
              <p className="text-xs text-slate-600">of top-1000 eng orgs using Cursor (Anysphere)</p>
            </div>
          </div>
        </div>

        {/* ── What Top Companies Are Doing ── */}
        <SectionCard icon={Users} title="What Top Companies Are Doing">
          <div className="space-y-1">

            <h3 className="text-sm font-bold text-slate-800 mt-2">Shopify &mdash; &ldquo;AI is non-optional&rdquo;</h3>
            <p className="text-sm text-slate-600">
              CEO Tobi L&uuml;tke issued an internal memo making AI usage a baseline expectation across the entire company.
              Managers requesting new headcount must prove the job can&apos;t be done by AI first. AI competency is now part
              of performance reviews and hiring decisions. They rolled out 3,000 Cursor licenses, with the fastest-growing
              adoption groups being non-engineering teams like support and revenue.
            </p>
            <QuoteBlock
              quote="Reflexive AI usage is now a baseline expectation at Shopify. Before asking for more headcount and resources, teams must demonstrate why AI cannot accomplish the task."
              author="Tobi L&uuml;tke"
              role="CEO, Shopify"
              source="X/Twitter"
              sourceUrl="https://x.com/tobi/status/1909251946235437514"
            />

            <h3 className="text-sm font-bold text-slate-800 mt-4">Anthropic &mdash; Engineering with Claude Code</h3>
            <p className="text-sm text-slate-600">
              Anthropic&apos;s own engineering teams use Claude Code for everything from debugging production incidents to building
              internal tools. Their Security Engineering team cut infrastructure debugging time in half (from 10-15 minutes
              to 5 minutes). New hires use it to navigate massive codebases, reducing onboarding research time by 80%.
              Non-technical teams (Legal, Growth Marketing) are building production tools without traditional engineering support.
            </p>
            <QuoteBlock
              quote="Claude Code reliably handles roughly 70% of the implementation work, leaving humans to handle architecture, edge cases, and quality judgment. The most successful teams treat it as a thought partner, not a code generator."
              author="Anthropic Engineering"
              role="Internal practices report"
              source="anthropic.com"
              sourceUrl="https://www.anthropic.com/news/how-anthropic-teams-use-claude-code"
            />

            <h3 className="text-sm font-bold text-slate-800 mt-4">Stripe &mdash; Platform-level AI infrastructure</h3>
            <p className="text-sm text-slate-600">
              Stripe built &ldquo;Toolshed,&rdquo; a centralized MCP server wired into Slack, Drive, Git, and their data catalog.
              Agents can both retrieve information and take actions across their entire stack. Their internal text-to-SQL
              assistant (&ldquo;Hubert&rdquo;) is used by ~900 people per week. A small, 24-person &ldquo;Experimental Projects
              Team&rdquo; of senior engineers tackles cross-company AI opportunities. AI agents completed routine refactoring
              requests 68% faster than human engineers in internal experiments.
            </p>
            <QuoteBlock
              quote="Stripe built a centralized MCP server called Toolshed, wired into Slack, Drive, Git, and their data catalog, so agents can both retrieve and act across the entire stack."
              author="Emily Glassberg Sands"
              role="Head of Data & AI, Stripe"
              source="Latent Space"
              sourceUrl="https://www.latent.space/p/stripe"
            />

            <h3 className="text-sm font-bold text-slate-800 mt-4">Cursor (Anysphere) &mdash; From IDE to agent platform</h3>
            <p className="text-sm text-slate-600">
              The fastest-growing AI startup to hit $300M ARR. Founded by four MIT grads who pivoted from mechanical engineering
              CAD tools to software development after identifying the limitations of existing AI coding assistants.
              Now works with two-thirds of the Fortune 1000. Their philosophy: the best AI coding tools
              need custom models tailored to specific tasks, not just foundation model wrappers.
            </p>
            <QuoteBlock
              quote="The goal with the company is to replace coding with something that's much better. The thing that attracted us to coding is that you get to build things really quickly. We want to make that even faster."
              author="Michael Truell"
              role="CEO, Cursor / Anysphere"
              source="Lenny's Newsletter"
              sourceUrl="https://www.lennysnewsletter.com/p/the-rise-of-cursor-michael-truell"
            />

            <h3 className="text-sm font-bold text-slate-800 mt-4">Vercel &mdash; Anyone can ship</h3>
            <p className="text-sm text-slate-600">
              CEO Guillermo Rauch uses v0 as his primary development tool. Vercel created the Agent Skills
              system &mdash; structured, version-controlled packages of domain expertise that AI agents can ingest,
              moving beyond &ldquo;vibe coding&rdquo; into deterministic AI guidance. Non-technical team members
              contribute production-ready code through AI-assisted Git workflows.
            </p>
            <QuoteBlock
              quote="I myself as a coder have not used the more traditional coding tools in a while. I'm obsessed about time from idea to online, and v0 fits that bill perfectly."
              author="Guillermo Rauch"
              role="CEO, Vercel"
              source="Sequoia Podcast"
              sourceUrl="https://sequoiacap.com/podcast/training-data-guillermo-rauch/"
            />

            <h3 className="text-sm font-bold text-slate-800 mt-4">Meta &mdash; AI as default engineering workflow</h3>
            <p className="text-sm text-slate-600">
              Meta revamped their coding interviews to include AI assistants by default, reflecting how their engineers
              work internally every day. Candidates are evaluated on how effectively they think, prompt, and collaborate
              with AI while maintaining sound engineering judgment &mdash; not how fast they can code alone.
            </p>
            <QuoteBlock
              quote="AI has fundamentally changed the way software is developed. Our modernized AI-enabled interview is a better representation of our work and of our mission."
              author="Meta Engineering"
              role="Interview format announcement"
            />

            <h3 className="text-sm font-bold text-slate-800 mt-4">Real-world results at scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-500">TELUS</p>
                <p className="text-sm font-semibold text-slate-900">13,000+ custom AI solutions</p>
                <p className="text-xs text-slate-600">30% faster engineering, 500K+ hours saved</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-500">Zapier</p>
                <p className="text-sm font-semibold text-slate-900">89% company-wide AI adoption</p>
                <p className="text-xs text-slate-600">800+ agents deployed internally</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-500">Rakuten</p>
                <p className="text-sm font-semibold text-slate-900">12.5M-line codebase task</p>
                <p className="text-xs text-slate-600">Claude Code completed in 7 hours, 99.9% accuracy</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Suggested Workflows ── */}
        <SectionCard icon={Workflow} title="Suggested Workflows for Engineering Teams">
          <div className="divide-y divide-slate-100">
            <PracticeItem
              number={1}
              title="Create CLAUDE.md / AI_GUIDELINES.md files"
              description="Document your codebase conventions, architecture decisions, and coding standards in a file agents can ingest. Teams that invested in this saw the biggest quality improvements. Include your build commands, test conventions, naming patterns, and common pitfalls. This is the single highest-leverage thing you can do."
            />
            <PracticeItem
              number={2}
              title="Start with test-driven agent workflows"
              description="Instead of asking AI to generate code and hoping it works, write tests first (or have the agent write them), then let the agent implement until tests pass. Anthropic's Security Engineering team transformed their workflow to: pseudocode → test-driven development with Claude → periodic check-ins. This produces more reliable, testable code."
            />
            <PracticeItem
              number={3}
              title="Use git worktrees for parallel agent tasks"
              description="Run multiple agent sessions on isolated branches using git worktrees. Each agent works on a separate feature or fix without stepping on each other. Merge back into main when done. This mirrors how you'd coordinate a team of junior engineers — give each one a clear, scoped task with their own workspace."
            />
            <PracticeItem
              number={4}
              title="Integrate agents into CI/CD pipelines"
              description="Use @claude mentions in GitHub PRs for automated code review. Set up agents for issue triage, translation, and test generation in CI. As your PR volume increases with AI-assisted development, automated review catches logic errors and security issues that manual review might miss."
            />
            <PracticeItem
              number={5}
              title="Adopt the 70/30 rule"
              description="Let agents handle ~70% of implementation work (boilerplate, standard patterns, test scaffolding, documentation). Focus your engineering time on the 30% that requires judgment: architecture decisions, edge cases, security review, and system design. The goal is to amplify senior engineers, not replace them."
            />
            <PracticeItem
              number={6}
              title="Debug with agents, not just code with them"
              description="Feed stack traces, error logs, and dashboard screenshots directly to your agent. Anthropic's Data Infra team used Claude Code to diagnose a Kubernetes pod scheduling issue by feeding it screenshots — it guided them step-by-step to the root cause (pod IP address exhaustion) and provided the exact fix commands."
            />
          </div>
        </SectionCard>

        {/* ── Product Team Workflows ── */}
        <SectionCard icon={Brain} title="Suggested Workflows for Product Teams">
          <div className="divide-y divide-slate-100">
            <PracticeItem
              number={1}
              title="Prototype in AI, refine with engineering"
              description="Use AI coding tools to build working prototypes in hours instead of weeks. Validate product ideas with real, interactive demos before investing engineering cycles. Vercel's CEO builds and pitches product ideas entirely in v0 before handing off to engineering."
            />
            <PracticeItem
              number={2}
              title="Empower non-technical contributors"
              description="Product managers, designers, and even legal teams can use AI agents to build internal tools and automate workflows. Anthropic's Growth Marketing team generates hundreds of ad variations in minutes. Their Legal team built accessibility tools without engineering support. Lower the bar for who can ship."
            />
            <PracticeItem
              number={3}
              title="Replace PRDs with working code"
              description="Instead of writing lengthy product requirement documents, create a working prototype that demonstrates the feature. As Vercel's CPO Tom Occhino says: 'Teams end up collaborating on the product, not on PRDs and stuff.' A running prototype communicates intent better than any document."
            />
            <PracticeItem
              number={4}
              title="Use AI for data analysis and decision-making"
              description="Build text-to-SQL assistants for product analytics (Stripe's internal 'Hubert' tool is used by 900 people per week). Let product managers query data directly with natural language instead of waiting for analyst bandwidth. Faster data access means faster product decisions."
            />
          </div>
        </SectionCard>

        {/* ── Workflow Changes ── */}
        <SectionCard icon={GitBranch} title="How to Update Your Development Process">
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-amber-900 mb-2">Before (Traditional)</h4>
              <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                <li>Product writes PRD and hands to engineering</li>
                <li>Engineer designs solution and writes code manually</li>
                <li>Manual testing and iteration</li>
                <li>Code review by peers</li>
                <li>Ship after extensive QA cycle</li>
              </ol>
            </div>
            <div className="flex justify-center">
              <div className="h-8 w-px bg-slate-300" />
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-emerald-900 mb-2">After (AI-Augmented)</h4>
              <ol className="text-sm text-emerald-800 space-y-1 list-decimal list-inside">
                <li>Product builds a working prototype with AI in hours</li>
                <li>Engineer reviews prototype, sets architecture and guardrails</li>
                <li>Agent implements with TDD — write tests, iterate until passing</li>
                <li>Automated AI code review + human review for architecture</li>
                <li>Ship with higher confidence, faster iteration cycles</li>
              </ol>
            </div>
          </div>
        </SectionCard>

        {/* ── Security & Governance ── */}
        <SectionCard icon={Shield} title="Security & Governance Considerations">
          <p className="text-sm text-slate-600 mb-3">
            Shipping faster with AI means you need stronger guardrails. According to Verizon&apos;s 2025 Data Breach
            Investigations Report, there&apos;s been a 34% increase in vulnerability exploitation, correlating with
            teams shipping AI-generated code faster than they can validate it.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">Never put secrets in prompts</p>
                <p className="text-xs text-slate-600">Use pre-commit hooks to scan for secrets. Keep .env files in .gitignore and agent ignore files.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">Define explicit permission boundaries</p>
                <p className="text-xs text-slate-600">Claude Code&apos;s permission model is programmable safety. Define what agents can and can&apos;t do upfront — it increases productivity by removing ambiguity.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">Keep humans in the loop for sensitive code</p>
                <p className="text-xs text-slate-600">Authentication, payment processing, and data access control should always have human review. AI amplifies engineer judgment but doesn&apos;t replace it.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-2 w-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">Audit and rotate credentials proactively</p>
                <p className="text-xs text-slate-600">With more code being generated faster, the risk of accidental credential exposure increases. Automate rotation and maintain audit logs.</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Key Takeaway ── */}
        <div className="bg-slate-900 text-white rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2">The Bottom Line</h2>
          <p className="text-sm text-slate-300">
            The organizations pulling ahead aren&apos;t removing engineers from the loop — they&apos;re making engineer
            expertise count where it matters most. Developers aren&apos;t being replaced; they&apos;re being amplified.
            The skills that matter are shifting toward architecture, system design, prompt engineering, and quality judgment.
            The teams that treat agentic workflows as platform infrastructure — with clear guardrails, reusable patterns,
            and org-wide feedback loops — are the ones seeing step-function gains in velocity.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400">
              Sources: Anthropic Engineering Blog, Shopify CEO Memo (April 2025), Stripe Latent Space Interview,
              Cursor/Anysphere (Lenny&apos;s Newsletter), Vercel (Sequoia Podcast), Meta Engineering,
              GitHub Developer Survey, Gartner AI Productivity Report, Verizon 2025 DBIR
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
