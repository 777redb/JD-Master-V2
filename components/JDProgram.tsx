
import React, { useState, useEffect, useRef } from 'react';
import { JD_CURRICULUM } from '../constants';
import { JDSubject, StudentProfile, ProfessorPersona, LectureTurn } from '../types';
import { generateJDModuleContent, conductJDProfessorSession } from '../services/gemini';
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
  Check,
  MessageSquare,
  Play,
  Zap,
  User,
  MoreVertical,
  Volume2,
  ShieldCheck,
  Send,
  BookOpen,
  Sparkles,
  Type,
  Palette,
  Maximize2,
  Minimize2,
  ChevronDown,
  FileText,
  Clock,
  HelpCircle
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

const getProfessorForSubject = (code: string): ProfessorPersona => {
  if (code.startsWith('JD 111') || code.startsWith('JD 121')) 
    return { name: 'Dr. Santiago', specialization: 'Constitutional Law', style: 'Critical Policy', almaMater: 'UP Law', tone: 'Distinguished, policy-oriented, authoritative' };
  if (code.startsWith('JD 113') || code.startsWith('JD 123')) 
    return { name: 'Dean Castelo', specialization: 'Criminal Law', style: 'Strict Discipline', almaMater: 'San Beda Law', tone: 'Rigid, precise, emphasis on RPC verbatim' };
  if (code.includes('Remedial') || code.includes('Procedure')) 
    return { name: 'Atty. Mercado', specialization: 'Remedial Law', style: 'Clinical Practice', almaMater: 'Ateneo Law', tone: 'Practical, litigation-focused, aggressive' };
  return { name: 'Prof. LexPH', specialization: 'Integrated Jurisprudence', style: 'Clinical Practice', almaMater: 'Integrated Law Center', tone: 'Supportive but intellectually demanding' };
};

