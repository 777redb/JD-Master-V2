import React, { useState } from 'react';
import { generateMockBarQuestion } from '../services/gemini';
import { BAR_SUBJECTS, LEARNER_LEVELS } from '../constants';
import { MockBarQuestion } from '../types';
import { Award, CheckCircle, XCircle, Loader2, ArrowRight, RefreshCcw, User, FileText, List } from 'lucide-react';

export const MockBar: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [profile, setProfile] = useState<string>(LEARNER_LEVELS[2]); // Default to Bar Reviewee
  const [examType, setExamType] = useState<'MCQ' | 'ESSAY'>('MCQ');
  const [question, setQuestion] = useState<MockBarQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateQuestion = async () => {
    if (!subject) return;
    setIsLoading(true);
    setQuestion(null);
    setSelectedAnswer(null);
    setIsRevealed(false);
    
    const q = await generateMockBarQuestion(subject, profile, examType);
    setQuestion(q);
    setIsLoading(false);
  };

  const handleSelectAnswer = (index: number) => {
    if (isRevealed) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    setIsRevealed(true);
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Award className="text-amber-600" />
            Mock Bar Challenge
          </h2>
          <p className="text-slate-500">Tailor-fit assessment based on your profile.</p>
        </div>
        
        <div className="flex gap-4">
           {/* Exam Type Toggle */}
           <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
               onClick={() => setExamType('MCQ')}
               className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-all ${examType === 'MCQ' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
             >
               <List size={16} /> MCQ
             </button>
             <button 
               onClick={() => setExamType('ESSAY')}
               className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-all ${examType === 'ESSAY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
             >
               <FileText size={16} /> Essay
             </button>
           </div>

           {/* Profile Selector */}
          <div className="flex items-center gap-2 bg-white p-2 px-3 rounded-lg border border-slate-200 shadow-sm">
            <User size={16} className="text-slate-400" />
            <select 
              value={profile} 
              onChange={(e) => setProfile(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              {LEARNER_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!question && !isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-serif font-bold text-slate-900 mb-8">Select a Bar Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
            {BAR_SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubject(sub)}
                className={`p-6 rounded-xl border text-left transition-all group ${
                  subject === sub 
                    ? 'bg-amber-600 text-white border-amber-600 shadow-lg transform scale-105' 
                    : 'bg-white border-slate-200 hover:border-amber-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`font-serif font-bold text-lg block mb-1 group-hover:text-amber-600 ${subject === sub ? 'group-hover:text-white' : ''}`}>{sub}</span>
                <span className="text-xs opacity-70">Bar Subject</span>
              </button>
            ))}
          </div>
          <button
            onClick={generateQuestion}
            disabled={!subject}
            className="mt-12 bg-slate-900 text-white px-12 py-4 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 shadow-xl shadow-slate-200 text-lg"
          >
            Begin {examType === 'MCQ' ? 'Quiz' : 'Essay'} <ArrowRight size={20} />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-amber-600 mb-6" size={56} />
          <p className="text-slate-600 font-serif text-lg">Constructing {profile} level {examType} question for {subject}...</p>
        </div>
      )}

      {question && (
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white p-8 md:p-12 rounded-xl border border-slate-200 shadow-sm mb-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
              <span className="inline-block bg-slate-100 text-slate-600 text-sm font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                {subject}
              </span>
              <span className="text-sm text-amber-700 font-medium border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-full">
                {profile} • {examType}
              </span>
            </div>
            
            <p className="text-xl md:text-2xl font-serif text-slate-900 leading-loose mb-10 whitespace-pre-wrap">
              {question.question}
            </p>

            {/* MCQ Choices */}
            {examType === 'MCQ' && (
              <div className="space-y-4">
                {question.choices.map((choice, idx) => {
                  let stateClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                  
                  if (selectedAnswer === idx) {
                    stateClass = "border-amber-500 bg-amber-50 ring-1 ring-amber-500";
                  }
                  
                  if (isRevealed) {
                    if (idx === question.correctAnswerIndex) {
                      stateClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
                    } else if (selectedAnswer === idx && idx !== question.correctAnswerIndex) {
                      stateClass = "border-red-500 bg-red-50 ring-1 ring-red-500 opacity-60";
                    } else {
                      stateClass = "border-slate-100 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={isRevealed}
                      className={`w-full p-5 rounded-xl border-2 text-left flex items-start gap-4 transition-all ${stateClass}`}
                    >
                      <div className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold transition-colors
                        ${isRevealed && idx === question.correctAnswerIndex ? 'bg-green-500 text-white border-green-500' : 
                          isRevealed && selectedAnswer === idx && idx !== question.correctAnswerIndex ? 'bg-red-500 text-white border-red-500' : 
                          selectedAnswer === idx ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-300 text-slate-500'}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-lg text-slate-800 font-serif">{choice}</span>
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Essay Prompt */}
            {examType === 'ESSAY' && !isRevealed && (
              <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <p className="text-slate-600 mb-6 text-lg font-serif italic">"Analyze the problem above. Formulate your answer mentally or write it down on your Legal Pad before revealing the model answer."</p>
                <div className="h-px bg-slate-200 w-32 mx-auto"></div>
              </div>
            )}
          </div>

          {!isRevealed ? (
            <div className="flex justify-center mb-12">
              <button
                onClick={checkAnswer}
                disabled={examType === 'MCQ' && selectedAnswer === null}
                className="bg-slate-900 text-white px-10 py-4 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-lg text-lg"
              >
                {examType === 'MCQ' ? 'Submit Answer' : 'Reveal Model Answer'}
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-amber-50 border border-amber-100 rounded-xl p-8 md:p-12 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
              <h4 className="font-bold text-amber-900 flex items-center gap-3 mb-6 text-xl">
                {examType === 'MCQ' ? (
                  selectedAnswer === question.correctAnswerIndex ? (
                    <><CheckCircle className="text-green-600" size={24} /> Correct Answer</>
                  ) : (
                    <><XCircle className="text-red-500" size={24} /> Incorrect Answer</>
                  )
                ) : (
                  <><FileText className="text-amber-700" size={24} /> Suggested Model Answer</>
                )}
              </h4>
              <div className="prose prose-lg max-w-none prose-p:text-slate-800 prose-p:font-serif prose-p:leading-loose">
                 {/* Render HTML Explanation */}
                 <div dangerouslySetInnerHTML={{ __html: question.explanation }} />
              </div>
              
              <div className="mt-8 pt-6 border-t border-amber-200">
                <span className="text-xs uppercase font-bold text-amber-800 tracking-wider block mb-2">Legal Basis</span>
                <p className="text-base text-slate-700 font-medium font-serif italic">
                  {question.citation}
                </p>
              </div>
              
              <div className="mt-10 flex justify-end">
                <button
                  onClick={generateQuestion}
                  className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 flex items-center gap-2 shadow-md transition-colors"
                >
                  <RefreshCcw size={18} /> Next Question
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};