import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { MCQ } from '../types';
import { getMCQs, saveMCQ, deleteMCQ, getAllMCQsForExport, restoreMCQsFromImport } from '../utils/indexedDB';
import { SYLLABUS_CHECKLIST } from '../syllabusChecklistData';
import { exportPracticeBook } from '../utils/mcqExport';
import { ALL_TOPICS } from '../utils/topicHelpers';
import { AutoPDFImport } from './AutoPDFImport';
import { MCQQuizGenerator } from './MCQQuizGenerator';
import { generateAnalysisForMCQ, generateExplanationForMCQ, extractQuestionStemForMCQ } from '../services/geminiService';

const PAPER_CODES = [
  "2021 F/M 12", "2021 M/J 11", "2021 M/J 12", "2021 M/J 13", "2021 O/N 11", "2021 O/N 12", "2021 O/N 13",
  "2022 F/M 12", "2022 M/J 11", "2022 M/J 12", "2022 M/J 13", "2022 M/J 14", "2022 O/N 11", "2022 O/N 12", "2022 O/N 13",
  "2023 F/M 12", "2023 M/J 11", "2023 M/J 12", "2023 M/J 13", "2023 O/N 11", "2023 O/N 12", "2023 O/N 13",
  "2024 F/M 12", "2024 M/J 11", "2024 M/J 12", "2024 M/J 13", "2024 O/N 11", "2024 O/N 12", "2024 O/N 13",
  "2025 F/M 12", "2025 M/J 11", "2025 M/J 12", "2025 M/J 13", "2025 M/J 14", "2025 O/N 11", "2025 O/N 12", "2025 O/N 13", "2025 O/N 14",
  "2021 F/M 32", "2021 M/J 31", "2021 M/J 32", "2021 M/J 33", "2021 O/N 31", "2021 O/N 32", "2021 O/N 33",
  "2022 F/M 32", "2022 M/J 31", "2022 M/J 32", "2022 M/J 33", "2022 M/J 34", "2022 O/N 31", "2022 O/N 32", "2022 O/N 33",
  "2023 F/M 32", "2023 M/J 31", "2023 M/J 32", "2023 M/J 33", "2023 O/N 31", "2023 O/N 32", "2023 O/N 33",
  "2024 F/M 32", "2024 M/J 31", "2024 M/J 32", "2024 M/J 33", "2024 O/N 31", "2024 O/N 32", "2024 O/N 33",
  "2025 F/M 32", "2025 M/J 31", "2025 M/J 32", "2025 M/J 33", "2025 M/J 34", "2025 O/N 31", "2025 O/N 32", "2025 O/N 33", "2025 O/N 34"
].sort((a,b) => {
    const yearA = a.substring(0, 4);
    const yearB = b.substring(0, 4);
    if (yearA !== yearB) return yearB.localeCompare(yearA);
    return a.substring(5).localeCompare(b.substring(5));
});

 

