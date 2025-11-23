import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function RiskDistributionBar({ data }) {
  const chartData = data.map(d => ({ name: d.category, score: +(d.score*100).toFixed(1), band: d.band }))
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-2" style={{color:'#001F3F'}}>Risk Distribution</h3>
      <BarChart width={340} height={220} data={chartData} margin={{ top:10, right:20, left:0, bottom:0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v)=> v + '%'} />
        <Bar dataKey="score" radius={[4,4,0,0]} fill="#FF851B" />
      </BarChart>
    </div>
  )
}
