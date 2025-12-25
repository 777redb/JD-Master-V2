
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Save, 
  Trash2, 
  FilePlus, 
  FolderPlus, 
  Folder, 
  FolderOpen, 
  Tag, 
  Palette, 
  GripVertical, 
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
  MoreVertical,
  FileText
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  tags: string[];
  color: string; // Tailwind bg class
}

interface Folder {
  id: string;
  name: string;
  notes: Note[];
  isExpanded: boolean;
}

const COLORS = [
  { name: 'Default', class: 'bg-white' },
  { name: 'Red', class: 'bg-red-50' },
  { name: 'Amber', class: 'bg-amber-50' },
  { name: 'Green', class: 'bg-green-50' },
  { name: 'Blue', class: 'bg-blue-50' },
  { name: 'Purple', class: 'bg-purple-50' },
];

const DEFAULT_NOTE: Note = {
  id: 'welcome-note',
  title: 'Welcome to LegalPad',
  content: 'This is your advanced legal workspace. Create folders, tag documents, and organize your research.\n\nUse the sidebar controls to manage your files. You can rename folders and notes, move them up or down to set priority, and delete them when they are no longer needed.',
  updatedAt: Date.now(),
  tags: ['Welcome'],
  color: 'bg-white'
};

const DEFAULT_FOLDER: Folder = {
  id: 'default',
  name: 'General Notes',
  notes: [DEFAULT_NOTE],
  isExpanded: true
};

