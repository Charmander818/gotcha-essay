const fs = require('fs');

const raw = fs.readFileSync('raw_alevel_syllabus.txt', 'utf8');
const lines = raw.split('\n');

let currentSection = '';
let currentSubSectionId = '';
let currentSubSectionTitle = '';
let currentPoints = [];

const parsedData = {};

for (let i = 0; i < lines.length; i++) {
  let line = lines[i].trim();
  if (!line) continue;

  // Match major sections like "7.1 Utility"
  const sectionMatch = line.match(/^(\d+\.\d+)\s+(.+)$/);
  // Match sub-sections like "7.1.1 Definition..."
  const subSectionMatch = line.match(/^(\d+\.\d+\.\d+)\.?\s*(.+)$/);

  if (sectionMatch && !subSectionMatch) {
    currentSection = sectionMatch[1];
    parsedData[currentSection] = [];
    currentSubSectionTitle = '';
    currentSubSectionId = '';
  } else if (subSectionMatch) {
    currentSubSectionId = subSectionMatch[1];
    currentSubSectionTitle = subSectionMatch[1] + " " + subSectionMatch[2];
    
    // Check next lines for continuation of the subtitle (no dots, not starting with •, not next section)
    let j = i + 1;
    while (j < lines.length) {
      let nextLine = lines[j].trim();
      if (!nextLine) {
        j++;
        continue;
      }
      if (nextLine.startsWith('•') || nextLine.match(/^(\d+\.\d+\.\d+)/) || nextLine.match(/^(\d+\.\d+)\s+/)) {
        break;
      }
      currentSubSectionTitle += " " + nextLine;
      j++;
    }
    i = j - 1; // update i
  } else if (line.startsWith('•')) {
    // Collect bullet points
    let pointText = line.substring(1).trim();
    // Sometimes a bullet point has a title part, e.g. "• the meaning of... \n • how to ..." -> handled by single lines
    
    // Check if next lines are continuation of the point
    let j = i + 1;
    while (j < lines.length) {
      let nextLine = lines[j].trim();
      if (!nextLine) {
        j++;
        continue;
      }
      if (nextLine.startsWith('•') || nextLine.match(/^(\d+\.\d+\.\d+)/) || nextLine.match(/^(\d+\.\d+)\s+/)) {
        break;
      }
      pointText += " " + nextLine;
      j++;
    }
    i = j - 1; // update i
    
    // Some bullets might have their own • combined from PDF copy-paste (e.g. • word • word)
    // Actually the user said "omit掉一些不必要的换行", so we combined them.
    if (currentSubSectionTitle && currentSection) {
      parsedData[currentSection].push(`${currentSubSectionTitle}: ${pointText}`);
    }
  } else {
    // If it's a line that doesn't match and we are inside a subsection, it might be a continuation of the last bullet point?
    // The previous loops already handled continuation lines!
  }
}

// Clean up some parts
for (const key in parsedData) {
    parsedData[key] = parsedData[key].map(p => {
        return p.replace(/•\s*/g, '').replace(/\s+/g, ' ').trim();
    });
}

fs.writeFileSync('parsed_alevel.json', JSON.stringify(parsedData, null, 2));
console.log("Parsed written to parsed_alevel.json");
