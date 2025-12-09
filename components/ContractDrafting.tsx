import React, { useState } from 'react';
import { CONTRACT_TEMPLATES } from '../constants';
import { ContractTemplate } from '../types';
import { generateContract } from '../services/gemini';
import { PenTool, ScrollText, Wand2, Loader2, Copy, FileText } from 'lucide-react';

export const ContractDrafting: React.FC = () => {
  const [mode, setMode] = useState<'TEMPLATE' | 'CUSTOM'>('TEMPLATE');
  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [customPrompt, setCustomPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (e) {
      setDraft("<p>Error generating contract.</p>");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    // Strip HTML for copy
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = draft;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(text);
    alert('Contract copied to clipboard!');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <PenTool className="text-amber-600" />
          Contract Drafting
        </h2>
        <p className="text-slate-500">Generate valid, high-quality Philippine legal documents.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full min-h-0">
        {/* Controls Section */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto">
          
          {/* Mode Toggle */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex mb-2 shadow-inner">
            <button
              onClick={() => setMode('TEMPLATE')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                mode === 'TEMPLATE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Standard Templates
            </button>
            <button
              onClick={() => setMode('CUSTOM')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                mode === 'CUSTOM' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              AI Custom Draft
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5">
            {mode === 'TEMPLATE' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Select Template</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium text-slate-700"
                    onChange={(e) => {
                      const t = CONTRACT_TEMPLATES.find(ct => ct.id === e.target.value);
                      setTemplate(t || null);
                      setFormData({});
                      setDraft('');
                    }}
                    value={template?.id || ''}
                  >
                    <option value="">-- Choose Template --</option>
                    {CONTRACT_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                {template && (
                  <div className="space-y-4 animate-in slide-in-from-left-2 fade-in">
                    <p className="text-sm text-slate-600 italic border-b border-slate-100 pb-3">{template.description}</p>
                    {template.fields.map(field => (
                      <div key={field}>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block">{field}</label>
                        <input 
                          className="w-full bg-white border border-slate-300 rounded-lg p-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-slate-800 text-sm"
                          onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col h-full animate-in slide-in-from-right-2 fade-in">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                  Describe the Agreement
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full h-80 p-4 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-none mb-3 leading-relaxed"
                  placeholder="E.g., I need a contract for a freelance graphic designer named John Doe. The client is XYZ Corp. The fee is 50k PHP, payable 50% downpayment. Include a confidentiality clause and 1-year non-compete..."
                />
                <p className="text-xs text-slate-400">
                  Be specific about parties, obligations, payments, and special conditions.
                </p>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading || (mode === 'TEMPLATE' && !template) || (mode === 'CUSTOM' && !customPrompt)}
              className="mt-4 w-full bg-amber-600 text-white py-3.5 rounded-lg font-bold hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20}/> : <><Wand2 size={20}/> Generate Contract</>}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <ScrollText size={18} className="text-amber-600"/>
              Draft Preview
            </span>
            {draft && (
              <button onClick={handleCopy} className="text-xs text-slate-600 hover:text-amber-600 flex items-center gap-2 font-bold uppercase tracking-wide">
                <Copy size={14}/> Copy Text
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-12 bg-white">
            {draft ? (
              <div className="prose prose-slate prose-lg max-w-none 
                prose-h3:text-center prose-h3:text-slate-900 prose-h3:font-bold prose-h3:uppercase prose-h3:tracking-wide prose-h3:mb-8
                prose-h4:text-slate-800 prose-h4:font-bold prose-h4:mt-6 prose-h4:mb-3
                prose-p:leading-loose prose-p:text-justify prose-p:text-slate-900 prose-p:font-serif
                prose-li:text-slate-900 prose-li:font-serif
              ">
                <div dangerouslySetInnerHTML={{ __html: draft }} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                  <FileText size={48} className="opacity-20" />
                </div>
                <p className="max-w-xs text-center font-serif text-lg text-slate-500">
                  Select a template or describe your needs to generate a legally compliant contract draft.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};