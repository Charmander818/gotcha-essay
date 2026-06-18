const fs = require('fs');
let code = fs.readFileSync('services/geminiService.ts', 'utf8');
code = code.replace(/gemini-1\.5-flash/g, 'gemini-2.5-flash');
code = code.replace(/gemini-3\.5-flash/g, 'gemini-2.5-flash'); // Just in case
fs.writeFileSync('services/geminiService.ts', code);
console.log('Fixed models');
