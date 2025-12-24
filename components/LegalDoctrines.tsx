
import React, { useState, useRef, useMemo } from 'react';
import { generateGeneralLegalAdvice } from '../services/gemini';
import { LEGAL_DOCTRINES_ARCHIVE } from '../constants';
import { 
  Scale, 
  Search, 
  Loader2, 
  Gavel, 
  ChevronRight, 
  ChevronDown, 
  Settings,
  Printer,
  Download,
  Highlighter,
  ZoomIn,
  ZoomOut,
  PanelLeftClose,
  PanelLeftOpen,
  Edit3,
  X,
  Filter,
  FileText,
  Copy,
  History,
  Bookmark,
  Library,
  AlignLeft,
  AlignJustify
} from 'lucide-react';

type Theme = 'light' | 'sepia' | 'dark' | 'night';
type LegalFont = 'font-serif' | 'font-crimson' | 'font-sans' | 'font-mono';

const THEMES: Record<Theme, { bg: string, text: string, ui: string, border: string, prose: string, pageBg: string, accent: string }> = {
  light: { bg: 'bg-slate-100', text: 'text-slate-900', ui: 'bg-white border-slate-200', border: 'border-slate-200', prose: 'prose-slate', pageBg: 'bg-white', accent: 'text-blue-700' },
  sepia: { bg: 'bg-[#eaddcf]', text: 'text-[#463525]', ui: 'bg-[#f4ecd8] border-[#d3c4b1]', border: 'border-[#d3c4b1]', prose: 'prose-amber', pageBg: 'bg-[#fbf7f0]', accent: 'text-[#78350f]' },
  dark: { bg: 'bg-[#0f172a]', text: 'text-slate-300', ui: 'bg-[#1e293b] border-slate-700', border: 'border-slate-700', prose: 'prose-invert', pageBg: 'bg-[#1e293b]', accent: 'text-blue-400' },
  night: { bg: 'bg-black', text: 'text-gray-400', ui: 'bg-gray-900 border-gray-800', border: 'border-gray-800', prose: 'prose-invert', pageBg: 'bg-[#0a0a0a]', accent: 'text-gray-500' }
};

const FONT_OPTIONS: { label: string, value: LegalFont, desc: string }[] = [
  { label: 'Merriweather', value: 'font-serif', desc: 'Standard Legal' },
  { label: 'Crimson Pro', value: 'font-crimson', desc: 'Book / Classic' },
  { label: 'Inter', value: 'font-sans', desc: 'Modern Clean' },
  { label: 'JetBrains Mono', value: 'font-mono', desc: 'Technical' },
];

