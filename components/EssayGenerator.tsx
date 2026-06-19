
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { generateModelAnswer } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  question: Question;
  savedEssay: string;
  onSave: (essay: string) => void;
}

const EssayGenerator: React.FC<Props> = ({ question, savedEssay, onSave }) => {
  const [essay, setEssay] = useState<string>(savedEssay);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');

  // Update local state when prop changes (e.g. switching questions)
  useEffect(() => {
    setEssay(savedEssay);
  }, [savedEssay, question.id]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateModelAnswer(question, selectedModel);
      const textToSave = `> **Model used:** ${selectedModel}\n\n---\n\n${result}`;
      setEssay(textToSave);
      onSave(textToSave);
    } catch (error: any) {
      console.error("Error generating essay:", error);
      alert(`Failed to generate essay. Error: ${error?.message || String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([`Model Answer for: ${question.questionText}\n\n${essay}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `model_essay_${question.year}_${question.questionNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 leading-relaxed">
            {question.questionText}
          </h2>
          <span className="flex-shrink-0 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full ml-4">
            {question.maxMarks} Marks
          </span>
        </div>

        <details className="mb-6 group">
          <summary className="cursor-pointer text-sm text-slate-500 hover:text-blue-600 font-medium flex items-center select-none">
            <span className="mr-2 group-open:rotate-90 transition-transform">▶</span>
            View Official Mark Scheme Guidance
          </summary>
          <div className="mt-3 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 font-mono whitespace-pre-wrap border border-slate-100">
            {question.markScheme}
          </div>
        </details>

        {!essay && (
          <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 mb-4 text-sm">Ready to see a model answer based on the syllabus?</p>
            <div className="flex items-center gap-3 mb-6">
              <label htmlFor="model-select" className="text-sm text-slate-600 font-medium tracking-tight">Model:</label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-white border text-sm border-slate-300 text-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 py-2 px-3 shadow-sm"
              >
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Powerful, slow)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast, default)</option>
                <option value="gemini-2.0-flash-thinking-exp">Gemini 2.0 Flash Thinking</option>
                <option value="gpt-4o">GPT-4o (OpenAI Premium)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (OpenAI Fast)</option>
                <option value="gpt-4.5-preview">GPT-4.5 Preview</option>
                <option value="o1">OpenAI o1 Reasoning</option>
                <option value="o3-mini">OpenAI o3-mini Reasoning</option>
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Generating...
                </>
              ) : (
                "Generate Model Essay"
              )}
            </button>
          </div>
        )}

        {essay && (
          <div className="prose prose-slate prose-blue max-w-none">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <h3 className="text-slate-900 font-semibold m-0">AI Model Answer</h3>
              <div className="flex gap-4 items-center">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={loading}
                  className="bg-white border text-xs border-slate-300 text-slate-700 rounded focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2"
                >
                  <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-2.0-flash-thinking-exp">Gemini 2.0 Thinking</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4.5-preview">GPT-4.5 Preview</option>
                  <option value="o1">OpenAI o1</option>
                  <option value="o3-mini">OpenAI o3-mini</option>
                </select>
                <button 
                    onClick={handleDownload}
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1"
                    title="Download as Text File"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Save
                </button>
                <button 
                    onClick={handleGenerate} 
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 flex items-center gap-1"
                >
                    {loading ? "Generating..." : "Regenerate"}
                </button>
              </div>
            </div>
            <ReactMarkdown>{essay}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssayGenerator;
