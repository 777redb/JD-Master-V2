
import React, { useState, useEffect } from 'react';
import { generateMockBarQuestion } from '../services/gemini';
import { BAR_SUBJECTS_INFO, LEARNER_LEVELS } from '../constants';
import { MockBarQuestion } from '../types';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowRight, 
  RefreshCcw, 
  User, 
  FileText, 
  List,
  Sparkles,
  ChevronRight,
  Info,
  History,
  Timer,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

export const MockBar: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [profile, setProfile] = useState<string>(LEARNER_LEVELS[2]); 
  const [examType, setExamType] = useState<'MCQ' | 'ESSAY'>('MCQ');
  const [question, setQuestion] = useState<MockBarQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  // Reset session stats on subject change
  useEffect(() => {
    setSessionStats({ correct: 0, total: 0 });
  }, [subject]);

  const generateQuestion = async () => {
    if (!subject) return;
    setIsLoading(true);
    setQuestion(null);
    setSelectedAnswer(null);
    setIsRevealed(false);
    
    try {
      const q = await generateMockBarQuestion(subject, profile, examType);
      setQuestion(q);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (index: number) => {
    if (isRevealed) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (examType === 'MCQ' && question) {
      const isCorrect = selectedAnswer === question.correctAnswerIndex;
      setSessionStats(prev => ({
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0)
      }));
    }
    setIsRevealed(true);
  };

  const resetSelection = () => {
    setSubject('');
    setQuestion(null);
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-600/10 rounded-xl flex items-center justify-center text-amber-600 shadow-inner">
            <Award size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Mock Bar Challenge</h2>
            <p className="text-slate-500 text-sm flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              AI-Generated Assesment based on SC 2024 Syllabi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Stats Bar */}
          {subject && examType === 'MCQ' && (
             <div className="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-4 text-xs font-bold shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Score: {sessionStats.correct} / {sessionStats.total}</span>
                </div>
                <div className="w-px h-3 bg-white/20"></div>
                <span>Accuracy: {sessionStats.total > 0 ? Math.round((sessionStats.correct/sessionStats.total)*100) : 0}%</span>
             </div>
          )}

          {/* Profile & Type Toggles */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setExamType('MCQ')}
              className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${examType === 'MCQ' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={14} /> MCQ
            </button>
            <button 
              onClick={() => setExamType('ESSAY')}
              className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${examType === 'ESSAY' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileText size={14} /> Essay
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <User size={14} className="text-slate-400" />
            <select 
              value={profile} 
              onChange={(e) => setProfile(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              {LEARNER_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!subject ? (
        /* SUBJECT SELECTION GRID */
        <div className="flex-1">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">Select a Bar Subject</h3>
            <p className="text-slate-500">Pick a specialized area of law to begin your simulated examination session.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BAR_SUBJECTS_INFO.map((info) => (
              <button
                key={info.title}
                onClick={() => setSubject(info.title)}
                className="group relative bg-white rounded-2xl border-2 border-slate-100 p-6 text-left transition-all hover:border-amber-500 hover:shadow-xl hover:shadow-amber-900/5 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-${info.color}-50 text-${info.color}-600 flex items-center justify-center mb-4 transition-colors group-hover:bg-amber-600 group-hover:text-white`}>
                   <BookOpen size={24} />
                </div>
                <h4 className="font-serif font-bold text-xl text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">{info.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{info.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bar Topic</span>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-amber-500"><Info size={24}/></div>
              <div>
                <p className="font-bold text-slate-800">New Hernando Bar Structure</p>
                <p className="text-sm text-slate-500">Subject coverage is automatically updated to reflect the most recent Supreme Court bulletins.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800"><Timer size={14}/> Timed Sessions</button>
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800"><History size={14}/> Session History</button>
            </div>
          </div>
        </div>
      ) : !question && !isLoading ? (
        /* START SCREEN */
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-slate-100 shadow-sm">
          <button onClick={resetSelection} className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-amber-600 transition-colors">
            <ArrowLeft size={16}/> Back to Subjects
          </button>
          
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-8 animate-bounce duration-slow">
            <Award size={48} />
          </div>
          
          <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4 text-center">Ready for {subject}?</h3>
          <div className="flex flex-col gap-2 text-center mb-10">
            <p className="text-slate-500 italic max-w-lg leading-relaxed">
              "The Bar is a test of character as much as it is a test of knowledge. Focus on the core principles and apply them with clarity."
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mode</div>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">{examType} Exam</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Difficulty</div>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">{profile}</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={generateQuestion}
            className="group relative h-16 px-12 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl overflow-hidden active:scale-95"
          >
            <span className="relative z-10">Begin Examination Session</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-white/5 to-amber-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      ) : isLoading ? (
        /* LOADING STATE */
        <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
          <Loader2 className="animate-spin text-amber-600 mb-6" size={64} />
          <p className="text-slate-600 font-serif text-xl font-bold">Counsel, the board is being prepared...</p>
          <p className="text-slate-400 text-sm mt-2">Simulating examiner scenarios for {subject}</p>
        </div>
      ) : question && (
        /* THE QUESTION VIEW */
        <div className="flex-1 flex flex-col h-full min-h-0">
          <div className="flex justify-between items-center mb-4">
             <button onClick={resetSelection} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                <ArrowLeft size={14}/> Quit Session
             </button>
             <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subject}</span>
             </div>
          </div>

          <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-8 md:p-16 scroll-smooth">
               <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-2 mb-8">
                     <div className="h-0.5 flex-1 bg-slate-100"></div>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Question I</span>
                     <div className="h-0.5 flex-1 bg-slate-100"></div>
                  </div>

                  <p className="text-2xl md:text-3xl font-serif text-slate-900 leading-relaxed mb-12 selection:bg-amber-100">
                    {question.question}
                  </p>

                  {/* MCQ Choices */}
                  {examType === 'MCQ' && (
                    <div className="space-y-4 mb-12">
                      {question.choices.map((choice, idx) => {
                        let stateClass = "border-slate-100 hover:border-amber-300 hover:bg-amber-50/30";
                        if (selectedAnswer === idx) stateClass = "border-amber-500 bg-amber-50/50 shadow-md ring-1 ring-amber-500";
                        if (isRevealed) {
                          if (idx === question.correctAnswerIndex) stateClass = "border-green-500 bg-green-50 shadow-sm ring-1 ring-green-500";
                          else if (selectedAnswer === idx) stateClass = "border-red-500 bg-red-50 opacity-60";
                          else stateClass = "border-slate-50 opacity-40 grayscale pointer-events-none";
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectAnswer(idx)}
                            disabled={isRevealed}
                            className={`w-full p-6 rounded-2xl border-2 text-left flex items-start gap-5 transition-all duration-300 ${stateClass}`}
                          >
                            <div className={`
                              w-10 h-10 rounded-xl border-2 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold transition-all
                              ${isRevealed && idx === question.correctAnswerIndex ? 'bg-green-500 text-white border-green-500' : 
                                isRevealed && selectedAnswer === idx ? 'bg-red-500 text-white border-red-500' : 
                                selectedAnswer === idx ? 'bg-amber-500 text-white border-amber-500 shadow-inner' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:border-amber-200'}
                            `}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="text-lg text-slate-800 font-serif leading-relaxed pt-1">{choice}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Essay State */}
                  {examType === 'ESSAY' && !isRevealed && (
                    <div className="p-12 bg-slate-50 rounded-3xl text-center border border-dashed border-slate-300 mb-12">
                       <p className="text-slate-500 font-serif italic mb-6">"Construct your analysis following the ALAC method: Article, Law, Analysis, Conclusion."</p>
                       <div className="flex justify-center gap-4">
                          <button onClick={() => setIsRevealed(true)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Reveal Model Answer</button>
                       </div>
                    </div>
                  )}

                  {/* Feedback Section */}
                  {isRevealed && (
                    <div className="animate-in slide-in-from-bottom-6 duration-700">
                      <div className={`p-8 md:p-10 rounded-3xl border-2 mb-10 ${examType === 'MCQ' && selectedAnswer === question.correctAnswerIndex ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                        <div className="flex items-center gap-3 mb-6">
                           {examType === 'MCQ' ? (
                              selectedAnswer === question.correctAnswerIndex ? 
                                <div className="p-2 bg-green-500 rounded-full text-white"><CheckCircle size={24}/></div> : 
                                <div className="p-2 bg-red-500 rounded-full text-white"><XCircle size={24}/></div>
                           ) : <div className="p-2 bg-amber-500 rounded-full text-white"><FileText size={24}/></div>}
                           <h4 className="text-xl font-serif font-bold text-slate-900">
                              {examType === 'MCQ' ? (selectedAnswer === question.correctAnswerIndex ? "Excellent Analysis" : "Legal Point to Review") : "Suggested Model Answer"}
                           </h4>
                        </div>
                        
                        <div className="prose prose-lg max-w-none 
                          prose-p:font-serif prose-p:leading-loose prose-p:text-slate-800
                          prose-strong:text-amber-800 prose-blockquote:border-amber-300
                        ">
                           <div dangerouslySetInnerHTML={{ __html: question.explanation }} />
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-200/50">
                           <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-2">Legal Basis & Citations</span>
                           <p className="font-serif italic text-slate-700">{question.citation}</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 mb-12">
                         <button 
                           onClick={generateQuestion} 
                           className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 flex items-center gap-2 group transition-all"
                         >
                            <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                            Next Problem
                         </button>
                      </div>
                    </div>
                  )}
               </div>
            </div>
            
            {/* Control Bar */}
            {!isRevealed && examType === 'MCQ' && (
               <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                  <button
                    onClick={checkAnswer}
                    disabled={selectedAnswer === null}
                    className="h-14 px-12 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-30 shadow-lg shadow-amber-600/20 active:scale-95 transition-all"
                  >
                    Submit Final Answer
                  </button>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
