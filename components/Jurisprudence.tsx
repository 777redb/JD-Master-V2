import React, { useState } from 'react';
import { generateGeneralLegalAdvice } from '../services/gemini';
import { Scale, Search, Loader2, Gavel } from 'lucide-react';

export const Jurisprudence: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResult('');
    
    try {
      const prompt = `Search for Philippine Supreme Court Decisions/Jurisprudence regarding: "${query}". 
      
      STRICT OUTPUT FORMAT (HTML):
      - <h3>Case Title</h3>
      - <p><strong>G.R. Number, Date, and Ponente</strong></p>
      - <h4>Doctrine</h4>
      - <p>Brief Facts...</p>
      - <h4>Ruling</h4>
      - <p>Ruling details...</p>
      
      WARNING: Do not invent cases. If no direct case is found for the specific query, state "No direct case found" and provide general legal principles based on statutes instead.`;
      
      const res = await generateGeneralLegalAdvice(prompt);
      setResult(res);
    } catch (err) {
      setResult("<p>Error retrieving jurisprudence.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
          <Scale className="text-amber-600" size={32} />
          Jurisprudence Explorer
        </h2>
        <p className="text-slate-600 mt-2 text-lg">Search Supreme Court decisions, precedents, and doctrines.</p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Topic, Doctrine, or Case Name (e.g., 'Doctrine of Separate Juridical Personality')..."
            className="w-full pl-14 pr-32 py-5 rounded-xl border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-xl font-serif text-slate-800 placeholder-slate-400"
          />
          <Search className="absolute left-5 top-5.5 text-slate-400" size={24} />
          <button 
            type="submit"
            disabled={isLoading || !query}
            className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-8 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors text-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {result ? (
          <div className="flex-1 overflow-y-auto p-10 md:p-14">
             <div className="max-w-4xl mx-auto prose prose-slate prose-lg max-w-none 
                prose-h3:font-serif prose-h3:font-bold prose-h3:text-2xl prose-h3:text-center prose-h3:text-slate-900 prose-h3:mb-6
                prose-h4:font-serif prose-h4:font-bold prose-h4:text-lg prose-h4:text-slate-800 prose-h4:mt-6
                prose-p:text-slate-700 prose-p:leading-loose prose-p:text-justify prose-p:font-serif
                prose-strong:text-slate-900
             ">
               <div dangerouslySetInnerHTML={{ __html: result }} />
               <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                 <p className="text-sm text-slate-400 font-sans italic">
                   Disclaimer: This is an AI-generated summary of jurisprudence. Always verify with official SCRA or e-Library text.
                 </p>
               </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
              <Gavel size={48} className="opacity-20" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-600 mb-3">Search Philippine Jurisprudence</h3>
            <p className="max-w-md text-center text-lg leading-relaxed">
              Find case doctrines, specific rulings, and legal precedents from the Supreme Court.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};