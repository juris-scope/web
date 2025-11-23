import { useState, useEffect } from 'react'
import FeatureCard from '../components/FeatureCard'
import FileUploadZone from '../components/FileUploadZone'
import SkeletonBlock from '../components/SkeletonBlock'
import RiskGaugeChart from '../components/charts/RiskGaugeChart'
import AnomalyAreaChart from '../components/charts/AnomalyAreaChart'
import ClauseBreakdownChart from '../components/charts/ClauseBreakdownChart'
import RiskDistributionBar from '../components/charts/RiskDistributionBar'
import RiskAnomalyScatter from '../components/charts/RiskAnomalyScatter'
import ContractScoreGauge from '../components/charts/ContractScoreGauge'
import AdditionalStatsPanel from '../components/AdditionalStatsPanel'
import AnalysisResultsTable from '../components/AnalysisResultsTable'
// Direct backend calls (no api util) will use fetch to Node backend
import { exportCsv, exportPdf, printAnalysis } from '../utils/export'

// --- Icons ---
function IconBar() {return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 20V10m6 10V4m6 16v-6" stroke="#FF851B" strokeWidth="2"/></svg>)}
function IconWarn() {return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86l-8.48 14.7A1 1 0 0 0 2.62 21h18.76a1 1 0 0 0 .86-1.5l-8.48-14.7a1 1 0 0 0-1.74 0z" stroke="#001F3F" strokeWidth="2"/></svg>)}
function IconGlobe() {return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0s4 3 4 9-4 9-4 9-4-3-4-9 4-9 4-9z" stroke="#001F3F" strokeWidth="2"/></svg>)}
function IconCheck() {return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6l-11 11-5-5" stroke="#001F3F" strokeWidth="2"/></svg>)}

export default function Explore() {
  const [language, setLanguage] = useState('English')
  const [uploadResult, setUploadResult] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('full') // full | risk | anomaly | clause

  // --- Helper: Transform Python Backend Data for React Charts ---
  const transformData = (backendData) => {
    if (!backendData) return null
    const clauses = backendData.clauses || []

    // Normalize clause keys from Python backend (riskBand, anomalyScore, textSnippet)
    const normalizedClauses = clauses.map(c => ({
      ...c,
      risk_band: c.riskBand || c.risk_band,
      anomaly_score: c.anomalyScore || c.anomaly_score,
      text: c.textSnippet || c.text || ''
    }))

    const riskCounts = { 'High Risk': 0, 'Moderate Risk': 0, 'Low Risk': 0 }
    normalizedClauses.forEach(c => {
      if (riskCounts[c.risk_band] !== undefined) riskCounts[c.risk_band]++
    })

    const anomalySeries = normalizedClauses.map((c, i) => ({
      name: `Clause ${i + 1}`,
      value: c.anomaly_score,
      text: (c.text || '').substring(0, 30) + '...'
    }))

    // Build summary object compatible with existing UI expectations
    const summary = {
      composite_score: backendData.compositeScore || backendData.summary?.composite_score || 0,
      contract_risk_score: backendData.riskSummary?.contractRiskScore || backendData.summary?.contract_risk_score || 0,
      dispute_likelihood: backendData.riskSummary?.disputeLikelihood || backendData.summary?.dispute_likelihood || 0,
      structural_completeness: backendData.summary?.structural_completeness || 0.5,
      compliance_score: backendData.summary?.compliance_score ?? (1 - (backendData.riskSummary?.contractRiskScore || 0))
    }

    return {
      ...backendData,
      clauses: normalizedClauses,
      riskCategories: riskCounts,
      anomalySeries,
      compositeScore: summary.composite_score,
      contractRiskScore: summary.contract_risk_score,
      summary
    }
  }

  async function fetchAnalysis(currentMode) {
    // Prevent fetching if no text is uploaded yet
    if (!uploadResult?.text) return;

    setLoadingAnalysis(true)
    setError('')
    
    try {
      // Map UI mode to backend endpoint (Node proxies to Python)
      let path
      switch (currentMode) {
        case 'risk': path = '/api/analyze/risk'; break
        case 'anomaly': path = '/api/analyze/anomaly'; break
        case 'clause': path = '/api/analyze/clause'; break
        case 'full':
        default: path = '/analyze'; break
      }

      const resp = await fetch(`http://localhost:3000${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: uploadResult.text, language })
      })
      if (!resp.ok) throw new Error(`Backend error ${resp.status}`)
      const data = await resp.json()
      const processedData = transformData(data)
      setAnalysis(processedData)

    } catch (e) {
      console.error(e)
      setError('Failed to analyze contract. Ensure the backend is running.')
    } finally {
      setLoadingAnalysis(false)
    }
  }

  // Trigger analysis automatically when a file is successfully processed
  useEffect(() => {
    if (uploadResult) {
      fetchAnalysis(mode)
    }
  }, [uploadResult]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold" style={{color:'#001F3F'}}>AI-Powered Contract Analysis</h1>
        <p className="text-gray-600 mt-2">Upload your contract and let our AI analyze it across multiple dimensions</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <FeatureCard
          title="Full Analysis"
          subtitle="Combined Multi-Dimensional Insights"
          icon={<IconCheck/>}
          selectable
          selected={mode==='full'}
          onClick={()=>{ setMode('full'); }}
        />
        <FeatureCard
          title="Risk Assessment"
          subtitle="Automated Risk Scoring"
          icon={<IconWarn/>}
          selectable
          selected={mode==='risk'}
          onClick={()=>{ setMode('risk'); }}
        />
        <FeatureCard
          title="Anomaly Detection"
          subtitle="Outlier & Pattern Deviation"
          icon={<IconGlobe/>}
          selectable
          selected={mode==='anomaly'}
          onClick={()=>{ setMode('anomaly'); }}
        />
        <FeatureCard
          title="Clause Classification"
          subtitle="Clause Extraction & Entity Recognition"
          icon={<IconBar/>}
          selectable
          selected={mode==='clause'}
          onClick={()=>{ setMode('clause'); }}
        />
      </section>

      <section className="card p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <div className="text-sm text-gray-700 font-medium">Language</div>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange">
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">Supported formats: PDF, DOCX, TXT (Max 10MB)</div>
        </div>

        {/* File Upload Zone - Updates 'uploadResult' state on success */}
        <FileUploadZone language={language} onUploaded={(r)=> setUploadResult(r)} />

        {loadingAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card p-4"><SkeletonBlock lines={6} /></div>
            <div className="card p-4"><SkeletonBlock lines={6} /></div>
            <div className="card p-4"><SkeletonBlock lines={6} /></div>
          </div>
        )}

        {error && <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

        {analysis && !loadingAnalysis && (
          <div className="space-y-6 print:space-y-4">
            
            {/* --- FULL MODE --- */}
            {mode==='full' && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <RiskGaugeChart data={analysis.riskCategories} />
                  <AnomalyAreaChart data={analysis.anomalySeries} />
                  <ClauseBreakdownChart clauses={analysis.clauses} />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <RiskDistributionBar data={analysis.riskCategories} />
                  <RiskAnomalyScatter clauses={analysis.clauses} />
                  <ContractScoreGauge score={analysis.compositeScore} />
                </div>
              </>
            )}

            {/* --- RISK MODE --- */}
            {mode==='risk' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <RiskGaugeChart data={analysis.riskCategories} />
                <RiskDistributionBar data={analysis.riskCategories} />
                <ContractScoreGauge score={analysis.contractRiskScore} title="Contract Risk" />
              </div>
            )}

            {/* --- ANOMALY MODE --- */}
            {mode==='anomaly' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <AnomalyAreaChart data={analysis.anomalySeries} />
                <ContractScoreGauge score={analysis.summary?.structural_completeness || 0.5} title="Structural Score" />
              </div>
            )}

            {/* --- CLAUSE MODE --- */}
            {mode==='clause' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <ClauseBreakdownChart clauses={analysis.clauses} />
                <RiskAnomalyScatter clauses={analysis.clauses} />
                <ContractScoreGauge score={analysis.summary?.compliance_score || 0.5} title="Compliance Score" />
              </div>
            )}

            <AdditionalStatsPanel analysis={analysis} />
            
            <div className="flex gap-3 flex-wrap">
              <button onClick={()=>exportCsv(analysis)} className="btn-secondary">Export CSV</button>
              <button onClick={()=>exportPdf(analysis)} className="btn-secondary">Export PDF</button>
              <button onClick={printAnalysis} className="btn-secondary">Print View</button>
            </div>

            {analysis.clauses && <AnalysisResultsTable clauses={analysis.clauses} />}
          </div>
        )}
      </section>
    </div>
  )
}