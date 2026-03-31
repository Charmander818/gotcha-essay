
import React, { useState } from 'react';
import { Question } from '../types';
import { analyzeExamStrategy } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  questions: Question[];
}

const StrategyAnalyzer: React.FC<Props> = ({ questions }) => {
  const [activeTab, setActiveTab] = useState<number | 'tips'>(8); // 8, 12, or 'tips'
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

  const renderTips = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        CIE Exam Hacks & Hidden Rules
      </h2>
      
      <div className="space-y-8">
        {/* AO1 & AO2 Tips */}
        <section>
          <h3 className="text-lg font-bold text-amber-700 mb-3 border-b pb-2">AO1 & AO2: The "Hidden" Rules</h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong className="text-amber-800">Examples:</strong> ONLY provide real-world examples if the question explicitly asks for them (e.g., "With the use of examples..."). Otherwise, you get no marks for them.</li>
            <li><strong className="text-amber-800">Diagrams:</strong> ONLY draw diagrams if the question explicitly asks for them. If not asked, the diagram itself scores 0 marks—all marks come from your written explanation.</li>
            <li><strong className="text-amber-800">"Causes":</strong> If the question asks for "causes", you MUST define the term first, then explain the causes. If it doesn't ask for causes, do NOT waste time writing them.</li>
            <li><strong className="text-amber-800">"Explain the difference":</strong> Keep it brief (1-2 lines) after defining both concepts. Don't write a long essay on the differences.</li>
            <li><strong className="text-amber-800">"Price change":</strong> If a question mentions a "price change", you MUST discuss BOTH price increases AND price decreases to get full marks.</li>
            <li><strong className="text-amber-800">Plurals matter:</strong> Pay close attention to plurals like "causes", "consequences", or "markets". You MUST discuss at least two to access full marks.</li>
          </ul>
        </section>

        {/* Policy Questions: FEAST */}
        <section>
          <h3 className="text-lg font-bold text-purple-700 mb-3 border-b pb-2">Policy Questions: The FEAST Framework</h3>
          <p className="text-slate-600 mb-4">Use these 5 criteria to structure your AO2 (Analysis) and AO3 (Evaluation) for any micro/macro policy question:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-purple-50 border border-purple-100 rounded shadow-sm"><strong className="text-purple-800">F</strong>easibility: Financial cost (subsidies) & Administrative cost (regulation).</div>
            <div className="p-3 bg-purple-50 border border-purple-100 rounded shadow-sm"><strong className="text-purple-800">E</strong>ffectiveness: Does the policy actually solve the problem?</div>
            <div className="p-3 bg-purple-50 border border-purple-100 rounded shadow-sm"><strong className="text-purple-800">A</strong>ppropriateness: Does it tackle the root cause of the problem?</div>
            <div className="p-3 bg-purple-50 border border-purple-100 rounded shadow-sm"><strong className="text-purple-800">S</strong>ide effects: Unintended consequences (e.g., indirect tax worsens inequality).</div>
            <div className="p-3 bg-purple-50 border border-purple-100 rounded shadow-sm"><strong className="text-purple-800">T</strong>ime lag: Time to implement vs. Time to take effect (Short-run vs Long-run).</div>
          </div>
        </section>

        {/* 0-Point EV Traps */}
        <section>
          <h3 className="text-lg font-bold text-red-700 mb-3 border-b pb-2">AO3: 0-Point EV Traps</h3>
          <p className="text-slate-600 mb-4">
            Avoid these common traps that score 0 marks for Evaluation, even if your AO1/AO2 are perfect:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong className="text-red-600">Repeating AO2:</strong> Restating points you already made (e.g., "It depends on PED, if elastic X, if inelastic Y" when you already explained this in analysis).</li>
            <li><strong className="text-red-600">Listing Limitations:</strong> Treating EV as just a list of disadvantages (e.g., "Policy A has time lags. Policy B causes inflation. Therefore A is better.") without comparing them.</li>
            <li><strong className="text-red-600">Unjustified Judgement:</strong> Giving a conclusion without explaining <em>why</em> based on a specific context.</li>
            <li><strong className="text-red-600">Ignoring Data Context:</strong> In Data Response questions, the context is already given. You MUST evaluate based on the provided data, not a made-up context.</li>
          </ul>
        </section>

        {/* 12-Mark Specific Rules */}
        <section>
          <h3 className="text-lg font-bold text-pink-700 mb-3 border-b pb-2">12-Mark Question Framework</h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong className="text-pink-800">AO1:</strong> Define ALL key terms in the question.</li>
            <li><strong className="text-pink-800">AO2 Paragraph Structure:</strong> One point per paragraph. Start with a topic sentence, followed by a complete logical chain and economic terms.</li>
            <li><strong className="text-pink-800">Single Concept (e.g., "Is inflation always bad?"):</strong> Write exactly 3 positive points and 3 negative points in AO2.</li>
            <li><strong className="text-pink-800">Comparing Policies/Systems (e.g., "Fiscal vs Monetary"):</strong> Policy A (how it solves/2 pros + 2 limitations) and Policy B (how it solves/2 pros + 2 limitations). Do NOT use a "should/should not" framework for systems.</li>
            <li><strong className="text-pink-800">AO3 Evaluation:</strong> Write exactly 2 "depends on" points. DO NOT repeat any limitations or points already discussed in AO2.</li>
          </ul>
        </section>

        {/* Correct EV Approach */}
        <section>
          <h3 className="text-lg font-bold text-emerald-700 mb-3 border-b pb-2">AO3: The Winning EV Formula</h3>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-4">
            <h4 className="font-bold text-emerald-800 mb-2">Context + Judgement</h4>
            <p className="text-emerald-700 text-sm">
              Give a specific context, then point out that in this context, the benefits are amplified and the drawbacks are less important, therefore Policy X is the better choice.
            </p>
          </div>
          <h4 className="font-bold text-slate-800 mt-6 mb-2">Example: "Is a Maximum Price good?"</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">AO2 (Analysis)</span>
              <ul className="text-sm text-slate-700 space-y-1 list-disc pl-4">
                <li><strong>Pros:</strong> Fast implementation, transparent.</li>
                <li><strong>Cons:</strong> Causes shortages, long-term market distortion.</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">AO3 (Evaluation)</span>
              <p className="text-sm text-blue-800">
                <strong>Context:</strong> During COVID-19, masks are essential goods and prices spike.<br/>
                <strong>Judgement:</strong> In this short-term crisis context, the speed of a max price outweighs the long-term distortion issues, making it an effective policy.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header / Controls */}
      <div className="bg-white border-b border-slate-200 p-6 shadow-sm z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Exam Strategy Decoder</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Use AI to reverse-engineer the "Hidden Rules" of the mark schemes. This tool analyzes the entire question bank to find the specific AO2 and AO3 formulas for different question types (e.g., "Assess whether..." vs "Explain... and consider").
          </p>

          <div className="flex flex-wrap gap-4">
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
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'tips'
                  ? 'bg-indigo-100 text-indigo-800 ring-2 ring-indigo-500'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Exam Hacks & Tips
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scroll p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'tips' ? (
            renderTips()
          ) : !activeReport ? (
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
                onClick={() => handleAnalyze(activeTab as number)}
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
                   onClick={() => handleAnalyze(activeTab as number)}
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
