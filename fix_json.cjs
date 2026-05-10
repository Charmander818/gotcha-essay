const fs = require('fs');
const qs = JSON.parse(fs.readFileSync('al_questions_classified.json'));

qs.forEach(q => {
  const old = q.chapter.toLowerCase();
  const text = q.questionText.toLowerCase();

  if (old.includes('macroeconomic') || old.includes('effectiveness of policy') || q.topic === 'GOVT_MACRO_AL') {
    if (text.includes('interrelatedness') || text.includes('relationship') || text.includes('phillips') || text.includes('conflict')) {
      q.newChapter = '10.2 Links between macroeconomic problems and their interrelatedness';
    } else if (text.includes('objective')) {
      q.newChapter = '10.1 Government macroeconomic policy objectives';
    } else {
      q.newChapter = '10.3 Effectiveness of policy options to meet all macroeconomic objectives';
    }
  }
  
  if (old.includes('national income statistics') && text.includes('economic growth')) {
      q.newChapter = '9.2 Economic growth and sustainability';
  }
  
  if (old === '11.1 economic growth and economic development') {
      q.newChapter = '11.3 Economic development';
  }
  
  if (old === '8.1 market failure' && text.includes('macro')) {
      // Just to be sure 
  }
});

fs.writeFileSync('al_questions_classified.json', JSON.stringify(qs, null, 2));

console.log("Fixed JSON classification.");
