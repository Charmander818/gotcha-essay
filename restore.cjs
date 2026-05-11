const { execSync } = require('child_process');
execSync('git checkout syllabusChecklistData.ts');
console.log('Restored');
