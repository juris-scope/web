import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function AnomalyAreaChart({ data }) {
  // data: [{ index, anomalyScore }]
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold mb-2" style={{color:'#001F3F'}}>Anomaly Trend</h3>
      <AreaChart width={340} height={220} data={data} margin={{ top:10, right:10, left:0, bottom:0 }}>
        <defs>
          <linearGradient id="anom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF851B" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#FF851B" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={[0,1]} />
        <Tooltip formatter={(v)=>v.toFixed(3)} />
        <Area type="monotone" dataKey="anomalyScore" stroke="#FF851B" fill="url(#anom)" strokeWidth={2} />
      </AreaChart>
    </div>
  )
}
