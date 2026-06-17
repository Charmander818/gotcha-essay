const fs = require('fs');

let old = fs.readFileSync('components/AutoPDFImport.tsx', 'utf-8');

// Find the index of cropCanvas.toDataURL
const startCrop = old.indexOf("const croppedBase64 = cropCanvas.toDataURL('image/jpeg', 0.9);");
// find the index of catch (err: any) {
const endCrop = old.indexOf("} catch (err: any) {");

if (startCrop !== -1 && endCrop !== -1) {
    const before = old.substring(0, startCrop + "const croppedBase64 = cropCanvas.toDataURL('image/jpeg', 0.9);".length);
    const after = old.substring(endCrop);
    
    // Construct the middle block correctly
    const middleBlock = `
                        
                        const qNum = eq.questionNum || newDrafts.length + 1;
                        newDrafts.push({
                            id: crypto.randomUUID(),
                            paper: paperCode,
                            questionNum: qNum,
                            topic: eq.topic || "Unclassified",
                            description: eq.description || "",
                            questionText: eq.questionText || "",
                            imageUrl: croppedBase64,
                            correctAnswer: parsedAnswers[qNum - 1] || 'A',
                            annotation: ''
                        });
                    }
                }
            }
                }
        `;
    
    fs.writeFileSync('components/AutoPDFImport.tsx', before + middleBlock + after);
} else {
    console.log("Could not find delimiters");
}