export const LegalDoctrines: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [activeTopicTitle, setActiveTopicTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Navigation State
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    LEGAL_DOCTRINES_ARCHIVE.forEach(c => {
        initial[c.category] = false;
    });
    if (LEGAL_DOCTRINES_ARCHIVE.length > 0) {
        initial[LEGAL_DOCTRINES_ARCHIVE[0].category] = true;
    }
    return initial;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Reader Appearance State
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [showAppearance, setShowAppearance] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
  const contentRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES[theme];
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100));

  const filteredTopics = useMemo(() => {
    if (!sidebarSearch) return LEGAL_DOCTRINES_ARCHIVE;
    const search = sidebarSearch.toLowerCase();
    return LEGAL_DOCTRINES_ARCHIVE.map(cat => ({
      ...cat,
      topics: cat.topics.filter(t => t.title.toLowerCase().includes(search) || t.query.toLowerCase().includes(search))
    })).filter(cat => cat.topics.length > 0);
  }, [sidebarSearch]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSearch = async (searchQuery: string, topicTitle?: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setActiveTopicTitle(topicTitle || searchQuery);
    setResult('');
    
    try {
      const prompt = `
      Act as an elite **Supreme Court Reporter and Legal Treatise Author** for a premium legal database like Westlaw. 
      Generate a definitive **Legal Doctrinal Treatise** on: "${searchQuery}".
      
      **OUTPUT STRUCTURE (SEMANTIC HTML):**
      
      <div class="legal-header">
        <h1>${(topicTitle || searchQuery).toUpperCase()}</h1>
        <div class="citation-block">Cite as: LegalPH Doctrines (2024 Edition)</div>
      </div>
      
      <div class="headnote">
        <h3>HEADNOTE / SYLLABUS</h3>
        <p>[Summarize the core legal question and the Court's ultimate resolution in 2-3 sentences. Identify the controlling statute.]</p>
      </div>

      <h3>I. DOCTRINAL DEFINITION & LEGAL BASIS</h3>
      <p>[Precise legal definition. Cite specific Article, Section, or RA. Explain the *Ratio Legis*.]</p>
      
      <h3>II. ELEMENTS & REQUISITES</h3>
      <p>The following criteria must be established for this doctrine to apply:</p>
      <ul>
         <li><strong>[Requisite 1]</strong>: [Detailed Explanation]</li>
         <li><strong>[Requisite 2]</strong>: [Detailed Explanation]</li>
      </ul>
      
      <div class="statute-box">
        <strong>CONTROLLING JURISPRUDENCE:</strong>
        <blockquote>
          <strong>[Case Name], G.R. No. [XXXXX], [Date]</strong><br/>
          "[Insert the exact *Ratio Decidendi*. Ensure professional typesetting with proper indentation.]"
        </blockquote>
      </div>
      
      <h3>III. JURISPRUDENTIAL EVOLUTION</h3>
      <p>[Discuss landmark cases from the past leading up to the modern interpretation.]</p>
      
      <hr />
      
      <h3>IV. EXCEPTIONS & DISTINCTIONS</h3>
      <p>[When does this NOT apply? Distinguish from similar doctrines.]</p>
      
      <div class="commentary">
        <h4>RESEARCHER COMMENTARY</h4>
        <p>[Add a critical analysis of current Court trends and Bar-readiness tips.]</p>
      </div>

      <div class="end-marker">*** END OF RESEARCH DOCUMENT ***</div>
      `;
      
      const res = await generateGeneralLegalAdvice(prompt);
      setResult(res);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    } catch (err) {
      setResult("<p>Error retrieving legal doctrine. System timeout or quota reached.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = "bg-blue-100 text-blue-900 border-b border-blue-300 px-0.5 rounded";
    try { range.surroundContents(span); selection.removeAllRanges(); } catch (e) { console.warn("Highlight failed."); }
  };

  const handlePrint = () => window.print();

  const handleCopyCitation = () => {
    const citation = `${activeTopicTitle}, LegalPH Doctrinal Archive (2024 Edition)`;
    navigator.clipboard.writeText(citation);
    alert('Citation copied to clipboard');
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      
      {/* High-End Database Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .book-content { padding: 0 !important; margin: 0 !important; box-shadow: none !important; width: 100% !important; }
        }
        .juris-content { text-align: ${textAlign}; line-height: 1.7; hyphens: auto; }
        .juris-content .legal-header { border-bottom: 2px solid #1e3a8a; margin-bottom: 2.5rem; padding-bottom: 1rem; text-align: center; }
        .juris-content h1 { font-weight: 900; font-size: 2.2rem; tracking: -0.02em; color: #0f172a; margin-bottom: 0.5rem; text-indent: 0; }
        .juris-content .citation-block { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: bold; }
        .juris-content .headnote { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.5rem; margin-bottom: 2rem; border-radius: 4px; text-indent: 0; }
        .juris-content .headnote h3 { margin-top: 0; font-size: 0.9rem; color: #1e3a8a; border: 0; padding: 0; letter-spacing: 0.2em; }
        .juris-content h3 { font-weight: 800; text-transform: uppercase; margin-top: 3rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; font-size: 1.15em; text-indent: 0; padding-bottom: 0.5rem; }
        .juris-content p { margin-bottom: 1.25rem; text-indent: 2.5em; }
        .juris-content h1 + p, .juris-content h3 + p, .juris-content h4 + p, .juris-content div + p, .juris-content blockquote + p { text-indent: 0; }
        .juris-content blockquote { margin: 2rem 3rem; padding: 1.5rem; border-left: 5px solid #1e3a8a; background: #f1f5f9; font-style: normal; text-indent: 0; font-family: 'Merriweather', serif; font-size: 0.95em; }
        .juris-content ul { padding-left: 2rem; list-style: disc; margin-bottom: 1.5rem; }
        .juris-content li { margin-bottom: 0.75rem; text-indent: 0; }
        .juris-content .statute-box { margin: 2rem 0; border: 1px solid #cbd5e1; border-radius: 2px; }
        .juris-content .commentary { border: 1px dashed #94a3b8; padding: 1.5rem; margin-top: 3rem; border-radius: 8px; text-indent: 0; font-size: 0.9em; background: #fff; }
        .juris-content .end-marker { text-align: center; margin-top: 5rem; opacity: 0.3; font-size: 0.7rem; letter-spacing: 0.5em; text-indent: 0; border-top: 1px solid #eee; padding-top: 2rem; }
      `}</style>

      {/* Database Main Header */}
      <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-40 shadow-sm shrink-0 no-print">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center text-white shadow-sm">
              <Library size={18} />
           </div>
           <div>
              <h2 className="text-xs font-black text-blue-900 uppercase tracking-widest leading-none">Legal Doctrines</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Premium Research Center</p>
           </div>
        </div>
        
        <form onSubmit={handleManualSearch} className="flex-1 max-w-2xl mx-12 relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Philippine Legal Doctrines..."
              className="w-full pl-10 pr-4 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-md text-sm transition-all outline-none font-medium"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
        </form>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 no-print">
              <button onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))} className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><ZoomOut size={16}/></button>
              <span className="text-[10px] font-bold text-slate-400 w-8 text-center">{zoomLevel}%</span>
              <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><ZoomIn size={16}/></button>
           </div>
           <div className="w-px h-4 bg-slate-200"></div>
           <button onClick={() => setShowAppearance(!showAppearance)} className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
              <Settings size={18} />
           </button>
        </div>
      </div>

      {/* Main UI Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Professional Sidebar Tree */}
        <div className={`
           border-r border-slate-200 flex flex-col bg-white transition-all duration-300 absolute lg:relative z-30 h-full no-print
           ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0 overflow-hidden opacity-0 lg:opacity-100'}
        `}>
           <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Research Archive</span>
              <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><History size={14}/></button>
           </div>

           <div className="p-3 bg-slate-50/50">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Filter subjects..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 focus:border-blue-400 rounded text-xs outline-none transition-all shadow-sm"
                />
                <Filter className="absolute left-2.5 top-2 text-slate-300" size={12} />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredTopics.map((category, idx) => (
                <div key={idx} className="border-b border-slate-50 last:border-0">
                  <button 
                    onClick={() => toggleCategory(category.category)}
                    className={`w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-left group
                      ${expandedCategories[category.category] ? 'bg-slate-50' : ''}
                    `}
                  >
                    <span className="font-sans font-bold text-slate-700 text-xs uppercase tracking-wider group-hover:text-blue-800">{category.category}</span>
                    {expandedCategories[category.category] ? <ChevronDown size={14} className="text-blue-700"/> : <ChevronRight size={12} className="text-slate-300"/>}
                  </button>
                  
                  {expandedCategories[category.category] && (
                    <div className="bg-white">
                      {category.topics.map((topic, tIdx) => (
                         <button
                           key={tIdx}
                           onClick={() => handleSearch(topic.query, topic.title)}
                           className={`w-full text-left py-2 px-4 pl-8 text-[13px] border-l-2 transition-all hover:bg-blue-50/50 group
                             ${activeTopicTitle === topic.title ? 'border-blue-700 bg-blue-50/50 font-bold text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'}
                           `}
                         >
                           {topic.title}
                         </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>

        {/* High-End Reading Room */}
        <div className={`flex-1 flex flex-col relative transition-colors duration-300 ${currentTheme.bg}`}>
           
           {/* Secondary Functional Toolbar */}
           <div className={`px-6 h-12 border-b flex justify-between items-center z-20 shrink-0 no-print ${currentTheme.ui}`}>
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-1.5 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Toggle Explorer">
                   {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                 </button>
                 <div className="w-px h-4 bg-slate-200"></div>
                 {activeTopicTitle && (
                    <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text}`}>Document View</span>
                       <ChevronRight size={10} className="text-slate-400" />
                       <span className={`text-xs font-serif italic truncate max-w-[200px] ${currentTheme.text} opacity-60`}>{activeTopicTitle}</span>
                    </div>
                 )}
              </div>
              
              <div className="flex items-center gap-1">
                 {result && (
                   <>
                    <button onClick={handleHighlight} className={`p-2 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Highlight Selection"><Highlighter size={16}/></button>
                    <button onClick={() => setIsEditing(!isEditing)} className={`p-2 rounded hover:bg-black/5 transition-colors ${isEditing ? 'bg-blue-100 text-blue-700' : currentTheme.text}`} title="Toggle Edit/Note Mode"><Edit3 size={16}/></button>
                    <button onClick={handleCopyCitation} className={`p-2 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Copy Proper Citation"><Copy size={16}/></button>
                    <div className="w-px h-4 bg-slate-200 mx-2"></div>
                   </>
                 )}
                 <button onClick={handlePrint} className={`p-2 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Print Document"><Printer size={16}/></button>
                 <button className={`p-2 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Bookmark Document"><Bookmark size={16}/></button>
              </div>
           </div>

           {/* Reading Surface */}
           <div className={`flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth scrollbar-hide`} ref={contentRef}>
              
              {/* Appearance Settings Popover */}
              {showAppearance && (
                <div className="absolute right-6 top-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50 text-slate-900 animate-in fade-in slide-in-from-top-4 no-print">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visual Controls</span>
                    <button onClick={() => setShowAppearance(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-3">Font Selection</span>
                      <div className="grid grid-cols-2 gap-2">
                        {FONT_OPTIONS.map(font => (
                          <button key={font.value} onClick={() => setFontFamily(font.value)} className={`p-2.5 text-left border rounded-lg transition-all ${fontFamily === font.value ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200'}`}>
                            <span className={`block text-[13px] font-medium ${font.value}`}>{font.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Alignment</span>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
                        <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
                        <button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded ${textAlign === 'justify' ? 'bg-white shadow text-blue-700' : 'text-slate-500'}`}><AlignJustify size={16}/></button>
                      </div>
                    </div>
                    <div>
                       <span className="text-xs font-bold text-slate-700 block mb-3">Research Environment</span>
                       <div className="grid grid-cols-4 gap-2">
                          {Object.keys(THEMES).map((t) => (
                             <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-blue-600 ring-2 ring-blue-600' : 'border-slate-200'}`} title={t} />
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 z-10 backdrop-blur-md">
                      <div className="relative">
                         <Loader2 className="animate-spin text-blue-800 mb-4" size={64} />
                         <Library size={24} className="absolute inset-0 m-auto text-blue-900" />
                      </div>
                      <p className={`font-serif text-2xl font-black tracking-tight text-slate-900`}>Analyzing Doctrinal History...</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-3 animate-pulse">Consulting Supreme Court Archive</p>
                  </div>
              ) : result ? (
                 <div 
                   className={`max-w-[8.5in] mx-auto min-h-[11in] shadow-2xl rounded-sm transition-all duration-500 ${currentTheme.pageBg} ${currentTheme.text} ${fontFamily}`}
                   style={{ fontSize: `${effectiveFontSize}px` }}
                 >
                    <div 
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        className={`py-20 px-16 md:px-24 outline-none juris-content transition-all`}
                        dangerouslySetInnerHTML={{ __html: result }} 
                    />
                 </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 select-none animate-in fade-in duration-1000">
                    <div className="relative mb-10">
                       <Library size={120} className="text-slate-100" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Scale size={64} className="text-blue-900/10" />
                       </div>
                    </div>
                    <h3 className="text-4xl font-serif font-bold text-slate-900 mb-4">Legal Doctrinal Library</h3>
                    <p className="text-center max-w-sm font-sans text-sm leading-relaxed text-slate-500">
                       Access the definitive repository of Philippine Legal Doctrines. Select a category from the archive or use the global research bar to synthesize precedents.
                    </p>
                    
                    <div className="mt-16 grid grid-cols-3 gap-12 max-w-2xl w-full">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-900/40"><FileText size={28}/></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Landmark Cases</span>
                       </div>
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-900/40"><Scale size={28}/></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ratio Legis</span>
                       </div>
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-900/40"><History size={28}/></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Precedents</span>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
