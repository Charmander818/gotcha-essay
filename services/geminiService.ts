import { GoogleGenAI, Type } from "@google/genai";
import { Question, ClozeBlank, ClozeFeedback, TopicAnalysisData } from "../types";

// Helper to ensure we have a client. 
// Since we must use process.env.API_KEY directly as per guidelines.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const checkForApiKey = () => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing!");
  }
};

export const generateModelAnswer = async (question: Question): Promise<string> => {
  checkForApiKey();
  const prompt = `
    You are an expert Cambridge A-Level Economics Examiner.
    Write a perfect model essay for the following question.
    
    Question: ${question.questionText}
    Marks: ${question.maxMarks}
    Topic: ${question.topic}
    
    Mark Scheme Guidance:
    ${question.markScheme}
    
    Requirements:
    1. Structure the essay clearly (Introduction, Definitions, Analysis, Evaluation, Conclusion).
    2. Explicitly label AO1 (Knowledge), AO2 (Analysis), and AO3 (Evaluation) points if appropriate, or just write a flowing essay that hits all these levels naturally but with high precision.
    3. Use precise economic terminology.
    4. Include descriptions of diagrams where a diagram would be drawn (e.g. [Diagram: AD/AS shift right]).
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || "Failed to generate essay.";
};

export const gradeEssay = async (question: Question, essay: string, images: string[] = []): Promise<string> => {
  checkForApiKey();
  const imageParts = images.map(img => {
      // Assuming img is data:image/png;base64,...
      const [mimeTypePrefix, base64Data] = img.split(';base64,');
      const mimeType = mimeTypePrefix.split(':')[1];
      return {
          inlineData: {
              mimeType,
              data: base64Data
          }
      };
  });

  const prompt = `
    You are a strict Cambridge A-Level Economics Examiner.
    Grade the following student essay based on the mark scheme provided.
    
    Question: ${question.questionText}
    Max Marks: ${question.maxMarks}
    Mark Scheme:
    ${question.markScheme}
    
    Student Essay:
    ${essay}
    
    (Note: If images are provided, they contain handwritten parts of the essay).
    
    Provide:
    1. An estimated mark (e.g., 6/8).
    2. A breakdown by Assessment Objective (AO1, AO2, AO3).
    3. Specific feedback on what was done well.
    4. Specific improvements needed to reach full marks.
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
        parts: [
            { text: prompt },
            ...imageParts
        ]
    }
  });
  return response.text || "Failed to grade essay.";
};

export const getRealTimeCoaching = async (question: Question, currentText: string): Promise<{
  ao1: number;
  ao2: number;
  ao1_ao2?: number;
  ao3: number;
  total: number;
  advice: string;
}> => {
  checkForApiKey();
  // const is12Mark = question.maxMarks === 12;
  
  const prompt = `
    Analyze this incomplete Economics essay draft.
    Question: ${question.questionText}
    Mark Scheme: ${question.markScheme}
    Current Text: "${currentText}"
    
    Estimate the current accumulated marks.
    Provide a very brief, encouraging tip on what to add next (e.g., "Good definition, now explain the impact on price" or "Add evaluation").
    
    Return JSON format:
    {
      "ao1": number,
      "ao2": number,
      "ao3": number,
      "ao1_ao2": number (only if 12 marks question, otherwise 0),
      "total": number,
      "advice": string
    }
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                ao1: { type: Type.NUMBER },
                ao2: { type: Type.NUMBER },
                ao3: { type: Type.NUMBER },
                ao1_ao2: { type: Type.NUMBER },
                total: { type: Type.NUMBER },
                advice: { type: Type.STRING }
            }
        }
    }
  });
  
  try {
      if (response.text) {
        return JSON.parse(response.text);
      }
      throw new Error("No text");
  } catch (e) {
      return { ao1: 0, ao2: 0, ao3: 0, total: 0, advice: "Keep writing..." };
  }
};

export const generateClozeExercise = async (text: string): Promise<{ textWithBlanks: string; blanks: ClozeBlank[] } | null> => {
  checkForApiKey();
  const prompt = `
    Take the following economics text and create a "fill in the blanks" exercise.
    Identify 5-8 key economic terms or phrases to blank out.
    Replace them in the text with [BLANK_1], [BLANK_2], etc.
    
    Return JSON:
    {
      "textWithBlanks": string,
      "blanks": [
        { "id": number, "original": string, "hint": string }
      ]
    }
    
    Text:
    ${text}
  `;

  const ai = getAI();
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

  try {
      if (response.text) return JSON.parse(response.text);
      return null;
  } catch (e) {
      return null;
  }
};

export const evaluateClozeAnswers = async (blanks: ClozeBlank[], userAnswers: Record<number, string>): Promise<Record<number, ClozeFeedback>> => {
  checkForApiKey();
  
  const prompt = `
    Evaluate these fill-in-the-blank answers for an Economics exercise.
    For each blank, compare the User Answer with the Original.
    Give a score (0-5) and a short comment. 
    Accept synonyms or close alternatives if they make economic sense.
    
    Blanks Data: ${JSON.stringify(blanks)}
    User Answers: ${JSON.stringify(userAnswers)}
    
    Return JSON:
    {
      "feedback": [
         { "id": number, "score": number, "comment": string }
      ]
    }
  `;

  const ai = getAI();
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
                            score: { type: Type.NUMBER },
                            comment: { type: Type.STRING }
                        }
                    }
                }
            }
        }
    }
  });

  try {
      const data = JSON.parse(response.text || "{}");
      if (data.feedback) {
          const result: Record<number, ClozeFeedback> = {};
          data.feedback.forEach((f: any) => {
              result[f.id] = { score: f.score, comment: f.comment };
          });
          return result;
      }
      return {};
  } catch (e) {
      return {};
  }
};

export const improveLogicChain = async (input: string): Promise<string> => {
  checkForApiKey();
  const prompt = `
    Turn the following rough notes into a formal, rigorous Economic Logic Chain.
    Use arrows (→) to show causality. 
    Ensure every step is explained (e.g. why A leads to B).
    Use high-level vocabulary (e.g. "ceteris paribus", "incentive function", "derived demand").
    
    Input: "${input}"
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || "Could not improve chain.";
};

