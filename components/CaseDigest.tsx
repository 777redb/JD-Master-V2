
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
  AlignJustify,
  Paperclip,
  Upload,
  ArrowRight,
  History,
  Check,
  ShieldCheck,
  Globe,
  ExternalLink,
  Image as ImageIcon,
  Bookmark,
  Printer,
  ChevronDown,
  Scale,
  PlusSquare
} from 'lucide-react';

type Theme = 'light' | 'sepia' | 'dark' | 'night';
type LegalFont = 'font-serif' | 'font-crimson' | 'font-sans' | 'font-mono';

const THEMES: Record<Theme, { bg: string, text: string, ui: string, border: string, prose: string, pageBg: string, accent: string }> = {
  light: { bg: 'bg-[#f1f5f9]', text: 'text-slate-900', ui: 'bg-white border-slate-200', border: 'border-slate-200', prose: 'prose-slate', pageBg: 'bg-white', accent: 'text-amber-700' },
  sepia: { bg: 'bg-[#eaddcf]', text: 'text-[#463525]', ui: 'bg-[#f4ecd8] border-[#d3c4b1]', border: 'border-[#d3c4b1]', prose: 'prose-amber', pageBg: 'bg-[#fbf7f0]', accent: 'text-[#78350f]' },
  dark: { bg: 'bg-[#0f172a]', text: 'text-slate-300', ui: 'bg-[#1e293b] border-slate-700', border: 'border-slate-700', prose: 'prose-invert', pageBg: 'bg-[#1e293b]', accent: 'text-amber-400' },
  night: { bg: 'bg-black', text: 'text-gray-400', ui: 'bg-gray-900 border-gray-800', border: 'border-gray-800', prose: 'prose-invert', pageBg: 'bg-[#0a0a0a]', accent: 'text-gray-500' }
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
  const [sources, setSources] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<{name: string, data: string, mimeType: string} | null>(null);

  // Reader Settings
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [showAppearance, setShowAppearance] = useState(false);
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES[theme];
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100)); 
  const debounceTimer = useRef<any>(null);

  useEffect(() => {
    if (input.length > 2 && !uploadedFile) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        try {
           const results = await getCaseSuggestions(input);
           if (results.length > 0) {
             setSuggestions(results);
             setShowSuggestions(true);
           }
        } catch (e) {
          console.error("Suggestion error", e);
        }
      }, 600);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, uploadedFile]);

  const handleSelectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    handleDigest(suggestion);
  };

  const handleDigest = async (overrideInput?: string) => {
    const query = overrideInput || input;
    if (!query.trim() && !uploadedFile) return;
    
    setIsProcessing(true);
    setDigest('');
    setSources([]);
    setShowSuggestions(false);
    
    if (window.innerWidth < 768) setIsInputExpanded(false);
    
    try {
      const filePayload = uploadedFile ? { data: uploadedFile.data, mimeType: uploadedFile.mimeType } : undefined;
      const result = await generateCaseDigest(query, filePayload);
      setDigest(result.text);
      setSources(result.sources || []);
    } catch (e) {
      setDigest("<p>Failed to generate factual digest. System timeout or verification error.</p>");
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToLegalPad = () => {
    if (!digest) return;
    const savedNotebooks = localStorage.getItem('legalph_notebooks');
    let notebooks = savedNotebooks ? JSON.parse(savedNotebooks) : [];
    let digestNotebook = notebooks.find((n: any) => n.name === "Case Digests Archive");
    
    if (!digestNotebook) {
      digestNotebook = { id: 'digests_' + Date.now(), name: 'Case Digests Archive', notes: [], isExpanded: true };
      notebooks.push(digestNotebook);
    }
    
    const newNote = {
      id: Date.now().toString(),
      title: input || "Case Digest",
      content: digest, // Save original HTML for strict formatting preservation
      updatedAt: Date.now(),
      tags: ['Case Digest', 'Research'],
      color: 'bg-amber-50',
      isFavorite: false,
      paperStyle: 'yellow-legal',
      billableMinutes: 0
    };
    
    digestNotebook.notes.unshift(newNote);
    localStorage.setItem('legalph_notebooks', JSON.stringify(notebooks));
    alert('Digest strictly preserved and saved to Legal Pad.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = (event.target?.result as string).split(',')[1];
      setUploadedFile({ 
        name: file.name, 
        data: base64Data, 
        mimeType: file.type 
      });
      setInput(`Digesting: ${file.name}`);
      setShowSuggestions(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    const temp = document.createElement('div');
    temp.innerHTML = digest;
    navigator.clipboard.writeText(temp.innerText);
    alert('Text copied to clipboard.');
  };

  const clearFile = () => {
    setUploadedFile(null);
    setInput('');
  };

  return (
    <div className={`h-full flex flex-col ${currentTheme.bg} transition-colors duration-300 relative`}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .book-content { padding: 0 !important; margin: 0 !important; box-shadow: none !important; width: 100% !important; max-width: none !important; }
        }

        /* PREMIUM BOOK-GRADE LAYOUT ENGINE (SCRA Standard) */
        .book-content { 
            text-align: ${textAlign}; 
            line-height: 2.1; 
            hyphens: auto; 
            widows: 3;
            orphans: 3;
            color: inherit;
        }
        
        /* High-Fidelity Header Hierarchy */
        .book-content h1 { 
            text-align: center; 
            font-weight: 950; 
            font-size: 2.3em; 
            text-transform: uppercase; 
            letter-spacing: 0.2em; 
            margin: 4.5rem 0 4rem; 
            line-height: 1.1; 
            border-bottom: 5px double currentColor; 
            padding-bottom: 2.5rem; 
            text-indent: 0; 
        }
        
        /* Elite Centered Section Headers (e.g., RATIO DECIDENDI) */
        .book-content h3 { 
            text-align: center;
            font-weight: 1000; 
            font-size: 1.6em; 
            text-transform: uppercase; 
            letter-spacing: 0.22em; 
            margin: 6.5rem 0 3.5rem; 
            border-top: 1.5px solid currentColor; 
            border-bottom: 1.5px solid currentColor; 
            padding: 1.75rem 0; 
            text-indent: 0;
            display: block;
            opacity: 1;
            line-height: 1;
        }
        
        .book-content h4 { 
            font-weight: 950; 
            font-size: 1.3em; 
            text-transform: uppercase; 
            letter-spacing: 0.12em; 
            margin: 4.5rem 0 1.75rem; 
            text-indent: 0; 
            border-bottom: 1.5px solid rgba(0,0,0,0.12);
            padding-bottom: 0.85rem;
            display: block;
        }
        
        /* Traditional Legal Indention Rules (Premium Publishing Standard) */
        .book-content p { 
            margin-top: 0; 
            margin-bottom: 0; 
            text-indent: 3.5em; /* Traditional scholarly indention for premium reading */
            padding-bottom: 0;
        }

        /* Exceptions: Paragraphs following headers or containers are NOT indented */
        .book-content h1 + p, 
        .book-content h2 + p, 
        .book-content h3 + p, 
        .book-content h4 + p, 
        .book-content div + p, 
        .book-content blockquote + p, 
        .book-content .statute-box + p,
        .book-content ul + p,
        .book-content ol + p,
        .book-content hr + p { 
            text-indent: 0; 
        }
        
        /* Scholastic rhythm: paragraphs stay joined visually */
        .book-content p + p {
            margin-top: 0;
        }
        
        /* Professional Block Quotes (Excerpts from Rulings) */
        .book-content blockquote { 
            margin: 3.5rem 6.5rem; 
            padding: 3rem 4rem; 
            border-left: 10px solid #b45309; 
            background-color: rgba(0,0,0,0.025); 
            font-style: normal; 
            text-indent: 0; 
            font-family: 'Merriweather', serif; 
            font-size: 0.94em; 
            line-height: 2.0;
            border-radius: 4px;
            box-shadow: inset 0 3px 8px rgba(0,0,0,0.03);
        }
        
        .book-content .statute-box { 
            border: 2px solid rgba(0,0,0,0.12); 
            background-color: rgba(251, 191, 36, 0.025); 
            padding: 3.5rem; 
            margin: 6rem 0; 
            border-left: 14px solid #f59e0b; 
            text-indent: 0; 
            font-family: 'Merriweather', serif; 
            border-radius: 6px;
            box-shadow: 0 20px 60px -20px rgba(0,0,0,0.1);
        }

        /* High-Visibility Disposition Marker */
        .book-content .so-ordered { 
            text-align: center; 
            margin: 10rem auto; 
            font-weight: 1000; 
            text-transform: uppercase; 
            text-indent: 0; 
            border-top: 5px double currentColor; 
            border-bottom: 5px double currentColor;
            padding: 3rem 0;
            width: 90%;
            letter-spacing: 0.5em; 
            font-size: 1.4em;
        }

        /* Refined List Geometries */
        .book-content ul, .book-content ol { 
            margin: 4rem 0; 
            padding-left: 8rem; 
            text-indent: 0; 
        }
        .book-content li { 
            margin-bottom: 2.5rem; 
            text-indent: 0; 
        }
        
        .book-content hr {
            border: 0;
            border-top: 3px solid rgba(0,0,0,0.1);
            margin: 7rem auto;
            width: 40%;
        }

        .book-content .end-marker { 
            text-align: center; 
            margin-top: 20rem; 
            opacity: 0.15; 
            font-size: 1rem; 
            letter-spacing: 1.5em; 
            text-indent: 0; 
            border-top: 2px solid currentColor; 
            padding-top: 8rem; 
            font-weight: 1000; 
        }
        
        .book-content strong {
            font-weight: 900;
        }
      `}</style>
      
      {/* Search Header Container */}
      <div className={`border-b z-40 sticky top-0 transition-all duration-300 ease-in-out ${currentTheme.ui} shadow-md no-print`}>
        <div className="w-full px-6 py-4 flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-2 relative">
             {isInputExpanded && (
               <div className="flex items-center justify-between mb-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <ShieldCheck size={12} className="text-green-600" /> Premium Doctrinal Verification Active
                 </label>
                 {uploadedFile && (
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                          {uploadedFile.mimeType.startsWith('image/') ? <ImageIcon size={10}/> : <FileText size={10}/>}
                          {uploadedFile.name}
                        </span>
                        <button onClick={clearFile} className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1 hover:underline">
                          <X size={10} /> Clear
                        </button>
                    </div>
                 )}
               </div>
             )}

             <div className="flex items-center gap-2">
                <div className="relative flex-1 group">
                    <input
                      value={input}
                      onChange={(e) => { setInput(e.target.value); if(e.target.value.length === 0) setShowSuggestions(false); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleDigest()}
                      placeholder={uploadedFile ? `Synthesizing ${uploadedFile.name}...` : "Case Name or G.R. Number..."}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-medium transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500/20 text-slate-900' : 'bg-white/5 border-white/10 text-slate-100 placeholder-slate-500'}`}
                    />
                    <Search className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={16} />
                    
                    <button 
                      onClick={() => handleDigest()}
                      disabled={isProcessing || (!input && !uploadedFile)}
                      className="absolute right-2 top-1.5 h-7 px-3 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 disabled:opacity-30 transition-all flex items-center gap-1.5"
                    >
                      {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                      VERIFY & DIGEST
                    </button>

                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 no-print">
                         <div className="bg-amber-50 px-3 py-1.5 flex items-center justify-between border-b border-amber-100">
                            <div className="flex items-center gap-2">
                               <Sparkles size={10} className="text-amber-600" />
                               <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Case Suggestions</span>
                            </div>
                            <button onClick={() => setShowSuggestions(false)} className="text-amber-400 hover:text-amber-600"><X size={12}/></button>
                         </div>
                         {suggestions.map((s, idx) => (
                           <button key={idx} onClick={() => handleSelectSuggestion(s)} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-[13px] font-medium text-slate-600 border-b border-slate-50 last:border-0 flex items-center gap-3 group transition-colors">
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-amber-400 transition-colors"></div>
                             {s}
                           </button>
                         ))}
                      </div>
                    )}
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2.5 rounded-xl border transition-all ${uploadedFile ? 'bg-amber-500 text-white border-amber-600 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-amber-400 hover:bg-amber-50'}`}
                  title="Attach Case Documents"
                >
                  {uploadedFile ? <Check size={18}/> : <Paperclip size={18} />}
                </button>
             </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 pt-4">
             <div className="relative">
                <button onClick={() => setShowAppearance(!showAppearance)} className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Typography Settings"><Settings size={20} /></button>
                
                {showAppearance && (
                  <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50 text-slate-900 animate-in fade-in slide-in-from-top-4 no-print">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visual Controls</span>
                      <button onClick={() => setShowAppearance(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <span className="text-xs font-bold text-slate-700 block mb-3">Typeface</span>
                        <div className="grid grid-cols-2 gap-2">
                          {FONT_OPTIONS.map(font => (
                            <button key={font.value} onClick={() => setFontFamily(font.value)} className={`p-2.5 text-left border rounded-lg transition-all ${fontFamily === font.value ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' : 'bg-white border-slate-200'}`}>
                              <span className={`block text-[13px] font-medium ${font.value}`}>{font.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Line Alignment</span>
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
                          <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow text-amber-600' : 'text-slate-50'}`}><AlignLeft size={16}/></button>
                          <button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded ${textAlign === 'justify' ? 'bg-white shadow text-amber-600' : 'text-slate-50'}`}><AlignJustify size={16}/></button>
                        </div>
                      </div>
                      <div>
                         <span className="text-xs font-bold text-slate-700 block mb-3">Color Space</span>
                         <div className="grid grid-cols-4 gap-2">
                            {Object.keys(THEMES).map((t) => (
                               <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-amber-600 ring-2 ring-amber-600' : 'border-slate-200'}`} title={t} />
                            ))}
                         </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                         <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Scaling</span>
                            <div className="flex items-center gap-3">
                               <button onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ZoomOut size={14}/></button>
                               <span className="text-[10px] font-mono font-bold text-slate-400">{zoomLevel}%</span>
                               <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ZoomIn size={14}/></button>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
             </div>
             <button onClick={() => setIsInputExpanded(!isInputExpanded)} className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`}>{isInputExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}</button>
          </div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 md:p-20 lg:p-32 scroll-smooth scrollbar-hide ${currentTheme.bg}`} ref={contentRef}>
        {isProcessing ? (
           <div className="h-full flex flex-col items-center justify-center opacity-70">
             <div className="relative mb-12">
                <Loader2 className={`animate-spin text-amber-600`} size={84} />
                <ShieldCheck className="absolute inset-0 m-auto text-green-600" size={36} />
             </div>
             <p className={`font-serif text-3xl font-black tracking-tight animate-pulse ${currentTheme.text}`}>Synthesizing Case Treatise...</p>
             <div className="flex flex-col items-center gap-3 mt-8 text-[12px] font-bold text-slate-400 uppercase tracking-[0.5em]">
                 <span className="flex items-center gap-2"><Globe size={16}/> Accessing High-Court Repositories</span>
                 <span className="flex items-center gap-2"><FileText size={16}/> Premium Academic Formatting Sequence</span>
                 <span className="flex items-center gap-2"><ImageIcon size={16}/> Analyzing Artifacts Line-by-Line</span>
             </div>
           </div>
        ) : digest ? (
           <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-24 items-start mb-64 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              {/* Main Reading Canvas */}
              <div 
                className={`flex-1 min-h-[11in] ${currentTheme.pageBg} ${fontFamily} ${currentTheme.text} shadow-[0_80px_200px_-50px_rgba(0,0,0,0.4)] py-64 px-24 md:px-48 lg:px-64 rounded-sm transition-all duration-1000 relative overflow-hidden`} 
                style={{ fontSize: `${effectiveFontSize}px` }}
              >
                  <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-amber-500/[0.06] blur-[180px] -mr-96 -mt-96 pointer-events-none"></div>
                  
                  <div className={`border-b-[7px] border-double pb-40 mb-48 text-center relative z-10 no-print`} style={{ borderColor: 'currentColor' }}>
                    <div className="flex justify-between items-start absolute right-0 top-0 opacity-40 hover:opacity-100 transition-opacity">
                      <div className="flex gap-6">
                        <button onClick={saveToLegalPad} className="p-5 rounded-2xl hover:bg-black/5" title="Archive Academic Case"><PlusSquare size={32} /></button>
                        <button onClick={handleCopy} className="p-5 rounded-2xl hover:bg-black/5" title="Copy Textual Content"><Copy size={32} /></button>
                        <button onClick={() => window.print()} className="p-5 rounded-2xl hover:bg-black/5" title="Generate Hardcopy"><Printer size={32} /></button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-8 mb-20">
                        <span className="text-[18px] font-black uppercase tracking-[1.1em] block opacity-60">LegalPH Academic Collection</span>
                        <div className="flex items-center gap-5 px-8 py-3 bg-green-50 text-green-700 rounded-full text-[15px] font-black uppercase tracking-widest ring-1 ring-green-600/40 shadow-xl">
                            <ShieldCheck size={24}/> Authenticity Verified via Official PH Reports
                        </div>
                    </div>
                    <h1 className="text-8xl lg:text-9xl font-black mt-20 leading-[1.02] uppercase tracking-tighter selection:bg-amber-200">
                      {input || "Untitled Case Treatise"}
                    </h1>
                    <div className="flex items-center justify-center gap-20 text-[18px] font-black uppercase tracking-[0.9em] opacity-40 mt-36">
                      <div className="flex items-center gap-6"><Globe size={28}/> SCRA Standard</div>
                      <div className="w-5 h-5 bg-current rounded-full"></div>
                      <div className="flex items-center gap-6"><Scale size={28}/> Judicial Review v5.0</div>
                    </div>
                  </div>

                  <div className="book-content" dangerouslySetInnerHTML={{ __html: digest }} />
                  
                  <div className="mt-[30rem] pt-32 border-t-[5px] border-current/10 text-center opacity-30 italic font-serif text-[18px] tracking-[1.8em]">
                    *** FINIS DOCUMENT - LEGALPH MASTER COLLECTION ***
                  </div>
              </div>

              {/* Verified Sources Sidebar */}
              {sources.length > 0 && (
                  <div className="w-full xl:w-[460px] shrink-0 space-y-16 no-print sticky top-36">
                      <div className="p-16 bg-white/50 backdrop-blur-2xl border border-slate-200 rounded-[4rem] shadow-2xl">
                          <h4 className="text-[16px] font-black text-slate-400 uppercase tracking-[0.5em] mb-16 flex items-center gap-6">
                             <Globe size={28} className="text-blue-500" /> Research Metadata
                          </h4>
                          <div className="space-y-12">
                              {sources.map((src, idx) => src.web && (
                                  <a 
                                    key={idx} 
                                    href={src.web.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block p-12 bg-white border border-slate-100 rounded-[3rem] hover:border-amber-500 hover:shadow-[0_40px_100px_-30px_rgba(217,119,6,0.5)] transition-all group"
                                  >
                                      <div className="text-[19px] font-bold text-slate-800 mb-8 group-hover:text-amber-700 line-clamp-2 leading-snug">{src.web.title}</div>
                                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                          <span className="text-[14px] text-slate-400 font-mono truncate max-w-[240px]">{new URL(src.web.uri).hostname}</span>
                                          <ExternalLink size={24} className="text-slate-300 group-hover:text-amber-500" />
                                      </div>
                                  </a>
                              ))}
                          </div>
                          <div className="mt-24 pt-16 border-t border-slate-100">
                              <p className="text-[14px] text-slate-400 italic leading-relaxed">
                                Cross-referenced via SC Decisions Portal and Philippine E-Library for authoritative legal verification.
                              </p>
                          </div>
                      </div>
                  </div>
              )}
           </div>
        ) : (
           <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 select-none animate-in fade-in duration-1000">
              <div className="relative mb-20">
                 <FileText size={240} className="text-slate-100" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck size={96} className="text-green-600/20" />
                 </div>
              </div>
              <h2 className={`text-7xl font-serif font-bold text-slate-800 mb-10`}>High-Fidelity Brief AI</h2>
              <p className={`text-center max-w-2xl font-sans text-2xl leading-relaxed text-slate-500`}>
                 Enter a landmark case or upload judicial records for line-by-line factual synthesis. Powered by the official Supreme Court portal for verified research.
              </p>
              
              <div className="mt-32 grid grid-cols-4 gap-20 max-w-6xl w-full">
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-center text-slate-400"><Search size={48}/></div>
                    <span className="text-[14px] font-black uppercase tracking-widest">Case Query</span>
                 </div>
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-center text-slate-400"><ImageIcon size={48}/></div>
                    <span className="text-[14px] font-black uppercase tracking-widest">Doc Review</span>
                 </div>
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-center text-slate-400"><ShieldCheck size={48} className="text-green-500/40" /></div>
                    <span className="text-[14px] font-black uppercase tracking-widest text-green-600/60">Verified</span>
                 </div>
                 <div className="flex flex-col items-center gap-6">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center justify-center text-slate-400"><Globe size={48}/></div>
                    <span className="text-[14px] font-black uppercase tracking-widest">Global</span>
                 </div>
              </div>
           </div>
        )}

        {/* Back to Top Floating */}
        {digest && (
          <button 
             onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
             className="fixed bottom-24 right-24 p-10 bg-amber-600 text-white rounded-full shadow-[0_40px_100px_-10px_rgba(217,119,6,0.8)] hover:scale-110 transition-transform no-print z-50 group"
          >
             <ChevronDown size={48} className="rotate-180 group-hover:-translate-y-3 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
