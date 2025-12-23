
import React, { useState, useEffect } from 'react';
import { SyllabusSection, CustomSyllabusPoint, SyllabusStatus } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  baseChecklist: SyllabusSection[];
  customPoints: Record<string, CustomSyllabusPoint[]>;
  currentStatus: Record<string, SyllabusStatus>;
  baseDefinitions: Record<string, string>;
}

type Tab = 'checklist' | 'definitions';

const SyllabusExportModal: React.FC<Props> = ({ isOpen, onClose, baseChecklist, customPoints, currentStatus, baseDefinitions }) => {
  const [activeTab, setActiveTab] = useState<Tab>('checklist');
  const [copied, setCopied] = useState(false);
  const [generatedChecklistCode, setGeneratedChecklistCode] = useState("");
  const [generatedDefCode, setGeneratedDefCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      generateCodes();
    }
  }, [isOpen, baseChecklist, customPoints, currentStatus]);

  const generateCodes = () => {
    // 1. Generate Checklist Code
    // We will accumulate definitions here as we calculate the new structure
    const exportDefinitions: Record<string, string> = { ...baseDefinitions };

    const mergedSections = baseChecklist.map(section => {
        const mergedSubsections = section.subsections.map(sub => {
            // Get original points
            const originalPoints = [...sub.points];
            // Get custom points for this subsection
            const extras = customPoints[sub.id] || [];
            
            // Only add custom points if they aren't already in the list
            const uniqueExtras = extras.filter(extra => !originalPoints.includes(extra.text));
            const uniqueExtraTexts = uniqueExtras.map(e => e.text);
            
            const finalPointsList = [...originalPoints, ...uniqueExtraTexts];

            // --- Definitions Mapping Logic ---
            // Iterate through the FINAL list of points for this subsection
            finalPointsList.forEach((pointText, index) => {
                // The new ID for this point once it's hardcoded
                const newStandardId = `${section.id}-${sub.title}-${index}`;

                // 1. Check if we have a definition for this point under its 'custom' ID
                // (Only relevant if it was one of the uniqueExtras)
                const sourceCustomPoint = uniqueExtras.find(e => e.text === pointText);
                
                if (sourceCustomPoint) {
                    // It was a custom point. Does it have saved data?
                    const status = currentStatus[sourceCustomPoint.id];
                    if (status && status.ao1Definition && status.ao1Definition.trim().length > 5) {
                        exportDefinitions[newStandardId] = status.ao1Definition;
                    }
                } 
                
                // 2. Check if the user has EDITED the definition for an existing standard point
                // (e.g. they edited the hardcoded one)
                // In this case, the ID hasn't changed, but we want to capture their edit.
                // Or if they added a definition to a standard point that didn't have one.
                const existingStandardStatus = currentStatus[newStandardId];
                if (existingStandardStatus && existingStandardStatus.ao1Definition && existingStandardStatus.ao1Definition.trim().length > 5) {
                     exportDefinitions[newStandardId] = existingStandardStatus.ao1Definition;
                }
            });

            return {
                ...sub,
                points: finalPointsList
            };
        });
        return { ...section, subsections: mergedSubsections };
    });

    const checklistCode = `
import { SyllabusSection } from "./types";

export const SYLLABUS_CHECKLIST: SyllabusSection[] = ${JSON.stringify(mergedSections, null, 2)};
`;
    setGeneratedChecklistCode(checklistCode);

    // 2. Generate Definitions Code
    const defCode = `
// This file is for the TEACHER to hardcode standard definitions (AO1) or Model Chains (AO2).
// These will appear as the default content for students if they haven't written their own yet.

export const PREFILLED_DEFINITIONS: Record<string, string> = ${JSON.stringify(exportDefinitions, null, 2)};
`;
    setGeneratedDefCode(defCode);
  };

  if (!isOpen) return null;

  const activeCode = activeTab === 'checklist' ? generatedChecklistCode : generatedDefCode;
  const filename = activeTab === 'checklist' ? 'syllabusChecklistData.ts' : 'syllabusDefinitions.ts';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 bg-white rounded-t-xl">
           <div className="flex justify-between items-start">
               <div>
                   <h2 className="text-xl font-bold text-slate-800">Sync Syllabus Data to Source Code</h2>
                   <p className="text-sm text-slate-500 mt-2 max-w-xl">
                     This tool merges your custom additions (AO3 points) and saved Definitions (AO1) into code. 
                     Copy the content below and replace the corresponding file in your project to make changes permanent.
                   </p>
               </div>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
           </div>
           
           <div className="flex gap-4 mt-6">
               <button 
                 onClick={() => { setActiveTab('checklist'); setCopied(false); }}
                 className={`px-4 py-2 text-sm font-bold rounded-lg border-b-2 transition-colors ${activeTab === 'checklist' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
               >
                   1. syllabusChecklistData.ts
               </button>
               <button 
                 onClick={() => { setActiveTab('definitions'); setCopied(false); }}
                 className={`px-4 py-2 text-sm font-bold rounded-lg border-b-2 transition-colors ${activeTab === 'definitions' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
               >
                   2. syllabusDefinitions.ts
               </button>
           </div>
        </div>
        
        <div className="flex-1 p-0 overflow-hidden relative group border-b border-slate-100 bg-slate-900">
           <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center px-4 text-xs text-slate-400 font-mono border-b border-slate-700">
               Preview: {filename}
           </div>
           <textarea 
             readOnly
             className="w-full h-full pt-10 p-6 font-mono text-xs text-slate-300 bg-slate-900 resize-none focus:outline-none"
             value={activeCode}
           />
        </div>

        <div className="p-4 bg-slate-50 rounded-b-xl flex justify-end gap-3">
            <button
                onClick={handleCopy}
                className={`px-6 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm ${copied ? 'bg-green-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
                {copied ? (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        Copy Code
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default SyllabusExportModal;
