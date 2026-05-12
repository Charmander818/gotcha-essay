
import React, { useState } from 'react';
import { SYLLABUS_CHECKLIST } from '../syllabusChecklistData';
import { SyllabusStatus, LogicChainItem, CustomSyllabusPoint } from '../types';
import { generateSyllabusLogicChain, generateWorksheet } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PREFILLED_DEFINITIONS } from '../syllabusDefinitions';
import { PREFILLED_WORKSHEETS } from '../worksheetData';

interface Props {
  statusMap: Record<string, SyllabusStatus>;
  onUpdateStatus: React.Dispatch<React.SetStateAction<Record<string, SyllabusStatus>>>;
  customPoints: Record<string, CustomSyllabusPoint[]>;
  onAddPoint: (subsectionId: string, text: string) => void;
  onDeletePoint: (subsectionId: string, pointId: string) => void;
}

const SyllabusTracker: React.FC<Props> = ({ statusMap, onUpdateStatus, customPoints, onAddPoint, onDeletePoint }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({});
  
  const [activeTrainingPoint, setActiveTrainingPoint] = useState<{id: string, text: string, topic: string} | null>(null);
  
  // Adding Custom Point State
  const [addingToSubsection, setAddingToSubsection] = useState<string | null>(null);
  const [newPointText, setNewPointText] = useState("");

  // AO1 Definition State
  const [ao1Definition, setAo1Definition] = useState("");
  const [defSaved, setDefSaved] = useState(false); // New state for save confirmation

  // AO2 Logic Chains State
  const [chains, setChains] = useState<LogicChainItem[]>([]);
  const [newChainContext, setNewChainContext] = useState("");
  const [chainLoading, setChainLoading] = useState(false);
  const [chainError, setChainError] = useState(false);

  // Worksheet State
  const [worksheetModalData, setWorksheetModalData] = useState<{ sectionId: string, subTitle: string, points: string[] } | null>(null);
  const [worksheetInstructions, setWorksheetInstructions] = useState("");
  const [isGeneratingWorksheet, setIsGeneratingWorksheet] = useState(false);
  const [worksheetContent, setWorksheetContent] = useState("");
  const [worksheetAnswerKey, setWorksheetAnswerKey] = useState("");
  const [worksheetTab, setWorksheetTab] = useState<'worksheet' | 'answerKey'>('worksheet');

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

  const openTrainer = (uniqueId: string, text: string, topic: string) => {
    setActiveTrainingPoint({ id: uniqueId, text: text, topic: topic });
    
    // Load saved work
    const saved = statusMap[uniqueId] || {};
    
    // Priority: 1. User saved definition -> 2. Hardcoded Teacher definition -> 3. Empty
    let defToLoad = saved.ao1Definition || saved.ao1Notes || "";
    
    if (!defToLoad && PREFILLED_DEFINITIONS[uniqueId]) {
        defToLoad = PREFILLED_DEFINITIONS[uniqueId];
    }

    setAo1Definition(defToLoad);
    
    if (saved.ao2Chains && saved.ao2Chains.length > 0) {
        setChains(saved.ao2Chains);
    } else if (saved.modelChain) {
        // Migrate old single chain to new array format
        setChains([{ id: 'legacy', context: 'General', chain: saved.modelChain }]);
    } else {
        setChains([]);
    }
    
    setDefSaved(false);
    setChainError(false);
  };

  const closeTrainer = () => {
    setActiveTrainingPoint(null);
    setAo1Definition("");
    setChains([]);
    setDefSaved(false);
    setChainError(false);
  };

  // --- Actions ---

  const handleSaveAll = () => {
      if (!activeTrainingPoint) return;
      onUpdateStatus(prev => ({
          ...prev,
          [activeTrainingPoint.id]: {
              ...prev[activeTrainingPoint.id],
              ao1Definition: ao1Definition,
              ao2Chains: chains,
              lastPracticed: new Date().toISOString()
          }
      }));
  };

  const handleManualSaveDefinition = () => {
      handleSaveAll();
      setDefSaved(true);
      setTimeout(() => setDefSaved(false), 2000);
  };

  const handleCleanFormat = () => {
      // Replaces all whitespace sequences (including newlines) with a single space
      const cleaned = ao1Definition.replace(/\s+/g, ' ').trim();
      setAo1Definition(cleaned);
  };

  const handleAddChain = async () => {
      if (!activeTrainingPoint) return;
      setChainLoading(true);
      setChainError(false);
      try {
          // PASSING ao1Definition here to base the chain on the definition
          const result = await generateSyllabusLogicChain(
              activeTrainingPoint.topic, 
              activeTrainingPoint.text, 
              newChainContext,
              ao1Definition // Pass the definition as context
          );
          
          const newChain: LogicChainItem = {
              id: Date.now().toString(),
              context: newChainContext || "General Chain",
              chain: result
          };
          
          const updatedChains = [...chains, newChain];
          setChains(updatedChains);
          setNewChainContext("");

          // Auto-save
          onUpdateStatus(prev => ({
              ...prev,
              [activeTrainingPoint.id]: { ...prev[activeTrainingPoint.id], ao2Chains: updatedChains }
          }));

      } catch (e) {
          setChainError(true);
      }
      setChainLoading(false);
  };

  const handleDeleteChain = (chainId: string) => {
      if (!activeTrainingPoint) return;
      if (!confirm("Delete this logic chain?")) return;
      
      const updatedChains = chains.filter(c => c.id !== chainId);
      setChains(updatedChains);
      
      onUpdateStatus(prev => ({
          ...prev,
          [activeTrainingPoint.id]: { ...prev[activeTrainingPoint.id], ao2Chains: updatedChains }
      }));
  };

  const submitNewPoint = (subsectionId: string) => {
      if (newPointText.trim()) {
          onAddPoint(subsectionId, newPointText.trim());
          setNewPointText("");
          setAddingToSubsection(null);
      }
  };

  const handleGenerateWorksheet = async () => {
    if (!worksheetModalData) return;
    setIsGeneratingWorksheet(true);
    setWorksheetContent("");

    try {
      const chapterName = `${worksheetModalData.sectionId} - ${worksheetModalData.subTitle}`;
      const points = worksheetModalData.points.join("\n");
      
      let syllabusContent = "";
      
      const sectionKey = `SUBSECTION-${worksheetModalData.sectionId}-${worksheetModalData.subTitle}`;
      const examGuide = statusMap[sectionKey]?.examGuide || "";
      if (examGuide) {
          syllabusContent += `EXAM GUIDE (Exam requirements and tips):\n${examGuide}\n\n`;
      }
      
      worksheetModalData.points.forEach((point, i) => {
          const uniqueId = `${worksheetModalData.sectionId}-${worksheetModalData.subTitle}-${i}`;
          const data = statusMap[uniqueId];
          let def = data?.ao1Definition || data?.ao1Notes;
          
          if (!def && PREFILLED_DEFINITIONS[uniqueId]) {
              def = PREFILLED_DEFINITIONS[uniqueId];
          }
          if (!def) def = "(No definition saved)";

          syllabusContent += `Point: ${point}\nDefinition: ${def}\n\n`;
      });

      const result = await generateWorksheet(chapterName, points, syllabusContent, worksheetInstructions);
      setWorksheetContent(result.worksheet);
      setWorksheetAnswerKey(result.answerKey);
      setWorksheetTab('worksheet');
      
      const worksheetKey = `WORKSHEET-${worksheetModalData.sectionId}-${worksheetModalData.subTitle}`;
      onUpdateStatus(prev => ({
        ...prev,
        [worksheetKey]: {
          ...prev[worksheetKey],
          status: prev[worksheetKey]?.status || null,
          worksheetContent: result.worksheet,
          worksheetAnswerKey: result.answerKey
        }
      }));
    } catch(e) {
      alert("Failed to generate worksheet.");
    }
    setIsGeneratingWorksheet(false);
  };

  const handlePrintWorksheet = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Worksheet: ${worksheetModalData?.subTitle}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
              h1, h2, h3 { color: #1e3a8a; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
              ol, ul { margin-bottom: 20px; }
              .markdown-body { padding: 20px; }
              @media print {
                body { padding: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <button onclick="window.print()" style="padding: 10px 20px; margin-bottom: 20px; cursor: pointer; background: #6366f1; color: white; border: none; border-radius: 4px;">Print Worksheet</button>
            <div id="content"></div>
          </body>
        </html>
      `);
      
      const contentDiv = document.getElementById('rendered-worksheet');
      if (contentDiv) {
         printWindow.document.getElementById('content')!.innerHTML = contentDiv.innerHTML;
      }
      printWindow.document.close();
    }
  };

  const handleExportWorksheetWord = () => {
    if (!worksheetModalData) return;
    const contentDiv = document.getElementById('rendered-worksheet');
    if (!contentDiv) return;

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${worksheetModalData.subTitle} Worksheet</title>
    <style>
      body { font-family: 'Calibri', sans-serif; font-size: 11pt; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20pt; }
      table, th, td { border: 1pt solid black; }
      th, td { padding: 5pt; text-align: left; }
      h1, h2, h3 { color: #2e74b5; }
    </style>
    </head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + contentDiv.innerHTML + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${worksheetModalData.subTitle}_Worksheet_${worksheetTab}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const handleExportHandbook = (sectionId: string, subTitle: string, points: string[]) => {
      // Logic same as before...
      const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${subTitle} Revision Handbook</title>
      <style>
        body { font-family: 'Calibri', sans-serif; font-size: 10pt; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #94a3b8; padding: 12px; vertical-align: top; }
        th { background-color: #f1f5f9; text-align: left; }
        .syllabus-col { width: 25%; font-weight: bold; color: #1e293b; background-color: #f8fafc; }
        .content-col { width: 75%; }
        .ao1-box { margin-bottom: 15px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 10px; }
        .ao1-label { font-weight: bold; color: #b91c1c; display: block; margin-bottom: 4px; text-transform: uppercase; font-size: 8pt; }
        .ao2-label { font-weight: bold; color: #047857; display: block; margin-bottom: 4px; text-transform: uppercase; font-size: 8pt; margin-top: 10px;}
        .chain-item { margin-bottom: 8px; background: #f0fdf4; padding: 8px; border-radius: 4px; border: 1px solid #bbf7d0; }
        .chain-context { font-weight: bold; font-size: 9pt; color: #166534; }
      </style>
      </head><body>`;
      
      let html = `<h1 style="color:#1e3a8a; border-bottom: 2px solid #1e3a8a;">Revision Handbook: ${subTitle}</h1>`;
      
      const sectionKey = `SUBSECTION-${sectionId}-${subTitle}`;
      const examGuide = statusMap[sectionKey]?.examGuide || "";
      if (examGuide) {
          html += `<div style="background-color: #fffbeb; border: 1px solid #fcd34d; padding: 15px; margin-bottom: 20px; border-radius: 6px;">
              <h2 style="color: #d97706; font-size: 14pt; margin-top: 0; margin-bottom: 10px;">Exam Guide</h2>
              <div style="font-size: 11pt; color: #92400e;">${examGuide.replace(/\n/g, '<br/>')}</div>
          </div>`;
      }
      
      html += `<table>`;
      html += `<tr><th>Syllabus Point</th><th>Revision Content (AO1 Definition + AO2 Analysis)</th></tr>`;
      
      points.forEach((point, i) => {
          const uniqueId = `${sectionId}-${subTitle}-${i}`;
          const data = statusMap[uniqueId];
          let def = data?.ao1Definition || data?.ao1Notes;
          
          if (!def && PREFILLED_DEFINITIONS[uniqueId]) {
              def = PREFILLED_DEFINITIONS[uniqueId];
          }
          if (!def) def = "(No definition saved)";
          
          let chainsHtml = "";
          if (data?.ao2Chains && data.ao2Chains.length > 0) {
              chainsHtml = data.ao2Chains.map(c => `
                  <div class="chain-item">
                      <div class="chain-context">${c.context}</div>
                      ${c.chain.replace(/\n/g, '<br/>')}
                  </div>
              `).join('');
          } else if (data?.modelChain) {
              chainsHtml = `<div class="chain-item"><div class="chain-context">General</div>${data.modelChain}</div>`;
          } else {
              chainsHtml = "<i>(No logic chains generated)</i>";
          }
          
          html += `<tr>
            <td class="syllabus-col">${point}</td>
            <td class="content-col">
                <div class="ao1-box">
                    <span class="ao1-label">AO1: Knowledge Definition (Memorize)</span>
                    ${def.replace(/\n/g, '<br/>')}
                </div>
                <div>
                    <span class="ao2-label">AO2: Economic Logic Chains (Understand)</span>
                    ${chainsHtml}
                </div>
            </td>
          </tr>`;
      });
      
      html += "</table></body></html>";
      
      const blob = new Blob([header + html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Handbook_${subTitle.replace(/[^a-z0-9]/gi, '_')}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const processSyllabusPoints = (points: string[]) => {
    const processed: ({ type: 'group'; header: string; items: { idx: number; text: string }[] } | { type: 'single'; item: { idx: number; text: string } })[] = [];
    
    points.forEach((point, idx) => {
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

  const renderPointRow = (sectionId: string, subTitle: string, uniqueId: string, pointText: string, isCustom = false, customId?: string) => {
      const currentStatus = statusMap[uniqueId]?.status;
      const savedDef = statusMap[uniqueId]?.ao1Definition || statusMap[uniqueId]?.ao1Notes;
      
      const hasDef = !!savedDef || !!PREFILLED_DEFINITIONS[uniqueId];
      
      const chainCount = statusMap[uniqueId]?.ao2Chains?.length || (statusMap[uniqueId]?.modelChain ? 1 : 0);

      return (
        <div key={uniqueId} className="flex items-start gap-3 group mb-3 last:mb-0">
          <div className="flex-shrink-0 flex gap-1 mt-0.5">
            <button 
              onClick={(e) => { e.stopPropagation(); updateStatus(uniqueId, 'R'); }}
              className={`w-3 h-3 rounded-full border border-red-200 ${currentStatus === 'R' ? 'bg-red-500 ring-2 ring-red-100' : 'bg-white hover:bg-red-100'}`}
              title="Red: Needs work"
            />
            <button 
              onClick={(e) => { e.stopPropagation(); updateStatus(uniqueId, 'A'); }}
              className={`w-3 h-3 rounded-full border border-amber-200 ${currentStatus === 'A' ? 'bg-amber-500 ring-2 ring-amber-100' : 'bg-white hover:bg-amber-100'}`}
              title="Amber: Getting there"
            />
            <button 
              onClick={(e) => { e.stopPropagation(); updateStatus(uniqueId, 'G'); }}
              className={`w-3 h-3 rounded-full border border-green-200 ${currentStatus === 'G' ? 'bg-green-500 ring-2 ring-green-100' : 'bg-white hover:bg-green-100'}`}
              title="Green: Confident"
            />
          </div>
          <div 
            onClick={() => openTrainer(uniqueId, pointText, subTitle)}
            className="flex-1 cursor-pointer hover:bg-blue-50/50 rounded -m-1 p-1 transition-colors relative"
          >
              <div className="flex justify-between items-start">
                  <span className={`text-sm leading-snug ${currentStatus ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
                    {isCustom && <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2 mb-0.5"></span>}
                    {pointText}
                  </span>
                  {isCustom && customId && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeletePoint(subTitle, customId); }}
                        className="text-slate-300 hover:text-red-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  )}
              </div>
              <div className="flex gap-2 mt-1 min-h-[16px]">
                  {hasDef && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-700">
                          AO1 Ready
                      </span>
                  )}
                  {chainCount > 0 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700">
                          {chainCount} Chains
                      </span>
                  )}
                  {/* Hint for empty state on hover */}
                  {(!hasDef && chainCount === 0) && (
                      <span className="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to add definitions & logic
                      </span>
                  )}
              </div>
          </div>
        </div>
      );
  };

  return (
    <div className="flex h-full">
      {/* List Area */}
      <div className={`flex-1 overflow-y-auto custom-scroll p-8 ${activeTrainingPoint ? 'hidden md:block md:w-1/2' : 'w-full'}`}>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Syllabus Revision Handbook</h2>
        
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
                    const rawCustomPoints = customPoints[sub.id] || [];
                    
                    // Filter out custom points that already exist in the syllabus points (exact string match)
                    // This hides duplicates after user has synced code
                    const visibleCustomPoints = rawCustomPoints.filter(cp => !sub.points.includes(cp.text));

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
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { 
                                          e.stopPropagation(); 
                                          setWorksheetModalData({ sectionId: section.id, subTitle: sub.title, points: sub.points });
                                          
                                          const key = `WORKSHEET-${section.id}-${sub.title}`;
                                          const existingData = statusMap[key];
                                          const prefilledData = PREFILLED_WORKSHEETS[key];
                                          setWorksheetContent(existingData?.worksheetContent || prefilledData?.worksheetContent || ""); 
                                          setWorksheetAnswerKey(existingData?.worksheetAnswerKey || prefilledData?.worksheetAnswerKey || "");
                                          setWorksheetInstructions("");
                                          setWorksheetTab('worksheet');
                                        }}
                                        className="p-1.5 bg-white text-purple-600 rounded hover:bg-purple-100 transition-colors shadow-sm text-xs font-bold flex items-center gap-1"
                                        title="Generate Worksheet"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        Worksheet
                                    </button>
                                    <button 
                                        onClick={() => handleExportHandbook(section.id, sub.title, sub.points)}
                                        className="p-1.5 bg-white text-blue-600 rounded hover:bg-blue-100 transition-colors shadow-sm text-xs font-bold flex items-center gap-1"
                                        title="Export Revision Handbook"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        Handbook
                                    </button>
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
                                               {groupOrSingle.items.map(item => {
                                                   const uniqueId = `${section.id}-${sub.title}-${item.idx}`;
                                                   return renderPointRow(section.id, sub.title, uniqueId, item.text);
                                               })}
                                           </div>
                                       </div>
                                   )
                               } else {
                                   const uniqueId = `${section.id}-${sub.title}-${groupOrSingle.item.idx}`;
                                   return (
                                       <div key={groupIdx} className="mb-3">
                                           {renderPointRow(section.id, sub.title, uniqueId, groupOrSingle.item.text)}
                                       </div>
                                   )
                               }
                            })}

                            {/* Render Custom Points (Only visible ones) */}
                            {visibleCustomPoints.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                                    <h5 className="text-[10px] font-bold text-purple-500 uppercase mb-2">My Additional Points (AO3/Eval)</h5>
                                    {visibleCustomPoints.map(cp => (
                                        renderPointRow(section.id, sub.id, cp.id, cp.text, true, cp.id)
                                    ))}
                                </div>
                            )}

                            {/* Add Point UI */}
                            {addingToSubsection === sub.id ? (
                                <div className="mt-3 p-2 bg-purple-50 rounded border border-purple-100">
                                    <textarea 
                                        className="w-full text-sm p-2 border border-purple-200 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        placeholder="e.g. Evaluate the effectiveness of..."
                                        rows={2}
                                        value={newPointText}
                                        onChange={(e) => setNewPointText(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button 
                                            onClick={() => setAddingToSubsection(null)}
                                            className="text-xs text-slate-500 hover:text-slate-700"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => submitNewPoint(sub.id)}
                                            className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => { setAddingToSubsection(sub.id); setNewPointText(""); }}
                                    className="mt-2 w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-bold hover:border-purple-300 hover:text-purple-600 transition-colors flex items-center justify-center gap-1"
                                >
                                    <span>+</span> Add Custom Point
                                </button>
                            )}

                            {/* Exam Guide */}
                            <div className="mt-6 pt-4 border-t border-slate-200">
                                <h5 className="text-xs font-bold text-amber-600 uppercase mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    Exam Guide
                                </h5>
                                <p className="text-[10px] text-slate-500 mb-2">Paste exam tips, past paper requirements, or specific test points here. This will be used when generating worksheets.</p>
                                <textarea 
                                    className="w-full text-sm p-3 border border-amber-200 bg-amber-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                                    placeholder="Enter exam guide..."
                                    rows={4}
                                    value={statusMap[`SUBSECTION-${section.id}-${sub.title}`]?.examGuide || ""}
                                    onChange={(e) => {
                                        const sectionKey = `SUBSECTION-${section.id}-${sub.title}`;
                                        onUpdateStatus(prev => ({
                                            ...prev,
                                            [sectionKey]: {
                                                ...prev[sectionKey] || { status: null },
                                                examGuide: e.target.value
                                            }
                                        }));
                                    }}
                                />
                            </div>
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

      {/* Trainer Panel */}
      {activeTrainingPoint && (
        <div className="w-full md:w-1/2 bg-white border-l border-slate-200 shadow-xl flex flex-col h-full z-20 absolute md:static top-0 right-0">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-blue-50">
            <div>
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Revision Card</h3>
              <p className="text-xs text-blue-700 mt-1 max-w-md truncate" title={activeTrainingPoint.topic}>{activeTrainingPoint.topic}</p>
            </div>
            <button onClick={closeTrainer} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-8">
            <div className="mb-6 bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Syllabus Point</span>
              <p className="text-lg font-medium text-slate-800 mt-1">{activeTrainingPoint.text}</p>
            </div>

            {/* AO1 SECTION */}
            <div>
              <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-red-700 uppercase tracking-wide">
                      AO1: Standard Definition (Manual Entry)
                  </label>
                  <div className="flex gap-2">
                    <button 
                        onClick={handleCleanFormat}
                        className="text-[10px] font-bold px-3 py-1.5 rounded transition-colors border bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        title="Remove extra line breaks from copied text"
                    >
                        Clean Format
                    </button>
                    <button 
                        onClick={handleManualSaveDefinition}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded transition-colors border ${defSaved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        {defSaved ? "Saved!" : "Save Definition"}
                    </button>
                  </div>
              </div>
              <div className="relative">
                  <textarea 
                    className="w-full h-32 p-4 border border-red-200 rounded-lg resize-none focus:ring-2 focus:ring-red-500 outline-none text-slate-700 text-sm bg-red-50/20"
                    placeholder="Paste the official textbook definition here to memorize..."
                    value={ao1Definition}
                    onChange={(e) => setAo1Definition(e.target.value)}
                    onBlur={handleSaveAll}
                  />
              </div>
            </div>

            {/* AO2 SECTION */}
            <div>
              <label className="block text-sm font-bold text-green-700 uppercase tracking-wide mb-3">
                  AO2: Economic Logic Chains
              </label>
              
              {/* Existing Chains List */}
              <div className="space-y-4 mb-4">
                  {chains.map((item, idx) => (
                      <div key={item.id} className="bg-green-50 border border-green-200 rounded-lg p-3 relative group">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold text-green-800 bg-green-200 px-2 py-0.5 rounded">{item.context}</span>
                              <button onClick={() => handleDeleteChain(item.id)} className="text-green-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                          </div>
                          
                          {/* IMPROVED STYLING FOR LOGIC CHAIN OUTPUT */}
                          <div className="bg-white p-3 rounded border border-green-100">
                              <div className="prose prose-blue max-w-none text-sm leading-7">
                                  <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                        li: ({node, ...props}) => <li className="mb-1" {...props} />
                                    }}
                                  >
                                      {item.chain}
                                  </ReactMarkdown>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              {/* Add New Chain */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                  <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        placeholder="Context (e.g. 'Short Run' or 'Impact on Consumers')"
                        className="flex-1 text-xs p-2 border border-slate-200 rounded focus:ring-1 focus:ring-green-500 outline-none"
                        value={newChainContext}
                        onChange={(e) => setNewChainContext(e.target.value)}
                      />
                      <button 
                        onClick={handleAddChain}
                        disabled={chainLoading}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1 rounded transition-colors disabled:opacity-50"
                      >
                        {chainLoading ? "..." : "Generate Chain"}
                      </button>
                  </div>
                  {chainError && (
                      <div className="text-center py-2">
                          <span className="text-xs text-red-500 mr-2">Generation failed.</span>
                          <button onClick={handleAddChain} className="text-xs underline text-red-600 font-bold">Retry</button>
                      </div>
                  )}
                  <p className="text-[10px] text-slate-400 italic text-center">
                      AI will generate a step-by-step chain (A → B → C) based on this context.
                  </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Worksheet Generator Modal */}
      {worksheetModalData && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Generate Worksheet for {worksheetModalData.subTitle}</h3>
                <p className="text-xs text-slate-500">Provide textbook materials below to generate a student worksheet based on syllabus points.</p>
              </div>
              <button onClick={() => setWorksheetModalData(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 p-6 border-r border-slate-200 overflow-y-auto space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-4">
                    The AI will use the AO1 definitions and AO2 logic chains you have saved in this section to generate the worksheet.
                  </p>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Additional Instructions (Optional)</label>
                  <textarea 
                    className="w-full h-32 p-3 text-sm border border-slate-300 rounded resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="E.g., Include multiple-choice questions..."
                    value={worksheetInstructions}
                    onChange={(e) => setWorksheetInstructions(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleGenerateWorksheet}
                  disabled={isGeneratingWorksheet}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded transition-colors disabled:opacity-50"
                >
                  {isGeneratingWorksheet ? "Generating..." : "Generate Worksheet"}
                </button>
              </div>
              
              <div className="w-full md:w-2/3 p-6 bg-slate-50 overflow-y-auto flex flex-col">
                {isGeneratingWorksheet ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-purple-500">
                    <svg className="animate-spin w-8 h-8 mb-4 border-t-2 border-purple-500 rounded-full border-r-transparent" viewBox="0 0 24 24"></svg>
                    <p className="font-medium">Synthesizing textbook content and syllabus points...</p>
                  </div>
                ) : worksheetContent ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex bg-slate-200 p-1 rounded-lg">
                        <button 
                          onClick={() => setWorksheetTab('worksheet')}
                          className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${worksheetTab === 'worksheet' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                        >
                          Worksheet
                        </button>
                        <button 
                          onClick={() => setWorksheetTab('answerKey')}
                          className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${worksheetTab === 'answerKey' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                        >
                          Answer Key
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleExportWorksheetWord} className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded shadow-sm hover:bg-blue-200 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Word
                        </button>
                        <button onClick={handlePrintWorksheet} className="px-3 py-1.5 bg-slate-200 text-slate-800 text-xs font-bold rounded shadow-sm hover:bg-slate-300 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                          Print
                        </button>
                      </div>
                    </div>
                    <div id="rendered-worksheet" className="prose prose-sm max-w-none bg-white p-6 rounded border border-slate-200 min-h-[400px]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {worksheetTab === 'worksheet' ? worksheetContent : worksheetAnswerKey}
                      </ReactMarkdown>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                    <svg className="w-12 h-12 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p>Click "Generate" to create a worksheet from your saved syllabus content.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SyllabusTracker;
