
import React, { useState, useRef } from 'react';
import { analyzeLegalResearch } from '../services/gemini';
import { 
  Briefcase, 
  Wand2, 
  Loader2, 
  FileText, 
  Scale, 
  Shield, 
  Search, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  Printer, 
  Copy,
  Layout,
  BookOpen,
  ArrowRight,
  Info,
  Settings,
  X,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignJustify,
  Maximize2,
  Minimize2,
  FileEdit,
  // Added Sparkles to imports
  Sparkles
} from 'lucide-react';

type Theme = 'light' | 'sepia' | 'dark' | 'night';
type LegalFont = 'font-serif' | 'font-crimson' | 'font-sans' | 'font-mono';

const THEMES: Record<Theme, { bg: string, text: string, ui: string, border: string, prose: string, pageBg: string, accent: string }> = {
  light: { bg: 'bg-slate-100', text: 'text-slate-900', ui: 'bg-white border-slate-200', border: 'border-slate-200', prose: 'prose-slate', pageBg: 'bg-white', accent: 'text-violet-700' },
  sepia: { bg: 'bg-[#eaddcf]', text: 'text-[#463525]', ui: 'bg-[#f4ecd8] border-[#d3c4b1]', border: 'border-[#d3c4b1]', prose: 'prose-amber', pageBg: 'bg-[#fbf7f0]', accent: 'text-[#78350f]' },
  dark: { bg: 'bg-[#0f172a]', text: 'text-slate-300', ui: 'bg-[#1e293b] border-slate-700', border: 'border-slate-700', prose: 'prose-invert', pageBg: 'bg-[#1e293b]', accent: 'text-violet-400' },
  night: { bg: 'bg-black', text: 'text-gray-400', ui: 'bg-gray-900 border-gray-800', border: 'border-gray-800', prose: 'prose-invert', pageBg: 'bg-[#0a0a0a]', accent: 'text-gray-500' }
};

const FONT_OPTIONS: { label: string, value: LegalFont, desc: string }[] = [
  { label: 'Merriweather', value: 'font-serif', desc: 'Standard Legal' },
  { label: 'Crimson Pro', value: 'font-crimson', desc: 'Book / Classic' },
  { label: 'Inter', value: 'font-sans', desc: 'Modern Clean' },
  { label: 'JetBrains Mono', value: 'font-mono', desc: 'Technical' },
];

