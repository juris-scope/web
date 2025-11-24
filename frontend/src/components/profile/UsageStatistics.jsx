import React, { useEffect, useState } from 'react'
import { FileText, List, AlertTriangle, Clock } from 'lucide-react'
import StatCard from './StatCard'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#EF4444','#F59E0B','#10B981','#3B82F6','#111827']

export default function UsageStatistics({ fetchStats }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchStats?.()
        setData(res)
      } catch {
        setData(null)
      } finally { setLoading(false) }
    })()
  }, [fetchStats])

  const overview = data?.overview || { totalAnalyses: 247, totalClauses: 3842, highRiskAlerts: 23, timeSavedHours: 126, trend: '+12% this month' }
  const activity = data?.activity || Array.from({length: 30}, (_,i)=>({ date: new Date(Date.now()-(29-i)*86400000).toLocaleDateString('en-US',{month:'short', day:'numeric'}), value: Math.round(5+Math.random()*15) }))
  const clauseTypes = data?.clauseTypes || [
    { name: 'Payment', value: 18 },{ name: 'Confidentiality', value: 22 },{ name: 'Liability', value: 12 },{ name: 'Termination', value: 15 },{ name: 'Dispute', value: 10 }
  ]
  const riskTimeline = data?.riskTimeline || Array.from({length: 12}, (_,i)=>({ t:`W${i+1}`, high: Math.round(Math.random()*6), moderate: Math.round(Math.random()*9), low: Math.round(Math.random()*14) }))
  const history = data?.history || Array.from({length: 10}, (_,i)=>({ name:`Contract_${i+1}.pdf`, date:new Date(Date.now()-i*86400000).toLocaleDateString(), score: Math.round(40+Math.random()*60), clauses: Math.round(40+Math.random()*80) }))

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* A. Overview Metrics */}
      <div className="lg:col-span-3 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Analyses" value={overview.totalAnalyses} subtitle={overview.trend} icon={FileText} />
        <StatCard title="Total Clauses Reviewed" value={overview.totalClauses} subtitle={'+156 this week'} icon={List} />
        <StatCard title="High Risk Alerts" value={overview.highRiskAlerts} subtitle={'9.3% of total'} icon={AlertTriangle} color="text-[#EF4444]" />
        <StatCard title="Time Saved" value={`${overview.timeSavedHours} hours`} subtitle={'vs manual review'} icon={Clock} />
      </div>

      {/* B. Activity Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="font-black text-[#111827] mb-4">Analysis Activity (Last 30 Days)</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activity}>
              <defs>
                <linearGradient id="navy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#001F3F" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#001F3F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#001F3F" fillOpacity={1} fill="url(#navy)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* C. Clause Type Distribution */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="font-black text-[#111827] mb-4">Most Analyzed Clause Types</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={clauseTypes} dataKey="value" nameKey="name" outerRadius={90}>
                {clauseTypes.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* D. Risk Distribution Timeline */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="font-black text-[#111827] mb-4">Risk Trends Over Time</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskTimeline}>
              <XAxis dataKey="t" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Area type="monotone" stackId="1" dataKey="high" stroke="#EF4444" fill="#FEE2E2" />
              <Area type="monotone" stackId="1" dataKey="moderate" stroke="#F59E0B" fill="#FEF3C7" />
              <Area type="monotone" stackId="1" dataKey="low" stroke="#10B981" fill="#D1FAE5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* E. Analysis History Table */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="font-black text-[#111827]">Recent Analyses</div>
          <button className="px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm font-bold">View All History</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Document Name</th>
                <th className="py-2">Date</th>
                <th className="py-2">Risk Score</th>
                <th className="py-2">Clauses</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h,i)=>(
                <tr key={i} className="border-t border-gray-100">
                  <td className="py-2 font-medium text-gray-800">{h.name}</td>
                  <td className="py-2 text-gray-600">{h.date}</td>
                  <td className="py-2"><span className={`px-2 py-1 rounded-lg text-xs font-bold ${h.score>70?'bg-green-100 text-green-700':h.score>50?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{h.score}</span></td>
                  <td className="py-2 text-gray-600">{h.clauses}</td>
                  <td className="py-2"><button className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-sm font-bold">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* F. Usage Limits */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="font-black text-[#111827] mb-2">Usage Limits</div>
        <div className="text-sm text-gray-600 mb-2">73 of 100 analyses used this month</div>
        <div className="w-full h-3 bg-gray-200 rounded">
          <div className="h-3 bg-[#FF851B] rounded" style={{width:'73%'}} />
        </div>
        <div className="text-xs text-gray-500 mt-2">Resets: January 1, 2025</div>
        <div className="mt-3"><button className="px-4 py-2 rounded-xl bg-[#FF851B] text-white font-bold">Upgrade Plan</button></div>
      </div>

      {/* Export */}
      <div className="lg:col-span-3 flex justify-end">
        <button className="px-4 py-2 rounded-xl border border-[#E5E7EB] font-bold">Export Report</button>
      </div>
    </div>
  )
}
