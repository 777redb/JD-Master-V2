
import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import { MockBarQuestion } from "../types";

/**
 * INTERNAL ARCHITECTURAL LAYER: Internal Metadata Channel
 * Silently records inference lifecycle metrics for platform observability.
 */
interface InferenceMetadata {
  requestId: string;
  timestamp: string;
  modelIdentifier: string;
  latencyMs?: number;
  orchestrationRole: 'primary' | 'shadow' | 'fallback';
  jurisdictionId: string;
}

/**
 * INTERNAL ARCHITECTURAL LAYER: Output Schema Registry
 * Maps feature keys to structural verification logic derived from existing, implicit output patterns.
 * Versioned internally for governance tracking.
 */
const OutputSchemaRegistry: Record<string, { 
  validator: (text: string) => boolean, 
  version: string 
}> = {
  'GENERAL_LEGAL_HTML': {
    validator: (text) => (text.includes('<h3>') || text.includes('<h4>')) && text.includes('<p>'),
    version: '1.0.1'
  },
  'JD_MODULE_HTML': {
    validator: (text) => text.includes('<h1>') && text.includes('<h3>SYLLABUS OVERVIEW') && text.includes('<h3>I. BLACK-LETTER LAW'),
    version: '1.1.0'
  },
  'LEGAL_NEWS_LIST': {
    validator: (text) => text.includes('<li>') && text.includes('<strong>'),
    version: '1.0.0'
  },
  'CASE_DIGEST_HTML': {
    validator: (text) => /FACTS/i.test(text) && /ISSUE/i.test(text) && /RULING/i.test(text),
    version: '1.0.2'
  },
  'MCQ_JSON': {
    validator: (text) => {
      try {
        const p = JSON.parse(text);
        return !!(p.question && Array.isArray(p.choices) && typeof p.correctAnswerIndex === 'number' && p.explanation && p.citation);
      } catch { return false; }
    },
    version: '1.0.0'
  },
  'JSON_ARRAY': {
    validator: (text) => {
      try { return Array.isArray(JSON.parse(text)); } catch { return false; }
    },
    version: '1.0.0'
  },
  'CONTRACT_HTML': {
    validator: (text) => text.includes('<h3>') && (text.includes('WITNESSETH') || text.includes('WHEREAS') || text.includes('ARTICLE') || text.includes('SECTION')),
    version: '1.1.0'
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Output Schema Validator (Passive)
 * Performs deterministic structural verification. Returns PASS (true) or FAIL (false).
 * Does not mutate the input text.
 */
const OutputSchemaValidator = {
  validate: (text: string, schemaKey?: string): boolean => {
    if (!schemaKey || !OutputSchemaRegistry[schemaKey]) return true; // Pass through if no schema defined
    return OutputSchemaRegistry[schemaKey].validator(text);
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Audit Logger
 */
const AuditLogger = {
  record: (event: any) => {
    // Passive telemetry sink
    console.debug('[GOVERNANCE-AUDIT]', event);
  }
};

/**
 * INTERNAL UTILITY: Integrity & Hashing
 */
const IntegrityUtils = {
  computeHash: (text: string): string => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }
};

const RequestCorrelator = {
  generateId: () => Math.random().toString(36).substring(7)
};

const SecurityGateway = {
  isRateLimited: (id: string) => false
};

const ValidationGate = {
  validateInput: (contents: any) => true
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Jurisdiction Scope Registry
 */
const JURISDICTION_SCOPE_REGISTRY: Record<string, { 
  id: string, 
  name: string, 
  authorizedStatutoryScope: string[], 
  forbiddenCitations: RegExp[] 
}> = {
  'PH': {
    id: 'PH',
    name: 'Philippines',
    authorizedStatutoryScope: ['1987 Constitution', 'Revised Penal Code', 'Civil Code', 'Rules of Court'],
    forbiddenCitations: [
      /\bU\.S\.\s+Supreme\s+Court\b/i,
      /\bSCOTUS\b/i,
      /\bCommon\s+Law\b(?!\s+principles\s+applied\s+in\s+PH)/i,
      /\bU\.K\.\b/i,
      /\bFederal\s+Rules\s+of\s+Evidence\b/i
    ]
  }
};

const JurisdictionResolver = {
  resolve: (): string => {
    return (process.env as any).APP_JURISDICTION || 'PH';
  }
};

const JurisdictionGuardrail = {
  observe: (requestId: string, jurisdictionId: string, text: string) => {
    const scope = JURISDICTION_SCOPE_REGISTRY[jurisdictionId];
    if (!scope) return;
    let violationDetected = false;
    scope.forbiddenCitations.forEach(pattern => {
      if (pattern.test(text)) violationDetected = true;
    });
    if (violationDetected) {
      AuditLogger.record({ requestId, timestamp: new Date().toISOString(), eventType: 'JURISDICTION_SCOPE_VIOLATION', metadata: { jurisdictionId } });
    }
  }
};

const ModelRegistry: Record<string, { version: string, status: 'active' | 'deprecated', role: 'primary' | 'fallback' }> = {
  'gemini-3-pro-preview': { version: '3.0.0-pro-stable', status: 'active', role: 'primary' },
  'gemini-3-flash-preview': { version: '3.0.0-flash-stable', status: 'active', role: 'primary' }
};

const ModelOrchestrator = {
  resolveActiveModel: (requestedModelId: string) => {
    const entry = ModelRegistry[requestedModelId];
    return { id: (entry && entry.status === 'active') ? requestedModelId : 'gemini-3-pro-preview', ...entry };
  },
  getShadowModels: (primaryModelId: string): string[] => {
    return primaryModelId === 'gemini-3-pro-preview' ? ['gemini-3-flash-preview'] : [];
  },
  executeShadow: async (requestId: string, modelId: string, contents: any, config: any, jurisdictionId: string) => {
    try {
      await InferenceAdapter.callModel({ model: modelId, contents, config });
    } catch (e) {}
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Inference Adapter
 */
class InferenceAdapter {
  private static getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }
  static async callModel(params: { model: string, contents: any, config?: any }) {
    const ai = this.getClient();
    return await ai.models.generateContent({
      model: params.model,
      contents: params.contents,
      config: params.config
    });
  }
}

/**
 * INTERNAL ARCHITECTURAL LAYER: Inference Gateway
 */
class InferenceGateway {
  static async invoke(params: {
    model: string,
    contents: any,
    config?: any,
    schemaKey?: string
  }): Promise<string> {
    const requestId = RequestCorrelator.generateId();
    const timestamp = new Date().toISOString();
    
    const jurisdictionId = JurisdictionResolver.resolve();
    const resolvedModel = ModelOrchestrator.resolveActiveModel(params.model);
    const shadowModels = ModelOrchestrator.getShadowModels(resolvedModel.id);

    if (SecurityGateway.isRateLimited('default_session')) {
      throw new Error("Security Policy: Rate limit exceeded.");
    }

    try {
      shadowModels.forEach(shadowId => {
        ModelOrchestrator.executeShadow(requestId, shadowId, params.contents, params.config, jurisdictionId);
      });

      const response = await InferenceAdapter.callModel({
        model: resolvedModel.id,
        contents: params.contents,
        config: params.config
      });

      const textResponse = response.text || "";
      
      // --- OUTPUT SCHEMA ENFORCEMENT (PASSIVE VALIDATION) ---
      const validationResult = OutputSchemaValidator.validate(textResponse, params.schemaKey);
      
      // Silent Validation Audit Logging
      AuditLogger.record({
        request_id: requestId,
        schema_version: params.schemaKey ? OutputSchemaRegistry[params.schemaKey]?.version : 'NONE',
        output_hash: IntegrityUtils.computeHash(textResponse),
        validation_result: validationResult ? 'PASS' : 'FAIL',
        timestamp: new Date().toISOString()
      });

      if (!validationResult) {
        // Triggering the existing application error behavior for malformed outputs
        throw new Error(`Output Validation Failed: Structural anomaly detected for ${params.schemaKey}.`);
      }

      JurisdictionGuardrail.observe(requestId, jurisdictionId, textResponse);

      return textResponse;
    } catch (err) {
      throw err;
    }
  }
}

/**
 * PUBLIC EXPORTS: LEGAL SERVICE LAYER
 */

export async function generateGeneralLegalAdvice(prompt: string): Promise<string> {
  return await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    schemaKey: 'GENERAL_LEGAL_HTML',
    config: {
      systemInstruction: "You are a senior Philippine legal consultant. Provide detailed legal commentary in HTML using <h3> and <p> tags. Focus on statutory interpretation and landmark Supreme Court decisions."
    }
  });
}

export async function generateMockBarQuestion(subject: string, profile: string, examType: 'MCQ' | 'ESSAY'): Promise<MockBarQuestion> {
  const jsonResponse = await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: `Generate a 2024 Philippine Bar Examination question for: ${subject}. Candidate level: ${profile}. Type: ${examType}.`,
    schemaKey: 'MCQ_JSON',
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          choices: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          citation: { type: Type.STRING }
        },
        required: ['question', 'choices', 'correctAnswerIndex', 'explanation', 'citation']
      },
      systemInstruction: "You are an examiner for the Philippine Supreme Court. Create rigorous questions for the Bar Exams."
    }
  });
  return JSON.parse(jsonResponse);
}

