
import React, { useState, useRef } from 'react';
import { generateLawSyllabus } from '../services/gemini';
import { LEARNER_LEVELS } from '../constants';
import { 
  ScrollText, 
  GraduationCap, 
  Loader2, 
  BookOpen, 
  Settings, 
  X, 
  ZoomIn, 
  ZoomOut,
  Printer,
  Download,
  Book,
  AlignLeft,
  AlignJustify,
  FileText,
  Copy,
  ArrowLeft,
  Search,
  Maximize2,
  Minimize2,
  Sparkles,
  RefreshCw,
  Library,
  ChevronDown,
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

export const LawReview: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [profile, setProfile] = useState(LEARNER_LEVELS[1]); 
  const [syllabus, setSyllabus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setSyllabus('');
    try {
      const result = await generateLawSyllabus(topic, profile);
      setSyllabus(result);
      setViewMode('READER');
    } catch (e) {
      setSyllabus("<p>Failed to generate syllabus. System interruption.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLegalPad = () => {
    if (!syllabus) return;
    const savedNotebooks = localStorage.getItem('legalph_notebooks');
    let notebooks = savedNotebooks ? JSON.parse(savedNotebooks) : [];
    let reviewerNotebook = notebooks.find((n: any) => n.name === "Study Reviewers");
    
    if (!reviewerNotebook) {
      reviewerNotebook = { id: 'reviewers_' + Date.now(), name: 'Study Reviewers', notes: [], isExpanded: true };
      notebooks.push(reviewerNotebook);
    }
    
    const newNote = {
      id: Date.now().toString(),
      title: topic || "Law Review Module",
      content: syllabus, 
      updatedAt: Date.now(),
      tags: ['Law Review', profile],
      color: 'bg-white',
      isFavorite: false,
      paperStyle: 'cornell',
      billableMinutes: 0
    };
    
    reviewerNotebook.notes.unshift(newNote);
    localStorage.setItem('legalph_notebooks', JSON.stringify(notebooks));
    alert('Premium module saved to Legal Pad.');
  };

  const handleCopy = () => {
    const temp = document.createElement('div');
    temp.innerHTML = syllabus;
    navigator.clipboard.writeText(temp.innerText);
    alert("Content copied to clipboard.");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `<html><head><title>Reviewer: ${topic}</title><style>body { font-family: serif; padding: 40px; line-height: 1.6; } h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }</style></head><body>${syllabus}</body></html>`
    ], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `${topic.replace(/\s+/g, '_')}_Reviewer.html`;
    document.body.appendChild(element);
    element.click();
  };

  const handleReset = () => {
    if (confirm("Reset current topic and start new research?")) {
      setTopic('');
      setSyllabus('');
      setViewMode('FORM');
    }
  };

  return (
    <div className={`h-full flex flex-col ${viewMode === 'FORM' ? 'bg-slate-50' : currentTheme.bg} transition-colors duration-300 overflow-hidden relative`}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .book-content { padding: 0 !important; margin: 0 !important; box-shadow: none !important; width: 100% !important; max-width: none !important; }
        }
        
        /* PREMIUM BOOK-GRADE LAYOUT ENGINE */
        .book-content { 
          text-align: ${textAlign}; 
          line-height: 1.85; 
          hyphens: auto;
          color: inherit;
        }

        /* Standard Book Header Hierarchy */
        .book-content h1 { 
          text-align: center; 
          font-weight: 900; 
          text-transform: uppercase; 
          letter-spacing: 0.1em; 
          margin-top: 3rem; 
          margin-bottom: 4rem; 
          line-height: 1.3; 
          padding-bottom: 2rem; 
          border-bottom: 4px double currentColor; 
          text-indent: 0; 
        }

        .book-content h3 { 
          font-weight: 800; 
          text-transform: uppercase; 
          margin-top: 4.5rem; 
          margin-bottom: 1.75rem; 
          border-bottom: 1.5px solid rgba(0,0,0,0.15); 
          font-size: 1.3em; 
          text-indent: 0; 
          padding-bottom: 0.75rem; 
          letter-spacing: 0.05em;
          opacity: 1;
        }

        .book-content h4 { 
          font-weight: 700; 
          margin-top: 2.5rem; 
          margin-bottom: 1.25rem; 
          font-size: 1.15em; 
          text-transform: uppercase; 
          text-indent: 0; 
          page-break-after: avoid; 
          letter-spacing: 0.02em;
        }

        /* Paragraph Indention Logic - Classic Book Style */
        .book-content p { 
          margin-top: 0; 
          margin-bottom: 1.5rem; 
          text-indent: 2.5em; 
        }

        /* Exceptions: Paragraphs following headers are NOT indented in standard typesetting */
        .book-content h1 + p, 
        .book-content h3 + p, 
        .book-content h4 + p, 
        .book-content div + p, 
        .book-content blockquote + p,
        .book-content .statute-box + p { 
          text-indent: 0; 
        }

        /* Specialized Academic Containers */
        .book-content blockquote { 
          margin: 2.5rem 3.5rem; 
          padding: 1.75rem 2.25rem; 
          border-left: 6px solid #b45309; 
          background: rgba(0,0,0,0.03); 
          font-style: normal; 
          text-indent: 0; 
          font-family: 'Merriweather', serif; 
          font-size: 0.95em; 
          line-height: 1.7;
          border-radius: 2px;
        }

        .book-content ul, .book-content ol { 
          margin-top: 1.25rem; 
          padding-left: 3.5rem; 
          text-indent: 0; 
          margin-bottom: 2rem; 
        }

        .book-content li { 
          margin-bottom: 0.85rem; 
          text-indent: 0; 
        }

        /* Codified Provision Styling */
        .book-content .statute-box { 
          border: 1px solid rgba(0,0,0,0.1); 
          background-color: #fffbeb; 
          padding: 2.25rem; 
          margin: 3.5rem 0; 
          border-left: 5px solid #f59e0b;
          border-radius: 4px; 
          text-indent: 0; 
          font-family: 'Merriweather', serif; 
          position: relative; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .book-content .statute-box strong {
          display: block;
          text-transform: uppercase;
          font-size: 0.85em;
          letter-spacing: 0.2em;
          margin-bottom: 1rem;
          color: #92400e;
        }

        .book-content .headnote { 
          border: 1px dashed rgba(0,0,0,0.2); 
          padding: 2rem; 
          margin-bottom: 3.5rem; 
          background: rgba(255,255,255,0.4); 
          border-radius: 8px; 
          text-indent: 0; 
        }

        .book-content .headnote h3 { 
          border: 0; 
          margin-top: 0; 
          font-size: 0.95em; 
          opacity: 0.6; 
          padding: 0; 
          margin-bottom: 0.75rem; 
          letter-spacing: 0.25em; 
        }

        .book-content .annotation { 
          color: inherit; 
          opacity: 0.7; 
          font-size: 0.9em; 
          font-style: italic; 
          border-top: 1px dashed currentColor; 
          padding-top: 1rem; 
          margin-top: 2rem; 
          text-indent: 0; 
        }

        .book-content hr { 
          border: 0; 
          border-top: 1.5px solid currentColor; 
          opacity: 0.1; 
          margin: 4.5rem 0; 
        }

        .book-content .end-marker { 
          text-align: center; 
          margin-top: 6rem; 
          opacity: 0.3; 
          font-size: 0.75rem; 
          letter-spacing: 0.6em; 
          text-indent: 0; 
          border-top: 1px solid currentColor; 
          padding-top: 2.5rem; 
          font-weight: 700;
        }
      `}</style>

      {/* Header Bar */}
      <div className={`h-14 border-b flex items-center justify-between px-6 shrink-0 z-40 shadow-sm no-print ${viewMode === 'READER' ? currentTheme.ui : 'bg-white'}`}>
        <div className="flex items-center gap-3">
          <ScrollText className={viewMode === 'READER' ? currentTheme.text : 'text-amber-600'} size={20} />
          <h2 className={`text-sm font-bold tracking-tight ${viewMode === 'READER' ? currentTheme.text : 'text-slate-900'}`}>
            Reviewer Studio {viewMode === 'READER' && <span className="opacity-50 font-normal">/ Active Research</span>}
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
            Discard
          </button>
          {viewMode === 'READER' && (
            <button onClick={() => setViewMode('FORM')} className="text-xs font-bold bg-amber-600 text-white px-4 py-1.5 rounded-lg hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all">
              Edit Query
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest mb-4">
                   <Sparkles size={12} /> Academic Module Synthesis
                </div>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">Reviewer Studio</h1>
                <p className="text-slate-500 text-lg leading-relaxed">Synthesize a professional, book-grade study guide from integrated Philippine Law traditions.</p>
              </div>

              <div className="space-y-8 bg-white p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Library size={14} className="text-amber-500" /> Subject Focus
                  </label>
                  <div className="relative group">
                    <input 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      placeholder="e.g. 'Insanity Defense in Criminal Law', 'Public Trust Doctrine'..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 outline-none font-medium transition-all text-slate-900 text-lg shadow-inner"
                    />
                    <Search className="absolute left-4 top-4.5 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap size={14} className="text-amber-500" /> Research Persona
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {LEARNER_LEVELS.map(level => (
                      <button
                        key={level}
                        onClick={() => setProfile(level)}
                        className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all ${profile === level ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/20' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={handleGenerate}
                    disabled={isLoading || !topic.trim()}
                    className="h-16 px-12 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-4 group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Consulting Archives...
                      </>
                    ) : (
                      <>
                        <Book size={24} />
                        Synthesize Knowledge Module
                      </>
                    )}
                  </button>
                </div>
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
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Typography Studio</span>
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
                     <span className="text-xs font-bold text-slate-700 block mb-3">Environment</span>
                     <div className="grid grid-cols-4 gap-2">
                        {Object.keys(THEMES).map((t) => (
                           <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-amber-600 ring-2 ring-amber-600' : 'border-slate-200'}`} title={t} />
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}

            <div className="max-w-6xl mx-auto">
               <div className={`min-h-[11in] shadow-2xl rounded-sm py-24 px-12 md:px-24 mb-20 relative overflow-hidden transition-all duration-500 ${currentTheme.pageBg} ${currentTheme.text} ${fontFamily}`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl -mr-32 -mt-32"></div>
                  
                  <div className="border-b-2 border-slate-900 pb-12 mb-16 text-center relative z-10 no-print" style={{ borderColor: 'currentColor' }}>
                     <div className="flex justify-between items-start absolute right-0 top-0 opacity-40 hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                           <button onClick={saveToLegalPad} className="p-2.5 rounded-lg hover:bg-black/5" title="Move to workspace"><PlusSquare size={18}/></button>
                           <button onClick={handleCopy} className="p-2.5 rounded-lg hover:bg-black/5" title="Copy Content"><Copy size={18}/></button>
                           <button onClick={() => window.print()} className="p-2.5 rounded-lg hover:bg-black/5" title="Print Module"><Printer size={18}/></button>
                           <button onClick={handleDownload} className="p-2.5 rounded-lg hover:bg-black/5" title="Export HTML"><Download size={18}/></button>
                        </div>
                     </div>
                     <span className="text-[11px] font-black uppercase tracking-[0.5em] mb-4 block opacity-50">LegalPH Research Series</span>
                     <h1 className="text-5xl font-serif font-black uppercase leading-[1.1] tracking-tight mb-8">
                       {topic || "Untitled Chapter"}
                     </h1>
                     <div className="flex items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-widest opacity-40">
                        <div className="flex items-center gap-2"><GraduationCap size={14}/> {profile}</div>
                        <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                        <div className="flex items-center gap-2"><FileText size={14}/> Integrated Study Guide</div>
                     </div>
                  </div>

                  <div 
                    className="book-content transition-all"
                    style={{ fontSize: `${effectiveFontSize}px` }}
                    dangerouslySetInnerHTML={{ __html: syllabus }}
                  />

                  <div className="mt-28 pt-10 border-t border-current/10 text-center opacity-30 italic font-serif text-[11px] tracking-widest">
                    *** END OF RESEARCH MODULE - LEGALPH MASTER COLLECTION ***
                  </div>
               </div>
            </div>

            {/* Back to Top Floating */}
            <button 
               onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
               className="fixed bottom-10 right-10 p-4 bg-amber-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform no-print z-50 group"
            >
               <ChevronDown size={20} className="rotate-180 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
