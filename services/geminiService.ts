
import { GoogleGenAI, Type } from "@google/genai";
import { Question, ClozeBlank, ClozeFeedback, TopicAnalysisData } from "../types";

// Basic check for API key existence
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
} else {
    console.warn("API_KEY is missing. AI features will not work until configured.");
}

const checkForApiKey = () => {
    if (!apiKey) {
        throw new Error("API Key is missing. Please go to Vercel Settings -> Environment Variables and add API_KEY.");
    }
};

export const generateModelAnswer = async (question: Question): Promise<string> => {
  try {
    checkForApiKey();
    
    let structureInstructions = "";

    if (question.maxMarks === 8) {
      structureInstructions = `
      **Strict CIE AS Level Structure for 8 Marks (Point-Based Marking):**
      
      **Target Split:** AO1 (3 Marks) + AO2 (3 Marks) + AO3 (2 Marks).

      **1. AO1: Knowledge & Understanding (3 Marks)**
      - **Precise Definitions:** Define specific key terms from the question (e.g., "PED", "Public Good"). 
      - **Bookwork:** Use official textbook definitions.
      - **Formula/Diagram:** If relevant, include the text description of the formula or diagram (axes, curves, shifts).

      **2. AO2: Analysis (3 Marks)**
      - **Structure:** Write 1-2 distinct paragraphs analyzing the "mechanisms".
      - **Logic Chains (CRITICAL):** Do not assert. Use the "A -> B -> C -> Z" chain format.
        - *Bad:* "Prices rise so demand falls."
        - *Good:* "Price rises -> purchasing power falls (income effect) & good becomes relatively expensive (substitution effect) -> quantity demanded falls."
      - **Context:** Apply directly to the scenario (e.g., if "agricultural goods", mention weather/seasonality).

      **3. AO3: Evaluation (2 Marks)**
      - **Requirement:** Answer the "Consider" or "Whether" part of the question.
      - **Judgement:** Make a definitive statement (e.g., "It is likely that...").
      - **Justification:** Provide a reason for this judgement (e.g., "However, this depends on the PED of the product...").
      `;
    } else if (question.maxMarks === 12) {
      structureInstructions = `
      **Strict CIE AS Level Structure for 12 Marks (Level-Based Marking):**
      
      **Target Split:** AO1+AO2 (8 Marks) + AO3 (4 Marks).

      **1. AO1 & AO2: Knowledge & Analysis (Max 8 Marks)**
      - **Goal:** Reach Level 3 (6-8 marks).
      - **Requirements:** 
        - Detailed knowledge of concepts.
        - **Developed Logical Chains:** Analysis must be fully explained step-by-step.
        - **Balance:** You MUST discuss BOTH sides (e.g., Pros AND Cons, or Policy A vs Policy B). One-sided answers are capped at Level 2.
        - **Context:** specific application to the industry/economy mentioned.

      **2. AO3: Evaluation (Max 4 Marks)**
      - **Goal:** Reach Level 2 (3-4 marks).
      - **Requirements:**
        - A reasoned conclusion/judgement that directly answers the specific question.
        - **Not a summary:** Do not just repeat points. Weigh the arguments.
        - **"Depends On":** Evaluate significance (e.g., Short run vs Long run, Elasticities, Magnitude of change).
      `;
    } else {
      structureInstructions = `
      **General Economics Essay Standards:**
      - Define key terms accurately (AO1).
      - Use detailed logical chains of reasoning (AO2). Avoid assertions.
      - Evaluate and conclude based on the arguments (AO3).
      `;
    }

    const prompt = `
      You are a **Senior Cambridge International AS Level Economics (9708) Examiner**.
      Write a **perfect, full-mark model essay** for the following question.
      
      **Question:** ${question.questionText}
      **Max Marks:** ${question.maxMarks}
      **Mark Scheme Guidance:**
      ${question.markScheme}
      
      **Examiner's Secret Writing Rules:**
      1. **No Assertions:** Every point must be explained via a logical economic chain.
      2. **Specific Terminology:** Use precise economic vocabulary (e.g., "ceteris paribus", "real disposable income").
      3. **Contextual:** If the question mentions a specific country type (e.g. Low Income) or good (e.g. Rice), the analysis **must** reference that specific context.
      
      **Formatting Instructions:**
      ${structureInstructions}
      
      - Use bold headers for sections (e.g., **Introduction**, **Analysis**, **Evaluation**).
      - Keep the tone academic and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Error generating response.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message.includes("API Key")) {
        return "Error: API Key is missing in Vercel Settings. Please configure it and redeploy.";
    }
    return "Failed to generate essay. Please check API key or try again.";
  }
};

export const gradeEssay = async (question: Question, studentEssay: string, imagesBase64?: string[]): Promise<string> => {
  try {
    checkForApiKey();

    const parts: any[] = [];
    
    let essayContentText = studentEssay;

    if (imagesBase64 && imagesBase64.length > 0) {
       imagesBase64.forEach((imgBase64) => {
           const match = imgBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
           const mimeType = match ? match[1] : 'image/jpeg';
           const cleanBase64 = imgBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
           
           parts.push({
              inlineData: {
                 mimeType: mimeType,
                 data: cleanBase64
              }
           });
       });
       essayContentText += `\n\n[Note: The student also submitted ${imagesBase64.length} image(s). Consider them as part of the answer.]`;
    }

    let rubricInstructions = "";

    if (question.maxMarks === 8) {
       rubricInstructions = `
       **8-Mark Question Rubric (Point-Based):**
       
       **AO1 (3 Marks) - Knowledge:**
       - 1 mark per valid point (Definition, Formula, Diagram description).
       - Must be precise textbook definitions.

       **AO2 (3 Marks) - Analysis:**
       - Award 1 mark for each *complete* logical chain (A->B->C).
       - **Zero marks** for assertions (statements without "because" or mechanism).
       - Must apply to context (if any).

       **AO3 (2 Marks) - Evaluation:**
       - 1 Mark for a Judgement (answering the "Consider" part).
       - 1 Mark for Justification (why is this the case?).
       - Note: If they didn't analyze the "counter-point" (the 'and' part of the question), cap marks.
       `;
    } else {
       rubricInstructions = `
       **12-Mark Question Rubric (Level-Based):**
       
       **AO1 + AO2 (Max 8 Marks):**
       - **Level 3 (6-8 marks):** 
         - Detailed knowledge.
         - **Developed** logical chains of reasoning (no gaps).
         - **Balanced** argument (Pros AND Cons, or Policy A vs Policy B).
         - Clear application to context.
       - **Level 2 (3-5 marks):** 
         - Accurate but limited analysis.
         - Undeveloped chains or **One-Sided** argument (Cap at L2).
       - **Level 1 (1-2 marks):** 
         - Descriptive, generic, or contains errors. Assertions only.

       **AO3 (Max 4 Marks):**
       - **Level 2 (3-4 marks):** 
         - Reasoned judgement/conclusion based on analysis.
         - Considers "It depends on..." factors (elasticity, time, magnitude).
       - **Level 1 (1-2 marks):** 
         - Simple assertion or summary.
       - **0 Marks:** No evaluation or one-sided answer.
       `;
    }

    const prompt = `
      You are a **strict** Cambridge International AS Level Economics Examiner. Grade the following student essay.

      **Question:** ${question.questionText}
      **Max Marks:** ${question.maxMarks}
      **Official Mark Scheme:** ${question.markScheme}

      **Grading Rubric:**
      ${rubricInstructions}

      **Student Essay:**
      "${essayContentText}"

      **Output Instructions:**
      1. **Total Score:** Give a specific mark (e.g., 6/${question.maxMarks}). Be strict on "Logic Chains".
      2. **Score Breakdown:**
         - If 8 marks: AO1 (/3), AO2 (/3), AO3 (/2).
         - If 12 marks: AO1+AO2 (/8), AO3 (/4).
      3. **Detailed Commentary:**
         - **Logic Check:** Identify specific sentences where the student made an assertion (A->Z) instead of a chain (A->B->C). Quote them.
         - **Context Check:** Did they use the specific industry/country context?
         - **Structure Check:** Did they define terms? Did they have a balanced body? Did they conclude?
      4. **Actionable Advice:** Tell them exactly how to get +2 marks next time (e.g., "Add a step in your analysis: explain *why* interest rates reduce investment").
    `;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: parts },
    });
    return response.text || "Error grading essay.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "Failed to grade essay. Please check API key.";
  }
};

export const getRealTimeCoaching = async (question: Question, currentText: string): Promise<{ao1: number, ao2: number, ao3: number, total: number, advice: string}> => {
  try {
    checkForApiKey();

    let logicDescription = "";
    
    if (question.maxMarks === 8) {
        logicDescription = `
        **Scoring Logic (8 Marks):**
        - AO1 (Max 3): Definitions, formulas.
        - AO2 (Max 3): Analysis chains. (A->B->C).
        - AO3 (Max 2): Evaluation/Conclusion.
        `;
    } else {
        logicDescription = `
        **Scoring Logic (12 Marks - Level Based):**
        - AO1+AO2 (Max 8): Knowledge + Analysis. Balanced argument required for >5. Developed chains required for >5.
        - AO3 (Max 4): Evaluation. Judgment + Justification.
        `;
    }

    const prompt = `
      You are a **strict** Cambridge Economics Coach watching a student write in real-time.
      
      **Question:** ${question.questionText}
      **Mark Scheme:** ${question.markScheme}
      ${logicDescription}
      
      **Student Draft:** "${currentText}"

      **Task:**
      1. Estimate their current marks for AO1, AO2, AO3.
         - For AO2: If they just state "X leads to Y" without explaining *how*, score low.
         - For 12-marks: Estimate the split of the 8 marks into AO1/AO2 roughly (e.g. AO1~2, AO2~6).
      2. Provide **ONE** short, tactical sentence of advice.
         - Example: "Don't just say 'Demand rises', explain the income effect."
         - Example: "You need a 'However' paragraph for evaluation."

      Response JSON: { ao1: number, ao2: number, ao3: number, total: number, advice: string }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ao1: { type: Type.INTEGER },
            ao2: { type: Type.INTEGER },
            ao3: { type: Type.INTEGER },
            total: { type: Type.INTEGER },
            advice: { type: Type.STRING }
          }
        }
      }
    });
    
    const json = JSON.parse(response.text || "{}");
    
    return {
        ao1: json.ao1 || 0,
        ao2: json.ao2 || 0,
        ao3: json.ao3 || 0,
        total: json.total || 0,
        advice: json.advice || "Keep writing..."
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { ao1: 0, ao2: 0, ao3: 0, total: 0, advice: "Check API Key" };
  }
};

