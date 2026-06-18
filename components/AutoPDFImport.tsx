import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { extractMCQsFromImage } from '../services/geminiService';
import { FileUp, Loader2, X, AlertCircle } from 'lucide-react';
import { saveMCQ } from '../utils/indexedDB';
import { MCQ } from '../types';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface AutoPDFImportProps {
    initialPaperCode: string;
    level: 'AS' | 'AL';
    onComplete: () => void;
    onCancel: () => void;
}

export const AutoPDFImport: React.FC<AutoPDFImportProps> = ({ initialPaperCode, level, onComplete, onCancel }) => {
    const [paperCode, setPaperCode] = useState(initialPaperCode);
    const [answersText, setAnswersText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const startImport = async () => {
        if (!file) {
            setError("Please upload a PDF file.");
            return;
        }
        if (!paperCode) {
            setError("Please enter a paper code.");
            return;
        }
        
        setIsProcessing(true);
        setStatus("Loading PDF...");
        setError('');
        
        try {
            const parsedAnswers = answersText.replace(/[^A-D]/gi, '').toUpperCase().split('');
            
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let draftCount = 0;
            
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                setStatus(`Extracting page ${pageNum} of ${pdf.numPages}...`);
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 }); // High resolution for OCR
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) continue;
                
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                await page.render({ canvasContext: ctx, viewport }).promise;
                
                const base64Image = canvas.toDataURL('image/jpeg', 0.9);
                
                try {
                    setStatus(`Running AI extraction on page ${pageNum}...`);
                    const extractedQuestions = await extractMCQsFromImage(base64Image, paperCode, level);
                    
                    if (extractedQuestions && extractedQuestions.length > 0) {
                        const validBboxes = extractedQuestions.filter((eq: any) => eq.bbox && eq.bbox.length === 4);
                        if (validBboxes.length > 0) {
                            const pageMinX = Math.min(...validBboxes.map((eq: any) => eq.bbox[1]));
                            const pageMaxX = Math.max(...validBboxes.map((eq: any) => eq.bbox[3]));
                            
                            for (const eq of extractedQuestions) {
                                if (!eq.bbox || eq.bbox.length !== 4) continue;
                                
                                const [ymin, originalXmin, ymax, originalXmax] = eq.bbox;
                                const xmin = pageMinX;
                                const xmax = pageMaxX;
                                
                                const y = (ymin / 1000) * canvas.height;
                                const x = (xmin / 1000) * canvas.width;
                                const h = ((ymax - ymin) / 1000) * canvas.height;
                                const w = ((xmax - xmin) / 1000) * canvas.width;
                                
                                const pad = 10;
                                const sx = Math.max(0, x - pad);
                                const sy = Math.max(0, y - pad);
                                const sw = Math.min(canvas.width - sx, w + pad * 2);
                                const sh = Math.min(canvas.height - sy, h + pad * 2);
                                
                                const cropCanvas = document.createElement('canvas');
                                cropCanvas.width = sw;
                                cropCanvas.height = sh;
                                const cropCtx = cropCanvas.getContext('2d');
                                
                                if (cropCtx) {
                                    cropCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
                                    const croppedBase64 = cropCanvas.toDataURL('image/jpeg', 0.9);
                                    
                                    const qNum = eq.questionNum || (draftCount + 1);
                                    const ans = parsedAnswers[qNum - 1] || 'A';
                                    
                                    const newMCQ: MCQ = {
                                        id: crypto.randomUUID(),
                                        paper: paperCode,
                                        questionNum: qNum,
                                        topic: eq.topic || "Unclassified",
                                        description: eq.description || "",
                                        questionText: eq.questionText || "",
                                        imageUrl: croppedBase64,
                                        correctAnswer: ans as any,
                                        annotation: '',
                                        isProblematic: false,
                                        isStarred: false
                                    };
                                    
                                    await saveMCQ(newMCQ);
                                    draftCount++;
                                }
                            }
                        }
                    }
                } catch (err: any) {
                    console.error("AI error on page", pageNum, err);
                    setStatus(`Skipped page ${pageNum}: ${err.message || err}`);
                }
                
                if (pageNum < pdf.numPages) {
                    setStatus(`Rate limit pacing: waiting briefly before next page...`);
                    await new Promise(resolve => setTimeout(resolve, 6500));
                }
            }
            
            setStatus(`Done! Imported ${draftCount} questions successfully.`);
            setTimeout(() => {
                onComplete();
            }, 2000);
            
        } catch (err: any) {
            console.error("PDF parsing error", err);
            setError(err.message || "Failed to parse PDF");
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
            <div className="w-full max-w-3xl bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-2xl relative">
                <button onClick={onCancel} className="absolute top-4 right-4 text-gray-500 hover:text-black">
                    <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-3xl font-bold mb-2">Auto PDF Import</h2>
                <p className="text-gray-500 mb-8">Upload past paper PDF. Gemini AI will auto-crop questions, classify topics, and extract OCR text.</p>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Upload PDF File</label>
                        <input type="file" accept="application/pdf" className="w-full text-sm font-mono border-gray-300 p-2 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold mb-1">Paper Code</label>
                        <input type="text" placeholder="e.g. 2021 M/J 11" className="w-full p-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={paperCode} onChange={e => setPaperCode(e.target.value)} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold mb-1">Answers (Optional)</label>
                        <p className="text-xs text-gray-400 mb-1">Paste the answer sequence e.g., A, B, C, D, A... It automatically parses to ABCD format.</p>
                        <textarea className="w-full font-mono text-sm border-gray-300 p-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows={3} value={answersText} onChange={e => setAnswersText(e.target.value)} placeholder="ABCD..."></textarea>
                    </div>
                    
                    {error && (
                        <div className="text-red-600 flex items-center gap-2 bg-red-50 p-4 rounded-xl text-sm font-medium">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    
                    <div className="pt-4">
                        <button disabled={isProcessing || !file || !paperCode} onClick={startImport} className="w-full flex items-center justify-center gap-2 py-4 text-lg bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl font-medium transition-colors">
                            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileUp className="w-6 h-6" />}
                            {isProcessing ? 'Processing (This takes 30-60s limit per page)...' : 'Start Auto Import'}
                        </button>
                    </div>
                    
                    {isProcessing && (
                        <div className="bg-blue-50 rounded-xl p-4 text-blue-800 border border-blue-200 mt-4 text-center font-medium animate-pulse">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