export const CaseBuild: React.FC = () => {
  const [facts, setFacts] = useState('');
  const [issues, setIssues] = useState('');
  const [parties, setParties] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [viewMode, setViewMode] = useState<'FORM' | 'READER'>('FORM');

  // Reader Settings
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [showAppearance, setShowAppearance] = useState(false);
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
  const contentRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES[theme];
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100));

  const handleBuild = async () => {
    if (!facts.trim() || !issues.trim()) return;
    
    setIsBuilding(true);
    setAnalysis('');
    
    try {
      const prompt = `
        ACT AS A SENIOR LITIGATION STRATEGIST.
        Build a comprehensive case file based on:
        PARTIES: ${parties}
        FACTS: ${facts}
        LEGAL ISSUES: ${issues}

        Structure the output as follows (HTML):
        1. <h3>THEORY OF THE CASE</h3>: Synthesize the facts into a winning narrative.
        2. <h3>PLAINTIFF/PROSECUTION ARGUMENTS</h3>: Bulleted list of legal and factual arguments.
        3. <h3>DEFENSE COUNTER-ARGUMENTS</h3>: Anticipate and address defense strategies.
        4. <h3>RELEVANT STATUTORY PROVISIONS</h3>: Cite specific PH codes (Civil, Criminal, etc).
        5. <h3>SUPPORTING JURISPRUDENCE</h3>: List relevant Supreme Court cases.
        6. <h3>EVIDENTIARY REQUIREMENTS</h3>: List necessary documents/witnesses to prove the theory.
      `;
      
      const result = await analyzeLegalResearch(prompt);
      setAnalysis(result);
      setViewMode('READER');
    } catch (e) {
      setAnalysis("<p>Error building case file. Please refine your inputs and try again.</p>");
    } finally {
      setIsBuilding(false);
    }
  };

  const handleReset = () => {
    if (confirm("Clear all inputs and start a new case?")) {
      setFacts('');
      setIssues('');
      setParties('');
      setAnalysis('');
      setViewMode('FORM');
    }
  };

  const handleCopy = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = analysis;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(text);
    alert("Strategy copied to clipboard.");
  };

  return (
    <div className={`h-full flex flex-col ${viewMode === 'FORM' ? 'bg-slate-50' : currentTheme.bg} transition-colors duration-300 overflow-hidden`}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .book-content { padding: 0 !important; margin: 0 !important; box-shadow: none !important; width: 100% !important; max-width: none !important; }
        }
        .book-content { text-align: ${textAlign}; line-height: 1.8; hyphens: auto; }
        .book-content h3 { text-align: center; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 3.5rem; margin-bottom: 1.5rem; line-height: 1.2; padding-bottom: 1rem; border-bottom: 3px double currentColor; text-indent: 0; }
        .book-content h4 { font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.1em; text-transform: uppercase; text-indent: 0; page-break-after: avoid; }
        .book-content p { margin-top: 0; margin-bottom: 0.75rem; text-indent: 2.5em; }
        .book-content h3 + p, .book-content h4 + p, .book-content div + p, .book-content blockquote + p { text-indent: 0; }
        .book-content .statute-box { border: 1px solid currentColor; background-color: rgba(0,0,0,0.03); padding: 1.5rem; margin: 2.5rem 0; border-radius: 2px; text-indent: 0; font-family: 'Merriweather', serif; position: relative; }
        .book-content blockquote { margin: 2rem 2.5rem; padding: 1rem 1.5rem; border-left: 4px solid #7c3aed; background-color: rgba(0,0,0,0.02); font-style: italic; text-indent: 0; }
        .book-content ul, .book-content ol { margin-top: 1rem; padding-left: 2rem; text-indent: 0; margin-bottom: 1.5rem; }
        .book-content li { margin-bottom: 0.5rem; text-indent: 0; }
        .book-content .end-marker { text-align: center; margin-top: 5rem; opacity: 0.3; font-size: 0.7rem; letter-spacing: 0.5em; text-indent: 0; border-top: 1px solid #eee; padding-top: 2rem; }
      `}</style>

      {/* Header */}
      <div className={`h-14 border-b flex items-center justify-between px-6 shrink-0 z-40 shadow-sm no-print ${viewMode === 'READER' ? currentTheme.ui : 'bg-white'}`}>
        <div className="flex items-center gap-3">
          <Briefcase className={viewMode === 'READER' ? currentTheme.text : 'text-violet-600'} size={20} />
          <h2 className={`text-sm font-bold tracking-tight ${viewMode === 'READER' ? currentTheme.text : 'text-slate-900'}`}>
            Case Build Studio {viewMode === 'READER' && <span className="opacity-50 font-normal">/ Strategy Review</span>}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          {viewMode === 'READER' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))} className={`p-1.5 rounded hover:bg-black/5 ${currentTheme.text}`}><ZoomOut size={16}/></button>
                <span className={`text-[10px] font-bold w-8 text-center ${currentTheme.text}`}>{zoomLevel}%</span>
                <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className={`p-1.5 rounded hover:bg-black/5 ${currentTheme.text}`}><ZoomIn size={16}/></button>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <button onClick={() => setShowAppearance(!showAppearance)} className={`p-2 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`}>
                <Settings size={18} />
              </button>
            </div>
          )}
          <div className="w-px h-4 bg-slate-200"></div>
          <button onClick={handleReset} className="text-xs font-bold text-slate-400 hover:text-red-600 px-3 py-1.5 rounded-lg transition-colors">
            New Case
          </button>
          {viewMode === 'READER' && (
            <button onClick={() => setViewMode('FORM')} className="text-xs font-bold bg-violet-600 text-white px-4 py-1.5 rounded-lg hover:bg-violet-700 shadow-md shadow-violet-600/20 transition-all">
              Edit Inputs
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Form View */}
        {viewMode === 'FORM' ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-[10px] font-black uppercase tracking-widest mb-4">
                   <Sparkles size={12} /> Strategic Synthesis
                </div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">Strategy Construction</h1>
                <p className="text-slate-500 text-lg leading-relaxed">Provide the fundamental elements of your case. Our AI will synthesize them into a professional, book-grade litigation strategy document.</p>
              </div>

              <div className="space-y-8 bg-white p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Scale size={14} className="text-violet-500" /> Parties Involved
                  </label>
                  <input 
                    value={parties}
                    onChange={(e) => setParties(e.target.value)}
                    placeholder="e.g. Juan Dela Cruz (Plaintiff) vs. XYZ Corp (Defendant)"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none font-medium transition-all text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-violet-500" /> Factual Background
                  </label>
                  <textarea 
                    value={facts}
                    onChange={(e) => setFacts(e.target.value)}
                    placeholder="Narrate the material facts in chronological order..."
                    className="w-full h-56 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none font-medium transition-all resize-none leading-relaxed text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield size={14} className="text-violet-500" /> Legal Issues & Questions
                  </label>
                  <textarea 
                    value={issues}
                    onChange={(e) => setIssues(e.target.value)}
                    placeholder="What specific legal questions need resolution?"
                    className="w-full h-32 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none font-medium transition-all resize-none leading-relaxed text-slate-900"
                  />
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={handleBuild}
                    disabled={isBuilding || !facts || !issues}
                    className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-4 group"
                  >
                    {isBuilding ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Synthesizing Theory...
                      </>
                    ) : (
                      <>
                        <Wand2 size={24} />
                        Construct Litigation Strategy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-12 mb-20 p-6 rounded-2xl bg-slate-100 border border-slate-200 flex gap-4 items-start opacity-70">
                 <Info className="text-slate-400 mt-1 shrink-0" size={20} />
                 <p className="text-xs text-slate-600 leading-relaxed font-medium">
                   <strong>Legal Disclaimer:</strong> The Case Build tool is an AI assistant designed for law students and legal researchers. The generated strategy should be reviewed by a licensed legal professional before use in actual litigation.
                 </p>
              </div>
            </div>
          </div>
        ) : (
          /* Reader View */
          <div className={`flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth animate-in fade-in zoom-in-95 duration-500 custom-scrollbar`} ref={contentRef}>
            
            {/* Appearance Settings Popover */}
            {showAppearance && (
              <div className="absolute right-6 top-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50 text-slate-900 animate-in fade-in slide-in-from-top-4 no-print">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Strategy Display</span>
                  <button onClick={() => setShowAppearance(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                </div>
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-3">Typography</span>
                    <div className="grid grid-cols-2 gap-2">
                      {FONT_OPTIONS.map(font => (
                        <button key={font.value} onClick={() => setFontFamily(font.value)} className={`p-2.5 text-left border rounded-lg transition-all ${fontFamily === font.value ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500' : 'bg-white border-slate-200'}`}>
                          <span className={`block text-[13px] font-medium ${font.value}`}>{font.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Alignment</span>
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
                      <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow text-violet-700' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
                      <button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded ${textAlign === 'justify' ? 'bg-white shadow text-violet-700' : 'text-slate-500'}`}><AlignJustify size={16}/></button>
                    </div>
                  </div>
                  <div>
                     <span className="text-xs font-bold text-slate-700 block mb-3">Study Mode</span>
                     <div className="grid grid-cols-4 gap-2">
                        {Object.keys(THEMES).map((t) => (
                           <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-violet-600 ring-2 ring-violet-600' : 'border-slate-200'}`} title={t} />
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}

            <div className="max-w-6xl mx-auto">
               <div className={`min-h-[11in] shadow-2xl rounded-sm py-24 px-12 md:px-24 mb-20 relative overflow-hidden transition-all duration-500 ${currentTheme.pageBg} ${currentTheme.text} ${fontFamily}`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-3xl -mr-32 -mt-32"></div>
                  
                  <div className="border-b-2 border-slate-900 pb-12 mb-16 text-center relative z-10 no-print" style={{ borderColor: 'currentColor' }}>
                     <div className="flex justify-between items-start absolute right-0 top-0 opacity-40 hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                           <button onClick={handleCopy} className="p-2.5 rounded-lg hover:bg-black/5" title="Copy Strategy"><Copy size={18}/></button>
                           <button onClick={() => window.print()} className="p-2.5 rounded-lg hover:bg-black/5" title="Print Brief"><Printer size={18}/></button>
                        </div>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block opacity-60">Confidential Litigation Strategy Brief</span>
                     <h1 className="text-5xl font-serif font-black uppercase leading-[1.1] tracking-tight mb-6">
                       {parties || "Untitled Strategy Case"}
                     </h1>
                     <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest opacity-40">
                        <div className="flex items-center gap-2"><Scale size={12}/> Analysis Phase</div>
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <div className="flex items-center gap-2"><FileEdit size={12}/> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                     </div>
                  </div>

                  <div 
                    className="book-content transition-all"
                    style={{ fontSize: `${effectiveFontSize}px` }}
                    dangerouslySetInnerHTML={{ __html: analysis }}
                  />

                  <div className="mt-28 pt-10 border-t border-current/10 text-center opacity-30 italic font-serif text-[10px] tracking-widest">
                    *** END OF STRATEGY DOCUMENT - LEGALPH CONFIDENTIAL ***
                  </div>
               </div>
            </div>

            {/* Back to Top Floating */}
            <button 
               onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
               className="fixed bottom-10 right-10 p-4 bg-violet-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform no-print z-50 group"
            >
               <ChevronDown size={20} className="rotate-180 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
