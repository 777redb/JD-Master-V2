
import React, { useState } from 'react';
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
  { label: 'Crimson Pro', value: 'font-crimson', desc: 'Book / Classic' },
  { label: 'Merriweather', value: 'font-serif', desc: 'Standard Legal' },
  { label: 'Inter', value: 'font-sans', desc: 'Modern Clean' },
  { label: 'JetBrains Mono', value: 'font-mono', desc: 'Technical' },
];

export const LawReview: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [profile, setProfile] = useState(LEARNER_LEVELS[1]); 
  const [syllabus, setSyllabus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reader Settings
  const [theme, setTheme] = useState<Theme>('light'); 
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson'); 
  const [showAppearance, setShowAppearance] = useState(false);
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');

  const currentTheme = THEMES[theme];
  // Base font size calculations to mimic print points (pt)
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100)); 

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setSyllabus('');
    try {
      const result = await generateLawSyllabus(topic, profile);
      setSyllabus(result);
    } catch (e) {
      setSyllabus("<p>Failed to generate syllabus.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `<html><head><title>Reviewer: ${topic}</title></head><body>${syllabus}</body></html>`
    ], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `${topic.replace(/\s+/g, '_')}_Reviewer.html`;
    document.body.appendChild(element);
    element.click();
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
        .book-content h1 {
          text-align: center;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 3rem;
          margin-bottom: 2rem;
          line-height: 1.2;
          border-bottom: 3px double currentColor;
          padding-bottom: 1.5rem;
          text-indent: 0;
        }

        .book-content h3 {
          font-weight: 700;
          text-transform: uppercase;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid ${theme === 'light' || theme === 'sepia' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
          letter-spacing: 0.05em;
          font-size: 1.25em;
          text-indent: 0;
          page-break-after: avoid;
        }

        .book-content h4 {
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.1em;
          text-transform: uppercase;
          text-indent: 0;
          page-break-after: avoid;
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
        .book-content div + p {
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
        
        .book-content li strong {
          color: ${theme === 'light' || theme === 'sepia' ? '#78350f' : '#fcd34d'};
        }

        /* BLOCKQUOTES (Case Doctrines) */
        .book-content blockquote {
          margin: 2rem 2.5rem;
          padding: 1.25rem 1.5rem;
          border-left: 4px solid ${theme === 'light' || theme === 'sepia' ? '#b45309' : '#fbbf24'};
          background-color: ${theme === 'light' ? 'rgba(0,0,0,0.02)' : theme === 'sepia' ? 'rgba(91, 70, 54, 0.05)' : 'rgba(255,255,255,0.05)'};
          font-style: italic;
          text-indent: 0;
          position: relative;
        }

        /* STATUTE BOX */
        .book-content .statute-box {
          border: 1px solid ${theme === 'light' || theme === 'sepia' ? '#cbd5e1' : '#334155'};
          background-color: ${theme === 'light' ? '#f8fafc' : theme === 'sepia' ? '#f4e9d6' : 'rgba(255,255,255,0.03)'};
          padding: 1.5rem;
          margin: 2rem 0;
          border-radius: 4px;
          text-indent: 0;
        }
        .book-content .statute-box p {
          text-indent: 0;
          font-family: 'Merriweather', serif;
          font-size: 0.95em;
          margin-bottom: 1em;
        }

        /* TABLES */
        .book-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.9em;
          text-indent: 0;
        }
        .book-content th, .book-content td {
          border: 1px solid ${theme === 'light' || theme === 'sepia' ? '#cbd5e1' : '#475569'};
          padding: 0.75rem;
          vertical-align: top;
          text-align: left;
        }
        .book-content th {
          background-color: ${theme === 'light' || theme === 'sepia' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'};
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.85em;
          letter-spacing: 0.05em;
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
        
        .end-marker {
          text-align: center;
          margin-top: 4rem;
          opacity: 0.5;
          font-size: 0.8rem;
          letter-spacing: 0.2rem;
          text-indent: 0;
        }
      `}</style>

      {/* Top Controls Bar */}
      <div className={`border-b z-20 sticky top-0 transition-all duration-300 ease-in-out ${currentTheme.ui} shadow-md px-4 lg:px-6 py-4`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
           {/* Input Section */}
           <div className="flex-1 flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter Topic (e.g., 'Requisites of Self-Defense', 'Law on Property')"
                  className={`w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-serif text-sm shadow-inner
                    ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/10 border-white/10 text-slate-100'}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
              </div>
              
              <div className="w-full md:w-56">
                <div className="relative">
                   <GraduationCap className={`absolute left-3 top-2.5 ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`} size={16} />
                   <select
                     value={profile}
                     onChange={(e) => setProfile(e.target.value)}
                     className={`w-full p-2.5 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer font-medium text-sm
                       ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/10 border-white/10 text-slate-200'}`}
                   >
                     {LEARNER_LEVELS.map(level => (
                       <option key={level} value={level} className="text-slate-900">{level}</option>
                     ))}
                   </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading || !topic}
                    className="h-[42px] px-6 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 duration-100 whitespace-nowrap text-sm"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Book size={16} />}
                    Create Module
                  </button>
              </div>
           </div>

           {/* Toolbar Actions */}
           <div className="flex items-center gap-1">
              <div className="w-px h-6 bg-slate-300/50 mx-2"></div>
              <div className="relative">
                <button 
                  onClick={() => setShowAppearance(!showAppearance)}
                  className={`p-2.5 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`}
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
              
              <button onClick={handleDownload} disabled={!syllabus} className={`p-2.5 hover:bg-black/5 rounded-lg transition-colors ${currentTheme.text} disabled:opacity-30`} title="Download">
                 <Download size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* Main Reader Area - Book Simulation */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth ${currentTheme.bg}`}>
        {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center opacity-70">
              <Loader2 className={`animate-spin mb-6 ${theme === 'light' ? 'text-amber-800' : 'text-amber-500'}`} size={64} />
              <p className={`font-serif text-xl font-medium animate-pulse ${currentTheme.text}`}>Authoring Comprehensive Module...</p>
              <p className={`text-sm mt-2 opacity-60 ${currentTheme.text}`}>Consulting Jurisprudence & Statutes</p>
           </div>
        ) : syllabus ? (
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
            dangerouslySetInnerHTML={{ __html: syllabus }}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-60">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 border-4 border-double ${currentTheme.border} ${currentTheme.pageBg} shadow-lg`}>
              <BookOpen size={48} className={currentTheme.text} />
            </div>
            <h2 className={`text-3xl font-serif font-bold mb-4 ${currentTheme.text}`}>Legal Reviewer Studio</h2>
            <p className={`text-lg text-center max-w-md leading-relaxed opacity-80 ${currentTheme.text}`}>
              Generate premium, book-quality study modules with textbook formatting, proper indentation, and comprehensive coverage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
