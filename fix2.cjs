const fs = require('fs');
let c = fs.readFileSync('components/AutoPDFImport.tsx', 'utf-8');
const fix = c.replace(/eq\.description \|\| "",[\s\S]*correctAnswer: parsedAnswers\[qNum - 1] \|\| 'A',/g, 
`description: eq.description || "",
                            questionText: eq.questionText || "",
                            imageUrl: croppedBase64,
                            correctAnswer: parsedAnswers[qNum - 1] || 'A',`
);
fs.writeFileSync('components/AutoPDFImport.tsx', fix);
