import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { extractMCQsFromImage } from '../services/geminiService';
import { saveMCQ } from '../utils/indexedDB';
import { MCQ } from '../types';
import { ALL_TOPICS } from '../utils/topicHelpers';

import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

interface DraftMCQ {
  id: string;
  paper: string;
  questionNum: number;
  imageUrl: string;
  topic: string;
  description?: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  annotation?: string;
}

export const AutoPDFImport: React.FC<{ initialPaperCode: string, level?: 'AS' | 'AL', onComplete: () => void, onCancel: () => void }> = ({ initialPaperCode, level, onComplete, onCancel }) => {
  const [step, setStep] = useState<number>(1);
  const [paperCode, setPaperCode] = useState(initialPaperCode);
  const [bulkAnswers, setBulkAnswers] = useState<string>('');
  const [parsedAnswers, setParsedAnswers] = useState<('A'|'B'|'C'|'D')[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [drafts, setDrafts] = useState<DraftMCQ[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNextStep2 = () => {
      if (!paperCode) {
          setError("Paper code is required.");
          return;
      }
      setError(null);
      setStep(2);
  };

  const handleNextStep3 = () => {
      const answers = bulkAnswers.replace(/[^A-D]/gi, '').toUpperCase().split('') as ('A'|'B'|'C'|'D')[];
      setParsedAnswers(answers);
      setStep(3);
  };

  const processPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        
        // Anti-Rate Limit Delay (wait ~4.5 seconds between pages to respect 15 RPM free tier limit)
        if (pageNum > 1) {
            setProgress(`Pacing API requests... waiting 4.5s before page ${pageNum}`);
            await new Promise(resolve => setTimeout(resolve, 4500));
            setProgress(`Extracting questions from page ${pageNum}...`);
        }
        
        try {
           const extractedQuestions = await extractMCQsFromImage(base64Image, paperCode, level);
           if (extractedQuestions && extractedQuestions.length > 0) {
               // Find uniform width for all questions on this page
               const validBboxes = extractedQuestions.filter((eq: any) => eq.bbox && eq.bbox.length === 4);
               if (validBboxes.length > 0) {
                   const pageMinX = Math.min(...validBboxes.map((eq: any) => eq.bbox[1]));
                   const pageMaxX = Math.max(...validBboxes.map((eq: any) => eq.bbox[3]));

                   for (const eq of extractedQuestions) {
                       if (!eq.bbox || eq.bbox.length !== 4) continue;
                       
                       // Crop the specific region, using uniform left and right boundaries
                       // bbox is [ymin, xmin, ymax, xmax] from 0-1000
                       const [ymin, originalXmin, ymax, originalXmax] = eq.bbox;
                       const xmin = pageMinX;
                       const xmax = pageMaxX;
                       
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
                       
                       const qNum = eq.questionNum || newDrafts.length + 1;
                       newDrafts.push({
                           id: crypto.randomUUID(),
                           paper: paperCode,
                           questionNum: qNum,
                           topic: eq.topic || "Unclassified",
                           description: eq.description || "",
                           imageUrl: croppedBase64,
                           correctAnswer: parsedAnswers[qNum - 1] || 'A',
                           annotation: ''
                       });
                   }
               }
           }
               }
        } catch (err: any) {
           console.error("Stopping process due to API error", err);
           throw err; // Forward error to stop the entire processing loop
        }
      }
      
      // Fill gaps for missing questions
      const sortedDrafts = newDrafts.sort((a,b) => a.questionNum - b.questionNum);
      const FinalDrafts: DraftMCQ[] = [];
      
      if (sortedDrafts.length > 0) {
          const maxQ = Math.max(30, sortedDrafts[sortedDrafts.length - 1].questionNum); // Expect at least 30 questions
          for (let i = 1; i <= maxQ; i++) {
              const existing = sortedDrafts.find(d => d.questionNum === i);
              if (existing) {
                  FinalDrafts.push(existing);
              } else {
                  FinalDrafts.push({
                      id: crypto.randomUUID(),
                      paper: paperCode,
                      questionNum: i,
                      topic: "Unclassified",
                      description: "Image not recognized. Please scan manually or paste later.",
                      imageUrl: "",
                      correctAnswer: parsedAnswers[i - 1] || 'A',
                      annotation: ''
                  });
              }
          }
      }

      setDrafts(prev => {
          const combined = [...prev, ...FinalDrafts];
          // Remove duplicates if same questionNum
          const unique = new Map<number, DraftMCQ>();
          combined.forEach(d => unique.set(d.questionNum, d));
          return Array.from(unique.values()).sort((a,b) => a.questionNum - b.questionNum);
      });
      setStep(4);
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
                  <h2 className="text-2xl font-bold text-slate-800">Auto PDF Slicer Wizard</h2>
                  <p className="text-slate-500 text-sm">Step {step} of 4</p>
               </div>
               <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
           </div>
           
           <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex flex-col items-center">
               <div className="w-full max-w-3xl">
                   {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6 border border-red-200">{error}</div>}
                   
                   {step === 1 && (
                       <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                           <h3 className="text-xl font-bold text-slate-800 mb-2">Step 1: Confirm Paper Code</h3>
                           <p className="text-slate-500 mb-6">Select the paper you are going to import questions into.</p>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Paper Code (e.g. 9708_m23_qp_12)</label>
                           <input 
                               type="text" 
                               value={paperCode}
                               onChange={e => setPaperCode(e.target.value)}
                               className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 border-slate-300 text-lg mb-6" 
                               placeholder="Enter paper code here"
                           />
                           <div className="flex justify-end">
                               <button onClick={handleNextStep2} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Next Step</button>
                           </div>
                       </div>
                   )}

                   {step === 2 && (
                       <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                           <h3 className="text-xl font-bold text-slate-800 mb-2">Step 2: Enter Answers</h3>
                           <p className="text-slate-500 mb-6">Paste the answer string for the 30 questions. This will auto-fill the correct answers.</p>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Answers String (e.g. C A B ...)</label>
                           <textarea 
                               value={bulkAnswers}
                               onChange={e => setBulkAnswers(e.target.value)}
                               className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 border-slate-300 font-mono tracking-widest uppercase mb-2 h-32" 
                               placeholder="Paste answers here..."
                           />
                           <p className="text-xs text-slate-500 font-medium mb-6">Detected {bulkAnswers.replace(/[^A-D]/gi, '').length} answers.</p>
                           
                           <div className="flex justify-between">
                               <button onClick={() => setStep(1)} className="text-slate-600 px-4 py-2 rounded hover:bg-slate-100 font-bold">Back</button>
                               <button onClick={handleNextStep3} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Next Step</button>
                           </div>
                       </div>
                   )}

                   {step === 3 && (
                       <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                           <h3 className="text-xl font-bold text-slate-800 mb-2">Step 3: Upload PDF</h3>
                           <p className="text-slate-500 mb-6">Upload the question paper PDF. Please wait while AI extracts and crops the questions.</p>
                           
                           {!isProcessing ? (
                               <>
                                 <label className="block text-sm font-bold text-slate-700 mb-2">Select Question Paper PDF</label>
                                 <input 
                                     type="file" 
                                     accept="application/pdf"
                                     ref={fileInputRef}
                                     onChange={processPDF}
                                     className="w-full border p-4 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors mb-6" 
                                 />
                                 <div className="flex justify-between mt-4">
                                     <button onClick={() => setStep(2)} className="text-slate-600 px-4 py-2 rounded hover:bg-slate-100 font-bold">Back</button>
                                 </div>
                               </>
                           ) : (
                               <div className="bg-blue-50 text-blue-700 p-6 rounded-lg border border-blue-200 flex flex-col items-center justify-center gap-4 animate-pulse h-48">
                                   <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                   </svg>
                                   <span className="font-bold text-lg">{progress}</span>
                               </div>
                           )}
                       </div>
                   )}
               </div>

               {step === 4 && drafts.length === 0 && (
                   <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4">
                       <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
                           <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                           </div>
                           <h3 className="text-xl font-bold text-slate-800 mb-2">No Questions Extracted</h3>
                           <p className="text-slate-500 mb-6">We couldn't extract any questions from this PDF. This could be due to an API restriction or the PDF format.</p>
                           <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Try Again</button>
                       </div>
                   </div>
               )}

               {step === 4 && drafts.length > 0 && (
                   <div className="w-full animate-in fade-in slide-in-from-bottom-4">
                       <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl border shadow-sm sticky top-0 z-10">
                           <div>
                               <h3 className="font-bold text-lg">Step 4: Review and Edit</h3>
                               <p className="text-sm text-slate-500">Check extracted questions, add explanations, and save.</p>
                           </div>
                           <button onClick={handleSaveAll} disabled={isProcessing} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 shadow-sm disabled:opacity-50">
                               {isProcessing ? 'Saving...' : 'Save All & Exit'}
                           </button>
                       </div>
                       
                       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                           {drafts.map((draft, idx) => (
                               <div key={draft.id} className="bg-white border rounded shadow-sm flex flex-col p-4 relative">
                                   <button 
                                      onClick={() => removeDraft(draft.id)}
                                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded-full px-3 text-xs font-bold transition-colors"
                                   >
                                       Remove
                                   </button>
                                   <div className="font-bold text-slate-800 mb-2">Q{draft.questionNum}</div>
                                   <div className="bg-slate-100 p-2 rounded mb-3 flex items-center justify-center min-h-[250px] relative">
                                       {draft.imageUrl ? (
                                           <img src={draft.imageUrl} alt="Extracted" className="w-full max-h-[500px] object-contain border bg-white" />
                                       ) : (
                                           <div className="text-center p-4">
                                               <p className="text-slate-400 font-bold mb-2">No Image Extracted.</p>
                                               <p className="text-sm text-slate-500">Question missed by AI. Card created as placeholder. You can paste an image later in the Edit screen.</p>
                                           </div>
                                       )}
                                   </div>
                                   <div className="space-y-3 mt-auto">
                                       <div>
                                           <label className="text-xs font-bold text-slate-500 mb-1 block">Topic Classification</label>
                                           <select 
                                                value={draft.topic} 
                                                onChange={e => updateDraft(draft.id, 'topic', e.target.value)}
                                                className="w-full border p-1 border-blue-200 rounded text-sm bg-blue-50 focus:bg-white"
                                           >
                                               {ALL_TOPICS.map(t => (
                                                   <option key={t.text} value={t.text}>{t.text}</option>
                                               ))}
                                               <option value="Unclassified">Unclassified</option>
                                           </select>
                                       </div>
                                       <div>
                                           <label className="text-xs font-bold text-slate-500 mb-1 block">Concept Description</label>
                                           <input 
                                                type="text" 
                                                value={draft.description || ''} 
                                                onChange={e => updateDraft(draft.id, 'description', e.target.value)}
                                                className="w-full border p-1 border-blue-200 rounded text-sm bg-blue-50 focus:bg-white"
                                                placeholder="e.g. Positive and Normative Statements"
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
                                                <label className="text-xs font-bold text-slate-500 mb-1 block">Answer</label>
                                                <select
                                                    value={draft.correctAnswer}
                                                    onChange={(e) => updateDraft(draft.id, 'correctAnswer', e.target.value)}
                                                    className="w-full border p-1 rounded text-sm font-bold"
                                                    style={{color: draft.correctAnswer ? '#059669' : ''}}
                                                >
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="C">C</option>
                                                    <option value="D">D</option>
                                                </select>
                                            </div>
                                       </div>
                                       <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">Explanation / Annotation</label>
                                            <textarea 
                                                value={draft.annotation || ''} 
                                                onChange={e => updateDraft(draft.id, 'annotation', e.target.value)}
                                                className="w-full border p-2 rounded text-sm"
                                                placeholder="Add explanation for this question..."
                                                rows={2}
                                            />
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
