
import { GoogleGenAI, Type } from "@google/genai";
import { Question, ClozeBlank, ClozeFeedback, TopicAnalysisData } from "../types";

// Helper to ensure we have a client. 
const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const checkForApiKey = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("API Key is missing!");
    throw new Error("GEMINI_API_KEY is missing. If you deployed to Vercel, please add it in Vercel Settings -> Environment Variables, and redeploy.");
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
    
    **CRITICAL EXAMINER INSTRUCTIONS (MUST FOLLOW):**
    1. **AO1 (Knowledge) Rules:**
       - ONLY provide real-world examples if the question explicitly asks for them.
       - ONLY draw/describe diagrams if the question explicitly asks for them, OR if they are absolutely necessary to explain the AO2 analysis. A diagram without written explanation scores 0.
       - If the question asks for "Causes" (e.g., causes of inflation), you MUST define the term first, then explain the causes. If it does NOT ask for causes, do NOT write them.
       - If the question asks to "Explain the difference", keep the difference brief (1-2 lines) after defining both concepts.
       - For 12-mark questions: AO1 MUST define ALL key terms in the question.
    2. **AO2 (Analysis) Rules:**
       - If the question mentions a "price change", you MUST discuss BOTH price increases and price decreases.
       - Pay attention to plurals (e.g., "causes", "markets") - you MUST discuss at least two.
       - For Policy questions, use the **FEAST** framework (Feasibility, Effectiveness, Appropriateness, Side effects, Time lag) to structure your analysis of pros and cons.
       - For 12-mark questions:
         - Each paragraph MUST contain ONLY ONE point.
         - Each AO2 paragraph MUST consist of: a topic sentence + a complete logical chain + use of economic terms.
         - If evaluating a single concept's pros and cons (e.g., "whether inflation is always bad"): Write exactly 3 positive points and 3 negative points.
         - If comparing two policies or two economic systems (e.g., "mixed vs market economy", "fiscal vs monetary policy"): Write how Policy/System A solves the problem (or its 2 pros) + 2 limitations/cons. Then write how Policy/System B solves the problem (or its 2 pros) + 2 limitations/cons. Do NOT use a "should/should not" framework for systems.
    3. **AO3 (Evaluation) Rules (AVOID 0-POINT EV TRAPS):**
       - **DO NOT repeat AO2 in AO3.** (e.g., Do not just say "it depends on PED, if elastic X, if inelastic Y" if you already explained that in AO2).
       - **DO NOT write AO2 in AO3.** (e.g., Do not just list a limitation of Policy A and a limitation of Policy B and conclude A is better).
       - **DO NOT give a judgement without explanation.**
       - **The Correct EV Approach:** Use Context + Judgement. Give a specific context, explain how that context amplifies the pros or mitigates the cons of a policy, and make a clear judgement.
       - If it's a Data Response question, you MUST evaluate based on the provided data context, not a hypothetical one.
       - For 12-mark questions: Write exactly 2 "depends on" evaluation points. These points MUST NOT repeat any limitations or points already discussed in AO2 (e.g., if inelasticity/addiction was used as an AO2 limitation, it cannot be used as an AO3 "depends on" point).
    
    Requirements:
    1. Structure the essay clearly (Introduction, Definitions, Analysis, Evaluation, Conclusion).
    2. Explicitly label AO1 (Knowledge), AO2 (Analysis), and AO3 (Evaluation) points if appropriate, or just write a flowing essay that hits all these levels naturally but with high precision.
    3. Use precise economic terminology.
    4. Include descriptions of diagrams where a diagram would be drawn (e.g. [Diagram: AD/AS shift right]).
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
    You are a STRICT Cambridge A-Level Economics Examiner. 
    Your job is to mark the student's essay accurately and critically.

    **QUESTION DETAILS:**
    - Question: "${question.questionText}"
    - Max Marks: ${question.maxMarks}
    - Mark Scheme: ${question.markScheme}

    **STUDENT ESSAY:**
    "${essay}"
    (If images are attached, they contain handwriting).

    ---

    **STEP 1: CRITICAL PREMISE CHECK (Pass/Fail)**
    Before grading, check if the student is answering the SPECIFIC question asked.
    - Example: If the question asks how to *reduce* inflation, and the student writes about policies that *increase* AD (which causes inflation), this is a PREMISE FAILURE.
    - If the premise is wrong, cap the marks significantly (max Level 1 or 2) and explicitly state this error at the very top.

    **STEP 2: STRICT EXAMINER PENALTIES (Check for these common mistakes):**
    - **AO1/AO2 Traps:**
      - Did they waste time drawing a diagram when not asked and not used for analysis? Warn them.
      - Did they provide examples when not asked? Warn them it's a waste of time.
      - Did they write "causes" when the question didn't ask for them? Warn them.
      - If the question mentioned "price change", did they only discuss an increase and ignore a decrease? Penalize.
      - Did they ignore plurals (e.g., only discussed one market when asked for "markets")? Penalize.
      - For policy questions, did they consider FEAST criteria (Feasibility, Effectiveness, Appropriateness, Side effects, Time lag)? Praise if yes, suggest if no.
      - For 12-mark questions specifically:
        - Did they define ALL key terms in AO1? Penalize if not.
        - Did they write exactly one point per paragraph in AO2? Penalize if they mixed points.
        - Does each AO2 paragraph have a topic sentence, a complete logical chain, and economic terms? Penalize if missing.
        - If comparing pros/cons of a single concept: Did they write 3 positive and 3 negative points? Penalize if not.
        - If comparing two policies/systems: Did they write how Policy A solves the problem (or 2 pros) + 2 limitations, and the same for Policy B? Penalize if not.
    - **0-Point EV Traps (AO3):** 
      - Did they just repeat AO2 points in their evaluation? (e.g., "depends on PED" without adding new context/judgement). PENALIZE.
      - Did they just list limitations of policies instead of comparing them based on context? PENALIZE.
      - Did they give a conclusion without explaining *why* based on a specific context? PENALIZE.
      - *Praise them if they use context to weigh pros/cons and make a justified judgement.*
      - For 12-mark questions specifically: Did they write exactly 2 "depends on" evaluation points? Penalize if not. Did they repeat an AO2 limitation as an AO3 "depends on" point? PENALIZE.

    **STEP 3: SCORING RULES (Strict Adherence)**
    - **CRITICAL:** The Mark Scheme provides a list of *possible* valid points. The student DOES NOT need to cover every single point in the mark scheme to get full marks.
    ${question.maxMarks === 12 
      ? `- **AO1 (Knowledge) + AO2 (Analysis):** Max 8 marks. (Requires detailed chains of reasoning, diagrams, accurate definitions).
         - If the student provides the required number of well-developed points (e.g., exactly 3 positive and 3 negative points for a single concept, OR 2 pros/2 cons each for two policies) with complete logical chains, they MUST receive FULL AO2 marks. Do NOT penalize them for omitting other possible points listed in the mark scheme.
         - **AO3 (Evaluation):** Max 4 marks. (Requires critical judgement, exactly 2 "depends on" points, weighing up arguments, conclusion).`
      : `- **AO1 (Knowledge):** Max 3 marks.
         - **AO2 (Analysis):** Max 3 marks.
         - **AO3 (Evaluation):** Max 2 marks.`
    }

    **STEP 4: GENERATE REPORT**
    Please format your response exactly as follows using Markdown:

    ### 1. Premise Check
    - **Status:** [PASS / FAIL]
    - **Comment:** [One sentence verifying if the student addressed the correct economic direction/topic.]

    ### 2. Mark Scheme Coverage Checklist
    - [ ] [Key Point 1 from MS] - [State if student covered it]
    - [ ] [Key Point 2 from MS] - [State if student covered it]
    - [ ] [Evaluation Requirement] - [State if student evaluated it]

    ### 3. Paragraph-by-Paragraph Critique
    *Go through the student's main paragraphs. Identify logic gaps and 0-point EV traps.*
    - **Para 1:** [Feedback on definition/intro. e.g., "Good definition of Inflation."]
    - **Para 2:** [Feedback on Analysis. e.g., "Logic Gap: You said interest rates rise -> investment falls, but you didn't explain the MEC mechanism or cost of borrowing."]
    - **Para 3:** [Feedback on Counter-argument/Evaluation. Explicitly call out if they fell into a 0-point EV trap.]

    ### 4. Estimated Mark & Breakdown
    **Total: X / ${question.maxMarks}**
    ${question.maxMarks === 12 
      ? `- AO1 + AO2: X / 8\n- AO3: X / 4`
      : `- AO1: X / 3\n- AO2: X / 3\n- AO3: X / 2`
    }

    ### 5. Final Advice for Improvement
    [2-3 specific, actionable bullet points to get full marks next time. If they failed EV, give them a specific example of how to write a good EV for this question using Context + Judgement.]
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
  const is12Mark = question.maxMarks === 12;
  
  const prompt = `
    You are a real-time Economics Writing Coach.
    Analyze this incomplete draft.
    
    Question: ${question.questionText}
    Mark Scheme: ${question.markScheme}
    Current Text: "${currentText}"
    
    **TASK:**
    1. **Premise Check:** Is the student answering the question asked? (e.g. if asked to *reduce* inflation, are they using contractionary policies?). If NOT, your 'advice' MUST immediately warn them they are off-topic.
    2. **Scoring:** Estimate marks based on CIE standards:
       - **CRITICAL:** The Mark Scheme provides a list of *possible* valid points. The student DOES NOT need to cover every single point in the mark scheme to get full marks.
       ${is12Mark 
         ? `- AO1 + AO2 combined (Max 8): If they hit the required number of points (e.g. 3 pros/3 cons for a single concept, or 2 pros/2 cons each for two policies) with complete logical chains, award full AO2 marks. DO NOT penalize for missing other points in the mark scheme.
