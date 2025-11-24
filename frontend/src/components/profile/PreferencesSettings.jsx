import React, { useEffect, useState } from 'react'

export default function PreferencesSettings({ user, onSave }) {
  const [prefs, setPrefs] = useState({
    analysisDepth: 'standard', autoSave: true, includeGemini: false,
    theme: 'light', colorScheme: 'standard', resultsLayout: 'detailed', itemsPerPage: 20,
    exportFormat: 'pdf-charts', exportIncludes: ['summary','clauses','charts','recommendations','metadata'],
    language: 'en-US', dateFormat: 'MM/DD/YYYY', timezone: 'GMT+5:30', currency: 'INR'
  })
  const [saving, setSaving] = useState(false)

  useEffect(()=>{ if (user?.preferences) setPrefs(p => ({...p, ...user.preferences})) }, [user])

  const togg = (key) => setPrefs(p=>({...p, [key]: !p[key]}))
  const radio = (key, val) => setPrefs(p=>({...p, [key]: val}))
  const arrToggle = (key, val) => setPrefs(p=>({...p, [key]: p[key].includes(val) ? p[key].filter(x=>x!==val) : [...p[key], val]}))

  const saveAll = async () => {
    setSaving(true)
    try { await onSave?.(prefs) } finally { setSaving(false) }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* A. Analysis Preferences */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
        <div className="text-lg font-black text-[#111827]">Analysis Preferences</div>
        <div>
          <div className="text-sm font-medium text-[#111827] mb-2">Default Analysis Depth</div>
          {[
            ['quick','Quick Scan (Basic classification only)'],
            ['standard','Standard Analysis (Recommended)'],
            ['deep','Deep Analysis (All features + Gemini suggestions)']
          ].map(([val,label]) => (
            <button type="button" key={val} onClick={()=>radio('analysisDepth', val)} className={`w-full text-left px-4 py-3 rounded-xl border mb-2 ${prefs.analysisDepth===val? 'border-[#001F3F] bg-[#001F3F]/5' : 'border-[#E5E7EB] hover:bg-gray-50'}`}>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[#111827]">Auto-save Analyses</div>
            <div className="text-xs text-gray-600">Automatically save all completed analyses to your dashboard</div>
          </div>
          <button type="button" onClick={()=>togg('autoSave')} className={`w-12 h-7 rounded-full ${prefs.autoSave? 'bg-[#001F3F]' : 'bg-gray-300'} relative transition`}>
            <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition ${prefs.autoSave? 'translate-x-5' : ''}`}/>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[#111827]">Include Gemini AI Suggestions</div>
            <div className="text-xs text-gray-600">Requires API key configuration</div>
          </div>
          <button type="button" onClick={()=>togg('includeGemini')} className={`w-12 h-7 rounded-full ${prefs.includeGemini? 'bg-[#001F3F]' : 'bg-gray-300'} relative transition`}>
            <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition ${prefs.includeGemini? 'translate-x-5' : ''}`}/>
          </button>
        </div>
      </div>

      {/* B. Display Preferences */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
        <div className="text-lg font-black text-[#111827]">Display Preferences</div>
        <div>
          <div className="text-sm font-medium text-[#111827] mb-2">Theme</div>
          <div className="grid sm:grid-cols-2 gap-2">
            <button type="button" onClick={()=>radio('theme','light')} className={`px-4 py-3 rounded-xl border ${prefs.theme==='light' ? 'border-[#001F3F] bg-[#001F3F]/5' : 'border-[#E5E7EB] hover:bg-gray-50'}`}>Light (default)</button>
            <button type="button" disabled className="px-4 py-3 rounded-xl border border-[#E5E7EB] text-gray-400">Dark (Coming soon)</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">Risk Color Coding</label>
          <select value={prefs.colorScheme} onChange={e=>radio('colorScheme', e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2">
            <option value="standard">Standard (Red/Amber/Green)</option>
            <option value="cb">Color-blind friendly</option>
          </select>
        </div>
        <div>
          <div className="text-sm font-medium text-[#111827] mb-2">Results Page Layout</div>
          {[
            ['compact','Compact view'],
            ['detailed','Detailed view (default)'],
            ['print','Print-friendly view']
          ].map(([val,label]) => (
            <button type="button" key={val} onClick={()=>radio('resultsLayout', val)} className={`w-full text-left px-4 py-3 rounded-xl border mb-2 ${prefs.resultsLayout===val? 'border-[#001F3F] bg-[#001F3F]/5' : 'border-[#E5E7EB] hover:bg-gray-50'}`}>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">Items per Page</label>
          <select value={prefs.itemsPerPage} onChange={e=>radio('itemsPerPage', Number(e.target.value))} className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2">
            {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* C. Export Preferences */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
        <div className="text-lg font-black text-[#111827]">Export Preferences</div>
        <div>
          <div className="text-sm font-medium text-[#111827] mb-2">Default Export Format</div>
          {[
            ['pdf-charts','PDF with charts'],
            ['pdf-text','PDF text only'],
            ['excel','Excel spreadsheet'],
            ['json','JSON data']
          ].map(([val,label]) => (
            <button type="button" key={val} onClick={()=>radio('exportFormat', val)} className={`w-full text-left px-4 py-3 rounded-xl border mb-2 ${prefs.exportFormat===val? 'border-[#001F3F] bg-[#001F3F]/5' : 'border-[#E5E7EB] hover:bg-gray-50'}`}>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
        <div>
          <div className="text-sm font-medium text-[#111827] mb-2">Include in Exports</div>
          {[
            ['summary','Executive summary'],
            ['clauses','Clause-by-clause breakdown'],
            ['charts','Visual charts'],
            ['recommendations','Risk recommendations'],
            ['metadata','Metadata (date, user, etc.)']
          ].map(([val,label]) => (
            <label key={val} className="flex items-center gap-3 text-[#111827]">
              <input type="checkbox" checked={prefs.exportIncludes.includes(val)} onChange={()=>arrToggle('exportIncludes', val)} />{label}
            </label>
          ))}
        </div>
      </div>

      {/* D. Language & Region */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 flex flex-col gap-4">
        <div className="text-lg font-black text-[#111827]">Language & Region</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Interface Language</label>
            <select value={prefs.language} onChange={e=>radio('language', e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2">
              <option>en-US</option>
              <option>en-UK</option>
              <option>hi-IN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Date Format</label>
            <select value={prefs.dateFormat} onChange={e=>radio('dateFormat', e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Time Zone</label>
            <select value={prefs.timezone} onChange={e=>radio('timezone', e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2">
              <option>GMT+5:30</option>
              <option>UTC</option>
              <option>GMT+1</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Currency</label>
            <select value={prefs.currency} onChange={e=>radio('currency', e.target.value)} className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2">
              <option>INR</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex justify-end gap-3">
        <button type="button" onClick={()=>window.location.reload()} className="px-4 py-2 rounded-xl border border-[#E5E7EB]">Reset to Defaults</button>
        <button disabled={saving} onClick={saveAll} className="px-4 py-2 rounded-xl bg-[#001F3F] text-white font-bold disabled:opacity-60">{saving?'Saving...':'Save All Preferences'}</button>
      </div>
    </div>
  )
}
