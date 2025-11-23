export async function getAnalytics(req, res) {
  // Placeholder values; replace with DB aggregation later
  res.json({
    totalContracts: 128,
    riskAssessments: 64,
    recentActivity: [
      'Analyzed NDA for ACME Corp',
      'Risk assessment completed for MSA',
      'Uploaded vendor agreement'
    ]
  })
}
