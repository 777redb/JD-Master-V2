
import React, { useState, useEffect } from 'react';
import { JD_CURRICULUM } from '../constants';
import { JDSubject } from '../types';
import { generateJDModuleContent } from '../services/gemini';
import { 
  GraduationCap, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Settings, 
  X, 
  ZoomIn, 
  ZoomOut,
  AlignLeft,
  AlignJustify,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  PlusSquare,
  Share2,
  Printer,
  Check
} from 'lucide-react';

type Theme = 'light' | 'sepia' | 'dark' | 'night';
type LegalFont = 'font-serif' | 'font-crimson' | 'font-sans' | 'font-mono';

const THEMES: Record<Theme, { bg: string, text: string, ui: string, border: string, prose: string, pageBg: string }> = {
  light: { bg: 'bg-slate-100', text: 'text-slate-900', ui: 'bg-white border-slate-200', border: 'border-slate-200', prose: 'prose-slate', pageBg: 'bg-white' },
  sepia: { bg: 'bg-[#eaddcf]', text: 'text-[#463525]', ui: 'bg-[#f4ecd8] border-[#d3c4b1]', border: 'border-[#d3c4b1]', prose: 'prose-amber', pageBg: 'bg-[#fbf7f0]' },
  dark: { bg: 'bg-[#0f172a]', text: 'text-slate-300', ui: 'bg-[#1e293b] border-slate-700', border: 'border-slate-700', prose: 'prose-invert', pageBg: 'bg-[#1e293b]' },
  night: { bg: 'bg-black', text: 'text-gray-400', ui: 'bg-gray-900 border-gray-800', border: 'border-gray-800', prose: 'prose-invert', pageBg: 'bg-[#0a0a0a]' }
};

