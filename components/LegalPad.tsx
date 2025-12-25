
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Save, 
  Trash2, 
  FilePlus, 
  FolderPlus, 
  Search, 
  Settings2, 
  X, 
  Filter,
  ShieldAlert,
  Trash,
  ChevronDown,
  ChevronRight,
  Edit2,
  ArrowUp,
  ArrowDown,
  FileText,
  Clock,
  Star,
  LayoutGrid,
  List,
  Type,
  Maximize2,
  Sparkles,
  Zap,
  MoreHorizontal,
  History,
  Tag,
  Palette,
  Timer,
  BookOpen,
  SplitSquareVertical,
  MousePointer2,
  Pen
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

type PaperStyle = 'legal-ruled' | 'cornell' | 'dot-grid' | 'graph' | 'blank' | 'yellow-legal';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  tags: string[];
  color: string;
  isFavorite: boolean;
  paperStyle: PaperStyle;
  billableMinutes: number;
}

interface Notebook {
  id: string;
  name: string;
  notes: Note[];
  isExpanded: boolean;
}

const PAPER_TEMPLATES: { id: PaperStyle; name: string; desc: string }[] = [
  { id: 'yellow-legal', name: 'Yellow Legal Pad', desc: '1.25" Margin, Lined' },
  { id: 'legal-ruled', name: 'White Legal Pad', desc: 'Standard Ruled' },
  { id: 'cornell', name: 'Cornell Method', desc: 'Structured Study' },
  { id: 'dot-grid', name: 'Dot Grid', desc: 'Flexible Bulleting' },
  { id: 'graph', name: 'Graph Paper', desc: 'Precision Charting' },
  { id: 'blank', name: 'Clean Slate', desc: 'No Distractions' },
];

const COLORS = [
  { name: 'Pure White', class: 'bg-white' },
  { name: 'Legal Yellow', class: 'bg-amber-50' },
  { name: 'Soft Blue', class: 'bg-blue-50' },
  { name: 'Pale Green', class: 'bg-emerald-50' },
  { name: 'Lavender', class: 'bg-purple-50' },
];

const DEFAULT_NOTE: Note = {
  id: 'welcome-note',
  title: 'My First Case Memo',
  content: 'WELCOME TO LEGALPH LEGAL PAD\n\nThis workspace is inspired by Goodnotes 6, designed specifically for legal practitioners and law students in the Philippines.\n\nFEATURES:\n1. 1.25" Margin: Essential for case annotations and court filings.\n2. Paper Templates: Choose from Cornell, Legal Ruled, or Graph paper.\n3. Billable Timer: Track your time spent on research directly in the pad.\n4. AI Summarizer: Click the Sparkles icon to synthesize your long notes.\n5. Organization: Drag and drop notes between notebooks.',
  updatedAt: Date.now(),
  tags: ['Onboarding', 'Tutorial'],
  color: 'bg-amber-50',
  isFavorite: true,
  paperStyle: 'yellow-legal',
  billableMinutes: 0
};

const DEFAULT_FOLDER: Notebook = {
  id: 'default',
  name: 'Main Repository',
  notes: [DEFAULT_NOTE],
  isExpanded: true
};

