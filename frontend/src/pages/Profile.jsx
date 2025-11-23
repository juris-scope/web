import { useEffect, useState } from 'react'
import DashboardCard from '../components/DashboardCard'
import { api } from '../utils/api'

function IconUser(){return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5c0-3-4-5.5-9-5.5Z" stroke="#001F3F" strokeWidth="2"/></svg>)}
function IconRisk(){return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 4v6c0 5-4 8-9 8s-9-3-9-8V7l9-4Z" stroke="#001F3F" strokeWidth="2"/><path d="M12 8v5" stroke="#FF851B" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="15" r="1" fill="#FF851B" />)</svg>)}
function IconAnomaly(){return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 17l6-6 4 4 6-10" stroke="#001F3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function IconClause(){return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 4h9l5 5v11a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="#001F3F" strokeWidth="2"/><path d="M14 4v5h5" stroke="#001F3F" strokeWidth="2" strokeLinejoin="round"/></svg>)}

export default function Profile(){
  const [data,setData] = useState(null)
  const [error,setError] = useState('')
  useEffect(()=>{
    let ignore=false
    async function run(){
      try { const {data} = await api.get('/api/profile'); if(!ignore) setData(data) } catch(e){ if(!ignore) setError('Failed to load profile') }
    }
    run(); return ()=>{ignore=true}
  },[])

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold" style={{color:'#001F3F'}}>Your Profile</h1>
        <p className="text-gray-600 mt-2">Account overview & analysis activity.</p>
      </section>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {!data && !error && <div className="card p-6"><div className="animate-pulse space-y-3"><div className="h-6 bg-gray-200 rounded"/><div className="h-6 bg-gray-200 rounded"/><div className="h-6 bg-gray-200 rounded"/></div></div>}
      {data && (
        <>
          <section className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{background:'#001F3F'}}>
                <span className="text-white text-lg font-semibold">{data.user.name[0]}</span>
              </div>
              <div>
                <div className="text-xl font-semibold" style={{color:'#001F3F'}}>{data.user.name}</div>
                <div className="text-sm text-gray-600">{data.user.role} • {data.user.plan}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <div>Last Analysis: {new Date(data.stats.lastAnalysisAt).toLocaleString()}</div>
              <div>Languages Used: {data.stats.languagesUsed.join(', ')}</div>
            </div>
          </section>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <DashboardCard title="Contracts" value={data.stats.contractsAnalyzed} icon={<IconUser/>} />
            <DashboardCard title="High Risk" value={data.stats.highRiskFindings} icon={<IconRisk/>} />
            <DashboardCard title="Anomalies" value={data.stats.anomaliesFlagged} icon={<IconAnomaly/>} />
            <DashboardCard title="Clauses" value={data.stats.clausesClassified} icon={<IconClause/>} />
          </section>
        </>
      )}
    </div>
  )
}
