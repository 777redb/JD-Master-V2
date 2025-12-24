
import React, { useState, useRef, useMemo } from 'react';
import { generateGeneralLegalAdvice } from '../services/gemini';
import { JURISPRUDENCE_TOPICS } from '../constants';
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
  Sparkles
} from 'lucide-react';

type Theme = 'light' | 'sepia' | 'dark' | 'night';
type LegalFont = 'font-serif' | 'font-crimson' | 'font-sans' | 'font-mono';

const THEMES: Record<Theme, { bg: string, text: string, ui: string, border: string, prose: string, pageBg: string }> = {
  light: { 
    bg: 'bg-slate-100', 
    text: 'text-slate-900', 
    ui: 'bg-white border-slate-200',
    border: 'border-slate-200',
    prose: 'prose-slate',
    pageBg: 'bg-white'
  },
  sepia: { 
    bg: 'bg-[#eaddcf]', 
    text: 'text-[#463525]', 
    ui: 'bg-[#f4ecd8] border-[#d3c4b1]',
    border: 'border-[#d3c4b1]',
    prose: 'prose-amber',
    pageBg: 'bg-[#fbf7f0]'
  },
  dark: { 
    bg: 'bg-[#0f172a]', 
    text: 'text-slate-300', 
    ui: 'bg-[#1e293b] border-slate-700',
    border: 'border-slate-700',
    prose: 'prose-invert',
    pageBg: 'bg-[#1e293b]'
  },
  night: { 
    bg: 'bg-black', 
    text: 'text-gray-400', 
    ui: 'bg-gray-900 border-gray-800',
    border: 'border-gray-800',
    prose: 'prose-invert',
    pageBg: 'bg-[#0a0a0a]'
  }
};

const FONT_OPTIONS: { label: string, value: LegalFont, desc: string }[] = [
  { label: 'Merriweather', value: 'font-serif', desc: 'Standard Legal' },
  { label: 'Crimson Pro', value: 'font-crimson', desc: 'Book / Classic' },
  { label: 'Inter', value: 'font-sans', desc: 'Modern Clean' },
  { label: 'JetBrains Mono', value: 'font-mono', desc: 'Technical' },
];

