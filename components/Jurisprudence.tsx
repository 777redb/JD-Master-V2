
import React, { useState, useRef } from 'react';
import { generateGeneralLegalAdvice } from '../services/gemini';
import { JURISPRUDENCE_TOPICS } from '../constants';
import { 
  Scale, 
  Search, 
  Loader2, 
  Gavel, 
  ChevronRight, 
  ChevronDown, 
  Settings,
  Printer,
  Download,
  Highlighter,
  ZoomIn,
  ZoomOut,
  PanelLeftClose,
  PanelLeftOpen,
  Edit3,
  X
} from 'lucide-react';

type Theme = 'light' | 'sepia' | 'dark' | 'night';
type LegalFont = 'font-serif' | 'font-crimson' | 'font-sans' | 'font-mono';

const THEMES: Record<Theme, { bg: string, text: string, ui: string, border: string, prose: string }> = {
  light: { 
    bg: 'bg-white', 
    text: 'text-slate-900', 
    ui: 'bg-white border-slate-200',
    border: 'border-slate-200',
    prose: 'prose-slate'
  },
  sepia: { 
    bg: 'bg-[#f4ecd8]', 
    text: 'text-[#5b4636]', 
    ui: 'bg-[#eaddcf] border-[#d3c4b1]',
    border: 'border-[#d3c4b1]',
    prose: 'prose-amber'
  },
  dark: { 
    bg: 'bg-[#1e293b]', 
    text: 'text-slate-100', 
    ui: 'bg-[#0f172a] border-slate-700',
    border: 'border-slate-700',
    prose: 'prose-invert'
  },
  night: { 
    bg: 'bg-black', 
    text: 'text-gray-300', 
    ui: 'bg-gray-900 border-gray-800',
    border: 'border-gray-800',
    prose: 'prose-invert'
  }
};

const FONT_OPTIONS: { label: string, value: LegalFont, desc: string }[] = [
  { label: 'Merriweather', value: 'font-serif', desc: 'Standard Legal' },
  { label: 'Crimson Pro', value: 'font-crimson', desc: 'Book / Classic' },
  { label: 'Inter', value: 'font-sans', desc: 'Modern Clean' },
  { label: 'JetBrains Mono', value: 'font-mono', desc: 'Technical' },
];

