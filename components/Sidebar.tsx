
import React from 'react';
import { AppView } from '../types';
import { 
  BookOpen, 
  Scale, 
  FileText, 
  Award, 
  Briefcase, 
  PenTool, 
  Layout, 
  FileEdit,
  ScrollText,
  GraduationCap,
  Library
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

const NavItem = ({ view, icon: Icon, label, active, onClick, isSubItem = false }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg mb-1
      ${active 
        ? 'bg-amber-600/10 text-amber-600 border-r-2 border-amber-600' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }
      ${isSubItem ? 'pl-8' : ''}
    `}
  >
    <Icon size={isSubItem ? 16 : 18} />
    <span>{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isMobileOpen, setIsMobileOpen }) => {
  const handleNav = (view: AppView) => {
    onChangeView(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen flex flex-col
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
            <Scale className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-serif font-bold text-slate-900 text-lg leading-tight">LegalPH</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wider">JD MASTER</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="mb-4">
            <NavItem view={AppView.DASHBOARD} icon={Layout} label="Dashboard" active={currentView === AppView.DASHBOARD} onClick={() => handleNav(AppView.DASHBOARD)} />
          </div>

          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Academic</p>
            <NavItem isSubItem view={AppView.CODAL_LIBRARY} icon={BookOpen} label="Codal Library" active={currentView === AppView.CODAL_LIBRARY} onClick={() => handleNav(AppView.CODAL_LIBRARY)} />
            <NavItem isSubItem view={AppView.LEGAL_DOCTRINES} icon={Library} label="Legal Doctrines" active={currentView === AppView.LEGAL_DOCTRINES} onClick={() => handleNav(AppView.LEGAL_DOCTRINES)} />
            <NavItem isSubItem view={AppView.CASE_DIGEST} icon={FileText} label="Case Digest" active={currentView === AppView.CASE_DIGEST} onClick={() => handleNav(AppView.CASE_DIGEST)} />
            <NavItem isSubItem view={AppView.CASE_BUILD} icon={Briefcase} label="Case Build" active={currentView === AppView.CASE_BUILD} onClick={() => handleNav(AppView.CASE_BUILD)} />
          </div>

          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Training</p>
            <NavItem isSubItem view={AppView.JD_PROGRAM} icon={GraduationCap} label="JD Program" active={currentView === AppView.JD_PROGRAM} onClick={() => handleNav(AppView.JD_PROGRAM)} />
            <NavItem isSubItem view={AppView.LAW_REVIEW} icon={ScrollText} label="Law Review" active={currentView === AppView.LAW_REVIEW} onClick={() => handleNav(AppView.LAW_REVIEW)} />
            <NavItem isSubItem view={AppView.MOCK_BAR} icon={Award} label="Mock Bar" active={currentView === AppView.MOCK_BAR} onClick={() => handleNav(AppView.MOCK_BAR)} />
            <NavItem isSubItem view={AppView.CONTRACT_DRAFTING} icon={PenTool} label="Drafting" active={currentView === AppView.CONTRACT_DRAFTING} onClick={() => handleNav(AppView.CONTRACT_DRAFTING)} />
          </div>

          <div>
            <NavItem view={AppView.LEGAL_PAD} icon={FileEdit} label="Legal Pad" active={currentView === AppView.LEGAL_PAD} onClick={() => handleNav(AppView.LEGAL_PAD)} />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
             <p className="text-xs text-slate-500 text-center">
               Powered by <span className="font-bold text-slate-700">Gemini 3.0</span>
             </p>
           </div>
        </div>
      </div>
    </>
  );
};
