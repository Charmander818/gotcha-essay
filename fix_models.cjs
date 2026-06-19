const fs = require('fs');
let code = fs.readFileSync('services/geminiService.ts', 'utf8');
code = code.replace(/gemini-3\.5-flash/g, 'gemini-3.1-flash-lite');
fs.writeFileSync('services/geminiService.ts', code);
console.log('Fixed models');
