export const governanceItems = {
  sectionA: {
    title: 'Section A: Data Privacy & Handling',
    items: [
      'No customer data in AI prompts',
      'Data retention < 30 days',
      'DPA with AI vendor',
    ],
  },
  sectionB: {
    title: 'Section B: Secrets & Credentials',
    items: [
      'No secrets in prompts',
      'AI tools excluded from secrets access',
      'Secret rotation post-exposure',
    ],
  },
  sectionC: {
    title: 'Section C: Access Control & Audit',
    items: [
      'RBAC enforced',
      'AI tools respect permissions',
      'Code review required',
      'Audit logs enabled',
    ],
  },
  sectionD: {
    title: 'Section D: Deployment & Testing',
    items: [
      'PR previews deployed',
      'Automated testing',
      'Rollback capability',
    ],
  },
};
