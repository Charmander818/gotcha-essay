
import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { gradeEssay } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  question: Question;
  savedInput: string;
  savedFeedback: string;
  onSave: (input: string, feedback: string) => void;
}

const EssayGrader: React.FC<Props> = ({ question, savedInput, savedFeedback, onSave }) => {
  const [input, setInput] = useState(savedInput);
  const [feedback, setFeedback] = useState(savedFeedback);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput(savedInput);
    setFeedback(savedFeedback);
    // Images are not persisted in local storage for now to avoid size limits, reset them on question change
    setImages([]);
  }, [savedInput, savedFeedback, question.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newImages = await Promise.all(
        fileArray.map((file: File) => new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') resolve(reader.result);
                else resolve("");
            };
            reader.readAsDataURL(file);
        }))
    );

    setImages(prev => [...prev, ...newImages.filter(img => img)]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGrade = async () => {
    if (!input && images.length === 0) {
        alert("Please enter text or upload images of your essay.");
        return;
    }
    setLoading(true);
    setFeedback(""); // clear previous
    const result = await gradeEssay(question, input, images);
    setFeedback(result);
    onSave(input, result);
    setLoading(false);
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(feedback);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[95%] mx-auto h-[calc(100vh-8rem)] flex gap-6">
       {/* Left Column: Input (Reduced Width - approx 35%) */}
       <div className="w-[35%] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <h3 className="font-semibold text-slate-700">Student Essay</h3>
             <span className="text-[10px] text-slate-400">Type or upload photos</span>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0">
              <textarea
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    onSave(e.target.value, feedback);
                }}
                placeholder="Type your essay here..."
                className="flex-1 p-4 w-full resize-none focus:outline-none font-serif text-base leading-relaxed text-slate-800"
              />
              
              {/* Image Thumbnails Area */}
              {images.length > 0 && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((img, idx) => (
                           <div key={idx} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group bg-white">
                               <img src={img} alt={`page-${idx+1}`} className="w-full h-full object-cover" />
                               <div className="absolute top-0 right-0 bg-black/60 text-white text-[10px] px-1.5 rounded-bl-lg">
                                  {idx + 1}
                               </div>
                               <button 
                                 onClick={() => removeImage(idx)}
                                 className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                               >
                                  <div className="bg-red-500 text-white p-1 rounded-full">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                  </div>
                               </button>
                           </div>
                        ))}
                      </div>
                  </div>
              )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white flex flex-col gap-2 z-10">
             <div className="flex gap-2 w-full">
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                 >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {images.length > 0 ? 'Add' : 'Photos'}
                 </button>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                    multiple 
                 />
                 <button 
                    onClick={handleGrade}
                    disabled={loading || (!input && images.length === 0)}
                    className="flex-[2] flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md disabled:opacity-50 transition-all text-sm"
                  >
                      {loading ? (
                          <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Grading...
                          </>
                      ) : (
                          <>
                          <span>Grade Essay</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </>
                      )}
                  </button>
             </div>
          </div>
       </div>

       {/* Right Column: Feedback (Expanded Width - approx 65%) */}
       <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <h3 className="font-semibold text-slate-700">Examiner Feedback</h3>
             {feedback && (
                 <button onClick={handleCopy} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                     {copied ? "Copied!" : "Copy Report"}
                 </button>
             )}
          </div>
          <div className="flex-1 overflow-y-auto p-8 custom-scroll">
              {feedback ? (
                  <div className="prose prose-slate max-w-none">
                      <ReactMarkdown>{feedback}</ReactMarkdown>
                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                      <p className="text-lg font-medium">Detailed grading will appear here.</p>
                      <p className="text-sm">Submit your essay to receive feedback.</p>
                  </div>
              )}
          </div>
       </div>
    </div>
  );
};

export default EssayGrader;
