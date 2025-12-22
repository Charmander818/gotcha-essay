
import React, { useState } from 'react';
import { SYLLABUS_CHECKLIST } from '../syllabusChecklistData';
import { SyllabusStatus } from '../types';
import { generateSyllabusLogicChain, evaluateSyllabusChain } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  statusMap: Record<string, SyllabusStatus>;
  onUpdateStatus: React.Dispatch<React.SetStateAction<Record<string, SyllabusStatus>>>;
}

const SyllabusTracker: React.FC<Props> = ({ statusMap, onUpdateStatus }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({});
  
  const [activeTrainingPoint, setActiveTrainingPoint] = useState<{id: string, text: string, topic: string} | null>(null);
  
  // Training State
  const [studentInput, setStudentInput] = useState("");
  const [trainingFeedback, setTrainingFeedback] = useState("");
  const [modelChain, setModelChain] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Bulk Gen State
  const [generatingSectionId, setGeneratingSectionId] = useState<string | null>(null);
  const [progress, setProgress] = useState("");

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSubsection = (id: string) => {
    setExpandedSubsections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateStatus = (pointId: string, status: 'R' | 'A' | 'G') => {
    onUpdateStatus(prev => ({
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
    setModelChain(saved?.modelChain || ""); 
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
    
    onUpdateStatus(prev => ({
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
    
    // Check if we already have it in state
    if (statusMap[activeTrainingPoint.id]?.modelChain) {
        setModelChain(statusMap[activeTrainingPoint.id].modelChain!);
        return;
    }

    setLoading(true);
    const chain = await generateSyllabusLogicChain(activeTrainingPoint.topic, activeTrainingPoint.text);
    setModelChain(chain);
    
    onUpdateStatus(prev => ({
        ...prev,
        [activeTrainingPoint.id]: {
            ...prev[activeTrainingPoint.id],
            modelChain: chain
        }
    }));
    setLoading(false);
  };

  const handleCopyText = (text: string) => {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
  };

  // --- Bulk Operations ---

  const handleBulkGenerate = async (sectionId: string, subTitle: string, points: string[]) => {
      if (!confirm(`Generate logic chains for all ${points.length} points in "${subTitle}"? This may take a minute.`)) return;
      
      setGeneratingSectionId(subTitle);
      
      for (let i = 0; i < points.length; i++) {
          const uniqueId = `${sectionId}-${subTitle}-${i}`;
          
          // Skip if already exists to save tokens/time
          if (statusMap[uniqueId]?.modelChain) {
              setProgress(`${i+1}/${points.length} (Skipping existing...)`);
              continue;
          }

          setProgress(`${i+1}/${points.length} Generating...`);
          try {
              const chain = await generateSyllabusLogicChain(subTitle, points[i]);
              
              onUpdateStatus(prev => ({
                  ...prev,
                  [uniqueId]: {
                      ...prev[uniqueId],
                      modelChain: chain
                  }
              }));
              
              // Small delay to be nice to the API
              await new Promise(r => setTimeout(r, 1500));
          } catch (e) {
              console.error("Failed to generate for point " + i, e);
          }
      }
      
      setGeneratingSectionId(null);
      setProgress("");
      alert("Bulk generation complete!");
  };

  const handleExportWord = (sectionId: string, subTitle: string, points: string[]) => {
      const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${subTitle} Logic Chains</title>
      <style>
        body { font-family: 'Calibri', sans-serif; }
        h1 { color: #1e3a8a; }
        .chain-box { border: 1px solid #ccc; padding: 10px; margin-bottom: 15px; background: #f9f9f9; }
        .point { font-weight: bold; margin-bottom: 5px; color: #333; }
        .chain { color: #047857; }
      </style>
      </head><body>`;
      
      let html = `<h1>Logic Chains: ${subTitle}</h1>`;
      
      points.forEach((point, i) => {
          const uniqueId = `${sectionId}-${subTitle}-${i}`;
          const chain = statusMap[uniqueId]?.modelChain || "(No logic chain generated yet)";
          
          html += `<div class="chain-box">
            <div class="point">${point}</div>
            <div class="chain"><strong>Logic Chain:</strong><br/>${chain.replace(/\n/g, '<br/>')}</div>
          </div>`;
      });
      
      html += "</body></html>";
      
      const blob = new Blob([header + html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LogicChains_${subTitle.replace(/[^a-z0-9]/gi, '_')}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleCopyAll = (sectionId: string, subTitle: string, points: string[]) => {
      let text = `LOGIC CHAINS: ${subTitle}\n\n`;
      
      points.forEach((point, i) => {
          const uniqueId = `${sectionId}-${subTitle}-${i}`;
          const chain = statusMap[uniqueId]?.modelChain || "(No logic chain generated yet)";
          text += `POINT: ${point}\nCHAIN:\n${chain}\n\n-------------------\n\n`;
      });
      
      navigator.clipboard.writeText(text);
      alert("All logic chains for this section copied to clipboard!");
  };

  // Helper to group points with same numbering prefix (e.g. 1.1.1)
  const processSyllabusPoints = (points: string[]) => {
    const processed: ({ type: 'group'; header: string; items: { idx: number; text: string }[] } | { type: 'single'; item: { idx: number; text: string } })[] = [];
    
    points.forEach((point, idx) => {
        // Match pattern "1.1.1 Title: Content"
        const match = point.match(/^(\d+(?:\.\d+)*\s+[^:]+):\s+(.+)$/);
        
        if (match) {
            const header = match[1].trim();
            const content = match[2].trim();
            
            const last = processed[processed.length - 1];
            if (last && last.type === 'group' && last.header === header) {
                last.items.push({ idx, text: content });
            } else {
                processed.push({ type: 'group', header, items: [{ idx, text: content }] });
            }
        } else {
            processed.push({ type: 'single', item: { idx, text: point } });
        }
    });
    return processed;
  };

  const renderPointRow = (sectionId: string, subTitle: string, idx: number, pointText: string) => {
      const uniqueId = `${sectionId}-${subTitle}-${idx}`;
      const currentStatus = statusMap[uniqueId]?.status;
      const hasModel = !!statusMap[uniqueId]?.modelChain;

      return (
        <div key={idx} className="flex items-start gap-3 group">
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
          <div className="flex-1">
              <span className="text-sm text-slate-700 leading-snug">{pointText}</span>
              {hasModel && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700">
                      Chain Ready
                  </span>
              )}
          </div>
          <button
            onClick={() => openTrainer(sectionId, subTitle, idx, pointText)}
            className="opacity-0 group-hover:opacity-100 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded hover:bg-indigo-100 transition-all flex-shrink-0"
          >
            Train
          </button>
        </div>
      );
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
                    const isGenerating = generatingSectionId === sub.title;

                    return (
                      <div key={sub.id} className="border border-blue-50 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between bg-blue-50 px-3 py-2">
                            <button 
                              onClick={() => toggleSubsection(sub.id)}
                              className="flex items-center gap-2 flex-1 text-left hover:text-blue-800 transition-colors"
                            >
                              <h4 className="font-semibold text-blue-700 text-sm uppercase tracking-wide">{sub.title}</h4>
                              <svg className={`w-4 h-4 text-blue-400 transform transition-transform ${isSubExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            
                            {isSubExpanded && (
                                <div className="flex items-center gap-2">
                                    {isGenerating ? (
                                        <span className="text-[10px] font-bold text-blue-600 animate-pulse">{progress}</span>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => handleBulkGenerate(section.id, sub.title, sub.points)}
                                                className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-100 transition-colors shadow-sm"
                                                title="Generate All Logic Chains"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleExportWord(section.id, sub.title, sub.points)}
                                                className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-100 transition-colors shadow-sm"
                                                title="Export to Word"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleCopyAll(section.id, sub.title, sub.points)}
                                                className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-100 transition-colors shadow-sm"
                                                title="Copy All"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {isSubExpanded && (
                          <div className="p-3 bg-white space-y-3">
                            {processSyllabusPoints(sub.points).map((groupOrSingle, groupIdx) => {
                               if (groupOrSingle.type === 'group') {
                                   return (
                                       <div key={groupIdx} className="mb-4">
                                           <div className="inline-block px-2 py-1 mb-2 bg-slate-100 text-slate-600 text-xs font-bold rounded border border-slate-200">
                                               {groupOrSingle.header}
                                           </div>
                                           <div className="ml-2 pl-3 border-l-2 border-slate-100 space-y-3">
                                               {groupOrSingle.items.map(item => renderPointRow(section.id, sub.title, item.idx, item.text))}
                                           </div>
                                       </div>
                                   )
                               } else {
                                   return (
                                       <div key={groupIdx} className="mb-3">
                                           {renderPointRow(section.id, sub.title, groupOrSingle.item.idx, groupOrSingle.item.text)}
                                       </div>
                                   )
                               }
                            })}
                          </div>
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
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 relative group">
                     <div className="flex justify-between items-start mb-2">
                         <h4 className="text-sm font-bold text-green-800 flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           Perfect Model Chain
                         </h4>
                         <button 
                            onClick={() => handleCopyText(modelChain)}
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors"
                            title="Copy to Clipboard"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                         </button>
                     </div>
                     <div className="prose prose-sm prose-green max-w-none">
                        <ReactMarkdown>{modelChain}</ReactMarkdown>
                     </div>
                  </div>
               </div>
            )}

            {trainingFeedback && (
               <div className="animate-fade-in-up">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 relative group">
                     <div className="flex justify-between items-start mb-2">
                         <h4 className="text-sm font-bold text-slate-700">Examiner Feedback</h4>
                         <button 
                            onClick={() => handleCopyText(trainingFeedback)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 transition-colors"
                            title="Copy to Clipboard"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                         </button>
                     </div>
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