export const JDProgram: React.FC = () => {
  const [viewMode, setViewMode] = useState<'GRID' | 'MODULE' | 'LECTURE'>('GRID');
  const [activeSubject, setActiveSubject] = useState<JDSubject | null>(null);
  const [moduleContent, setModuleContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSubjects, setCompletedSubjects] = useState<Set<string>>(new Set());
  const [bookmarkedSubjects, setBookmarkedSubjects] = useState<Set<string>>(new Set());
  
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
  const [showSettings, setShowSettings] = useState(false);

  const [lectureTurns, setLectureTurns] = useState<LectureTurn[]>([]);
  const [userInput, setUserInput] = useState('');
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('legalph_student_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Learner',
      level: 'Freshman Law Student',
      englishProficiency: 'Advanced',
      timeCommitment: 'Balanced',
      rigorPreference: 'Moderate',
      masteryPoints: {}
    };
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES[theme];
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100));

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lectureTurns, isLoading]);

  useEffect(() => {
    localStorage.setItem('legalph_student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  const enterLectureHall = async (subject: JDSubject) => {
    setActiveSubject(subject);
    setViewMode('LECTURE');
    setIsLoading(true);
    setLectureTurns([]);
    
    const professor = getProfessorForSubject(subject.code);
    try {
      const initialTurn = await conductJDProfessorSession(subject.title, professor, studentProfile, [
        { id: 'start', role: 'student', content: `Good day, Professor. I am ready to begin the lecture on ${subject.title}.`, type: 'SYSTEM', timestamp: Date.now() }
      ]);
      setLectureTurns([initialTurn]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !activeSubject || isLoading) return;
    
    const userTurn: LectureTurn = {
      id: Date.now().toString(),
      role: 'student',
      content: userInput,
      type: 'RESPONSE',
      timestamp: Date.now()
    };
    
    setLectureTurns(prev => [...prev, userTurn]);
    setUserInput('');
    setIsLoading(true);
    
    try {
      const professor = getProfessorForSubject(activeSubject.code);
      const nextTurn = await conductJDProfessorSession(activeSubject.title, professor, studentProfile, [...lectureTurns, userTurn]);
      setLectureTurns(prev => [...prev, nextTurn]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectClick = async (subject: JDSubject) => {
    setActiveSubject(subject);
    setViewMode('MODULE');
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

  const AppearanceSettings = () => (
    <div className="absolute right-6 top-16 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 text-slate-900 animate-in fade-in slide-in-from-top-4 no-print">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Typography Studio</span>
        <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
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
            <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
            <button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded ${textAlign === 'justify' ? 'bg-white shadow text-amber-600' : 'text-slate-50'}`}><AlignJustify size={16}/></button>
          </div>
        </div>
        <div>
           <span className="text-xs font-bold text-slate-700 block mb-3">Color Space</span>
           <div className="grid grid-cols-4 gap-2">
              {Object.keys(THEMES).map((t) => (
                 <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-amber-600 ring-2 ring-amber-600' : 'border-slate-200 hover:border-slate-300'}`} title={t} />
              ))}
           </div>
        </div>
        <div className="pt-4 border-t border-slate-100">
           <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Optical Zoom</span>
              <div className="flex items-center gap-3">
                 <button onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ZoomOut size={14}/></button>
                 <span className="text-[10px] font-mono font-bold text-slate-400">{zoomLevel}%</span>
                 <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ZoomIn size={14}/></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const bookStyles = `
    .book-content { 
        text-align: ${textAlign}; 
        line-height: 2.1; 
        hyphens: auto; 
        widows: 3;
        orphans: 3;
    }
    .book-content h1 { text-align: center; font-weight: 950; font-size: 2.4em; text-transform: uppercase; letter-spacing: 0.2em; margin: 3rem 0 2rem; line-height: 1.1; border-bottom: 5px double currentColor; padding-bottom: 1.5rem; text-indent: 0; }
    .book-content h2 { text-align: center; font-weight: 900; font-size: 1.7em; text-transform: uppercase; letter-spacing: 0.15em; margin: 2rem 0 2rem; line-height: 1.2; text-indent: 0; }
    .book-content h3 { text-align: center; font-weight: 950; font-size: 1.5em; text-transform: uppercase; letter-spacing: 0.18em; margin: 3rem 0 1.5rem; border-top: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; padding: 1.25rem 0; text-indent: 0; display: block; line-height: 1; }
    .book-content h4 { font-weight: 900; font-size: 1.25em; text-transform: uppercase; letter-spacing: 0.1em; margin: 2.5rem 0 1rem; text-indent: 0; border-bottom: 1px solid rgba(0,0,0,0.12); padding-bottom: 0.5rem; }
    .book-content p { margin-top: 0; margin-bottom: 0; text-indent: 3.5em; padding-bottom: 0; }
    .book-content h1 + p, .book-content h2 + p, .book-content h3 + p, .book-content h4 + p, .book-content div + p, .book-content blockquote + p, .book-content .statute-box + p, .book-content ul + p, .book-content ol + p, .book-content hr + p { text-indent: 0; }
    .book-content p + p { margin-top: 0; }
    .book-content blockquote { margin: 2.5rem 3rem; padding: 2rem 2.5rem; border-left: 8px solid #b45309; background-color: rgba(0,0,0,0.03); font-style: normal; text-indent: 0; font-family: 'Merriweather', serif; font-size: 0.92em; line-height: 1.9; border-radius: 4px; box-shadow: inset 0 2px 6px rgba(0,0,0,0.04); }
    .book-content .statute-box { border: 2px solid rgba(0,0,0,0.12); background-color: rgba(251, 191, 36, 0.025); padding: 2.5rem; margin: 3rem 0; border-left: 12px solid #f59e0b; text-indent: 0; font-family: 'Merriweather', serif; border-radius: 6px; box-shadow: 0 15px 45px -20px rgba(251, 191, 36, 0.2); }
    .book-content .socratic-prompt { background: rgba(30, 41, 59, 0.02); border: 2.5px solid #fbbf24; border-radius: 12px; padding: 2.5rem; margin: 4rem 0; box-shadow: 0 25px 60px -25px rgba(251, 191, 36, 0.25); text-indent: 0; position: relative; }
    .book-content .socratic-prompt::before { content: 'GAUGING QUESTION'; position: absolute; top: -14px; left: 35px; background: #fbbf24; color: #000; font-size: 10px; font-weight: 1000; padding: 4px 14px; border-radius: 4px; letter-spacing: 0.3em; }
    .book-content ul, .book-content ol { margin: 2.5rem 0; padding-left: 5rem; text-indent: 0; }
    .book-content li { margin-bottom: 1.5rem; text-indent: 0; }
    .book-content hr { border: 0; border-top: 2px solid rgba(0,0,0,0.1); margin: 4rem auto; width: 40%; }
  `;

  const isQAPhase = lectureTurns.some(turn => turn.role === 'professor' && turn.content.includes('floor is now open'));
  const isWaitingForGraspAnswer = lectureTurns.length > 0 && lectureTurns[lectureTurns.length-1].role === 'professor' && lectureTurns[lectureTurns.length-1].content.includes('socratic-prompt');

  if (viewMode === 'LECTURE' && activeSubject) {
    const prof = getProfessorForSubject(activeSubject.code);
    return (
      <div className={`h-full flex flex-col transition-all duration-500 overflow-hidden ${currentTheme.bg}`}>
        <style>{bookStyles}</style>
        
        {/* Optimized Header */}
        <div className={`h-16 border-b flex items-center justify-between px-6 shrink-0 z-20 shadow-md ${currentTheme.ui}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode('GRID')} className={`p-2 rounded-full transition-all ${currentTheme.text} hover:bg-black/5`}>
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20">
                <GraduationCap size={22} />
              </div>
              <div>
                <h2 className={`text-sm font-bold leading-none ${currentTheme.text}`}>{prof.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest">{prof.specialization}</p>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-1">
                     {isQAPhase ? (
                        <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-black uppercase flex items-center gap-1">
                           <HelpCircle size={10}/> Open Q&A Session
                        </span>
                     ) : isWaitingForGraspAnswer ? (
                        <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-black uppercase flex items-center gap-1">
                           <Zap size={10}/> Dialectical Response
                        </span>
                     ) : (
                        <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase flex items-center gap-1">
                           <BookOpen size={10}/> Canonical Lecture
                        </span>
                     )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-full border border-black/5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest pr-2 border-r border-slate-200">Rigor</span>
                <div className="flex gap-1">
                   {['Mild', 'Moderate', 'Rigorous'].map(r => (
                     <button 
                        key={r}
                        onClick={() => setStudentProfile({...studentProfile, rigorPreference: r as any})}
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold transition-all ${studentProfile.rigorPreference === r ? 'bg-amber-50 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {r}
                      </button>
                   ))}
                </div>
             </div>
             <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition-colors ${currentTheme.text} hover:bg-black/5`}>
                <Settings size={20}/>
             </button>
          </div>
        </div>

        {showSettings && <AppearanceSettings />}

        {/* Improved Main Reading Canvas */}
        <div ref={scrollRef} className={`flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-12 pb-32 scroll-smooth bg-[radial-gradient(circle_at_top_right,#e2e8f0,transparent)]`}>
           <div className="max-w-4xl mx-auto space-y-20">
              {lectureTurns.map((turn) => (
                <div key={turn.id} className={`flex ${turn.role === 'professor' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-6 duration-700`}>
                  {turn.role === 'professor' ? (
                    <div className={`flex gap-8 group w-full ${currentTheme.pageBg} p-8 md:p-20 rounded-xl shadow-xl border border-slate-200 relative overflow-hidden ring-1 ring-white/50 transition-all hover:shadow-2xl`}>
                       <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.03] blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                       <div className="shrink-0 pt-2 no-print hidden sm:block">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg ring-2 ring-amber-500/10">
                            <User size={28} />
                          </div>
                       </div>
                       <div className="flex-1 space-y-6 relative z-10">
                          <div className="flex items-center justify-between no-print mb-4 border-b border-slate-100 pb-4">
                             <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">{prof.name} • {prof.almaMater}</span>
                                <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                <span className="text-[10px] text-slate-400 font-mono">{new Date(turn.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                             <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title="Bookmark"><Bookmark size={16}/></button>
                             </div>
                          </div>
                          <div 
                            className={`book-content ${fontFamily} ${currentTheme.text} transition-all tracking-normal`} 
                            style={{ fontSize: `${effectiveFontSize}px` }}
                            dangerouslySetInnerHTML={{ __html: turn.content }} 
                          />
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-3 max-w-[80%] no-print">
                       <div className="flex items-center gap-4 mb-1">
                          <span className="text-[10px] text-slate-400 font-mono">{new Date(turn.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Student Submission</span>
                       </div>
                       <div className="bg-slate-900 border border-slate-700 rounded-3xl rounded-tr-none px-10 py-6 text-slate-100 font-medium text-xl shadow-xl ring-1 ring-white/10 leading-relaxed transition-all hover:ring-white/30">
                          {turn.content}
                       </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className={`flex gap-8 group w-full ${currentTheme.pageBg} p-12 md:p-20 rounded-xl shadow-lg border border-slate-200 animate-pulse`}>
                   <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0" />
                   <div className="flex-1 space-y-8 pt-2">
                      <div className="h-4 w-48 bg-slate-100 rounded" />
                      <div className="space-y-4">
                        <div className="h-6 w-full bg-slate-50 rounded" />
                        <div className="h-6 w-11/12 bg-slate-50 rounded" />
                        <div className="h-6 w-9/12 bg-slate-50 rounded" />
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Redesigned Integrated Input Area */}
        <div className={`shrink-0 p-8 border-t z-30 transition-all duration-500 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.08)] ${currentTheme.ui}`}>
           <div className="max-w-4xl mx-auto relative group">
              <div className="absolute -top-4 left-8 px-4 py-1.5 bg-amber-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg z-10 border border-white/20 ring-4 ring-[#f1f5f9]">
                {isQAPhase ? 'Active Inquiry Block' : 'Legal Synthesis Submission'}
              </div>
              
              <div className="relative flex items-end gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-4 focus-within:bg-white focus-within:border-amber-500 transition-all shadow-inner focus-within:ring-8 focus-within:ring-amber-500/5 group">
                <textarea 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder={isQAPhase ? "Submit a clarifying question for ProfessorLex's definitive answer..." : "Submit your synthesis of the doctrine to the Professor..."}
                  className="flex-1 bg-transparent py-4 px-6 text-xl font-medium outline-none resize-none min-h-[100px] max-h-[250px] scrollbar-hide text-slate-900 placeholder-slate-400"
                  rows={2}
                />
                
                <div className="flex flex-col gap-2 pb-2">
                  <button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !userInput.trim()}
                    className="h-14 w-14 bg-amber-600 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-amber-500 disabled:opacity-30 transition-all active:scale-90 hover:scale-105 border-2 border-white/10"
                  >
                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                  </button>
                </div>
              </div>
           </div>
           
           <div className="mt-6 flex justify-center gap-12 no-print opacity-50">
              <div className="flex items-center gap-3">
                 <ShieldCheck size={18} className="text-green-600" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Grounding Verified</span>
              </div>
              <div className="flex items-center gap-3">
                 <Sparkles size={18} className="text-amber-500" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Socratic AI Active</span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Module reading view remains largely the same but with proportional padding updates
  if (viewMode === 'MODULE' && activeSubject) {
    return (
      <div className={`h-full flex flex-col transition-colors duration-500 overflow-hidden animate-in fade-in ${currentTheme.bg}`}>
        <style>{bookStyles}</style>
         <div className={`h-14 border-b flex items-center justify-between px-6 shrink-0 z-30 shadow-sm ${currentTheme.ui}`}>
            <button onClick={() => setViewMode('GRID')} className={`flex items-center gap-2 text-sm font-bold transition-all ${currentTheme.text} opacity-70 hover:opacity-100`}>
              <ArrowLeft size={18} /> Curriculum
            </button>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <button onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))} className={`p-1.5 rounded-lg hover:bg-black/5 ${currentTheme.text}`}><ZoomOut size={18}/></button>
                  <span className={`text-[11px] font-black w-10 text-center ${currentTheme.text}`}>{zoomLevel}%</span>
                  <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className={`p-1.5 rounded-lg hover:bg-black/5 ${currentTheme.text}`}><ZoomIn size={18}/></button>
               </div>
               <div className="w-px h-5 bg-slate-200"></div>
               <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`}>
                  <Settings size={20} />
               </button>
            </div>
         </div>

         {showSettings && <AppearanceSettings />}

         <div className={`flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth custom-scrollbar`}>
            {isLoading ? (
               <div className="h-full flex flex-col items-center justify-center opacity-70">
                  <Loader2 size={64} className="animate-spin text-amber-600 mb-8" />
                  <p className={`font-serif text-3xl font-black tracking-tighter ${currentTheme.text}`}>Synthesizing Scholarly Module...</p>
               </div>
            ) : (
               <div className="max-w-5xl mx-auto mb-40">
                  <div 
                    className={`min-h-[11in] shadow-2xl rounded-xl py-24 px-12 md:px-24 transition-all duration-700 relative overflow-hidden ${currentTheme.pageBg} ${currentTheme.text} ${fontFamily}`}
                    style={{ fontSize: `${effectiveFontSize}px` }}
                  >
                     <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.04] blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
                     <div className="border-b-[4px] border-double pb-16 mb-20 text-center relative z-10 no-print" style={{ borderColor: 'currentColor' }}>
                        <div className="flex justify-between items-start absolute right-0 top-0 opacity-40 hover:opacity-100 transition-opacity">
                           <div className="flex gap-4">
                              <button onClick={() => window.print()} className="p-3 rounded-xl hover:bg-black/5" title="Print"><Printer size={20}/></button>
                              <button className="p-3 rounded-xl hover:bg-black/5" title="Bookmark"><Bookmark size={20}/></button>
                           </div>
                        </div>
                        <span className="text-[12px] font-black uppercase tracking-[0.7em] mb-6 block opacity-50">LegalPH Research Collection</span>
                        <h1 className="text-6xl font-serif font-black uppercase leading-[1.05] tracking-tighter mb-10">
                          {activeSubject.title}
                        </h1>
                        <div className="flex items-center justify-center gap-10 text-[12px] font-black uppercase tracking-[0.4em] opacity-40">
                           <div className="flex items-center gap-3"><BookOpen size={18}/> {activeSubject.code}</div>
                           <div className="w-2 h-2 bg-current rounded-full"></div>
                           <div className="flex items-center gap-3"><FileText size={18}/> {activeSubject.units} Units</div>
                        </div>
                     </div>
                     <div className="book-content" dangerouslySetInnerHTML={{ __html: moduleContent || '' }} />
                     <div className="mt-40 pt-16 border-t border-current/10 text-center opacity-30 italic font-serif text-[13px] tracking-[1.2em]">
                       *** FINIS DOCUMENT ***
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
    );
  }

  // Standard curriculum grid remains unchanged.
  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-12 animate-in fade-in duration-500 bg-slate-50">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={12} /> Adaptive Learning Platform
            </div>
            <h2 className="text-4xl font-serif font-black text-slate-900 flex items-center gap-4 tracking-tight">
              Integrated JD Program
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl leading-relaxed text-lg">
              Master the entire Philippine legal curriculum through interactive lectures and Socratic dialogue with subject-matter experts.
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 min-w-[280px]">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Dashboard</span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-black uppercase">
                   <ShieldCheck size={10}/> Verified
                </div>
             </div>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1.5 uppercase">
                      <span>Curriculum Coverage</span>
                      <span>{completedSubjects.size}/40</span>
                   </div>
                   <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                     <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000" style={{ width: `${(completedSubjects.size / 40) * 100}%` }} />
                   </div>
                </div>
                <div className="pt-2 flex gap-4">
                   <div className="flex-1 text-center">
                      <div className="text-xl font-black text-slate-800">{bookmarkedSubjects.size}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Bookmarked</div>
                   </div>
                   <div className="w-px h-8 bg-slate-100" />
                   <div className="flex-1 text-center">
                      <div className="text-xl font-black text-slate-800">{studentProfile.rigorPreference}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Rigor Mode</div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-24">
          {JD_CURRICULUM.map(year => (
            <div key={year.year} className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-2xl ring-4 ring-slate-100">
                  {year.year}
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-black text-slate-800">
                    Year {['I', 'II', 'III', 'IV'][year.year - 1]}: {year.year === 1 ? 'Foundations' : year.year === 2 ? 'Procedure' : year.year === 3 ? 'Integration' : 'Bar Readiness'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Year Level Progress Cluster</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {year.semesters.map(sem => (
                  <div key={sem.name} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{sem.name}</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 gap-3">
                      {sem.subjects.map(sub => {
                        const prof = getProfessorForSubject(sub.code);
                        return (
                          <div key={sub.code} className={`group p-6 rounded-2xl transition-all border ${completedSubjects.has(sub.code) ? 'bg-green-50/30 border-green-200' : 'bg-white border-slate-100 hover:border-amber-300 shadow-sm hover:shadow-md'}`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${completedSubjects.has(sub.code) ? 'bg-green-200 text-green-800' : 'bg-slate-100 text-slate-50'}`}>
                                  {sub.code}
                                </span>
                                {completedSubjects.has(sub.code) && <CheckCircle2 size={12} className="text-green-600" />}
                              </div>
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{sub.units} Units</span>
                            </div>
                            
                            <h4 className="text-lg font-serif font-black text-slate-800 leading-tight mb-2 group-hover:text-amber-800 transition-colors">
                              {sub.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-1 opacity-70">Synthesized expertise from {prof.almaMater} traditions.</p>
                            
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => enterLectureHall(sub)}
                                 className="flex-1 h-10 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                               >
                                  <MessageSquare size={14} /> Enter Lecture Hall
                               </button>
                               <button 
                                 onClick={() => handleSubjectClick(sub)}
                                 className="h-10 px-4 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                               >
                                  <BookOpen size={14} /> Module
                                </button>
                            </div>
                          </div>
                        );
                      })}
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
