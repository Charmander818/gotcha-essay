
import React, { useState } from 'react';
import { improveLogicChain } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const LogicChainImprover: React.FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImprove = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const improved = await improveLogicChain(input);
    setResult(improved);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-4">
        <h2 className="text-lg font-bold text-indigo-900 mb-2">Logic Chain Improver</h2>
        <p className="text-sm text-indigo-700">
          Paste your rough notes or a disconnected paragraph below. The AI will transform it into a formal, step-by-step economic logical chain (AO2) suitable for high-scoring essays.
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Input Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700">
            Your Rough Notes
          </div>
          <textarea
            className="flex-1 p-4 resize-none focus:outline-none text-slate-700 leading-relaxed"
            placeholder="e.g. Interest rates go down, so people spend more, AD goes up..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="p-3 bg-white border-t border-slate-100">
            <button
              onClick={handleImprove}
              disabled={loading || !input.trim()}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Improving...
                </>
              ) : (
                "Build Logic Chain"
              )}
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700">
            Improved Economic Chain
          </div>
          <div className="flex-1 p-6 overflow-y-auto custom-scroll prose prose-indigo prose-sm max-w-none">
            {result ? (
              <ReactMarkdown>{result}</ReactMarkdown>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <span className="text-4xl mb-2">🔗</span>
                <p>Result will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogicChainImprover;
