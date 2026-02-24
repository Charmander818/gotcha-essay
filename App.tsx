
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import EssayGenerator from './components/EssayGenerator';
import EssayGrader from './components/EssayGrader';
import RealTimeWriter from './components/RealTimeWriter';
import EssayImprover from './components/EssayImprover';
import LogicChainImprover from './components/LogicChainImprover';
import TopicAnalyzer from './components/TopicAnalyzer';
import SyllabusTracker from './components/SyllabusTracker';
import StrategyAnalyzer from './components/StrategyAnalyzer';
import AddQuestionModal from './components/AddQuestionModal';
import CodeExportModal from './components/CodeExportModal';
import SyllabusExportModal from './components/SyllabusExportModal'; // New Import
import { Question, AppMode, QuestionState, TopicAnalysisData, SyllabusStatus, CustomSyllabusPoint } from './types';
import { questions as initialQuestions } from './data';
import { generateModelAnswer, generateClozeExercise } from './services/geminiService';
import { SYLLABUS_CHECKLIST } from './syllabusChecklistData'; // Import for export merging
import { PREFILLED_DEFINITIONS } from './syllabusDefinitions'; // Import for export merging

const STORAGE_KEY_CUSTOM_QUESTIONS = 'cie_econ_custom_questions_v2';
const STORAGE_KEY_DELETED_IDS = 'cie_econ_deleted_ids_v1';
const STORAGE_KEY_WORK = 'cie_economics_work_v1';
const STORAGE_KEY_TOPIC_ANALYSIS = 'cie_economics_analysis_v1';
const STORAGE_KEY_SYLLABUS = 'cie_econ_syllabus_status_v1';
const STORAGE_KEY_CUSTOM_SYLLABUS = 'cie_econ_custom_syllabus_v1';
const SESSION_KEY_AUTH = 'cie_econ_auth_session';

// Basic protection.
const APP_PASSWORD = "kittymoni"; 

