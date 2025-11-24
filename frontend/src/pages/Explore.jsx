import React, { useState, useEffect } from 'react';

// const api = 'http://localhost:3000'
const api = 'https://web-v2nb.onrender.com'

// --- 1. ICONS (Lucide/SVG) ---
const IconUpload = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconWarn = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconGlobe = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconBar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

// --- 2. UI COMPONENTS ---

// Mode Selection Card
const FeatureCard = ({ title, subtitle, icon, selectable, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 shadow-sm
      ${selectable && selected 
        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-offset-2' 
        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'}
    `}
  >
    <div className="p-2 bg-white rounded-lg w-fit border border-gray-100 shadow-sm">{icon}</div>
    <div>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

// File/Text Input Zone
const FileUploadZone = ({ language, onUploaded }) => {
  const [text, setText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleAnalyze = () => {
    // Default mock text if empty, to help user test quickly
    const payloadText = text || `1. The Tenant shall pay a monthly rent of Rs. 25,000 on or before the 5th of every month.

2. The liability of the provider shall be unlimited in the event of breach, including for gross negligence and willful misconduct.

3. This contract may be terminated by either party without cause by providing 30 days written notice.

4. Confidential Information shall be kept strictly confidential and shall not be disclosed to any third party without prior written consent.`;
    
    onUploaded({ text: payloadText, fileName: "manual_input.txt" });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <IconUpload /> Input Contract Text
            </h3>
            
            <textarea 
                className="w-full p-4 border border-gray-300 rounded-lg text-sm mb-4 font-mono bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
                rows="6" 
                placeholder="Paste your contract text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Analysis Language: <span className="font-semibold text-blue-700">{language}</span>
                </div>
                <button 
                    onClick={handleAnalyze}
                    className="px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium shadow-lg shadow-blue-900/20 active:scale-95 transform"
                >
                    Analyze Contract
                </button>
            </div>
        </div>
        {/* Visual Drag Drop Hint */}
        <div className={`h-2 transition-all ${isDragOver ? 'bg-blue-500' : 'bg-gray-100'}`} />
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4 p-4 border rounded-lg bg-white">
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    <div className="h-32 bg-gray-100 rounded w-full"></div>
    <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

// --- 3. CHARTS (CSS-ONLY implementation to avoid dependencies) ---

const RiskGauge = ({ data }) => {
    const total = (data?.['Low Risk'] || 0) + (data?.['Moderate Risk'] || 0) + (data?.['High Risk'] || 0) || 1;
    const lowH = Math.max(((data?.['Low Risk'] || 0) / total) * 100, 5);
    const modH = Math.max(((data?.['Moderate Risk'] || 0) / total) * 100, 5);
    const highH = Math.max(((data?.['High Risk'] || 0) / total) * 100, 5);

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Risk Composition</h4>
            <div className="flex items-end justify-center gap-4 flex-1 h-32 pb-4 border-b border-gray-100">
                <div className="w-16 bg-green-500 rounded-t-lg relative group transition-all duration-700 hover:opacity-90" style={{height: `${lowH}%`}}>
                   <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-green-700">{data?.['Low Risk'] || 0}</span>
                </div>
                <div className="w-16 bg-yellow-400 rounded-t-lg relative group transition-all duration-700 hover:opacity-90" style={{height: `${modH}%`}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-700">{data?.['Moderate Risk'] || 0}</span>
                </div>
                <div className="w-16 bg-red-500 rounded-t-lg relative group transition-all duration-700 hover:opacity-90" style={{height: `${highH}%`}}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-700">{data?.['High Risk'] || 0}</span>
                </div>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-400 mt-3 px-4">
                <span>Safe</span><span>Moderate</span><span>Critical</span>
            </div>
        </div>
    );
}

const AnomalyChart = ({ data }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Anomaly Detection</h4>
        <div className="flex-1 flex items-end gap-1 h-32 w-full overflow-hidden">
            {data && data.map((d, i) => (
                <div 
                    key={i} 
                    className="flex-1 bg-indigo-200 hover:bg-indigo-500 rounded-t transition-all duration-300 relative group cursor-pointer" 
                    style={{height: `${Math.max(d.value * 100, 10)}%`}}
                >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs p-2 rounded shadow-lg w-48 z-10 text-center pointer-events-none">
                        <div className="font-bold">Score: {d.value.toFixed(2)}</div>
                        <div className="text-gray-300 text-[10px] truncate">{d.text}</div>
                    </div>
                </div>
            ))}
        </div>
        <div className="text-center text-xs text-gray-400 mt-3">Clause Sequence (Start → End)</div>
    </div>
);

const ScoreCard = ({ title, score, type = 'default' }) => {
    let colorClass = "text-blue-600";
    if (type === 'risk' && score > 0.7) colorClass = "text-red-600";
    if (type === 'risk' && score < 0.3) colorClass = "text-green-600";

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h4>
            <div className={`text-4xl font-black font-mono my-2 ${colorClass}`}>
                {(score * 100).toFixed(0)}
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${type === 'risk' ? 'bg-red-500' : 'bg-blue-500'}`} style={{width: `${score * 100}%`}}></div>
            </div>
        </div>
    );
};

