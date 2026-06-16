const fs = require('fs');
const glob = require('glob');

const buttonRegex = /<(button|a|div)[^>]*className=(["'\{`].*?)>/g;

glob("components/**/*.tsx", (err, files) => {
  if (err) throw err;
  let count = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let newContent = content.replace(buttonRegex, (match, tag, classNameStr) => {
       // if it has text or bg in a strong color, and it's a button or looks like one, or it has onClick
       if (tag === 'button' || tag === 'a' || match.includes('onClick')) {
          let replacedMatch = match.replace(/(bg|text|border|ring|shadow|hover:bg|hover:text|hover:border|shadow)-(blue|emerald|green|indigo|purple)-(50|100|200|300|400|500|600|700|800|900)/g, "$1-primary-$3");
          return replacedMatch;
       }
       return match;
    });
    
    // There are some buttons that maybe broke across lines, but we can do a simpler replace on the whole file if they are obvious button elements
    let newContent2 = newContent.replace(/<button([^>]*)>/g, (match, inner) => {
        let replaced = inner.replace(/(bg|text|border|ring|shadow|hover:bg|hover:text|hover:border)-(blue|emerald|green|indigo|purple)-(50|100|200|300|400|500|600|700|800|900)/g, "$1-primary-$3");
        return `<button${replaced}>`;
    });
    
    if (content !== newContent2) {
       fs.writeFileSync(file, newContent2, 'utf-8');
       count++;
       console.log(`Updated ${file}`);
    }
  }
  console.log(`Updated ${count} files.`);
});
