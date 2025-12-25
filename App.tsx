
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodalLibrary } from './components/CodalLibrary';
import { CaseDigest } from './components/CaseDigest';
import { MockBar } from './components/MockBar';
import { LegalPad } from './components/LegalPad';
import { LawReview } from './components/LawReview';
import { LegalDoctrines } from './components/LegalDoctrines';
import { ContractDrafting } from './components/ContractDrafting';
import { JDProgram } from './components/JDProgram';
import { AppView } from './types';
import { analyzeLegalResearch, fetchLegalNews } from './services/gemini';
import { 
  Briefcase, 
  Gavel, 
  Menu, 
  ScrollText, 
  BookOpen, 
  Scale, 
  Award, 
  PenTool, 
  FileEdit,
  ArrowRight,
  Sparkles,
  Quote,
  Globe,
  Monitor,
  Newspaper,
  ExternalLink,
  RefreshCw,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Library,
  Settings,
  X,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignJustify,
  ChevronUp,
  Layout,
  PanelLeftOpen,
  PanelLeftClose,
  Loader2,
  Wand2,
  FileText,
  Copy,
  Info
} from 'lucide-react';

const LegalNews = () => {
  const [newsItems, setNewsItems] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    if (newsItems.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [newsItems]);

  const handleRefresh = async () => {
    setLoading(true);
    const updates = await fetchLegalNews();
    // Parse the <li> items from the string
    const items = updates.match(/<li>(.*?)<\/li>/gs)?.map(item => item.replace(/<\/?li>/g, '')) || [];
    setNewsItems(items);
    setCurrentIndex(0);
    setLoading(false);
  };

  const sources = [
    { name: "Supreme Court", url: "https://sc.judiciary.gov.ph/", desc: "Official portal. Announcements.", icon: Scale, color: "bg-red-50 text-red-700" },
    { name: "SC E-Library", url: "https://elibrary.judiciary.gov.ph/", desc: "Primary source of PH legal info.", icon: BookOpen, color: "bg-blue-50 text-blue-700" },
    { name: "Official Gazette", url: "https://www.officialgazette.gov.ph/", desc: "Executive Orders & Laws.", icon: Newspaper, color: "bg-slate-50 text-slate-700" },
    { name: "Lawphil", url: "https://lawphil.net/", desc: "Laws and jurisprudence archive.", icon: Gavel, color: "bg-amber-50 text-amber-700" },
    { name: "PHILJA", url: "https://philja.judiciary.gov.ph/", desc: "Philippine Judicial Academy portal.", icon: Library, color: "bg-emerald-50 text-emerald-700" }
  ];

  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-8 h-full">
            <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="text-amber-600" size={24}/> LegalPH News & Resources
                </h2>
                <p className="text-sm text-slate-500 mt-1">Direct access to official portals and latest updates.</p>
            </div>
            <div className="flex-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Official Portals</span>
               <div className="grid grid-cols-1 gap-2.5">
                {sources.map((source, idx) => (
                   <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/30 transition-all shadow-sm">
                      <div className={`p-2.5 rounded-lg shrink-0 ${source.color} group-hover:scale-105 transition-transform`}>
                         <source.icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-amber-700 transition-colors">{source.name}</h3>
                            <ExternalLink size={12} className="text-slate-400 opacity-0 group-hover:opacity-100" />
                         </div>
                         <p className="text-[11px] text-slate-500 truncate">{source.desc}</p>
                      </div>
                      <div className="text-slate-300 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-all">
                          <ArrowRight size={16} />
                      </div>
                   </a>
                ))}
               </div>
            </div>
        </div>
        
        {/* Latest Highlights News Panel */}
        <div className="flex flex-col h-full lg:min-h-[460px]">
           <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Highlights</span>
              <div className="flex items-center gap-3">
                {newsItems.length > 0 && !loading && (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">{currentIndex + 1}/{newsItems.length}</span>
                    <button 
                      onClick={() => setCurrentIndex((prev) => (prev + 1) % newsItems.length)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
                <button onClick={handleRefresh} disabled={loading} className="text-slate-400 hover:text-amber-600 transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide border-l border-slate-200 pl-3">
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>
           </div>
           
           <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex flex-col justify-center relative overflow-hidden group">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16"></div>
               
               {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                     <RefreshCw className="animate-spin text-amber-500" size={32} />
                     <span className="text-sm font-medium animate-pulse">Syncing with SC Bulletins...</span>
                  </div>
               ) : newsItems.length > 0 ? (
                  <div key={currentIndex} className="animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest mb-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                      Breaking Legal Update
                    </div>
                    <div className="text-sm space-y-4">
                       <div 
                         className="news-headline font-serif text-2xl font-bold text-slate-900 leading-tight"
                         dangerouslySetInnerHTML={{ __html: newsItems[currentIndex].split('</strong>')[0] + '</strong>' }} 
                       />
                       <div 
                         className="news-summary text-slate-600 text-lg leading-relaxed font-medium"
                         dangerouslySetInnerHTML={{ __html: newsItems[currentIndex].split('</strong>')[1] || '' }} 
                       />
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                       <span className="text-xs text-slate-400 font-medium">Source: Official SC RSS</span>
                       <div className="flex gap-1.5">
                          {newsItems.map((_, idx) => (
                             <div 
                               key={idx} 
                               className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-6 bg-amber-500' : 'w-1.5 bg-slate-200'}`}
                             />
                          ))}
                       </div>
                    </div>
                  </div>
               ) : (
                  <div className="text-center text-slate-400 font-serif italic py-12">
                     No recent announcements detected. Check back later.
                  </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ onChangeView }: { onChangeView: (v: AppView) => void }) => {
  const quote = { latin: "Ignorantia legis neminem excusat.", english: "Ignorance of the law excuses no one." };

  const features = [
    { title: "JD Program", desc: "Systematic self-study curriculum modeled after top PH law schools.", icon: GraduationCap, view: AppView.JD_PROGRAM, color: "bg-slate-50 text-slate-900", accent: "group-hover:text-slate-900", border: "hover:border-slate-900" },
    { title: "Codal Library", desc: "Full text of PH laws updated with AI annotations and easy navigation.", icon: BookOpen, view: AppView.CODAL_LIBRARY, color: "bg-blue-50 text-blue-600", accent: "group-hover:text-blue-600", border: "hover:border-blue-200" },
    { title: "Legal Doctrines", desc: "Search Supreme Court decisions, doctrines, and legal precedents.", icon: Library, view: AppView.LEGAL_DOCTRINES, color: "bg-indigo-50 text-indigo-600", accent: "group-hover:text-indigo-600", border: "hover:border-indigo-200" },
    { title: "Case Digest AI", desc: "Instant summaries: Facts, Issues, Ruling. Strict format adherence.", icon: FileEdit, view: AppView.CASE_DIGEST, color: "bg-emerald-50 text-emerald-600", accent: "group-hover:text-emerald-600", border: "hover:border-emerald-200" },
    { title: "Mock Bar Exams", desc: "Adaptive quizzes and essay questions tailored to your level.", icon: Award, view: AppView.MOCK_BAR, color: "bg-amber-50 text-amber-600", accent: "group-hover:text-amber-600", border: "hover:border-amber-200" },
    { title: "Legal Research", desc: "Build cases with comprehensive AI analysis and argumentation.", icon: Briefcase, view: AppView.CASE_BUILD, color: "bg-violet-50 text-violet-600", accent: "group-hover:text-violet-600", border: "hover:border-violet-200" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg isolate">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.amber.600),theme(colors.slate.900))]"></div>
        <div className="px-5 py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full lg:w-auto self-start lg:self-center">
            <div className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20 mb-3">
              <Sparkles size={12} className="mr-1.5" /> JD Master v3.0
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-white mb-2">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Counsel!</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-lg mb-6 leading-relaxed">
              Your AI-powered legal command center is ready. Access the systematic JD curriculum or dive into the Codal library.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => onChangeView(AppView.JD_PROGRAM)} className="inline-flex justify-center items-center px-4 py-2 text-sm font-semibold text-slate-900 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors shadow-lg">
                Enter JD Program <ArrowRight className="ml-2 -mr-1" size={16} />
              </button>
            </div>
          </div>
          <div className="w-full lg:w-[400px] shrink-0 grid grid-cols-2 gap-3">
             <div className="col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-4 backdrop-blur-md shadow-lg group">
                <div className="flex items-center gap-2 mb-2">
                    <Quote size={12} className="text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-200/80 uppercase tracking-widest">Maxim</span>
                </div>
                <p className="text-base font-serif font-medium text-white italic leading-snug mb-1">"{quote.latin}"</p>
                <p className="text-slate-400 text-[10px] pl-2 border-l-2 border-amber-500/50">{quote.english}</p>
             </div>
             <div onClick={() => onChangeView(AppView.LEGAL_PAD)} className="col-span-1 overflow-hidden rounded-xl bg-white/5 border border-white/10 p-3 cursor-pointer group hover:bg-white/15 transition-all">
                 <FileEdit size={14} className="text-blue-300 mb-2" />
                 <h3 className="font-serif font-bold text-white text-xs">Legal Pad</h3>
                 <p className="text-[10px] text-slate-400">My Notes</p>
             </div>
             <div onClick={() => onChangeView(AppView.LAW_REVIEW)} className="col-span-1 overflow-hidden rounded-xl bg-white/5 border border-white/10 p-3 cursor-pointer group hover:bg-white/15 transition-all">
                 <ScrollText size={14} className="text-purple-300 mb-2" />
                 <h3 className="font-serif font-bold text-white text-xs">Law Review</h3>
                 <p className="text-[10px] text-slate-400">Study Guide</p>
             </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl font-serif font-bold text-slate-900">Legal Toolbox</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <div key={idx} onClick={() => onChangeView(feature.view)} className={`group bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg ${feature.border} transition-all cursor-pointer`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                <feature.icon size={20} />
              </div>
              <h3 className={`text-lg font-serif font-bold text-slate-900 mb-2 ${feature.accent}`}>{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-4 text-xs">{feature.desc}</p>
              <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                Open Tool <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <LegalNews />
    </div>
  );
};

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

const CaseBuild = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Collapsible States
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  
  // Reading Mode States (Identical to Legal Doctrines)
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [showAppearance, setShowAppearance] = useState(false);
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentTheme = THEMES[theme];
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100));

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleBuild = async () => { 
    if(!query) return; 
    setLoading(true); 
    setResult('');
    try { 
      const res = await analyzeLegalResearch(query); 
      setResult(res); 
      setIsConfigOpen(false); // Focus on result
    } finally { 
      setLoading(false); 
    } 
  };

  const handleCopy = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = result;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(text);
    alert('Research analysis copied to clipboard!');
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Premium Book-Grade Styles */}
      <style>{`
        .book-content {
          text-align: ${textAlign};
          line-height: 1.8;
          hyphens: auto;
        }
        .book-content h3 {
          text-align: center;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 3rem;
          margin-bottom: 2rem;
          line-height: 1.2;
          padding-bottom: 1.5rem;
          border-bottom: 3px double currentColor;
          text-indent: 0;
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
        .book-content p {
          margin-bottom: 1rem;
          text-indent: 2.5em;
        }
        .book-content h3 + p, .book-content h4 + p, .book-content div + p, .book-content blockquote + p {
          text-indent: 0;
        }
        .book-content blockquote {
          margin: 2rem 2.5rem;
          padding: 1.25rem 1.5rem;
          border-left: 4px solid #b45309;
          background-color: rgba(0,0,0,0.02);
          font-style: italic;
          text-indent: 0;
        }
        .book-content .statute-box {
          border: 1px solid currentColor;
          background: rgba(0,0,0,0.03);
          padding: 1.5rem;
          margin: 2rem 0;
          text-indent: 0;
          font-family: 'Merriweather', serif;
          font-size: 0.95em;
          border-radius: 4px;
        }
      `}</style>

      {/* Main Header */}
      <div className="mb-4 no-print shrink-0 px-2 flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
          <Briefcase className="text-amber-600" size={28}/> 
          Case Build & Research
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
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

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Configuration Panel (Top, Collapsible Height) */}
        <div id="form-section" className={`
          border-b border-slate-200 bg-white transition-all duration-300 ease-in-out no-print z-20 overflow-hidden
          ${isConfigOpen ? 'max-h-[50%] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="p-6 h-full flex flex-col min-h-0">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider mb-3">
                   <Scale size={12} /> Scenario Builder
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 leading-tight">
                  Legal Fact-Pattern Analysis
                </h3>
              </div>
              <button onClick={() => setIsConfigOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                <ChevronUp size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
              <div className="space-y-1.5 h-full flex flex-col">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 mb-4">
                   <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                   <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                     Detail the facts of your case. AI will identify controlling statutes, jurisprudence, and formulate a strategy.
                   </p>
                </div>
                <label className="text-xs font-bold text-slate-700 block ml-1">Case Facts / Legal Scenario</label>
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full min-h-[120px] p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none text-lg leading-relaxed font-serif shadow-inner resize-none transition-all"
                  placeholder="Enter the full legal scenario here... (e.g., A landlord refuses to return the security deposit after the lease ended...)"
                />
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex justify-end">
               <button 
                onClick={handleBuild}
                disabled={loading || !query}
                className="px-10 h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <><Wand2 size={18}/> Synthesize Research</>}
               </button>
            </div>
          </div>
        </div>

        {/* Preview Section (Bottom, Full Width) */}
        <div className={`flex-1 flex flex-col overflow-hidden relative transition-colors duration-300 ${currentTheme.bg}`}>
          {/* Float Collapsed Toggle Controls */}
          <div className="absolute top-4 left-6 flex flex-col gap-2 z-50 no-print">
             {!isConfigOpen && (
               <button 
                 onClick={() => setIsConfigOpen(true)}
                 className={`p-2 rounded-lg shadow-xl border transition-all ${currentTheme.ui} ${currentTheme.text}`}
                 title="Open Research Configuration"
               >
                 <Layout size={18} />
               </button>
             )}
          </div>

          <div className={`h-12 border-b flex justify-between items-center px-6 z-10 shrink-0 no-print ${currentTheme.ui}`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setIsConfigOpen(!isConfigOpen)} 
                  className={`p-1.5 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`}
                  title="Toggle Configuration"
                >
                  {isConfigOpen ? <ChevronUp size={18}/> : <Layout size={18}/>}
                </button>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text} flex items-center gap-2`}>
                <FileText size={14}/>
                Research Output
              </span>
            </div>

            <div className="flex items-center gap-2">
              {result && (
                <button onClick={handleCopy} className={`px-3 py-1.5 text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest border rounded-lg hover:bg-black/5 transition-all ${currentTheme.text} ${currentTheme.border}`}>
                  <Copy size={14}/> Copy Result
                </button>
              )}
            </div>
          </div>
          
          {/* Appearance Settings Popover */}
          {showAppearance && (
            <div className="absolute right-6 top-14 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50 text-slate-900 animate-in fade-in slide-in-from-top-4 no-print">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Display Settings</span>
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
                   <span className="text-xs font-bold text-slate-700 block mb-3">Paper Theme</span>
                   <div className="grid grid-cols-4 gap-2">
                      {Object.keys(THEMES).map((t) => (
                         <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-blue-600 ring-2 ring-blue-600' : 'border-slate-200 hover:border-slate-300'}`} title={t} />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Reading Surface */}
          <div className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth custom-scrollbar relative">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
            
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center opacity-70">
                <Loader2 className="animate-spin text-amber-600 mb-6" size={64} />
                <p className="font-serif text-2xl font-bold italic text-slate-800 animate-pulse text-center">Synthesizing Jurisprudence...</p>
                <p className="text-sm mt-2 text-slate-500 text-center">Building legal arguments and cross-referencing statutes</p>
              </div>
            ) : result ? (
              <div 
                className={`max-w-[8.5in] mx-auto min-h-[11in] shadow-2xl rounded-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${currentTheme.pageBg} ${currentTheme.text} ${fontFamily} book-content py-20 px-12 md:px-24`}
                style={{ fontSize: `${effectiveFontSize}px` }}
              >
                <div dangerouslySetInnerHTML={{ __html: result }} />
                <div className="mt-20 pt-10 border-t border-black/5 text-center opacity-30 italic font-serif text-[10px] tracking-widest">
                  *** END OF CASE ANALYSIS ***
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-slate-200 shadow-sm ${currentTheme.ui}`}>
                  <Briefcase size={48} className="opacity-20" />
                </div>
                <p className={`max-w-xs text-center font-serif text-lg ${currentTheme.text}`}>
                  Enter a legal scenario above to begin a deep-dive case research session.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderView = () => {
    switch(view) {
      case AppView.JD_PROGRAM: return <JDProgram />;
      case AppView.CODAL_LIBRARY: return <CodalLibrary />;
      case AppView.CASE_DIGEST: return <CaseDigest />;
      case AppView.MOCK_BAR: return <MockBar />;
      case AppView.LEGAL_PAD: return <LegalPad />;
      case AppView.CASE_BUILD: return <CaseBuild />;
      case AppView.CONTRACT_DRAFTING: return <ContractDrafting />;
      case AppView.LEGAL_DOCTRINES: return <LegalDoctrines />;
      case AppView.LAW_REVIEW: return <LawReview />;
      default: return <Dashboard onChangeView={setView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Sidebar currentView={view} onChangeView={setView} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="md:hidden bg-white border-b p-4 flex items-center justify-between shadow-sm z-10">
           <div className="flex items-center gap-2"><div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white"><Gavel size={18}/></div><span className="font-serif font-bold text-lg">LegalPH</span></div>
           <button onClick={() => setIsMobileOpen(true)} className="p-2"><Menu /></button>
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-12">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
