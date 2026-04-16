import React, { useState } from 'react';
import { coreConceptsData } from '../coreConceptsData';
import { BookOpen, CheckCircle, AlertTriangle, Lightbulb, ChevronRight, ChevronDown, Download, FileText } from 'lucide-react';

export const CoreConceptViewer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"Microeconomics" | "Macroeconomics">("Microeconomics");
  const [activeTopicId, setActiveTopicId] = useState<string>(coreConceptsData[0].topics[0].id);
  const [expandedConcepts, setExpandedConcepts] = useState<Record<string, boolean>>({});

  const activeCategoryData = coreConceptsData.find(c => c.category === activeCategory);
  const activeTopic = activeCategoryData?.topics.find(t => t.id === activeTopicId) || activeCategoryData?.topics[0];

  const toggleConcept = (conceptId: string) => {
    setExpandedConcepts(prev => ({
      ...prev,
      [conceptId]: !prev[conceptId]
    }));
  };

  const handleExportWord = () => {
    if (!activeTopic) return;

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Core Concepts: ${activeTopic.topic}</title>
    <style>
      body { font-family: 'Calibri', sans-serif; font-size: 11pt; }
      h1 { color: #1e3a8a; font-size: 18pt; margin-bottom: 5px; }
      h2 { color: #1e40af; font-size: 14pt; margin-top: 20px; margin-bottom: 5px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
      p { margin-bottom: 15px; line-height: 1.4; }
      .meta { color: #64748b; font-size: 10pt; margin-bottom: 20px; }
      .ao-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 10px; margin-top: 10px; margin-bottom: 10px; }
      .ao3-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 10px; margin-top: 10px; margin-bottom: 10px; }
      ul { margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
      li { margin-bottom: 5px; }
    </style>
    </head><body>`;
    const footer = "</body></html>";

    let html = `<h1>Topic: ${activeTopic.topic}</h1>`;
    html += `<p class="meta"><strong>Category:</strong> ${activeCategory}</p>`;

    activeTopic.concepts.forEach(concept => {
      html += `<h2>${concept.name}</h2>`;
      html += `<p><em>${concept.description}</em></p>`;
      
      html += `<div class="ao-box"><strong>AO2 (Application & Analysis) Points:</strong><ul>`;
      concept.ao2.forEach(pt => { html += `<li>${pt}</li>`; });
      html += `</ul></div>`;

      html += `<div class="ao3-box"><strong>AO3 (Evaluation) Points:</strong><ul>`;
      concept.ao3.forEach(pt => { html += `<li>${pt}</li>`; });
      html += `</ul></div>`;
    });

    const sourceHTML = header + html + footer;
    const blob = new Blob([sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CoreConcepts_${activeTopic.topic.replace(/[^a-z0-9]/gi, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAllWord = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Complete Core Concepts Guide</title>
    <style>
      body { font-family: 'Calibri', sans-serif; font-size: 11pt; }
      h1 { color: #1e3a8a; font-size: 18pt; margin-bottom: 5px; page-break-before: always; }
      h1:first-child { page-break-before: auto; }
      h2 { color: #1e40af; font-size: 14pt; margin-top: 20px; margin-bottom: 5px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
      p { margin-bottom: 15px; line-height: 1.4; }
      .meta { color: #64748b; font-size: 10pt; margin-bottom: 20px; }
      .ao-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 10px; margin-top: 10px; margin-bottom: 10px; }
      .ao3-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 10px; margin-top: 10px; margin-bottom: 10px; }
      ul { margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
      li { margin-bottom: 5px; }
    </style>
    </head><body>`;
    const footer = "</body></html>";

    let html = "";

    coreConceptsData.forEach(category => {
      category.topics.forEach(topic => {
        html += `<h1>Topic: ${topic.topic}</h1>`;
        html += `<p class="meta"><strong>Category:</strong> ${category.category}</p>`;

        topic.concepts.forEach(concept => {
          html += `<h2>${concept.name}</h2>`;
          html += `<p><em>${concept.description}</em></p>`;
          
          html += `<div class="ao-box"><strong>AO2 (Application & Analysis) Points:</strong><ul>`;
          concept.ao2.forEach(pt => { html += `<li>${pt}</li>`; });
          html += `</ul></div>`;

          html += `<div class="ao3-box"><strong>AO3 (Evaluation) Points:</strong><ul>`;
          concept.ao3.forEach(pt => { html += `<li>${pt}</li>`; });
          html += `</ul></div>`;
        });
      });
    });

    const sourceHTML = header + html + footer;
    const blob = new Blob([sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Complete_CoreConcepts_Guide_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-purple-600" />
          Core Concepts & Evaluation Frameworks
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          A definitive guide to non-policy exam frameworks. Master the standard AO2 arguments and AO3 evaluative counters.
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto flex flex-col">
          <div className="p-3 border-b border-slate-200 flex gap-2">
            <button
              onClick={() => {
                setActiveCategory("Microeconomics");
                setActiveTopicId(coreConceptsData.find(c => c.category === "Microeconomics")!.topics[0].id);
              }}
              className={`flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all ${
                activeCategory === "Microeconomics" 
                  ? "bg-purple-100 text-purple-700 shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Micro
            </button>
            <button
              onClick={() => {
                setActiveCategory("Macroeconomics");
                setActiveTopicId(coreConceptsData.find(c => c.category === "Macroeconomics")!.topics[0].id);
              }}
              className={`flex-1 py-1.5 px-3 rounded-md text-sm font-bold transition-all ${
                activeCategory === "Macroeconomics" 
                  ? "bg-purple-100 text-purple-700 shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Macro
            </button>
          </div>

          <div className="p-2 flex-1 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-2">
              Topics
            </h3>
            <div className="space-y-1">
              {activeCategoryData?.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                    activeTopicId === topic.id
                      ? "bg-purple-50 text-purple-700 font-bold border border-purple-200"
                      : "text-slate-600 hover:bg-slate-100 font-medium"
                  }`}
                >
                  <span className="truncate pr-2">{topic.topic}</span>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${activeTopicId === topic.id ? "text-purple-500" : "text-slate-400"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          {activeTopic && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">{activeTopic.topic}</h2>
                  <p className="text-sm text-slate-500">Analyze standard economic concepts with deep evaluation.</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={handleExportAllWord}
                    className="px-3 py-2 bg-white border border-slate-200 text-purple-600 font-bold rounded-lg text-xs hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                    title="Export All Concepts as Word Doc"
                  >
                    <Download className="w-4 h-4" />
                    Export All
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportWord}
                      className="px-3 py-2 bg-white border border-slate-200 text-blue-600 font-bold rounded-lg text-xs hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-sm w-full justify-center"
                      title="Export Current Topic as Word Doc"
                    >
                      <FileText className="w-4 h-4" />
                      Topic Word
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {activeTopic.concepts.map((concept) => {
                  const isExpanded = expandedConcepts[concept.id] ?? true;
                  
                  return (
                    <div key={concept.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <button 
                        onClick={() => toggleConcept(concept.id)}
                        className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200"
                      >
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-slate-800">{concept.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 font-medium">{concept.description}</p>
                        </div>
                        {isExpanded ? <ChevronDown className="text-slate-400 w-5 h-5 flex-shrink-0 ml-4" /> : <ChevronRight className="text-slate-400 w-5 h-5 flex-shrink-0 ml-4" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white">
                          
                          {/* AO2 Section */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-blue-600 font-bold border-b border-blue-100 pb-2">
                              <CheckCircle className="w-4 h-4" />
                              <h4>AO2: Application & Analysis (Arguments For / How it works)</h4>
                            </div>
                            <ul className="space-y-2">
                              {concept.ao2.map((point, i) => (
                                <li key={i} className="text-sm text-slate-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                                  <span className="leading-relaxed">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* AO3 Section */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-red-600 font-bold border-b border-red-100 pb-2">
                              <Lightbulb className="w-4 h-4" />
                              <h4>AO3: Evaluation (Counters / Arguments Against / Limitations)</h4>
                            </div>
                            <ul className="space-y-2">
                              {concept.ao3.map((point, i) => (
                                <li key={i} className="text-sm text-slate-700 bg-red-50/50 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                                  <span className="text-red-400 font-bold mt-0.5">•</span>
                                  <span className="leading-relaxed">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
