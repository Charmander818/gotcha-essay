
import React, { useState, useEffect } from 'react';
import { SYLLABUS_CHECKLIST } from '../syllabusChecklistData';
import { SyllabusStatus } from '../types';
import { generateSyllabusLogicChain, evaluateSyllabusChain } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  // Pass any necessary props if needed
}

const STORAGE_KEY_SYLLABUS = 'cie_econ_syllabus_status_v1';

const SyllabusTracker: React.FC<Props> = () => {
  const [statusMap, setStatusMap] = useState<Record<string, SyllabusStatus>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SYLLABUS);
    return saved ? JSON.parse(saved) : {};
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({});
  
  const [activeTrainingPoint, setActiveTrainingPoint] = useState<{id: string, text: string, topic: string} | null>(null);
  
  // Training State
  const [studentInput, setStudentInput] = useState("");
  const [trainingFeedback, setTrainingFeedback] = useState("");
  const [modelChain, setModelChain] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SYLLABUS, JSON.stringify(statusMap));
  }, [statusMap]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSubsection = (id: string) => {
    setExpandedSubsections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateStatus = (pointId: string, status: 'R' | 'A' | 'G') => {
    setStatusMap(prev => ({
      ...prev,
      [pointId]: { ...prev[pointId], status }
    }));
  };

  const openTrainer = (sectionId: string, subsectionTitle: string, pointIndex: number, pointText: string) => {
    const uniqueId = `${sectionId}-${subsectionTitle}-${pointIndex}`;
    setActiveTrainingPoint({ id: uniqueId, text: pointText, topic: subsectionTitle });
    
    // Load saved work if any
    const saved = statusMap[uniqueId];
    setStudentInput(saved?.userChain || "");
    setTrainingFeedback(saved?.feedback || "");
    setModelChain(""); // Reset model chain to force re-gen or hide
  };

  const closeTrainer = () => {
    setActiveTrainingPoint(null);
    setStudentInput("");
    setTrainingFeedback("");
    setModelChain("");
  };

  const handleCheckChain = async () => {
    if (!activeTrainingPoint || !studentInput.trim()) return;
    setLoading(true);
    const feedback = await evaluateSyllabusChain(activeTrainingPoint.topic, activeTrainingPoint.text, studentInput);
    setTrainingFeedback(feedback);
    
    // Save to local storage
    setStatusMap(prev => ({
      ...prev,
      [activeTrainingPoint.id]: {
        ...prev[activeTrainingPoint.id],
        userChain: studentInput,
        feedback: feedback,
        lastPracticed: new Date().toISOString()
      }
    }));
    
    setLoading(false);
  };

  const handleShowModel = async () => {
    if (!activeTrainingPoint) return;
    setLoading(true);
    const chain = await generateSyllabusLogicChain(activeTrainingPoint.topic, activeTrainingPoint.text);
    setModelChain(chain);
    setLoading(false);
  };

  return (
    <div className="flex h-full">
      {/* List Area */}
      <div className={`flex-1 overflow-y-auto custom-scroll p-8 ${activeTrainingPoint ? 'hidden md:block md:w-1/2' : 'w-full'}`}>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Syllabus Knowledge Check</h2>
        
        <div className="space-y-4">
          {SYLLABUS_CHECKLIST.map((section) => (
            <div key={section.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
              <button 
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <h3 className="font-bold text-slate-700 text-left">{section.title}</h3>
                <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${expandedSections[section.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {expandedSections[section.id] && (
                <div className="p-4 space-y-4">
                  {section.subsections.map(sub => {
                    const isSubExpanded = expandedSubsections[sub.id];
                    return (
                      <div key={sub.id} className="border border-blue-50 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => toggleSubsection(sub.id)}
                          className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 hover:bg-blue-100/50 transition-colors"
                        >
                          <h4 className="font-semibold text-blue-700 text-sm uppercase tracking-wide text-left">{sub.title}</h4>
                          <svg className={`w-4 h-4 text-blue-400 transform transition-transform ${isSubExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        
                        {isSubExpanded && (
                          <ul className="space-y-3 p-3 bg-white">
                            {sub.points.map((point, idx) => {
                              const uniqueId = `${section.id}-${sub.title}-${idx}`;
                              const currentStatus = statusMap[uniqueId]?.status;
                              
                              return (
                                <li key={idx} className="flex items-start gap-3 group">
                                  <div className="flex-shrink-0 flex gap-1 mt-0.5">
                                    <button 
                                      onClick={() => updateStatus(uniqueId, 'R')}
                                      className={`w-3 h-3 rounded-full border border-red-200 ${currentStatus === 'R' ? 'bg-red-500 ring-2 ring-red-100' : 'bg-white hover:bg-red-100'}`}
                                      title="Red: Needs work"
                                    />
                                    <button 
                                      onClick={() => updateStatus(uniqueId, 'A')}
                                      className={`w-3 h-3 rounded-full border border-amber-200 ${currentStatus === 'A' ? 'bg-amber-500 ring-2 ring-amber-100' : 'bg-white hover:bg-amber-100'}`}
                                      title="Amber: Getting there"
                                    />
                                    <button 
                                      onClick={() => updateStatus(uniqueId, 'G')}
                                      className={`w-3 h-3 rounded-full border border-green-200 ${currentStatus === 'G' ? 'bg-green-500 ring-2 ring-green-100' : 'bg-white hover:bg-green-100'}`}
                                      title="Green: Confident"
                                    />
                                  </div>
                                  <span className="text-sm text-slate-700 leading-snug flex-1">{point}</span>
                                  <button
                                    onClick={() => openTrainer(section.id, sub.title, idx, point)}
                                    className="opacity-0 group-hover:opacity-100 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded hover:bg-indigo-100 transition-all flex-shrink-0"
                                  >
                                    Train Logic
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trainer Panel (Sliding Overlay or Split View) */}
      {activeTrainingPoint && (
        <div className="w-full md:w-1/2 bg-white border-l border-slate-200 shadow-xl flex flex-col h-full z-20 absolute md:static top-0 right-0">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
            <div>
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Logic Chain Trainer</h3>
              <p className="text-xs text-indigo-700 mt-1 max-w-md truncate" title={activeTrainingPoint.topic}>{activeTrainingPoint.topic}</p>
            </div>
            <button onClick={closeTrainer} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-6">
            <div className="mb-6 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Syllabus Point</span>
              <p className="text-lg font-medium text-slate-800 mt-1">{activeTrainingPoint.text}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-600 mb-2">Build your Logic Chain</label>
              <textarea 
                className="w-full h-32 p-4 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700"
                placeholder="Step 1 -> Step 2 -> Step 3..."
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
              />
              <div className="flex gap-2 mt-2 justify-end">
                 <button 
                   onClick={handleShowModel}
                   className="text-xs text-slate-500 hover:text-slate-700 font-medium underline px-2"
                 >
                   Show Model Answer
                 </button>
                 <button 
                   onClick={handleCheckChain}
                   disabled={loading || !studentInput.trim()}
                   className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                 >
                   {loading ? "Thinking..." : "Check Logic"}
                 </button>
              </div>
            </div>

            {modelChain && (
               <div className="mb-6 animate-fade-in-down">
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                     <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       Perfect Model Chain
                     </h4>
                     <div className="prose prose-sm prose-green max-w-none">
                        <ReactMarkdown>{modelChain}</ReactMarkdown>
                     </div>
                  </div>
               </div>
            )}

            {trainingFeedback && (
               <div className="animate-fade-in-up">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                     <h4 className="text-sm font-bold text-slate-700 mb-2">Examiner Feedback</h4>
                     <div className="prose prose-sm prose-slate max-w-none">
                        <ReactMarkdown>{trainingFeedback}</ReactMarkdown>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusTracker;
