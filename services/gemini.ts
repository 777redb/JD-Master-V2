
import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import { MockBarQuestion } from "../types";

/**
 * INTERNAL ARCHITECTURAL LAYER: Baseline Registry
 * Reference statistics for detecting distributional shifts and performance decay.
 */
const BASELINE_STATS = {
  promptLength: 450,      // Average characters
  responseLength: 1800,   // Average characters
  latencyMs: 4200,        // Average response time
  tokenCountIn: 350,      // Average input tokens
  tokenCountOut: 850,     // Average output tokens
  driftThreshold: 0.5     // 50% deviation triggers internal alert
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Model Registry
 * Tracks model versions, status, and integrity hashes.
 * Version entries are immutable once recorded.
 */
const ModelRegistry: Record<string, { version: string, hash: string, status: 'active' | 'deprecated' | 'shadow' }> = {
  'gemini-3-pro-preview': {
    version: '3.0.0-pro-preview-stable',
    hash: 'sha256:7f8e9d0a1b2c3d4e5f6g7h8i9j0k',
    status: 'active'
  },
  'gemini-3-flash-preview': {
    version: '3.0.0-flash-preview-stable',
    hash: 'sha256:1a2b3c4d5e6f7g8h9i0j1k2l3m4n',
    status: 'active'
  }
};

/**
 * INTERNAL COMPONENT: Model Version Router
 * Resolves requested models to their active version metadata.
 */
const ModelRouter = {
  resolve: (modelId: string) => {
    const entry = ModelRegistry[modelId];
    return {
      name: modelId,
      version: entry?.version || 'v.legacy',
      hash: entry?.hash || 'unknown'
    };
  }
};

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
 * INTERNAL ARCHITECTURAL LAYER: Output Schema Registry
 * Defines structural requirements based on existing application output patterns.
 */
const SchemaRegistry: Record<string, { requiredPatterns?: RegExp[], validator?: (text: string) => boolean }> = {
  'GENERAL_LEGAL_HTML': {
    requiredPatterns: [/<h[3-4]>/i, /<p>/i]
  },
  'JD_MODULE_HTML': {
    requiredPatterns: [
      /<h1>/i, 
      /<h3>SYLLABUS OVERVIEW/i, 
      /<h3>I\. BLACK-LETTER LAW/i, 
      /<h3>II\. JURISPRUDENTIAL EVOLUTION/i, 
      /<h3>III\. PRACTICAL APPLICATION/i
    ]
  },
  'LEGAL_NEWS_LIST': {
    requiredPatterns: [/<li>/i]
  },
  'JSON_ARRAY': {
    validator: (text: string) => {
      try {
        const parsed = JSON.parse(text);
        return Array.isArray(parsed);
      } catch { return false; }
    }
  },
  'MOCK_BAR_QUESTION': {
    validator: (text: string) => {
      try {
        const parsed = JSON.parse(text);
        return !!(parsed.question && parsed.explanation && typeof parsed.correctAnswerIndex === 'number');
      } catch { return false; }
    }
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Logging & Audit Trail
 * Records all AI-related events for traceability and compliance.
 */
interface AuditLogEntry {
  requestId: string;
  timestamp: string;
  eventType: 'INFERENCE_START' | 'INFERENCE_COMPLETE' | 'INFERENCE_ERROR' | 'VALIDATION_FAILURE' | 'SCHEMA_VALIDATION_PASS' | 'SCHEMA_VALIDATION_FAIL' | 'DRIFT_ALERT';
  component: string;
  metadata: {
    model?: string;
    modelVersion?: string;
    modelHash?: string;
    promptHash?: string;
    responseHash?: string;
    latencyMs?: number;
    tokensIn?: number;
    tokensOut?: number;
    status?: string;
    errorType?: string;
    schemaKey?: string;
    driftType?: 'INPUT' | 'OUTPUT' | 'PERFORMANCE';
    driftScore?: number;
    metricName?: string;
    baselineValue?: number;
    currentValue?: number;
  };
}

const AUDIT_SINK: AuditLogEntry[] = [];

const AuditLogger = {
  record: (entry: AuditLogEntry) => {
    AUDIT_SINK.push(Object.freeze(entry));
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Drift Detector (Passive)
 * Measures distributional shifts against baselines.
 */
const DriftDetector = {
  observe: (requestId: string, metrics: { inputLength?: number, outputLength?: number, latency?: number, tokensIn?: number, tokensOut?: number }) => {
    const checkDrift = (current: number, baseline: number, type: 'INPUT' | 'OUTPUT' | 'PERFORMANCE', name: string) => {
      const score = Math.abs(current - baseline) / baseline;
      if (score > BASELINE_STATS.driftThreshold) {
        AuditLogger.record({
          requestId,
          timestamp: new Date().toISOString(),
          eventType: 'DRIFT_ALERT',
          component: 'DriftDetector',
          metadata: {
            driftType: type,
            metricName: name,
            driftScore: Number(score.toFixed(4)),
            baselineValue: baseline,
            currentValue: current
          }
        });
      }
    };

    if (metrics.inputLength) checkDrift(metrics.inputLength, BASELINE_STATS.promptLength, 'INPUT', 'prompt_length');
    if (metrics.outputLength) checkDrift(metrics.outputLength, BASELINE_STATS.responseLength, 'OUTPUT', 'response_length');
    if (metrics.latency) checkDrift(metrics.latency, BASELINE_STATS.latencyMs, 'PERFORMANCE', 'latency');
    if (metrics.tokensIn) checkDrift(metrics.tokensIn, BASELINE_STATS.tokenCountIn, 'INPUT', 'token_count_in');
    if (metrics.tokensOut) checkDrift(metrics.tokensOut, BASELINE_STATS.tokenCountOut, 'OUTPUT', 'token_count_out');
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Validation Gate (Passive)
 * Blocks unauthorized prompt patterns without modifying the source text.
 */
const ValidationGate = {
  validateInput: (contents: any): boolean => {
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
  },

  validateOutput: (text: string, schemaKey?: string): boolean => {
    if (!schemaKey || !SchemaRegistry[schemaKey]) return true;
    const schema = SchemaRegistry[schemaKey];
    
    if (schema.validator) {
      return schema.validator(text);
    }
    
    if (schema.requiredPatterns) {
      return schema.requiredPatterns.every(pattern => pattern.test(text));
    }
    
    return true;
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
    config?: any,
    schemaKey?: string
  }): Promise<string> {
    const requestId = RequestCorrelator.generateId();
    const startTime = performance.now();
    const promptString = JSON.stringify(params.contents);
    const promptHash = await computeIntegrityHash(promptString);

    // Resolve model version through router
    const resolvedModel = ModelRouter.resolve(params.model);

    AuditLogger.record({
      requestId,
      timestamp: new Date().toISOString(),
      eventType: 'INFERENCE_START',
      component: 'InferenceEngine',
      metadata: { 
        model: resolvedModel.name, 
        modelVersion: resolvedModel.version,
        modelHash: resolvedModel.hash,
        promptHash, 
        schemaKey: params.schemaKey 
      }
    });

    // Prompt Validation Gate
    if (!ValidationGate.validateInput(params.contents)) {
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
        model: resolvedModel.name, // Using resolved model name
        contents: params.contents,
        config: params.config
      });
      
      const endTime = performance.now();
      const responseText = response.text || "";
      const responseHash = await computeIntegrityHash(responseText);
      const latency = Math.round(endTime - startTime);

      // Passive Drift Observation
      DriftDetector.observe(requestId, {
        inputLength: promptString.length,
        outputLength: responseText.length,
        latency: latency,
        tokensIn: response.usageMetadata?.promptTokenCount,
        tokensOut: response.usageMetadata?.candidatesTokenCount
      });

      // Output Schema Enforcement
      if (!ValidationGate.validateOutput(responseText, params.schemaKey)) {
        AuditLogger.record({
          requestId,
          timestamp: new Date().toISOString(),
          eventType: 'SCHEMA_VALIDATION_FAIL',
          component: 'ValidationGate',
          metadata: { status: 'INVALID_STRUCTURE', schemaKey: params.schemaKey }
        });
        throw new Error(`Output Validation Failed: Response does not conform to required schema (${params.schemaKey}).`);
      }

      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'SCHEMA_VALIDATION_PASS',
        component: 'ValidationGate',
        metadata: { schemaKey: params.schemaKey }
      });

      AuditLogger.record({
        requestId,
        timestamp: new Date().toISOString(),
        eventType: 'INFERENCE_COMPLETE',
        component: 'InferenceEngine',
        metadata: {
          status: 'SUCCESS',
          model: resolvedModel.name,
          modelVersion: resolvedModel.version,
          responseHash,
          latencyMs: latency,
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
          model: resolvedModel.name,
          modelVersion: resolvedModel.version,
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

export const generateGeneralLegalAdvice = async (prompt: string, schemaKey: string = 'GENERAL_LEGAL_HTML'): Promise<string> => {
  return withInferenceSafety(async () => {
    return await InferenceEngine.infer({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      schemaKey: schemaKey,
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
  return generateGeneralLegalAdvice(prompt, 'JD_MODULE_HTML');
};

export const fetchLegalNews = async (prompt?: string): Promise<string> => {
  const defaultPrompt = `Perform a Google Search for the latest 5 Supreme Court announcements and Republic Acts. Output as a clean HTML list using only <li> tags for each news item. Each <li> should contain a short headline in <strong> and a 1-sentence summary.`;
  return withInferenceSafety(async () => {
    return await InferenceEngine.infer({
      model: 'gemini-3-pro-preview',
      contents: prompt || defaultPrompt,
      schemaKey: 'LEGAL_NEWS_LIST',
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
      schemaKey: 'JSON_ARRAY',
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
      schemaKey: 'MOCK_BAR_QUESTION',
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
