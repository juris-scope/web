export default function AdditionalStatsPanel({ analysis }) {
  if (!analysis) return null
  const totalClauses = analysis.clauses ? analysis.clauses.length : (analysis.count || 0)
  const avgRisk = analysis.avgRisk || (analysis.clauses ? (analysis.clauses.reduce((a,c)=>a+c.riskScore,0)/analysis.clauses.length).toFixed(3) : null)
  const avgAnomaly = analysis.avgAnomaly || (analysis.clauses && analysis.clauses[0].anomalyScore !== undefined ? (analysis.clauses.reduce((a,c)=>a+c.anomalyScore,0)/analysis.clauses.length).toFixed(3) : null)
  const composite = analysis.compositeScore || (analysis.riskSummary ? analysis.compositeScore : null)
  return (
    <div className="card p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
      <Stat label="Clauses" value={totalClauses} />
      {avgRisk && <Stat label="Avg Risk" value={avgRisk} />}
      {avgAnomaly && <Stat label="Avg Anomaly" value={avgAnomaly} />}
      {composite && <Stat label="Composite" value={composite} />}
    </div>
  )
}

function Stat({ label, value }){
  return (
    <div>
      <div className="text-gray-500 uppercase tracking-wide text-xs">{label}</div>
      <div className="text-lg font-semibold" style={{color:'#001F3F'}}>{value}</div>
    </div>
  )
}
