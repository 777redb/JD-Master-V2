import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodalLibrary } from './components/CodalLibrary';
import { CaseDigest } from './components/CaseDigest';
import { MockBar } from './components/MockBar';
import { LegalPad } from './components/LegalPad';
import { LawReview } from './components/LawReview';
import { Jurisprudence } from './components/Jurisprudence';
import { ContractDrafting } from './components/ContractDrafting';
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
  RefreshCw
} from 'lucide-react';

const LegalNews = () => {
  const [news, setNews] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial fetch on mount
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    const updates = await fetchLegalNews();
    setNews(updates);
    setLoading(false);
  };

  const sources = [
    {
      name: "Supreme Court",
      url: "https://sc.judiciary.gov.ph/",
      desc: "Official portal. Bar Announcements & Issuances.",
      icon: Scale,
      color: "bg-red-50 text-red-700"
    },
    {
      name: "SC e-Court",
      url: "https://sc.judiciary.gov.ph/ecourt-ph/",
      desc: "Digital court services & case tracking.",
      icon: Monitor,
      color: "bg-blue-50 text-blue-700"
    },
    {
      name: "Official Gazette",
      url: "https://www.officialgazette.gov.ph/",
      desc: "Official journal. Executive Orders & Republic Acts.",
      icon: Newspaper,
      color: "bg-slate-50 text-slate-700"
    },
    {
      name: "Lawphil",
      url: "https://lawphil.net/",
      desc: "Archive of Philippine laws and jurisprudence.",
      icon: BookOpen,
      color: "bg-amber-50 text-amber-700"
    }
  ];

  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Header & Official Portals */}
        <div className="flex flex-col gap-8 h-full">
            {/* Header Section (Moved to Left Column) */}
            <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="text-amber-600" size={24}/> LegalPH News & Resources
                </h2>
                <p className="text-sm text-slate-500 mt-1">Direct access to official portals and latest updates.</p>
            </div>

            {/* Official Portals List */}
            <div className="flex-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Official Portals</span>
               <div className="grid grid-cols-1 gap-3">
                {sources.map((source, idx) => (
                   <a 
                     key={idx}
                     href={source.url}
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/30 transition-all shadow-sm hover:shadow-md"
                   >
                      <div className={`p-2.5 rounded-lg shrink-0 ${source.color} group-hover:scale-105 transition-transform`}>
                         <source.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-amber-700 transition-colors">{source.name}</h3>
                            <ExternalLink size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                         <p className="text-xs text-slate-500 truncate group-hover:text-slate-600">{source.desc}</p>
                      </div>
                      <div className="text-slate-300 group-hover:text-amber-500 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <ArrowRight size={16} />
                      </div>
                   </a>
                ))}
               </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Latest Highlights (Fixed Height for ~5 items) */}
        <div className="flex flex-col h-[600px]">
           <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Highlights</span>
              <button 
                onClick={handleRefresh} 
                disabled={loading}
                className="text-slate-400 hover:text-amber-600 transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide"
                title="Refresh Updates"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
           </div>
           
           <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full overflow-hidden">
               <div className="flex-1 overflow-y-auto scroll-smooth pr-2">
                  {loading ? (
                     <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 py-12">
                        <RefreshCw className="animate-spin text-amber-500" size={24} />
                        <span className="text-xs font-medium">Fetching updates from SC & Gazette...</span>
                     </div>
                  ) : news ? (
                     <div className="text-sm">
                        <div dangerouslySetInnerHTML={{ __html: news }} />
                     </div>
                  ) : (
                     <div className="text-center text-slate-400 py-20 flex flex-col items-center gap-2">
                        <Globe size={32} className="opacity-20" />
                        <span className="text-xs">Click refresh to check for updates.</span>
                     </div>
                  )}
               </div>
               
               <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center shrink-0">
                 <span className="text-[10px] text-slate-400 italic">Powered by Google Search Grounding</span>
                 <span className="text-[10px] font-bold text-amber-600/80 bg-amber-50 px-2 py-0.5 rounded-full">LIVE</span>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ onChangeView }: { onChangeView: (v: AppView) => void }) => {
  // Daily Quote
  const quote = {
    latin: "Ignorantia legis neminem excusat.",
    english: "Ignorance of the law excuses no one."
  };

  const features = [
    {
      title: "Codal Library",
      desc: "Full text of PH laws updated with AI annotations and easy navigation.",
      icon: BookOpen,
      view: AppView.CODAL_LIBRARY,
      color: "bg-blue-50 text-blue-600",
      accent: "group-hover:text-blue-600",
      border: "hover:border-blue-200"
    },
    {
      title: "Jurisprudence",
      desc: "Search Supreme Court decisions, doctrines, and legal precedents.",
      icon: Scale,
      view: AppView.JURISPRUDENCE,
      color: "bg-indigo-50 text-indigo-600",
      accent: "group-hover:text-indigo-600",
      border: "hover:border-indigo-200"
    },
    {
      title: "Case Digest AI",
      desc: "Instant summaries: Facts, Issues, Ruling. Strict format adherence.",
      icon: FileEdit,
      view: AppView.CASE_DIGEST,
      color: "bg-emerald-50 text-emerald-600",
      accent: "group-hover:text-emerald-600",
      border: "hover:border-emerald-200"
    },
    {
      title: "Mock Bar Exams",
      desc: "Adaptive quizzes and essay questions tailored to your level.",
      icon: Award,
      view: AppView.MOCK_BAR,
      color: "bg-amber-50 text-amber-600",
      accent: "group-hover:text-amber-600",
      border: "hover:border-amber-200"
    },
    {
      title: "Legal Research",
      desc: "Build cases with comprehensive AI analysis and argumentation.",
      icon: Briefcase,
      view: AppView.CASE_BUILD,
      color: "bg-violet-50 text-violet-600",
      accent: "group-hover:text-violet-600",
      border: "hover:border-violet-200"
    },
    {
      title: "Contract Drafting",
      desc: "Generate validity-checked legal documents and templates.",
      icon: PenTool,
      view: AppView.CONTRACT_DRAFTING,
      color: "bg-rose-50 text-rose-600",
      accent: "group-hover:text-rose-600",
      border: "hover:border-rose-200"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Integrated Hero Section & Widgets */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg isolate">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.amber.600),theme(colors.slate.900))]"></div>
        {/* Decorative subtle element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="px-5 py-6 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Welcome Message */}
          <div className="flex-1 w-full lg:w-auto self-start lg:self-center">
            <div className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20 mb-3 backdrop-blur-sm">
              <Sparkles size={12} className="mr-1.5" />
              JD Master v2.0
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-white mb-2">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Counsel!</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-lg mb-6 leading-relaxed">
              Your AI-powered legal command center is ready. Draft documents, research jurisprudence, and review with precision.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => onChangeView(AppView.CODAL_LIBRARY)}
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-semibold text-slate-900 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20"
              >
                Start Researching <ArrowRight className="ml-2 -mr-1" size={16} />
              </button>
              <button 
                onClick={() => onChangeView(AppView.MOCK_BAR)}
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-semibold text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm ring-1 ring-white/20"
              >
                Take a Mock Exam
              </button>
            </div>
          </div>
          
          {/* Widgets Grid - Compact */}
          <div className="w-full lg:w-[400px] shrink-0 grid grid-cols-2 gap-3">
             {/* Maxim of the Day */}
             <div className="col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-4 backdrop-blur-md shadow-lg group hover:bg-white/10 transition-colors duration-500">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-amber-500/20 rounded-full blur-xl group-hover:bg-amber-500/30 transition-colors"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-amber-500/20 rounded-md">
                            <Quote size={12} className="text-amber-400" />
                        </div>
                        <span className="text-[10px] font-bold text-amber-200/80 uppercase tracking-widest">Maxim</span>
                    </div>
                    <p className="text-base font-serif font-medium text-white italic leading-snug mb-1">"{quote.latin}"</p>
                    <p className="text-slate-400 text-[10px] font-medium tracking-wide border-l-2 border-amber-500/50 pl-2">{quote.english}</p>
                </div>
             </div>

             {/* Legal Pad Widget */}
             <div 
                onClick={() => onChangeView(AppView.LEGAL_PAD)}
                className="col-span-1 relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-3 backdrop-blur-md shadow-lg cursor-pointer group hover:bg-white/15 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
             >
                 <div className="absolute -right-3 -bottom-3 text-white/5 group-hover:text-white/10 transition-colors">
                    <FileEdit size={48} />
                 </div>
                 <div className="relative z-10 flex flex-col h-full justify-between gap-3">
                    <div className="flex items-start justify-between">
                       <div className="p-1.5 bg-blue-500/20 rounded-md">
                          <FileEdit size={14} className="text-blue-300" />
                       </div>
                       <ArrowRight size={12} className="text-slate-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-white text-xs">Legal Pad</h3>
                        <p className="text-[10px] text-slate-400 leading-tight group-hover:text-slate-300">My Notes</p>
                    </div>
                 </div>
             </div>

             {/* Law Review Widget */}
             <div 
                onClick={() => onChangeView(AppView.LAW_REVIEW)}
                className="col-span-1 relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-3 backdrop-blur-md shadow-lg cursor-pointer group hover:bg-white/15 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
             >
                 <div className="absolute -right-3 -bottom-3 text-white/5 group-hover:text-white/10 transition-colors">
                    <ScrollText size={48} />
                 </div>
                 <div className="relative z-10 flex flex-col h-full justify-between gap-3">
                    <div className="flex items-start justify-between">
                       <div className="p-1.5 bg-purple-500/20 rounded-md">
                          <ScrollText size={14} className="text-purple-300" />
                       </div>
                       <ArrowRight size={12} className="text-slate-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-white text-xs">Law Review</h3>
                        <p className="text-[10px] text-slate-400 leading-tight group-hover:text-slate-300">Study Guide</p>
                    </div>
                 </div>
             </div>

          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900">Essential Tools</h2>
            <p className="text-sm text-slate-500 mt-1">Everything you need for study and practice.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              onClick={() => onChangeView(feature.view)}
              className={`group relative bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg ${feature.border} transition-all duration-300 cursor-pointer overflow-hidden`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={20} />
              </div>
              
              <h3 className={`text-lg font-serif font-bold text-slate-900 mb-2 ${feature.accent} transition-colors`}>
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4 text-xs">
                {feature.desc}
              </p>
              
              <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors mt-auto">
                Open Tool <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Legal News Component */}
      <LegalNews />

      {/* Footer & Disclaimer */}
      <footer className="mt-10 py-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-lg">
        <div className="max-w-3xl mx-auto px-6 text-center">
            
            {/* Interactive Disclaimer */}
            <div className="group relative mb-6 cursor-default">
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-all duration-500 ease-out"></div>
              <p className="relative text-[10px] text-slate-500 group-hover:text-slate-300 leading-loose transition-colors duration-300 px-4 py-2">
                <span className="font-bold text-amber-600 group-hover:text-amber-500 uppercase tracking-wider text-[9px] mr-2 transition-colors">Disclaimer</span>
                LegalPH is an educational tool designed to assist in learning Philippine law. All AI-generated content is based on authoritative sources but should not be considered as legal advice. Always verify information with official legal documents and consult with qualified legal professionals for specific legal matters.
              </p>
            </div>

            {/* Copyright */}
            <div className="flex flex-col items-center justify-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity duration-500">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>© 2025 LegalPH</span>
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  <span>All rights reserved</span>
               </div>
               <p className="text-[10px] text-slate-600 font-medium tracking-wide">
                 Built for law students, legal professionals, and lifelong learners
               </p>
            </div>
        </div>
      </footer>
    </div>
  );
};