// --- MODIFIED CLAUSE TABLE ---
const ClauseTable = ({ clauses }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">ID</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs w-1/3">Clause Text</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">Type</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs">Risk Level</th>
                        {/* Added Anomaly Score Header */}
                        <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider text-xs w-1/4">Anomaly Score</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {clauses.map((c, i) => (
                        <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">#{i+1}</td>
                            <td className="px-6 py-4 text-gray-800">
                                <div className="line-clamp-3 hover:line-clamp-none transition-all cursor-text">{c.text}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {c.clause_type}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                    ${c.risk_band === 'High Risk' ? 'bg-red-50 text-red-700 border-red-200' : 
                                      c.risk_band === 'Moderate Risk' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                      'bg-green-50 text-green-700 border-green-200'}`}>
                                    {c.risk_band}
                                </span>
                            </td>
                            {/* Added Anomaly Score Cell */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden min-w-[60px]">
                                        <div 
                                            className={`h-full ${c.anomaly_score > 0.7 ? 'bg-red-500' : c.anomaly_score > 0.4 ? 'bg-yellow-400' : 'bg-green-500'}`} 
                                            style={{width: `${(c.anomaly_score || 0) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-gray-600">
                                        {(c.anomaly_score || 0).toFixed(2)}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


// --- 4. MAIN APP COMPONENT ---

export default function App() {
  const [language, setLanguage] = useState('English');
  const [inputData, setInputData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('full');

  // --- DATA TRANSFORMATION ---
  const transformData = (backendData) => {
    if (!backendData || !backendData.clauses) return null;

    const riskCounts = { "High Risk": 0, "Moderate Risk": 0, "Low Risk": 0 };
    backendData.clauses.forEach(c => {
      const band = c.risk_band || "Low Risk";
      riskCounts[band] = (riskCounts[band] || 0) + 1;
    });

    const anomalySeries = backendData.clauses.map((c, i) => ({
      id: i,
      value: c.anomaly_score,
      text: c.text
    }));

    return {
      raw: backendData,
      riskCategories: riskCounts, 
      anomalySeries: anomalySeries, 
      compositeScore: backendData.summary?.composite_score || 0,
      contractRiskScore: backendData.summary?.contract_risk_score || 0
    };
  };

  // --- API CALL ---
  const fetchAnalysis = async () => {
    if (!inputData?.text) return;

    setLoading(true);
    setError('');
    
    try {
      // Direct call to Node.js Backend on port 3000
      const endpoint = `${api}/analyze`; 

      const payload = {
        text: inputData.text,
        language: language
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server Error: ${response.status}`);
      }
      
      setAnalysis(transformData(data));

    } catch (e) {
      console.error("Analysis Failed:", e);
      setError(`Connection Error: ${e.message}. Ensure Node.js is running on port 3000.`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger when file is "uploaded"
  useEffect(() => {
    if (inputData) fetchAnalysis();
  }, [inputData]); // eslint-disable-line react-hooks/exhaustive-deps


  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/20">
                    AI
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">LegalLens</h1>
                    <p className="text-xs text-gray-500 font-medium">Intelligent Contract Analysis</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                 <select 
                    value={language} 
                    onChange={(e)=>setLanguage(e.target.value)} 
                    className="bg-gray-100 border-none text-sm font-medium rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-200 transition-colors"
                 >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                 </select>
              </div>
          </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* 1. Feature Selection */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <FeatureCard title="Full Analysis" subtitle="Combined Insights" icon={<IconCheck/>} selectable selected={mode==='full'} onClick={()=>setMode('full')} />
            <FeatureCard title="Risk Assessment" subtitle="Automated Scoring" icon={<IconWarn/>} selectable selected={mode==='risk'} onClick={()=>setMode('risk')} />
            <FeatureCard title="Anomaly Detection" subtitle="Pattern Deviation" icon={<IconGlobe/>} selectable selected={mode==='anomaly'} onClick={()=>setMode('anomaly')} />
            <FeatureCard title="Clause AI" subtitle="Extraction & Types" icon={<IconBar/>} selectable selected={mode==='clause'} onClick={()=>setMode('clause')} />
        </section>

        {/* 2. Input Zone */}
        <FileUploadZone language={language} onUploaded={setInputData} />

        {/* 3. Loading State */}
        {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
            </div>
        )}

        {/* 4. Error State */}
        {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
                <IconWarn />
                <span className="font-medium">{error}</span>
            </div>
        )}

        {/* 5. Results Dashboard */}
        {analysis && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ScoreCard title="Composite Health" score={analysis.compositeScore} />
                    <ScoreCard title="Risk Factor" score={analysis.contractRiskScore} type="risk" />
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clauses</div>
                        <div className="text-4xl font-black text-gray-800">{analysis.raw.clauses.length}</div>
                        <div className="text-xs text-gray-500">Total Analyzed</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">High Risk</div>
                        <div className="text-4xl font-black text-red-600">{analysis.riskCategories["High Risk"] || 0}</div>
                        <div className="text-xs text-gray-500">Critical Issues</div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
                    <RiskGauge data={analysis.riskCategories} />
                    <AnomalyChart data={analysis.anomalySeries} />
                </div>

                {/* Summary Stats */}
                <div className="bg-blue-900 rounded-xl p-6 text-white shadow-lg shadow-blue-900/20">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-4">Detailed Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {Object.entries(analysis.raw.summary || {}).map(([k, v]) => (
                            <div key={k}>
                                <div className="text-xs opacity-60 mb-1 capitalize">{k.replace(/_/g, ' ')}</div>
                                <div className="text-xl font-mono font-bold">{typeof v === 'number' ? v.toFixed(2) : v}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed Table */}
                <ClauseTable clauses={analysis.raw.clauses} />

            </div>
        )}
      </main>
    </div>
  );
}