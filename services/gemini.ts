
import { GoogleGenAI, Type } from "@google/genai";
import { MockBarQuestion } from "../types";

/**
 * FIX: Initializing GoogleGenAI with named parameter apiKey from process.env.API_KEY
 */
const getAi = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

async function withErrorHandling<T>(
  operation: (ai: GoogleGenAI) => Promise<T>, 
  fallback: T
): Promise<T> {
  try {
    const ai = getAi();
    return await operation(ai);
  } catch (error: any) {
    const isQuotaError = error.status === 429 || 
                         (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));
    const win = window as any;
    if (isQuotaError && win.aistudio) {
      try {
        await win.aistudio.openSelectKey();
        const aiRetry = getAi();
        return await operation(aiRetry);
      } catch (retryError) {
        return fallback;
      }
    }
    return fallback;
  }
}

const LEGAL_PH_SYSTEM_INSTRUCTION = `
You are the **LegalPH Readability & Formatting Engine**.
Your task is to transform ALL generated legal content—codals, jurisprudence, case digests, reviewer chapters, case-build outputs, contracts, and articles—into **highly readable, professionally typeset, book-quality text**.

# Formatting Rules:
* Use <h3> for primary headers, <h4> for secondary headers.
* Use <p> for body text.
* Use <div class="statute-box"> for verbatim statutory text.
* Use <blockquote> for case doctrines or block quotes.
* Ensure justified text simulation and proper paragraph spacing.
* Use <ul> and <li> for lists.
* Use <table> for comparisons.
`;

export const generateGeneralLegalAdvice = async (prompt: string): Promise<string> => {
  return withErrorHandling(async (ai) => {
    /**
     * FIX: Using gemini-3-pro-preview for complex text tasks as per model guidelines
     */
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: {
        systemInstruction: LEGAL_PH_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], 
      }
    });
    return response.text || "<p>No response generated.</p>";
  }, "<p>Unable to retrieve legal information.</p>");
};

export const generateJDModuleContent = async (subjectCode: string, subjectTitle: string): Promise<string> => {
  const prompt = `
    Act as an **Integrated Law Professor** representing the best of the UP, Ateneo, and San Beda traditions.
    Generate a **Comprehensive Study Module** for: "${subjectCode} - ${subjectTitle}".
    
    **PEDAGOGICAL PHILOSOPHY:**
    - UP Aspect: Heavy jurisprudential grounding, policy analysis, and "Ratio Legis".
    - Ateneo Aspect: Holistic, ethical, and outcomes-based practice readiness.
    - San Beda Aspect: Disciplined doctrinal mastery, procedural dominance, and Bar-readiness.

    **STRICT STRUCTURE (HTML):**
    1. <h1>[Subject Title]</h1>
    2. <h3>SYLLABUS OVERVIEW & PHILOSOPHY</h3>
    3. <h3>I. BLACK-LETTER LAW</h3> (Use <div class="statute-box"> for verbatim law)
    4. <h3>II. JURISPRUDENTIAL EVOLUTION</h3> (UP Style deep-dive into landmark rulings)
    5. <h3>III. PRACTICAL APPLICATION & ADVOCACY</h3> (Ateneo Style skills/ethics scenarios)
    6. <h3>IV. BAR INTEGRATION & DOCTRINAL RECALL</h3> (San Beda Style high-yield summary)
    7. <h3>V. SUGGESTED FURTHER READINGS</h3> (Cite Tolentino, Paras, Pineda, Justice Leonen, etc.)
    
    Output HTML ONLY.
  `;
  return generateGeneralLegalAdvice(prompt);
};

export const fetchLegalNews = async (prompt?: string): Promise<string> => {
  const defaultPrompt = `Perform a Google Search for the latest 5 Supreme Court announcements and Republic Acts. Output as a clean HTML list using only <li> tags for each news item. Each <li> should contain a short headline in <strong> and a 1-sentence summary.`;
  return withErrorHandling(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt || defaultPrompt,
      config: {
        systemInstruction: "You are a legal news aggregator. Output only the <li> items. No <ul> tags.",
        tools: [{ googleSearch: {} }],
      }
    });
    return response.text || "<li>No updates found.</li>";
  }, "<li>Error fetching news.</li>");
};

export const generateCaseDigest = async (caseInfo: string): Promise<string> => {
  const prompt = `Create detailed Case Digest for: "${caseInfo}". Use H3, H4, P structure.`;
  return generateGeneralLegalAdvice(prompt);
};

export const getCaseSuggestions = async (query: string): Promise<string[]> => {
  return withErrorHandling(async (ai) => {
    /**
     * FIX: Using gemini-3-flash-preview for basic text tasks
     */
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `5 cases containing "${query}". JSON array only.`,
      config: { responseMimeType: 'application/json' }
    });
    return response.text ? JSON.parse(response.text) : [];
  }, []);
};

export const generateMockBarQuestion = async (subject: string, profile: string, type: 'MCQ' | 'ESSAY'): Promise<MockBarQuestion | null> => {
  return withErrorHandling(async (ai) => {
    const prompt = `
      Act as a **Member of the Philippine Bar Board of Examiners**. 
      Create a high-level ${type} question for the Bar subject: "${subject}".
      The difficulty should be calibrated for a **${profile}**.
      
      **TASK:**
      1. Create a realistic, factual scenario (problem) typical of the Philippine Bar.
      2. If MCQ: Provide 4 plausible choices (A, B, C, D).
      3. If Essay: Provide a complex scenario requiring analysis.
      4. Provide a comprehensive explanation in HTML (p, strong, blockquote).
      5. Provide a specific citation (Article number or SC Case Name).
      
      Return as JSON ONLY with this schema:
      {
        "question": "string",
        "choices": ["string", "string", "string", "string"], (empty if ESSAY)
        "correctAnswerIndex": number, (0-3, -1 if ESSAY)
        "explanation": "HTML string summarizing the reasoning and ratio decidendi",
        "citation": "Article/Case Name"
      }
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            choices: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            citation: { type: Type.STRING }
          },
          required: ["question", "choices", "correctAnswerIndex", "explanation", "citation"]
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  }, null);
};

export const generateContract = async (mode: 'TEMPLATE' | 'CUSTOM', title: string, details: any): Promise<string> => {
  return generateGeneralLegalAdvice(`Draft PH contract: ${title}. ${JSON.stringify(details)}`);
};

export const analyzeLegalResearch = async (query: string): Promise<string> => {
   return generateGeneralLegalAdvice(`Legal research on: ${query}`);
}

export const generateLawSyllabus = async (topic: string, profile: string): Promise<string> => {
  return generateGeneralLegalAdvice(`Reviewer chapter on ${topic} for ${profile}`);
};