const CaseBuild = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBuild = async () => {
    if(!query) return;
    setLoading(true);
    setResult('');
    try {
      const res = await analyzeLegalResearch(query);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
       <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
          <Briefcase className="text-amber-600" size={32}/> Case Build & Research
        </h2>
        <p className="text-slate-600 mt-2 text-lg">Construct arguments and find jurisprudence with precision.</p>
      </div>
      <div className="flex gap-4 mb-8">
        <input 
          className="flex-1 border border-slate-300 p-5 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none shadow-sm text-lg font-serif" 
          placeholder="Enter legal scenario (e.g., 'A mayor was arrested without warrant at a checkpoint...')..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button 
          onClick={handleBuild} 
          disabled={loading || !query}
          className="bg-slate-900 text-white px-8 rounded-xl font-bold text-lg hover:bg-slate-800 disabled:opacity-50 shadow-md"
        >
          {loading ? 'Researching...' : 'Build Case'}
        </button>
      </div>
      <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
        {result ? (
            <div className="flex-1 overflow-y-auto p-12">
                <div className="max-w-4xl mx-auto prose prose-slate prose-lg max-w-none 
                    prose-h3:font-serif prose-h3:font-bold prose-h3:text-2xl prose-h3:text-center prose-h3:text-slate-900 prose-h3:mb-8
                    prose-h4:font-serif prose-h4:font-bold prose-h4:text-lg prose-h4:text-slate-800 prose-h4:mt-8
                    prose-h4:border-b prose-h4:border-slate-200 prose-h4:pb-2
                    prose-p:text-slate-700 prose-p:leading-loose prose-p:text-justify prose-p:font-serif
                    prose-li:text-slate-700 prose-li:font-serif">
                    <div dangerouslySetInnerHTML={{ __html: result }} />
                </div>
            </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Briefcase size={48} className="opacity-20" />
             </div>
             <p className="text-xl font-serif text-slate-500">Enter a scenario to generate a comprehensive legal case build.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderView = () => {
    switch(view) {
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
      <Sidebar 
        currentView={view} 
        onChangeView={setView} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white"><Gavel size={18}/></div>
             <span className="font-serif font-bold text-lg">LegalPH</span>
           </div>
           <button onClick={() => setIsMobileOpen(true)} className="text-slate-600 p-2">
             <Menu />
           </button>
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-12">
          {renderView()}
        </main>
      </div>
    </div>
  );
}