
import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import { MockBarQuestion } from "../types";

/**
 * INTERNAL COMPONENT: Request Correlator
 * Generates unique identifiers for tracing the lifecycle of an AI request.
 */
const RequestCorrelator = {
  generateId: () => crypto.randomUUID()
};

/**
 * INTERNAL COMPONENT: Integrity Hash Utility
 * Generates SHA-256 signatures of content for audit verification without storing raw text.
 */
async function computeIntegrityHash(content: string): Promise<string> {
  try {
    const msgUint8 = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return "hash_computation_failed";
  }
}

/**
 * INTERNAL ARCHITECTURAL LAYER: Logging & Audit Trail
 * Records all AI-related events for traceability and compliance.
 * Append-only and observational.
 */
interface AuditLogEntry {
  requestId: string;
  timestamp: string;
  eventType: 'INFERENCE_START' | 'INFERENCE_COMPLETE' | 'INFERENCE_ERROR' | 'VALIDATION_FAILURE';
  component: string;
  metadata: {
    model?: string;
    promptHash?: string;
    responseHash?: string;
    latencyMs?: number;
    tokensIn?: number;
    tokensOut?: number;
    status?: string;
    errorType?: string;
  };
}

// Internal immutable-style sink (simulating backend secure log storage)
const AUDIT_SINK: AuditLogEntry[] = [];

const AuditLogger = {
  record: (entry: AuditLogEntry) => {
    // Append-only recording
    AUDIT_SINK.push(Object.freeze(entry));
    // In a production backend environment, this would be dispatched to a secure log aggregator (e.g., Cloud Logging)
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Validation Gate (Passive)
 * Blocks unauthorized prompt patterns without modifying the source text.
 */
const ValidationGate = {
  validate: (contents: any): boolean => {
    const textToInpect = JSON.stringify(contents).toLowerCase();
    const forbiddenPatterns = [
      /ignore (all )?previous instructions/i,
      /ignore everything above/i,
      /system prompt impersonation/i,
      /you are now (an? )?admin/i,
      /stop following instructions/i,
      /bypass guardrails/i,
      /forget (your )?rules/i
    ];
    
    return !forbiddenPatterns.some(pattern => pattern.test(textToInpect));
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Inference Engine (Backend Surrogate)
 * Acts as the transparent inference wrapper moving model execution logic into an isolated controller.
 */
class InferenceEngine {
  private static getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  static async infer(params: {
    model: string,
    contents: any,
    config?: any
  }): Promise<string> {
    const requestId = RequestCorrelator.generateId();
    const startTime = performance.now();
    const promptString = JSON.stringify(params.contents);
    const promptHash = await computeIntegrityHash(promptString);

    AuditLogger.record({
      requestId,
      timestamp: new Date().toISOString(),
      eventType: 'INFERENCE_START',
      component: 'InferenceEngine',
      metadata: { model: params.model, promptHash }
    });

    // Prompt Validation Gate
    if (!ValidationGate.validate(params.contents)) {
      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'VALIDATION_FAILURE',
        component: 'ValidationGate',
        metadata: { status: 'BLOCKED', errorType: 'PROMPT_INJECTION_PATTERN' }
      });
      throw new Error("Security Validation Failed: Unauthorized prompt pattern detected.");
    }

    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: params.config
      });
      
      const endTime = performance.now();
      const responseText = response.text || "";
      const responseHash = await computeIntegrityHash(responseText);

      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'INFERENCE_COMPLETE',
        component: 'InferenceEngine',
        metadata: {
          status: 'SUCCESS',
          responseHash,
          latencyMs: Math.round(endTime - startTime),
          tokensIn: response.usageMetadata?.promptTokenCount,
          tokensOut: response.usageMetadata?.candidatesTokenCount
        }
      });

      return responseText;
    } catch (error: any) {
      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'INFERENCE_ERROR',
        component: 'InferenceEngine',
        metadata: {
          status: 'ERROR',
          errorType: error.constructor.name,
          latencyMs: Math.round(performance.now() - startTime)
        }
      });
      throw error;
    }
  }
}

/**
 * ERROR HANDLING WRAPPER (Public)
 * Preserves existing application error behavior and quota handling.
 */
async function withInferenceSafety<T>(
  operation: () => Promise<T>, 
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const isQuotaError = error.status === 429 || 
                         (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));
    const win = window as any;
    if (isQuotaError && win.aistudio) {
      try {
        await win.aistudio.openSelectKey();
        return await operation();
      } catch (retryError) {
        return fallback;
      }
    }
    console.error("Inference Error:", error.message);
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
  return withInferenceSafety(async () => {
    return await InferenceEngine.infer({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: {
        systemInstruction: LEGAL_PH_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], 
      }
    });
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
  return withInferenceSafety(async () => {
    return await InferenceEngine.infer({
      model: 'gemini-3-pro-preview',
      contents: prompt || defaultPrompt,
      config: {
        systemInstruction: "You are a legal news aggregator. Output only the <li> items. No <ul> tags.",
        tools: [{ googleSearch: {} }],
      }
    });
  }, "<li>Error fetching news.</li>");
};

export const generateCaseDigest = async (caseInfo: string): Promise<string> => {
  const prompt = `Create detailed Case Digest for: "${caseInfo}". Use H3, H4, P structure.`;
  return generateGeneralLegalAdvice(prompt);
};

export const getCaseSuggestions = async (query: string): Promise<string[]> => {
  return withInferenceSafety(async () => {
    const response = await InferenceEngine.infer({
      model: 'gemini-3-flash-preview',
      contents: `5 cases containing "${query}". JSON array only.`,
      config: { responseMimeType: 'application/json' }
    });
    return response ? JSON.parse(response) : [];
  }, []);
};

export const generateMockBarQuestion = async (subject: string, profile: string, type: 'MCQ' | 'ESSAY'): Promise<MockBarQuestion | null> => {
  return withInferenceSafety(async () => {
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
    const response = await InferenceEngine.infer({
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
    return response ? JSON.parse(response) : null;
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