export const LegalPad: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('legalph_folders');
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

  const [activeNoteId, setActiveNoteId] = useState<string | null>(folders[0]?.notes[0]?.id || null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(folders[0]?.id || null);
  const [draggedItem, setDraggedItem] = useState<{ type: 'note' | 'folder', id: string, sourceFolderId?: string, index?: number } | null>(null);
  
  // Management State
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('legalph_folders', JSON.stringify(folders));
  }, [folders]);

  // Filtering Logic
  const filteredFolders = useMemo(() => {
    if (!searchTerm) return folders;
    const term = searchTerm.toLowerCase();
    return folders.map(folder => {
      const filteredNotes = folder.notes.filter(note => 
        note.title.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term) ||
        note.tags.some(t => t.toLowerCase().includes(term))
      );
      
      const folderMatches = folder.name.toLowerCase().includes(term);
      
      if (folderMatches || filteredNotes.length > 0) {
        return { 
          ...folder, 
          notes: folderMatches ? folder.notes : filteredNotes,
          isExpanded: true 
        };
      }
      return null;
    }).filter((f): f is Folder => f !== null);
  }, [folders, searchTerm]);

  const createFolder = () => {
    const name = prompt("Enter folder name:", "New Project");
    if (!name) return;
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      notes: [],
      isExpanded: true
    };
    setFolders([...folders, newFolder]);
    setActiveFolderId(newFolder.id);
  };

  const createNote = () => {
    if (!activeFolderId) return;
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: Date.now(),
      tags: [],
      color: 'bg-white'
    };
    
    setFolders(folders.map(f => {
      if (f.id === activeFolderId) {
        return { ...f, notes: [newNote, ...f.notes] };
      }
      return f;
    }));
    setActiveNoteId(newNote.id);
    setIsDeleteMode(false);
  };

  const deleteNote = (noteId: string, folderId: string) => {
    if (!confirm('Permanently delete this note?')) return;
    setFolders(folders.map(f => {
      if (f.id === folderId) {
        return { ...f, notes: f.notes.filter(n => n.id !== noteId) };
      }
      return f;
    }));
    if (activeNoteId === noteId) setActiveNoteId(null);
  };

  const deleteFolder = (folderId: string) => {
    if (!confirm('Delete this folder and all its notes? This cannot be undone.')) return;
    setFolders(folders.filter(f => f.id !== folderId));
    if (activeFolderId === folderId) {
      setActiveFolderId(null);
      setActiveNoteId(null);
    }
  };

  const renameFolder = (folderId: string, currentName: string) => {
    const newName = prompt("Rename folder:", currentName);
    if (!newName || newName === currentName) return;
    setFolders(folders.map(f => f.id === folderId ? { ...f, name: newName } : f));
  };

  const renameNote = (folderId: string, noteId: string, currentTitle: string) => {
    const newTitle = prompt("Rename note:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
    setFolders(folders.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          notes: f.notes.map(n => n.id === noteId ? { ...n, title: newTitle } : n)
        };
      }
      return f;
    }));
  };

  const moveFolder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === folders.length - 1) return;
    
    const newFolders = [...folders];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFolders[index], newFolders[targetIndex]] = [newFolders[targetIndex], newFolders[index]];
    setFolders(newFolders);
  };

  const updateActiveNote = (key: keyof Note, value: any) => {
    if (!activeNoteId || !activeFolderId) return;
    setFolders(folders.map(f => {
      if (f.id === activeFolderId) {
        return {
          ...f,
          notes: f.notes.map(n => n.id === activeNoteId ? { ...n, [key]: value, updatedAt: Date.now() } : n)
        };
      }
      return f;
    }));
  };

  const toggleFolder = (id: string) => {
    setFolders(folders.map(f => f.id === id ? { ...f, isExpanded: !f.isExpanded } : f));
  };

  const handleNoteDragStart = (e: React.DragEvent, noteId: string, folderId: string) => {
    if (isDeleteMode) return; 
    e.stopPropagation();
    setDraggedItem({ type: 'note', id: noteId, sourceFolderId: folderId });
    e.dataTransfer.setData('type', 'note');
  };

  const handleFolderDragStart = (e: React.DragEvent, folderIndex: number) => {
    if (isDeleteMode) return;
    setDraggedItem({ type: 'folder', id: folders[folderIndex].id, index: folderIndex });
    e.dataTransfer.setData('type', 'folder');
  };

  const handleDropOnFolder = (e: React.DragEvent, targetFolderId: string, targetFolderIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === 'note') {
      const { id: noteId, sourceFolderId } = draggedItem;
      if (!sourceFolderId || sourceFolderId === targetFolderId) return;

      const sourceFolder = folders.find(f => f.id === sourceFolderId);
      const noteToMove = sourceFolder?.notes.find(n => n.id === noteId);

      if (noteToMove) {
        setFolders(folders.map(f => {
          if (f.id === sourceFolderId) {
            return { ...f, notes: f.notes.filter(n => n.id !== noteId) };
          }
          if (f.id === targetFolderId) {
            return { ...f, notes: [noteToMove, ...f.notes] };
          }
          return f;
        }));
        if (activeNoteId === noteId) setActiveFolderId(targetFolderId);
      }
    } 
    else if (draggedItem.type === 'folder') {
      const { index: sourceIndex } = draggedItem;
      if (sourceIndex === undefined || sourceIndex === targetFolderIndex) return;

      const newFolders = [...folders];
      const [movedFolder] = newFolders.splice(sourceIndex, 1);
      newFolders.splice(targetFolderIndex, 0, movedFolder);
      setFolders(newFolders);
    }
    
    setDraggedItem(null);
  };

  const activeFolder = folders.find(f => f.id === activeFolderId);
  const activeNote = activeFolder?.notes.find(n => n.id === activeNoteId);

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Sidebar Management */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-serif font-bold text-slate-900">Legal Pad</h2>
          <div className="flex gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowSettingsPopover(!showSettingsPopover)}
                className={`p-2.5 rounded-lg transition-all ${showSettingsPopover ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                title="Sidebar Settings"
              >
                <Settings2 size={18} />
              </button>
              
              {showSettingsPopover && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace Management</span>
                      <button onClick={() => setShowSettingsPopover(false)}><X size={14} className="text-slate-400" /></button>
                   </div>
                   
                   <div className="space-y-3">
                      <button 
                        onClick={() => { setIsDeleteMode(!isDeleteMode); setShowSettingsPopover(false); }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-all
                          ${isDeleteMode ? 'bg-red-600 text-white border border-red-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'}
                        `}
                      >
                         <div className="flex items-center gap-2">
                            <ShieldAlert size={14} />
                            <span>{isDeleteMode ? 'Deactivate Delete' : 'Activate Delete'}</span>
                         </div>
                         <div className={`w-8 h-4 rounded-full relative transition-colors ${isDeleteMode ? 'bg-white/20' : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isDeleteMode ? 'right-0.5' : 'left-0.5'}`} />
                         </div>
                      </button>
                      
                      <button 
                        onClick={() => { 
                          if(confirm('Wipe all Legal Pad data and reset to welcome note?')) { 
                            setFolders([DEFAULT_FOLDER]); 
                            setActiveFolderId('default');
                            setActiveNoteId('welcome-note');
                          } 
                          setShowSettingsPopover(false); 
                        }}
                        className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                      >
                         <Trash size={14} />
                         <span>Reset Workspace</span>
                      </button>
                   </div>
                </div>
              )}
            </div>
            <button onClick={createFolder} className="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200" title="New Folder">
              <FolderPlus size={18} />
            </button>
            <button onClick={createNote} disabled={!activeFolderId} className="p-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 shadow-sm" title="New Note">
              <FilePlus size={18} />
            </button>
          </div>
        </div>

        {/* Filter & List Area */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-0">
          <div className="p-3 bg-slate-50/50 border-b border-slate-100">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search notes or tags..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-inner"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={14} />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 p-2 custom-scrollbar">
            {isDeleteMode && (
              <div className="mx-1 mb-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <ShieldAlert size={12} className="animate-pulse" />
                    Delete Mode Active
                 </div>
                 <button onClick={() => setIsDeleteMode(false)} className="hover:underline">Exit</button>
              </div>
            )}
            
            {filteredFolders.length === 0 && (
              <div className="text-center py-12 px-4">
                 <Filter size={32} className="mx-auto text-slate-200 mb-3" />
                 <p className="text-slate-400 text-xs font-serif italic">No entries found.</p>
                 {searchTerm && <button onClick={() => setSearchTerm('')} className="mt-2 text-amber-600 font-bold text-[10px] uppercase hover:underline">Show All</button>}
              </div>
            )}

            {filteredFolders.map((folder, folderIdx) => (
              <div 
                key={folder.id} 
                draggable={!isDeleteMode}
                onDragStart={(e) => handleFolderDragStart(e, folderIdx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnFolder(e, folder.id, folderIdx)}
                className={`rounded-lg border border-slate-100 mb-1 overflow-hidden transition-all ${!isDeleteMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                {/* Folder Header */}
                <div className={`p-2.5 flex items-center justify-between group transition-colors ${activeFolderId === folder.id ? 'bg-amber-50/70' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div 
                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                    onClick={() => {
                      setActiveFolderId(folder.id);
                      toggleFolder(folder.id);
                    }}
                  >
                    {!isDeleteMode && <GripVertical size={12} className="text-slate-300 shrink-0" />}
                    {folder.isExpanded ? <ChevronDown size={14} className="text-amber-600 shrink-0"/> : <ChevronRight size={14} className="text-slate-400 shrink-0"/>}
                    <span className={`font-serif font-bold text-xs truncate ${activeFolderId === folder.id ? 'text-amber-900' : 'text-slate-700'}`}>{folder.name}</span>
                  </div>
                  
                  {/* Folder Management Controls */}
                  <div className="flex items-center gap-0.5">
                    {isDeleteMode ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }} 
                        className="p-1.5 text-red-500 hover:text-white hover:bg-red-600 rounded transition-all shadow-sm" 
                        title="Delete Folder"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); moveFolder(folderIdx, 'up'); }} 
                          disabled={folderIdx === 0}
                          className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30" 
                          title="Move Priority Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); moveFolder(folderIdx, 'down'); }} 
                          disabled={folderIdx === folders.length - 1}
                          className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30" 
                          title="Move Priority Down"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); renameFolder(folder.id, folder.name); }} 
                          className="p-1 text-slate-400 hover:text-blue-600" 
                          title="Rename Folder"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Collapsible Content: Notes */}
                {folder.isExpanded && (
                  <div className="bg-white border-t border-slate-50">
                    {folder.notes.map(note => (
                      <div
                        key={note.id}
                        draggable={!isDeleteMode}
                        onDragStart={(e) => handleNoteDragStart(e, note.id, folder.id)}
                        onClick={() => {
                           setActiveFolderId(folder.id);
                           setActiveNoteId(note.id);
                        }}
                        className={`p-3 pl-8 cursor-pointer border-l-4 transition-all flex justify-between group
                          ${activeNoteId === note.id ? 'border-amber-500 bg-amber-50/30' : 'border-transparent hover:bg-slate-50'}
                        `}
                      >
                        <div className="overflow-hidden flex-1">
                          <div className={`text-[13px] font-serif ${activeNoteId === note.id ? 'font-bold text-slate-900' : 'text-slate-600'} truncate`}>{note.title || 'Untitled Note'}</div>
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                               {note.tags.slice(0, 1).map(t => <span key={t} className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0 rounded font-bold uppercase tracking-tighter">{t}</span>)}
                               {note.tags.length > 1 && <span className="text-[8px] text-slate-400 font-bold">+{note.tags.length - 1}</span>}
                            </div>
                          )}
                        </div>
                        
                        {/* Note Management Controls */}
                        <div className="flex items-center shrink-0 ml-2">
                          <div className="flex items-center gap-1">
                            {isDeleteMode ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteNote(note.id, folder.id); }}
                                className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded transition-all"
                                title="Delete Note"
                              >
                                <Trash2 size={12} />
                              </button>
                            ) : (
                              <>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); renameNote(folder.id, note.id, note.title); }}
                                  className="p-1 text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Rename Note"
                                >
                                  <Edit2 size={11} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id, folder.id); }}
                                  className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete Note"
                                >
                                  <Trash2 size={11} />
                                </button>
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeNoteId === note.id ? 'bg-amber-500 shadow-sm' : 'bg-transparent'}`} />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {folder.notes.length === 0 && (
                      <div className="p-3 text-[10px] text-slate-400 italic text-center">Empty Folder</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className={`flex-1 rounded-2xl border shadow-sm flex flex-col p-8 md:p-12 relative transition-all duration-300 ${activeNote ? activeNote.color : 'bg-slate-50 border-slate-200'}`}>
        {activeNote ? (
          <>
            <div className="flex justify-between items-start border-b border-black/10 pb-6 mb-8">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateActiveNote('title', e.target.value)}
                className="bg-transparent text-3xl font-serif font-bold text-slate-900 focus:outline-none w-full mr-6 placeholder-slate-300"
                placeholder="Note Title"
              />
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <button className="p-2.5 hover:bg-black/5 rounded-full transition-colors border border-transparent hover:border-black/5"><Palette size={20} className="text-slate-500"/></button>
                  <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 hidden group-hover:flex gap-2 z-10 animate-in fade-in slide-in-from-top-1">
                    {COLORS.map(c => (
                      <button 
                        key={c.name} 
                        className={`w-7 h-7 rounded-full border-2 ${c.class} hover:scale-110 transition-transform ${activeNote.color === c.class ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'}`}
                        onClick={() => updateActiveNote('color', c.class)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  <Save size={14} className="text-green-600" /> Auto-Saved
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-8 bg-black/5 p-3 rounded-xl border border-black/5 shadow-inner">
              <Tag size={16} className="text-slate-500" />
              <input 
                type="text"
                placeholder="Tags (separated by commas)..."
                className="bg-transparent text-sm text-slate-700 focus:outline-none w-full font-bold placeholder-slate-400"
                value={activeNote.tags.join(', ')}
                onChange={(e) => updateActiveNote('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              />
            </div>

            <textarea
              value={activeNote.content}
              onChange={(e) => updateActiveNote('content', e.target.value)}
              className="flex-1 bg-transparent resize-none focus:outline-none text-slate-900 leading-loose font-serif text-xl"
              placeholder="Start drafting your legal memo or research notes here..."
              style={{ 
                backgroundImage: 'linear-gradient(transparent 96%, rgba(0,0,0,0.06) 96%)', 
                backgroundSize: '100% 2.5rem', 
                lineHeight: '2.5rem',
                paddingTop: '0.25rem'
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col animate-in fade-in duration-700">
            <div className="relative mb-8">
               <FolderOpen size={80} className="opacity-10" />
               <Search size={32} className="absolute inset-0 m-auto text-amber-500/30" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-400 mb-2">Legal Repository Offline</h3>
            <p className="max-w-xs text-center text-sm font-medium leading-relaxed">Select a research note from the repository or create a new case folder to begin your drafting session.</p>
            <button onClick={createFolder} className="mt-8 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
               <FolderPlus size={18} /> Create Case Folder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