export const generateClozeExercise = async (modelEssay: string): Promise<{ textWithBlanks: string, blanks: ClozeBlank[] } | null> => {
  try {
    checkForApiKey();

    const prompt = `
      You are an expert Economics teacher creating a "Logic Chain" completion exercise.
      Take the provided model essay and create a fill-in-the-blank (cloze) test.

      **Instructions:**
      1. Identify **8 to 12** critical parts to remove.
      2. Target:
         - **AO1:** Key definitions/terms.
         - **AO2:** Logical connectors or middle steps in analysis chains.
         - **AO3:** Evaluative qualifiers.
      3. Replace with [BLANK_1], [BLANK_2], etc.
      4. Return JSON with the text and the list of blanks + hints.
      
      **Input Essay:**
      ${modelEssay}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            textWithBlanks: { type: Type.STRING },
            blanks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  original: { type: Type.STRING },
                  hint: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    return {
      textWithBlanks: json.textWithBlanks,
      blanks: json.blanks
    };
  } catch (error) {
    console.error("Cloze Generation Error:", error);
    return null;
  }
};

export const evaluateClozeAnswers = async (
  blanks: ClozeBlank[],
  userAnswers: Record<number, string>
): Promise<Record<number, ClozeFeedback> | null> => {
  
  try {
    checkForApiKey();

    const comparisons = blanks.map(b => ({
      id: b.id,
      original: b.original,
      studentAnswer: userAnswers[b.id] || "(No answer)"
    }));

    const prompt = `
      Grade the student's answers for a fill-in-the-blank Economics exercise.
      
      **Data:**
      ${JSON.stringify(comparisons)}

      **Instructions:**
      For each item:
      1. Compare Student Answer to Original.
      2. Score (1-5): 5 = Perfect logic/meaning (exact words not needed), 1 = Incorrect.
      3. Provide a 1-sentence comment.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  score: { type: Type.INTEGER },
                  comment: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    const feedbackMap: Record<number, ClozeFeedback> = {};
    
    if (json.feedback && Array.isArray(json.feedback)) {
      json.feedback.forEach((item: any) => {
        feedbackMap[item.id] = {
          score: item.score,
          comment: item.comment
        };
      });
    }
    
    return feedbackMap;

  } catch (error) {
    console.error("Cloze Evaluation Error:", error);
    return null;
  }
};

