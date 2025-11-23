import { useState, useMemo } from 'react'

const baseHeaders = [
  { key:'id', label:'#' },
  { key:'predictedType', label:'Type' },
  { key:'riskBand', label:'Risk' },
  { key:'riskScore', label:'Risk' },
  { key:'anomalyScore', label:'Anom.' },
  { key:'suggestion', label:'Suggestion' },
  { key:'textSnippet', label:'Snippet' },
]

export default function AnalysisResultsTable({ clauses }) {
  const [sortKey, setSortKey] = useState('riskScore')
  const [sortDir, setSortDir] = useState('desc')
  const [filterText, setFilterText] = useState('')

  const headers = useMemo(()=>{
    return baseHeaders.filter(h => clauses.some(c => c[h.key] !== undefined))
  }, [clauses])

  const filtered = useMemo(()=>{
    const f = filterText.toLowerCase()
    return clauses.filter(c => !f || c.textSnippet.toLowerCase().includes(f) || c.predictedType.toLowerCase().includes(f))
  }, [clauses, filterText])

  const sorted = useMemo(()=>{
    return [...filtered].sort((a,b)=>{
      const av = a[sortKey]
      const bv = b[sortKey]
      if (av === bv) return 0
      if (sortDir==='asc') return av > bv ? 1 : -1
      return av < bv ? 1 : -1
    })
  }, [filtered, sortKey, sortDir])

  function toggleSort(key){
    if (key === sortKey) setSortDir(d => d==='asc'?'desc':'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  return (
    <div className="card p-4 overflow-auto">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{color:'#001F3F'}}>Clause Details</h3>
        <input
          placeholder="Filter by text or type..."
          value={filterText}
          onChange={e=>setFilterText(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200">
            {headers.map(h => (
              <th key={h.key} className="py-2 cursor-pointer select-none" onClick={()=>toggleSort(h.key)}>
                <div className="flex items-center gap-1">
                  <span>{h.label}</span>
                  {sortKey===h.key && (<span>{sortDir==='asc'?'▲':'▼'}</span>)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(c => (
            <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
              <td className="py-2 pr-2 font-medium">{c.id}</td>
              {c.predictedType !== undefined && <td className="py-2 pr-2">{c.predictedType}</td>}
              {c.riskBand !== undefined && <td className="py-2 pr-2"><RiskBadge band={c.riskBand} /></td>}
              {c.riskScore !== undefined && <td className="py-2 pr-2">{Number(c.riskScore).toFixed(2)}</td>}
              {c.anomalyScore !== undefined && <td className="py-2 pr-2">{Number(c.anomalyScore).toFixed(2)}</td>}
              {c.suggestion !== undefined && <td className="py-2 pr-2 text-gray-700 max-w-xs truncate" title={c.suggestion}>{c.suggestion}</td>}
              {c.textSnippet !== undefined && <td className="py-2 pr-2 text-gray-600 max-w-xs truncate" title={c.textSnippet}>{c.textSnippet}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && <div className="text-xs text-gray-500 mt-3">No clauses match your filter.</div>}
    </div>
  )
}

function RiskBadge({ band }){
  const cls = {
    High: 'bg-red-100 text-red-700 border-red-300',
    Moderate: 'bg-amber-100 text-amber-700 border-amber-300',
    Low: 'bg-green-100 text-green-700 border-green-300'
  }[band] || 'bg-gray-100 text-gray-600 border-gray-300'
  return <span className={`px-2 py-1 rounded text-xs font-medium border ${cls}`}>{band}</span>
}
