
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodalLibrary } from './components/CodalLibrary';
import { CaseDigest } from './components/CaseDigest';
import { MockBar } from './components/MockBar';
import { LegalPad } from './components/LegalPad';
import { LawReview } from './components/LawReview';
import { Jurisprudence } from './components/Jurisprudence';
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
  ChevronRight
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
    { name: "Lawphil", url: "https://lawphil.net/", desc: "Laws and jurisprudence archive.", icon: Gavel, color: "bg-amber-50 text-amber-700" }
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
               <div className="grid grid-cols-1 gap-3">
                {sources.map((source, idx) => (
                   <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/30 transition-all shadow-sm">
                      <div className={`p-2.5 rounded-lg shrink-0 ${source.color} group-hover:scale-105 transition-transform`}>
                         <source.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-amber-700 transition-colors">{source.name}</h3>
                            <ExternalLink size={12} className="text-slate-400 opacity-0 group-hover:opacity-100" />
                         </div>
                         <p className="text-xs text-slate-500 truncate">{source.desc}</p>
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
        <div className="flex flex-col h-[380px]">
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
    { title: "Jurisprudence", desc: "Search Supreme Court decisions, doctrines, and legal precedents.", icon: Scale, view: AppView.JURISPRUDENCE, color: "bg-indigo-50 text-indigo-600", accent: "group-hover:text-indigo-600", border: "hover:border-indigo-200" },
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

const CaseBuild = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const handleBuild = async () => { if(!query) return; setLoading(true); try { const res = await analyzeLegalResearch(query); setResult(res); } finally { setLoading(false); } };
  return (
    <div className="h-full flex flex-col">
       <div className="mb-8"><h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3"><Briefcase className="text-amber-600" size={32}/> Case Build & Research</h2></div>
       <div className="flex gap-4 mb-8">
        <input className="flex-1 border border-slate-300 p-5 rounded-xl outline-none text-lg font-serif" placeholder="Enter legal scenario..." value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={handleBuild} disabled={loading || !query} className="bg-slate-900 text-white px-8 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50">{loading ? 'Researching...' : 'Build Case'}</button>
      </div>
      <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-12 overflow-y-auto">
        {result ? <div className="max-w-4xl mx-auto prose prose-slate prose-lg" dangerouslySetInnerHTML={{ __html: result }} /> : <p className="text-center text-slate-400 font-serif">Enter a scenario to begin case analysis.</p>}
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
      case AppView.JURISPRUDENCE: return <Jurisprudence />;
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
