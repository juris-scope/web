import { useState } from 'react'
import FeatureCard from '../components/FeatureCard'
import FileUploadZone from '../components/FileUploadZone'

function IconBar() {return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 20V10m6 10V4m6 16v-6" stroke="#FF851B" strokeWidth="2"/></svg>)}
function IconWarn() {return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86l-8.48 14.7A1 1 0 0 0 2.62 21h18.76a1 1 0 0 0 .86-1.5l-8.48-14.7a1 1 0 0 0-1.74 0z" stroke="#001F3F" strokeWidth="2"/></svg>)}
function IconGlobe() {return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0s4 3 4 9-4 9-4 9-4-3-4-9 4-9 4-9z" stroke="#001F3F" strokeWidth="2"/></svg>)}
function IconCheck() {return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 6l-11 11-5-5" stroke="#001F3F" strokeWidth="2"/></svg>)}

export default function Explore() {
  const [language, setLanguage] = useState('English')
  const [result, setResult] = useState(null)

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold" style={{color:'#001F3F'}}>AI-Powered Contract Analysis</h1>
        <p className="text-gray-600 mt-2">Upload your contract and let our AI analyze it across multiple dimensions</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <FeatureCard title="Mathematical Models" subtitle="Clause Extraction & Entity Recognition" icon={<IconBar/>} highlight />
        <FeatureCard title="Risk Assessment" subtitle="Automated Risk Scoring" icon={<IconWarn/>} />
        <FeatureCard title="Multi-lingual Processing" subtitle="Language Support" icon={<IconGlobe/>} />
        <FeatureCard title="Compliance Verification" subtitle="Regulatory Framework Check" icon={<IconCheck/>} />
      </section>

      <section className="card p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <div className="text-sm text-gray-700 font-medium">Language</div>
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange">
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">Supported formats: PDF, DOCX, TXT (Max 10MB)</div>
        </div>
        <FileUploadZone language={language} onUploaded={setResult} />
        {result && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-700">
            <div className="font-medium mb-1">Upload Result</div>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  )
}