export const JDProgram: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<JDSubject | null>(null);
  const [moduleContent, setModuleContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSubjects, setCompletedSubjects] = useState<Set<string>>(new Set());
  const [bookmarkedSubjects, setBookmarkedSubjects] = useState<Set<string>>(new Set());
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedCompleted = localStorage.getItem('legalph_jd_completed');
    if (savedCompleted) setCompletedSubjects(new Set(JSON.parse(savedCompleted)));
    
    const savedBookmarks = localStorage.getItem('legalph_jd_bookmarks');
    if (savedBookmarks) setBookmarkedSubjects(new Set(JSON.parse(savedBookmarks)));
  }, []);

  const currentTheme = THEMES[theme];
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100));

  const handleSubjectClick = async (subject: JDSubject) => {
    setActiveSubject(subject);
    setIsLoading(true);
    setModuleContent(null);
    try {
      const content = await generateJDModuleContent(subject.code, subject.title);
      setModuleContent(content);
    } catch (e) {
      setModuleContent("<p>Error loading module. Please check your connection or retry.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = (code: string) => {
    const next = new Set(completedSubjects);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setCompletedSubjects(next);
    localStorage.setItem('legalph_jd_completed', JSON.stringify(Array.from(next)));
  };

  const toggleBookmark = (code: string) => {
    const next = new Set(bookmarkedSubjects);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setBookmarkedSubjects(next);
    localStorage.setItem('legalph_jd_bookmarks', JSON.stringify(Array.from(next)));
  };

  const handlePrint = () => window.print();

  const handleShare = async () => {
    if (!activeSubject) return;
    const shareData = {
      title: `LegalPH Research: ${activeSubject.title}`,
      text: `Check out this law study module for ${activeSubject.title} on LegalPH JD Master.`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const text = JSON.stringify(shareData);
        navigator.clipboard.writeText(text);
        setShowCopyFeedback(true);
        setTimeout(() => setShowCopyFeedback(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveToLegalPad = () => {
    if (!activeSubject || !moduleContent) return;
    const savedNotebooks = localStorage.getItem('legalph_notebooks');
    let notebooks = savedNotebooks ? JSON.parse(savedNotebooks) : [];
    let jdNotebook = notebooks.find((n: any) => n.name === "JD Program Research");
    if (!jdNotebook) {
      jdNotebook = { id: 'jd_research_' + Date.now(), name: 'JD Program Research', notes: [], isExpanded: true };
      notebooks.push(jdNotebook);
    }
    const newNote = {
      id: Date.now().toString(),
      title: `${activeSubject.code}: ${activeSubject.title}`,
      content: moduleContent, // Strictly keep entire original format
      updatedAt: Date.now(),
      tags: ['JD Program', activeSubject.code],
      color: 'bg-amber-50',
      isFavorite: false,
      paperStyle: 'yellow-legal',
      billableMinutes: 0
    };
    jdNotebook.notes.unshift(newNote);
    localStorage.setItem('legalph_notebooks', JSON.stringify(notebooks));
    alert(`"${activeSubject.title}" strictly preserved and added to your Legal Pad.`);
  };

  if (activeSubject) {
    return (
      <div className={`h-full w-full flex flex-col ${currentTheme.bg} transition-colors duration-300 overflow-hidden`}>
        <style>{`
          @media print {
            .no-print { display: none !important; }
            .book-content { padding: 0 !important; margin: 0 !important; box-shadow: none !important; width: 100% !important; max-width: none !important; }
          }
          .book-content { text-align: ${textAlign}; line-height: 1.8; hyphens: auto; }
          .book-content h1 { text-align: center; font-weight: 800; text-transform: uppercase; margin: 3rem 0; border-bottom: 3px double currentColor; padding-bottom: 1.5rem; text-indent: 0; }
          .book-content h3 { font-weight: 700; text-transform: uppercase; margin-top: 3rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.1); font-size: 1.25em; text-indent: 0; }
          .book-content p { margin-bottom: 1rem; text-indent: 2.5em; }
          .book-content h1 + p, .book-content h3 + p, .book-content h4 + p, .book-content .statute-box + p { text-indent: 0; }
          .book-content .statute-box { border: 1px solid currentColor; background: rgba(0,0,0,0.03); padding: 1.5rem; margin: 2rem 0; text-indent: 0; font-family: 'Merriweather', serif; font-size: 0.95em; border-radius: 4px; }
          .book-content blockquote { margin: 2rem; padding: 1.5rem; border-left: 4px solid #b45309; background: rgba(0,0,0,0.02); font-style: italic; text-indent: 0; }
          .book-content ul { padding-left: 2rem; list-style: disc; margin-bottom: 1.5rem; }
          .book-content li { margin-bottom: 0.5rem; text-indent: 0; }
        `}</style>

        {/* EDGE-TO-EDGE HEADER */}
        <div className={`w-full px-6 py-4 border-b flex flex-wrap items-center justify-between shrink-0 ${currentTheme.ui} z-20 shadow-sm no-print`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveSubject(null)} className="flex items-center gap-2 text-sm font-bold hover:text-amber-600 transition-colors">
              <ArrowLeft size={18} /> Exit
            </button>
            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Current Subject</span>
              <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{activeSubject.code}: {activeSubject.title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg mr-2">
              <button onClick={() => toggleBookmark(activeSubject.code)} className={`p-2 rounded-md transition-all ${bookmarkedSubjects.has(activeSubject.code) ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`} title="Bookmark Module">
                {bookmarkedSubjects.has(activeSubject.code) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
              <button onClick={handlePrint} className="p-2 rounded-md text-slate-500 hover:bg-white transition-all" title="Print">
                <Printer size={18} />
              </button>
              <button onClick={saveToLegalPad} className="p-2 rounded-md text-slate-500 hover:bg-white transition-all" title="Add to Legal Pad (Strict Format)">
                <PlusSquare size={18} />
              </button>
              <button onClick={handleShare} className="p-2 rounded-md text-slate-500 hover:bg-white transition-all relative" title="Share">
                {showCopyFeedback ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
              </button>
            </div>

            <button onClick={() => toggleComplete(activeSubject.code)} className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg border transition-all ${completedSubjects.has(activeSubject.code) ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:bg-slate-50 border-slate-200'}`}>
              <CheckCircle2 size={16} /> {completedSubjects.has(activeSubject.code) ? 'Completed' : 'Mark Complete'}
            </button>
            
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"><Settings size={20}/></button>
              {showSettings && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border p-5 z-50 text-slate-900 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Reader Settings</span>
                    <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold block mb-2 text-slate-700">Zoom Level</span>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))} className="flex-1 py-1.5 hover:bg-white rounded flex justify-center text-slate-600"><ZoomOut size={16}/></button>
                        <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="flex-1 py-1.5 hover:bg-white rounded flex justify-center text-slate-600"><ZoomIn size={16}/></button>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold block mb-2 text-slate-700">Text Alignment</span>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setTextAlign('left')} className={`flex-1 py-1.5 rounded flex justify-center transition-all ${textAlign === 'left' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
                        <button onClick={() => setTextAlign('justify')} className={`flex-1 py-1.5 rounded flex justify-center transition-all ${textAlign === 'justify' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`}><AlignJustify size={16}/></button>
                      </div>
                    </div>
                    <div>
                       <span className="text-xs font-bold block mb-2 text-slate-700">Paper Mode</span>
                       <div className="grid grid-cols-4 gap-2">
                          {Object.keys(THEMES).map(t => (
                            <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'}`} />
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FULL-WIDTH SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center opacity-70">
              <Loader2 className="animate-spin text-amber-600 mb-6" size={64} />
              <p className="font-serif text-2xl font-bold italic text-slate-800 animate-pulse text-center">Consulting Integrated Curricula...</p>
              <p className="text-sm mt-2 text-slate-500 text-center">Synthesizing UP-Ateneo-Beda Pedagogies & Rules of Court</p>
            </div>
          ) : moduleContent ? (
            <div 
              className={`max-w-6xl mx-auto min-h-[11in] ${currentTheme.pageBg} ${currentTheme.text} ${fontFamily} shadow-2xl py-16 px-8 md:px-24 book-content transition-all rounded-sm`}
              style={{ fontSize: `${effectiveFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: moduleContent }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-12 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
              <GraduationCap className="text-amber-600" size={32} />
              Integrated JD Program
            </h2>
            <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">The Optimized Study Guide: Synthesizing the core strengths of UP (Policy), Ateneo (Practice), and San Beda (Discipline) Law Traditions.</p>
          </div>
          <div className="text-right bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-w-[200px]">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Curriculum Mastery</div>
             <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 transition-all duration-1000" style={{ width: `${(completedSubjects.size / 40) * 100}%` }} />
                </div>
                <span className="font-mono font-bold text-sm text-amber-700 whitespace-nowrap">{completedSubjects.size}/40</span>
             </div>
             <p className="text-[9px] text-slate-400 mt-2 font-medium italic">Based on CLEPP-aligned subjects</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-16">
          {JD_CURRICULUM.map(year => (
            <div key={year.year} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  {year.year}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-800">
                    {year.year === 1 ? 'Year I: Foundations' : year.year === 2 ? 'Year II: Procedural Mastery' : year.year === 3 ? 'Year III: Integration' : 'Year IV: Bar Review & Practice'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year Level Progress</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {year.semesters.map(sem => (
                  <div key={sem.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-amber-200 transition-colors">
                    <div className="bg-slate-50/80 px-5 py-3 border-b flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{sem.name}</span>
                    </div>
                    <div className="p-3 grid grid-cols-1 gap-2">
                      {sem.subjects.map(sub => (
                        <button key={sub.code} onClick={() => handleSubjectClick(sub)} className={`group p-4 text-left rounded-xl transition-all border relative overflow-hidden ${completedSubjects.has(sub.code) ? 'bg-green-50/50 border-green-100 hover:bg-green-50' : 'bg-white hover:bg-amber-50/50 hover:border-amber-200 border-slate-100'}`}>
                          <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${completedSubjects.has(sub.code) ? 'bg-green-200 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                                {sub.code}
                              </span>
                              {bookmarkedSubjects.has(sub.code) && <Bookmark className="text-amber-500 fill-amber-500" size={12} />}
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{sub.units} Units</span>
                          </div>
                          <h4 className={`text-[15px] font-serif font-bold leading-tight relative z-10 ${completedSubjects.has(sub.code) ? 'text-green-900' : 'text-slate-800 group-hover:text-amber-800'}`}>
                            {sub.title}
                          </h4>
                          <div className="mt-3 flex items-center justify-between relative z-10">
                             <span className={`text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors ${completedSubjects.has(sub.code) ? 'text-green-600' : 'text-slate-400 group-hover:text-amber-600'}`}>
                                {completedSubjects.has(sub.code) ? <><CheckCircle2 size={12}/> Syllabus Mastered</> : <><Bookmark size={12}/> Access Modules</>}
                             </span>
                             <ChevronRight size={14} className={`transition-transform duration-300 ${completedSubjects.has(sub.code) ? 'text-green-400' : 'text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1'}`} />
                          </div>
                          <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                             <GraduationCap size={80} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
