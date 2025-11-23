import { useState } from 'react'
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
import { api } from '../utils/api'
import { exportCsv, exportPdf, printAnalysis } from '../utils/export'

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

  async function fetchAnalysis(currentMode) {
    setLoadingAnalysis(true)
    setError('')
    try {
      let endpoint
      switch(currentMode){
        case 'risk': endpoint = '/api/analyze/risk'; break
        case 'anomaly': endpoint = '/api/analyze/anomaly'; break
        case 'clause': endpoint = '/api/analyze/clause'; break
        default: endpoint = '/api/analyze/mock'
      }
      const { data } = await api.post(endpoint, { text: 'placeholder contract body', language })
      setAnalysis(data)
    } catch (e) {
      setError('Failed to run analysis.')
    } finally {
      setLoadingAnalysis(false)
    }
  }

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
          onClick={()=>{ setMode('full'); if(uploadResult) fetchAnalysis('full') }}
        />
        <FeatureCard
          title="Risk Assessment"
          subtitle="Automated Risk Scoring"
          icon={<IconWarn/>}
          selectable
          selected={mode==='risk'}
          onClick={()=>{ setMode('risk'); if(uploadResult) fetchAnalysis('risk') }}
        />
        <FeatureCard
          title="Anomaly Detection"
          subtitle="Outlier & Pattern Deviation"
          icon={<IconGlobe/>}
          selectable
          selected={mode==='anomaly'}
          onClick={()=>{ setMode('anomaly'); if(uploadResult) fetchAnalysis('anomaly') }}
        />
        <FeatureCard
          title="Clause Classification"
          subtitle="Clause Extraction & Entity Recognition"
          icon={<IconBar/>}
          selectable
          selected={mode==='clause'}
          onClick={()=>{ setMode('clause'); if(uploadResult) fetchAnalysis('clause') }}
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
        {/* Mode buttons removed in favor of clickable feature cards */}
        <FileUploadZone language={language} onUploaded={(r)=>{ setUploadResult(r); fetchAnalysis(mode) }} />
        {/* Upload JSON intentionally hidden per request */}
        {loadingAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card p-4"><SkeletonBlock lines={6} /></div>
            <div className="card p-4"><SkeletonBlock lines={6} /></div>
            <div className="card p-4"><SkeletonBlock lines={6} /></div>
          </div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {analysis && !loadingAnalysis && (
          <div className="space-y-6 print:space-y-4">
            {mode==='full' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <RiskGaugeChart data={analysis.riskCategories} />
                <AnomalyAreaChart data={analysis.anomalySeries} />
                <ClauseBreakdownChart clauses={analysis.clauses} />
              </div>
            )}
            {mode==='full' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <RiskDistributionBar data={analysis.riskCategories} />
                <RiskAnomalyScatter clauses={analysis.clauses} />
                <ContractScoreGauge score={analysis.compositeScore || analysis.riskSummary?.contractRiskScore || 0.5} />
              </div>
            )}
            {mode==='risk' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <RiskGaugeChart data={analysis.riskCategories} />
                <RiskDistributionBar data={analysis.riskCategories} />
                <ContractScoreGauge score={analysis.compositeScore || analysis.contractRiskScore || 0.5} title="Contract Risk" />
              </div>
            )}
            {mode==='anomaly' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <AnomalyAreaChart data={analysis.anomalySeries} />
                <ContractScoreGauge score={analysis.avgAnomaly || 0.5} title="Avg Anomaly" />
              </div>
            )}
            {mode==='clause' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <ClauseBreakdownChart clauses={analysis.clauses} />
                <RiskAnomalyScatter clauses={analysis.clauses} />
                <ContractScoreGauge score={analysis.avgRisk || 0.5} title="Avg Clause Risk" />
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

function labelForMode(m){
  switch(m){
    case 'full': return 'Full Analysis'
    case 'risk': return 'Risk Only'
    case 'anomaly': return 'Anomaly Only'
    case 'clause': return 'Clause Only'
    default: return m
  }
}
