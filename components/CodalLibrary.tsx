
import React, { useState, useMemo, useRef } from 'react';
import { PHILIPPINE_CODALS, CODAL_CATEGORIES } from '../constants';
import { generateGeneralLegalAdvice } from '../services/gemini';
// FIX: Added Scale to the lucide-react imports to resolve missing name errors.
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
  BookMarked,
  Printer,
  Highlighter,
  Edit3,
  Download,
  Copy,
  Layout,
  ExternalLink,
  Scale
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
        className={`w-full text-left py-2 px-3 flex items-start gap-2 hover:bg-slate-100 transition-colors
          ${isActive ? 'bg-blue-50 text-blue-900 border-r-2 border-blue-600' : 'text-slate-600'}
        `}
        style={{ paddingLeft: `${depth * 1 + 0.75}rem` }}
      >
        {hasChildren ? (
           <div className="mt-1">{isExpanded ? <ChevronDown size={12} className="text-slate-400"/> : <ChevronRight size={12} className="text-slate-400"/>}</div>
        ) : (
           <div className="mt-1.5"><div className={`w-1 h-1 rounded-full ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`}></div></div>
        )}
        
        <div className="min-w-0 flex-1">
          <div className={`text-[13px] font-sans truncate tracking-tight ${hasChildren ? 'font-bold text-slate-800' : 'font-medium'}`}>{item.title}</div>
          {item.subtitle && <div className="text-[10px] text-slate-500 font-sans mt-0.5 truncate leading-tight opacity-80">{item.subtitle}</div>}
        </div>
      </button>
      
      {hasChildren && isExpanded && (
        <div className="border-l border-slate-200 ml-3.5">
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

const THEMES: Record<Theme, { bg: string, text: string, ui: string, border: string, prose: string, pageBg: string, accent: string }> = {
  light: { bg: 'bg-slate-100', text: 'text-slate-900', ui: 'bg-white border-slate-200', border: 'border-slate-200', prose: 'prose-slate', pageBg: 'bg-white', accent: 'text-blue-600' },
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
  const [isEditing, setIsEditing] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAppearance, setShowAppearance] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100); 
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');
  const contentRef = useRef<HTMLDivElement>(null);

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
    setExpandedNodes({}); 
    
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
      const result = await generateGeneralLegalAdvice(`Detailed commentary and verbatim text of provision: "${nav.query}" in context of ${selectedCode?.name}. Use highly professional legal typesetting with annotations.`);
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

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = "bg-yellow-200 text-black px-1 rounded";
    try { range.surroundContents(span); selection.removeAllRanges(); } catch(e) { console.warn("Complex highlight failed."); }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .book-content { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: none !important; box-shadow: none !important; }
        }
        .book-content { text-align: ${textAlign}; line-height: 1.7; hyphens: auto; }
        .book-content h1, .book-content h2, .book-content h3 { text-align: center; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2.5rem; margin-bottom: 1.5rem; line-height: 1.2; padding-bottom: 1rem; border-bottom: 3px double currentColor; text-indent: 0; }
        .book-content h3 { font-size: 1.25em; border-bottom-width: 1px; border-style: solid; }
        .book-content h4 { font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.1em; text-transform: uppercase; text-indent: 0; page-break-after: avoid; }
        .book-content .statute-box { border: 1px solid currentColor; background-color: rgba(0,0,0,0.03); padding: 1.5rem; margin: 2rem 0; border-radius: 2px; text-indent: 0; font-family: 'Merriweather', serif; position: relative; }
        .book-content p { margin-top: 0; margin-bottom: 0.75rem; text-indent: 2.5em; }
        .book-content h1 + p, .book-content h3 + p, .book-content h4 + p, .book-content div + p, .book-content blockquote + p { text-indent: 0; }
        .book-content blockquote { margin: 2rem 2.5rem; padding: 1rem 1.5rem; border-left: 3px solid #b45309; background-color: rgba(0,0,0,0.03); font-style: italic; text-indent: 0; }
        .book-content .annotation { color: #64748b; font-size: 0.9em; font-style: italic; border-top: 1px dashed #e2e8f0; padding-top: 0.5rem; margin-top: 1rem; text-indent: 0; }
      `}</style>

      {/* Main App Header */}
      <div className="h-14 border-b bg-white flex items-center justify-between px-6 z-30 shrink-0 no-print">
        <div className="flex items-center gap-3">
           <Library className="text-blue-700" size={20} />
           <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                LegalPH Codal Explorer
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-black uppercase">v3</span>
              </h2>
           </div>
        </div>

        <form onSubmit={handleMainSearch} className="flex-1 max-w-lg mx-12 relative group">
            <input 
              type="text" 
              value={mainSearchQuery} 
              onChange={(e) => setMainSearchQuery(e.target.value)} 
              placeholder={selectedCode ? `Search within ${selectedCode.name}...` : "Quick search codals..."} 
              className="w-full pl-10 pr-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-sm outline-none transition-all shadow-inner" 
            />
            <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500" size={14} />
        </form>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1">
             <button onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"><ZoomOut size={16}/></button>
             <span className="text-[10px] font-bold text-slate-400 w-8 text-center">{zoomLevel}%</span>
             <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"><ZoomIn size={16}/></button>
           </div>
           <div className="w-px h-4 bg-slate-200"></div>
           <button onClick={() => setShowAppearance(!showAppearance)} className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-600">
              <Settings size={18} />
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-row gap-0 min-h-0 relative overflow-hidden">
        
        {/* Westlaw Style Explorer Sidebar */}
        <div className={`border-r border-slate-200 bg-white flex flex-col h-full transition-all duration-300 ease-in-out no-print ${isSidebarOpen ? 'w-full md:w-80' : 'w-0 overflow-hidden opacity-0'}`}>
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Navigation Tree</span>
             {selectedCode && <button onClick={() => setSelectedCodeId(null)} className="text-[10px] font-bold text-blue-600 hover:underline">Full Library</button>}
          </div>
          
          <div className="p-3 bg-slate-50/50">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter contents..." 
                  value={sidebarSearchTerm} 
                  onChange={(e) => setSidebarSearchTerm(e.target.value)} 
                  className="w-full pl-8 pr-3 py-1.5 bg-white border-slate-200 border rounded text-xs outline-none focus:border-blue-400 transition-all shadow-sm" 
                />
                <Filter className="absolute left-2.5 top-2 text-slate-400" size={12} />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {selectedCode ? (
              <div className="flex flex-col h-full">
                <div className="p-3 bg-blue-50/30 border-b border-blue-100">
                  <h3 className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-2">
                    <BookMarked size={14} className="text-blue-600 shrink-0" />
                    {selectedCode.name}
                  </h3>
                </div>
                <div className="py-1">
                  {selectedCode.structure?.map((item, idx) => (
                    <NavItem key={idx} item={item} expandedNodes={expandedNodes} activeSectionQuery={activeSectionQuery} onItemClick={handleSectionClick} searchTerm={sidebarSearchTerm} />
                  ))}
                  {!selectedCode.structure && (
                    <div className="p-6 text-center">
                       <p className="text-xs text-slate-400 italic">No structure available for this entry.</p>
                       <button onClick={() => handleCodeSelect(selectedCode.id)} className="mt-2 text-[10px] font-bold text-blue-600 uppercase hover:underline">Re-generate Overview</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              CODAL_CATEGORIES.map((category, idx) => {
                const categoryCodals = filteredCodalsBySearch.filter(c => c.category === category);
                if (categoryCodals.length === 0 && sidebarSearchTerm) return null;
                const subcats: string[] = Array.from(new Set(categoryCodals.map(c => c.subcategory || null).filter(Boolean) as string[]));

                return (
                  <div key={idx} className="border-b border-slate-50 last:border-0">
                    <button onClick={() => toggleCategory(category)} className={`w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-left group ${expandedCategories[category] ? 'bg-slate-50' : ''}`}>
                      <span className="font-sans font-bold text-slate-700 text-xs tracking-tight group-hover:text-blue-700 uppercase tracking-wider">{category}</span>
                      {expandedCategories[category] ? <ChevronDown size={12} className="text-blue-600"/> : <ChevronRight size={12} className="text-slate-300"/>}
                    </button>
                    {expandedCategories[category] && (
                      <div className="bg-white">
                        {subcats.length > 0 ? (
                          [...subcats, 'General'].map(sub => {
                            const codalsInSub = categoryCodals.filter(c => (c.subcategory || 'General') === sub);
                            if (codalsInSub.length === 0) return null;
                            return (
                              <div key={sub} className="mb-px">
                                <button onClick={() => toggleSubcategory(sub)} className="w-full flex items-center justify-between p-2.5 pl-6 text-[11px] font-bold text-slate-500 hover:text-blue-700 transition-colors bg-slate-50/50">
                                  <span>{sub}</span>
                                  {expandedSubcategories[sub] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                </button>
                                {expandedSubcategories[sub] && (
                                  <div className="bg-white">
                                    {codalsInSub.map(code => (
                                      <button key={code.id} onClick={() => handleCodeSelect(code.id)} className={`w-full text-left py-2 px-4 pl-10 text-[11px] border-l-2 transition-all hover:bg-blue-50/30 group ${selectedCodeId === code.id ? 'border-blue-500 bg-blue-50/50 font-bold text-blue-900' : 'border-transparent text-slate-500'}`}>
                                        {code.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          categoryCodals.map((code) => (
                            <button key={code.id} onClick={() => handleCodeSelect(code.id)} className={`w-full text-left py-2 px-4 pl-8 text-[11px] border-l-2 transition-all hover:bg-blue-50/30 group ${selectedCodeId === code.id ? 'border-blue-500 bg-blue-50/50 font-bold text-blue-900' : 'border-transparent text-slate-500'}`}>
                              {code.name}
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

        {/* Professional Reading Room */}
        <div className={`flex-1 flex flex-col h-full transition-colors duration-300 relative ${currentTheme.bg}`}>
           
           {/* Secondary Functional Toolbar (Lexis Style) */}
           <div className={`px-6 h-12 border-b flex justify-between items-center z-20 no-print ${currentTheme.ui}`}>
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-1.5 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Toggle Explorer">
                   {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                 </button>
                 <div className="w-px h-4 bg-slate-200"></div>
                 {selectedCode && (
                    <div className="flex items-center gap-2">
                       <span className={`text-xs font-bold uppercase tracking-widest ${currentTheme.text}`}>{selectedCode.name}</span>
                       <ChevronRight size={12} className="text-slate-400" />
                       <span className={`text-xs font-serif italic truncate max-w-[200px] ${currentTheme.text} opacity-60`}>{activeSectionQuery || 'Overview'}</span>
                    </div>
                 )}
              </div>

              <div className="flex items-center gap-1">
                {aiResponse && (
                  <>
                    <button onClick={handleHighlight} className={`p-2 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Highlight Selection"><Highlighter size={16}/></button>
                    <button onClick={() => setIsEditing(!isEditing)} className={`p-2 rounded hover:bg-black/5 transition-colors ${isEditing ? 'bg-blue-100 text-blue-600' : currentTheme.text}`} title="Edit Content"><Edit3 size={16}/></button>
                    <div className="w-px h-4 bg-slate-200 mx-2"></div>
                  </>
                )}
                <button onClick={handlePrint} className={`p-2 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Print Statute"><Printer size={16}/></button>
                <button className={`p-2 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`} title="Download PDF/HTML"><Download size={16}/></button>
              </div>
           </div>

           {/* Reading Surface */}
           <div className={`flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth scrollbar-hide`} ref={contentRef}>
              
              {/* Appearance Settings Popover */}
              {showAppearance && (
                <div className="absolute right-6 top-14 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50 text-slate-900 animate-in fade-in slide-in-from-top-4 no-print">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Display Settings</span>
                    <button onClick={() => setShowAppearance(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-3">Font Face</span>
                      <div className="grid grid-cols-2 gap-2">
                        {FONT_OPTIONS.map(font => (
                          <button key={font.value} onClick={() => setFontFamily(font.value)} className={`p-2.5 text-left border rounded-lg transition-all ${fontFamily === font.value ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200'}`}>
                            <span className={`block text-[13px] font-medium ${font.value}`}>{font.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Justification</span>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
                        <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}><AlignLeft size={16}/></button>
                        <button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded ${textAlign === 'justify' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}><AlignJustify size={16}/></button>
                      </div>
                    </div>
                    <div>
                       <span className="text-xs font-bold text-slate-700 block mb-3">Visual Mode</span>
                       <div className="grid grid-cols-4 gap-2">
                          {Object.keys(THEMES).map((t) => (
                             <button key={t} onClick={() => setTheme(t as Theme)} className={`h-8 rounded-lg border-2 ${THEMES[t as Theme].bg} ${theme === t ? 'border-blue-500 ring-2 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`} />
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 z-10 backdrop-blur-md">
                   <div className="relative">
                      <Loader2 className="animate-spin text-blue-600 mb-4" size={56} />
                      <Library size={24} className="absolute inset-0 m-auto text-blue-800" />
                   </div>
                   <p className="font-serif text-slate-900 font-black text-xl tracking-tight">Accessing Codex...</p>
                   <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 animate-pulse">Retrieving Legal Commentary</p>
                </div>
              )}

              {aiResponse ? (
                 <div 
                   contentEditable={isEditing}
                   suppressContentEditableWarning={true}
                   className={`max-w-[8.5in] mx-auto min-h-[11in] ${currentTheme.pageBg} ${fontFamily} ${currentTheme.text} shadow-2xl py-20 px-12 md:px-20 mb-24 rounded-sm book-content transition-all outline-none`} 
                   style={{ fontSize: `${effectiveFontSize}px` }} 
                   dangerouslySetInnerHTML={{ __html: aiResponse }} 
                 />
              ) : selectedCode ? (
                  <div className={`max-w-5xl mx-auto shadow-2xl border p-12 lg:p-20 min-h-full ${currentTheme.ui} rounded-lg relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32"></div>
                    <div className="text-center border-b-2 pb-10 mb-12 border-current relative z-10">
                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-6">Codex Philippine Statute</div>
                        <h1 className={`font-black text-4xl md:text-6xl mb-6 tracking-tight leading-tight ${fontFamily} ${currentTheme.text}`}>{selectedCode.name}</h1>
                        <p className={`text-xl md:text-2xl italic font-medium opacity-80 ${fontFamily} ${currentTheme.text}`}>{selectedCode.description}</p>
                    </div>
                    
                    {selectedCode.structure ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                          {selectedCode.structure.map((item, idx) => (
                              <div key={idx} className="group">
                                  <button onClick={() => handleSectionClick(item)} className="text-left w-full">
                                      <h4 className={`font-black text-lg border-b pb-2 mb-3 ${fontFamily} ${currentTheme.text} group-hover:text-blue-600 transition-colors flex justify-between items-center`}>
                                        {item.title}
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                      </h4>
                                      {item.subtitle && <p className="text-xs italic opacity-60 mb-4 font-serif leading-relaxed">{item.subtitle}</p>}
                                  </button>
                              </div>
                          ))}
                       </div>
                    ) : (
                       <div className="flex flex-col items-center justify-center py-20 opacity-40">
                          <BookOpen size={48} className="mb-4" />
                          <p className="font-serif italic text-lg text-center">Structural indices are available via selection.</p>
                       </div>
                    )}
                    
                    <div className="mt-12 pt-12 border-t border-slate-100 flex justify-center">
                       <button onClick={() => handleCodeSelect(selectedCode.id)} className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest">
                          <RefreshCw size={14} /> Refresh Codex Index
                       </button>
                    </div>
                  </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 animate-in fade-in duration-700">
                   <div className="relative mb-10">
                      <Library size={96} className="text-slate-200" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Scale size={48} className="text-blue-600/20" />
                      </div>
                   </div>
                   <h3 className="text-3xl font-serif font-bold text-slate-800 mb-3">Electronic Statute Repository</h3>
                   <p className="text-center max-w-sm font-sans text-sm leading-relaxed">Select a legal codex from the sidebar explorer to begin professional reading, research, and analysis.</p>
                   
                   <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl w-full">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-500"><Search size={24}/></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Global Search</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-500"><BookMarked size={24}/></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Annotated Laws</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-500"><Scale size={24}/></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Citations</span>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

// Simple utility for icon consistency in logic
const RefreshCw = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 16h5v5"/>
  </svg>
);
