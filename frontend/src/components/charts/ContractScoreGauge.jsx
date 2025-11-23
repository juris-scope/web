import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

export default function ContractScoreGauge({ score, title = 'Composite Score' }) {
  const data = [{ name: 'score', value: Math.round(score * 100), fill: gaugeColor(score) }]
  return (
    <div className="card p-4 flex flex-col items-center justify-center">
      <h3 className="text-sm font-semibold mb-2" style={{color:'#001F3F'}}>{title}</h3>
      <RadialBarChart width={200} height={200} innerRadius="60%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
        <PolarAngleAxis type="number" domain={[0,100]} tick={false} />
        <RadialBar background dataKey="value" cornerRadius={10} />
      </RadialBarChart>
      <div className="mt-2 text-xl font-semibold" style={{color:'#001F3F'}}>{(score*100).toFixed(1)}%</div>
    </div>
  )
}

function gaugeColor(v){
  if (v >= 0.7) return '#dc2626'
  if (v >= 0.4) return '#f59e0b'
  return '#16a34a'
}