export const Jurisprudence: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [activeTopicTitle, setActiveTopicTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Navigation State
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Reader Appearance State
  const [theme, setTheme] = useState<Theme>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState<LegalFont>('font-serif');
  const [showAppearance, setShowAppearance] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES[theme];
  const effectiveFontSize = Math.round(16 * (zoomLevel / 100));

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSearch = async (searchQuery: string, topicTitle?: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setActiveTopicTitle(topicTitle || searchQuery);
    setResult('');
    
    try {
      const prompt = `
      Act as an expert Legal Reviewer and Textbook Author (in the style of modern, high-yield Philippine law reviewers).
      Create a comprehensive, well-structured Study Guide on: "${searchQuery}".
      
      STRICT OUTPUT FORMAT (CLEAN SEMANTIC HTML ONLY - NO CLASS ATTRIBUTES):
      
      <h3>${searchQuery.toUpperCase()}</h3>
      
      <h4>I. CONCEPT AND DOCTRINE</h4>
      <p>[Provide a clear, authoritative definition. Cite the specific Constitutional provision, Statutory basis, or Civil Code Article. Explain the "why" or the rationale of the law.]</p>
      
      <h4>II. ELEMENTS / REQUISITES</h4>
      <p>For this doctrine to apply, the following elements must concur:</p>
      <ul>
         <li><strong>[Element 1]</strong>: [Brief explanation]</li>
         <li><strong>[Element 2]</strong>: [Brief explanation]</li>
      </ul>
      
      <h4>III. LANDMARK JURISPRUDENCE</h4>
      <p>In the controlling case of <strong><em>[Case Name]</em></strong>, the Supreme Court ruled:</p>
      
      <blockquote>
        "[Insert the specific, verbatim doctrine or ratio decidendi here. This should be the core legal principle established by the case.]"
      </blockquote>
      
      <p><strong>Application:</strong> [Explain how the Court applied the law to the facts in 1-2 sentences].</p>
      
      <hr />
      
      <h4>IV. DISTINCTIONS & EXCEPTIONS</h4>
      <p>[Distinguish this concept from related doctrines (e.g., "Distinction between X and Y"). List any exceptions to the general rule.]</p>
      
      CRITICAL INSTRUCTIONS:
      - Return ONLY plain HTML tags (h3, h4, p, ul, li, blockquote, strong, em, hr). 
      - Do NOT use class attributes.
      - Use Roman Numerals (I, II, III) for H4 headers.
      - Ensure paragraphs are substantial but readable (avoid walls of text).
      `;
      
      const res = await generateGeneralLegalAdvice(prompt);
      setResult(res);
      // Reset scroll
      if (contentRef.current) contentRef.current.scrollTop = 0;
    } catch (err) {
      setResult("<p>Error retrieving jurisprudence.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = "bg-yellow-200 text-black px-1 rounded";
    try {
      range.surroundContents(span);
      selection.removeAllRanges();
    } catch (e) {
      console.error("Selection spans multiple nodes, simplified highlighting not supported for complex ranges.");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `<html><head><title>${activeTopicTitle}</title></head><body>${result}</body></html>`
    ], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `${activeTopicTitle.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(element);
    element.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${activeTopicTitle}</title>
            <style>
              body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; }
              h3 { text-align: center; font-size: 24px; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #000; padding-bottom: 20px; }
              h4 { text-transform: uppercase; margin-top: 30px; border-bottom: 1px solid #ccc; font-weight: bold; }
              blockquote { border-left: 4px solid #ccc; padding-left: 15px; font-style: italic; margin: 20px 40px; background-color: #f9f9f9; padding: 20px; }
              p { text-align: justify; text-indent: 40px; }
              ul { margin-left: 40px; }
            </style>
          </head>
          <body>${result}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      
      {/* Top Bar */}
      <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-10">
        <div className="flex items-center gap-3">
           <Scale className="text-amber-600" size={24} />
           <h2 className="font-serif font-bold text-slate-900 text-lg hidden md:block">Jurisprudence Explorer</h2>
        </div>
        
        <form onSubmit={handleManualSearch} className="flex-1 max-w-xl mx-4 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search specific case (e.g., 'Chi Ming Tsoi')..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-amber-500 border rounded-lg text-sm transition-all outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        </form>

        <div className="flex items-center gap-2">
           <button onClick={handleDownload} disabled={!result} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-30" title="Download">
              <Download size={20} />
           </button>
           <button onClick={handlePrint} disabled={!result} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 disabled:opacity-30" title="Print/PDF">
              <Printer size={20} />
           </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Navigation */}
        <div className={`
           border-r border-slate-200 flex flex-col bg-slate-50 transition-all duration-300 absolute md:relative z-20 h-full
           ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden opacity-0 md:opacity-100'}
        `}>
           <div className="p-4 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider bg-slate-50">
              Jurisprudence Library
           </div>
           <div className="flex-1 overflow-y-auto">
              {JURISPRUDENCE_TOPICS.map((category, idx) => (
                <div key={idx} className="border-b border-slate-100 last:border-0">
                  <button 
                    onClick={() => toggleCategory(category.category)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white transition-colors text-left"
                  >
                    <span className="font-serif font-bold text-slate-800">{category.category}</span>
                    {expandedCategories[category.category] ? <ChevronDown size={16} className="text-slate-400"/> : <ChevronRight size={16} className="text-slate-400"/>}
                  </button>
                  
                  {expandedCategories[category.category] && (
                    <div className="bg-white">
                      {category.topics.map((topic, tIdx) => (
                         <button
                           key={tIdx}
                           onClick={() => handleSearch(topic.query, topic.title)}
                           className={`w-full text-left py-3 px-4 pl-8 text-sm border-l-4 transition-all hover:bg-amber-50
                             ${activeTopicTitle === topic.title ? 'border-amber-500 bg-amber-50 font-bold text-amber-900' : 'border-transparent text-slate-600'}
                           `}
                         >
                           {topic.title}
                         </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>

        {/* Reader Panel */}
        <div className={`flex-1 flex flex-col relative transition-colors duration-300 ${currentTheme.bg}`}>
           
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
                 {!isSidebarOpen && activeTopicTitle && (
                    <span className={`text-sm font-bold font-serif ml-2 ${currentTheme.text}`}>{activeTopicTitle}</span>
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

                    {/* Font Family */}
                    <div className="mb-5 pb-5 border-b border-slate-100">
                       <span className="text-sm font-medium text-slate-700 block mb-2">Typeface</span>
                       <div className="grid grid-cols-2 gap-2">
                          {FONT_OPTIONS.map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => setFontFamily(opt.value)}
                              className={`p-3 text-left border rounded-lg transition-all
                                ${fontFamily === opt.value 
                                  ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' 
                                  : 'bg-white border-slate-200 hover:border-slate-300'}`}
                            >
                              <span className={`block text-sm font-medium text-slate-900 ${opt.value}`}>{opt.label}</span>
                              <span className="block text-[10px] text-slate-400">{opt.desc}</span>
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

           {/* Floating Toolbar for Editing */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/90 text-white p-2 rounded-full shadow-xl backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300">
               <button onClick={handleHighlight} className="p-2 hover:bg-white/20 rounded-full" title="Highlight Selection"><Highlighter size={18}/></button>
               <div className="w-px h-4 bg-white/20"></div>
               <button onClick={() => setIsEditing(!isEditing)} className={`p-2 hover:bg-white/20 rounded-full ${isEditing ? 'text-amber-400' : ''}`} title="Edit Text"><Edit3 size={18}/></button>
           </div>

           <div 
             className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth" 
             ref={contentRef}
           >
              {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-amber-600 mb-4" size={48} />
                      <p className={`font-serif text-lg animate-pulse ${currentTheme.text}`}>Consulting Jurisprudence...</p>
                  </div>
              ) : result ? (
                 <div className={`max-w-4xl mx-auto min-h-full pb-20 outline-none ${fontFamily}`}>
                    <div 
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        className={`
                            prose prose-lg max-w-none 
                            ${currentTheme.prose}
                            
                            /* Typography Hierarchy */
                            prose-headings:font-serif prose-headings:text-inherit
                            
                            /* H3: Chapter Title Style */
                            prose-h3:text-3xl prose-h3:text-center prose-h3:uppercase prose-h3:tracking-[0.2em] 
                            prose-h3:font-bold prose-h3:py-6 prose-h3:mb-12 
                            prose-h3:border-b-4 prose-h3:border-double ${theme === 'light' ? 'prose-h3:border-slate-800' : 'prose-h3:border-current'}
                            
                            /* H4: Section Header Style */
                            prose-h4:text-lg prose-h4:uppercase prose-h4:tracking-widest prose-h4:font-bold 
                            prose-h4:mt-16 prose-h4:mb-6 prose-h4:pb-2 
                            prose-h4:border-b ${theme === 'light' ? 'prose-h4:border-slate-300' : 'prose-h4:border-white/20'}

                            /* Paragraphs: Textbook Body with Indentation & Justification */
                            prose-p:text-inherit prose-p:leading-loose prose-p:text-justify prose-p:indent-8 prose-p:mb-6
                            
                            /* Quotes */
                            prose-blockquote:text-inherit prose-blockquote:not-italic prose-blockquote:border-l-[3px] 
                            prose-blockquote:pl-8 prose-blockquote:py-2 prose-blockquote:my-10 
                            prose-blockquote:ml-6 prose-blockquote:mr-6
                            ${theme === 'light' ? 'prose-blockquote:border-amber-600 prose-blockquote:bg-amber-50/50' : 'prose-blockquote:border-amber-500 prose-blockquote:bg-white/5'}

                            /* Lists */
                            prose-li:text-inherit prose-li:leading-loose prose-ul:list-disc prose-ul:pl-6
                            
                            /* Misc */
                            prose-hr:my-12 prose-hr:border-current prose-hr:opacity-20
                            prose-strong:font-bold prose-strong:text-inherit
                            prose-em:italic prose-em:text-inherit

                            /* Table */
                            prose-table:text-sm prose-table:my-10
                            prose-th:uppercase prose-th:tracking-wider prose-th:text-xs
                            
                            ${isEditing ? 'ring-2 ring-amber-500 p-4 rounded-lg' : ''}
                        `}
                        style={{ 
                            fontSize: `${effectiveFontSize}px`,
                            '--tw-prose-body': 'inherit',
                            '--tw-prose-headings': 'inherit',
                            '--tw-prose-td-borders': theme === 'light' ? '#e2e8f0' : '#475569',
                            '--tw-prose-th-borders': theme === 'light' ? '#e2e8f0' : '#475569',
                          } as React.CSSProperties}
                        dangerouslySetInnerHTML={{ __html: result }} 
                    />
                 </div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-2 ${currentTheme.border}`}>
                        <Gavel size={48} className={currentTheme.text} />
                    </div>
                    <p className={`font-serif text-xl ${currentTheme.text}`}>Select a topic from the library to begin reading.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