export const MCQBank: React.FC = () => {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isExtractingStem, setIsExtractingStem] = useState(false);
  const [isBulkExtracting, setIsBulkExtracting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{current: number, total: number} | null>(null);
  const [isGeneratingExp, setIsGeneratingExp] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Filters & Navigation
  const [selectedLevel, setSelectedLevel] = useState<'AS' | 'AL'>('AS');
  const [selectedFilterType, setSelectedFilterType] = useState<'PAPER' | 'TOPIC'>('PAPER');
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Year grouping for sidebar
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>(() => {
     const years = Array.from(new Set(PAPER_CODES.map(c => c.split(' ')[0])));
     const initial: Record<string, boolean> = {};
     years.forEach(y => initial[y] = y === "2025");
     return initial;
  });

  // Form State
  const [newPaper, setNewPaper] = useState(PAPER_CODES[0]);
  const [newQuestionNum, setNewQuestionNum] = useState<number>(1);
  const [newTopic, setNewTopic] = useState<string>(ALL_TOPICS[0].text);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D' | 'X'>('A');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAutoImport, setShowAutoImport] = useState(false);
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState<string>('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [viewingMCQ, setViewingMCQ] = useState<MCQ | null>(null);
  
  // Bulk Answers State
  const [bulkAnswers, setBulkAnswers] = useState<Record<string, string>>({});
  const [bulkInput, setBulkInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMCQs();
  }, []);

  useEffect(() => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedFilterValue, selectedFilterType, selectedLevel]);

  const startAdding = () => {
      setEditingId(null);
      setImagePreview(null);
      setNewAnnotation('');
      setNewDescription('');
      setNewQuestionText('');
      if (isAdding) {
          setIsAdding(false);
          return;
      }
      setIsAdding(true);
      mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      if (selectedFilterType === 'PAPER' && selectedFilterValue !== 'All') {
          setNewPaper(selectedFilterValue);
          const questionsForPaper = mcqs.filter(m => m.paper === selectedFilterValue);
          if (questionsForPaper.length > 0) {
              const maxQNum = Math.max(...questionsForPaper.map(m => m.questionNum));
              setNewQuestionNum(maxQNum + 1);
          } else {
              setNewQuestionNum(1);
          }
      }
  };

  const getAnswerFromBulkContent = (paper: string, qNum: number, bulkData: Record<string, string>): 'A'|'B'|'C'|'D'|'X'|null => {
      if (bulkData[paper]) {
         const ansString = bulkData[paper];
         const index = qNum - 1;
         if (index >= 0 && index < ansString.length) {
             const char = ansString.charAt(index).toUpperCase();
             if (['A','B','C','D','X'].includes(char)) {
                 return char as 'A'|'B'|'C'|'D'|'X';
             }
         }
      }
      return null;
  };

  // Update correct answer automatically if bulk answers exist for this paper
  useEffect(() => {
     const ans = getAnswerFromBulkContent(newPaper, newQuestionNum, bulkAnswers);
     if (ans) setNewCorrectAnswer(ans);
  }, [newPaper, newQuestionNum, bulkAnswers]);

  const loadMCQs = async () => {
    const loaded = await getMCQs();
    setMcqs(loaded.sort((a,b) => a.questionNum - b.questionNum));
  };

  const handleGenerateAnalysis = async () => {
      if (!imagePreview) return;
      setIsGeneratingDesc(true);
      try {
          const result = await generateAnalysisForMCQ(imagePreview, selectedLevel);
          setNewDescription(result.description);
          setNewTopic(result.topic);
      } catch (e) {
          alert("Failed to analyze question.");
      } finally {
          setIsGeneratingDesc(false);
      }
  };

  const handleExtractStem = async () => {
      if (!imagePreview) return;
      setIsExtractingStem(true);
      try {
          const stem = await extractQuestionStemForMCQ(imagePreview);
          setNewQuestionText(stem);
      } catch (e) {
          alert("Failed to extract stem.");
      } finally {
          setIsExtractingStem(false);
      }
  };

  const handleBulkExtract = async () => {
      const toProcess = filteredMcqs.filter(q => !q.questionText && q.imageUrl);
      if (toProcess.length === 0) {
          alert("No questions in the current view need text extraction (or they don't have images).");
          return;
      }
      if (!confirm(`Are you sure you want to extract text for ${toProcess.length} questions? This may take some time.`)) return;

      setIsBulkExtracting(true);
      setBulkProgress({current: 0, total: toProcess.length});

      let current = 0;
      for (const q of toProcess) {
          try {
              if (q.imageUrl) {
                  const stem = await extractQuestionStemForMCQ(q.imageUrl);
                  if (stem && !stem.startsWith('Extraction failed')) {
                      const updated = { ...q, questionText: stem };
                      await saveMCQ(updated);
                      // Update local state smoothly without full reload if possible, 
                      // but we will do a fast update the array reference
                      setMcqs(prev => prev.map(m => m.id === q.id ? updated : m));
                  }
              }
          } catch (e) {
              console.error("Failed to extract for", q.id, e);
          }
          current++;
          setBulkProgress({current, total: toProcess.length});
      }
      
      setIsBulkExtracting(false);
      setBulkProgress(null);
  };

  const handleGenerateExplanation = async () => {
      if (!viewingMCQ || !viewingMCQ.imageUrl) return;
      setIsGeneratingExp(true);
      try {
          const exp = await generateExplanationForMCQ(viewingMCQ.imageUrl, viewingMCQ.correctAnswer);
          const updated = { ...viewingMCQ, aiExplanation: exp };
          await saveMCQ(updated);
          setViewingMCQ(updated);
          setMcqs(prev => prev.map(m => m.id === updated.id ? updated : m));
      } catch (e: any) {
          console.error(e);
          alert(`Failed to generate AI explanation. ${e?.message || e}`);
      } finally {
          setIsGeneratingExp(false);
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file?: File) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
                handleFile(blob);
            }
        }
    }
  };

  const saveBulkString = () => {
      const sanitized = bulkInput.replace(/[^A-Da-d]/g, '').toUpperCase();
      if(sanitized.length > 0) {
          setBulkAnswers(prev => ({ ...prev, [newPaper]: sanitized }));
          setBulkInput('');
          alert(`Saved ${sanitized.length} answers for Paper ${newPaper}`);
      }
  };

  const handleSave = async () => {
    if (!imagePreview) {
      alert("Please upload or paste an image for the question.");
      return;
    }
    const newMcq: MCQ = {
      id: editingId || (Date.now().toString() + Math.random().toString(36).substr(2, 6)),
      paper: newPaper,
      questionNum: newQuestionNum,
      imageUrl: imagePreview,
      topic: newTopic,
      description: newDescription,
      questionText: newQuestionText,
      correctAnswer: newCorrectAnswer,
      annotation: newAnnotation,
    };
    await saveMCQ(newMcq);
    await loadMCQs();
    
    if (editingId) {
        // DO NOT reset editing state here, so the user can use Next/Prev
        // setEditingId(null);
        // setIsAdding(false);
        alert("Updated Successfully!");
    } else {
        // Auto-prepare for next question
        const nextQNum = newQuestionNum + 1;
        setNewQuestionNum(nextQNum);
        setImagePreview(null);
        setNewAnnotation('');
        setNewDescription('');
        setNewQuestionText('');
        if(fileInputRef.current) fileInputRef.current.value = "";
        
        // Synchronously set the next correct answer if we have bulk data
        const nextAns = getAnswerFromBulkContent(newPaper, nextQNum, bulkAnswers);
        if (nextAns) setNewCorrectAnswer(nextAns);
    }
  };

  const startEdit = (e: React.MouseEvent | null, q: MCQ) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setIsAdding(true);
      setEditingId(q.id);
      setNewPaper(q.paper);
      setNewQuestionNum(q.questionNum);
      setNewTopic(q.topic);
      setNewDescription(q.description || '');
      setNewQuestionText(q.questionText || '');
      setNewCorrectAnswer(q.correctAnswer);
      setImagePreview(q.imageUrl);
      setNewAnnotation(q.annotation || '');
      mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateEdit = (direction: 'next' | 'prev') => {
      const currentIndex = filteredMcqs.findIndex(q => q.id === editingId);
      if (currentIndex === -1) return;
      const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (targetIndex >= 0 && targetIndex < filteredMcqs.length) {
          startEdit(null, filteredMcqs[targetIndex]);
      }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if(confirm("Are you sure you want to delete this question?")) {
        try {
            await deleteMCQ(id);
            await loadMCQs();
        } catch (err) {
            console.error("Failed to delete", err);
            alert("Failed to delete question");
        }
    }
  };

  const toggleStar = async (e: React.MouseEvent, q: MCQ) => {
      e.stopPropagation();
      e.preventDefault();
      try {
          await saveMCQ({ ...q, isStarred: !q.isStarred });
          await loadMCQs();
      } catch (err) {
          console.error("Failed to toggle star", err);
      }
  };

  const toggleProblematic = async (e: React.MouseEvent, q: MCQ) => {
      e.stopPropagation();
      e.preventDefault();
      try {
          await saveMCQ({ ...q, isProblematic: !q.isProblematic });
          await loadMCQs();
      } catch (err) {
          console.error("Failed to toggle problematic", err);
      }
  };

  const handleAnswer = (ans: 'A' | 'B' | 'C' | 'D') => {
    const currentQ = filteredMcqs[currentIndex];
    if (ans === currentQ.correctAnswer) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIndex < filteredMcqs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert("You've finished all questions in this selection!");
      setIsPracticing(false);
      setCurrentIndex(0);
    }
  };

  const prevQuestion = () => {
    setFeedback(null);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setFeedback(null);
    setCurrentIndex(index);
  };

  const exportDB = async () => {
      const jsonStr = await getAllMCQsForExport();
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cie_econ_mcqs_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
  };

  const importDB = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
          try {
              const content = ev.target?.result as string;
              await restoreMCQsFromImport(content);
              await loadMCQs();
              alert("Database restored successfully!");
          } catch(err) {
              alert("Failed to restore: Invalid file.");
          }
      };
      reader.readAsText(file);
      if(importFileRef.current) importFileRef.current.value = "";
  };

  const isASCode = (paper: string) => paper.split(' ')[2]?.startsWith('1');

  const filteredMcqs = mcqs.filter(q => {
      const qLevel = isASCode(q.paper) ? 'AS' : 'AL';
      if (qLevel !== selectedLevel) return false;
      
      if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          if (!q.questionText?.toLowerCase().includes(lowerQuery)) {
              return false;
          }
      }

      if (selectedFilterValue === 'All') return true;
      if (selectedFilterValue === 'Starred') return q.isStarred;
      if (selectedFilterValue === 'Problematic') return q.isProblematic;
      if (selectedFilterType === 'PAPER') return q.paper === selectedFilterValue;
      if (selectedFilterType === 'TOPIC') return q.topic === selectedFilterValue;
      return true;
  });

  const levelFilteredPaperCodes = PAPER_CODES.filter(c => {
      const paperNum = c.split(' ')[2];
      return selectedLevel === 'AS' ? paperNum?.startsWith('1') : paperNum?.startsWith('3');
  });

  const levelFilteredTopics = ALL_TOPICS.filter(t => t.type === selectedLevel);
  
  useEffect(() => {
     if (levelFilteredPaperCodes.length > 0 && !levelFilteredPaperCodes.includes(newPaper)) {
         setNewPaper(levelFilteredPaperCodes[0]);
     }
     if (levelFilteredTopics.length > 0 && !levelFilteredTopics.find(t => t.text === newTopic)) {
         setNewTopic(levelFilteredTopics[0].text);
     }
  }, [selectedLevel]);

  const viewingIndex = viewingMCQ ? filteredMcqs.findIndex(m => m.id === viewingMCQ.id) : -1;
  const hasNextMCQ = viewingIndex !== -1 && viewingIndex < filteredMcqs.length - 1;
  const hasPrevMCQ = viewingIndex !== -1 && viewingIndex > 0;

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (!viewingMCQ) return;
          if (e.key === 'ArrowRight' && hasNextMCQ) {
              setViewingMCQ(filteredMcqs[viewingIndex + 1]);
          } else if (e.key === 'ArrowLeft' && hasPrevMCQ) {
              setViewingMCQ(filteredMcqs[viewingIndex - 1]);
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingMCQ, hasNextMCQ, hasPrevMCQ, filteredMcqs, viewingIndex]);

  if (isPracticing) {
      if (filteredMcqs.length === 0) {
          return <div className="p-8 text-center"><p>No questions found for this selection.</p><button onClick={() => setIsPracticing(false)} className="px-4 py-2 mt-4 bg-blue-600 text-white rounded">Back</button></div>;
      }
      const currentQ = filteredMcqs[currentIndex];
      return (
          <div className="h-full w-full overflow-y-auto bg-slate-50">
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
              {zoomedImage && (
                  <div 
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 cursor-zoom-out"
                      onClick={() => setZoomedImage(null)}
                  >
                      <img src={zoomedImage} className="max-w-full max-h-full object-contain bg-white p-2 rounded shadow-2xl" alt="Zoomed" />
                  </div>
              )}
              <div className="flex justify-between items-center mb-6">
                 <div>
                     <div className="flex items-center gap-3 mb-1">
                         <h2 className="text-2xl font-bold text-slate-800">Practice Mode</h2>
                         <button 
                             onClick={(e) => toggleProblematic(e, currentQ)} 
                             className="flex items-center justify-center transition-transform hover:scale-110"
                             title="Mark as Problematic / Removed"
                         >
                             <span className={currentQ.isProblematic ? 'text-red-500 drop-shadow-sm' : 'text-slate-300 grayscale opacity-50 hover:opacity-100'} style={{ fontSize: '1.2rem' }}>⚠️</span>
                         </button>
                     </div>
                     <p className="text-slate-500">Question {currentIndex + 1} of {filteredMcqs.length} • Paper: {currentQ.paper}</p>
                 </div>
                 <button onClick={() => { setIsPracticing(false); setFeedback(null); }} className="px-4 py-2 border rounded hover:bg-slate-50">Exit Practice</button>
              </div>

              {/* Question Navigation Bar */}
              <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 mb-6 flex items-center justify-between">
                  <button onClick={prevQuestion} disabled={currentIndex === 0} className="p-2 text-blue-500 hover:text-blue-800 disabled:opacity-30">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  
                  <div className="flex-1 overflow-x-auto flex gap-1 px-4 scrollbar-hide py-1">
                      {filteredMcqs.map((q, idx) => (
                          <button
                              key={q.id}
                              onClick={() => jumpToQuestion(idx)}
                              className={`w-8 h-8 shrink-0 rounded-full text-xs font-bold transition-all
                                  ${currentIndex === idx 
                                      ? 'bg-blue-600 text-white shadow-md scale-110' 
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                                  ${q.isProblematic ? 'ring-2 ring-red-400 ring-offset-1' : ''}
                              `}
                          >
                              {idx + 1}
                          </button>
                      ))}
                  </div>

                  <button onClick={nextQuestion} disabled={currentIndex === filteredMcqs.length - 1} className="p-2 text-blue-500 hover:text-blue-800 disabled:opacity-30">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      <button 
                          onClick={(e) => toggleStar(e, currentQ)} 
                          className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow border border-slate-200 transition-transform active:scale-95"
                          title="Toggle Star"
                      >
                          <span className={currentQ.isStarred ? 'text-amber-400 drop-shadow-sm' : 'text-slate-300 grayscale'} style={{ fontSize: '1.4rem' }}>🌟</span>
                      </button>
                  </div>
                  <div className="flex justify-center mb-8 cursor-zoom-in" onClick={() => setZoomedImage(currentQ.imageUrl)}>
                     <img src={currentQ.imageUrl} alt="Question" className="max-w-full max-h-[500px] object-contain border rounded shadow-sm hover:opacity-90 transition-opacity" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      {(['A', 'B', 'C', 'D'] as const).map(ans => (
                          <button
                            key={ans}
                            onClick={() => !feedback && handleAnswer(ans)}
                            disabled={feedback !== null}
                            className={`p-4 text-xl font-bold rounded-lg border-2 transition-all 
                                ${feedback === null ? 'border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700' : ''}
                                ${feedback && ans === currentQ.correctAnswer ? 'border-green-500 bg-green-100 text-green-700' : ''}
                                ${feedback && ans !== currentQ.correctAnswer ? 'border-red-200 bg-red-50 text-red-400 opacity-50' : ''}
                            `}
                          >
                              {ans}
                          </button>
                      ))}
                  </div>

                  {feedback && (
                      <div className="mt-8 flex justify-center flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                          <p className={`text-lg font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
                              {feedback === 'correct' ? 'Correct!' : `Incorrect. The correct answer is ${currentQ.correctAnswer}`}
                          </p>
                          {currentQ.annotation && (
                              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 w-full text-left">
                                  <span className="font-bold text-slate-900 block mb-1">Explanation / Notes:</span>
                                  <span className="whitespace-pre-wrap">{currentQ.annotation}</span>
                              </div>
                          )}
                          <button onClick={nextQuestion} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm">
                              {currentIndex < filteredMcqs.length - 1 ? 'Next Question →' : 'Finish Practice'}
                          </button>
                      </div>
                  )}
              </div>
            </div>
          </div>
      );
  }

  // Sidebar Layout
  return (
    <div className="flex h-full w-full bg-slate-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full">
            <div className="p-4 border-b border-slate-200">
                <h2 className="font-bold text-lg text-slate-800">MCQ Library</h2>
                <div className="flex border-b border-slate-200 mt-3 mb-2">
                   <button
                     onClick={() => { setSelectedLevel('AS'); setSelectedFilterValue('All') }}
                     className={`flex-1 pb-1 text-xs font-semibold rounded-t transition-all border-b-2 ${
                       selectedLevel === 'AS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                     }`}
                   >
                     AS Level
                   </button>
                   <button
                     onClick={() => { setSelectedLevel('AL'); setSelectedFilterValue('All') }}
                     className={`flex-1 pb-1 text-xs font-semibold rounded-t transition-all border-b-2 ${
                       selectedLevel === 'AL' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                     }`}
                   >
                     A Level
                   </button>
                </div>
                <div className="flex gap-1 mt-2 p-1 bg-slate-100 rounded-lg">
                   <button onClick={() => {setSelectedFilterType('PAPER'); setSelectedFilterValue('All')}} className={`flex-1 py-1 text-xs font-bold rounded-md ${selectedFilterType === 'PAPER' ? 'bg-white shadow' : 'text-slate-500'}`}>Papers</button>
                   <button onClick={() => {setSelectedFilterType('TOPIC'); setSelectedFilterValue('All')}} className={`flex-1 py-1 text-xs font-bold rounded-md ${selectedFilterType === 'TOPIC' ? 'bg-white shadow' : 'text-slate-500'}`}>Topics</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <button onClick={() => setSelectedFilterValue('All')} className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${selectedFilterValue === 'All' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'}`}>
                    All {selectedLevel} Questions ({mcqs.filter(m => isASCode(m.paper) === (selectedLevel === 'AS')).length})
                </button>
                <button onClick={() => setSelectedFilterValue('Starred')} className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between items-center ${selectedFilterValue === 'Starred' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-700 hover:bg-slate-100'}`}>
                    <span>Starred {selectedLevel} Questions</span>
                    <span>🌟</span>
                </button>
                <button onClick={() => setSelectedFilterValue('Problematic')} className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between items-center ${selectedFilterValue === 'Problematic' ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700 hover:bg-slate-100'}`}>
                    <span>Removed {selectedLevel} Questions</span>
                    <span>⚠️</span>
                </button>
                <div className="my-2 border-b border-slate-100"></div>
                {selectedFilterType === 'PAPER' ? (
                    Array.from(new Set(levelFilteredPaperCodes.map(c => c.split(' ')[0]))).sort((a,b) => b.localeCompare(a)).map(year => (
                        <div key={year} className="mb-1">
                            <button 
                                onClick={() => setExpandedYears(prev => ({...prev, [year]: !prev[year]}))}
                                className="w-full text-left px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex justify-between items-center"
                            >
                                {year}
                                <span>{expandedYears[year] ? '−' : '+'}</span>
                            </button>
                            {expandedYears[year] && (
                                <div className="pl-2 mt-1 space-y-1 border-l-2 border-slate-100 ml-2 mb-2">
                                    {levelFilteredPaperCodes.filter(c => c.startsWith(year)).map(code => {
                                        const count = mcqs.filter(m => m.paper === code).length;
                                        return (
                                            <button key={code} onClick={() => setSelectedFilterValue(code)} className={`w-full text-left px-2 py-1.5 rounded text-xs leading-tight ${selectedFilterValue === code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}>
                                                {code.substring(5)} <span className="opacity-50 float-right">{count > 0 ? count : ''}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    levelFilteredTopics.map(topic => {
                        const count = mcqs.filter(m => m.topic === topic.text).length;
                        return (
                            <button key={topic.id} onClick={() => setSelectedFilterValue(topic.text)} className={`w-full text-left px-3 py-2 rounded text-xs leading-tight ${selectedFilterValue === topic.text ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'}`}>
                                <span className={`mr-1 px-1 rounded text-[10px] font-bold ${topic.type === 'AS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{topic.type}</span>
                                {topic.text} <span className="opacity-50 float-right">{count > 0 ? count : ''}</span>
                            </button>
                        );
                    })
                )}
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs">
                <p className="font-bold text-slate-800 mb-2">Data Management</p>
                <div className="flex gap-2">
                    <button onClick={exportDB} className="flex-1 py-1.5 bg-white border rounded text-blue-600 hover:bg-blue-50 font-medium">Backup</button>
                    <label className="flex-1 py-1.5 bg-white border rounded text-slate-600 hover:bg-slate-50 font-medium text-center cursor-pointer">
                        Restore
                        <input type="file" ref={importFileRef} className="hidden" accept=".json" onChange={importDB} />
                    </label>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <div ref={mainContentRef} className="flex-1 h-full overflow-y-auto p-4 md:p-8 space-y-8 relative">
            {zoomedImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 cursor-zoom-out"
                    onClick={() => setZoomedImage(null)}
                >
                    <img src={zoomedImage} className="max-w-full max-h-full object-contain bg-white p-2 rounded shadow-2xl" alt="Zoomed" />
                </div>
            )}

            {viewingMCQ && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto cursor-auto" onClick={(e) => {
                    if (e.target === e.currentTarget) setViewingMCQ(null);
                }}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-full overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 bg-slate-50 relative">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold text-slate-900">Q{viewingMCQ.questionNum}</h2>
                                    <span className="text-sm font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">{viewingMCQ.paper}</span>
                                    {viewingMCQ.isProblematic && <span className="text-sm text-red-500 bg-red-50 px-2 py-0.5 rounded font-bold">⚠️ Removed</span>}
                                    {viewingMCQ.isStarred && <span className="text-sm text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">🌟 Starred</span>}
                                </div>
                                <p className="text-sm text-slate-500">{viewingMCQ.topic}</p>
                            </div>
                            <button onClick={() => setViewingMCQ(null)} className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-200 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                            <div className="bg-slate-100 rounded-xl p-4 flex justify-center items-center relative group">
                                {hasPrevMCQ && (
                                    <button onClick={() => setViewingMCQ(filteredMcqs[viewingIndex - 1])} className="absolute left-2 sm:left-4 p-2 bg-white/90 hover:bg-white rounded-full text-slate-800 shadow-md border border-slate-200 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                )}
                                <img src={viewingMCQ.imageUrl} alt={`Question ${viewingMCQ.questionNum}`} className="max-w-full rounded shadow-sm object-contain max-h-[60vh] bg-white border border-slate-200" />
                                {hasNextMCQ && (
                                    <button onClick={() => setViewingMCQ(filteredMcqs[viewingIndex + 1])} className="absolute right-2 sm:right-4 p-2 bg-white/90 hover:bg-white rounded-full text-slate-800 shadow-md border border-slate-200 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                                    <h3 className="text-sm font-bold text-blue-800 mb-2 uppercase tracking-wide">Correct Answer</h3>
                                    <div className="text-2xl font-black text-blue-600">{viewingMCQ.correctAnswer}</div>
                                </div>
                                
                                {viewingMCQ.description && (
                                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                        <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Concept</h3>
                                        <p className="text-slate-700 text-sm">{viewingMCQ.description}</p>
                                    </div>
                                )}
                            </div>

                            {viewingMCQ.annotation ? (
                                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                                    <h3 className="text-sm font-bold text-amber-800 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <span className="text-lg">📝</span> Note / Explanation
                                    </h3>
                                    <p className="text-amber-900 whitespace-pre-wrap leading-relaxed text-sm">{viewingMCQ.annotation}</p>
                                </div>
                            ) : (
                                <div className="border border-dashed border-slate-200 p-4 rounded-xl text-center text-slate-400">
                                    <p className="text-sm">No annotation provided for this question.</p>
                                </div>
                            )}

                            {viewingMCQ.aiExplanation ? (
                                <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-bold text-purple-800 uppercase tracking-wide flex items-center gap-2">
                                            AI Explanation
                                        </h3>
                                        <button 
                                            onClick={handleGenerateExplanation} 
                                            disabled={isGeneratingExp}
                                            className="text-xs bg-blue-200 text-blue-800 hover:bg-blue-300 font-bold py-1 px-3 rounded transition-colors disabled:opacity-50"
                                        >
                                            {isGeneratingExp ? 'Generating...' : 'Regenerate'}
                                        </button>
                                    </div>
                                    <div className="text-purple-900 leading-relaxed text-sm prose prose-sm prose-purple max-w-none">
                                        <Markdown>{viewingMCQ.aiExplanation}</Markdown>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center mt-2">
                                    <button 
                                        onClick={handleGenerateExplanation} 
                                        disabled={isGeneratingExp}
                                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold py-2 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isGeneratingExp ? 'Generating Explanation...' : 'Generate Explanation'}
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            <span className="text-xs text-slate-400">ID: {viewingMCQ.id.slice(-6)}</span>
                            <button 
                                onClick={(e) => {
                                    setViewingMCQ(null);
                                    startEdit(e, viewingMCQ);
                                }}
                                className="bg-white border border-slate-300 shadow-sm text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Edit Question
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div className="flex-1 w-full flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex flex-wrap items-baseline gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap">{selectedFilterValue === 'All' ? 'All MCQs' : selectedFilterValue}</h1>
                        <p className="text-slate-500 text-sm whitespace-nowrap m-0">{filteredMcqs.length} questions</p>
                    </div>
                    <div className="w-full max-w-sm sm:ml-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search by question text..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-9 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 border-slate-300"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    title="Clear search"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full lg:w-auto lg:max-w-[460px] justify-start lg:justify-end shrink-0">
                    <button 
                      onClick={startAdding} 
                      className="flex-1 min-w-[120px] px-3 py-1.5 text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-colors whitespace-nowrap text-center"
                    >
                        {isAdding ? 'Cancel' : '+ Add Question'}
                    </button>
                    <button 
                      onClick={() => setShowAutoImport(true)} 
                      className="flex-1 min-w-[120px] px-3 py-1.5 text-sm bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 rounded-lg hover:bg-fuchsia-100 font-medium transition-colors whitespace-nowrap text-center"
                    >
                        Auto Slicer
                    </button>
                    <button 
                      onClick={() => setShowQuizGenerator(true)} 
                      className="flex-1 min-w-[120px] px-3 py-1.5 text-sm bg-amber-50 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100 font-bold transition-colors whitespace-nowrap text-center"
                    >
                        Generate Quiz
                    </button>
                    <button 
                      onClick={handleBulkExtract} 
                      disabled={isBulkExtracting}
                      className="flex-1 min-w-[120px] px-3 py-1.5 text-sm bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100 font-bold transition-colors disabled:opacity-50 whitespace-nowrap text-center"
                    >
                        {isBulkExtracting && bulkProgress ? `Extracting (${bulkProgress.current}/${bulkProgress.total})` : "Bulk Extract OCR"}
                    </button>
                    <button 
                      onClick={() => exportPracticeBook(filteredMcqs, selectedFilterValue === 'All' ? 'All Questions' : selectedFilterValue, true)}
                      disabled={filteredMcqs.length === 0}
                      className="flex-1 min-w-[120px] px-3 py-1.5 text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 font-bold transition-colors disabled:opacity-50 whitespace-nowrap text-center"
                      title="Export with Explanations/Annotations"
                    >
                        Export
                    </button>
                    <button 
                      onClick={() => { setCurrentIndex(0); setIsPracticing(true); }}
                      disabled={filteredMcqs.length === 0}
                      className="flex-1 min-w-[120px] px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-colors disabled:opacity-50 whitespace-nowrap text-center"
                    >
                        Practice ({filteredMcqs.length})
                    </button>
                </div>
            </div>

            {isAdding && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                             <h2 className="text-xl font-bold">{editingId ? 'Edit Question' : 'Add New Question'}</h2>
                             {editingId && (
                                 <div className="flex items-center gap-1 bg-white border rounded-lg overflow-hidden shadow-sm">
                                     <button 
                                         onClick={() => navigateEdit('prev')}
                                         disabled={filteredMcqs.findIndex(q => q.id === editingId) <= 0}
                                         className="px-3 py-1 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white text-slate-600 font-medium text-sm transition-colors border-r"
                                     >
                                         ← Prev
                                     </button>
                                     <button 
                                         onClick={() => navigateEdit('next')}
                                         disabled={filteredMcqs.findIndex(q => q.id === editingId) === -1 || filteredMcqs.findIndex(q => q.id === editingId) === filteredMcqs.length - 1}
                                         className="px-3 py-1 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white text-slate-600 font-medium text-sm transition-colors"
                                     >
                                         Next →
                                     </button>
                                 </div>
                             )}
                        </div>
                        
                        <div className="flex items-center gap-2 bg-white p-2 rounded border text-sm">
                            <span className="font-medium text-slate-600">Bulk Answers:</span>
                            <input 
                                type="text"
                                placeholder="Paste B C C A B..."
                                value={bulkInput}
                                onChange={e => setBulkInput(e.target.value)}
                                className="border rounded px-2 py-1 w-48 text-xs font-mono uppercase tracking-widest"
                            />
                            <button onClick={saveBulkString} className="px-2 py-1 bg-blue-800 text-white rounded font-bold text-xs">Set for Paper</button>
                            {bulkAnswers[newPaper] && <span className="text-xs text-green-600 font-bold">✓ Active</span>}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" onPaste={handlePaste}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Paper Reference</label>
                                <select value={newPaper} onChange={e => setNewPaper(e.target.value)} className="w-full p-2 border rounded">
                                    {levelFilteredPaperCodes.map(code => <option key={code} value={code}>{code}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/3">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Q Num</label>
                                    <input type="number" value={newQuestionNum} onChange={e => setNewQuestionNum(Number(e.target.value))} className="w-full p-2 border rounded" min={1} max={40} />
                                </div>
                                <div className="w-2/3">
                                    <label className="block text-sm font-medium text-slate-700 mb-1 text-blue-700">Correct Answer {bulkAnswers[newPaper] ? '(Auto-filled)' : ''}</label>
                                    <select value={newCorrectAnswer} onChange={e => setNewCorrectAnswer(e.target.value as any)} className="w-full p-2 border border-blue-300 bg-blue-50 rounded font-bold">
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="X">X (Removed/Missing)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Topic Chapter ({selectedLevel})</label>
                                    <button 
                                        type="button" 
                                        onClick={handleGenerateAnalysis} 
                                        disabled={!imagePreview || isGeneratingDesc}
                                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold px-2 py-1 rounded transition-colors disabled:opacity-50"
                                    >
                                        {isGeneratingDesc ? 'Analyzing...' : 'AI Auto-Fill (Topic & Concept)'}
                                    </button>
                                </div>
                                <select value={newTopic} onChange={e => setNewTopic(e.target.value)} className="w-full p-2 border rounded bg-slate-50 text-xs">
                                    {levelFilteredTopics.map(t => (
                                        <option key={t.id} value={t.text}>
                                            {t.parent} &gt; {t.text}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Concept Description (Searchable)</label>
                                <input 
                                    type="text" 
                                    value={newDescription} 
                                    onChange={e => setNewDescription(e.target.value)} 
                                    placeholder="e.g. Positive and Normative Statements"
                                    className="w-full p-2 border rounded bg-slate-50 text-xs"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Question Stem (Searchable Text)</label>
                                    <button 
                                        type="button" 
                                        onClick={handleExtractStem} 
                                        disabled={!imagePreview || isExtractingStem}
                                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold px-2 py-1 rounded transition-colors disabled:opacity-50"
                                    >
                                        {isExtractingStem ? 'Extracting...' : 'Extract OCR Text'}
                                    </button>
                                </div>
                                <textarea 
                                    value={newQuestionText} 
                                    onChange={e => setNewQuestionText(e.target.value)} 
                                    placeholder="Which statement about a free vaccination programme is normative?"
                                    className="w-full p-2 border rounded bg-slate-50 text-xs min-h-[50px]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Annotation / Explanation (Optional)</label>
                                <textarea 
                                    value={newAnnotation} 
                                    onChange={e => setNewAnnotation(e.target.value)} 
                                    className="w-full p-2 border rounded bg-slate-50 text-xs min-h-[60px]"
                                    placeholder="Enter any notes or explanations for this question..."
                                />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button onClick={handleSave} className={`flex-1 w-full py-3 text-white font-bold rounded-lg shadow-sm transition-transform active:scale-[0.98] ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {editingId ? 'Update Question' : 'Save Question'}
                                </button>
                                {editingId && (
                                    <button onClick={startAdding} className="py-3 px-6 bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold rounded-lg shadow-sm transition-colors">
                                        Close
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center p-2 bg-white min-h-[400px] text-center overflow-hidden">
                            {imagePreview ? (
                                <div className="relative w-full h-full flex flex-col items-center group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[600px] object-contain" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                                         <button onClick={() => setImagePreview(null)} className="px-4 py-2 bg-white text-red-600 font-bold rounded shadow">Remove</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-slate-500">
                                    <svg className="mx-auto h-12 w-12 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mb-2 text-sm font-bold">CLICK here OR Paste (Ctrl+V) from Clipboard</p>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" id="mcq-upload" />
                                    <label htmlFor="mcq-upload" className="cursor-pointer px-4 py-2 mt-2 inline-block bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-medium">Browse File</label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMcqs.map(q => (
                    <div key={q.id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col group transition-shadow hover:shadow-md relative">
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                            <button 
                                onClick={(e) => toggleStar(e, q)} 
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-200 transition-transform active:scale-95"
                                title="Toggle Star"
                            >
                                <span className={q.isStarred ? 'text-amber-400 drop-shadow-sm' : 'text-slate-300 grayscale'} style={{ fontSize: '1.2rem' }}>🌟</span>
                            </button>
                        </div>
                        <div 
                            className="h-48 bg-slate-100 flex items-center justify-center p-2 relative overflow-hidden text-center cursor-zoom-in group/img"
                            onClick={() => setZoomedImage(q.imageUrl)}
                        >
                            <img src={q.imageUrl} alt={`Q${q.questionNum}`} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform group-hover/img:scale-[1.02]" />
                            <div className="absolute top-2 right-2 bg-white px-2 py-1 text-sm font-bold rounded shadow-sm text-green-700 border border-green-200 z-10 opacity-90">
                                Ans: {q.correctAnswer}
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col pt-3 cursor-pointer" onClick={() => setViewingMCQ(q)}>
                            <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-lg text-slate-900">Q{q.questionNum}</h3>
                                  <button onClick={(e) => toggleProblematic(e, q)} title="Mark as Problematic / Removed" className="hover:scale-110 transition-transform">
                                      <span className={q.isProblematic ? 'text-red-500 drop-shadow-sm' : 'text-slate-300 grayscale opacity-50 hover:opacity-100'} style={{ fontSize: '1.1rem' }}>⚠️</span>
                                  </button>
                               </div>
                               <div className="flex gap-1 items-center">
                                   {q.annotation && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 shadow-sm" title="Has Annotation">📝 Note</span>}
                                   <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold border border-slate-200">{q.paper}</span>
                               </div>
                            </div>
                            <p className="text-xs text-slate-500 mb-1 line-clamp-2 leading-relaxed" title={q.topic}>{q.topic}</p>
                            {q.description && (
                                <p className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block self-start mb-2">{q.description}</p>
                            )}
                            {q.questionText && (
                                <p className="text-xs text-slate-800 italic line-clamp-2 mt-1 mb-2">"{q.questionText}"</p>
                            )}
                            
                            <div className="mt-auto pt-3 border-t flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-slate-400">ID: {q.id.slice(-6)}</span>
                                <div className="flex gap-1">
                                    <button onClick={(e) => startEdit(e, q)} className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded">Edit</button>
                                    <button onClick={(e) => handleDelete(e, q.id)} className="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1 bg-red-50 rounded">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredMcqs.length === 0 && !isAdding && (
                    <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-xl border border-dashed">
                        No questions in this filter.
                    </div>
                )}
            </div>
            
            <div className="pb-16" /> {/* Spacer */}
            
            {showAutoImport && (
                <AutoPDFImport 
                    initialPaperCode={selectedFilterType === 'PAPER' && selectedFilterValue !== 'All' && selectedFilterValue !== 'Starred' && selectedFilterValue !== 'Problematic' ? selectedFilterValue : ''}
                    level={selectedLevel}
                    onComplete={() => { setShowAutoImport(false); loadMCQs(); }} 
                    onCancel={() => setShowAutoImport(false)} 
                />
            )}
            
            {showQuizGenerator && (
                <MCQQuizGenerator 
                    allMcqs={mcqs} 
                    level={selectedLevel} 
                    onClose={() => setShowQuizGenerator(false)} 
                    onGenerate={(selected) => {
                        exportPracticeBook(selected, `Generated Set (${selected.length} Questions)`);
                        setShowQuizGenerator(false);
                    }} 
                />
            )}
        </div>
    </div>
  );
};
