const fs = require('fs');

let data = fs.readFileSync('data.ts', 'utf8');

// The regex will look for chapter string and update the topic line preceding it.
// Actually, it's easier to just parse the objects or use a regex to replace topic based on chapter.

// Let's replace topic: SyllabusTopic.XY, chapter: "Z..." 
// with the correct topic.

data = data.replace(/topic:\s*SyllabusTopic\.[A-Z_]+,\s*chapter:\s*(['"])(7|8|9|10|11)\.([^'"]+)\1/g, (match, quote, num, rest) => {
    let newTopic = '';
    if (num === '7') newTopic = 'PRICE_SYSTEM_AL';
    else if (num === '8') newTopic = 'GOVT_MICRO_AL';
    else if (num === '9') newTopic = 'MACROECONOMY_AL';
    else if (num === '10') newTopic = 'GOVT_MACRO_AL';
    else if (num === '11') newTopic = 'INTERNATIONAL_AL';
    
    return `topic: SyllabusTopic.${newTopic},\n  chapter: ${quote}${num}.${rest}${quote}`;
});

fs.writeFileSync('data.ts', data);
console.log('Fixed topics in data.ts');
