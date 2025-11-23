import { RadialBarChart, RadialBar, Legend, PolarAngleAxis } from 'recharts'

export default function RiskGaugeChart({ data }) {
  // data: [{ category, score, band }]
  const chartData = data.map(d => ({ name: d.category, value: Math.round(d.score * 100), fill: bandColor(d.band) }))
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-2" style={{color:'#001F3F'}}>Risk Scores</h3>
      <RadialBarChart width={340} height={220} innerRadius="20%" outerRadius="90%" data={chartData}>
        <PolarAngleAxis type="number" domain={[0,100]} tick={false} />
        <RadialBar background dataKey="value" cornerRadius={6} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RadialBarChart>
    </div>
  )
}

function bandColor(band){
  switch(band){
    case 'High': return '#dc2626' // red-600
    case 'Moderate': return '#f59e0b' // amber-500
    default: return '#16a34a' // green-600
  }
}