export const Jurisprudence: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [activeTopicTitle, setActiveTopicTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Navigation State
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    // Expand the first category by default
    return { [JURISPRUDENCE_TOPICS[0].category]: true };
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

  // Filter topics based on search string
  const filteredTopics = useMemo(() => {
    if (!sidebarSearch) return JURISPRUDENCE_TOPICS;
    const search = sidebarSearch.toLowerCase();
    return JURISPRUDENCE_TOPICS.map(cat => ({
      ...cat,
      topics: cat.topics.filter(t => t.title.toLowerCase().includes(search) || t.query.toLowerCase().includes(search))
    })).filter(cat => cat.topics.length > 0);
  }, [sidebarSearch]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSearch = async (searchQuery: string, topicTitle?: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setActiveTopicTitle(topicTitle || searchQuery);
    setResult('');
    
    try {
      const prompt = `
      Act as an expert **Supreme Court Reporter and Legal Treatise Author**. 
      Create a definitive **Jurisprudential Guide** on the subject: "${searchQuery}".
      
      **STRICT OUTPUT FORMAT (CLEAN SEMANTIC HTML ONLY):**
      
      <h1>${(topicTitle || searchQuery).toUpperCase()}</h1>
      
      <h3>I. DOCTRINAL DEFINITION & LEGAL BASIS</h3>
      <p>[Provide a precise legal definition. Cite the specific Article, Section, or Republic Act number. Explain the *Ratio Legis* (Reason of the Law).]</p>
      
      <h3>II. REQUISITES & SCOPE</h3>
      <p>Under controlling jurisprudence, the following conditions must be met for this doctrine to apply:</p>
      <ul>
         <li><strong>[Requisite 1]</strong>: [Explanation]</li>
         <li><strong>[Requisite 2]</strong>: [Explanation]</li>
      </ul>
      
      <h3>III. LANDMARK SUPREME COURT RULINGS</h3>
      <p>The core of this doctrine is best illustrated in the following cases:</p>
      
      <blockquote>
        <strong>[Case Name], G.R. No. [XXXXX], [Date]</strong><br/>
        "[Insert the exact *Ratio Decidendi* or ruling from the case. Be precise and cite the Volume and Page if possible.]"
      </blockquote>
      
      <p><strong>Case Analysis:</strong> [Briefly explain why this case is the lead authority and how it changed or solidified the law.]</p>
      
      <hr />
      
      <h3>IV. CONTEMPORARY APPLICATIONS & RECENT TRENDS</h3>
      <p>[Discuss how the modern Supreme Court (e.g., under the Leonen or Gesmundo court) handles this doctrine. Are there recent modifications or strict requirements? List 1-2 recent cases if possible.]</p>
      
      <h3>V. EXCEPTIONS & DISTINCTIONS</h3>
      <p>[Clearly state when this doctrine DOES NOT apply. Distinguish it from similar or competing doctrines (e.g., Distinction between X and Y).]</p>
      
      <div class="end-marker">*** DOCTRINAL END ***</div>

      **CRITICAL INSTRUCTIONS:**
      - Return ONLY plain HTML tags. NO class attributes.
      - Use H1 for the main title, H3 for major sections.
      - Ensure paragraphs are substantial and authoritative.
      - Mimic the tone of a Justice writing a landmark decision.
      `;
      
      const res = await generateGeneralLegalAdvice(prompt);
      setResult(res);
      // Reset scroll
      if (contentRef.current) contentRef.current.scrollTop = 0;
    } catch (err) {
      setResult("<p>Error retrieving jurisprudence. Please try again.</p>");
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
    span.className = "bg-amber-200 text-black px-1 rounded";
    try {
      range.surroundContents(span);
      selection.removeAllRanges();
    } catch (e) {
      console.error("Complex range selection highlighting not supported.");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `<html><head><style>body{font-family:serif;padding:40px;line-height:1.6;}</style></head><body>${result}</body></html>`
    ], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `${activeTopicTitle.replace(/\s+/g, '_')}_Jurisprudence.html`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden selection:bg-amber-100">
      
      {/* Dynamic Reader Styles */}
      <style>{`
        .juris-content {
          text-align: ${textAlign};
          line-height: 1.8;
          hyphens: auto;
        }
        .juris-content h1 { text-align: center; font-weight: 800; text-transform: uppercase; margin: 3rem 0; border-bottom: 3px double currentColor; padding-bottom: 1.5rem; text-indent: 0; }
        .juris-content h3 { font-weight: 700; text-transform: uppercase; margin-top: 3rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.1); font-size: 1.25em; text-indent: 0; }
        .juris-content p { margin-bottom: 1rem; text-indent: 2.5em; }
        .juris-content h1 + p, .juris-content h3 + p, .juris-content h4 + p, .juris-content hr + p { text-indent: 0; }
        .juris-content blockquote { margin: 2rem; padding: 1.5rem; border-left: 4px solid #b45309; background: rgba(0,0,0,0.02); font-style: italic; text-indent: 0; }
        .juris-content ul { padding-left: 2rem; list-style: disc; margin-bottom: 1.5rem; }
        .juris-content li { margin-bottom: 0.5rem; text-indent: 0; }
        .juris-content .end-marker { text-align: center; margin-top: 4rem; opacity: 0.3; font-size: 0.7rem; letter-spacing: 0.3em; text-indent: 0; }
      `}</style>

      {/* Top Navigation Bar */}
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
           <Scale className="text-amber-600" size={24} />
           <div className="hidden lg:block">
              <h2 className="font-serif font-bold text-slate-900 leading-tight">Jurisprudence Explorer</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Supreme Court Doctrinal Database</p>
           </div>
        </div>
        
        <form onSubmit={handleManualSearch} className="flex-1 max-w-xl mx-8 relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctrine or case (e.g. 'Miranda Rights' or 'GR 123456')..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-transparent group-focus-within:bg-white group-focus-within:border-amber-500 border rounded-xl text-sm transition-all outline-none font-medium shadow-inner"
            />
            <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
        </form>

        <div className="flex items-center gap-2">
           <button onClick={handleDownload} disabled={!result} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-30 transition-colors" title="Download Treatise">
              <Download size={20} />
           </button>
           <div className="w-px h-6 bg-slate-200 mx-1"></div>
           <button onClick={() => setShowAppearance(!showAppearance)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Settings">
              <Settings size={20} />
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Navigation */}
        <div className={`
           border-r border-slate-200 flex flex-col bg-slate-50 transition-all duration-300 absolute lg:relative z-30 h-full
           ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0 overflow-hidden opacity-0 lg:opacity-100'}
        `}>
           <div className="p-4 bg-white border-b border-slate-200">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Filter subjects..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-amber-200 border rounded-lg text-xs outline-none transition-all"
                />
                <Filter className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                {sidebarSearch && (
                  <button onClick={() => setSidebarSearch('')} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600">
                    <X size={14}/>
                  </button>
                )}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
              {filteredTopics.map((category, idx) => (
                <div key={idx} className="mb-1">
                  <button 
                    onClick={() => toggleCategory(category.category)}
                    className={`w-full flex items-center justify-between p-3.5 hover:bg-white transition-colors text-left group
                      ${expandedCategories[category.category] ? 'bg-white' : ''}
                    `}
                  >
                    <span className="font-serif font-bold text-slate-800 text-sm group-hover:text-amber-800">{category.category}</span>
                    {expandedCategories[category.category] ? <ChevronDown size={14} className="text-amber-600"/> : <ChevronRight size={14} className="text-slate-300"/>}
                  </button>
                  
                  {expandedCategories[category.category] && (
                    <div className="bg-white/50 border-b border-slate-100">
                      {category.topics.map((topic, tIdx) => (
                         <button
                           key={tIdx}
                           onClick={() => handleSearch(topic.query, topic.title)}
                           className={`w-full text-left py-2.5 px-4 pl-8 text-xs border-l-2 transition-all hover:bg-amber-50 group
                             ${activeTopicTitle === topic.title ? 'border-amber-500 bg-amber-50/50 font-bold text-amber-900' : 'border-transparent text-slate-500 hover:text-slate-900'}
                           `}
                         >
                           <div className="flex items-center gap-2">
                             <div className={`w-1 h-1 rounded-full ${activeTopicTitle === topic.title ? 'bg-amber-500' : 'bg-slate-300 group-hover:bg-amber-300'}`}></div>
                             {topic.title}
                           </div>
                         </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {filteredTopics.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-xs text-slate-400 italic">No matching topics found.</p>
                </div>
              )}
           </div>
        </div>

        {/* Reader Display Panel */}
        <div className={`flex-1 flex flex-col relative transition-colors duration-300 ${currentTheme.bg}`}>
           
           {/* Appearance Popover */}
           {showAppearance && (
              <div className="absolute right-6 top-4 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 text-slate-900">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reading Preferences</span>
                  <button onClick={() => setShowAppearance(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-600 block mb-2">Paper Theme</span>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.keys(THEMES).map((t) => (
                        <button 
                          key={t} 
                          onClick={() => setTheme(t as Theme)}
                          className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-amber-500 ring-2 ring-amber-500' : 'border-slate-200'}`}
                          title={t}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-600 block mb-2">Typography</span>
                    <div className="grid grid-cols-2 gap-2">
                      {FONT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setFontFamily(opt.value)}
                          className={`p-2 text-xs text-left border rounded-lg transition-all
                            ${fontFamily === opt.value ? 'bg-amber-50 border-amber-500 font-bold' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-600 block mb-2">Zoom</span>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                      <button onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))} className="flex-1 flex justify-center py-1.5 hover:bg-white rounded"><ZoomOut size={14}/></button>
                      <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="flex-1 flex justify-center py-1.5 hover:bg-white rounded"><ZoomIn size={14}/></button>
                    </div>
                  </div>
                </div>
              </div>
           )}

           {/* Toolbar for Content Actions */}
           <div className={`px-6 py-3 border-b flex justify-between items-center z-10 shrink-0 ${currentTheme.ui}`}>
              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                   className={`p-1.5 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`}
                   title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                 >
                   {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                 </button>
                 {!isSidebarOpen && activeTopicTitle && (
                    <div className="flex items-center gap-2">
                      <div className="w-px h-4 bg-slate-300 mx-1"></div>
                      <span className={`text-sm font-bold font-serif ${currentTheme.text}`}>{activeTopicTitle}</span>
                    </div>
                 )}
              </div>
              
              <div className="flex items-center gap-3">
                 {result && (
                   <>
                    <button onClick={handleHighlight} className={`p-1.5 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Highlight Text"><Highlighter size={18}/></button>
                    <button onClick={() => setIsEditing(!isEditing)} className={`p-1.5 rounded-lg hover:bg-black/5 transition-colors ${isEditing ? 'text-amber-500' : currentTheme.text}`} title="Edit Mode"><Edit3 size={18}/></button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                   </>
                 )}
                 <button className={`p-1.5 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Toggle Reader Mode"><Sparkles size={18}/></button>
              </div>
           </div>

           {/* Reading Surface */}
           <div 
             className={`flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth ${currentTheme.bg}`} 
             ref={contentRef}
           >
              {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-70">
                      <Loader2 className="animate-spin text-amber-600 mb-6" size={64} />
                      <p className={`font-serif text-2xl font-bold italic animate-pulse ${currentTheme.text}`}>Drafting Integrated Jurisprudence...</p>
                      <p className={`text-sm mt-2 font-medium ${currentTheme.text} opacity-60`}>Syllabus Aligned Doctrinal Summary</p>
                  </div>
              ) : result ? (
                 <div className={`max-w-[8.5in] mx-auto min-h-[11in] shadow-2xl rounded-sm transition-all duration-500 ${currentTheme.pageBg} ${currentTheme.text} ${fontFamily}`}>
                    <div 
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        className={`py-16 px-12 md:px-20 outline-none juris-content transition-all`}
                        style={{ fontSize: `${effectiveFontSize}px` }}
                        dangerouslySetInnerHTML={{ __html: result }} 
                    />
                 </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 border-double ${currentTheme.border}`}>
                        <Gavel size={64} className={currentTheme.text} />
                    </div>
                    <h3 className={`text-3xl font-serif font-bold mb-4 ${currentTheme.text}`}>Jurisprudence Library</h3>
                    <p className={`text-lg text-center max-w-sm leading-relaxed ${currentTheme.text}`}>Select a specialized Bar subject or search for a specific landmark case to begin your research.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
