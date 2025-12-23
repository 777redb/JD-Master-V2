
import React, { useState, useEffect } from 'react';
import { JD_CURRICULUM } from '../constants';
import { JDSubject } from '../types';
import { generateJDModuleContent } from '../services/gemini';
import { 
  GraduationCap, 
  BookOpen, 
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
  Bookmark
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
  
  // Reader Settings
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('legalph_jd_completed');
    if (saved) setCompletedSubjects(new Set(JSON.parse(saved)));
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
      setModuleContent("<p>Error loading module.</p>");
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

  if (activeSubject) {
    return (
      <div className={`h-full flex flex-col ${currentTheme.bg} transition-colors duration-300`}>
        {/* Dynamic Reader CSS */}
        <style>{`
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

        {/* Header/Controls */}
        <div className={`p-4 border-b flex items-center justify-between ${currentTheme.ui} z-20 shadow-sm`}>
          <button onClick={() => setActiveSubject(null)} className="flex items-center gap-2 text-sm font-bold hover:text-amber-600">
            <ArrowLeft size={18} /> Exit Program
          </button>
          
          <div className="flex items-center gap-4">
            <button onClick={() => toggleComplete(activeSubject.code)} className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg border transition-all ${completedSubjects.has(activeSubject.code) ? 'bg-green-600 text-white border-green-600' : 'hover:bg-slate-100'}`}>
              <CheckCircle2 size={16} /> {completedSubjects.has(activeSubject.code) ? 'Completed' : 'Mark as Complete'}
            </button>
            
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg hover:bg-slate-100"><Settings size={20}/></button>
              {showSettings && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border p-5 z-50 text-slate-900">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Appearance</span>
                    <button onClick={() => setShowSettings(false)}><X size={16}/></button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold block mb-2">Zoom</span>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))} className="flex-1 py-1.5 hover:bg-white rounded flex justify-center"><ZoomOut size={16}/></button>
                        <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="flex-1 py-1.5 hover:bg-white rounded flex justify-center"><ZoomIn size={16}/></button>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold block mb-2">Alignment</span>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setTextAlign('left')} className={`flex-1 py-1.5 rounded flex justify-center ${textAlign === 'left' ? 'bg-white shadow' : ''}`}><AlignLeft size={16}/></button>
                        <button onClick={() => setTextAlign('justify')} className={`flex-1 py-1.5 rounded flex justify-center ${textAlign === 'justify' ? 'bg-white shadow' : ''}`}><AlignJustify size={16}/></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                       {['light', 'sepia', 'dark', 'night'].map(t => (
                         <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-amber-500' : ''}`} />
                       ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center opacity-70">
              <Loader2 className="animate-spin text-amber-600 mb-6" size={64} />
              <p className="font-serif text-2xl font-bold italic animate-pulse">Professor is drafting the module...</p>
              <p className="text-sm mt-2">Consulting UP Law Syllabi & Recent Jurisprudence</p>
            </div>
          ) : moduleContent ? (
            <div 
              className={`max-w-[8.5in] mx-auto min-h-[11in] ${currentTheme.pageBg} ${currentTheme.text} ${fontFamily} shadow-2xl py-16 px-12 md:px-16 book-content transition-all`}
              style={{ fontSize: `${effectiveFontSize}px` }}
              dangerouslySetInnerHTML={{ __html: moduleContent }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
            <GraduationCap className="text-amber-600" size={32} />
            Juris Doctor Program
          </h2>
          <p className="text-slate-500 mt-2">Modeled after the University of the Philippines JD Curriculum.</p>
        </div>
        <div className="text-right">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Progress</div>
           <div className="flex items-center gap-3">
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-600 transition-all duration-1000" 
                  style={{ width: `${(completedSubjects.size / 45) * 100}%` }}
                />
              </div>
              <span className="font-bold text-slate-700">{completedSubjects.size} / 45 Subjects</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        {JD_CURRICULUM.map(year => (
          <div key={year.year} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
                {year.year}
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-800">
                {year.year === 1 ? 'First' : year.year === 2 ? 'Second' : year.year === 3 ? 'Third' : 'Fourth'} Year
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {year.semesters.map(sem => (
                <div key={sem.name} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{sem.name}</span>
                    <span className="text-[10px] font-bold text-amber-600">Day Section Section (133 Units)</span>
                  </div>
                  <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sem.subjects.map(sub => (
                      <button
                        key={sub.code}
                        onClick={() => handleSubjectClick(sub)}
                        className={`group p-3 text-left rounded-lg transition-all border ${completedSubjects.has(sub.code) ? 'bg-green-50 border-green-100' : 'hover:bg-amber-50 hover:border-amber-200 border-transparent'}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${completedSubjects.has(sub.code) ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {sub.code}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{sub.units} Units</span>
                        </div>
                        <h4 className={`text-sm font-serif font-bold mt-2 leading-tight ${completedSubjects.has(sub.code) ? 'text-green-900' : 'text-slate-800 group-hover:text-amber-800'}`}>
                          {sub.title}
                        </h4>
                        <div className="mt-2 flex items-center justify-between">
                           <span className="text-[10px] text-slate-400 group-hover:text-amber-600 flex items-center gap-1">
                              {completedSubjects.has(sub.code) ? <><CheckCircle2 size={10}/> Completed</> : <><Bookmark size={10}/> Study Now</>}
                           </span>
                           <ChevronRight size={12} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
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
  );
};
