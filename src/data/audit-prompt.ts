export const codebaseAuditPrompt = `# Codebase Analysis & AI Readiness Audit

Please analyze this codebase and provide a comprehensive report covering the following dimensions:

## 1. Codebase Structure & Organization
- Project structure and architecture patterns
- Module organization and separation of concerns
- Code organization quality (1-10 rating)

## 2. Code Quality Metrics
- Code complexity and maintainability
- Test coverage estimates
- Documentation quality
- Technical debt hotspots

## 3. AI Tool Readiness
- How well-suited is this codebase for AI coding assistants?
- Existing patterns that AI can easily extend
- Areas where AI might struggle (unclear patterns, poor naming, etc.)
- Recommended refactoring for better AI collaboration

## 4. Language & Framework Analysis
- Primary languages and versions
- Frameworks and their versions
- Dependency health and update status
- Potential compatibility issues

## 5. Development Workflow
- Build and test automation
- CI/CD pipeline maturity
- Development environment setup complexity
- Onboarding friction for new developers (or AI agents)

## 6. Security & Governance
- Security best practices adherence
- Secrets management approach
- Access control patterns
- Compliance considerations

## 7. Recommendations
- Top 3 areas for immediate improvement
- Quick wins for AI-assisted development
- Long-term architectural suggestions
- Estimated effort for AI tool integration

## Output Format
Provide the analysis in markdown format with clear sections, ratings, and actionable recommendations. Include specific file/directory examples where relevant.`;

export const auditInstructions = `## How to Run the Audit

### Using Claude Code (Recommended):
1. Open your terminal in the root of your codebase
2. Run: \`claude code --prompt "$(cat audit-prompt.txt)"\`
3. Let Claude analyze your entire codebase
4. Save the output as a markdown file

### Using Cursor or GitHub Copilot:
1. Open your codebase in the editor
2. Copy the audit prompt below
3. Paste it into the AI chat
4. Ask it to analyze the workspace
5. Export or copy the response to a markdown file

### Upload Instructions:
- Save the audit report as a .md, .txt, or .pdf file
- File size limit: 10MB
- The audit will be visible to Luminar team for review
- You can update your audit at any time before the baseline deadline`;
