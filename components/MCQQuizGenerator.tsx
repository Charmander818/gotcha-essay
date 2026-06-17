import React, { useState, useMemo } from 'react';
import { MCQ } from '../types';

interface Props {
  allMcqs: MCQ[];
  onClose: () => void;
  onGenerate: (selectedMcqs: MCQ[]) => void;
  level: 'AS' | 'AL';
}

export const MCQQuizGenerator: React.FC<Props> = ({ allMcqs, onClose, onGenerate, level }) => {
  const [targetCount, setTargetCount] = useState(10);
  const [coverAllTopics, setCoverAllTopics] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  
  const availableTopics = useMemo(() => {
     return Array.from(new Set(allMcqs.filter(m => {
       const isAS = m.paper.split(' ')[2]?.startsWith('1');
       return (isAS && level === 'AS') || (!isAS && level === 'AL');
     }).map(m => m.topic))).sort();
  }, [allMcqs, level]);
  
  const availablePapers = useMemo(() => {
     return Array.from(new Set(allMcqs.filter(m => {
       const isAS = m.paper.split(' ')[2]?.startsWith('1');
       return (isAS && level === 'AS') || (!isAS && level === 'AL');
     }).map(m => m.paper))).sort();
  }, [allMcqs, level]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };
  
  const togglePaper = (paper: string) => {
    setSelectedPapers(prev => prev.includes(paper) ? prev.filter(p => p !== paper) : [...prev, paper]);
  };

  const handleGenerate = () => {
     let candidates = allMcqs.filter(m => {
       const isAS = m.paper.split(' ')[2]?.startsWith('1');
       if (isAS && level !== 'AS') return false;
       if (!isAS && level !== 'AL') return false;
       
       if (selectedPapers.length > 0 && !selectedPapers.includes(m.paper)) return false;
       if (selectedTopics.length > 0 && !selectedTopics.includes(m.topic)) return false;
       
       return true;
     });
     
     // Randomize candidates
     candidates = candidates.sort(() => 0.5 - Math.random());
     
     let finalSet: MCQ[] = [];
     
     if (coverAllTopics && selectedTopics.length > 0) {
        // pick at least 1 from each selected topic if possible
        for (const topic of selectedTopics) {
           const match = candidates.find(c => c.topic === topic && !finalSet.includes(c));
           if (match) finalSet.push(match);
        }
     } else if (coverAllTopics && selectedTopics.length === 0) {
        // pick at least 1 from each available topic
        for (const topic of availableTopics) {
           const match = candidates.find(c => c.topic === topic && !finalSet.includes(c));
           if (match) finalSet.push(match);
        }
     }
     
     // Fill the rest
     for (const c of candidates) {
        if (finalSet.length >= targetCount) break;
        if (!finalSet.includes(c)) finalSet.push(c);
     }
     
     if (finalSet.length > targetCount) {
         finalSet = finalSet.slice(0, targetCount);
     }
     
     // sort by paper and question num
     finalSet.sort((a,b) => {
         if (a.paper !== b.paper) return a.paper.localeCompare(b.paper);
         return a.questionNum - b.questionNum;
     });
     
     onGenerate(finalSet);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Generate Random Quiz Set ({level})</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-red-500">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block font-bold mb-2">Number of Questions (Max 100)</label>
                <input type="number" value={targetCount} onChange={e => setTargetCount(Number(e.target.value))} min={1} max={100} className="border p-2 rounded w-full" />
             </div>
             
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <div className="flex justify-between items-center mb-2">
                     <label className="font-bold">Topics (Leave empty for all)</label>
                     <label className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-2 py-1 border rounded shadow-sm">
                         <input type="checkbox" checked={coverAllTopics} onChange={e => setCoverAllTopics(e.target.checked)} />
                         Cover all selected topics
                     </label>
                 </div>
                 <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                     {availableTopics.map(t => (
                         <button 
                             key={t}
                             onClick={() => toggleTopic(t)}
                             className={`text-xs px-2 py-1 rounded border transition-colors ${selectedTopics.includes(t) ? 'bg-blue-100 border-blue-300 text-blue-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                         >
                             {t}
                         </button>
                     ))}
                 </div>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                 <label className="block font-bold mb-2">Papers (Leave empty for all)</label>
                 <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white border rounded">
                     {availablePapers.map(p => (
                         <button 
                             key={p}
                             onClick={() => togglePaper(p)}
                             className={`text-xs px-2 py-1 rounded border transition-colors ${selectedPapers.includes(p) ? 'bg-purple-100 border-purple-300 text-purple-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                         >
                             {p}
                         </button>
                     ))}
                 </div>
             </div>
          </div>
          
          <div className="mt-6 pt-4 border-t flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 border rounded font-medium hover:bg-slate-50">Cancel</button>
             <button onClick={handleGenerate} className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Generate Quiz</button>
          </div>
       </div>
    </div>
  );
};