- AO3 (Max 4): Requires exactly 2 "depends on" points.` 
         : "- AO1 (Max 3)\n- AO2 (Max 3)\n- AO3 (Max 2)"}
    
    3. **Advice:** Give ONE short, encouraging sentence on what to do next (e.g. "Good definition, now draw the AD/AS diagram" or "Logic Gap: Explain WHY consumption falls").
       ${is12Mark ? `
       - Ensure they define ALL key terms for AO1.
       - Ensure each AO2 paragraph has exactly one point, starting with a topic sentence, followed by a complete logical chain and economic terms.
       - If comparing pros/cons of a single concept: guide them towards 3 positive and 3 negative points.
       - If comparing two policies/systems: guide them towards Policy A (how it solves/2 pros + 2 limitations) and Policy B (how it solves/2 pros + 2 limitations).
       - Ensure they write exactly 2 "depends on" AO3 points, and warn them if they repeat an AO2 limitation in AO3.
       ` : ""}

    Return JSON format:
    {
      "ao1": number (0 if 12-mark),
      "ao2": number (0 if 12-mark),
      "ao3": number,
      "ao1_ao2": number (only if 12-mark question, otherwise 0),
      "total": number,
      "advice": string
    }
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
    model: 'gemini-3-flash-preview',
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
    model: 'gemini-3-flash-preview',
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
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text || "Could not improve chain.";
};

export const analyzeTopic = async (topic: string, questions: Question[]): Promise<TopicAnalysisData> => {
  checkForApiKey();
  const questionsText = questions.map(q => `Q (${q.year}): ${q.questionText}\nMark Scheme: ${q.markScheme}`).join("\n---\n");
  
  const prompt = `
    You are an expert Cambridge A-Level Economics Examiner and Textbook Author.
    Create a comprehensive "Topic Master Guide" (宝书) based on these past paper questions for the topic: ${topic}.
    
    Your goal is to provide a "Bible" for students to master this topic.
    
    Analyze the questions and mark schemes to identify:
    1. **AO1 Definitions:** The exact definitions required for key terms in this topic.
    2. **AO2 Analysis Chains:** The standard logical chains of reasoning used to explain concepts (Cause -> Effect -> Consequence). Group similar chains.
    3. **AO3 Evaluation:** The common "Depends on" factors, limitations of policies, or alternative viewpoints.
    4. **Key Debates:** The major economic arguments (e.g. Free Market vs Intervention) relevant to this topic.
    5. **Common Mistakes:** Errors students often make or concepts they confuse.
    6. **Exam Tips:** Specific advice on how to score high in this topic (e.g. "Always draw a diagram for X").

    Return JSON format:
    {
      "lastUpdated": "${new Date().toLocaleDateString()}",
      "questionCount": ${questions.length},
      "commonDefinitions": [
        { "term": "Term", "definition": "Precise definition..." }
      ],
      "ao1": ["Key knowledge point 1", "Key formula 1"...], 
      "ao2": ["Detailed logic chain 1...", "Detailed logic chain 2..."],
      "ao3": ["Evaluation point 1...", "Evaluation point 2..."],
      "keyDebates": [
        { "title": "Debate Title", "pros": "Arguments For...", "cons": "Arguments Against...", "dependencies": "Depends on..." }
      ],
      "commonMistakes": ["Mistake 1...", "Mistake 2..."],
      "examTips": ["Tip 1...", "Tip 2..."]
    }
    
    Data to Analyze:
    ${questionsText}
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
       ${marks === 12 ? `
       - AO1 MUST define ALL key terms in the question.
       - Each AO2 paragraph MUST contain ONLY ONE point, starting with a topic sentence, followed by a complete logical chain and economic terms.
       - If evaluating a single concept's pros and cons: 3 positive points and 3 negative points.
       - If comparing two policies or two economic systems: Policy/System A (how it solves/2 pros + 2 limitations) and Policy/System B (how it solves/2 pros + 2 limitations). Do NOT use a "should/should not" framework for systems.
       - AO3 MUST have exactly 2 "depends on" evaluation points. These points MUST NOT repeat any limitations or points already discussed in AO2.
       - CRITICAL: The Mark Scheme lists *possible* points. Students DO NOT need to cover every point to get full marks, as long as they meet the required number of well-developed points (e.g. 3 pros/3 cons).
       ` : ""}
    2. AO2: How detailed does the analysis need to be? (e.g. diagrams required? definitions?)
    3. AO3: What specific type of evaluation scores high? (e.g. Short run vs Long run, Elasticity, Magnitude).
    4. Keywords: How to interpret "Assess", "Discuss", "Explain", "Consider".
    
    Output as a detailed Strategy Guide in Markdown.
    
    Sample Data:
    ${sample}
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
      model: 'gemini-3-flash-preview',
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
      model: 'gemini-3-flash-preview',
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
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Error evaluating chain.";
  } catch (error) {
    console.error("Syllabus Eval Error:", error);
    return "Failed to evaluate logic chain.";
  }
};
