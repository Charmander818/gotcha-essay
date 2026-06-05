import { MCQ } from '../types';

export const exportPracticeBook = (mcqs: MCQ[], title: string, includeAnnotations: boolean = false) => {
  const html = `
    <html>
      <head>
        <title>${title} - Practice Book</title>
        <style>
          body { font-family: sans-serif; padding: 40px; max-width: 800px; margin: auto; }
          .question { margin-bottom: 40px; page-break-inside: avoid; }
          .meta { font-size: 12px; color: #666; margin-bottom: 8px; font-weight: bold; }
          img { max-width: 100%; max-height: 400px; object-fit: contain; }
          .answers { margin-top: 40px; page-break-before: always; }
          h1 { text-align: center; display: none; }
          h2 { border-bottom: 2px solid #ccc; padding-bottom: 8px; margin-top: 30px; font-size: 20px; color: #1e293b; }
          .annotation-text { white-space: pre-wrap; font-size: 12px; color: #475569; margin-top: 4px; padding-top: 4px; border-top: 1px dashed #eee; }
          @media print {
            .no-print { display: none !important; }
            @page { margin: 0; }
            body { padding: 15mm; max-width: 100%; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: right; margin-bottom: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #059669; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">Print / Save as PDF</button>
        </div>
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