export const LegalPad: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>(() => {
    const saved = localStorage.getItem('legalph_notebooks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [DEFAULT_FOLDER];
      } catch (e) {
        return [DEFAULT_FOLDER];
      }
    }
    return [DEFAULT_FOLDER];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(notebooks[0]?.notes[0]?.id || null);
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(notebooks[0]?.id || null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('legalph_notebooks', JSON.stringify(notebooks));
  }, [notebooks]);

  // Billable Timer logic
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveTimerToNote = () => {
    if (!activeNoteId || !activeNotebookId) return;
    const additionalMinutes = Math.round(timerSeconds / 60);
    updateActiveNote('billableMinutes', (activeNote?.billableMinutes || 0) + additionalMinutes);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    alert(`Added ${additionalMinutes} minutes to billable time.`);
  };

  const handleAiSummary = async () => {
    if (!activeNote?.content) return;
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize this legal note and format it with clear bullet points. Keep it professional. Content: ${activeNote.content}`
      });
      const summary = response.text || "Could not generate summary.";
      updateActiveNote('content', `${activeNote.content}\n\n--- AI SUMMARY ---\n${summary}`);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const filteredNotebooks = useMemo(() => {
    if (!searchTerm) return notebooks;
    const term = searchTerm.toLowerCase();
    return notebooks.map(nb => {
      const filteredNotes = nb.notes.filter(n => 
        n.title.toLowerCase().includes(term) || 
        n.content.toLowerCase().includes(term) ||
        n.tags.some(t => t.toLowerCase().includes(term))
      );
      if (nb.name.toLowerCase().includes(term) || filteredNotes.length > 0) {
        return { ...nb, notes: filteredNotes, isExpanded: true };
      }
      return null;
    }).filter((nb): nb is Notebook => nb !== null);
  }, [notebooks, searchTerm]);

  const createNotebook = () => {
    const name = prompt("Enter Notebook/Folder Name:");
    if (!name) return;
    const newNb: Notebook = { id: Date.now().toString(), name, notes: [], isExpanded: true };
    setNotebooks([...notebooks, newNb]);
    setActiveNotebookId(newNb.id);
  };

  const deleteNotebook = (id: string) => {
    if (!confirm("Are you sure you want to delete this notebook and all its notes? This action cannot be undone.")) return;
    const updated = notebooks.filter(nb => nb.id !== id);
    setNotebooks(updated);
    if (activeNotebookId === id) {
      setActiveNotebookId(updated[0]?.id || null);
      setActiveNoteId(updated[0]?.notes[0]?.id || null);
    }
  };

  const createNote = () => {
    if (!activeNotebookId) {
      alert("Please select or create a notebook first.");
      return;
    }
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Memo',
      content: '',
      updatedAt: Date.now(),
      tags: [],
      color: 'bg-white',
      isFavorite: false,
      paperStyle: 'legal-ruled',
      billableMinutes: 0
    };
    setNotebooks(notebooks.map(nb => nb.id === activeNotebookId ? { ...nb, notes: [newNote, ...nb.notes] } : nb));
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (nbId: string, noteId: string) => {
    if (!confirm("Are you sure you want to delete this memo?")) return;
    const updated = notebooks.map(nb => {
      if (nb.id === nbId) {
        return { ...nb, notes: nb.notes.filter(n => n.id !== noteId) };
      }
      return nb;
    });
    setNotebooks(updated);
    if (activeNoteId === noteId) {
      const currentNb = updated.find(nb => nb.id === nbId);
      setActiveNoteId(currentNb?.notes[0]?.id || null);
    }
  };

  const updateActiveNote = (key: keyof Note, value: any) => {
    if (!activeNoteId || !activeNotebookId) return;
    setNotebooks(notebooks.map(nb => nb.id === activeNotebookId ? {
      ...nb,
      notes: nb.notes.map(n => n.id === activeNoteId ? { ...n, [key]: value, updatedAt: Date.now() } : n)
    } : nb));
  };

  const activeNotebook = notebooks.find(nb => nb.id === activeNotebookId);
  const activeNote = activeNotebook?.notes.find(n => n.id === activeNoteId);

  return (
    <div className="h-full flex flex-col md:flex-row gap-0 bg-[#f8f9fa] overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
      
      {/* Goodnotes Sidebar - The Shelf */}
      <div className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-50">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Workspace</h2>
              <div className="flex gap-1">
                 <button onClick={createNotebook} className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="New Notebook / Folder"><FolderPlus size={18}/></button>
                 <button onClick={createNote} disabled={!activeNotebookId} className="p-1.5 hover:bg-slate-100 rounded text-amber-600 disabled:opacity-30" title="New Page / Memo"><FilePlus size={18}/></button>
              </div>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search workspace..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500/20"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
           {/* Favorites Section */}
           <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block">Quick Access</span>
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                 <Star size={16} className="text-amber-500 fill-amber-500" />
                 <span>Starred Pages</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                 <History size={16} className="text-blue-500" />
                 <span>Recently Modified</span>
              </button>
           </div>

           <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Notebooks</span>
                <button onClick={createNotebook} className="text-slate-400 hover:text-amber-600 transition-colors">
                  <PlusSquareVertical size={12} />
                </button>
              </div>
              
              {filteredNotebooks.map((nb) => (
                <div key={nb.id} className="mb-1 group">
                   <div 
                     className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeNotebookId === nb.id ? 'bg-amber-50 text-amber-900' : 'text-slate-600 hover:bg-slate-50'}`}
                     onClick={() => setActiveNotebookId(nb.id)}
                   >
                     <div className="flex items-center gap-2 truncate">
                        {activeNotebookId === nb.id ? <BookOpen size={16}/> : <FileText size={16} className="opacity-40" />}
                        <span className="truncate">{nb.name}</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        {isDeleteMode ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteNotebook(nb.id); }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                            title="Delete Notebook"
                          >
                            <Trash2 size={12} />
                          </button>
                        ) : (
                          <span className="text-[10px] opacity-40 font-mono group-hover:hidden">{nb.notes.length}</span>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteNotebook(nb.id); }}
                          className="hidden group-hover:block p-1 text-slate-400 hover:text-red-500 rounded"
                          title="Delete Notebook"
                        >
                          <Trash2 size={12} />
                        </button>
                     </div>
                   </div>
                   
                   {activeNotebookId === nb.id && (
                     <div className="mt-1 ml-4 border-l border-slate-100 pl-2 space-y-1">
                        {nb.notes.map(note => (
                          <div 
                            key={note.id}
                            className={`w-full group/note flex items-center justify-between px-3 py-1.5 rounded-md text-[13px] transition-all cursor-pointer ${activeNoteId === note.id ? 'text-amber-600 font-bold bg-amber-50/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                            onClick={() => setActiveNoteId(note.id)}
                          >
                             <span className="truncate">{note.title || 'Untitled'}</span>
                             <button 
                               onClick={(e) => { e.stopPropagation(); deleteNote(nb.id, note.id); }}
                               className="hidden group-note/hover:block p-1 text-slate-300 hover:text-red-500 rounded"
                               title="Delete Memo"
                             >
                               <X size={10} />
                             </button>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
           <button onClick={() => setIsDeleteMode(!isDeleteMode)} className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${isDeleteMode ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}>
              <Trash2 size={14} />
              {isDeleteMode ? 'Exit Selection Mode' : 'Manage Items'}
           </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 flex flex-col relative bg-slate-200 overflow-hidden">
        {activeNote ? (
          <>
            {/* Context Toolbar */}
            <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
              <div className="flex items-center gap-4 flex-1">
                 <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <Pen size={18} />
                 </div>
                 <input 
                   type="text" 
                   value={activeNote.title}
                   onChange={(e) => updateActiveNote('title', e.target.value)}
                   className="bg-transparent text-lg font-black text-slate-800 outline-none w-full max-w-md"
                   placeholder="Document Title..."
                 />
              </div>

              <div className="flex items-center gap-2">
                 {/* Billable Timer Widget */}
                 <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-lg mr-2 transition-all hover:scale-105">
                    <Clock size={14} className={isTimerRunning ? "animate-pulse text-green-400" : ""} />
                    <span className="text-xs font-mono font-bold">{formatTimer(timerSeconds)}</span>
                    <div className="flex gap-1 border-l border-white/20 pl-2">
                       {!isTimerRunning ? (
                         <button onClick={() => setIsTimerRunning(true)} className="hover:text-green-400"><Zap size={14}/></button>
                       ) : (
                         <button onClick={() => setIsTimerRunning(false)} className="hover:text-amber-400"><MoreHorizontal size={14}/></button>
                       )}
                       {timerSeconds > 0 && <button onClick={saveTimerToNote} title="Log Minutes"><Save size={14}/></button>}
                    </div>
                 </div>

                 <div className="h-8 w-px bg-slate-200 mx-1"></div>

                 <button 
                   onClick={handleAiSummary}
                   disabled={aiLoading}
                   className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors disabled:opacity-50"
                   title="AI Summarize"
                 >
                    {aiLoading ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                 </button>
                 
                 <div className="relative group">
                    <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg"><LayoutGrid size={20}/></button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-1 block">Paper Style</span>
                       {PAPER_TEMPLATES.map(t => (
                         <button 
                           key={t.id}
                           onClick={() => updateActiveNote('paperStyle', t.id)}
                           className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${activeNote.paperStyle === t.id ? 'bg-amber-50 text-amber-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                         >
                            {t.name}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            {/* Main Reading/Writing Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 flex justify-center custom-scrollbar">
               {/* THE PAGE */}
               <div className={`
                 w-full max-w-[8.5in] min-h-[11in] shadow-2xl rounded-sm transition-all duration-500 relative flex flex-col
                 ${activeNote.paperStyle === 'yellow-legal' ? 'bg-[#fffae0]' : 'bg-white'}
                 ${activeNote.paperStyle === 'cornell' ? 'paper-cornell' : ''}
               `}>
                  {/* CSS Patterns for paper styles */}
                  <style>{`
                    .paper-content {
                      line-height: 2rem;
                      font-size: 1.1rem;
                      background-attachment: local;
                      padding-top: 1rem;
                    }
                    /* Standard Legal Margin: 1.25 inch = ~120px */
                    .margin-line {
                      position: absolute;
                      left: 120px;
                      top: 0;
                      bottom: 0;
                      width: 2px;
                      background-color: rgba(220, 38, 38, 0.4);
                      z-index: 10;
                    }
                    .ruled-lines {
                      background-image: linear-gradient(transparent 96%, rgba(59, 130, 246, 0.1) 96%);
                      background-size: 100% 2rem;
                    }
                    .dot-grid {
                      background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
                      background-size: 2rem 2rem;
                    }
                    .graph-paper {
                      background-image: linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
                      background-size: 2rem 2rem;
                    }
                  `}</style>

                  <div className="margin-line"></div>
                  
                  {/* Billable info footer on paper */}
                  <div className="absolute top-4 right-6 text-[10px] font-mono text-slate-400 pointer-events-none uppercase">
                     ID: {activeNote.id} | Billable: {activeNote.billableMinutes}m
                  </div>

                  <textarea 
                    value={activeNote.content}
                    onChange={(e) => updateActiveNote('content', e.target.value)}
                    className={`
                      flex-1 w-full p-10 pl-[140px] pr-10 outline-none resize-none bg-transparent font-serif text-slate-800 paper-content
                      ${activeNote.paperStyle === 'legal-ruled' || activeNote.paperStyle === 'yellow-legal' ? 'ruled-lines' : ''}
                      ${activeNote.paperStyle === 'dot-grid' ? 'dot-grid' : ''}
                      ${activeNote.paperStyle === 'graph' ? 'graph-paper' : ''}
                    `}
                    placeholder="Commence legal drafting or research annotation..."
                  />

                  <div className="h-20 bg-transparent border-t border-slate-100/50 flex items-center justify-center pointer-events-none">
                     <span className="text-[10px] text-slate-300 font-serif italic tracking-widest">*** End of Page ***</span>
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white">
             <div className="w-48 h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center mb-8 relative">
                <FileText size={64} className="opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-12 h-1 bg-amber-500 rounded-full animate-pulse" />
                </div>
             </div>
             <h3 className="text-2xl font-serif font-black text-slate-800 mb-2">Workspace Empty</h3>
             <p className="max-w-xs text-center text-sm font-medium leading-relaxed mb-8">
               Select a notebook from the workspace shelf or create a new case memo to begin your session.
             </p>
             <button onClick={createNotebook} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95">
                <FolderPlus size={18} /> Open New Notebook
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Utility components/icons for new features
const PlusSquareVertical = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M12 8v8" /><path d="M8 12h8" />
  </svg>
);

const Loader2 = ({ className, size }: { className?: string; size?: number }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
