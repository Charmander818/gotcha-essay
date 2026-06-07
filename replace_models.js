const fs = require('fs');
const file = 'services/geminiService.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/'gemini-2\.0-flash'/g, "'gemini-1.5-flash'");
fs.writeFileSync(file, code);
