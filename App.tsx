import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodalLibrary } from './components/CodalLibrary';
import { CaseDigest } from './components/CaseDigest';
import { MockBar } from './components/MockBar';
import { LegalPad } from './components/LegalPad';
import { LawReview } from './components/LawReview';
import { Jurisprudence } from './components/Jurisprudence';
import { ContractDrafting } from './components/ContractDrafting';
import { AppView } from './types';
import { analyzeLegalResearch } from './services/gemini';
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
  Quote
} from 'lucide-react';

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
      {/* Integrated Hero Section & Maxim */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg isolate">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.amber.600),theme(colors.slate.900))]"></div>
        {/* Decorative subtle element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="px-6 py-8 md:px-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Welcome Message */}
          <div className="flex-1">
            <div className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20 mb-3 backdrop-blur-sm">
              <Sparkles size={12} className="mr-1.5" />
              JD Master v2.0
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white mb-2">
              Welcome to the team, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Counsel!</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-lg mb-6 leading-relaxed">
              Your AI-powered legal command center is ready. Draft, research, and review in seconds.
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
          
          {/* Embedded Maxim of the Day */}
          <div className="w-full lg:w-auto lg:max-w-md shrink-0">
             <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-5 backdrop-blur-md shadow-2xl group hover:bg-white/10 transition-colors duration-500">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-amber-500/20 rounded-full blur-xl group-hover:bg-amber-500/30 transition-colors"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-amber-500/20 rounded-md">
                            <Quote size={14} className="text-amber-400" />
                        </div>
                        <span className="text-[10px] font-bold text-amber-200/80 uppercase tracking-widest">Maxim of the Day</span>
                    </div>
                    <p className="text-lg font-serif font-medium text-white italic leading-snug mb-2">"{quote.latin}"</p>
                    <p className="text-slate-400 text-xs font-medium tracking-wide border-l-2 border-amber-500/50 pl-3">{quote.english}</p>
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

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center relative overflow-hidden group hover:border-slate-300 transition-colors cursor-pointer" onClick={() => onChangeView(AppView.LEGAL_PAD)}>
          <div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileEdit size={100} />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-lg mb-2 relative z-10">Legal Pad</h3>
          <p className="text-slate-500 mb-4 text-xs relative z-10 max-w-sm">Organize your notes, case briefs, and research in one secure workspace designed for lawyers.</p>
          <span className="w-fit text-xs font-bold text-slate-700 hover:text-amber-600 flex items-center gap-2 relative z-10">
            Go to Workspace <ArrowRight size={12}/>
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center relative overflow-hidden group hover:border-slate-300 transition-colors cursor-pointer" onClick={() => onChangeView(AppView.LAW_REVIEW)}>
          <div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ScrollText size={100} />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-lg mb-2 relative z-10">Law Review</h3>
          <p className="text-slate-500 mb-4 text-xs relative z-10 max-w-sm">Generate comprehensive syllabi and study guides tailored to your learning level.</p>
          <span className="w-fit text-xs font-bold text-slate-700 hover:text-amber-600 flex items-center gap-2 relative z-10">
            Create Study Guide <ArrowRight size={12}/>
          </span>
        </div>
      </div>

      {/* Footer & Disclaimer */}
      <footer className="mt-10 pt-6 pb-8 border-t border-slate-100 bg-gradient-to-b from-transparent to-slate-50/80">
        <div className="max-w-3xl mx-auto px-6 text-center">
            
            {/* Interactive Disclaimer */}
            <div className="group relative mb-6 cursor-default">
              <div className="absolute inset-0 bg-amber-100/0 group-hover:bg-amber-50/50 rounded-xl transition-all duration-500 ease-out"></div>
              <p className="relative text-[10px] text-slate-400 group-hover:text-slate-600 leading-loose transition-colors duration-300 px-4 py-2">
                <span className="font-bold text-amber-600/60 group-hover:text-amber-600 uppercase tracking-wider text-[9px] mr-2 transition-colors">Disclaimer</span>
                LegalPH is an educational tool designed to assist in learning Philippine law. All AI-generated content is based on authoritative sources but should not be considered as legal advice. Always verify information with official legal documents and consult with qualified legal professionals for specific legal matters.
              </p>
            </div>

            {/* Copyright */}
            <div className="flex flex-col items-center justify-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity duration-500">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  <span>© 2025 LegalPH</span>
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  <span>All rights reserved</span>
               </div>
               <p className="text-[10px] text-slate-400 font-medium tracking-wide">
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