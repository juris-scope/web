import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardCard from '../components/DashboardCard'
import FeatureCard from '../components/FeatureCard'
import Button from '../components/Button'
import { api } from '../utils/api'

function IconStats() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h10M4 18h6" stroke="#001F3F" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconBar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10m6 10V4m6 16v-6" stroke="#001F3F" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0s4 3 4 9-4 9-4 9-4-3-4-9 4-9 4-9z" stroke="#001F3F" strokeWidth="2"/>
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 4v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V7l7-4z" stroke="#001F3F" strokeWidth="2"/>
    </svg>
  )
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ totalContracts: 0, riskAssessments: 0, recentActivity: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    async function fetchMetrics() {
      try {
        const { data } = await api.get('/api/analytics')
        if (!ignore) setMetrics(data)
      } catch (e) {
        if (!ignore) setError('Could not load analytics.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    fetchMetrics()
    return () => { ignore = true }
  }, [])

  return (
    <div className="space-y-8">
      <section className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold" style={{color:'#001F3F'}}>Welcome to JuriScope</h1>
        <p className="text-gray-600 mt-2">AI-powered contract analysis for modern legal teams.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardCard title="Total contracts analyzed" value={loading ? '—' : metrics.totalContracts} icon={<IconStats/>} />
        <DashboardCard title="Risk assessments completed" value={loading ? '—' : metrics.riskAssessments} icon={<IconBar/>} />
        <DashboardCard title="Recent activity" value={loading ? '—' : (metrics.recentActivity?.[0] || 'No recent')} icon={<IconShield/>} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold" style={{color:'#001F3F'}}>Feature Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <FeatureCard title="Mathematical Models" subtitle="Clause Extraction & Entity Recognition" icon={<IconBar/>} highlight />
          <FeatureCard title="Risk Assessment" subtitle="Automated Risk Scoring" icon={<IconShield/>} />
          <FeatureCard title="Multi-lingual Processing" subtitle="Language Support" icon={<IconGlobe/>} />
          <FeatureCard title="Compliance Verification" subtitle="Regulatory Framework Check" icon={<IconStats/>} />
        </div>
      </section>

      <section className="text-center sm:text-left">
        <Link to="/explore"><Button>Explore</Button></Link>
        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      </section>
    </div>
  )
}
