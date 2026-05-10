const fs = require('fs');

const qs = JSON.parse(fs.readFileSync('al_questions_classified.json'));
let data = fs.readFileSync('data.ts', 'utf8');

qs.forEach(q => {
  // Accommodate quotes around id and chapter
  const idRegex = new RegExp(`(["']?id["']?:\\s*(['"])${q.id}\\2[\\s\\S]*?["']?chapter["']?:\\s*)(['"])(.*?)\\3`);
  
  if (idRegex.test(data)) {
      data = data.replace(idRegex, `$1$3${q.newChapter}$3`);
  } else {
      console.log('Failed to match ID:', q.id);
  }
});

fs.writeFileSync('data.ts', data);
console.log('Successfully updated data.ts with new chapters.');
