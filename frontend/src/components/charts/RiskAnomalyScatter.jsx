import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function RiskAnomalyScatter({ clauses }) {
  const data = clauses.map(c => ({ x: c.riskScore, y: c.anomalyScore, label: c.predictedType }))
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-2" style={{color:'#001F3F'}}>Risk vs Anomaly</h3>
      <ScatterChart width={340} height={220} margin={{ top:10, right:10, bottom:10, left:10 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="Risk" domain={[0,1]} tickFormatter={(v)=>v.toFixed(2)} />
        <YAxis type="number" dataKey="y" name="Anomaly" domain={[0,1]} tickFormatter={(v)=>v.toFixed(2)} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v,name)=> v.toFixed(3)} labelFormatter={(label) => ''} contentStyle={{ fontSize:12 }} />
        <Scatter data={data} fill="#001F3F" />
      </ScatterChart>
    </div>
  )
}
