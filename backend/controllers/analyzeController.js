import { generateClauseSuggestion } from '../services/gemini.js'

export async function analyzeClause(req, res) {
  const { language = 'English', text = '' } = req.body || {}
  // Mock clause classification list with anomalyScore + suggestion
  const baseClauses = [
    { id: 1, predictedType: 'Liability', textSnippet: 'Liability shall be unlimited...', riskBand: 'High', riskScore: 0.82, anomalyScore: 0.44 },
    { id: 2, predictedType: 'Termination', textSnippet: 'Either party may terminate...', riskBand: 'Moderate', riskScore: 0.41, anomalyScore: 0.31 },
    { id: 3, predictedType: 'Confidentiality', textSnippet: 'The parties agree to keep...', riskBand: 'Low', riskScore: 0.22, anomalyScore: 0.26 }
  ]
  const clauses = await enrichClausesWithGemini(baseClauses, language)
  const avgRisk = +(clauses.reduce((a,c)=>a+c.riskScore,0)/clauses.length).toFixed(3)
  res.json({ mode: 'clause-only', language, count: clauses.length, avgRisk, clauses })
}

export async function analyzeRisk(req, res) {
  const { language = 'English', text = '' } = req.body || {}
  const riskCategories = [
    { category: 'Uncapped Liability', score: 0.82, band: 'High' },
    { category: 'Indemnity', score: 0.67, band: 'Moderate' },
    { category: 'Termination for Convenience', score: 0.41, band: 'Moderate' },
    { category: 'Confidentiality', score: 0.28, band: 'Low' }
  ]
  const factor = language === 'English' ? 1 : 0.95
  const adjusted = riskCategories.map(r => ({ ...r, score: +(r.score * factor).toFixed(3) }))
  const contractRiskScore = +(adjusted.reduce((a,r)=>a+r.score,0)/adjusted.length/1).toFixed(3)
  const disputeLikelihood = +(1 - adjusted.reduce((prod,r)=>prod*(1-r.score*0.6),1)).toFixed(3)
  const compositeScore = +(0.5*contractRiskScore + 0.3*disputeLikelihood + 0.2*(1-contractRiskScore)).toFixed(3)
  res.json({ mode: 'risk-only', language, riskCategories: adjusted, contractRiskScore, disputeLikelihood, compositeScore })
}

export async function analyzeAnomaly(req, res) {
  const { language = 'English', text = '' } = req.body || {}
  const anomalySeries = Array.from({ length: 10 }, (_, i) => ({ index: i + 1, anomalyScore: +(0.18 + i * 0.04).toFixed(3) }))
  const avgAnomaly = +(anomalySeries.reduce((a,p)=>a+p.anomalyScore,0)/anomalySeries.length).toFixed(3)
  res.json({ mode: 'anomaly-only', language, anomalySeries, avgAnomaly })
}

// New combined mock analysis endpoint for frontend visualization
export async function analyzeMock(req, res) {
  const text = req.body?.text || 'Sample Contract Body'
  const language = req.body?.language || 'English'
  // Static mock data (deterministic) – replace later with real inference
  const riskCategories = [
    { category: 'Uncapped Liability', score: 0.82, band: 'High' },
    { category: 'Indemnity', score: 0.67, band: 'Moderate' },
    { category: 'Termination for Convenience', score: 0.41, band: 'Moderate' },
    { category: 'Confidentiality', score: 0.28, band: 'Low' },
    { category: 'Governing Law', score: 0.15, band: 'Low' }
  ]
  const anomalySeries = Array.from({ length: 12 }, (_, i) => ({ index: i + 1, anomalyScore: +(0.15 + (i * 0.035)).toFixed(3) }))
  const baseClauses = [
    { id: 1, textSnippet: 'The liability of the provider shall be unlimited...', predictedType: 'Liability', riskBand: 'High', riskScore: 0.82, anomalyScore: 0.42 },
    { id: 2, textSnippet: 'Each party agrees to indemnify and hold harmless...', predictedType: 'Indemnity', riskBand: 'Moderate', riskScore: 0.67, anomalyScore: 0.38 },
    { id: 3, textSnippet: 'Either party may terminate this agreement with 30 days notice...', predictedType: 'Termination', riskBand: 'Moderate', riskScore: 0.41, anomalyScore: 0.33 },
    { id: 4, textSnippet: 'The parties shall keep confidential information secret...', predictedType: 'Confidentiality', riskBand: 'Low', riskScore: 0.28, anomalyScore: 0.25 },
    { id: 5, textSnippet: 'This agreement is governed by the laws of New York...', predictedType: 'Governing Law', riskBand: 'Low', riskScore: 0.15, anomalyScore: 0.21 }
  ]
  const clauses = await enrichClausesWithGemini(baseClauses, language)
  const riskSummary = { contractRiskScore: 0.47, disputeLikelihood: 0.63 }
  const compositeScore = +(0.5*riskSummary.contractRiskScore + 0.3*riskSummary.disputeLikelihood + 0.2*(1-riskSummary.contractRiskScore)).toFixed(3)
  res.json({ mode: 'full', language, textLength: text.length, riskSummary, compositeScore, riskCategories, anomalySeries, clauses })
}

async function enrichClausesWithGemini(clauses, language){
  const enriched = []
  for (const c of clauses){
    const aiSuggestion = await generateClauseSuggestion({
      textSnippet: c.textSnippet,
      predictedType: c.predictedType,
      riskBand: c.riskBand,
      language
    })
    enriched.push({ ...c, suggestion: aiSuggestion || suggestionForClause(c) })
  }
  return enriched
}

function suggestionForClause(c){
  switch(c.riskBand){
    case 'High': return 'Introduce clear caps and exclusions to mitigate high exposure.'
    case 'Moderate': return 'Clarify scope and add conditional safeguards to reduce risk.'
    case 'Low': return 'Review wording for precision; otherwise acceptable.'
    default: return 'Consider refining clause for clarity.'
  }
}
