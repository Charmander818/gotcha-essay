const fs = require('fs');
const text = fs.readFileSync('data.ts', 'utf8');
const matches = [...text.matchAll(/id: "custom.*?\n.*?year: "(.*?)".*?\n.*?paper: "(.*?)".*?\n.*?variant: "(.*?)".*?\n.*?questionNumber: "(.*?)"/g)];
const last = matches.slice(-40);
last.forEach(m => console.log(`${m[1]} ${m[2]} ${m[3]} ${m[4]} at index ${m.index}`));
