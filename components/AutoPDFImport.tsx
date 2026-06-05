import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { extractMCQsFromImage } from '../services/geminiService';
import { saveMCQ } from '../utils/indexedDB';
import { MCQ } from '../types';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface DraftMCQ {
  id: string;
  paper: string;
  questionNum: number;
  imageUrl: string;
  topic: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export const AutoPDFImport: React.FC<{ onComplete: () => void, onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [paperCode, setPaperCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [drafts, setDrafts] = useState<DraftMCQ[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!paperCode) {
      alert("Please enter a Paper Code first.");
      return;
    }

    setIsProcessing(true);
    setProgress("Loading PDF...");
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      const newDrafts: DraftMCQ[] = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setProgress(`Processing page ${pageNum} / ${totalPages}...`);
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // High res for Gemini and cropping
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport, canvas: context.canvas as any } as any).promise;
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
        
        setProgress(`Extracting questions from page ${pageNum}...`);
        
        try {
           const extractedQuestions = await extractMCQsFromImage(base64Image);
           if (extractedQuestions && extractedQuestions.length > 0) {
               for (const eq of extractedQuestions) {
                   if (!eq.bbox || eq.bbox.length !== 4) continue;
                   
                   // Crop the specific region
                   // bbox is [ymin, xmin, ymax, xmax] from 0-1000
                   const [ymin, xmin, ymax, xmax] = eq.bbox;
                   const y = (ymin / 1000) * canvas.height;
                   const x = (xmin / 1000) * canvas.width;
                   const h = ((ymax - ymin) / 1000) * canvas.height;
                   const w = ((xmax - xmin) / 1000) * canvas.width;
                   
                   // Pad it a bit
                   const pad = 10;
                   const sx = Math.max(0, x - pad);
                   const sy = Math.max(0, y - pad);
                   const sw = Math.min(canvas.width - sx, w + pad * 2);
                   const sh = Math.min(canvas.height - sy, h + pad * 2);
                   
                   const cropCanvas = document.createElement('canvas');
                   cropCanvas.width = sw;
                   cropCanvas.height = sh;
                   const ctx = cropCanvas.getContext('2d');
                   if (ctx) {
                       ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
                       const croppedBase64 = cropCanvas.toDataURL('image/jpeg', 0.9);
                       
                       newDrafts.push({
                           id: crypto.randomUUID(),
                           paper: paperCode,
                           questionNum: eq.questionNum || newDrafts.length + 1,
                           topic: eq.topic || "Unclassified",
                           imageUrl: croppedBase64,
                           correctAnswer: 'A' // default
                       });
                   }
               }
           }
        } catch (err) {
           console.error("Skipping page due to API error", err);
        }
      }
      
      setDrafts(prev => [...prev, ...newDrafts.sort((a,b) => a.questionNum - b.questionNum)]);
    } catch (err: any) {
      setError(err.message || "Failed to process PDF");
    } finally {
      setIsProcessing(false);
      setProgress("");
    }
  };

  const handleSaveAll = async () => {
      setIsProcessing(true);
      try {
          for (const draft of drafts) {
             const mcq: MCQ = {
                 ...draft,
                 isStarred: false,
                 isProblematic: false
             };
             await saveMCQ(mcq);
          }
          onComplete();
      } catch (err) {
          setError("Failed to save to database");
      } finally {
          setIsProcessing(false);
      }
  };

  const removeDraft = (id: string) => {
      setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const updateDraft = (id: string, field: string, value: any) => {
      setDrafts(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 bg-opacity-70 flex items-center justify-center p-4">
       <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
           <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
               <div>
                  <h2 className="text-2xl font-bold text-slate-800">Auto PDF Slicer</h2>
                  <p className="text-slate-500 text-sm">Upload a past paper PDF and AI will automatically crop questions and classify topics.</p>
               </div>
               <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
           </div>
           
           <div className="p-6 overflow-y-auto flex-1 bg-slate-100">
               {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6 border border-red-200">{error}</div>}
               
               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 flex gap-4 items-end">
                  <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Paper Code (e.g. 9708_m23_qp_12)</label>
                      <input 
                          type="text" 
                          value={paperCode}
                          onChange={e => setPaperCode(e.target.value)}
                          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 border-slate-300" 
                          placeholder="Enter paper code here"
                      />
                  </div>
                  <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Select Question Paper PDF</label>
                      <input 
                          type="file" 
                          accept="application/pdf"
                          ref={fileInputRef}
                          onChange={processPDF}
                          disabled={isProcessing || !paperCode}
                          className="w-full border p-1 rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" 
                      />
                  </div>
               </div>

               {isProcessing && (
                   <div className="bg-blue-50 text-blue-700 p-4 rounded border border-blue-200 flex items-center gap-3 animate-pulse">
                       <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       <span className="font-bold">{progress}</span>
                   </div>
               )}

               {drafts.length > 0 && (
                   <div>
                       <div className="flex justify-between items-center mb-4">
                           <h3 className="font-bold text-lg">Extracted Questions ({drafts.length})</h3>
                           <button onClick={handleSaveAll} disabled={isProcessing} className="bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 shadow-sm disabled:opacity-50">
                               Import All to Bank
                           </button>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {drafts.map((draft, idx) => (
                               <div key={draft.id} className="bg-white border rounded shadow-sm flex flex-col p-4 relative">
                                   <button 
                                      onClick={() => removeDraft(draft.id)}
                                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded-full px-2 text-xs font-bold transition-colors"
                                   >
                                       Remove
                                   </button>
                                   <div className="font-bold text-slate-800 mb-2">Q{draft.questionNum} (Extracted)</div>
                                   <div className="bg-slate-100 p-2 rounded mb-3 flex items-center justify-center min-h-[150px]">
                                       <img src={draft.imageUrl} alt="Extracted" className="max-w-full max-h-[300px] object-contain border bg-white" />
                                   </div>
                                   <div className="space-y-2 mt-auto">
                                       <div>
                                           <label className="text-xs font-bold text-slate-500 mb-1 block">Topic Classification</label>
                                           <input 
                                                type="text" 
                                                value={draft.topic} 
                                                onChange={e => updateDraft(draft.id, 'topic', e.target.value)}
                                                className="w-full border p-1 rounded text-sm bg-blue-50 border-blue-200 focus:bg-white"
                                           />
                                       </div>
                                       <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-slate-500 mb-1 block">Q Number</label>
                                                <input 
                                                    type="number" 
                                                    value={draft.questionNum} 
                                                    onChange={e => updateDraft(draft.id, 'questionNum', parseInt(e.target.value) || 0)}
                                                    className="w-full border p-1 rounded text-sm"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-slate-500 mb-1 block">Default Answer</label>
                                                <select
                                                    value={draft.correctAnswer}
                                                    onChange={(e) => updateDraft(draft.id, 'correctAnswer', e.target.value)}
                                                    className="w-full border p-1 rounded text-sm"
                                                >
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="C">C</option>
                                                    <option value="D">D</option>
                                                </select>
                                            </div>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};
