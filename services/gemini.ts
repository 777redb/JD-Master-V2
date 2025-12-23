
import { GoogleGenAI, Type } from "@google/genai";
import { MockBarQuestion } from "../types";

const getAi = () => {
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
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
    Act as a **Senior Law Professor** at a top Philippine Law School.
    Generate a **Rigorously Tailored Study Module** for the JD Subject: "${subjectCode} - ${subjectTitle}".
    
    The content must be professional, authoritative, and exhaustive.
    
    **STRICT STRUCTURE (HTML):**
    1. <h1>[Subject Title]</h1>
    2. <h3>Module Overview</h3>
    3. <h3>I. Foundational Principles & Rationale</h3>
    4. <h3>II. Key Codal Provisions</h3> (Use <div class="statute-box"> for verbatim law)
    5. <h3>III. Landmark PH Jurisprudence</h3> (Cite Case Names & G.R. Nos.)
    6. <h3>IV. Critical Analysis & Elements</h3>
    7. <h3>V. Suggested Readings</h3> (Cite authoritative PH authors: e.g., Tolentino, Paras, Pineda, Justice Leonen, etc.)
    
    Target Length: Extensive, detailed chapter.
    Output HTML ONLY.
  `;
  return generateGeneralLegalAdvice(prompt);
};

export const fetchLegalNews = async (): Promise<string> => {
  const prompt = `Perform a Google Search for latest SC announcements and Republic Acts. Output HTML list.`;
  return withErrorHandling(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "Aggregator. HTML only.",
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `5 cases containing "${query}". JSON array only.`,
      config: { responseMimeType: 'application/json' }
    });
    return response.text ? JSON.parse(response.text) : [];
  }, []);
};

export const generateMockBarQuestion = async (subject: string, profile: string, type: 'MCQ' | 'ESSAY'): Promise<MockBarQuestion | null> => {
  return withErrorHandling(async (ai) => {
    const prompt = `Bar question for ${subject} (${profile}). Return JSON.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
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
