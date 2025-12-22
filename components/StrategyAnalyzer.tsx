
import React, { useState } from 'react';
import { Question } from '../types';
import { analyzeExamStrategy } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  questions: Question[];
}

const StrategyAnalyzer: React.FC<Props> = ({ questions }) => {
  const [activeTab, setActiveTab] = useState<number>(8); // 8 or 12
  const [report8, setReport8] = useState<string>("");
  const [report12, setReport12] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (marks: number) => {
    setLoading(true);
    const report = await analyzeExamStrategy(marks, questions);
    if (marks === 8) setReport8(report);
    else setReport12(report);
    setLoading(false);
  };

  const activeReport = activeTab === 8 ? report8 : report12;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header / Controls */}
      <div className="bg-white border-b border-slate-200 p-6 shadow-sm z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Exam Strategy Decoder</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Use AI to reverse-engineer the "Hidden Rules" of the mark schemes. This tool analyzes the entire question bank to find the specific AO2 and AO3 formulas for different question types (e.g., "Assess whether..." vs "Explain... and consider").
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab(8)}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === 8
                  ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-500'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              8-Mark Strategy
            </button>
            <button
              onClick={() => setActiveTab(12)}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === 12
                  ? 'bg-purple-100 text-purple-800 ring-2 ring-purple-500'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              12-Mark Strategy
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scroll p-6">
        <div className="max-w-4xl mx-auto">
          {!activeReport ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
              <div className="mb-4 p-4 bg-blue-50 text-blue-600 rounded-full">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">
                Generate {activeTab}-Mark Strategy Report
              </h3>
              <p className="text-slate-500 text-sm mb-6 text-center max-w-md">
                The AI will read all {activeTab}-mark questions and their mark schemes to extract the patterns for AO2 Analysis and AO3 Evaluation.
              </p>
              <button
                onClick={() => handleAnalyze(activeTab)}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Analyzing Question Bank...
                  </>
                ) : (
                  "Decode Strategy"
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fade-in-up">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                 <h2 className="text-xl font-bold text-slate-800">Examiner Report: {activeTab}-Mark Questions</h2>
                 <button 
                   onClick={() => handleAnalyze(activeTab)}
                   disabled={loading}
                   className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                 >
                   {loading ? "Regenerating..." : "Refresh Analysis"}
                 </button>
              </div>
              <div className="prose prose-slate max-w-none prose-headings:text-blue-900 prose-a:text-blue-600">
                <ReactMarkdown>{activeReport}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategyAnalyzer;