const App: React.FC = () => {
  // --- Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY_AUTH) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // --- Application State ---
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DELETED_IDS);
    return saved ? JSON.parse(saved) : [];
  });

  const [topicAnalyses, setTopicAnalyses] = useState<Record<string, TopicAnalysisData>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TOPIC_ANALYSIS);
    return saved ? JSON.parse(saved) : {};
  });

  const [syllabusStatus, setSyllabusStatus] = useState<Record<string, SyllabusStatus>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SYLLABUS);
    return saved ? JSON.parse(saved) : {};
  });

  const [customSyllabusPoints, setCustomSyllabusPoints] = useState<Record<string, CustomSyllabusPoint[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_SYLLABUS);
    return saved ? JSON.parse(saved) : {};
  });

  const allQuestions = useMemo(() => {
    // Create a map of custom questions for easy lookup (ID -> Question)
    const customMap = new Map(customQuestions.map(q => [q.id, q]));
    const initialIds = new Set(initialQuestions.map(q => q.id));

    // 1. Start with initial questions. If an edited version exists in customMap, use that instead.
    const mergedInitial = initialQuestions.map(q => customMap.has(q.id) ? customMap.get(q.id)! : q);

    // 2. Add purely new custom questions (those with IDs NOT in initialQuestions)
    const newCustom = customQuestions.filter(q => !initialIds.has(q.id));

    // 3. Combine them and filter out deleted IDs
    return [...mergedInitial, ...newCustom].filter(q => !deletedIds.includes(q.id));
  }, [customQuestions, deletedIds]);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATOR);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeExportOpen, setIsCodeExportOpen] = useState(false);
  const [isSyllabusExportOpen, setIsSyllabusExportOpen] = useState(false); // New State
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WORK);
    return saved ? JSON.parse(saved) : {};
  });

  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const syllabusFileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOM_QUESTIONS, JSON.stringify(customQuestions));
  }, [customQuestions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DELETED_IDS, JSON.stringify(deletedIds));
  }, [deletedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WORK, JSON.stringify(questionStates));
  }, [questionStates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TOPIC_ANALYSIS, JSON.stringify(topicAnalyses));
  }, [topicAnalyses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SYLLABUS, JSON.stringify(syllabusStatus));
  }, [syllabusStatus]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOM_SYLLABUS, JSON.stringify(customSyllabusPoints));
  }, [customSyllabusPoints]);

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === APP_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(SESSION_KEY_AUTH, 'true');
      setAuthError("");
    } else {
      setAuthError("Incorrect password");
    }
  };

  const getQuestionState = (id: string): QuestionState => {
    return questionStates[id] || {
      generatorEssay: "",
      graderEssay: "",
      graderFeedback: "",
      realTimeEssay: ""
    };
  };

  const updateQuestionState = (id: string, updates: Partial<QuestionState>) => {
    setQuestionStates(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {
          generatorEssay: "",
          graderEssay: "",
          graderFeedback: "",
          realTimeEssay: ""
        }),
        ...updates
      }
    }));
  };

  const handleSaveQuestion = (question: Question) => {
    if (deletedIds.includes(question.id)) {
        setDeletedIds(prev => prev.filter(id => id !== question.id));
    }

    setCustomQuestions(prev => {
      const exists = prev.some(q => q.id === question.id);
      if (exists) {
        return prev.map(q => q.id === question.id ? question : q);
      }
      return [...prev, question];
    });

    if (selectedQuestion?.id === question.id) {
      setSelectedQuestion(question);
    }
    
    setQuestionToEdit(null);
    setIsModalOpen(false);
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      if (id.startsWith('custom-')) {
         setCustomQuestions(prev => prev.filter(q => q.id !== id));
      } else {
         setDeletedIds(prev => [...prev, id]);
         setCustomQuestions(prev => prev.filter(q => q.id !== id));
      }

      if (selectedQuestion?.id === id) {
        setSelectedQuestion(null);
      }
    }
  };

  const handleAddSyllabusPoint = (subsectionId: string, text: string) => {
    const newPoint: CustomSyllabusPoint = {
        id: `custom-syll-${Date.now()}`,
        text,
        subsectionId
    };
    setCustomSyllabusPoints(prev => ({
        ...prev,
        [subsectionId]: [...(prev[subsectionId] || []), newPoint]
    }));
  };

  const handleDeleteSyllabusPoint = (subsectionId: string, pointId: string) => {
    setCustomSyllabusPoints(prev => ({
        ...prev,
        [subsectionId]: prev[subsectionId].filter(p => p.id !== pointId)
    }));
  };

  const handleBatchGenerate = async () => {
    if (isBatchProcessing) return;
    if (!window.confirm("This will automatically generate Model Essays and Cloze Exercises for all questions that don't have them yet. This process may take several minutes due to AI rate limits. Continue?")) return;

    setIsBatchProcessing(true);
    let count = 0;
    const total = allQuestions.length;

    for (const q of allQuestions) {
        count++;
        setBatchProgress(`${count} / ${total}`);
        
        const state: QuestionState = questionStates[q.id] || {
            generatorEssay: "",
            graderEssay: "",
            graderFeedback: "",
            realTimeEssay: ""
        };
        let essay = state.generatorEssay;

        if (!essay) {
            try {
                essay = await generateModelAnswer(q);
                await new Promise(r => setTimeout(r, 4000));
            } catch (e) {
                console.error(`Failed to generate essay for ${q.id}`, e);
                continue;
            }
        }

        let clozeData = state.clozeData;
        if (essay && !clozeData) {
            try {
                const result = await generateClozeExercise(essay);
                if (result) clozeData = result;
                await new Promise(r => setTimeout(r, 4000));
            } catch (e) {
                console.error(`Failed to generate cloze for ${q.id}`, e);
            }
        }

        updateQuestionState(q.id, { 
            generatorEssay: essay,
            clozeData: clozeData
        });
    }

    setIsBatchProcessing(false);
    setBatchProgress("");
    alert("Batch generation complete!");
  };

  const handleExportAll = () => {
    const questionsToExport = allQuestions;

    let htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>CIE Economics Question Bank</title>
        <style>
          body { font-family: 'Calibri', sans-serif; font-size: 11pt; }
          h1 { color: #1e3a8a; font-size: 24pt; text-align: center; margin-bottom: 30px; }
          h2 { color: #1e40af; font-size: 16pt; margin-top: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 5px; }
          .question-box { border: 1px solid #cbd5e1; padding: 15px; margin-bottom: 15px; page-break-inside: avoid; background-color: #f8fafc; }
          .meta { color: #64748b; font-size: 9pt; font-weight: bold; margin-bottom: 10px; }
          .q-text { font-size: 11pt; font-weight: bold; margin-bottom: 10px; color: #0f172a; }
          .marks { float: right; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 9pt; }
          .ms-header { font-size: 9pt; font-weight: bold; color: #047857; margin-top: 10px; text-transform: uppercase; }
          .ms-content { font-size: 10pt; color: #334155; white-space: pre-wrap; font-family: 'Consolas', monospace; background: #fff; padding: 10px; border: 1px dashed #cbd5e1; }
        </style>
      </head>
      <body>
        <h1>CIE Economics Question Bank</h1>
        <p style="text-align:center; color:#64748b;">Generated on ${new Date().toLocaleDateString()} • Total Questions: ${questionsToExport.length}</p>
    `;

    // Group by Topic
    const grouped = questionsToExport.reduce((acc, q) => {
        if (!acc[q.topic]) acc[q.topic] = [];
        acc[q.topic].push(q);
        return acc;
    }, {} as Record<string, Question[]>);

    // Sort Topics
    const sortedTopics = Object.keys(grouped).sort();

    sortedTopics.forEach(topic => {
        htmlContent += `<h2>${topic}</h2>`;
        grouped[topic].forEach(q => {
            htmlContent += `
              <div class="question-box">
                 <div class="meta">
                    ${q.year} | ${q.paper} | ${q.variant} | Q${q.questionNumber}
                    <span class="marks">${q.maxMarks} Marks</span>
                 </div>
                 <div class="q-text">${q.questionText}</div>
                 <div class="ms-header">Mark Scheme Guidance</div>
                 <div class="ms-content">${q.markScheme}</div>
                 <div style="font-size: 8pt; color: #94a3b8; margin-top: 5px;">Chapter: ${q.chapter}</div>
              </div>
            `;
        });
    });

    htmlContent += "</body></html>";

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CIE_Economics_Question_Bank_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const questionsToExport = allQuestions;
    
    // Header row
    const headers = ["ID", "Year", "Paper", "Variant", "Question No", "Topic", "Chapter", "Max Marks", "Question Text", "Mark Scheme"];
    
    // Helper to escape CSV fields
    const escapeCsv = (str: string | number) => {
        if (str == null) return '';
        const stringified = String(str);
        // If contains quotes, commas or newlines, wrap in quotes and escape internal quotes
        if (stringified.includes('"') || stringified.includes(',') || stringified.includes('\n')) {
            return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
    };

    const rows = questionsToExport.map(q => [
        q.id,
        q.year,
        q.paper,
        q.variant,
        q.questionNumber,
        q.topic,
        q.chapter,
        q.maxMarks,
        q.questionText,
        q.markScheme
    ].map(escapeCsv).join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Add BOM for Excel to interpret UTF-8 correctly
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CIE_Economics_Question_Bank_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Analysis Backup/Restore ---
  const handleBackupAnalysis = () => {
      const blob = new Blob([JSON.stringify(topicAnalyses, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CIE_Topic_Analysis_Backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleRestoreAnalysis = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target?.result as string);
              if (typeof data === 'object') {
                  setTopicAnalyses(prev => ({ ...prev, ...data }));
                  alert("Analysis data imported successfully! (Merged with existing)");
              } else {
                  alert("Invalid file format.");
              }
          } catch (err) {
              alert("Failed to parse JSON file.");
          }
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Syllabus Backup/Restore ---
  const handleBackupSyllabus = () => {
      const payload = {
          status: syllabusStatus,
          customPoints: customSyllabusPoints
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CIE_Syllabus_Logic_Backup_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleRestoreSyllabus = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target?.result as string);
              if (typeof data === 'object') {
                  if (data.status) setSyllabusStatus(prev => ({ ...prev, ...data.status }));
                  if (data.customPoints) setCustomSyllabusPoints(prev => ({ ...prev, ...data.customPoints }));
                  
                  // Backward compatibility for old backup format which was just status
                  if (!data.status && !data.customPoints) {
                      setSyllabusStatus(prev => ({ ...prev, ...data }));
                  }
                  
                  alert("Syllabus & Logic Chains imported successfully!");
              } else {
                  alert("Invalid file format.");
              }
          } catch (err) {
              alert("Failed to parse JSON file.");
          }
      };
      reader.readAsText(file);
      if (syllabusFileInputRef.current) syllabusFileInputRef.current.value = '';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        {/* Login UI code unchanged */}
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">CIE Economics Master</h1>
            <p className="text-slate-500 mt-2 text-sm">Protected Access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Password</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter access code"
                autoFocus
              />
            </div>
            
            {authError && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
                {authError}
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98]"
            >
              Unlock Access
            </button>
          </form>
          
          <p className="text-center mt-6 text-xs text-slate-400">
            Authorized personnel only.
          </p>
        </div>
      </div>
    );
  }

  const isGlobalMode = mode === AppMode.TOPIC_ANALYSIS || mode === AppMode.SYLLABUS_TRACKER || mode === AppMode.LOGIC_CHAIN || mode === AppMode.STRATEGY;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        questions={allQuestions}
        onSelectQuestion={(q) => {
            if (isGlobalMode) setMode(AppMode.GENERATOR);
            setSelectedQuestion(q);
        }} 
        selectedQuestionId={selectedQuestion?.id || null}
        onAddQuestionClick={() => { setQuestionToEdit(null); setIsModalOpen(true); }}
        onDeleteQuestion={handleDeleteQuestion}
        onEditQuestion={(q) => { setQuestionToEdit(q); setIsModalOpen(true); }}
        questionStates={questionStates}
        onExportAll={handleExportAll}
        onExportExcel={handleExportExcel}
        onBatchGenerate={handleBatchGenerate}
        isBatchProcessing={isBatchProcessing}
        batchProgress={batchProgress}
        onOpenCodeExport={() => setIsCodeExportOpen(true)}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            {mode === AppMode.TOPIC_ANALYSIS ? (
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Question Bank Analysis</h2>
                    <p className="text-sm text-slate-500">Aggregate insights by chapter</p>
                </div>
            ) : mode === AppMode.SYLLABUS_TRACKER ? (
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Syllabus Logic Trainer</h2>
                    <p className="text-sm text-slate-500">Knowledge Checklist & Chain Building</p>
                </div>
            ) : mode === AppMode.LOGIC_CHAIN ? (
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Freeform Logic Improver</h2>
                    <p className="text-sm text-slate-500">Convert notes to formal chains</p>
                </div>
            ) : mode === AppMode.STRATEGY ? (
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Exam Strategy Decoder</h2>
                    <p className="text-sm text-slate-500">Reverse-engineering Mark Scheme Rules</p>
                </div>
            ) : selectedQuestion ? (
              <div>
                 <h2 className="text-lg font-bold text-slate-800">{selectedQuestion.paper} - {selectedQuestion.variant} {selectedQuestion.year}</h2>
                 <p className="text-sm text-slate-500">{selectedQuestion.topic} - {selectedQuestion.questionNumber}</p>
              </div>
            ) : (
              <p className="text-slate-400 italic">Select a question from the sidebar</p>
            )}
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto gap-1">
            <button
                onClick={() => setMode(AppMode.SYLLABUS_TRACKER)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  mode === AppMode.SYLLABUS_TRACKER
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
            >
                Syllabus
            </button>
            <button
                onClick={() => setMode(AppMode.TOPIC_ANALYSIS)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  mode === AppMode.TOPIC_ANALYSIS
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
            >
                Analysis
            </button>
            <button
                onClick={() => setMode(AppMode.STRATEGY)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  mode === AppMode.STRATEGY
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
            >
                Strategy
            </button>
            
            <div className="w-px bg-slate-300 mx-1"></div>

            {[AppMode.GENERATOR, AppMode.IMPROVER, AppMode.GRADER, AppMode.COACH].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                disabled={!selectedQuestion}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  mode === m 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : !selectedQuestion ? 'opacity-50 cursor-not-allowed text-slate-400' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m === AppMode.GENERATOR ? 'Model Answer' : m.replace('Essay ', '').replace('Logic ', '')}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-0 relative">
          <div className="h-full">
            {mode === AppMode.SYLLABUS_TRACKER ? (
                <SyllabusTracker 
                  statusMap={syllabusStatus}
                  onUpdateStatus={setSyllabusStatus}
                  customPoints={customSyllabusPoints}
                  onAddPoint={handleAddSyllabusPoint}
                  onDeletePoint={handleDeleteSyllabusPoint}
                />
            ) : mode === AppMode.TOPIC_ANALYSIS ? (
               <div className="p-8">
               <TopicAnalyzer 
                  initialTopic={selectedQuestion?.topic} 
                  initialChapter={selectedQuestion?.chapter}
                  allQuestions={allQuestions}
                  savedAnalysis={topicAnalyses}
                  onSaveAnalysis={(chapter, data) => setTopicAnalyses(prev => ({...prev, [chapter]: data}))}
               />
               </div>
            ) : mode === AppMode.LOGIC_CHAIN ? (
                <div className="p-8"><LogicChainImprover /></div>
            ) : mode === AppMode.STRATEGY ? (
                <StrategyAnalyzer questions={allQuestions} />
            ) : selectedQuestion ? (
              <div className="p-8">
                {mode === AppMode.GENERATOR && (
                  <EssayGenerator 
                    question={selectedQuestion} 
                    savedEssay={getQuestionState(selectedQuestion.id).generatorEssay}
                    onSave={(essay) => updateQuestionState(selectedQuestion.id, { generatorEssay: essay })}
                  />
                )}
                {mode === AppMode.IMPROVER && (
                  <EssayImprover 
                     question={selectedQuestion}
                     modelEssay={getQuestionState(selectedQuestion.id).generatorEssay}
                     clozeData={getQuestionState(selectedQuestion.id).clozeData}
                     userAnswers={getQuestionState(selectedQuestion.id).clozeUserAnswers}
                     feedback={getQuestionState(selectedQuestion.id).clozeFeedback}
                     onSaveData={(data) => updateQuestionState(selectedQuestion.id, { clozeData: data })}
                     onSaveProgress={(answers, fb) => updateQuestionState(selectedQuestion.id, { clozeUserAnswers: answers, clozeFeedback: fb })}
                     onModelEssayGenerated={(essay) => updateQuestionState(selectedQuestion.id, { generatorEssay: essay })}
                  />
                )}
                {mode === AppMode.GRADER && (
                  <EssayGrader 
                    question={selectedQuestion} 
                    savedInput={getQuestionState(selectedQuestion.id).graderEssay}
                    savedFeedback={getQuestionState(selectedQuestion.id).graderFeedback}
                    onSave={(input, feedback) => updateQuestionState(selectedQuestion.id, { graderEssay: input, graderFeedback: feedback })}
                  />
                )}
                {mode === AppMode.COACH && (
                  <RealTimeWriter 
                    question={selectedQuestion} 
                    savedText={getQuestionState(selectedQuestion.id).realTimeEssay}
                    onSave={(text) => updateQuestionState(selectedQuestion.id, { realTimeEssay: text })}
                  />
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <svg className="w-24 h-24 mb-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">Welcome to Essay Master</h3>
                <p className="max-w-md text-center mb-6">Select a question from the sidebar to start.</p>
                <p className="text-sm text-slate-400">Your questions and essays are automatically saved locally.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer for Topic Analysis Mode */}
        {mode === AppMode.TOPIC_ANALYSIS && (
            <div className="border-t border-slate-200 bg-white p-3 px-6 flex justify-between items-center z-20 shadow-lg">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Data Options</span>
                <div className="flex gap-3">
                    <button 
                      onClick={handleBackupAnalysis}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        Backup
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        Restore
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleRestoreAnalysis} 
                      className="hidden" 
                      accept=".json" 
                    />
                </div>
            </div>
        )}

        {/* Footer for Syllabus Mode */}
        {mode === AppMode.SYLLABUS_TRACKER && (
            <div className="border-t border-slate-200 bg-white p-3 px-6 flex justify-between items-center z-20 shadow-lg">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Syllabus Data Options</span>
                <div className="flex gap-3">
                    <button 
                      onClick={handleBackupSyllabus}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        Backup
                    </button>
                    <button 
                      onClick={() => syllabusFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        Restore
                    </button>
                    <input 
                      type="file" 
                      ref={syllabusFileInputRef} 
                      onChange={handleRestoreSyllabus} 
                      className="hidden" 
                      accept=".json" 
                    />
                    <button 
                      onClick={() => setIsSyllabusExportOpen(true)}
                      className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded shadow-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        Sync to Source
                    </button>
                </div>
            </div>
        )}
      </main>

      <AddQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setQuestionToEdit(null); }} 
        onSave={handleSaveQuestion}
        initialQuestion={questionToEdit}
      />

      <CodeExportModal
         isOpen={isCodeExportOpen}
         onClose={() => setIsCodeExportOpen(false)}
         questions={allQuestions}
      />

      <SyllabusExportModal
         isOpen={isSyllabusExportOpen}
         onClose={() => setIsSyllabusExportOpen(false)}
         baseChecklist={SYLLABUS_CHECKLIST}
         customPoints={customSyllabusPoints}
         currentStatus={syllabusStatus}
         baseDefinitions={PREFILLED_DEFINITIONS}
      />
    </div>
  );
};

export default App;
