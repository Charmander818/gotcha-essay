import { MCQ } from '../types';

export const exportPracticeBook = (mcqs: MCQ[], title: string, includeAnnotations: boolean = false) => {
  const html = `
    <html>
      <head>
        <title>${title} - Practice Book</title>
        <style>
          body { font-family: sans-serif; padding: 40px; max-width: 900px; margin: auto; color: #1e293b; }
          #q-container { column-gap: 40px; }
          .question { margin-bottom: 40px; page-break-inside: avoid; display: inline-block; width: 100%; }
          .meta { font-size: 13px; color: #64748b; margin-bottom: 12px; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }
          .question img { width: 100%; height: auto; filter: contrast(1.05); }
          .answers { margin-top: 40px; page-break-before: always; }
          h1 { text-align: center; display: none; }
          h2 { border-bottom: 2px solid #ccc; padding-bottom: 8px; margin-top: 30px; font-size: 20px; color: #0f172a; }
          .annotation-text { white-space: pre-wrap; font-size: 13px; color: #475569; margin-top: 6px; padding-top: 6px; border-top: 1px dashed #e2e8f0; }
          
          /* Print Control Panel */
          .print-controls {
             position: fixed; top: 20px; right: 20px; background: white; padding: 20px; 
             border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; 
             z-index: 1000; display: flex; flex-direction: column; gap: 16px; width: 250px;
          }
          .print-controls label { font-size: 13px; font-weight: bold; color: #334155; }
          
          @media print {
            .no-print { display: none !important; }
            @page { margin: 15mm; }
            body { padding: 0; max-width: 100%; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print print-controls">
          <div>
             <label>统一图片宽度 (Image Width): <span id="zoom-val">100%</span></label>
             <input type="range" min="30" max="100" value="100" style="width: 100%; margin-top: 5px;" 
                oninput="document.getElementById('zoom-val').innerText = this.value + '%'; document.querySelectorAll('.question img').forEach(img => img.style.width = this.value + '%');" />
             <div style="font-size: 11px; color: #64748b; margin-top: 4px;">调小比例可统一缩小图片以适应一页排版，保证跨图缩放比例一致</div>
          </div>
          <div>
            <label>排版列数 (Columns): <span id="col-val">1</span></label>
            <input type="range" min="1" max="2" value="1" style="width: 100%; margin-top: 5px;" 
                oninput="document.getElementById('col-val').innerText = this.value; document.getElementById('q-container').style.columnCount = this.value;" />
             <div style="font-size: 11px; color: #64748b; margin-top: 4px;">双列排版可以极大节约打印篇幅</div>
          </div>
          <button onclick="window.print()" style="padding: 12px; background-color: #0ea5e9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 15px; margin-top: 8px;">
            Print / Save as PDF
          </button>
        </div>
        <div id="q-container">
        ${(() => {
          let currentTopic = '';
          return mcqs.map((q, i) => {
            let sectionHeader = '';
            if (q.topic !== currentTopic) {
              currentTopic = q.topic;
              sectionHeader = `<h2>${currentTopic}</h2>`;
            }
            return `
              ${sectionHeader}
              <div class="question">
                <div class="meta">Q${i + 1} (${q.paper} - Q${q.questionNum})</div>
                <img src="${q.imageUrl}" />
              </div>
            `;
          }).join('');
        })()}
        </div>
        
        <div class="answers">
          <h2>Answer Key ${includeAnnotations ? ' & Explanations' : ''}</h2>
          <table style="width:100%; text-align:left; border-collapse: collapse;">
            <tr>
              <th style="border-bottom: 1px solid #ccc; padding: 4px; width: 40px;">Q</th>
              <th style="border-bottom: 1px solid #ccc; padding: 4px; width: 60px;">Ans</th>
              <th style="border-bottom: 1px solid #ccc; padding: 4px;">Paper Info ${includeAnnotations ? '& Annotation' : ''}</th>
            </tr>
            ${mcqs.map((q, i) => `
              <tr>
                <td style="border-bottom: 1px solid #eee; padding: 4px; vertical-align: top;">${i + 1}</td>
                <td style="border-bottom: 1px solid #eee; padding: 4px; font-weight: bold; vertical-align: top;">${q.correctAnswer}</td>
                <td style="border-bottom: 1px solid #eee; padding: 4px; font-size: 12px; vertical-align: top;">
                  ${q.paper} - Q${q.questionNum}
                  ${includeAnnotations && q.annotation ? `<div class="annotation-text"><b>Explanation:</b><br/>${q.annotation.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>` : ''}
                </td>
              </tr>
            `).join('')}
          </table>
        </div>
      </body>
    </html>
  `;

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
  } else {
    alert("Please allow popups to export the practice book.");
  }
};
