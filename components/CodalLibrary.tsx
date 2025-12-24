
import React, { useState, useMemo } from 'react';
import { PHILIPPINE_CODALS, CODAL_CATEGORIES } from '../constants';
import { generateGeneralLegalAdvice } from '../services/gemini';
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Loader2, 
  BookOpen, 
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen, 
  X,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignJustify,
  Filter,
  ArrowLeft,
  Library,
  BookMarked
} from 'lucide-react';
import { CodalNavigation, LawCode } from '../types';

interface NavItemProps {
  item: CodalNavigation;
  depth?: number;
  expandedNodes: Record<string, boolean>;
  activeSectionQuery: string | null;
  onItemClick: (nav: CodalNavigation) => void;
  searchTerm: string;
}

const NavItem: React.FC<NavItemProps> = ({ item, depth = 0, expandedNodes, activeSectionQuery, onItemClick, searchTerm }) => {
  const isExpanded = expandedNodes[item.title] || (searchTerm && (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))));
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeSectionQuery === item.query;

  return (
    <div className="select-none">
      <button
        onClick={() => onItemClick(item)}
        className={`w-full text-left p-3 flex items-start gap-2 hover:bg-slate-50 transition-colors
          ${isActive ? 'bg-amber-50 text-amber-900 border-r-2 border-amber-500' : 'text-slate-700'}
        `}
        style={{ paddingLeft: `${depth * 1.25 + 0.75}rem` }}
      >
        {hasChildren ? (
           <div className="mt-1">{isExpanded ? <ChevronDown size={14} className="text-slate-400"/> : <ChevronRight size={14} className="text-slate-400"/>}</div>
        ) : (
           <div className="mt-1"><div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-500' : 'bg-slate-300'}`}></div></div>
        )}
        
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-serif truncate ${hasChildren ? 'font-bold' : 'font-medium'}`}>{item.title}</div>
          {item.subtitle && <div className="text-[10px] text-slate-500 font-sans mt-0.5 truncate leading-tight">{item.subtitle}</div>}
        </div>
      </button>
      
      {hasChildren && isExpanded && (
        <div className="border-l border-slate-100 ml-4">
          {item.children!.map((child, idx) => (
            <NavItem 
              key={idx} 
              item={child} 
              depth={depth + 1} 
              expandedNodes={expandedNodes}
              activeSectionQuery={activeSectionQuery}
              onItemClick={onItemClick}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type Theme = 'light' | 'sepia' | 'dark' | 'night';
type LegalFont = 'font-serif' | 'font-crimson' | 'font-sans' | 'font-mono';

const THEMES: Record<Theme, { bg: string, text: string, ui: string, border: string, prose: string, pageBg: string }> = {
  light: { bg: 'bg-slate-200', text: 'text-slate-900', ui: 'bg-white border-slate-200', border: 'border-slate-200', prose: 'prose-slate', pageBg: 'bg-white' },
  sepia: { bg: 'bg-[#eaddcf]', text: 'text-[#463525]', ui: 'bg-[#f4ecd8] border-[#d3c4b1]', border: 'border-[#d3c4b1]', prose: 'prose-amber', pageBg: 'bg-[#fbf7f0]' },
  dark: { bg: 'bg-[#0f172a]', text: 'text-slate-300', ui: 'bg-[#1e293b] border-slate-700', border: 'border-slate-700', prose: 'prose-invert', pageBg: 'bg-[#1e293b]' },
  night: { bg: 'bg-black', text: 'text-gray-400', ui: 'bg-gray-900 border-gray-800', border: 'border-gray-800', prose: 'prose-invert', pageBg: 'bg-[#0a0a0a]' }
};

const FONT_OPTIONS: { label: string, value: LegalFont, desc: string }[] = [
  { label: 'Merriweather', value: 'font-serif', desc: 'Standard Legal' },
  { label: 'Crimson Pro', value: 'font-crimson', desc: 'Book / Classic' },
  { label: 'Inter', value: 'font-sans', desc: 'Modern Clean' },
  { label: 'JetBrains Mono', value: 'font-mono', desc: 'Technical' },
];

export const CodalLibrary: React.FC = () => {
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);
  const [activeSectionQuery, setActiveSectionQuery] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    return { [CODAL_CATEGORIES[0]]: true };
  });
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});
  const [mainSearchQuery, setMainSearchQuery] = useState('');
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAppearance, setShowAppearance] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100); 
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');

  const selectedCode = PHILIPPINE_CODALS.find(c => c.id === selectedCodeId);
  const currentTheme = THEMES[theme];
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100));

  const filteredCodalsBySearch = useMemo(() => {
    if (!sidebarSearchTerm) return PHILIPPINE_CODALS;
    const term = sidebarSearchTerm.toLowerCase();
    return PHILIPPINE_CODALS.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.description.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term) ||
      (c.subcategory && c.subcategory.toLowerCase().includes(term))
    );
  }, [sidebarSearchTerm]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategories(prev => ({ ...prev, [subcategory]: !prev[subcategory] }));
  };

  const handleCodeSelect = (codeId: string) => {
    setSelectedCodeId(codeId);
    setAiResponse(null);
    setActiveSectionQuery(null);
    setMainSearchQuery('');
    setExpandedNodes({}); // Reset tree state
    
    const code = PHILIPPINE_CODALS.find(c => c.id === codeId);
    if (code && !code.structure) {
        loadGenericOverview(code);
    }
  };

  const loadGenericOverview = async (code: LawCode) => {
      setIsLoading(true);
      try {
        const prompt = `Present a professional, textbook-style Table of Contents and Structural Overview for: ${code.name} (${code.description}). Output HTML only.`;
        const result = await generateGeneralLegalAdvice(prompt);
        setAiResponse(result);
      } catch (e) {
        setAiResponse("<p>Error loading overview.</p>");
      } finally {
          setIsLoading(false);
      }
  }

  const handleSectionClick = async (nav: CodalNavigation) => {
    if (nav.children && nav.children.length > 0) {
      setExpandedNodes(prev => ({...prev, [nav.title]: !prev[nav.title]}));
    }
    
    setActiveSectionQuery(nav.query);
    setIsLoading(true);
    setAiResponse(null);
    try {
      const result = await generateGeneralLegalAdvice(`Detailed commentary and verbatim text of provision: "${nav.query}" in context of ${selectedCode?.name}. Ensure professional typesetting.`);
      setAiResponse(result);
    } catch (err) {
      setAiResponse("<p>Failed to retrieve provision text.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMainSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainSearchQuery.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateGeneralLegalAdvice(`Search "${mainSearchQuery}" in ${selectedCode?.name || 'PH Laws'}. Provide commentary and verbatim law.`);
      setAiResponse(result);
    } catch (err) {
      setAiResponse("<p>Error searching codals.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <style>{`
        .book-content { text-align: ${textAlign}; line-height: 1.7; hyphens: auto; }
        .book-content h1, .book-content h2, .book-content h3 { text-align: center; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2.5rem; margin-bottom: 1.5rem; line-height: 1.2; padding-bottom: 1rem; border-bottom: 3px double currentColor; text-indent: 0; }
        .book-content h3 { font-size: 1.25em; border-bottom-width: 1px; border-style: solid; }
        .book-content h4 { font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.1em; text-transform: uppercase; text-indent: 0; page-break-after: avoid; }
        .book-content .statute-box { border: 1px solid currentColor; background-color: rgba(0,0,0,0.03); padding: 1.5rem; margin: 2rem 0; border-radius: 2px; text-indent: 0; font-family: 'Merriweather', serif; position: relative; }
        .book-content p { margin-top: 0; margin-bottom: 0.75rem; text-indent: 2.5em; }
        .book-content h1 + p, .book-content h3 + p, .book-content h4 + p, .book-content div + p, .book-content blockquote + p { text-indent: 0; }
        .book-content blockquote { margin: 2rem 2.5rem; padding: 1rem 1.5rem; border-left: 3px solid #b45309; background-color: rgba(0,0,0,0.03); font-style: italic; text-indent: 0; }
      `}</style>

      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
           <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="text-amber-600" /> Codal Library
          </h2>
          <p className="text-slate-500 text-sm">Comprehensive Repository of Philippine Laws & Treaties</p>
        </div>
        <form onSubmit={handleMainSearch} className="relative w-full md:w-96">
            <input type="text" value={mainSearchQuery} onChange={(e) => setMainSearchQuery(e.target.value)} placeholder={selectedCode ? `Search within ${selectedCode.name}...` : "Search all laws..."} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-serif shadow-inner bg-white" />
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
        </form>
      </div>

      <div className="flex-1 flex flex-row gap-0 min-h-0 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm relative">
        <div className={`border-r border-slate-200 bg-slate-50 flex flex-col h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-full lg:w-80' : 'w-0 overflow-hidden opacity-0 lg:w-0'}`}>
          <div className="p-4 bg-white border-b border-slate-200">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter library..." 
                  value={sidebarSearchTerm} 
                  onChange={(e) => setSidebarSearchTerm(e.target.value)} 
                  className="w-full pl-8 pr-3 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-amber-200 border rounded-lg text-xs outline-none transition-all" 
                />
                <Filter className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                {sidebarSearchTerm && <button onClick={() => setSidebarSearchTerm('')} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"><X size={14}/></button>}
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            {selectedCode ? (
              <div className="flex flex-col h-full">
                <button onClick={() => setSelectedCodeId(null)} className="flex items-center gap-2 p-3.5 text-xs font-bold text-amber-600 hover:bg-white transition-colors border-b border-slate-200 group">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
                </button>
                <div className="p-4 bg-white border-b border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Current Codex</div>
                  <h3 className="text-sm font-serif font-bold text-slate-900 leading-tight flex items-center gap-2">
                    <BookMarked size={16} className="text-amber-500 shrink-0" />
                    {selectedCode.name}
                  </h3>
                </div>
                <div className="py-2">
                  {selectedCode.structure?.map((item, idx) => (
                    <NavItem key={idx} item={item} expandedNodes={expandedNodes} activeSectionQuery={activeSectionQuery} onItemClick={handleSectionClick} searchTerm={sidebarSearchTerm} />
                  ))}
                </div>
              </div>
            ) : (
              CODAL_CATEGORIES.map((category, idx) => {
                const categoryCodals = filteredCodalsBySearch.filter(c => c.category === category);
                if (categoryCodals.length === 0 && sidebarSearchTerm) return null;
                
                const subcats: string[] = Array.from(new Set(categoryCodals.map(c => c.subcategory || null).filter(Boolean) as string[]));

                return (
                  <div key={idx} className="mb-1">
                    <button onClick={() => toggleCategory(category)} className={`w-full flex items-center justify-between p-3.5 hover:bg-white transition-colors text-left group ${expandedCategories[category] ? 'bg-white' : ''}`}>
                      <span className="font-serif font-bold text-slate-800 text-sm group-hover:text-amber-800 tracking-tight">{category}</span>
                      {expandedCategories[category] ? <ChevronDown size={14} className="text-amber-600"/> : <ChevronRight size={14} className="text-slate-300"/>}
                    </button>
                    {expandedCategories[category] && (
                      <div className="bg-white/50 border-b border-slate-100">
                        {subcats.length > 0 ? (
                          [...subcats, 'General'].map(sub => {
                            const codalsInSub = categoryCodals.filter(c => (c.subcategory || 'General') === sub);
                            if (codalsInSub.length === 0) return null;

                            return (
                              <div key={sub} className="mb-0.5">
                                <button 
                                  onClick={() => toggleSubcategory(sub)}
                                  className="w-full flex items-center justify-between p-3 pl-6 text-xs font-bold text-slate-600 hover:text-amber-700 transition-colors bg-slate-100/30"
                                >
                                  <span>{sub}</span>
                                  {expandedSubcategories[sub] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                </button>
                                {expandedSubcategories[sub] && (
                                  <div className="bg-white">
                                    {codalsInSub.map(code => (
                                      <button key={code.id} onClick={() => handleCodeSelect(code.id)} className={`w-full text-left py-2.5 px-4 pl-10 text-xs border-l-2 transition-all hover:bg-amber-50 group ${selectedCodeId === code.id ? 'border-amber-500 bg-amber-50 font-bold text-amber-900' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
                                        <div className="flex items-center gap-2">
                                          <div className={`w-1 h-1 rounded-full ${selectedCodeId === code.id ? 'bg-amber-500' : 'bg-slate-300 group-hover:bg-amber-300'}`}></div>
                                          <span className="truncate">{code.name}</span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          categoryCodals.map((code) => (
                            <button key={code.id} onClick={() => handleCodeSelect(code.id)} className={`w-full text-left py-2.5 px-4 pl-8 text-xs border-l-2 transition-all hover:bg-amber-50 group ${selectedCodeId === code.id ? 'border-amber-500 bg-amber-50 font-bold text-amber-900' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
                              <div className="flex items-center gap-2">
                                <div className={`w-1 h-1 rounded-full ${selectedCodeId === code.id ? 'bg-amber-500' : 'bg-slate-300 group-hover:bg-amber-300'}`}></div>
                                <span className="truncate">{code.name}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col h-full transition-colors duration-300 relative ${currentTheme.bg}`}>
           <div className={`px-6 py-3 border-b flex justify-between items-center z-20 ${currentTheme.ui}`}>
              <div className="flex items-center gap-2">
                 <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Toggle Explorer">
                   {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                 </button>
                 {!isSidebarOpen && selectedCode && <span className={`text-sm font-bold font-serif ml-2 ${currentTheme.text} truncate max-w-[200px]`}>{selectedCode.name}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAppearance(!showAppearance)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors ${currentTheme.text}`}>
                  <Settings size={18} /> <span className="hidden sm:inline">Settings</span>
                </button>
                {showAppearance && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-5 z-50 text-slate-900 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-5"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appearance</span><button onClick={() => setShowAppearance(false)}><X size={16}/></button></div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-2">{FONT_OPTIONS.map(font => (<button key={font.value} onClick={() => setFontFamily(font.value)} className={`p-3 text-left border rounded-lg transition-all ${fontFamily === font.value ? 'bg-amber-50 border-amber-500' : 'bg-white border-slate-200'}`}><span className={`block text-sm font-medium ${font.value}`}>{font.label}</span></button>))}</div>
                      <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-600">Align</span><div className="flex gap-1 bg-slate-100 p-1 rounded-md"><button onClick={() => setTextAlign('left')} className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow' : ''}`}><AlignLeft size={16}/></button><button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded ${textAlign === 'justify' ? 'bg-white shadow' : ''}`}><AlignJustify size={16}/></button></div></div>
                      <div className="flex items-center gap-3"><button onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))} className="p-2 flex-1 flex justify-center border rounded-lg"><ZoomOut size={16}/></button><button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-2 flex-1 flex justify-center border rounded-lg"><ZoomIn size={16}/></button></div>
                      <div className="grid grid-cols-4 gap-2">{Object.keys(THEMES).map((t) => (<button key={t} onClick={() => setTheme(t as Theme)} className={`h-10 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200'}`} />))}</div>
                    </div>
                  </div>
                )}
              </div>
           </div>

           <div className={`flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth ${currentTheme.bg}`}>
              {isLoading && (<div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 z-10 backdrop-blur-sm"><Loader2 className="animate-spin text-amber-600 mb-4" size={40} /><p className="font-serif text-slate-800 font-bold text-lg">Retrieving Statutes...</p></div>)}
              {aiResponse ? (
                 <div className={`max-w-[8.5in] mx-auto min-h-[11in] ${currentTheme.pageBg} ${fontFamily} ${currentTheme.text} shadow-xl py-16 px-12 md:px-16 mb-20 rounded-sm book-content transition-all`} style={{ fontSize: `${effectiveFontSize}px` }} dangerouslySetInnerHTML={{ __html: aiResponse }} />
              ) : selectedCode ? (
                  <div className={`max-w-5xl mx-auto shadow-sm border p-10 lg:p-16 min-h-full ${currentTheme.ui} rounded-lg`}>
                    <div className="text-center border-b-2 pb-8 mb-12 border-current">
                        <div className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] mb-4">Philippine Statutes & Treaties</div>
                        <h1 className={`font-bold text-3xl md:text-5xl mb-6 tracking-tight leading-tight ${fontFamily} ${currentTheme.text}`}>{selectedCode.name}</h1>
                        <p className={`text-lg md:text-xl italic font-medium opacity-80 ${fontFamily} ${currentTheme.text}`}>{selectedCode.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {selectedCode.structure?.map((item, idx) => (
                            <div key={idx} className="mb-4">
                                <button onClick={() => handleSectionClick(item)} className="text-left w-full group">
                                    <h4 className={`font-bold text-base border-b pb-1 mb-2 ${fontFamily} ${currentTheme.text} group-hover:text-amber-600 transition-colors`}>{item.title}</h4>
                                    {item.subtitle && <p className="text-xs italic opacity-70 mb-2">{item.subtitle}</p>}
                                </button>
                            </div>
                        ))}
                    </div>
                  </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                   <Library size={64} className="mb-4" />
                   <p className="text-xl font-serif">Select a law from the explorer to begin reading.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
