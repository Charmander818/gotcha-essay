import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateChatResponse } from '../services/geminiService';
import { Question } from '../types';

const STORAGE_KEY = 'cie_economics_topic_libraries_v1';

interface TopicLibraryProps {
  questions: Question[];
}

export const TopicLibrary: React.FC<TopicLibraryProps> = ({ questions }) => {
  const chapters = useMemo(() => {
    const defaultChapters = [
      "2.2 Elasticity",
      "3.2 Methods and effects of government intervention in markets",
      "5.2 Macroeconomic policies",
    ];
    if (!questions || questions.length === 0) return defaultChapters;
    
    const unique = Array.from(new Set(questions.map(q => q.chapter))).filter(Boolean);
    return unique.sort();
  }, [questions]);

  const [libraries, setLibraries] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [selectedTopic, setSelectedTopic] = useState<string>(chapters[0] || "2.2 Elasticity");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(libraries));
  }, [libraries]);

  useEffect(() => {
    // If chapters load dynamically and current selected is not in it (unlikely but safe check)
    if (chapters.length > 0 && !chapters.includes(selectedTopic)) {
      setSelectedTopic(chapters[0]);
    }
  }, [chapters, selectedTopic]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const prompt = `
Act as an expert Cambridge A-Level Economics examiner and teacher.
Create a comprehensive, highly condensed "Cheat Sheet Library" for the subtopic: "${selectedTopic}".

Based on the student's request, this library MUST have the exact same structure and depth as an 'Elasticity' cheat sheet. It must be a complete brain-dump of EVERYTHING a student needs to write to get full marks for ANY question on this subtopic.

Follow this exact structure using Markdown headings:

# ${selectedTopic} - Ultimate Library

## AO1 (Definitions & Formulas)
- Provide all key definitions and any relevant formulas. Be precise and concise (Cambridge mark scheme style).

## AO2 (Application & Linkages)
- Provide 4 to 5 key application points. 
- How does this concept apply to the real world? 
- How does it link to other economic variables? (e.g. how X affects Y).
- Number them clearly (e.g., 1. Concept + Application, 2. Concept + Application).

## AO3 (Evaluation & Judgement)
- Provide 4 to 5 deep evaluation points to secure the highest marks.
- Must include standard evaluative frameworks like:
  - Short-run vs Long-run impacts
  - Internal vs External Focus
  - Magnitude of changes
  - Ceteris paribus limitation & Data Reliability
  - Priorities of different stakeholders

Make it dense, practical, and highly relevant for A-Level exams. No fluff, just pure high-scoring points.
`;
      const response = await generateChatResponse(prompt);
      setLibraries(prev => ({ ...prev, [selectedTopic]: response }));
    } catch (err: any) {
      setError(err.message || "Failed to generate library.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Topic Library (Cheat Sheets)</h2>
          <p className="text-slate-500 mt-1 text-sm">
            Generate ultimate "all-in-one" cheat sheets containing AO1, AO2, and AO3 points for high-frequency subtopics.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <select 
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none max-w-sm"
          >
            {chapters.map(chap => (
              <option key={chap} value={chap}>{chap}</option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Generate Library
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        {libraries[selectedTopic] ? (
          <div className="markdown-body prose prose-slate prose-headings:text-slate-800 prose-a:text-blue-600 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{libraries[selectedTopic]}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm font-medium">No library generated for this subtopic yet.</p>
            <p className="text-xs mt-1">Click "Generate Library" to create an ultimate A-Level cheat sheet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
