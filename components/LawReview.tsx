import React, { useState } from 'react';
import { generateLawSyllabus } from '../services/gemini';
import { LEARNER_LEVELS } from '../constants';
import { ScrollText, GraduationCap, Loader2, BookOpen } from 'lucide-react';

export const LawReview: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [profile, setProfile] = useState(LEARNER_LEVELS[1]); // Default Junior/Senior
  const [syllabus, setSyllabus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setSyllabus('');
    try {
      const result = await generateLawSyllabus(topic, profile);
      setSyllabus(result);
    } catch (e) {
      setSyllabus("<p>Failed to generate syllabus.</p>");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
          <ScrollText className="text-amber-600" />
          Law Review & Syllabus
        </h2>
        <p className="text-slate-500">Generate a strategic, AI-powered study guide tailored to your level.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Topic / Subject Area</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Law on Property, Remedial Law Review, Obligations..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-serif text-slate-800"
            />
          </div>
          <div className="w-full md:w-64">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Learner Level</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full p-3.5 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer font-medium text-slate-700"
              >
                {LEARNER_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic}
              className="w-full md:w-auto h-[50px] px-8 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Generate Syllabus'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {syllabus ? (
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <div className="max-w-4xl mx-auto prose prose-slate prose-lg max-w-none 
                prose-h3:font-serif prose-h3:font-bold prose-h3:text-2xl prose-h3:text-center prose-h3:text-slate-900 prose-h3:mb-8
                prose-h4:font-serif prose-h4:font-bold prose-h4:text-lg prose-h4:text-slate-800 prose-h4:mt-8
                prose-p:text-slate-700 prose-p:leading-loose prose-p:text-justify prose-p:font-serif
                prose-ul:list-disc prose-ul:ml-6 prose-li:text-slate-700 prose-li:font-serif prose-li:leading-loose">
               <div dangerouslySetInnerHTML={{ __html: syllabus }} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <BookOpen size={40} className="opacity-20" />
            </div>
            <p className="text-center max-w-md font-serif text-lg text-slate-500">
              Enter a legal topic above to generate a comprehensive reviewer including key codals, doctrines, and bar exam tips.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};