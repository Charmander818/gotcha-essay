const fs = require('fs');

const generate = (questions, idStart) => {
  let idCounter = idStart;
  const blocks = questions.map(q => {
    return '  {\n' +
      '    id: "custom-' + (idCounter++) + '",\n' +
      '    year: "' + q.year + '",\n' +
      '    paper: "' + q.paper + '",\n' +
      '    variant: "' + q.variant + '",\n' +
      '    questionNumber: "' + q.questionNumber + '",\n' +
      '    topic: ' + q.topic + ',\n' +
      '    chapter: "' + q.chapter + '",\n' +
      '    maxMarks: ' + q.maxMarks + ',\n' +
      '    questionText: ' + JSON.stringify(q.questionText) + ',\n' +
      '    markScheme: ' + '`' + q.markScheme.replace(/\`/g, '\\`') + '`' + '\n' +
      '  }';
  });
  
  let text = fs.readFileSync('data.ts', 'utf8');
  text = text.replace(/\];$/, ',\n' + blocks.join(',\n') + '\n];');
  fs.writeFileSync('data.ts', text);
};

const q1 = require('./set1_data.js');
const q2 = require('./set2_data.js');
const q3 = require('./set3_data.js');
const q4 = require('./set4_data.js');
const q5 = require('./set5_data.js');

generate(q1, 1778313738000);
generate(q2, 1778313738010);
generate(q3, 1778313738020);
generate(q4, 1778313738030);
generate(q5, 1778313738040);
console.log("Done");
