import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#001F3F', '#FF851B', '#0d9488', '#6366f1', '#475569']

export default function ClauseBreakdownChart({ clauses }) {
  // clauses: [{ predictedType }]
  const counts = clauses.reduce((acc,c)=>{ acc[c.predictedType]=(acc[c.predictedType]||0)+1; return acc },{})
  const data = Object.entries(counts).map(([name,value])=>({ name, value }))
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-2" style={{color:'#001F3F'}}>Clause Type Breakdown</h3>
      <PieChart width={340} height={220}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </div>
  )
}
