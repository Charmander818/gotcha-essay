import { MCQ } from '../types';

export const exportPracticeBook = (mcqs: MCQ[], title: string) => {
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
          h1 { text-align: center; }
          h2 { border-bottom: 1px solid #ccc; padding-bottom: 8px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <h2>Questions</h2>
        ${mcqs.map((q, i) => `
          <div class="question">
            <div class="meta">Q${i + 1} (${q.paper} - Q${q.questionNum}) | ${q.topic}</div>
            <img src="${q.imageUrl}" />
          </div>
        `).join('')}
        
        <div class="answers">
          <h2>Answer Key</h2>
          <table style="width:100%; text-align:left; border-collapse: collapse;">
            <tr><th style="border-bottom: 1px solid #ccc; padding: 4px;">Q</th><th style="border-bottom: 1px solid #ccc; padding: 4px;">Ans</th><th style="border-bottom: 1px solid #ccc; padding: 4px;">Paper Info</th></tr>
            ${mcqs.map((q, i) => `
              <tr>
                <td style="border-bottom: 1px solid #eee; padding: 4px;">${i + 1}</td>
                <td style="border-bottom: 1px solid #eee; padding: 4px; font-weight: bold;">${q.correctAnswer}</td>
                <td style="border-bottom: 1px solid #eee; padding: 4px; font-size: 12px;">${q.paper} - Q${q.questionNum}</td>
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
