import React, { useState, useEffect } from 'react';

// --- ICONS ---
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconCheck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconSparkles = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/></svg>;
const IconSend = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const IconInfo = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const IconAlert = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

// --- COMPONENT: BLOCK EDITOR ---
const Drafting = () => {
  // State
  const [docBlocks, setDocBlocks] = useState([]); 
  const [startText, setStartText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  
  // Improvement State
  const [improvingBlockId, setImprovingBlockId] = useState(null);
  const [improvementResult, setImprovementResult] = useState(null);
  const [loadingImprovement, setLoadingImprovement] = useState(false);

  // Analysis State
  const [analyzingBlockId, setAnalyzingBlockId] = useState(null); 
  const [docAnalysis, setDocAnalysis] = useState(null); 
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Drafting State
  const [prompt, setPrompt] = useState("");
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [draftOptions, setDraftOptions] = useState(null);

  // --- ACTIONS ---

  // 1. Initialize Document & Trigger Analysis
  const handleStart = () => {
    const blocks = startText.split(/(?:\r?\n)+/).filter(t => t.trim()).map((text, idx) => ({
      id: Date.now() + idx,
      text: text.trim()
    }));
    setDocBlocks(blocks);
    setIsStarted(true);

    if(blocks.length > 0) {
        runInitialAnalysis(blocks.map(b => b.text));
    }
  };

  const runInitialAnalysis = async (textBlocks) => {
    setLoadingAnalysis(true);
    try {
        const res = await fetch('http://localhost:3000/analyze-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blocks: textBlocks })
        });
        const data = await res.json();
        setDocAnalysis(data);
    } catch (err) {
        console.error("Analysis failed", err);
    } finally {
        setLoadingAnalysis(false);
    }
  };

  // 2. Improve a specific block
  const handleImprove = async (blockId, currentText) => {
    setImprovingBlockId(blockId);
    setAnalyzingBlockId(null);
    setLoadingImprovement(true);
    setImprovementResult(null);

    try {
      const res = await fetch('http://localhost:3000/improve-clause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText })
      });
      const data = await res.json();
      setImprovementResult(data.improved_text);
    } catch (err) {
      console.error(err);
      setImprovingBlockId(null);
    } finally {
      setLoadingImprovement(false);
    }
  };

  const acceptImprovement = (blockId, newText) => {
    setDocBlocks(prev => prev.map(b => b.id === blockId ? { ...b, text: newText } : b));
    setImprovingBlockId(null);
    setImprovementResult(null);
  };

  // 3. Draft clause generation
  const handleDraft = async (overridePrompt = null) => {
    const textToDraft = overridePrompt || prompt;
    if (!textToDraft.trim()) return;
    
    setLoadingDraft(true);
    setDraftOptions(null);
    setPrompt(textToDraft); 

    try {
      const res = await fetch('http://localhost:3000/generate-clause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToDraft })
      });
      const data = await res.json();
      
      const norm = normalizeOptions(data);
      setDraftOptions(norm);
    } catch (err) {
      console.error('Drafting error:', err);
    } finally {
      setLoadingDraft(false);
    }
  };

 // Normalize clause options response

  const normalizeOptions = (data) => {

    if (!data) return null;



    // Helper to detect an object that already contains option_a/option_b or a/b

    const pickObj = (o) => {

      if (!o || typeof o !== 'object') return null;

      if (o.option_a || o.option_b) return o;

      if (o.a || o.b) return { option_a: o.a, option_b: o.b };

      return null;

    };



    // Handle array or array-like payloads

    let src = null;

    if (Array.isArray(data) || (typeof data === 'object' && data !== null && typeof data.length === 'number')) {

      const arr = Array.isArray(data) ? data : Array.from(data);

      // Prefer an element that already has option_a/option_b

      for (const el of arr) {

        const candidate = pickObj(el);

        if (candidate) {

          src = candidate;

          break;

        }

      }

      // If nothing found but first two elements look like standalone options, map them

      if (!src && arr.length >= 2) {

        const [aEl, bEl] = arr;

        if ((aEl && (aEl.text || aEl.title)) && (bEl && (bEl.text || bEl.title))) {

          src = { option_a: aEl, option_b: bEl };

        }

      }

    } else {

      src = pickObj(data) || data;

    }



    if (!src) return null;



    const a = src.option_a || src.a || null;

    const b = src.option_b || src.b || null;



    const toObj = (v, titleFallback) => {

      if (!v) return { title: titleFallback, text: '' };

      if (typeof v === 'string') return { title: titleFallback, text: v };

      // Some responses use { text: "...", title: "..." } or { title: "...", text: "..." }

      return { title: v.title || titleFallback, text: v.text || v };

    };



    const norm = {

      option_a: toObj(a, 'Protective Approach'),

      option_b: toObj(b, 'Balanced Approach'),

    };



    if (!norm.option_a.text && !norm.option_b.text) return null;

    return norm;

  };

  const selectDraftOption = (text) => {
    if (!text) return;
    const newBlock = { id: Date.now(), text };
    setDocBlocks(prev => [...prev, newBlock]);
    setDraftOptions(null);
    setPrompt('');
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const exportPdf = () => {
    window.print();
  };

  // --- RENDER START SCREEN ---
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white max-w-2xl w-full p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><IconSparkles /></div>
             <h1 className="text-2xl font-bold text-gray-900">Start Drafting</h1>
          </div>
          <p className="text-gray-500 mb-4">Paste your initial contract text below to begin the AI drafting session.</p>
          <textarea 
            className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none font-mono text-sm"
            placeholder="Paste contract text..."
            value={startText}
            onChange={(e) => setStartText(e.target.value)}
          ></textarea>
          <button onClick={handleStart} className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all">Launch Canvas</button>
        </div>
      </div>
    );
  }

  // --- RENDER CANVAS ---
  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-52 font-sans relative">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm print:hidden">
        <div className="px-8 py-3 flex justify-between items-center">
            <div className="font-bold text-gray-800 flex items-center gap-2">
                <span className="text-indigo-600"><IconSparkles /></span> Smart Draft Canvas
            </div>
            {/* Overall Analysis Ticker */}
            <div className="hidden md:flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                {loadingAnalysis ? (
                    <span className="text-xs text-indigo-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div> Analyzing Document...</span>
                ) : docAnalysis ? (
                    <span className="text-xs text-gray-600 flex items-center gap-2 max-w-md truncate" title={docAnalysis.overall_analysis}>
                        <IconInfo /> <span className="font-semibold">AI Insight:</span> {docAnalysis.overall_analysis}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">Ready</span>
                )}
            </div>
        </div>
      </nav>

      {/* Document Canvas */}
      <div className="max-w-4xl mx-auto mt-8 bg-white min-h-[80vh] shadow-sm border border-gray-200 rounded-none md:rounded-lg overflow-visible relative print:shadow-none print:mt-0 print:border-none">
        <div className="p-12 space-y-8 print:p-0">
          
          {docBlocks.length === 0 && <div className="text-center text-gray-300 py-20 italic print:hidden">Empty document. Use AI suggestions below.</div>}

          {docBlocks.map((block, idx) => (
            <div key={block.id} className="group relative pl-4 transition-all duration-300 print:pl-0">
              
              {/* Sidebar Buttons (Hidden on Print) */}
              <div className="absolute -left-16 top-0 h-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 pt-1 items-end pr-2 print:hidden">
                 <button 
                    onClick={() => handleImprove(block.id, block.text)}
                    className="p-1.5 bg-white text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white border border-indigo-100 shadow hover:scale-110 transition-all"
                    title="Improve Clause"
                 ><IconPlus /></button>
                 <button 
                    onClick={() => setAnalyzingBlockId(analyzingBlockId === block.id ? null : block.id)}
                    className="p-1.5 bg-white text-amber-500 rounded-full hover:bg-amber-500 hover:text-white border border-amber-100 shadow hover:scale-110 transition-all"
                    title="Critical Analysis"
                 ><IconInfo /></button>
              </div>

              {/* BLOCK CONTENT RENDERER */}
              <div className="relative">
                
                {/* 1. Critical Analysis Popover (The "Info" View) */}
                {analyzingBlockId === block.id && (
                    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4 animate-in slide-in-from-left-2 shadow-sm print:hidden">
                        <div className="flex gap-3 items-start">
                            <div className="mt-0.5"><IconAlert /></div>
                            <div>
                                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Critical Analysis</h4>
                                <p className="text-sm text-amber-900 leading-relaxed">
                                    {docAnalysis && docAnalysis.block_analyses && docAnalysis.block_analyses[idx] 
                                        ? docAnalysis.block_analyses[idx] 
                                        : "Analysis pending for this specific clause..."}
                                </p>
                            </div>
                            <button onClick={()=>setAnalyzingBlockId(null)} className="ml-auto text-amber-400 hover:text-amber-700"><IconX/></button>
                        </div>
                    </div>
                )}

                {/* 2. Improvement Diff View (The "Plus" View) */}
                {improvingBlockId === block.id ? (
                    <div className="bg-indigo-50/50 rounded-xl border border-indigo-200 p-4 -ml-4 -mr-4 ring-4 ring-indigo-50 print:hidden">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 opacity-60 border-b md:border-b-0 md:border-r border-indigo-200 pb-4 md:pb-0 md:pr-4">
                                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Original</div>
                                <p className="text-gray-600 text-sm leading-relaxed font-serif line-through decoration-red-300 decoration-2">{block.text}</p>
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-indigo-600 uppercase mb-2 flex items-center gap-2"><IconSparkles /> AI Suggestion</div>
                                {loadingImprovement ? (
                                    <div className="flex items-center gap-2 text-indigo-400 text-sm py-8 justify-center"><div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>Polishing...</div>
                                ) : (
                                    <p className="text-gray-900 text-sm leading-relaxed font-serif font-medium bg-white px-4 py-3 rounded-lg shadow-sm border border-indigo-100">{improvementResult}</p>
                                )}
                            </div>
                        </div>
                        {!loadingImprovement && (
                            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-indigo-100">
                                <button onClick={() => setImprovingBlockId(null)} className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-gray-500 hover:text-red-600 rounded-lg uppercase">Reject</button>
                                <button onClick={() => acceptImprovement(block.id, improvementResult)} className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md uppercase">Accept</button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* 3. Standard Text View */
                    <p className="text-gray-800 leading-relaxed text-[15px] font-serif whitespace-pre-wrap hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors cursor-text border border-transparent hover:border-gray-100 print:text-black print:text-xs">
                        {block.text}
                    </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM PROMPT BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 p-6 z-40 print:hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* SUGGESTION BUTTONS */}
          {docAnalysis && docAnalysis.suggestions && !draftOptions && (
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest py-1.5 whitespace-nowrap">Suggested Actions:</span>
                {docAnalysis.suggestions.map((sugg, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleDraft(sugg)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-300 transition-colors whitespace-nowrap shadow-sm"
                    >
                        + {sugg}
                    </button>
                ))}
             </div>
          )}

          {/* Draft Options (A/B) */}
          {draftOptions && (
            <div className="flex flex-col md:flex-row gap-4 animate-in slide-in-from-bottom-5">
              <div onClick={() => selectDraftOption(draftOptions.option_a.text)} className="flex-1 cursor-pointer group bg-white border border-gray-200 p-4 rounded-xl shadow hover:border-indigo-500 hover:shadow-md transition relative">
                <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase">Option A</span><span className="text-xs text-gray-500">{draftOptions.option_a.title}</span></div>
                <p className="text-sm text-gray-700 line-clamp-3 group-hover:line-clamp-none font-serif">{draftOptions.option_a.text}</p>
              </div>
              <div onClick={() => selectDraftOption(draftOptions.option_b.text)} className="flex-1 cursor-pointer group bg-white border border-gray-200 p-4 rounded-xl shadow hover:border-emerald-500 hover:shadow-md transition relative">
                <div className="flex justify-between mb-2"><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase">Option B</span><span className="text-xs text-gray-500">{draftOptions.option_b.title}</span></div>
                <p className="text-sm text-gray-700 line-clamp-3 group-hover:line-clamp-none font-serif">{draftOptions.option_b.text}</p>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="relative group">
            <input 
              type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleDraft()}
              placeholder="Ask AI to draft a clause..."
              className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all"
              disabled={loadingDraft}
            />
            <button onClick={() => handleDraft()} disabled={loadingDraft || !prompt} className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center justify-center shadow-md">
               {loadingDraft ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <IconSend />}
            </button>
          </div>
          
          <div className="flex justify-between items-center pt-1">
             <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Powered by JuriScope AI</div>
             <button onClick={exportPdf} disabled={!docBlocks.length} className="text-xs font-semibold text-gray-500 hover:text-indigo-600 underline disabled:opacity-50">Print / Save PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drafting;