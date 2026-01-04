
import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import { MockBarQuestion } from "../types";

/**
 * INTERNAL ARCHITECTURAL LAYER: Internal Metadata Channel
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
 * INTERNAL ARCHITECTURAL LAYER: Jurisdiction Scope Registry
 */
const JurisdictionScopeRegistry: Record<string, { 
  id: string, 
  name: string, 
  authorizedSources: string[], 
  forbiddenCaseLawSets: string[],
  detectionPatterns: RegExp[] 
}> = {
  'PH': {
    id: 'PH',
    name: 'Philippines',
    authorizedSources: ['1987 Constitution', 'Philippine Reports', 'Official Gazette'],
    forbiddenCaseLawSets: ['U.S. Supreme Court', 'Federal Rules of Evidence', 'Common Law Doctrines'],
    detectionPatterns: [
      /\bU\.S\.\s+Supreme\s+Court\b/i,
      /\bSCOTUS\b/i,
      /\bCommon\s+Law\b(?!\s+principles\s+applied\s+in\s+PH)/i,
      /\bFederal\s+Rules\s+of\s+Evidence\b/i,
      /\bMiranda\s+Rights\b(?!\s+as\s+codified\s+in\s+PH)/i
    ]
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Jurisdiction Context Resolver
 */
const JurisdictionContextResolver = {
  resolve: (): string => {
    return (process.env as any).APP_JURISDICTION || 'PH';
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Jurisdiction Guardrail
 */
const JurisdictionGuardrail = {
  checkRisk: (jurisdictionId: string, text: string): boolean => {
    const scope = JurisdictionScopeRegistry[jurisdictionId];
    if (!scope) return false;
    return scope.detectionPatterns.some(pattern => pattern.test(text));
  }
};

/**
 * INTERNAL ARCHITECTURAL LAYER: Output Schema Registry
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
    validator: (text) => 
      text.includes('<h1>') && 
      /<h3>\s*SYLLABUS OVERVIEW/i.test(text) && 
      /<h3>\s*I\.\s*BLACK-LETTER LAW/i.test(text) &&
      /<h3>\s*IV\.\s*RECOMMENDED READINGS/i.test(text),
    version: '1.2.0'
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

const OutputSchemaValidator = {
  validate: (text: string, schemaKey?: string): boolean => {
    if (!schemaKey || !OutputSchemaRegistry[schemaKey]) return true;
    return OutputSchemaRegistry[schemaKey].validator(text);
  }
};

const AuditLogger = {
  record: (event: any) => {
    console.debug('[GOVERNANCE-AUDIT]', event);
  }
};

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

const ModelRegistry: Record<string, { version: string, status: 'active', role: 'primary' }> = {
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
  executeShadow: async (requestId: string, modelId: string, contents: any, config: any) => {
    try {
      await InferenceAdapter.callModel({ model: modelId, contents, config });
    } catch (e) {}
  }
};

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

class InferenceGateway {
  static async invoke(params: {
    model: string,
    contents: any,
    config?: any,
    schemaKey?: string
  }): Promise<string> {
    const requestId = RequestCorrelator.generateId();
    const resolvedModel = ModelOrchestrator.resolveActiveModel(params.model);

    try {
      const response = await InferenceAdapter.callModel({
        model: resolvedModel.id,
        contents: params.contents,
        config: params.config
      });

      const textResponse = response.text || "";
      const validationResult = OutputSchemaValidator.validate(textResponse, params.schemaKey);
      
      AuditLogger.record({
        request_id: requestId,
        schema_version: params.schemaKey ? OutputSchemaRegistry[params.schemaKey]?.version : 'NONE',
        output_hash: IntegrityUtils.computeHash(textResponse),
        validation_result: validationResult ? 'PASS' : 'FAIL',
        timestamp: new Date().toISOString()
      });

      if (!validationResult) {
        throw new Error(`Output Validation Failed: Structural anomaly detected for ${params.schemaKey}.`);
      }

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
      systemInstruction: "You are a senior Philippine legal consultant. Provide detailed legal commentary in HTML using <h3> and <p> tags."
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
      }
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
      systemInstruction: "Format as HTML with bold headings for FACTS, ISSUE, and RULING."
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
      systemInstruction: "Return <li> items with <strong> headlines and summaries."
    }
  });
}

export async function generateLawSyllabus(topic: string, profile: string): Promise<string> {
  return await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: `Synthesize a comprehensive book-grade study module for: ${topic}. Targeted at: ${profile}.`,
    schemaKey: 'JD_MODULE_HTML',
    config: {
      systemInstruction: `Act as an elite Philippine Law Professor and Syllabus Director.
      Output a definitive legal review module in HTML.
      
      REQUIREMENTS:
      1. Start with <h1>TOPIC TITLE</h1>.
      2. Use <div class="headnote"><h3>SYLLABUS OVERVIEW</h3><p>...</p></div> for the intro.
      3. Use <h3>I. BLACK-LETTER LAW</h3> for main provisions. Wrap codal text in <div class="statute-box">...</div>.
      4. Use <h3>II. JURISPRUDENTIAL DOCTRINES</h3> for landmark cases with bolded Ratio Decidendi.
      5. Use <h3>III. BAR-RELEVANT SYNTHESIS</h3> for integration tips.
      6. Use <h3>IV. RECOMMENDED READINGS</h3> to list authoritative textbooks (Cruz, Bernas, Tolentino).
      
      TYPOGRAPHY RULES:
      - Maintain academic tone. 
      - Use professional legal terminology. 
      - Ensure clear hierarchical subheadings (h4 for sub-topics).`
    }
  });
}

export async function generateContract(mode: 'TEMPLATE' | 'CUSTOM', prompt: string, data: any): Promise<string> {
  const context = mode === 'TEMPLATE' 
    ? `Draft a contract for ${prompt} using: ${JSON.stringify(data)}`
    : `Draft a custom contract based on: ${prompt}`;
  return await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: context,
    schemaKey: 'CONTRACT_HTML'
  });
}

export async function generateJDModuleContent(code: string, title: string): Promise<string> {
  return await InferenceGateway.invoke({
    model: 'gemini-3-pro-preview',
    contents: `Draft a JD Program study guide for ${code}: ${title}`,
    schemaKey: 'JD_MODULE_HTML',
    config: {
      systemInstruction: `You are an elite Philippine Law Professor.
      Format the output in HTML.
      REQUIRED STRUCTURE:
      1. Start with <h1>Title</h1>
      2. Use <h3>SYLLABUS OVERVIEW</h3> for the introduction.
      3. Use <h3>I. BLACK-LETTER LAW</h3> for main provisions.
      4. Use <h3>II. JURISPRUDENTIAL DOCTRINES</h3> for landmark cases.
      5. Use <h3>III. BAR-RELEVANT SYNTHESIS</h3> for review tips.
      6. Use <h3>IV. RECOMMENDED READINGS</h3> to list authoritative textbooks.`
    }
  });
}
