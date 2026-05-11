const fs = require('fs');
const parsedData = JSON.parse(fs.readFileSync('parsed_alevel.json', 'utf8'));
const checklistText = fs.readFileSync('syllabusChecklistData.ts', 'utf8');

// I will parse checklist text manually or use string replacement.
// Since it's typescript, we could extract the `SYLLABUS_CHECKLIST` array via a bit of regex,
// but it's simpler to just manipulate the JSON directly if I strip the export.

let dataStr = checklistText.replace(/import .*?;\n*/, '').replace(/export const SYLLABUS_CHECKLIST: SyllabusSection\[\] = /, '').replace(/;$/, '');
let checklist = [];
try {
  // Try to parse as JSON. But it's JS (keys have quotes mostly, but let's see if it's strict JSON)
  checklist = eval('(' + dataStr + ')');
} catch (e) {
  console.error("Failed to parse", e);
}

for (const section of checklist) {
  if (["7", "8", "9", "10", "11"].includes(section.id)) {
    for (const subsection of section.subsections) {
      if (parsedData[subsection.id]) {
        // use Set to remove duplicates that sometimes appear from weird parsing
        subsection.points = [...new Set(parsedData[subsection.id])];
      }
    }
  }
}

const output = `import { SyllabusSection } from "./types";\n\nexport const SYLLABUS_CHECKLIST: SyllabusSection[] = ${JSON.stringify(checklist, null, 2)};\n`;

fs.writeFileSync('syllabusChecklistData.ts', output);
console.log("Updated syllabusChecklistData.ts");
