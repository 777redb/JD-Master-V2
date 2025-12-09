import React, { useState } from 'react';
import { generateCaseDigest } from '../services/gemini';
import { FileText, Wand2, Eraser, Copy } from 'lucide-react';

export const CaseDigest: React.FC = () => {
  const [input, setInput] = useState('');
  const [digest, setDigest] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDigest = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setDigest('');
    try {
      const result = await generateCaseDigest(input);
      setDigest(result);
    } catch (e) {
      setDigest("<p>Failed to generate digest. Please try again.</p>");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    // Strip HTML for clipboard
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = digest;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-8">
      {/* Input Section */}
      <div className="flex-1 flex flex-col min-h-[300px]">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-slate-900">Case Digest</h2>
          <p className="text-slate-500">Auto-generate strict legal digests (Facts, Issue, Ruling, Doctrine).</p>
        </div>
        
        <div className="flex-1 relative flex flex-col">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste the full text of a Supreme Court decision here, or simply type the G.R. Number / Case Name (e.g., 'Chi Ming Tsoi v. CA')..."
            className="flex-1 w-full p-6 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none bg-white shadow-sm font-serif text-base text-slate-700 leading-relaxed"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setInput('')}
              className="p-3 text-slate-500 hover:text-red-500 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all"
              title="Clear"
            >
              <Eraser size={20} />
            </button>
            <button
              onClick={handleDigest}
              disabled={isProcessing || !input}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg shadow-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all hover:shadow-lg"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Wand2 size={20} /> Generate Digest
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="flex-1 flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full">
        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center px-6 py-5">
          <span className="font-bold text-slate-800 flex items-center gap-3 text-lg font-serif">
            <FileText size={20} className="text-amber-600" />
            Generated Digest
          </span>
          {digest && (
            <button 
              onClick={handleCopy}
              className="text-sm text-slate-500 hover:text-amber-600 flex items-center gap-2 font-medium transition-colors"
            >
              <Copy size={16} /> Copy
            </button>
          )}
        </div>
        
        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white">
          {digest ? (
            <div className="prose prose-slate prose-lg max-w-none 
                prose-h3:font-serif prose-h3:font-bold prose-h3:text-2xl prose-h3:text-center prose-h3:text-slate-900 prose-h3:uppercase prose-h3:tracking-wide prose-h3:mb-8
                prose-h4:font-serif prose-h4:font-bold prose-h4:text-lg prose-h4:text-slate-800 prose-h4:mt-8 prose-h4:mb-3 prose-h4:uppercase prose-h4:tracking-wider
                prose-p:text-slate-700 prose-p:leading-loose prose-p:text-justify prose-p:font-serif
                prose-strong:text-slate-900 prose-strong:font-bold">
              <div dangerouslySetInnerHTML={{ __html: digest }} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                <FileText size={40} className="opacity-30" />
              </div>
              <p className="font-serif text-lg text-slate-400">Standard digest output will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};