export async function generateCaseDigest(query: string): Promise<string> {
  return await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: `Draft a formal Supreme Court Case Digest for: ${query}`,
    schemaKey: 'CASE_DIGEST_HTML',
    config: {
      systemInstruction: "Format as HTML with bold headings for FACTS, ISSUE, and RULING. Maintain professional legal standards."
    }
  });
}

export async function getCaseSuggestions(input: string): Promise<string[]> {
  const jsonResponse = await InferenceGateway.invoke({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 5 landmark Philippine cases for: ${input}`,
    schemaKey: 'JSON_ARRAY',
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(jsonResponse);
}

export async function analyzeLegalResearch(query: string): Promise<string> {
  return await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: `Perform high-level legal research and analysis for: ${query}`,
    schemaKey: 'GENERAL_LEGAL_HTML',
    config: {
      systemInstruction: "You are a legal research director. Provide a comprehensive strategy in HTML with citations."
    }
  });
}

export async function fetchLegalNews(): Promise<string> {
  return await InferenceGateway.invoke({
    model: 'gemini-3-flash-preview',
    contents: "Retrieve 5 recent legal updates in the Philippines.",
    schemaKey: 'LEGAL_NEWS_LIST',
    config: {
      systemInstruction: "Return <li> items with <strong> headlines and summaries. No <ul> tags."
    }
  });
}

export async function generateLawSyllabus(topic: string, profile: string): Promise<string> {
  return await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: `Create a comprehensive study module for: ${topic} targeted at: ${profile}`,
    schemaKey: 'JD_MODULE_HTML',
    config: {
      systemInstruction: "Format as a formal textbook chapter in HTML using <h1> and <h3> headers."
    }
  });
}

export async function generateContract(mode: 'TEMPLATE' | 'CUSTOM', prompt: string, data: any): Promise<string> {
  const context = mode === 'TEMPLATE' 
    ? `Draft a contract for ${prompt} using these details: ${JSON.stringify(data)}`
    : `Draft a custom contract based on: ${prompt}`;

  return await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: context,
    schemaKey: 'CONTRACT_HTML',
    config: {
      systemInstruction: "You are an expert legal drafter in the Philippines. Generate a robust contract in HTML with clear Articles/Sections."
    }
  });
}

export async function generateJDModuleContent(code: string, title: string): Promise<string> {
  return await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: `Draft a JD Program study guide for ${code}: ${title}`,
    schemaKey: 'JD_MODULE_HTML',
    config: {
      systemInstruction: "Draft a comprehensive study module using <h1> for title and <h3> for sections (OVERVIEW, BLACK-LETTER LAW, etc)."
    }
  });
}
