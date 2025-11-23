export async function getProfile(req, res) {
  // Mock user stats; integrate real auth later
  res.json({
    user: {
      id: 'usr_demo_001',
      name: 'Demo User',
      role: 'Legal Analyst',
      plan: 'Enterprise Trial'
    },
    stats: {
      contractsAnalyzed: 128,
      highRiskFindings: 34,
      anomaliesFlagged: 12,
      clausesClassified: 560,
      lastAnalysisAt: new Date().toISOString(),
      languagesUsed: ['English','Hindi','Spanish']
    }
  })
}
