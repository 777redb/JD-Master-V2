
import React, { useState, useEffect, useRef } from 'react';
import { generateCaseDigest, getCaseSuggestions } from '../services/gemini';
import { 
  FileText, 
  Wand2, 
  Copy, 
  Loader2, 
  Search, 
  Settings, 
  Maximize2, 
  Minimize2,
  ZoomIn,
  ZoomOut,
  X,
  Sparkles,
  AlignLeft,
  AlignJustify
} from 'lucide-react';

type Theme = 'light' | 'sepia' | 'dark' | 'night';
type LegalFont = 'font-serif' | 'font-crimson' | 'font-sans' | 'font-mono';

const THEMES: Record<Theme, { bg: string, text: string, ui: string, border: string, prose: string, pageBg: string }> = {
  light: { 
    bg: 'bg-slate-200', 
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

export const CaseDigest: React.FC = () => {
  const [input, setInput] = useState('');
  const [digest, setDigest] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(true);

  // Reading Settings
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [showAppearance, setShowAppearance] = useState(false);
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');

  const currentTheme = THEMES[theme];
  // Base font size calculations to mimic print points (pt)
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100)); 
  const debounceTimer = useRef<any>(null);

  // Auto-suggest logic
  useEffect(() => {
    if (input.length > 2) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      
      debounceTimer.current = setTimeout(async () => {
        // Only fetch if input looks like a case title or query, not just random chars
        if (showSuggestions) return; // Don't fetch if already showing from previous
        try {
           const results = await getCaseSuggestions(input);
           if (results.length > 0) {
             setSuggestions(results);
             setShowSuggestions(true);
           }
        } catch (e) {
          console.error("Suggestion error", e);
        }
      }, 600); // 600ms debounce to save API calls
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input]);

  const handleSelectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    handleDigest(suggestion);
  };

  const handleDigest = async (overrideInput?: string) => {
    const query = overrideInput || input;
    if (!query.trim()) return;
    
    setIsProcessing(true);
    setDigest('');
    setShowSuggestions(false);
    
    // Auto-collapse input on mobile or small screens, or generally to focus on reading
    if (window.innerWidth < 768) setIsInputExpanded(false);

    try {
      const result = await generateCaseDigest(query);
      setDigest(result);
    } catch (e) {
      setDigest("<p>Failed to generate digest. Please try again.</p>");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = digest;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`h-full flex flex-col ${currentTheme.bg} transition-colors duration-300 relative`}>
      {/* 
         Dynamic CSS Injection for "Book-Grade" Typography.
         Strict adherence to typesetting rules.
      */}
      <style>{`
        .book-content {
          text-align: ${textAlign};
          line-height: 1.7; /* Relaxed leading for readability */
          hyphens: auto;
        }

        /* HEADINGS */
        .book-content h1, .book-content h2, .book-content h3 {
          text-align: center;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          padding-bottom: 1rem;
          border-bottom: 3px double ${theme === 'light' ? '#1e293b' : 'currentColor'};
          text-indent: 0;
        }
        
        .book-content h3 {
           font-size: 1.25em;
           border-bottom-width: 1px;
           border-style: solid;
        }

        .book-content h4 {
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.1em;
          text-transform: uppercase;
          text-indent: 0;
          page-break-after: avoid;
          color: ${theme === 'light' ? '#b45309' : theme === 'sepia' ? '#78350f' : 'inherit'}; /* Amber-700 for light */
        }

        /* PARAGRAPH INDENTATION LOGIC */
        /* Standard: Indent all paragraphs by default */
        .book-content p {
          margin-top: 0;
          margin-bottom: 0.75rem;
          text-indent: 2.5em; 
        }
        
        /* EXCEPTION: No indent for the first paragraph after a heading (Typographic Standard) */
        .book-content h1 + p,
        .book-content h3 + p,
        .book-content h4 + p,
        .book-content hr + p,
        .book-content div + p,
        .book-content blockquote + p {
          text-indent: 0;
        }

        /* LISTS */
        .book-content ul, .book-content ol {
          margin-top: 1rem;
          margin-bottom: 1.5rem;
          padding-left: 2rem;
          text-indent: 0; /* Reset indent for list container */
        }
        
        .book-content li {
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
          text-indent: 0; /* Reset indent for list items */
        }
        
        .book-content li p {
          text-indent: 0; 
          margin-bottom: 0;
        }

        /* BLOCKQUOTES (Annotations/Jurisprudence) */
        .book-content blockquote {
          margin: 2rem 2.5rem;
          padding: 1rem 1.5rem;
          border-left: 3px solid ${theme === 'light' || theme === 'sepia' ? '#b45309' : '#fbbf24'};
          background-color: ${theme === 'light' ? 'rgba(0,0,0,0.03)' : theme === 'sepia' ? 'rgba(91, 70, 54, 0.05)' : 'rgba(255,255,255,0.05)'};
          font-style: italic;
          font-size: 0.95em;
          text-indent: 0;
        }

        /* UTILS */
        .book-content strong { font-weight: 700; color: inherit; }
        .book-content em { font-style: italic; color: inherit; }
        .book-content hr { 
          border: 0; 
          border-top: 1px solid ${theme === 'light' || theme === 'sepia' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}; 
          margin: 3rem auto; 
          width: 40%;
        }
      `}</style>
      
      {/* Top Bar: Controls & Input */}
      <div className={`border-b z-20 sticky top-0 transition-all duration-300 ease-in-out ${currentTheme.ui} shadow-md ${isInputExpanded ? 'py-4' : 'py-2'}`}>
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-6 flex items-start gap-4">
          
          {/* Input Area */}
          {isInputExpanded ? (
            <div className="flex-1 relative">
              <div className="flex flex-col gap-2">
                 <div className="flex items-center justify-between">
                    <label className={`text-xs font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Supreme Court Case / G.R. Number
                    </label>
                 </div>
                 <div className="relative group">
                    <input
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        if(e.target.value.length === 0) setShowSuggestions(false);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleDigest()}
                      placeholder="e.g., 'Chi Ming Tsoi' or 'G.R. No. 119190'..."
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border outline-none text-base font-medium transition-all
                         ${theme === 'light' 
                           ? 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500 text-slate-900' 
                           : 'bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/20 text-slate-100 placeholder-slate-500'}
                      `}
                    />
                    <Search className={`absolute left-3.5 top-3.5 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} size={18} />
                    
                    {/* Input Actions */}
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      {input && (
                         <button 
                           onClick={() => { setInput(''); setShowSuggestions(false); }}
                           className="p-1.5 hover:bg-black/10 rounded-full text-slate-400 transition-colors"
                         >
                           <X size={14} />
                         </button>
                      )}
                    </div>

                    {/* Auto-Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                         <div className="bg-amber-50 px-3 py-1.5 flex items-center gap-2 border-b border-amber-100">
                            <Sparkles size={12} className="text-amber-600" />
                            <span className="text-[10px] font-bold text-amber-700 uppercase">AI Suggestions</span>
                         </div>
                         {suggestions.map((s, idx) => (
                           <button
                             key={idx}
                             onClick={() => handleSelectSuggestion(s)}
                             className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium text-slate-700 border-b border-slate-50 last:border-0 flex items-center gap-3 group"
                           >
                             <Search size={14} className="text-slate-300 group-hover:text-amber-500" />
                             {s}
                           </button>
                         ))}
                      </div>
                    )}
                 </div>
                 
                 <div className="flex justify-end">
                    <button
                      onClick={() => handleDigest()}
                      disabled={isProcessing || !input}
                      className="px-6 py-2 bg-slate-900 text-white rounded-lg shadow-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold text-sm transition-all"
                    >
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                      Generate Digest
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-between">
               <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-slate-300'}`}>
                    <FileText size={18} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                     <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Currently Viewing</span>
                     <span className={`text-sm font-bold truncate ${currentTheme.text}`}>{input || "Untitled Digest"}</span>
                  </div>
               </div>
               <button 
                 onClick={() => setIsInputExpanded(true)}
                 className={`text-xs font-bold hover:underline ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`}
               >
                 New Search
               </button>
            </div>
          )}

          {/* Toolbar Actions */}
          <div className="flex items-start gap-1 pt-1">
             <div className="relative">
                <button 
                  onClick={() => setShowAppearance(!showAppearance)}
                  className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`}
                  title="Reader Settings"
                >
                  <Settings size={20} />
                </button>
                
                 {/* Settings Popover */}
                {showAppearance && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 text-slate-900">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reader View</span>
                      <button onClick={() => setShowAppearance(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                    </div>

                    {/* Zoom */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold text-slate-600">Font Size</span>
                         <span className="text-xs text-slate-400">{zoomLevel}%</span>
                      </div>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))} className="flex-1 flex justify-center py-1.5 hover:bg-white rounded text-slate-600"><ZoomOut size={14}/></button>
                        <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="flex-1 flex justify-center py-1.5 hover:bg-white rounded text-slate-600"><ZoomIn size={14}/></button>
                      </div>
                    </div>

                    {/* Alignment */}
                    <div className="mb-4">
                       <span className="text-xs font-bold text-slate-600 block mb-2">Alignment</span>
                       <div className="flex bg-slate-100 rounded-lg p-1">
                          <button 
                            onClick={() => setTextAlign('left')} 
                            className={`flex-1 flex justify-center py-1.5 rounded transition-colors ${textAlign === 'left' ? 'bg-white shadow text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                             <AlignLeft size={16} />
                          </button>
                          <button 
                            onClick={() => setTextAlign('justify')} 
                            className={`flex-1 flex justify-center py-1.5 rounded transition-colors ${textAlign === 'justify' ? 'bg-white shadow text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                             <AlignJustify size={16} />
                          </button>
                       </div>
                    </div>

                    {/* Theme */}
                    <div className="mb-4">
                       <span className="text-xs font-bold text-slate-600 block mb-2">Paper Color</span>
                       <div className="grid grid-cols-4 gap-2">
                          {Object.keys(THEMES).map((t) => (
                             <button 
                                key={t} 
                                onClick={() => setTheme(t as Theme)}
                                className={`h-8 rounded-full border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200'}`}
                                title={t}
                             />
                          ))}
                       </div>
                    </div>
                    
                     {/* Font */}
                     <div>
                       <span className="text-xs font-bold text-slate-600 block mb-2">Typography</span>
                       <select 
                         value={fontFamily}
                         onChange={(e) => setFontFamily(e.target.value as LegalFont)}
                         className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
                       >
                         {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                       </select>
                    </div>
                  </div>
                )}
             </div>

             <button 
               onClick={() => setIsInputExpanded(!isInputExpanded)}
               className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`}
               title={isInputExpanded ? "Distraction Free Mode" : "Show Search"}
             >
               {isInputExpanded ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
             </button>
          </div>
        </div>
      </div>

      {/* Main Reading Area - Paper Simulation */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth ${currentTheme.bg}`}>
        {isProcessing ? (
           <div className="h-full flex flex-col items-center justify-center opacity-70">
              <Loader2 className={`animate-spin mb-4 ${theme === 'light' ? 'text-amber-800' : 'text-amber-500'}`} size={64} />
              <p className={`font-serif text-xl font-medium animate-pulse ${currentTheme.text}`}>Analyzing Case Jurisprudence...</p>
              <p className={`text-sm mt-2 opacity-60 ${currentTheme.text}`}>Extracting Facts, Issue, and Ruling</p>
           </div>
        ) : digest ? (
           <div 
             className={`
                max-w-[8.5in] mx-auto min-h-[11in] 
                ${currentTheme.pageBg} 
                ${fontFamily} 
                ${currentTheme.text}
                shadow-2xl 
                py-16 px-12 md:px-16
                mb-20
                rounded-sm
                transition-all duration-500
                book-content
             `}
             style={{ fontSize: `${effectiveFontSize}px` }}
           >
              {/* Digest Header */}
              <div className={`border-b-2 pb-6 mb-10 text-center ${theme === 'light' ? 'border-slate-900' : 'border-current'}`}>
                 <div className="flex justify-between items-start absolute right-16 top-16 opacity-50 hover:opacity-100 transition-opacity">
                    <button 
                      onClick={handleCopy}
                      className="p-2 rounded-lg hover:bg-black/5"
                      title="Copy to Clipboard"
                    >
                      <Copy size={20} />
                    </button>
                 </div>
                 <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Case Digest</span>
                 <h1 className="text-3xl font-bold mt-4 leading-tight uppercase tracking-tight">{input}</h1>
              </div>

              {/* Content */}
              <div 
                  dangerouslySetInnerHTML={{ __html: digest }} 
              />
              
              <div className="mt-20 pt-10 border-t border-current/20 text-center opacity-40">
                 <p className="text-xs uppercase tracking-widest">*** End of Digest ***</p>
              </div>
           </div>
        ) : (
           <div className="h-full flex flex-col items-center justify-center opacity-60">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 border-double ${currentTheme.border} ${currentTheme.pageBg} shadow-lg`}>
                  <FileText size={48} className={currentTheme.text} />
              </div>
              <h2 className={`text-3xl font-serif font-bold mb-4 ${currentTheme.text}`}>Case Digest AI</h2>
              <p className={`text-lg text-center max-w-md leading-relaxed opacity-80 ${currentTheme.text}`}>
                Enter a Case Name or G.R. Number to generate a structured, textbook-quality legal summary instantly.
              </p>
           </div>
        )}
      </div>
    </div>
  );
};
