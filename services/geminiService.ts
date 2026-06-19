
import { GoogleGenAI, Type } from "@google/genai";
import { Question, ClozeBlank, ClozeFeedback, TopicAnalysisData } from "../types";
import { ALL_TOPICS } from "../utils/topicHelpers";

// Helper to ensure we have a client. 
const realGetAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "" });

const getAI = (): any => {
  return {
    models: {
      generateContent: async (params: any) => {
        let model = params.model;

        // Manual routing to GPT
        if (model && model.startsWith('gpt-')) {
          return generateOpenAI(params, model);
        }

        const realAI = realGetAI();
        try {
          return await realAI.models.generateContent(params);
        } catch (e: any) {
          const errStr = String(e?.message || e);
          if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("Quota exceeded") || errStr.includes("503")) {
            if (process.env.OPENAI_API_KEY) {
              console.warn(`Gemini API limit reached. Falling back to OpenAI (gpt-4o-mini)...`);
              return generateOpenAI(params, "gpt-4o-mini");
            }
          }
          throw e; // re-throw if not limit error or no openai key
        }
      }
    }
  };
}

async function generateOpenAI(params: any, modelName: string) {
  const apiKey = process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing. Please add it to Vercel Settings or your .env file as VITE_OPENAI_API_KEY.");
  }

  let messages: any[] = [];
  
  if (params.systemInstruction) {
    let text = typeof params.systemInstruction === 'string' ? params.systemInstruction : (params.systemInstruction.parts ? params.systemInstruction.parts.map((p:any)=>p.text).join('') : '');
    if (text) messages.push({ role: 'system', content: text });
  }

  let contentsArray = Array.isArray(params.contents) ? params.contents : [params.contents];
  for (const content of contentsArray) {
    if (typeof content === 'string') {
      messages.push({ role: 'user', content });
    } else if (content.parts) {
       let msgContent: any[] = [];
       for (const part of content.parts) {
         if (part.text) msgContent.push({ type: 'text', text: part.text });
         else if (part.inlineData) {
           msgContent.push({
             type: 'image_url',
             image_url: { url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` }
           });
         }
       }
       messages.push({ role: 'user', content: msgContent });
    }
  }

  let requestBody: any = {
    model: modelName,
    messages,
    temperature: params.config?.temperature || 0.7,
  };

  // If using newer models like o1 or o3-mini which don't support system instructions in the same way sometimes, OpenAI format might need adjustments but they generally support developer arrays in new API. For now standard messages.
  if (params.config?.responseMimeType === 'application/json' && !modelName.startsWith("o1") && !modelName.startsWith("o3-mini") && !modelName.startsWith("gpt-4.5")) {
    requestBody.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return { text: data.choices[0]?.message?.content || "" };
}

const checkForApiKey = () => {
  const geminiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
  if (!geminiKey && !openaiKey) {
    console.error("API Key is missing!");
    throw new Error("API keys are missing. Please add VITE_GEMINI_API_KEY or VITE_OPENAI_API_KEY in Vercel Settings -> Environment Variables, and redeploy.");
  }
};

export const generateModelAnswer = async (question: Question, modelName: string = 'gemini-2.0-flash'): Promise<string> => {
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
    - **Context:** AS and A Level economics involves severe strictness ('压分'). Examiners look for flaws to DENY marks. A perfect essay must be entirely bulletproof.
    ${question.maxMarks === 20 
      ? `- **A-Level Grading Structure (20 Marks Total) - From Paper 4 Examiner Report 2023:**
      - **AO1+2 (Max 14, Level 4):** You must reach Level 4 by providing clear/relevant definitions, accurately drawn and labeled diagrams (e.g., axes, P1, P2) which MUST be explicitly referred to and utilized in the text. The analysis must trace the FULL mechanism (e.g., monetary transmission mechanism, AD/AS framework) without logical gaps. Do not rely on generic learnt notes; adapt perfectly to the specific question.
      - **AO3 (Max 6, Level 2):** You must reach Level 2 Evaluation by avoiding generic statements. Evaluative comments must have sufficient depth, synthesising alternative views (e.g., short-run vs long-run, magnitude, overriding macroeconomic aims) leading to a reasoned, well-supported final conclusion answering the question.
    
    **To write a perfect 20-mark A-Level essay, your essay MUST strictly follow the 6-part framework:**
    1. **Introduction:**
       - Approach to the question (e.g. tell the examiner you recognize the core topics, like "Climate change is caused by negative production externality...").
       - Evaluation framework (e.g., "These policies can be addressed in terms of feasibility, effectiveness and side effects.")
       - Direct answer to the question in one sentence (e.g., "This essay argues that indirect tax is a more effective policy.")
    2. **Definition (AO1):**
       - Define ALL terms in the prompt, regardless of whether they are AS or A2 concepts.
       - Even if no obvious keywords, define terms relevant to the chapter.
    3. **Thesis (AO2):**
       - Directly answer the question using the core theory. Explain FULL mechanisms step-by-step.
       - MUST include a high-quality Diagram (described clearly) and utilize/refer to it continuously in your analysis.
    4. **Anti-thesis (AO2/AO3):**
       - The counter-arguments or alternative perspectives.
       - Ensure you answer EVERY part/statement of the question. Provide at least 2 to 3 fully explained counter-points or alternative policies.
    5. **Synthesis (AO3):**
       - Compare the differing views, policies, or impacts in depth to reach A-Level AO3 Level 2 standard. Which is best and why? (e.g. depends on price elasticity, Marshall-Lerner condition, time lags).
    6. **Conclusion:**
       - **State the final answer** to the question clearly.
       - **Justify** using a summary of your key arguments without introducing new analytical points.`
      : `- **Marking Strategy:** 12-mark questions are graded based on Levels. To hit the maximum marks, your essay MUST satisfy:
      - **AO1+2 (Max 8, Level 3):** Detailed knowledge and understanding, fully developed explanations. Analysis is developed, detailed, and makes accurate and relevant use of economic concepts, theories, and tools (diagrams) which are fully explained. Well-organised, logical, and coherent.
      - **AO3 (Max 4, Level 2):** Provides a justified conclusion/judgement addressing specific question requirements. Makes developed, reasoned, and well-supported evaluative comment(s).
    - **8-Mark Strategy:** Graded strictly based on Mark Scheme valid points covered. Your essay MUST cover sufficient distinct points from the Mark Scheme with robust logical chains to secure the full 8 marks without needing everything in the Mark Scheme.
    1. **AO1 (Knowledge) Rules:**
       - ONLY provide real-world examples if the question explicitly asks for them.
       - ONLY draw/describe diagrams if the question explicitly asks for them, OR if they are absolutely necessary to explain the AO2 analysis. A diagram without written explanation scores 0.
       - If the question asks for "Causes", you MUST define the term first, then explain the causes. If it does NOT ask for causes, do NOT write them.
       - If the question asks to "Explain the difference", keep the difference brief (1-2 lines) after defining both concepts.
       - For 12-mark questions: AO1 MUST define ALL key terms in the question.
    2. **AO2 (Analysis) Rules:**
       - If the question mentions a "price change", you MUST discuss BOTH price increases and price decreases.
       - Pay attention to plurals (e.g., "causes", "markets") - you MUST discuss at least two.
       - For Policy questions, use the FEAST framework (Feasibility, Effectiveness, Appropriateness, Side effects, Time lag).
       - For 12-mark questions:
         - Each paragraph MUST contain ONLY ONE point.
         - Each AO2 paragraph MUST consist of: a topic sentence + a complete logical chain + use of economic terms.
         - If evaluating a single concept's pros and cons: Write exactly 3 positive and 3 negative points.
         - If comparing two policies or two economic systems: Write how Policy/System A solves the problem + 2 cons. Then Policy/System B + 2 cons. Do NOT use a "should/should not" framework for systems.
    3. **AO3 (Evaluation) Rules (STRICT CIE STANDARD):**
       - Evaluation should NOT consist of summative statements nor a series of statements preceded by 'it depends upon' etc.
       - Do NOT simply analyse the strengths and weaknesses of individual arguments (that is AO2).
       - Evaluation is the comparison of the strengths and weaknesses of different concepts etc., leading to a conclusion that attempts to answer the question set.
       - Link AO3 directly to AO2.
       - If it's a Data Response question, evaluate based on the provided data context.
       - For 12-mark questions: Provide a deep, comparative evaluation leading to a final conclusion answering the question.`
    }
    
    Requirements:
    1. Structure the essay clearly (Introduction, Definitions, Analysis, Evaluation, Conclusion).
    2. Explicitly label AO1 (Knowledge), AO2 (Analysis), and AO3 (Evaluation) points if appropriate, or just write a flowing essay that hits all these levels naturally but with high precision.
    3. Use precise economic terminology.
    4. Include descriptions of diagrams where a diagram would be drawn (e.g. [Diagram: AD/AS shift right]).
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
  });
  return response.text || "Failed to generate essay.";
};

export const gradeEssay = async (question: Question, essay: string, images: string[] = [], modelName: string = 'gemini-2.0-flash'): Promise<string> => {
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
      ${question.maxMarks === 20 ? 
      `- For 20-mark A-Level questions specifically (Based on Examiner Reports):
        - Did they start with an Introduction (Approach, Evaluation framework, direct Answer)? Praise if excellent, but point out if completely missing.
        - Did they define ALL key terms clearly at the start? Penalize if they skipped obvious terms.
        - DIAGRAM CHECK: Did they draw a diagram? Is it accurately drawn and labeled (e.g. axes, P1, P2)? Is it explicitly referred to and utilized in their written analysis? Penalize heavily if they just dump a diagram without utilizing it in the text.
        - ANALYSIS CHECK: Did they trace out the FULL mechanism (e.g., monetary transmission mechanism, AD/AS shifts) or instead just provide descriptive/asserted jumps? Penalize over-reliance on generic learnt notes.
        - Did they follow the 6-part framework ensuring Thesis, Anti-thesis, and Synthesis are present and fully answer EVERY statement in the prompt?
        - Did they reach Level 2 EV by providing deep evaluative comments (e.g. comparing time lags, exact magnitudes, elasticity) rather than vague 'it depends' statements?`
      : `- For 12-mark questions specifically:
        - Did they define ALL key terms in AO1? Penalize if not.
        - Did they write exactly one point per paragraph in AO2? Penalize if they mixed points.
        - Does each AO2 paragraph have a topic sentence, a complete logical chain, and economic terms? Penalize if missing.
        - If comparing pros/cons of a single concept: Did they write 3 positive and 3 negative points? Penalize if not.
        - If comparing two policies/systems: Did they write how Policy A solves the problem (or 2 pros) + 2 limitations, and the same for Policy B? Penalize if not.`}
    - **0-Point EV Traps (AO3 - STRICT CIE STANDARD):** 
      - Did they just write summative statements or a series of statements preceded by 'it depends upon'? PENALIZE (0 marks for EV).
      - Did they simply analyse the strengths and weaknesses of individual arguments in the evaluation section? PENALIZE (This is AO2, not AO3).
      - Did they use a generic/universal EV template disconnected from their specific AO2 points? PENALIZE. AO3 MUST directly build upon the specific points made in AO2 (e.g., if AO2 is about public goods, AO3 must evaluate based on public goods).
      - Did they give a conclusion without explaining *why* based on a specific context? PENALIZE.
      - *Praise them if Evaluation is the comparison of the strengths and weaknesses of different concepts etc., leading to a conclusion that attempts to answer the question set.*

    **STEP 3: SCORING RULES & STRICTNESS (Strict Adherence)**
    - **CRITICAL EXAMINER STRICTNESS:** AS and A Level economics involves severe strictness ('压分'). Examiners look for flaws to DENY marks. Do not give full marks easily. You MUST be extremely critical, penalizing generic answers, vague terminology, missing links, and uncontextualized evaluation. Look for reasons to withhold marks.
    - **CRITICAL:** The Mark Scheme provides a list of *possible* valid points. The student DOES NOT need to cover every single point in the mark scheme.
    ${question.maxMarks === 20 
      ? `- **AO1 (Knowledge) + AO2 (Analysis):** Marks awarded via Level descriptors (Max 14 marks).
          - Level 4 (12-14 marks): Excellent knowledge/understanding, fully developed analysis tracing full mechanisms (e.g., MTM, EV impact). Accurate, well-utilized diagrams integrated into text.
          - Level 3 (9-11 marks): Good knowledge, generally developed explanations but may lack depth in some mechanisms. Diagrams present but may have minor omissions or weak text integration.
          - Level 2 (6-8 marks): Some relevant concepts, limited/overgeneralised explanations. Descriptive rather than analytical. Diagrams unused or flawed.
          - Level 1 (1-5 marks): Few knowledge points, significant errors, overly descriptive.
         - **AO3 (Evaluation):** Marks awarded via Level descriptors (Max 6 marks).
          - Level 2 (4-6 marks): Justified conclusion addressing specific requirements. Developed, reasoned, well-supported evaluative comment(s) exploring magnitude, conflicts of aims, elasticity, etc.
          - Level 1 (1-3 marks): Vague conclusion. Simple, generalized evaluative comments with little contextual development.`
      : question.maxMarks === 12 
      ? `- **AO1 (Knowledge) + AO2 (Analysis):** Marks awarded via Level descriptors (Max 8 marks).
          - Level 3 (6-8 marks): Detailed knowledge/understanding, fully developed explanations, developed and detailed analysis using economic concepts. Well-organised.
          - Level 2 (3-5 marks): Some relevant concepts, limited/overgeneralised explanations. Generally accurate analysis but little detail.
          - Level 1 (1-2 marks): Few knowledge points, significant errors, descriptive analysis.
         - **AO3 (Evaluation):** Marks awarded via Level descriptors (Max 4 marks).
          - Level 2 (3-4 marks): Justified conclusion addressing specific requirements. Developed, reasoned, well-supported evaluative comment(s).
          - Level 1 (1-2 marks): Vague conclusion. Simple evaluative comments with no development.`
      : `- Award up to 8 marks strictly based on covering the points in the Mark Scheme. Requires sufficient logic chains to be awarded the marks per covered point. No levels are used for 8-mark questions.`
    }

    **STEP 4: GENERATE REPORT**
    IMPORTANT FORMATTING RULE: DO NOT use LaTeX math wrappers like "$\\downarrow \\rightarrow$" for arrows or chains. Instead, use plain unicode text characters like "↓" and "→" directly (e.g. "Interest Rates ↓ → Borrowing ↑").

    Please format your response exactly as follows using Markdown:

    ### 1. Premise Check
    - **Status:** [PASS / FAIL]
    - **Comment:** [One sentence verifying if the student addressed the correct economic direction/topic.]

    ### 2. Mark Scheme Coverage Checklist
    - [ ] [Key Point 1 from MS] - [State if student covered it]
    - [ ] [Key Point 2 from MS] - [State if student covered it]
    - [ ] [Evaluation Requirement] - [State if student evaluated it]

    ### 3. Paragraph-by-Paragraph Critique
    *Go through the student's main paragraphs. Provide highly detailed and specific feedback based on the following criteria:*
    *   **Logic Chain Completeness:** Point out exactly where the logic breaks or jumps. Explain the missing steps explicitly to show how the logic chain can be more complete and robust.
    *   **Redundant Wording:** Identify any filler words, repetitive phrasing, or unnecessary statements. Explicitly quote the exact wording that is redundant and state that it can be omitted.
    *   **Professional Economic Terms:** Upgrade the student's casual vocabulary to professional expressions. Point out exactly which phrases can be more professional and provide the specific economic terms to replace them (e.g., correct "people buy less" to "quantity demanded contracts").
    *   **EV Traps:** Explicitly call out if they fell into a 0-point EV trap.
    
    **Formatting Rule:** NEVER output empty parentheses like "()" or empty brackets. If there are no redundant words or terms to upgrade in a paragraph, simply do not mention them.
    
    *Format your critique like this:*
    - **Para 1:** [Feedback on definition/intro. e.g., "Good definition of Inflation. Redundant Wording: You used excessive wording: 'which means that'. This can be omitted."]
    - **Para 2:** [Feedback on Analysis. e.g., "Logic Chain Completeness: You said interest rates rise -> investment falls, but this logic chain can be more complete. You must include the transmission mechanism: interest rates rise -> cost of borrowing increases -> expected return on investment (MEC) falls -> investment projects are abandoned.", "Professional Economic Terms: The expression 'businesses spend less' can be more professional by changing it to 'a reduction in capital expenditure'."]
    - **Para 3:** [Feedback on Counter-argument/Evaluation...]

    ### 4. Estimated Mark & Breakdown
    **Total: X / ${question.maxMarks}**
    ${question.maxMarks === 12 
      ? `- AO1 + AO2 (Max 8): X (Level Y)\n- AO3 (Max 4): X (Level Y)`
      : `- Mark Scheme Points: X / 8`
    }

    ### 5. Final Advice for Improvement
    [2-3 specific, actionable bullet points to get full marks next time. If they failed EV, give them a specific example of how to write a good EV for this question using Context + Judgement.]
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: modelName,
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
  const is20Mark = question.maxMarks === 20;
  
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
       ${is20Mark
         ? `- AO1 + AO2 combined (Max 14): Graded on a Level 1-4 scale. Full logical mechanisms (like MTM) and explicitly utilized, well-labeled diagrams with strong adaptation to the prompt push them to Level 4 (12-14).
- AO3 (Max 6): Graded on a Level 1-2 scale. Detailed, well-supported conclusions and high-level synthesis (magnitude, overriding aims, SR vs LR) push them to Level 2 (4-6). Avoid generic 'it depends' templates.`
         : is12Mark 
         ? `- AO1 + AO2 combined (Max 8): Graded on a Level 1-3 scale. Detail and logical chains push them to Level 3 (6-8).
- AO3 (Max 4): Graded on a Level 1-2 scale. Detailed, well-supported conclusions push them to Level 2 (3-4).`
         : "- Mark Scheme Points Coverage: Award up to 8 marks based on points strictly covered from the Mark Scheme with sufficient logical chains."}
    
    3. **Advice:** Give ONE short, encouraging sentence on what to do next (e.g. "Good definition, now draw the AD/AS diagram" or "Logic Gap: Explain WHY consumption falls").
       ${is20Mark ? `
       - For 20-mark A-Level essays, remind them to structure their essay using the 6-part framework (Intro, Definition, Thesis, Anti-thesis, Synthesis, Conclusion).
       - Check if they are actually *utilizing* diagrams in their analysis text, not just dumping them. Diagrams must be fully labeled.
       - Look for gaps in their analytical mechanisms (e.g. skipping steps in explaining a policy's impact).
       - Ensure they evaluate specific contexts (reaching Level 2 AO3) rather than using generic templates.
       ` : is12Mark ? `
       - Ensure they define ALL key terms for AO1.
       - Ensure each AO2 paragraph has exactly one point, starting with a topic sentence, followed by a complete logical chain and economic terms.
       - If comparing pros/cons of a single concept: guide them towards 3 positive and 3 negative points.
       - If comparing two policies/systems: guide them towards Policy A (how it solves/2 pros + 2 limitations) and Policy B (how it solves/2 pros + 2 limitations).
       - Ensure their AO3 is a comparison of strengths/weaknesses leading to a conclusion, NOT just summative statements or "it depends upon" lists. Warn them if they use generic templates disconnected from their AO2.
       ` : ""}

    Return JSON format:
    {
      "ao1": number (0 if 12-mark or 20-mark),
      "ao2": number (0 if 12-mark or 20-mark),
      "ao3": number,
      "ao1_ao2": number (only if 12-mark or 20-mark question, otherwise 0),
      "total": number,
      "advice": string
    }
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
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
    model: 'gemini-2.0-flash',
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
    model: 'gemini-2.0-flash',
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
    model: 'gemini-2.0-flash',
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
    model: 'gemini-2.0-flash',
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
       ${marks === 20 ? `
       - 20-mark A Level essays MUST follow a 6-part structure: Introduction, Definition, Thesis, Anti-thesis, Synthesis, Conclusion.
       - The Introduction states the approach, evaluation framework and answers directly.
       - Every thesis should include a well-drawn, labeled diagram explicitly referenced in the analysis. Complete mechanism chains (e.g., MTM, AD/AS) MUST be demonstrated.
       - EVERY part of the statement must be addressed with Thesis and Counter-arguments.
       - A synthesis must dive deep into evaluation (reaching Level 2) and compare arguments specifically based on time lags, magnitude, elasticity, or conflicting macroeconomic aims.
       - The Conclusion summarizes without introducing new material.
       - CRITICAL: The Mark Scheme lists *possible* points. Students DO NOT need to cover every point to get full marks, as long as they provide well-developed, analytical points correctly tailored to the specific question context.`
       : marks === 12 ? `
       - AO1 MUST define ALL key terms in the question.
       - Each AO2 paragraph MUST contain ONLY ONE point, starting with a topic sentence, followed by a complete logical chain and economic terms.
       - If evaluating a single concept's pros and cons: 3 positive points and 3 negative points.
       - If comparing two policies or two economic systems: Policy/System A (how it solves/2 pros + 2 limitations) and Policy/System B (how it solves/2 pros + 2 limitations). Do NOT use a "should/should not" framework for systems.
       - AO3 MUST be a comparison of strengths/weaknesses leading to a conclusion. It MUST NOT be summative statements, generic templates, or a series of "it depends upon". It MUST directly build upon the specific points made in AO2.
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
    model: 'gemini-2.0-flash',
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
      7. IMPORTANT: DO NOT use markdown formatting such as asterisks (*) or hashes (#). Use plain text only.
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
      model: 'gemini-2.0-flash',
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
      3. **Improve:** Rewrite the student's chain to make it perfect (using standard unicode text arrows like → or ↓ instead of LaTeX math wrappers like $\\rightarrow$).
      
      Format the output clearly with bold headers.
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    return response.text || "Error evaluating chain.";
  } catch (error) {
    console.error("Syllabus Eval Error:", error);
    return "Failed to evaluate logic chain.";
  }
};

export const generateWorksheet = async (chapter: string, syllabusPoints: string, syllabusContent: string, additionalInstructions: string): Promise<{ worksheet: string, answerKey: string }> => {
  try {
    checkForApiKey();
    const prompt = `
      You are an expert Cambridge A-Level Economics Teacher.
      Your task is to generate a comprehensive, printable student worksheet (homework assignment) AND its corresponding Answer Key, based strictly on the provided chapter, syllabus learning objectives, and syllabus content (definitions).

      **Chapter:** ${chapter}
      
      **Syllabus Points (Learning Objectives):**
      ${syllabusPoints}
      
      **Syllabus Content (Definitions / Notes):**
      ${syllabusContent}
      
      **Additional Instructions:**
      ${additionalInstructions || "None"}
      
      **Requirements for the Worksheet:**
      1. Structure the worksheet clearly so a student can print it and fill it in.
      2. **Exhaustive Knowledge Coverage (CRITICAL):** The worksheet MUST comprehensively cover ALL the syllabus points and ALL the provided AO1 definitions without leaving any knowledge gaps. Do NOT create a short or 'summarized' worksheet. Be exhaustive. Generate as many specific theory questions, multiple-choice concepts, and application questions as needed to ensure the student has truly mastered the chapter.
      3. **Definitions (AO1):** Include a section where students must define key terms based exactly on the syllabus content provided.
      4. **Graphs & Diagrams (AO2/AO3 - STRICTLY EXHAUSTIVE):** Include a dedicated "Diagram Drawing & Analysis" section. You MUST exhaustively cover ALL possible permutations and graphical scenarios. For example, if the topic involves shifting demand/supply, you must ask to draw the shift for every determinant. If it involves indifference curves, test a price increase vs decrease for normal, inferior, and Giffen goods separately. Format diagram tests clearly with a specific prompt, and leave ample space using \`<br><br><br><br>\`. Prompt the student to label all axes, curves, and equilibrium points. Do not miss any edge cases.
      5. **Tables / Comparisons (CRITICAL):** Include comprehensive summary fill-in-the-blank tables for students to compare properties or contrast effects (e.g., Directions of Substitution Effect vs Income Effect). Provide the table headers and leave the cells empty.
      6. **Economic Logic Chains (AO2):** Provide partial chains and ask the student to fill in the missing intermediate steps. Cover every major economic transmission mechanism present in the syllabus points given.
      7. **Math & Symbol Formatting (CRITICAL):**
         - If using LaTeX math, it MUST be properly enclosed in single dollar signs with NO spacing between the dollar sign and the text (e.g., \`$Q_y \\uparrow$\` or \`$MU_y \\downarrow$\`).
         - Ensure that any LaTeX is compliant with standard KaTeX rendering. Do not use double dollar signs for inline math.
         - For simple arrows outside of equations, prefer standard unicode arrows (→, ↑, ↓).
      8. CRITICAL MS WORD FORMATTING: Do NOT use long sequences of underscores (e.g., \`_____________\`) to create writing spaces, as it breaks MS Word export. Use short brackets like \`[        ]\` or blank space. Maintain standard markdown formatting.
      
      **CRITICAL OUTPUT FORMAT:**
      You MUST output the worksheet, then exactly this delimiter:
      ===ANSWER_KEY===
      Then output the answer key for the worksheet (which would be used by the teacher for grading).
      Output everything in clean Markdown format.
      Make sure to use Markdown tables properly (include newlines before the table starts).
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    
    const text = response.text || "";
    const parts = text.split("===ANSWER_KEY===");
    return {
      worksheet: parts[0] ? parts[0].trim() : "Failed to generate worksheet.",
      answerKey: parts[1] ? parts[1].trim() : "Answer key not generated."
    };
  } catch (error: any) {
    console.error("Worksheet Generation Error:", error);
    throw new Error(`Failed to generate worksheet: ${error.message || "Unknown error"}`);
  }
};

export const generateTeachingPPTData = async (chapter: string, syllabusPoints: string, syllabusContent: string, questionBankData: string): Promise<any[]> => {
  try {
    checkForApiKey();
    const prompt = `
      You are an expert Cambridge A-Level Economics Teacher. 
      Your task is to generate a comprehensive, highly professional Teaching Presentation (PPT) based on the provided chapter, syllabus learning objectives, textbook content, and relevant questions.
      
      **Chapter:** ${chapter}
      
      **Syllabus Points (Learning Objectives):**
      ${syllabusPoints}
      
      **Textbook Content / Definitions:**
      ${syllabusContent}
      
      **Question Bank Questions for this Topic (to be included as practice slides):**
      ${questionBankData}
      
      **Requirements:**
      1. This PPT is for a real classroom. The flow should be: Title -> Learning Objectives -> Core Concepts (Definitions, Mechanisms, AO2 Analysis, Diagrams) -> Real-World Examples -> Exam Practice Questions.
      2. Content must be highly professional and strictly follow the Cambridge A-Level syllabus without knowledge omissions. 
      3. CRITICAL: Break down complex concepts, sequential processes (like "Stage 1", "Stage 2", "Stage 3"), and Cause-and-Effect chains into distinct, separate bullet points. NEVER combine multiple stages or steps into a single long paragraph or single bullet point.
      4. Structure the presentation using logically divided content groups on each slide. Do not create a massive wall of text. Keep text digestible.
      5. Use crisp, concise bullet points. Avoid extremely long sentences.
      6. For practice slides, include the Exam Question on one slide, and the key parts of the Mark Scheme (model answer) on the following slide.
      7. DO NOT use markdown inside the content strings, just plain strings.

      **Return JSON format ONLY:**
      An array of slides, where each slide follows this strict JSON structure:
      [
        {
          "title": "Slide Title",
          "layout": "standard", // "title" (for section headers), "standard" (for concepts), or "practice" (for questions)
          "contentGroups": [
            {
              "heading": "Optional Subheading (e.g., Definition, Key Factors) - leave empty if not needed",
              "bullets": ["Crisp main point 1", "Point 2: Clear explanation", "Logical consequence..."]
            }
          ],
          "notes": "Speaker notes, detailed examiner tips, or mark scheme details for this slide."
        }
      ]
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text || "[]";
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("PPT Generation Error:", error);
    throw new Error("Failed to generate PPT data.");
  }
};

export const generateMindmapData = async (chapter: string, syllabusPoints: string, syllabusContent: string): Promise<string> => {
  try {
    checkForApiKey();
    const prompt = `
      You are an expert Cambridge A-Level Economics Teacher. 
      Your task is to generate a comprehensive markdown-based mindmap for the provided chapter, syllabus learning objectives, and textbook content.
      
      **Chapter:** ${chapter}
      
      **Syllabus Points (Learning Objectives):**
      ${syllabusPoints}
      
      **Textbook Content / Definitions:**
      ${syllabusContent}
      
      **Requirements:**
      1. Use purely markdown nested bullet points (e.g. \`# Chapter Name\`, \`## Main Topic\`, \`- Subtopic\`, \`  - Detail\`).
      2. The structure should reflect a logical hierarchy of causes, effects, definitions, and components.
      3. This will be converted into a Markmap or imported as a mindmap into software like XMind, so keep the points concise but informative.
      4. DO NOT wrap the markdown in \`\`\`markdown\`\`\` backticks—just return the raw markdown string. 
      5. The root element must be a single H1 (\`# \`) representing the chapter name.
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    
    let text = response.text || "";
    text = text.replace(/```markdown/g, '').replace(/```/g, '').trim();
    return text;
  } catch (error) {
    console.error("Mindmap Generation Error:", error);
    throw new Error("Failed to generate Mindmap data.");
  }
};

export const extractMCQsFromImage = async (base64Image: string, paperCode: string = "", level?: 'AS' | 'AL', retries = 5): Promise<any> => {
  try {
    checkForApiKey();

    let levelFilter = "";
    let filteredTopics = ALL_TOPICS;
    
    // Use explicit level, or attempt to infer A-Level vs AS-Level from paper code.
    // AS codes typically start with 1 or 2 (e.g. 11, 12, 13, 14, 21...) or include " 1" / " 2"
    // AL codes typically start with 3 or 4 (e.g. 31, 32, 33, 34...) or include " 3" / " 4"
    if (level === 'AS' || (!level && (paperCode.includes(" 1") || paperCode.includes(" 2") || /\b[12]\d\b/.test(paperCode) || paperCode.includes("qp_1") || paperCode.includes("qp_2")))) {
        levelFilter = "This is an AS Level paper. You MUST only select topics from the AS Level topics list.";
        filteredTopics = ALL_TOPICS.filter(t => t.type === 'AS');
    } else if (level === 'AL' || (!level && (paperCode.includes(" 3") || paperCode.includes(" 4") || /\b[34]\d\b/.test(paperCode) || paperCode.includes("qp_3") || paperCode.includes("qp_4")))) {
        levelFilter = "This is an AL (A Level) paper. You MUST only select topics from the AL topics list.";
        filteredTopics = ALL_TOPICS.filter(t => t.type === 'AL');
    }

    const prompt = `
      Analyze this page of an A-Level Economics multiple choice exam.
      Return a JSON array of questions found on this page.
      For each question, provide:
      - "questionNum": The numeric question number (integer).
      - "topic": Choose the most appropriate specific topic for this question from this exact list:
        ${JSON.stringify(filteredTopics.map(t => t.text))}. If you are unsure, pick the closest one.
        ${levelFilter}
      - "description": Provide a detailed, specific description of the key concept being tested in this exact format "General Concept: Specific calculation or identification being tested". 
        Examples:
        - "Consumer Surplus & Indirect Tax: Identifying the geometric area of surplus lost when a tax shifts the supply curve."
        - "GDP at Basic Prices: Calculating value by adjusting market prices for indirect taxes and subsidies."
        - "Real vs. Nominal GDP: Adjusting national output for changes in the general price level (inflation)."
      - "questionText": EXACTLY copy ALL text associated with this question from the image, including the question number, stem, all options (A, B, C, D) and any text within graphs/tables. Do not summarize or alter the text. This is the OCR output.
      - "bbox": A precise bounding box [ymin, xmin, ymax, xmax] normalized to 0-1000. Follow these strict cropping rules:
        1. Start (ymin): Identify the question number (e.g., 1, 2, 3...) as the starting position. Add a tight 10-20 pixel top margin above it.
        2. Content: The box must contain exactly ONE complete question: the stem, any diagrams/tables, and options A, B, C, D. 
        3. End (ymax): It must stop exactly at the last line of option D. Add a tight 10-20 pixel bottom margin. 
        4. Unified Width (xmin, xmax): Must be identical for all questions on the page. The left boundary (xmin) must align with the global left margin of the page's text block. The right boundary (xmax) must align with the global right margin of the page's text block.
        5. Forbidden Elements: DO NOT include the next question's number, page numbers, headers, footers, or large empty whitespace.
      
      If the page contains no multiple-choice questions (e.g., blank, entirely instructions, or a cover page), return an empty array [].
    `;
    
    // Validate image format
    if (!base64Image.includes(';base64,')) {
         throw new Error("Invalid base64 image format");
    }
    
    const [mimeTypePrefix, base64Data] = base64Image.split(';base64,');
    const mimeType = mimeTypePrefix.split(':')[1];
    
    const ai = getAI();
    let response;
    
    for (let i = 0; i < retries; i++) {
        try {
            response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: {
                 parts: [
                     { text: prompt },
                     { inlineData: { mimeType, data: base64Data } }
                 ]
              },
              config: { responseMimeType: "application/json" }
            });
            break; // Success
        } catch (err: any) {
            if (i === retries - 1) throw err;
            if (err?.status === "RESOURCE_EXHAUSTED" || err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("Quota exceeded")) {
                const waitTime = 15000 + (Math.pow(2, i) * 10000); // Wait 25s, 35s, 55s...
                console.warn(`Rate limited. Retrying in ${waitTime/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                throw err;
            }
        }
    }
    
    const text = response?.text || "[]";
    // Handle potential markdown wrappers if returned
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error: any) {
    console.error("MCQ Extraction Error:", error);
    throw new Error(`Failed to extract MCQs from the image. Details: ${error.message || error}`);
  }
};

export const extractDescriptionForMCQ = async (base64Image: string, retries = 3): Promise<string> => {
  try {
    checkForApiKey();
    const prompt = `
      Analyze this image of a SINGLE multiple-choice question for an Economics exam.
      Provide a short, specific description of the key concept being tested (e.g., "Positive and Normative Statements", "Price Elasticity calculation", "Opportunity Cost on PPC"). 
      This will be used for keyword searching.
      Return ONLY the plain description text, nothing else. Keep it under 8 words.
    `;
    
    if (!base64Image.includes(';base64,')) {
         throw new Error("Invalid base64 image format");
    }
    
    const [mimeTypePrefix, base64Data] = base64Image.split(';base64,');
    const mimeType = mimeTypePrefix.split(':')[1];
    
    const ai = getAI();
    let response;
    
    for (let i = 0; i < retries; i++) {
        try {
            response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: {
                 parts: [
                     { text: prompt },
                     { inlineData: { mimeType, data: base64Data } }
                 ]
              }
            });
            break;
        } catch (err: any) {
            if (i === retries - 1) throw err;
            if (err?.status === "RESOURCE_EXHAUSTED" || err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("Quota exceeded")) {
                const waitTime = Math.pow(2, i) * 5000;
                console.warn(`Rate limited. Retrying in ${waitTime/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                throw err;
            }
        }
    }
    return response?.text?.trim() || "Unclassified Concept";
  } catch (error: any) {
    console.error("MCQ Description Extraction Error:", error);
    throw new Error(`Failed to extract description. Details: ${error.message || error}`);
  }
};

export const generateChatResponse = async (prompt: string): Promise<string> => {
  try {
    checkForApiKey();
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Chat Response Error:", error);
    throw new Error("Failed to generate response.");
  }
};

export const generateExplanationForMCQ = async (base64Image: string, correctAnswer: string): Promise<string> => {
  try {
    checkForApiKey();
    if (!base64Image.includes('base64,')) {
      throw new Error("Invalid base64 image data.");
    }
    const [mimeTypePrefix, base64Data] = base64Image.split(';base64,');
    const mimeType = mimeTypePrefix.split(':')[1];
    
    const prompt = `
      Below is an image of a multiple-choice question for Cambridge Economics. The correct answer is ${correctAnswer === 'X' ? 'unknown (the question might be invalid or removed)' : correctAnswer}.
      Please provide a detailed, easy-to-understand explanation for this question in Chinese.
      Explain why the correct answer is right (if known), and carefully explain why each of the other options is incorrect. 
      Format your response with clear plain-text bullet points (e.g. "A: ...", "B: ...").
      IMPORTANT: DO NOT use markdown formatting such as asterisks (*) or hashes (#). Use plain text only.
      IMPORTANT: DO NOT start with any conversational intro (e.g., "我是老师..." or "好的..."). Just output the explanation directly.
    `;

    const ai = getAI();
    let response;
    
    for (let i = 0; i < 3; i++) {
        try {
            response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: {
                 parts: [
                     { text: prompt },
                     { inlineData: { mimeType, data: base64Data } }
                 ]
              }
            });
            break;
          } catch (err: any) {
              if (i === 2) {
                  return `AI 生成失败 (API Error / Rate Limit): ${err?.message || err}`;
              }
              const errStr = String(err?.message || err);
              const delay = (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('Quota exceeded') || errStr.includes('503')) ? 10000 : 2000;
              console.warn(`Retry ${i + 1} for AI Explanation. Waiting ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
          }
      }
      return response?.text || "生成讲解失败。";
    } catch (error: any) {
      console.error("AI Explanation Error:", error);
      return `Failed to generate explanation: ${error.message || error}`;
    }
  };

export const extractQuestionStemForMCQ = async (base64Image: string): Promise<string> => {
  try {
    checkForApiKey();
    if (!base64Image.includes('base64,')) {
      throw new Error("Invalid base64 image data.");
    }
    const [mimeTypePrefix, base64Data] = base64Image.split(';base64,');
    const mimeType = mimeTypePrefix.split(':')[1];
    
    const prompt = `
      Extract the main question stem (the text of the question itself) from this image of a multiple-choice question.
      Example: If the image contains "1 Which statement about a free vaccination programme is normative? A It will help raise life expectancy...",
      You should return ONLY: "Which statement about a free vaccination programme is normative?"
      If there is a background context or data provided before the question, include it briefly. 
      Limit to plain text. Do not include the options (A, B, C, D).
    `;

    const ai = getAI();
    let response;
    
    for (let i = 0; i < 3; i++) {
        try {
            response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: {
                 parts: [
                     { text: prompt },
                     { inlineData: { mimeType, data: base64Data } }
                 ]
              }
            });
            break;
        } catch (e: any) {
            const errStr = String(e.message || e);
            if ((errStr.includes('503 Service Unavailable') || errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('Quota exceeded')) && i < 2) {
                console.warn(`Retry ${i + 1} for AI Extraction due to rate limit/service error... Waiting 10s`);
                await new Promise(r => setTimeout(r, 10000));
            } else {
                throw e;
            }
        }
    }

    if (!response) {
         throw new Error("Failed to get response after retries.");
    }

    return (response.text || "").trim();
  } catch (error: any) {
    console.error("AI Stem Extraction Error:", error);
    return `Extraction failed: ${error.message || error}`;
  }
};

export const generateAnalysisForMCQ = async (base64Image: string, level?: 'AS' | 'AL'): Promise<{ topic: string, description: string }> => {
  try {
    checkForApiKey();
    if (!base64Image.includes('base64,')) {
      throw new Error("Invalid base64 image data.");
    }
    const [mimeTypePrefix, base64Data] = base64Image.split(';base64,');
    const mimeType = mimeTypePrefix.split(':')[1];
    
    let levelFilter = "This is an A-Level paper.";
    let filteredTopics = ALL_TOPICS;

    if (level === 'AS') {
        levelFilter = "This is an AS Level paper.";
        filteredTopics = ALL_TOPICS.filter(t => t.type === 'AS');
    } else if (level === 'AL') {
        levelFilter = "This is an AL (A2 Level) paper.";
        filteredTopics = ALL_TOPICS.filter(t => t.type === 'AL');
    }

    const prompt = `
      Analyze this image of an Economics multiple-choice question.
      ${levelFilter}
      Return a JSON object with strictly two keys: "topic" and "description".
      - "topic": Choose the most appropriate specific topic for this question from this exact list:
        ${JSON.stringify(filteredTopics.map(t => t.text))}. If you are unsure, pick the closest one.
      - "description": Provide ONLY a detailed, specific description of the key concept being tested in this exact format: "General Concept: Specific calculation or identification being tested".
        Examples:
        - "Consumer Surplus & Indirect Tax: Identifying the geometric area of surplus lost when a tax shifts the supply curve."
        - "GDP at Basic Prices: Calculating value by adjusting market prices for indirect taxes and subsidies."
    `;

    const ai = getAI();
    let response;
    
    for (let i = 0; i < 3; i++) {
        try {
            response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: {
                 parts: [
                     { text: prompt },
                     { inlineData: { mimeType, data: base64Data } }
                 ]
              },
              config: {
                responseMimeType: "application/json",
              }
            });
            break;
        } catch (err: any) {
            if (i === 2) throw err;
            const errStr = String(err?.message || err);
            const delay = (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('Quota exceeded') || errStr.includes('503')) ? 10000 : 2000;
            console.warn(`Retry ${i + 1} for AI Analysis. Waiting ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    const textResult = response?.text?.trim() || "{}";
    try {
        const parsed = JSON.parse(textResult);
        return {
            topic: parsed.topic || "Unclassified",
            description: parsed.description || "Unclassified Concept"
        };
    } catch {
        return { topic: "Unclassified", description: textResult };
    }
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    throw new Error(`Failed to generate analysis.`);
  }
};

export const parseBulkEssays = async (rawText: string, level: 'AS' | 'A Level'): Promise<any[]> => {
  try {
    checkForApiKey();
    const isAL = level === 'A Level';
    
    // Import here to avoid circular dependency issues if any
    const { SYLLABUS_STRUCTURE } = await import('../syllabusData');
    
    const chaptersMap = isAL ? SYLLABUS_STRUCTURE['A Level'].chapters : SYLLABUS_STRUCTURE['AS'].chapters;
    let chaptersContext = '';
    for (const [topic, chapters] of Object.entries(chaptersMap)) {
      chaptersContext += `Topic: ${topic}\nChapters:\n${(chapters as string[]).map(c => `- ${c}`).join('\n')}\n\n`;
    }

    const prompt = `
      You are an expert Cambridge Economics parser.
      The user is pasting a block of raw text that contains an ENTIRE paper of Essay Questions AND their corresponding Mark Schemes.
      Your task is to extract every single structured essay question (e.g., 2a, 2b, 3a, 3b) along with its mark scheme, marks, and auto-classify its syllabus topic.

      Syllabus Level: ${level}

      Available Topics and Chapters:
      ${chaptersContext}
      
      Instructions:
      1. Extract each distinct sub-question as a separate item (e.g. 2(a), 2(b)).
      2. Identify the Question Text EXACTLY as it appears in the text.
      3. Identify the Mark Scheme specific to that question. You MUST extract the entire mark scheme content EXACTLY verbatim. DO NOT summarize, paraphrase, shorten, or alter the mark scheme in any way. Keep the full raw text for the mark scheme.
      4. Auto-classify the best matching "topic" and "chapter" from the list above.
      5. Identify the max marks (e.g. 8 for (a), 12 for (b), or 20).
      6. Provide a clean JSON array output.

      Return ONLY a JSON array of objects with this exact format:
      [
        {
          "questionNumber": "2(a)",
          "questionText": "...",
          "markScheme": "...",
          "topic": "...",
          "chapter": "...",
          "maxMarks": 8
        }
      ]
    `;

    const ai = getAI();
    let response;
    
    for (let i = 0; i < 3; i++) {
        try {
            response = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: [
                { text: prompt },
                { text: rawText }
              ],
              config: {
                responseMimeType: "application/json"
              }
            });
            break;
        } catch (err) {
            if (i === 2) throw err;
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    const resultText = response?.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    return JSON.parse(resultText);

  } catch (error: any) {
    console.error("Bulk Essay Parse Error:", error);
    throw new Error(`Failed to parse bulk essays. Details: ${error.message || error}`);
  }
};


