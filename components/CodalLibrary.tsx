
import React, { useState } from 'react';
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
  Type, 
  Minus, 
  Plus,
  X,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignJustify
} from 'lucide-react';
import { CodalNavigation } from '../types';

interface NavItemProps {
  item: CodalNavigation;
  depth?: number;
  expandedNodes: Record<string, boolean>;
  activeSectionQuery: string | null;
  onItemClick: (nav: CodalNavigation) => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, depth = 0, expandedNodes, activeSectionQuery, onItemClick }) => {
  const isExpanded = expandedNodes[item.title];
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeSectionQuery === item.query;

  return (
    <div className="select-none">
      <button
        onClick={() => onItemClick(item)}
        className={`w-full text-left p-3 flex items-start gap-2 hover:bg-slate-50 transition-colors
          ${isActive ? 'bg-amber-50 text-amber-900 border-r-2 border-amber-500' : 'text-slate-700'}
          ${depth > 0 ? 'pl-' + (depth * 4 + 3) : ''}
        `}
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
      >
        {hasChildren ? (
           <div className="mt-1">{isExpanded ? <ChevronDown size={14} className="text-slate-400"/> : <ChevronRight size={14} className="text-slate-400"/>}</div>
        ) : (
           <div className="mt-1"><div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-500' : 'bg-slate-300'}`}></div></div>
        )}
        
        <div>
          <div className={`text-sm font-serif ${hasChildren ? 'font-bold' : 'font-medium'}`}>{item.title}</div>
          {item.subtitle && <div className="text-xs text-slate-500 font-sans mt-0.5">{item.subtitle}</div>}
        </div>
      </button>
      
      {hasChildren && isExpanded && (
        <div className="border-l border-slate-100 ml-5">
          {item.children!.map((child, idx) => (
            <NavItem 
              key={idx} 
              item={child} 
              depth={depth + 1} 
              expandedNodes={expandedNodes}
              activeSectionQuery={activeSectionQuery}
              onItemClick={onItemClick}
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
  { label: 'Merriweather', value: 'font-serif', desc: 'Standard Legal' },
  { label: 'Crimson Pro', value: 'font-crimson', desc: 'Book / Classic' },
  { label: 'Inter', value: 'font-sans', desc: 'Modern Clean' },
  { label: 'JetBrains Mono', value: 'font-mono', desc: 'Technical' },
];

export const CodalLibrary: React.FC = () => {
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);
  const [activeSectionQuery, setActiveSectionQuery] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Customization State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAppearance, setShowAppearance] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100); // Percentage
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');

  const selectedCode = PHILIPPINE_CODALS.find(c => c.id === selectedCodeId);
  const currentTheme = THEMES[theme];

  // Base font size is 18px (book standard), zoom adjusts this
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100));

  const handleCodeSelect = (codeId: string) => {
    setSelectedCodeId(codeId);
    setAiResponse(null);
    setActiveSectionQuery(null);
    setSearchQuery('');
    
    // Auto-load intro if it has structure
    const code = PHILIPPINE_CODALS.find(c => c.id === codeId);
    if (code && !code.structure) {
        // Fallback for codes without structure
        loadGenericOverview(code);
    }
  };

  const loadGenericOverview = async (code: any) => {
      setIsLoading(true);
      try {
        const prompt = `Present a professional, textbook-style Table of Contents and Structural Overview for: ${code.name} (${code.description}).
        Strict HTML Output Format:
        1. <h3>${code.name}</h3>
        2. <p><strong>Overview:</strong> [One paragraph summary of the law]</p>
        3. <h4>Structure</h4>
        4. <ul><li>[List major divisions]</li></ul>`;
        const result = await generateGeneralLegalAdvice(prompt);
        setAiResponse(result);
      } catch (e) {
        setAiResponse("<p>Error loading overview.</p>");
      } finally {
          setIsLoading(false);
      }
  }

  const handleSectionClick = async (nav: CodalNavigation) => {
    if (nav.children) {
      setExpandedNodes(prev => ({...prev, [nav.title]: !prev[nav.title]}));
      return;
    }

    setActiveSectionQuery(nav.query);
    setIsLoading(true);
    setAiResponse(null);
    
    try {
      const prompt = `
        Act as a **Senior Legal Commentator and Supreme Court Justice**.
        Context: ${selectedCode?.name || 'Philippine Law'}.
        Task: Provide a **Comprehensive Annotated Commentary** on: "${nav.query}".

        **STRICT OUTPUT FORMAT (Book Layout):**
        
        <h3>[Title of Article/Section]</h3>

        <div class="statute-box">
           <p><strong>[Article Number]</strong></p>
           <p>[Provide the VERBATIM text of the law here. Do not summarize.]</p>
        </div>

        <h4>I. CONCEPT & RATIONALE</h4>
        <p>[Explain the spirit of the law (Ratio Legis). Why was this enacted? What is the core concept?]</p>

        <h4>II. ESSENTIAL ELEMENTS / REQUISITES</h4>
        <p>[Break down the provision into its components.]</p>
        <ul>
           <li><strong>[Element 1]</strong>: [Explanation]</li>
           <li><strong>[Element 2]</strong>: [Explanation]</li>
        </ul>

        <h4>III. JURISPRUDENCE & DOCTRINES</h4>
        <p>The Supreme Court has interpreted this provision in the following key cases:</p>
        <blockquote>
           <strong>[Case Name, G.R. No.]</strong><br/>
           "[Insert the specific doctrine or ruling. This must be a direct quote or a faithful abstract of the ruling.]"
        </blockquote>
        <blockquote>
           <strong>[Case Name, G.R. No.]</strong><br/>
           "[Insert another relevant doctrine.]"
        </blockquote>

        <h4>IV. ILLUSTRATION / APPLICATION</h4>
        <p><strong>Scenario:</strong> [A simple hypothetical problem]</p>
        <p><strong>Answer:</strong> [Apply the law to the facts.]</p>

        <hr/>
        <p><em>See also: [Related Provisions or Laws]</em></p>
        
        OUTPUT HTML ONLY. NO MARKDOWN.
      `;
      const result = await generateGeneralLegalAdvice(prompt);
      setAiResponse(result);
    } catch (err) {
      setAiResponse("<p>Failed to retrieve provision text.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const codeName = selectedCode ? selectedCode.name : "All Philippine Codals";
      const prompt = `
        Act as an **Annotated Legal Library**.
        Context: ${codeName}.
        Search Query: "${searchQuery}".
        
        Task: Find the specific legal provisions (Articles/Sections) relevant to the query and provide a **Commentary**.
        
        **REQUIRED STRUCTURE (HTML):**
        <h3>[Main Article/Provision Found]</h3>
        
        <div class="statute-box">
           <p>[Verbatim Text of the Law]</p>
        </div>

        <h4>COMMENTARY & JURISPRUDENCE</h4>
        <p>[Explain the law in relation to the search query ("${searchQuery}").]</p>
        <p><strong>Relevant Doctrine:</strong> [Cite a Supreme Court case that applies here.]</p>
        
        <h4>APPLICATION</h4>
        <p>[How does this apply to the user's search?]</p>
      `;
      
      const result = await generateGeneralLegalAdvice(prompt);
      setAiResponse(result);
    } catch (err) {
      setAiResponse("<p>Error searching codals.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
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
        .book-content h1, .book-content h2, .book-content h3 {
          text-align: center;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          padding-bottom: 1rem;
          border-bottom: 3px double ${theme === 'light' ? '#1e293b' : 'currentColor'};
          text-indent: 0;
        }
        
        .book-content h3 {
           font-size: 1.25em;
           border-bottom-width: 1px;
           border-style: solid;
        }

        .book-content h4 {
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.1em;
          text-transform: uppercase;
          text-indent: 0;
          page-break-after: avoid;
          color: ${theme === 'light' ? '#b45309' : theme === 'sepia' ? '#78350f' : 'inherit'}; /* Amber-700 for light */
        }

        /* STATUTE BOX (The Law Itself) */
        .book-content .statute-box {
          border: 1px solid ${theme === 'light' || theme === 'sepia' ? '#cbd5e1' : '#334155'};
          background-color: ${theme === 'light' ? '#f8fafc' : theme === 'sepia' ? '#f4e9d6' : 'rgba(255,255,255,0.03)'};
          padding: 1.5rem;
          margin: 2rem 0;
          border-radius: 2px;
          text-indent: 0;
          font-family: 'Merriweather', serif;
          position: relative;
        }
        
        .book-content .statute-box::before {
           content: 'THE LAW';
           position: absolute;
           top: -10px;
           left: 20px;
           background: ${theme === 'light' ? '#f8fafc' : theme === 'sepia' ? '#f4e9d6' : '#1e293b'};
           padding: 0 10px;
           font-size: 10px;
           font-weight: bold;
           color: #94a3b8;
           letter-spacing: 1px;
        }

        .book-content .statute-box p {
          text-indent: 0;
          margin-bottom: 1em;
        }
        .book-content .statute-box p:last-child {
          margin-bottom: 0;
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
        .book-content div + p,
        .book-content blockquote + p {
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

        /* BLOCKQUOTES (Annotations/Jurisprudence) */
        .book-content blockquote {
          margin: 2rem 2.5rem;
          padding: 1rem 1.5rem;
          border-left: 3px solid ${theme === 'light' || theme === 'sepia' ? '#b45309' : '#fbbf24'};
          background-color: ${theme === 'light' ? 'rgba(0,0,0,0.03)' : theme === 'sepia' ? 'rgba(91, 70, 54, 0.05)' : 'rgba(255,255,255,0.05)'};
          font-style: italic;
          font-size: 0.95em;
          text-indent: 0;
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
      `}</style>

      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="text-amber-600" />
            Codal Library
          </h2>
          <p className="text-slate-500 text-sm">Official Statutes with Annotated Commentary</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={selectedCode 
                ? `Search within ${selectedCode.name}...` 
                : "Search all laws..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-serif"
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
        </form>
      </div>

      <div className="flex-1 flex flex-row gap-0 min-h-0 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm relative">
        
        {/* Left Sidebar: Navigation Tree */}
        <div className={`
          border-r border-slate-200 bg-white flex flex-col h-full transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-full lg:w-80 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden absolute lg:relative'}
        `}>
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
             <select 
               className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
               value={selectedCodeId || ''}
               onChange={(e) => handleCodeSelect(e.target.value)}
             >
               <option value="">-- Select a Law --</option>
               {CODAL_CATEGORIES.map(category => {
                 const laws = PHILIPPINE_CODALS.filter(c => c.category === category);
                 if (laws.length === 0) return null;
                 
                 const hasSubcategories = laws.some(l => l.subcategory);
                 if (!hasSubcategories) {
                    return (
                       <optgroup label={category} key={category} className="font-serif font-bold text-slate-900">
                         {laws.map(c => (
                           <option key={c.id} value={c.id} className="font-sans font-normal text-slate-700">{c.name}</option>
                         ))}
                       </optgroup>
                    );
                 }
                 const grouped: Record<string, typeof laws> = {};
                 const noSub: typeof laws = [];
                 laws.forEach(l => {
                    if (l.subcategory) {
                        if (!grouped[l.subcategory]) grouped[l.subcategory] = [];
                        grouped[l.subcategory].push(l);
                    } else {
                        noSub.push(l);
                    }
                 });
                 return (
                    <optgroup label={category} key={category} className="font-serif font-bold text-slate-900">
                       {noSub.map(c => (
                           <option key={c.id} value={c.id} className="font-sans font-normal text-slate-700">{c.name}</option>
                       ))}
                       {Object.keys(grouped).map(sub => (
                           <React.Fragment key={sub}>
                               <option disabled className="font-bold text-slate-400 bg-slate-50">── {sub} ──</option>
                               {grouped[sub].map(c => (
                                   <option key={c.id} value={c.id} className="font-sans font-normal text-slate-700 pl-4">{c.name}</option>
                               ))}
                           </React.Fragment>
                       ))}
                    </optgroup>
                 );
               })}
             </select>
          </div>
          
          <div className="flex-1 overflow-y-auto w-full">
            {selectedCode ? (
              selectedCode.structure ? (
                 <div className="py-2 w-80"> 
                    {selectedCode.structure.map((item, idx) => (
                      <NavItem 
                        key={idx} 
                        item={item} 
                        expandedNodes={expandedNodes}
                        activeSectionQuery={activeSectionQuery}
                        onItemClick={handleSectionClick}
                      />
                    ))}
                 </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-sm italic w-80">
                   Structure navigation not available for this code. Use search or view overview.
                </div>
              )
            ) : (
               <div className="p-6 text-center w-80">
                  <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-serif text-sm">Select a law from the dropdown to browse its contents.</p>
               </div>
            )}
          </div>
        </div>

        {/* Right Panel: Content Reader */}
        <div className={`flex-1 flex flex-col h-full transition-colors duration-300 relative ${currentTheme.bg}`}>
           
           {/* Reader Toolbar */}
           <div className={`px-6 py-3 border-b flex justify-between items-center z-20 ${currentTheme.ui}`}>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                   className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${currentTheme.text}`}
                   title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                 >
                   {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                 </button>
                 {!isSidebarOpen && selectedCode && (
                    <span className={`text-sm font-bold font-serif ml-2 ${currentTheme.text}`}>{selectedCode.name}</span>
                 )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowAppearance(!showAppearance)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors ${currentTheme.text}`}
                >
                  <Settings size={18} />
                  <span className="hidden sm:inline">Reader Settings</span>
                </button>

                {/* Settings Popover */}
                {showAppearance && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appearance</span>
                      <button onClick={() => setShowAppearance(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                    </div>

                    {/* Zoom Level */}
                    <div className="mb-5 pb-5 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium text-slate-700">Zoom</span>
                         <span className="text-xs text-slate-500 font-mono">{zoomLevel}%</span>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-lg">
                        <button onClick={() => setZoomLevel(Math.max(75, zoomLevel - 10))} className="p-2 flex-1 flex justify-center hover:bg-white rounded-md transition-colors" title="Zoom Out"><ZoomOut size={16} className="text-slate-600"/></button>
                        <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-2 flex-1 flex justify-center hover:bg-white rounded-md transition-colors" title="Zoom In"><ZoomIn size={16} className="text-slate-600"/></button>
                      </div>
                    </div>

                    {/* Alignment */}
                    <div className="mb-5 pb-5 border-b border-slate-100">
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

                    {/* Font Family */}
                    <div className="mb-5 pb-5 border-b border-slate-100">
                       <span className="text-sm font-medium text-slate-700 block mb-2">Typeface</span>
                       <div className="grid grid-cols-2 gap-2">
                          {FONT_OPTIONS.map(font => (
                            <button
                              key={font.value}
                              onClick={() => setFontFamily(font.value)}
                              className={`p-3 text-left border rounded-lg transition-all
                                ${fontFamily === font.value 
                                  ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' 
                                  : 'bg-white border-slate-200 hover:border-slate-300'}`}
                            >
                              <span className={`block text-sm font-medium text-slate-900 ${font.value}`}>{font.label}</span>
                              <span className="block text-[10px] text-slate-400">{font.desc}</span>
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Theme */}
                    <div>
                       <span className="text-sm font-medium text-slate-700 block mb-2">Theme</span>
                       <div className="flex gap-3">
                          <button onClick={() => setTheme('light')} className={`flex-1 h-12 rounded-lg bg-white border-2 flex items-center justify-center transition-all ${theme === 'light' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200'}`} title="Light"><div className="text-slate-900 font-serif text-lg">Aa</div></button>
                          <button onClick={() => setTheme('sepia')} className={`flex-1 h-12 rounded-lg bg-[#f4ecd8] border-2 flex items-center justify-center transition-all ${theme === 'sepia' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-[#d3c4b1]'}`} title="Sepia"><div className="text-[#5b4636] font-serif text-lg">Aa</div></button>
                          <button onClick={() => setTheme('dark')} className={`flex-1 h-12 rounded-lg bg-slate-800 border-2 flex items-center justify-center transition-all ${theme === 'dark' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-700'}`} title="Dark"><div className="text-slate-100 font-serif text-lg">Aa</div></button>
                          <button onClick={() => setTheme('night')} className={`flex-1 h-12 rounded-lg bg-black border-2 flex items-center justify-center transition-all ${theme === 'night' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-gray-800'}`} title="Night"><div className="text-gray-300 font-serif text-lg">Aa</div></button>
                       </div>
                    </div>

                  </div>
                )}
              </div>
           </div>

           {/* Content */}
           <div className={`flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth ${currentTheme.bg}`}>
              {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-amber-600 mb-4" size={40} />
                    <p className="font-serif text-slate-800 font-bold text-lg animate-pulse">Annotating Law...</p>
                    <p className="font-sans text-slate-500 text-sm mt-1">Consulting Jurisprudence & Commentaries</p>
                  </div>
              )}

              {aiResponse ? (
                 <div 
                   className={`
                     max-w-[8.5in] mx-auto min-h-[11in] 
                     ${currentTheme.pageBg} ${fontFamily} ${currentTheme.text}
                     shadow-xl
                     py-16 px-12 md:px-16
                     mb-20
                     rounded-sm
                     transition-all duration-500
                     book-content
                   `}
                   style={{ fontSize: `${effectiveFontSize}px` }}
                   dangerouslySetInnerHTML={{ __html: aiResponse }}
                 />
              ) : selectedCode && selectedCode.structure ? (
                  <div className={`max-w-5xl mx-auto shadow-sm border p-10 lg:p-16 min-h-full ${currentTheme.ui}`}>
                    {/* Textbook Header */}
                    <div className={`text-center border-b-2 pb-8 mb-12 ${theme === 'light' ? 'border-slate-900' : 'border-current'}`}>
                        <div className="text-xs font-bold opacity-60 uppercase tracking-[0.2em] mb-4">Philippine Codal Library</div>
                        <h1 className={`font-bold text-3xl md:text-5xl mb-6 tracking-tight leading-tight ${fontFamily} ${currentTheme.text}`}>{selectedCode.name}</h1>
                        <p className={`text-lg md:text-xl italic font-medium opacity-80 ${fontFamily} ${currentTheme.text}`}>{selectedCode.description}</p>
                    </div>
                    
                    {/* Compact Textbook TOC */}
                    <div className="columns-1 md:columns-2 gap-x-16 space-y-0">
                        {selectedCode.structure.map((item, idx) => (
                            <div key={idx} className="break-inside-avoid mb-8 group">
                                <div 
                                    className="cursor-pointer"
                                    onClick={() => handleSectionClick(item)}
                                >
                                    <h4 className={`font-bold text-lg border-b pb-1 mb-2 inline-block w-full ${fontFamily} ${currentTheme.text} border-current opacity-90 group-hover:opacity-100 group-hover:text-amber-600`}>
                                        {item.title}
                                    </h4>
                                    {item.subtitle && (
                                        <p className={`text-sm italic mb-3 pl-1 opacity-70 ${fontFamily} ${currentTheme.text}`}>
                                            {item.subtitle}
                                        </p>
                                    )}
                                </div>
                                
                                {item.children && (
                                    <ul className="space-y-1.5 pl-1">
                                        {item.children.map((child, cIdx) => (
                                            <li 
                                                key={cIdx}
                                                onClick={(e) => { e.stopPropagation(); handleSectionClick(child); }}
                                                className={`text-sm cursor-pointer flex items-baseline leading-tight group/child hover:text-amber-600 ${fontFamily} ${currentTheme.text} opacity-80`}
                                            >
                                                <span className="font-bold text-xs opacity-50 uppercase tracking-wider shrink-0 w-16 text-right mr-3">{child.title}</span>
                                                <span className="border-b border-transparent group-hover/child:border-current transition-all">{child.subtitle}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/20 text-center opacity-60">
                        <p className={`text-xs italic ${fontFamily} ${currentTheme.text}`}>
                            Select any section above to open the full legal text with AI annotations.
                        </p>
                    </div>
                  </div>
              ) : (
                !isLoading && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${currentTheme.border} ${currentTheme.bg}`}>
                      <BookOpen size={32} className={currentTheme.text} />
                    </div>
                    {selectedCode ? (
                       <p className={`text-lg ${fontFamily} ${currentTheme.text}`}>Select a section from the index to read.</p>
                    ) : (
                       <p className={`text-lg ${fontFamily} ${currentTheme.text}`}>Open a law to begin studying.</p>
                    )}
                  </div>
                )
              )}
           </div>
        </div>

      </div>
    </div>
  );
};
