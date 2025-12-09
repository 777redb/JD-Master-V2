import React, { useState, useEffect } from 'react';
import { Save, Trash2, FilePlus, FolderPlus, Folder, FolderOpen, Tag, MoveVertical, FolderInput, Palette, GripVertical } from 'lucide-react';

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

export const LegalPad: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ type: 'note' | 'folder', id: string, sourceFolderId?: string, index?: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('legalph_folders');
    if (saved) {
      setFolders(JSON.parse(saved));
    } else {
      // Init with default folder
      const defaultFolder: Folder = {
        id: 'default',
        name: 'General Notes',
        notes: [{
          id: Date.now().toString(),
          title: 'Welcome to LegalPad',
          content: 'This is your advanced legal workspace. Create folders, tag documents, and organize your research.',
          updatedAt: Date.now(),
          tags: ['Welcome'],
          color: 'bg-white'
        }],
        isExpanded: true
      };
      setFolders([defaultFolder]);
      setActiveFolderId('default');
      setActiveNoteId(defaultFolder.notes[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('legalph_folders', JSON.stringify(folders));
  }, [folders]);

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
  };

  const deleteNote = (noteId: string, folderId: string) => {
    if (!confirm('Delete this note?')) return;
    setFolders(folders.map(f => {
      if (f.id === folderId) {
        const newNotes = f.notes.filter(n => n.id !== noteId);
        return { ...f, notes: newNotes };
      }
      return f;
    }));
    if (activeNoteId === noteId) setActiveNoteId(null);
  };

  const deleteFolder = (folderId: string) => {
    if (!confirm('Delete this folder and all its notes?')) return;
    setFolders(folders.filter(f => f.id !== folderId));
    if (activeFolderId === folderId) {
      setActiveFolderId(null);
      setActiveNoteId(null);
    }
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

  const moveFolder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === folders.length - 1) return;
    
    const newFolders = [...folders];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFolders[index], newFolders[targetIndex]] = [newFolders[targetIndex], newFolders[index]];
    setFolders(newFolders);
  };

  const toggleFolder = (id: string) => {
    setFolders(folders.map(f => f.id === id ? { ...f, isExpanded: !f.isExpanded } : f));
  };

  // Drag and Drop Logic for Notes and Folders
  const handleNoteDragStart = (e: React.DragEvent, noteId: string, folderId: string) => {
    e.stopPropagation();
    setDraggedItem({ type: 'note', id: noteId, sourceFolderId: folderId });
    e.dataTransfer.setData('type', 'note');
  };

  const handleFolderDragStart = (e: React.DragEvent, folderIndex: number) => {
    setDraggedItem({ type: 'folder', id: folders[folderIndex].id, index: folderIndex });
    e.dataTransfer.setData('type', 'folder');
  };

  const handleDropOnFolder = (e: React.DragEvent, targetFolderId: string, targetFolderIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Handle Note Drop
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
    // Handle Folder Drop (Reorder)
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const mergeFolder = (sourceId: string) => {
    const targetName = prompt("Enter exact name of folder to merge into:");
    const targetFolder = folders.find(f => f.name === targetName && f.id !== sourceId);
    
    if (targetFolder) {
      const sourceFolder = folders.find(f => f.id === sourceId);
      if (!sourceFolder) return;
      
      setFolders(folders.map(f => {
        if (f.id === targetFolder.id) {
          return { ...f, notes: [...f.notes, ...sourceFolder.notes] };
        }
        return f;
      }).filter(f => f.id !== sourceId)); // Remove source
      
      if (activeFolderId === sourceId) setActiveFolderId(targetFolder.id);
    } else {
      alert("Target folder not found.");
    }
  };

  const activeFolder = folders.find(f => f.id === activeFolderId);
  const activeNote = activeFolder?.notes.find(n => n.id === activeNoteId);

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-serif font-bold text-slate-900">Legal Pad</h2>
          <div className="flex gap-2">
             <button onClick={createFolder} className="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200" title="New Folder">
              <FolderPlus size={18} />
            </button>
            <button onClick={createNote} disabled={!activeFolderId} className="p-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 shadow-sm" title="New Note">
              <FilePlus size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
          {folders.length === 0 && <p className="text-center text-slate-400 text-sm py-8 font-serif">No folders. Create one to start.</p>}
          {folders.map((folder, index) => (
            <div 
              key={folder.id} 
              draggable
              onDragStart={(e) => handleFolderDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnFolder(e, folder.id, index)}
              className="rounded-lg border border-slate-100 overflow-hidden cursor-move"
            >
              <div className={`p-3 flex items-center justify-between transition-colors ${activeFolderId === folder.id ? 'bg-amber-50/60' : 'bg-slate-50 hover:bg-slate-100'}`}>
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent drag triggering select sometimes if buggy
                    setActiveFolderId(folder.id);
                    toggleFolder(folder.id);
                  }}
                >
                  <GripVertical size={14} className="text-slate-300 cursor-grab" />
                  {folder.isExpanded ? <FolderOpen size={18} className="text-amber-600"/> : <Folder size={18} className="text-slate-400"/>}
                  <span className={`font-serif font-bold text-sm truncate ${activeFolderId === folder.id ? 'text-amber-900' : 'text-slate-700'}`}>{folder.name}</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100">
                  <button onClick={() => moveFolder(index, 'up')} className="text-slate-400 hover:text-slate-700"><MoveVertical size={14} /></button>
                  <button onClick={() => mergeFolder(folder.id)} className="text-slate-400 hover:text-blue-600" title="Merge"><FolderInput size={14} /></button>
                  <button onClick={() => deleteFolder(folder.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>

              {folder.isExpanded && (
                <div className="bg-white pl-4 cursor-default border-t border-slate-50" onDragStart={(e) => e.stopPropagation()}>
                  {folder.notes.map(note => (
                    <div
                      key={note.id}
                      draggable
                      onDragStart={(e) => handleNoteDragStart(e, note.id, folder.id)}
                      onClick={(e) => {
                         e.stopPropagation();
                         setActiveFolderId(folder.id);
                         setActiveNoteId(note.id);
                      }}
                      className={`p-3 pl-4 cursor-pointer border-l-4 transition-all flex justify-between group
                        ${activeNoteId === note.id ? 'border-amber-500 bg-amber-50' : 'border-transparent hover:bg-slate-50'}
                      `}
                    >
                      <div className="overflow-hidden">
                        <div className={`text-sm font-serif ${activeNoteId === note.id ? 'font-bold text-slate-900' : 'text-slate-600'} truncate`}>{note.title}</div>
                        <div className="flex gap-1.5 mt-1.5">
                           {note.tags.map(t => <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">{t}</span>)}
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id, folder.id); }}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {folder.notes.length === 0 && <div className="p-3 pl-8 text-xs text-slate-400 italic">Empty folder</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className={`flex-1 rounded-xl border shadow-sm flex flex-col p-8 md:p-12 relative transition-colors ${activeNote ? activeNote.color : 'bg-slate-50 border-slate-200'}`}>
        {activeNote ? (
          <>
            <div className="flex justify-between items-start border-b border-black/10 pb-4 mb-6">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateActiveNote('title', e.target.value)}
                className="bg-transparent text-3xl font-serif font-bold text-slate-900 focus:outline-none w-full mr-6 placeholder-slate-300"
                placeholder="Note Title"
              />
              <div className="flex items-center gap-3">
                {/* Color Picker */}
                <div className="relative group">
                  <button className="p-2 hover:bg-black/5 rounded-full transition-colors"><Palette size={18} className="text-slate-500"/></button>
                  <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl p-3 hidden group-hover:flex gap-2 z-10">
                    {COLORS.map(c => (
                      <button 
                        key={c.name} 
                        className={`w-6 h-6 rounded-full border border-slate-200 ${c.class} hover:scale-110 transition-transform`}
                        onClick={() => updateActiveNote('color', c.class)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-white/50 px-2 py-1 rounded uppercase tracking-wide">
                  <Save size={12} /> Saved
                </div>
              </div>
            </div>

            {/* Tags Input */}
            <div className="flex items-center gap-3 mb-8">
              <Tag size={16} className="text-slate-400" />
              <input 
                type="text"
                placeholder="Add tags (comma separated)..."
                className="bg-transparent text-sm text-slate-600 focus:outline-none w-full font-medium"
                value={activeNote.tags.join(', ')}
                onChange={(e) => updateActiveNote('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              />
            </div>

            <textarea
              value={activeNote.content}
              onChange={(e) => updateActiveNote('content', e.target.value)}
              className="flex-1 bg-transparent resize-none focus:outline-none text-slate-800 leading-loose font-serif text-lg"
              placeholder="Start typing your legal notes here..."
              style={{ backgroundImage: 'linear-gradient(transparent 96%, rgba(0,0,0,0.06) 96%)', backgroundSize: '100% 2.25rem', lineHeight: '2.25rem' }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col">
            <FolderOpen size={64} className="opacity-20 mb-6" />
            <p className="text-xl font-serif text-slate-400">Select a note or create a new one to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};