export const analyzeTopic = async (topic: string, questions: Question[]): Promise<TopicAnalysisData> => {
  checkForApiKey();
  const questionsText = questions.map(q => `Q (${q.year}): ${q.questionText}\nMark Scheme: ${q.markScheme}`).join("\n---\n");
  
  const prompt = `
    Analyze these past paper questions for the topic: ${topic}.
    
    Identify:
    1. Common AO1 Knowledge points required (Definitions, formulas).
    2. Common AO2 Logical Chains (Analysis) that appear frequently.
    3. Common AO3 Evaluation points (Limitations, counter-arguments).
    4. Key Debates (e.g. Free Market vs Intervention) with Pros, Cons, and "Depends on" factors.
    
    Return JSON:
    {
      "lastUpdated": "${new Date().toLocaleDateString()}",
      "questionCount": ${questions.length},
      "ao1": ["point 1", "point 2"...],
      "ao2": ["chain 1", "chain 2"...],
      "ao3": ["eval 1", "eval 2"...],
      "keyDebates": [
        { "title": "...", "pros": "...", "cons": "...", "dependencies": "..." }
      ]
    }
    
    Data:
    ${questionsText}
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  try {
      return JSON.parse(response.text || "{}");
  } catch (e) {
      throw new Error("Failed to parse analysis");
  }
};

export const analyzeExamStrategy = async (marks: number, questions: Question[]): Promise<string> => {
  checkForApiKey();
  const relevantQuestions = questions.filter(q => q.maxMarks === marks);
  const sample = relevantQuestions.slice(0, 15).map(q => `Q: ${q.questionText}\nMS: ${q.markScheme}`).join("\n\n");
  
  const prompt = `
    You are a Pattern Recognition Expert for Cambridge Economics Exams.
    Analyze these ${marks}-mark questions and their mark schemes.
    
    Determine the "Hidden Formula" for getting full marks.
    
    Address:
    1. Structure: How many paragraphs? What should each contain?
    2. AO2: How detailed does the analysis need to be? (e.g. diagrams required? definitions?)
    3. AO3: What specific type of evaluation scores high? (e.g. Short run vs Long run, Elasticity, Magnitude).
    4. Keywords: How to interpret "Assess", "Discuss", "Explain", "Consider".
    
    Output as a detailed Strategy Guide in Markdown.
    
    Sample Data:
    ${sample}
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || "Analysis failed.";
};

export const generateSyllabusLogicChain = async (topicTitle: string, point: string, context?: string, definition?: string): Promise<string> => {
  try {
    checkForApiKey();
    const prompt = `
      You are an expert Cambridge Economics Teacher.
      
      **Topic:** ${topicTitle}
      **Syllabus Point:** ${point}
      ${definition ? `**Core Definition (AO1):** ${definition}` : ""}
      ${context ? `**Specific Context:** ${context}` : ""}
      
      **Task:** Write a perfect, step-by-step **Economic Logic Chain** that fully explains this specific point.
      
      **Strict Rules:**
      1. Start with the core economic trigger (e.g. Interest Rates Rise).
      2. Use arrows (→) to show the mechanism of transmission.
      3. **AO2 Focus:** Ensure no logical jumps. Explain *why* A leads to B (e.g. mention the "Income Effect" or "Incentive Function").
      4. If a Definition (AO1) is provided above, ensure the logic chain builds directly upon it.
      5. Keep it concise but rigorous.
      6. Output ONLY the chain, no intro/outro.
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Error generating chain.";
  } catch (error) {
    console.error("Syllabus Chain Error:", error);
    throw new Error("Failed to generate logic chain");
  }
};

export const generateSyllabusDefinition = async (topicTitle: string, point: string): Promise<string> => {
  try {
    checkForApiKey();
    const prompt = `
      You are a Cambridge Economics Examiner.
      
      **Topic:** ${topicTitle}
      **Syllabus Point:** ${point}
      
      **Task:** Provide the **Official Textbook Definition (AO1)** for the key concept in this syllabus point.
      
      **Rules:**
      1. Precise, academic definition.
      2. If there is a formula, include it.
      3. Do not include analysis, just the definition.
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Error generating definition.";
  } catch (error) {
    console.error("Syllabus Definition Error:", error);
    throw new Error("Failed to generate definition");
  }
};

export const evaluateSyllabusChain = async (topicTitle: string, point: string, studentInput: string): Promise<string> => {
  try {
    checkForApiKey();
    const prompt = `
      You are a strict Cambridge Economics Examiner.
      
      **Topic:** ${topicTitle}
      **Syllabus Point:** ${point}
      **Student's Logic Chain:** "${studentInput}"
      
      **Task:**
      1. **Grade:** Assign a grade (A/B/C/D) based on accuracy and completeness.
      2. **Critique:** Identify any "Logical Jumps" (steps missing) or errors.
      3. **Improve:** Rewrite the student's chain to make it perfect (using → arrows).
      
      Format the output clearly with bold headers.
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Error evaluating chain.";
  } catch (error) {
    console.error("Syllabus Eval Error:", error);
    return "Failed to evaluate logic chain.";
  }
};
