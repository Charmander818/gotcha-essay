import React, { useState } from 'react';
import { policyFeastData, EconomicProblem } from '../policyFeastData';
import { BookOpen, CheckCircle, AlertTriangle, Clock, Target, ShieldAlert, ChevronRight, ChevronDown, Download, FileText } from 'lucide-react';

export const PolicyFeastViewer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"Microeconomics" | "Macroeconomics">("Macroeconomics");
  const [activeProblemId, setActiveProblemId] = useState<string>(policyFeastData[0].problems[0].id);
  const [expandedPolicies, setExpandedPolicies] = useState<Record<string, boolean>>({});

  const activeCategoryData = policyFeastData.find(c => c.category === activeCategory);
  const activeProblem = activeCategoryData?.problems.find(p => p.id === activeProblemId) || activeCategoryData?.problems[0];

  const togglePolicy = (policyName: string) => {
    setExpandedPolicies(prev => ({
      ...prev,
      [policyName]: !prev[policyName]
    }));
  };

  const handleExportWord = () => {
    if (!activeProblem) return;

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>FEAST Analysis: ${activeProblem.problem}</title>
    <style>
      body { font-family: 'Calibri', sans-serif; font-size: 11pt; }
      h1 { color: #1e3a8a; font-size: 18pt; margin-bottom: 5px; }
      h2 { color: #1e40af; font-size: 14pt; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
      h3 { color: #334155; font-size: 12pt; margin-top: 15px; margin-bottom: 5px; }
      p { margin-bottom: 10px; line-height: 1.4; }
      .meta { color: #64748b; font-size: 10pt; margin-bottom: 20px; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      th, td { border: 1px solid #cbd5e1; padding: 10px; vertical-align: top; }
      .feast-f { background-color: #eef2ff; }
      .feast-e { background-color: #f0fdf4; }
      .feast-a { background-color: #eff6ff; }
      .feast-s { background-color: #fef2f2; }
      .feast-t { background-color: #fffbeb; }
    </style>
    </head><body>`;
    const footer = "</body></html>";

    let html = `<h1>FEAST Analysis: ${activeProblem.problem}</h1>`;
    html += `<p class="meta"><strong>Category:</strong> ${activeCategory}<br/><strong>Description:</strong> ${activeProblem.description}</p>`;

    activeProblem.policies.forEach(policy => {
      html += `<h2>Policy: ${policy.name}</h2>`;
      html += `<table>`;
      html += `<tr><td width="20%" class="feast-f"><strong>Feasibility</strong></td><td>${policy.feast.feasibility}</td></tr>`;
      html += `<tr><td class="feast-e"><strong>Effectiveness</strong></td><td>${policy.feast.effectiveness}</td></tr>`;
      html += `<tr><td class="feast-a"><strong>Appropriateness</strong></td><td>${policy.feast.appropriateness}</td></tr>`;
      html += `<tr><td class="feast-s"><strong>Side Effects</strong></td><td>${policy.feast.sideEffects}</td></tr>`;
      html += `<tr><td class="feast-t"><strong>Time Lag</strong></td><td>${policy.feast.timeLag}</td></tr>`;
      html += `</table>`;
    });

    const sourceHTML = header + html + footer;
    const blob = new Blob([sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FEAST_${activeProblem.problem.replace(/[^a-z0-9]/gi, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (!activeProblem) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>FEAST Analysis: ${activeProblem.problem}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: #334155; }
            h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0; }
            .meta { color: #64748b; font-size: 1em; margin-bottom: 30px; }
            h2 { color: #0f172a; margin-top: 30px; background-color: #f1f5f9; padding: 10px; border-radius: 6px; }
            
            .feast-grid { display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 30px; }
            .feast-item { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; break-inside: avoid; page-break-inside: avoid; display: flex; }
            .feast-label { width: 150px; padding: 12px; font-weight: bold; border-right: 1px solid #e2e8f0; display: flex; align-items: center; }
            .feast-content { padding: 12px; flex: 1; line-height: 1.5; }
            
            .f-label { background-color: #eef2ff; color: #4f46e5; }
            .e-label { background-color: #f0fdf4; color: #16a34a; }
            .a-label { background-color: #eff6ff; color: #2563eb; }
            .s-label { background-color: #fef2f2; color: #dc2626; }
            .t-label { background-color: #fffbeb; color: #d97706; }
            
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>FEAST Analysis: ${activeProblem.problem}</h1>
          <div class="meta">
             <strong>Category:</strong> ${activeCategory}<br/>
             <strong>Description:</strong> ${activeProblem.description}
          </div>

          ${activeProblem.policies.map(policy => `
            <h2>Policy: ${policy.name}</h2>
            <div class="feast-grid">
              <div class="feast-item">
                <div class="feast-label f-label">Feasibility</div>
                <div class="feast-content">${policy.feast.feasibility}</div>
              </div>
              <div class="feast-item">
                <div class="feast-label e-label">Effectiveness</div>
                <div class="feast-content">${policy.feast.effectiveness}</div>
              </div>
              <div class="feast-item">
                <div class="feast-label a-label">Appropriateness</div>
                <div class="feast-content">${policy.feast.appropriateness}</div>
              </div>
              <div class="feast-item">
                <div class="feast-label s-label">Side Effects</div>
                <div class="feast-content">${policy.feast.sideEffects}</div>
              </div>
              <div class="feast-item">
                <div class="feast-label t-label">Time Lag</div>
                <div class="feast-content">${policy.feast.timeLag}</div>
              </div>
            </div>
          `).join('')}

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleExportAllWord = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Complete FEAST Analysis</title>
    <style>
      body { font-family: 'Calibri', sans-serif; font-size: 11pt; }
      h1 { color: #1e3a8a; font-size: 18pt; margin-bottom: 5px; page-break-before: always; }
      h1:first-child { page-break-before: auto; }
      h2 { color: #1e40af; font-size: 14pt; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
      p { margin-bottom: 10px; line-height: 1.4; }
      .meta { color: #64748b; font-size: 10pt; margin-bottom: 20px; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      th, td { border: 1px solid #cbd5e1; padding: 10px; vertical-align: top; }
      .feast-f { background-color: #eef2ff; }
      .feast-e { background-color: #f0fdf4; }
      .feast-a { background-color: #eff6ff; }
      .feast-s { background-color: #fef2f2; }
      .feast-t { background-color: #fffbeb; }
    </style>
    </head><body>`;
    const footer = "</body></html>";

    let html = "";

    policyFeastData.forEach(category => {
      category.problems.forEach(problem => {
        html += `<h1>FEAST Analysis: ${problem.problem}</h1>`;
        html += `<p class="meta"><strong>Category:</strong> ${category.category}<br/><strong>Description:</strong> ${problem.description}</p>`;

        problem.policies.forEach(policy => {
          html += `<h2>Policy: ${policy.name}</h2>`;
          html += `<table>`;
          html += `<tr><td width="20%" class="feast-f"><strong>Feasibility</strong></td><td>${policy.feast.feasibility}</td></tr>`;
          html += `<tr><td class="feast-e"><strong>Effectiveness</strong></td><td>${policy.feast.effectiveness}</td></tr>`;
          html += `<tr><td class="feast-a"><strong>Appropriateness</strong></td><td>${policy.feast.appropriateness}</td></tr>`;
          html += `<tr><td class="feast-s"><strong>Side Effects</strong></td><td>${policy.feast.sideEffects}</td></tr>`;
          html += `<tr><td class="feast-t"><strong>Time Lag</strong></td><td>${policy.feast.timeLag}</td></tr>`;
          html += `</table>`;
        });
      });
    });

    const sourceHTML = header + html + footer;
    const blob = new Blob([sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Complete_FEAST_Analysis_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="text-blue-600" />
          Policy FEAST Masterclass
        </h1>
        <p className="text-gray-600 mt-1">
          A comprehensive guide to evaluating economic policies using the <strong>FEAST</strong> framework 
          (Feasibility, Effectiveness, Appropriateness, Side effects, Time lag).
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r overflow-y-auto flex flex-col">
          <div className="p-3 border-b flex gap-2">
            <button
              onClick={() => {
                setActiveCategory("Macroeconomics");
                setActiveProblemId(policyFeastData.find(c => c.category === "Macroeconomics")!.problems[0].id);
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeCategory === "Macroeconomics" 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Macro
            </button>
            <button
              onClick={() => {
                setActiveCategory("Microeconomics");
                setActiveProblemId(policyFeastData.find(c => c.category === "Microeconomics")!.problems[0].id);
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeCategory === "Microeconomics" 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Micro
            </button>
          </div>

          <div className="p-2 flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 mt-2">
              Problems to Solve
            </h3>
            <div className="space-y-1">
              {activeCategoryData?.problems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => setActiveProblemId(problem.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    activeProblemId === problem.id
                      ? "bg-blue-50 text-blue-700 font-medium border border-blue-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="truncate pr-2">{problem.problem}</span>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${activeProblemId === problem.id ? "text-blue-500" : "text-gray-400"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {activeProblem && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{activeProblem.problem}</h2>
                  <p className="text-sm text-gray-600">{activeProblem.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={handleExportAllWord}
                    className="px-3 py-2 bg-white border border-gray-200 text-emerald-600 font-bold rounded-lg text-xs hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                    title="Export All FEAST Analyses as Word Doc"
                  >
                    <Download className="w-4 h-4" />
                    Export All
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportWord}
                      className="px-3 py-2 bg-white border border-gray-200 text-blue-600 font-bold rounded-lg text-xs hover:bg-gray-50 transition-colors flex items-center gap-1 shadow-sm"
                      title="Export Current as Word Doc"
                    >
                      <FileText className="w-4 h-4" />
                      Word
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="px-3 py-2 bg-white border border-gray-200 text-red-600 font-bold rounded-lg text-xs hover:bg-gray-50 transition-colors flex items-center gap-1 shadow-sm"
                      title="Export Current as PDF / Print"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {activeProblem.policies.map((policy, index) => {
                  const isExpanded = expandedPolicies[policy.name] ?? true; // Default to expanded
                  
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <button 
                        onClick={() => togglePolicy(policy.name)}
                        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
                      >
                        <h3 className="text-base font-bold text-gray-800 text-left">{policy.name}</h3>
                        {isExpanded ? <ChevronDown className="text-gray-500 w-5 h-5" /> : <ChevronRight className="text-gray-500 w-5 h-5" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* F - Feasibility */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <h4>Feasibility</h4>
                            </div>
                            <p className="text-gray-700 text-xs leading-relaxed bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                              {policy.feast.feasibility}
                            </p>
                          </div>

                          {/* E - Effectiveness */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                              <Target className="w-4 h-4" />
                              <h4>Effectiveness</h4>
                            </div>
                            <p className="text-gray-700 text-xs leading-relaxed bg-green-50/50 p-2.5 rounded-lg border border-green-100">
                              {policy.feast.effectiveness}
                            </p>
                          </div>

                          {/* A - Appropriateness */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm">
                              <ShieldAlert className="w-4 h-4" />
                              <h4>Appropriateness</h4>
                            </div>
                            <p className="text-gray-700 text-xs leading-relaxed bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                              {policy.feast.appropriateness}
                            </p>
                          </div>

                          {/* S - Side Effects */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-red-600 font-bold text-sm">
                              <AlertTriangle className="w-4 h-4" />
                              <h4>Side Effects</h4>
                            </div>
                            <p className="text-gray-700 text-xs leading-relaxed bg-red-50/50 p-2.5 rounded-lg border border-red-100">
                              {policy.feast.sideEffects}
                            </p>
                          </div>

                          {/* T - Time Lag */}
                          <div className="space-y-1.5 md:col-span-2">
                            <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm">
                              <Clock className="w-4 h-4" />
                              <h4>Time Lag</h4>
                            </div>
                            <p className="text-gray-700 text-xs leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                              {policy.feast.timeLag}
                            </p>
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
