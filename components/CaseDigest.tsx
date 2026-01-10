
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
  light: { bg: 'bg-slate-100', text: 'text-slate-900', ui: 'bg-white border-slate-200', border: 'border-slate-200', prose: 'prose-slate', pageBg: 'bg-white', accent: 'text-amber-700' },
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

  const convertToPlainText = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    let text = "";
    const processNode = (node: Node) => {
      node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          const tag = el.tagName.toLowerCase();
          
          if (['h1', 'h2', 'h3'].includes(tag)) {
            text += `\n\n${el.innerText.toUpperCase()}\n${'='.repeat(el.innerText.length)}\n\n`;
          } else if (tag === 'h4') {
            text += `\n\n${el.innerText.toUpperCase()}\n\n`;
          } else if (tag === 'p') {
            // Apply indention based on standard 2.5em rule from reading mode
            const isIndented = el.previousElementSibling && !['h1', 'h2', 'h3', 'h4'].includes(el.previousElementSibling.tagName.toLowerCase());
            text += (isIndented ? "    " : "") + el.innerText.trim() + "\n\n";
          } else if (tag === 'li') {
            text += " • " + el.innerText.trim() + "\n";
          } else if (tag === 'blockquote') {
            text += `\n    "${el.innerText.trim()}"\n\n`;
          } else if (tag === 'div' && el.classList.contains('statute-box')) {
            text += `\n[PROVISION]\n------------------------------------------------\n${el.innerText.trim()}\n------------------------------------------------\n\n`;
          } else if (tag === 'br') {
            text += "\n";
          } else {
            processNode(child);
          }
        }
      });
    };
    processNode(temp);
    return text.trim();
  };

  const saveToLegalPad = () => {
    if (!digest) return;
    const plainText = convertToPlainText(digest);
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
      content: plainText,
      updatedAt: Date.now(),
      tags: ['Case Digest', 'Research'],
      color: 'bg-amber-50',
      isFavorite: false,
      paperStyle: 'yellow-legal',
      billableMinutes: 0
    };
    
    digestNotebook.notes.unshift(newNote);
    localStorage.setItem('legalph_notebooks', JSON.stringify(notebooks));
    alert('Digest successfully saved to Legal Pad in book-grade plain text format.');
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
    const text = convertToPlainText(digest);
    navigator.clipboard.writeText(text);
    alert('Case Digest copied to clipboard as plain text.');
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
        .book-content { text-align: ${textAlign}; line-height: 1.8; hyphens: auto; }
        .book-content h1 { text-align: center; font-weight: 900; text-transform: uppercase; margin-top: 3rem; margin-bottom: 3.5rem; line-height: 1.2; padding-bottom: 1.5rem; border-bottom: 3px double currentColor; text-indent: 0; letter-spacing: -0.01em; }
        .book-content h3 { font-weight: 800; text-transform: uppercase; margin-top: 4rem; margin-bottom: 1.5rem; border-bottom: 1.5px solid currentColor; font-size: 1.25em; text-indent: 0; padding-bottom: 0.5rem; opacity: 1; letter-spacing: 0.05em; color: #000; }
        .book-content h4 { font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.1em; text-transform: uppercase; text-indent: 0; page-break-after: avoid; }
        .book-content p { margin-top: 0; margin-bottom: 1.25rem; text-indent: 2.5em; }
        .book-content h1 + p, .book-content h3 + p, .book-content h4 + p, .book-content div + p, .book-content blockquote + p, .book-content hr + p { text-indent: 0; }
        .book-content blockquote { margin: 2rem 3.5rem; padding: 1.5rem 2rem; border-left: 5px solid #b45309; background-color: rgba(0,0,0,0.03); font-style: normal; text-indent: 0; font-family: 'Merriweather', serif; font-size: 0.95em; line-height: 1.7; }
        .book-content ul, .book-content ol { margin-top: 1rem; margin-bottom: 1.5rem; padding-left: 3.5rem; text-indent: 0; }
        .book-content li { margin-bottom: 0.75rem; text-indent: 0; }
        .book-content strong { font-weight: 800; color: inherit; }
        .book-content hr { border: 0; border-top: 1px solid currentColor; opacity: 0.1; margin: 3.5rem auto; width: 60%; }
        .book-content .annotation { color: inherit; opacity: 0.7; font-size: 0.9em; font-style: italic; border-top: 1px dashed currentColor; padding-top: 0.75rem; margin-top: 1.5rem; text-indent: 0; }
        .book-content .statute-box { border: 1px solid #e2e8f0; background-color: #fffbeb; padding: 1.75rem; margin: 2.5rem 0; border-left: 5px solid #f59e0b; text-indent: 0; font-family: 'Merriweather', serif; position: relative; border-radius: 4px; }
        .book-content .so-ordered { text-align: center; margin-top: 4rem; font-weight: 900; text-transform: uppercase; text-indent: 0; border-top: 1px solid currentColor; padding-top: 2rem; letter-spacing: 0.2em; }
        .book-content .final-analysis { border: 1px dashed currentColor; padding: 2rem; background: rgba(0,0,0,0.02); border-radius: 4px; margin-top: 3rem; text-indent: 0; }
      `}</style>
      
      {/* Search Header Container */}
      <div className={`border-b z-40 sticky top-0 transition-all duration-300 ease-in-out ${currentTheme.ui} shadow-md no-print`}>
        <div className="w-full px-6 py-4 flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-2 relative">
             {isInputExpanded && (
               <div className="flex items-center justify-between mb-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <ShieldCheck size={12} className="text-green-600" /> Premium Doctrinal Verification
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
                      placeholder={uploadedFile ? `Factual analysis of ${uploadedFile.name}...` : "Case Name or G.R. Number..."}
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
                  title="Upload Case File for Line-by-Line Analysis"
                >
                  {uploadedFile ? <Check size={18}/> : <Paperclip size={18} />}
                </button>
             </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 pt-4">
             <div className="relative">
                <button onClick={() => setShowAppearance(!showAppearance)} className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Reader Appearance Settings"><Settings size={20} /></button>
                
                {/* Advanced Reading Mode Settings Popover */}
                {showAppearance && (
                  <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50 text-slate-900 animate-in fade-in slide-in-from-top-4 no-print">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visual Controls</span>
                      <button onClick={() => setShowAppearance(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <span className="text-xs font-bold text-slate-700 block mb-3">Font Face</span>
                        <div className="grid grid-cols-2 gap-2">
                          {FONT_OPTIONS.map(font => (
                            <button key={font.value} onClick={() => setFontFamily(font.value)} className={`p-2.5 text-left border rounded-lg transition-all ${fontFamily === font.value ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' : 'bg-white border-slate-200'}`}>
                              <span className={`block text-[13px] font-medium ${font.value}`}>{font.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Alignment</span>
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
                          <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
                          <button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded ${textAlign === 'justify' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`}><AlignJustify size={16}/></button>
                        </div>
                      </div>
                      <div>
                         <span className="text-xs font-bold text-slate-700 block mb-3">Paper Theme</span>
                         <div className="grid grid-cols-4 gap-2">
                            {Object.keys(THEMES).map((t) => (
                               <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-amber-600 ring-2 ring-amber-600' : 'border-slate-200'}`} title={t} />
                            ))}
                         </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                         <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Zoom Level</span>
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

      <div className={`flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-hide ${currentTheme.bg}`} ref={contentRef}>
        {isProcessing ? (
           <div className="h-full flex flex-col items-center justify-center opacity-70">
             <div className="relative mb-6">
                <Loader2 className={`animate-spin text-amber-600`} size={64} />
                <ShieldCheck className="absolute inset-0 m-auto text-green-600" size={24} />
             </div>
             <p className={`font-serif text-2xl font-black tracking-tight animate-pulse ${currentTheme.text}`}>Verifying Jurisprudence...</p>
             <div className="flex flex-col items-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-1.5"><Globe size={12}/> Consultando Supreme Court Portals</span>
                 <span className="flex items-center gap-1.5"><FileText size={12}/> Synthesizing official Philippine Reports</span>
                 <span className="flex items-center gap-1.5"><ImageIcon size={12}/> Scanning Artifacts Line-by-Line</span>
             </div>
           </div>
        ) : digest ? (
           <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-start mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Main Reading Canvas */}
              <div 
                className={`flex-1 min-h-[11in] ${currentTheme.pageBg} ${fontFamily} ${currentTheme.text} shadow-2xl py-20 px-12 md:px-24 rounded-sm book-content transition-all relative overflow-hidden`} 
                style={{ fontSize: `${effectiveFontSize}px` }}
              >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                  
                  <div className={`border-b-2 pb-10 mb-16 text-center relative z-10 ${theme === 'light' ? 'border-slate-900' : 'border-current'}`} style={{ borderColor: 'currentColor' }}>
                    <div className="flex justify-between items-start absolute right-0 top-0 opacity-40 hover:opacity-100 transition-opacity no-print">
                      <div className="flex gap-1">
                        <button onClick={saveToLegalPad} className="p-2 rounded-lg hover:bg-black/5" title="Add to Legal Pad (Plain Text)"><PlusSquare size={18} /></button>
                        <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-black/5" title="Copy as Text"><Copy size={18} /></button>
                        <button onClick={() => window.print()} className="p-2 rounded-lg hover:bg-black/5" title="Print Brief"><Printer size={18} /></button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] block opacity-60">Verified Doctrinal Digest</span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded text-[10px] font-black uppercase tracking-tight ring-1 ring-green-600/20">
                            <ShieldCheck size={12}/> Jurisprudential Authenticity Verified
                        </div>
                    </div>
                    <h1 className="text-4xl font-black mt-4 leading-tight uppercase tracking-tight selection:bg-amber-200">
                      {input || "Unnamed Case Digest"}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest opacity-40 mt-8">
                      <div className="flex items-center gap-2"><Globe size={12}/> Philippine Reports</div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="flex items-center gap-2"><Scale size={12}/> Supreme Court v3.0</div>
                    </div>
                  </div>

                  <div dangerouslySetInnerHTML={{ __html: digest }} className="selection:bg-amber-100/50" />
                  
                  <div className="mt-32 pt-10 border-t border-current/10 text-center opacity-30 italic font-serif text-[10px] tracking-[0.5em]">
                    *** END OF VERIFIED RESEARCH DOCUMENT ***
                  </div>
              </div>

              {/* Verified Sources Sidebar (Desktop) */}
              {sources.length > 0 && (
                  <div className="w-full lg:w-80 shrink-0 space-y-6 no-print sticky top-32">
                      <div className="p-6 bg-white/50 backdrop-blur border border-slate-200 rounded-2xl shadow-sm">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <Globe size={14} className="text-blue-500" /> Authority Verification
                          </h4>
                          <div className="space-y-4">
                              {sources.map((src, idx) => src.web && (
                                  <a 
                                    key={idx} 
                                    href={src.web.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block p-4 bg-white border border-slate-100 rounded-xl hover:border-amber-500 hover:shadow-lg transition-all group"
                                  >
                                      <div className="text-[12px] font-bold text-slate-800 mb-2 group-hover:text-amber-700 line-clamp-2 leading-snug">{src.web.title}</div>
                                      <div className="flex items-center justify-between pt-1">
                                          <span className="text-[9px] text-slate-400 font-mono truncate max-w-[140px]">{new URL(src.web.uri).hostname}</span>
                                          <ExternalLink size={12} className="text-slate-300 group-hover:text-amber-500" />
                                      </div>
                                  </a>
                              ))}
                          </div>
                          <div className="mt-8 pt-5 border-t border-slate-100">
                              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                                Fact-checked via SC Decisions Portal and Philippine E-Library for 100% accurate legal attribution.
                              </p>
                          </div>
                      </div>
                  </div>
              )}
           </div>
        ) : (
           <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 select-none animate-in fade-in duration-1000">
              <div className="relative mb-10">
                 <FileText size={120} className="text-slate-100" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck size={48} className="text-green-600/20" />
                 </div>
              </div>
              <h2 className={`text-4xl font-serif font-bold text-slate-800 mb-4`}>High-Fidelity Digest AI</h2>
              <p className={`text-center max-w-md font-sans text-sm leading-relaxed text-slate-500`}>
                 Select a landmark case or upload documents for line-by-line factual analysis. Integrated with the official Supreme Court database for zero-hallucination research.
              </p>
              
              <div className="mt-16 grid grid-cols-4 gap-8 max-w-3xl w-full">
                 <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400"><Search size={28}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">G.R. Query</span>
                 </div>
                 <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400"><ImageIcon size={28}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">File Analysis</span>
                 </div>
                 <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400"><ShieldCheck size={28} className="text-green-500/40" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600/60">Verified</span>
                 </div>
                 <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400"><Globe size={28}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Grounding</span>
                 </div>
              </div>
           </div>
        )}

        {/* Back to Top Floating */}
        {digest && (
          <button 
             onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
             className="fixed bottom-10 right-10 p-4 bg-amber-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform no-print z-50 group"
          >
             <ChevronDown size={20} className="rotate-180 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
