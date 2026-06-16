const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx') || name.endsWith('.ts')) {
      files.push(name);
    }
  }
  return files;
}

const buttonRegex = /<(button|a|div|span)[^>]*className=(["'\{`].*?)>/g;
const files = getFiles('components');
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let newContent = content.replace(buttonRegex, (match, tag, classNameStr) => {
     // if it has text or bg in a strong color, and it's a button or looks like one, or it has onClick
     if (tag === 'button' || tag === 'a' || match.includes('onClick')) {
        let replacedMatch = match.replace(/(bg|text|border|ring|shadow|hover:bg|hover:text|hover:border)-(blue|emerald|green|indigo|purple|slate)-(50|100|200|300|400|500|600|700|800|900)/g, "$1-primary-$3");
        return replacedMatch;
     }
     return match;
  });
  
  let newContent2 = newContent.replace(/<button([^>]*)>/g, (match, inner) => {
      let replaced = inner.replace(/(bg|text|border|ring|shadow|hover:bg|hover:text|hover:border)-(blue|emerald|green|indigo|purple|slate)-(50|100|200|300|400|500|600|700|800|900)/g, "$1-primary-$3");
      return `<button${replaced}>`;
  });
  
  if (content !== newContent2) {
     fs.writeFileSync(file, newContent2, 'utf-8');
     count++;
     console.log(`Updated ${file}`);
  }
}
console.log(`Updated ${count} files.`);
