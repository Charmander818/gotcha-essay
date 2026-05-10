const fs = require('fs');

let data = fs.readFileSync('data.ts', 'utf8');

// Replace SyllabusTopic enums with strings temporarily to parse
data = data.replace(/SyllabusTopic\.([A-Z_0-9]+)/g, "'$1'");

// Extract the array using substring
const startIndex = data.indexOf('[');
const endIndex = data.lastIndexOf(']') + 1;
const arrayString = data.substring(startIndex, endIndex);

let arr;
try {
  arr = eval(arrayString);
} catch(e) {
  console.log("Evaluation error:", e.message);
  process.exit(1);
}

// Filter AL questions
const alQuestions = arr.filter(q => /^(7|8|9|10|11)\./.test(q.chapter) || q.topic === 'PRICE_SYSTEM_AL' || q.topic === 'GOVT_MICRO_AL' || q.topic === 'MACROECONOMY_AL' || q.topic === 'GOVT_MACRO_AL' || q.topic === 'INTERNATIONAL_AL');

fs.writeFileSync('al_questions.json', JSON.stringify(alQuestions, null, 2));
console.log("Extracted " + alQuestions.length + " AL questions");
