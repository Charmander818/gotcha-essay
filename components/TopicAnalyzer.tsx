
import React, { useState, useEffect, useMemo } from 'react';
import { Question, SyllabusTopic, TopicAnalysisData } from '../types';
import { analyzeTopic } from '../services/geminiService';
import { SYLLABUS_STRUCTURE, Level } from '../syllabusData';

interface Props {
  initialTopic?: string;
  initialChapter?: string;
  allQuestions: Question[];
  savedAnalysis?: Record<string, TopicAnalysisData>;
  onSaveAnalysis: (chapter: string, data: TopicAnalysisData) => void;
}

const TopicAnalyzer: React.FC<Props> = ({ 
  initialTopic, 
  initialChapter, 
  allQuestions, 
  savedAnalysis = {},
  onSaveAnalysis
}) => {
  const [selectedLevel, setSelectedLevel] = useState<Level>("AS");
  const [selectedTopic, setSelectedTopic] = useState<SyllabusTopic>(SYLLABUS_STRUCTURE["AS"].topics[0]);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  
  // Initialize selections
  useEffect(() => {
    if (initialTopic && initialChapter) {
        const aLevelTopics = SYLLABUS_STRUCTURE["A Level"].topics as string[];
        const isAL = aLevelTopics.includes(initialTopic);
        
        const level = isAL ? "A Level" : "AS";
        setSelectedLevel(level);
        setSelectedTopic(initialTopic as SyllabusTopic);
        setSelectedChapter(initialChapter);
    } else {
        const defaultTopic = SYLLABUS_STRUCTURE["AS"].topics[0];
        setSelectedLevel("AS");
        setSelectedTopic(defaultTopic);
        const chapters = (SYLLABUS_STRUCTURE["AS"].chapters as any)[defaultTopic] || [];
        setSelectedChapter(chapters[0] || "");
    }
  }, []); // Run once on mount

  const handleLevelChange = (lvl: Level) => {
      setSelectedLevel(lvl);
      const newTopic = SYLLABUS_STRUCTURE[lvl].topics[0];
      setSelectedTopic(newTopic);
      const chapters = (SYLLABUS_STRUCTURE[lvl].chapters as any)[newTopic] || [];
      setSelectedChapter(chapters[0] || "");
  };

  const handleTopicChange = (topicStr: string) => {
      const topic = topicStr as SyllabusTopic;
      setSelectedTopic(topic);
      const chapters = (SYLLABUS_STRUCTURE[selectedLevel].chapters as any)[topic] || [];
      setSelectedChapter(chapters[0] || "");
  };

  const chapterQuestions = useMemo(() => {
      return allQuestions.filter(q => q.chapter === selectedChapter);
  }, [allQuestions, selectedChapter]);

  const currentData = useMemo(() => {
      return savedAnalysis[selectedChapter];
  }, [savedAnalysis, selectedChapter]);

  const handleAnalyze = async () => {
    if (!selectedChapter) return;
    setLoading(true);
    const result = await analyzeTopic(selectedChapter, chapterQuestions);
    if (result) {
        onSaveAnalysis(selectedChapter, result);
    }
    setLoading(false);
  };

  const handleExportWord = () => {
      if (!currentData) return;
      
      const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${selectedChapter} Analysis</title></head><body style="font-family: Calibri, sans-serif;">`;
      const footer = "</body></html>";
      
      let contentHTML = `<h1>Topic Analysis: ${selectedChapter}</h1>`;
      contentHTML += `<p><strong>Level:</strong> ${selectedLevel} | <strong>Topic:</strong> ${selectedTopic}</p>`;
      contentHTML += `<p><strong>Questions Analyzed:</strong> ${currentData.questionCount} | <strong>Last Updated:</strong> ${currentData.lastUpdated}</p><hr/>`;
      
      contentHTML += `<h2>AO1: Knowledge & Understanding</h2><ul>${currentData.ao1.map(p => `<li>${p}</li>`).join('')}</ul>`;
      contentHTML += `<h2>AO2: Analysis Chains</h2><ul>${currentData.ao2.map(p => `<li>${p}</li>`).join('')}</ul>`;
      contentHTML += `<h2>AO3: Evaluation</h2><ul>${currentData.ao3.map(p => `<li>${p}</li>`).join('')}</ul>`;
      
      currentData.keyDebates.forEach(d => {
          contentHTML += `<h3>Debate: ${d.title}</h3>`;
          contentHTML += `<p><strong>Pros:</strong> ${d.pros}</p>`;
          contentHTML += `<p><strong>Cons:</strong> ${d.cons}</p>`;
          contentHTML += `<p><strong>Depends On:</strong> ${d.dependencies}</p>`;
      });

      const sourceHTML = header + contentHTML + footer;
      
      const blob = new Blob([sourceHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Analysis_${selectedChapter.replace(/[^a-z0-9]/gi, '_')}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const currentTopics = SYLLABUS_STRUCTURE[selectedLevel].topics;
  const currentChapters = (SYLLABUS_STRUCTURE[selectedLevel].chapters as any)[selectedTopic] || [];

  return (
    <div className="max-w-[95%] mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6">
       
       {/* Top Bar */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
             <div className="flex bg-slate-100 p-1 rounded-lg flex-shrink-0">
                {(['AS', 'A Level'] as Level[]).map(l => (
                    <button 
                       key={l}
                       onClick={() => handleLevelChange(l)}
                       className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${selectedLevel === l ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {l === 'AS' ? 'AS' : 'A Lvl'}
                    </button>
                ))}
             </div>

             <select 
                value={selectedTopic} 
                onChange={(e) => handleTopicChange(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none max-w-[200px]"
             >
                 {currentTopics.map(t => <option key={t} value={t}>{t}</option>)}
             </select>

             <select 
                value={selectedChapter} 
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none flex-1 min-w-[200px]"
             >
                 {currentChapters.map((c: string) => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>

          <div className="flex items-center gap-6">
              <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Questions in Chapter</div>
                  <div className="text-2xl font-bold text-blue-600 leading-none text-right">{chapterQuestions.length}</div>
              </div>
              
              <div className="h-8 w-px bg-slate-200"></div>

              <div className="flex gap-2">
                  <button
                    onClick={handleExportWord}
                    disabled={!currentData}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export Report
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || chapterQuestions.length === 0}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {loading ? (
                        <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Analyzing...
                        </>
                    ) : (
                        <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        Update Analysis
                        </>
                    )}
                  </button>
              </div>
          </div>
       </div>

       {/* Analysis Content */}
       <div className="flex-1 overflow-y-auto custom-scroll -mr-2 pr-2 pb-10">
          {!currentData ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                 <svg className="w-20 h-20 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                 <p className="text-lg font-medium">No analysis generated yet.</p>
                 <p className="text-sm">Click "Update Analysis" to process the {chapterQuestions.length} questions in this chapter.</p>
              </div>
          ) : (
              <div className="space-y-6">
                  {/* Top Row: AO1, AO2, AO3 Cards */}
                  <div className="grid grid-cols-3 gap-6">
                      {/* AO1 Card */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                              <h3 className="font-bold text-slate-800">AO1: Knowledge & Understanding</h3>
                              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{currentData.ao1.length} points</span>
                          </div>
                          <div className="p-5 flex-1 bg-white">
                              <ul className="space-y-3">
                                  {currentData.ao1.map((item, i) => (
                                      <li key={i} className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-slate-200">
                                          {item}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>

                      {/* AO2 Card */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                          <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                              <h3 className="font-bold text-indigo-900">AO2: Analysis Chains</h3>
                              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{currentData.ao2.length} chains</span>
                          </div>
                          <div className="p-5 flex-1 bg-white">
                              <ul className="space-y-4">
                                  {currentData.ao2.map((item, i) => (
                                      <li key={i} className="text-sm text-slate-700 leading-relaxed bg-indigo-50/30 p-3 rounded-lg border border-indigo-50">
                                          {item}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>

                      {/* AO3 Card */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                          <div className="p-4 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
                              <h3 className="font-bold text-amber-900">AO3: General Evaluation</h3>
                              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{currentData.ao3.length} points</span>
                          </div>
                          <div className="p-5 flex-1 bg-white">
                              <ul className="space-y-3">
                                  {currentData.ao3.map((item, i) => (
                                      <li key={i} className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-amber-200">
                                          {item}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </div>

                  {/* Debates Section */}
                  <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">KEY DEBATES & POLICY EVALUATIONS (LIMITATIONS & DEPENDENCIES)</h3>
                      <div className="space-y-4">
                          {currentData.keyDebates.map((debate, i) => (
                              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                  <div className="bg-slate-800 px-5 py-3 flex justify-between items-center">
                                      <h4 className="font-bold text-white text-sm">{debate.title}</h4>
                                  </div>
                                  <div className="grid grid-cols-3 divide-x divide-slate-100">
                                      <div className="p-5">
                                          <div className="flex items-center gap-2 mb-2">
                                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                              <span className="text-[10px] font-bold text-emerald-600 uppercase">ADVANTAGES / EFFECTIVENESS</span>
                                          </div>
                                          <p className="text-sm text-slate-600">{debate.pros}</p>
                                      </div>
                                      <div className="p-5">
                                          <div className="flex items-center gap-2 mb-2">
                                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                              <span className="text-[10px] font-bold text-red-600 uppercase">LIMITATIONS / PROBLEMS</span>
                                          </div>
                                          <p className="text-sm text-slate-600">{debate.cons}</p>
                                      </div>
                                      <div className="p-5 bg-purple-50/30">
                                          <div className="flex items-center gap-2 mb-2">
                                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                              <span className="text-[10px] font-bold text-purple-600 uppercase">DEPENDS ON...</span>
                                          </div>
                                          <p className="text-sm text-slate-700 italic">{debate.dependencies}</p>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Footer Info */}
                  <div className="text-right text-xs text-slate-400 pt-4 border-t border-slate-100">
                      Last Updated: {currentData.lastUpdated} • Based on {currentData.questionCount} questions
                  </div>
              </div>
          )}
       </div>
    </div>
  );
};

export default TopicAnalyzer;