export const improveLogicChain = async (input: string): Promise<string> => {
  try {
    checkForApiKey();
    const prompt = `
      You are an expert Cambridge Economics teacher helping a student convert rough notes into a perfect **Logical Chain of Analysis (AO2)**.

      **Student Notes:** "${input}"

      **Task:**
      1. Identify the core economic concept being discussed.
      2. Rewrite the notes into a series of clear, step-by-step causal links.
      3. Use arrows (→) to visually show the flow.
      4. Ensure there are no "logical jumps". Explain *why* A leads to B.
      5. Add a brief explanation of the mechanism if it's missing.

      **Format:**
      - **Concept:** [Name of concept]
      - **Improved Logic Chain:** Step 1 → Step 2 → Step 3 ...
      - **Explanation:** [Why this chain works, referencing standard theory like SRAS, AD, PED, etc.]
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate logic chain.";
  } catch (error) {
    console.error("Logic Chain Error:", error);
    return "Error generating logic chain.";
  }
};

export const analyzeTopic = async (topic: string, questions: Question[]): Promise<TopicAnalysisData | null> => {
    try {
        checkForApiKey();
        
        // Filter questions for the specific topic/chapter to send as context
        const topicQuestions = questions.filter(q => q.topic === topic || q.chapter === topic);
        
        // Create a summary payload to save context tokens (we don't need the full MS for every question, just the text/MS gist)
        const questionsSummary = topicQuestions.map(q => `
            Q (${q.year} ${q.variant} ${q.paper}): ${q.questionText}
            Max Marks: ${q.maxMarks}
            Mark Scheme Hint: ${q.markScheme.substring(0, 300)}...
        `).join("\n---\n");

        const prompt = `
            You are a Senior Examiner analyzing the Cambridge Economics Syllabus Topic: **${topic}**.
            
            Here are ${topicQuestions.length} past paper questions for this topic in our database:
            ${questionsSummary}

            **Task:** Perform a comprehensive "Topic Analysis" for students.
            
            Return the output in the following JSON format:
            {
              "ao1": ["Point 1", "Point 2"], // Common definitions, key concepts, diagrams required.
              "ao2": ["Chain 1", "Chain 2"], // Recurring logical analysis chains found in mark schemes.
              "ao3": ["Eval 1", "Eval 2"], // Standard evaluation arguments (e.g. elasticities, time lags).
              "keyDebates": [
                {
                  "title": "Debate Title (e.g. Free Trade vs Protectionism)",
                  "pros": "Arguments for...",
                  "cons": "Arguments against...",
                  "dependencies": "Depends on X, Y, Z..."
                }
              ]
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  ao1: { type: Type.ARRAY, items: { type: Type.STRING } },
                  ao2: { type: Type.ARRAY, items: { type: Type.STRING } },
                  ao3: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyDebates: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        pros: { type: Type.STRING },
                        cons: { type: Type.STRING },
                        dependencies: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
        });
        
        const json = JSON.parse(response.text || "{}");
        
        return {
          lastUpdated: new Date().toLocaleString(),
          questionCount: topicQuestions.length,
          ao1: json.ao1 || [],
          ao2: json.ao2 || [],
          ao3: json.ao3 || [],
          keyDebates: json.keyDebates || []
        };

    } catch (error) {
        console.error("Topic Analysis Error:", error);
        return null;
    }
}
