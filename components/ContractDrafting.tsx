
import React, { useState, useMemo, useRef } from 'react';
import { CONTRACT_TEMPLATES } from '../constants';
import { ContractTemplate } from '../types';
import { generateContract } from '../services/gemini';
import { 
  PenTool, 
  ScrollText, 
  Wand2, 
  Loader2, 
  Copy, 
  FileText, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Briefcase, 
  Scale, 
  FileEdit,
  Sparkles,
  ArrowRight,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  X,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignJustify,
  Maximize2,
  Minimize2,
  Layout,
  Columns,
  ChevronUp
} from 'lucide-react';

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

export const ContractDrafting: React.FC = () => {
  const [mode, setMode] = useState<'TEMPLATE' | 'CUSTOM'>('TEMPLATE');
  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [customPrompt, setCustomPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Sales & Property': true
  });

  // Collapsible States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  // Reading Mode States (Identical to Legal Doctrines)
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-crimson');
  const [showAppearance, setShowAppearance] = useState(false);
  const [textAlign, setTextAlign] = useState<'justify' | 'left'>('justify');

  const currentTheme = THEMES[theme];
  const effectiveFontSize = Math.round(18 * (zoomLevel / 100));

  const filteredTemplates = useMemo(() => {
    if (!sidebarSearch) return CONTRACT_TEMPLATES;
    const search = sidebarSearch.toLowerCase();
    return CONTRACT_TEMPLATES.map(cat => ({
      ...cat,
      templates: cat.templates.filter(t => 
        t.name.toLowerCase().includes(search) || 
        t.description.toLowerCase().includes(search)
      )
    })).filter(cat => cat.templates.length > 0);
  }, [sidebarSearch]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setDraft('');
    
    try {
      if (mode === 'TEMPLATE') {
        if (!template) return;
        const res = await generateContract('TEMPLATE', template.name, formData);
        setDraft(res);
      } else {
        if (!customPrompt) return;
        const res = await generateContract('CUSTOM', customPrompt, { additionalNotes: 'User requested custom draft' });
        setDraft(res);
      }
      // Collapse config on success to focus on draft
      setIsConfigOpen(false);
    } catch (e) {
      setDraft("<p>Error generating contract.</p>");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = draft;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(text);
    alert('Contract copied to clipboard!');
  };

  const selectTemplate = (t: ContractTemplate) => {
    setMode('TEMPLATE');
    setTemplate(t);
    setFormData({});
    setDraft('');
    setIsConfigOpen(true);
    if (window.innerWidth < 1024) {
      document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
    }
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

      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-6 shrink-0 bg-white z-40 shadow-sm no-print">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-600 rounded flex items-center justify-center text-white shadow-sm text-xs font-black">
              JD
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-serif font-bold text-slate-900 leading-none">Drafting Studio</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Premium PH Legal Drafts</p>
            </div>
          </div>
          
          <div className="w-px h-6 bg-slate-200 mx-1"></div>

          <div className="flex bg-slate-100 p-0.5 rounded-lg shadow-inner">
            <button
              onClick={() => setMode('TEMPLATE')}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${
                mode === 'TEMPLATE' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => { setMode('CUSTOM'); setTemplate(null); setDraft(''); setIsConfigOpen(true); }}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${
                mode === 'CUSTOM' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              AI Custom
            </button>
          </div>
        </div>

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

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar (Template Navigator) */}
        <div className={`
          border-r border-slate-200 flex flex-col bg-slate-50/30 transition-all duration-300 ease-in-out no-print z-30
          ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden opacity-0'}
        `}>
          <div className="p-4 border-b border-slate-100 bg-white/50">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search repository..." 
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-100 transition-all shadow-sm"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            <button
              onClick={() => { setMode('CUSTOM'); setTemplate(null); setDraft(''); setIsConfigOpen(true); }}
              className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all mb-4 ${
                mode === 'CUSTOM' ? 'bg-amber-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300'
              }`}
            >
              <div className={`p-2 rounded-lg ${mode === 'CUSTOM' ? 'bg-white/20' : 'bg-amber-50 text-amber-600'}`}>
                 <Sparkles size={18} />
              </div>
              <div>
                <div className="text-xs font-bold">Custom AI Draft</div>
                <div className={`text-[10px] ${mode === 'CUSTOM' ? 'text-amber-100' : 'text-slate-400'}`}>Describe from scratch</div>
              </div>
            </button>

            <div className="px-2 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Taxonomy</div>

            {filteredTemplates.map((cat, idx) => (
              <div key={idx} className="mb-1">
                <button 
                  onClick={() => toggleCategory(cat.category)}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-white rounded-lg transition-colors group"
                >
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-amber-700 transition-colors uppercase tracking-tight">{cat.category}</span>
                  {expandedCategories[cat.category] ? <ChevronDown size={14} className="text-amber-600"/> : <ChevronRight size={14} className="text-slate-300"/>}
                </button>
                
                {expandedCategories[cat.category] && (
                  <div className="mt-1 space-y-1">
                    {cat.templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => selectTemplate(t)}
                        className={`w-full text-left p-3 rounded-xl transition-all border ${
                          template?.id === t.id 
                            ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500/10' 
                            : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className={`text-xs font-bold ${template?.id === t.id ? 'text-amber-900' : 'text-slate-700'}`}>{t.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{t.description}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Combined Config & Preview Column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Configuration Panel (Top, Collapsible Height) */}
          <div id="form-section" className={`
            border-b border-slate-200 bg-white transition-all duration-300 ease-in-out no-print z-20 overflow-hidden
            ${isConfigOpen ? 'max-h-[50%] opacity-100' : 'max-h-0 opacity-0'}
          `}>
            <div className="p-8 h-full flex flex-col min-h-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider mb-3">
                     <Scale size={12} /> Legal Configuration
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 leading-tight">
                    {mode === 'TEMPLATE' ? (template?.name || "Select a Template") : "AI Custom Draft"}
                  </h3>
                </div>
                <button onClick={() => setIsConfigOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                  <ChevronUp size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                {mode === 'TEMPLATE' && template ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                       <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                       <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                         Fill in the variables below. AI will synthesize these into a legally sound Philippine contract draft.
                       </p>
                    </div>
                    {template.fields.map(field => (
                      <div key={field} className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block ml-1">{field}</label>
                        <input 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none text-slate-900 text-sm font-medium transition-all shadow-inner"
                          onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                          value={formData[field] || ''}
                          placeholder={`Enter ${field.toLowerCase()}...`}
                        />
                      </div>
                    ))}
                  </div>
                ) : mode === 'CUSTOM' ? (
                  <div className="space-y-1.5 h-full flex flex-col">
                    <label className="text-xs font-bold text-slate-700 block ml-1">Drafting Instructions</label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none text-sm leading-loose font-medium shadow-inner resize-none"
                      placeholder="E.g., I need a contract for a freelance graphic designer. Client is XYZ Corp. Fee is 50k PHP..."
                    />
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 opacity-40">
                     <FileEdit size={48} className="mb-4" />
                     <p className="text-sm font-serif">Select a template from the explorer to begin</p>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                 <button 
                  onClick={handleGenerate}
                  disabled={loading || (mode === 'TEMPLATE' && !template) || (mode === 'CUSTOM' && !customPrompt)}
                  className="px-10 h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin" size={18}/> : <><Wand2 size={18}/> Synthesize Draft</>}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section (Bottom, Full Width) */}
          <div className={`flex-1 flex flex-col overflow-hidden relative transition-colors duration-300 ${currentTheme.bg}`}>
            {/* Float Collapsed Toggle Controls */}
            <div className="absolute top-4 left-6 flex flex-col gap-2 z-50 no-print">
               {!isSidebarOpen && (
                 <button 
                   onClick={() => setIsSidebarOpen(true)}
                   className={`p-2 rounded-lg shadow-xl border transition-all ${currentTheme.ui} ${currentTheme.text}`}
                   title="Open Sidebar"
                 >
                   <PanelLeftOpen size={18} />
                 </button>
               )}
               {!isConfigOpen && (
                 <button 
                   onClick={() => setIsConfigOpen(true)}
                   className={`p-2 rounded-lg shadow-xl border transition-all ${currentTheme.ui} ${currentTheme.text}`}
                   title="Open Config"
                 >
                   <Layout size={18} />
                 </button>
               )}
            </div>

            <div className={`h-12 border-b flex justify-between items-center px-6 z-10 shrink-0 no-print ${currentTheme.ui}`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className={`p-1.5 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`}
                    title="Toggle Explorer"
                  >
                    {isSidebarOpen ? <PanelLeftClose size={18}/> : <PanelLeftOpen size={18}/>}
                  </button>
                  <button 
                    onClick={() => setIsConfigOpen(!isConfigOpen)} 
                    className={`p-1.5 rounded hover:bg-black/5 transition-colors ${currentTheme.text}`}
                    title="Toggle Config"
                  >
                    {isConfigOpen ? <ChevronUp size={18}/> : <Layout size={18}/>}
                  </button>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.text} flex items-center gap-2`}>
                  <ScrollText size={14}/>
                  Draft Preview
                </span>
              </div>

              <div className="flex items-center gap-2">
                {draft && (
                  <button onClick={handleCopy} className={`px-3 py-1.5 text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest border rounded-lg hover:bg-black/5 transition-all ${currentTheme.text} ${currentTheme.border}`}>
                    <Copy size={14}/> Copy Text
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
              
              {draft ? (
                <div 
                  className={`max-w-[8.5in] mx-auto min-h-[11in] shadow-2xl rounded-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${currentTheme.pageBg} ${currentTheme.text} ${fontFamily} book-content py-20 px-12 md:px-24`}
                  style={{ fontSize: `${effectiveFontSize}px` }}
                >
                  <div dangerouslySetInnerHTML={{ __html: draft }} />
                  <div className="mt-20 pt-10 border-t border-black/5 text-center opacity-30 italic font-serif text-[10px] tracking-widest">
                    *** END OF GENERATED DOCUMENT ***
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-slate-200 shadow-sm ${currentTheme.ui}`}>
                    <FileText size={48} className="opacity-20" />
                  </div>
                  <p className={`max-w-xs text-center font-serif text-lg ${currentTheme.text}`}>
                    Your generated draft will appear here with premium book-grade formatting.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
