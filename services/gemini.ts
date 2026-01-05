
import { GoogleGenAI, Type, GenerateContentParameters, GenerateContentResponse } from "@google/genai";
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
    validator: (text) => /High-Level Case Summary/i.test(text) && /Case Title and G.R. Nos./i.test(text) && /Ponente/i.test(text) && /Facts/i.test(text) && /Ruling/i.test(text) && /Case Analysis/i.test(text),
    version: '2.5.0'
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
  static async invokeWithGrounding(params: {
    model: string,
    contents: any,
    config?: any,
    schemaKey?: string
  }): Promise<{ text: string, groundingChunks?: any[] }> {
    const requestId = RequestCorrelator.generateId();
    
    try {
      const response = await InferenceAdapter.callModel({
        model: params.model,
        contents: params.contents,
        config: params.config
      });

      let textResponse = response.text || "";

      if (textResponse.includes('```')) {
        textResponse = textResponse.replace(/^```(?:html|markdown|json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      }

      const validationResult = OutputSchemaValidator.validate(textResponse, params.schemaKey);
      
      AuditLogger.record({
        request_id: requestId,
        schema_version: params.schemaKey ? OutputSchemaRegistry[params.schemaKey]?.version : 'NONE',
        output_hash: IntegrityUtils.computeHash(textResponse),
        validation_result: validationResult ? 'PASS' : 'FAIL',
        timestamp: new Date().toISOString()
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

      return { text: textResponse, groundingChunks };
    } catch (err) {
      throw err;
    }
  }
}

/**
 * PUBLIC EXPORTS: LEGAL SERVICE LAYER
 */

export async function generateGeneralLegalAdvice(prompt: string): Promise<string> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    schemaKey: 'GENERAL_LEGAL_HTML',
    config: {
      systemInstruction: "You are a senior Philippine legal consultant. Provide detailed legal commentary in HTML using <h3> and <p> tags."
    }
  });
  return result.text;
}

export async function generateMockBarQuestion(subject: string, profile: string, examType: 'MCQ' | 'ESSAY'): Promise<MockBarQuestion> {
  const result = await InferenceGateway.invokeWithGrounding({
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
  return JSON.parse(result.text);
}

export async function generateCaseDigest(
  query: string, 
  fileData?: { data: string, mimeType: string }
): Promise<{ text: string, sources?: any[] }> {
  
  const contentParts: any[] = [];
  
  if (fileData) {
    contentParts.push({
      inlineData: {
        data: fileData.data,
        mimeType: fileData.mimeType
      }
    });
  }
  
  contentParts.push({
    text: `STRICT FACTUAL CASE DIGESTION REQUEST BASED ON PREMIUM BOOK-GRADE TEMPLATE:
    1. ANALYZE INPUT FOR ABSOLUTE FACTUAL ACCURACY.
    2. CROSS-VERIFY with Philippine Reports (https://elibrary.judiciary.gov.ph/philippinereports) and SC Decisions (https://sc.judiciary.gov.ph/decisions-and-resolutions/).
    3. TARGET CASE: ${query}
    
    REQUIRED STRUCTURE (HTML ONLY):
    1. <h3>High-Level Case Summary</h3>: A summary paragraph highlighting the case's core significance and the Court's major action.
    2. <h3>Case Title and G.R. Nos.</h3>: Full title (e.g., PETITIONER vs. RESPONDENTS) and associated G.R. Nos. in a list.
    3. <h3>Ponente</h3>: The name of the Justice (e.g., LEONEN, S.A.J.).
    4. <h3>Date Promulgated</h3>: Full date (e.g., July 25, 2025).
    5. <h3>Relevant Constitutional Provisions</h3>: Use <div class="statute-box">...</div> for citations of the Constitution or statutes.
    6. <h3>Facts</h3>: Material facts of the case, narrated with precision. Use <p> with 2.5em indention.
    7. <h3>Issues</h3>: Bulleted list of the specific legal questions resolved.
    8. <h3>Ruling</h3>: The Court's final judgment (e.g., THE PETITION IS GRANTED).
    9. <h3>Ratio Decidendi</h3>: For each issue:
       - <h4>[No]. [Issue Title]</h4>
       - <strong>Categorical Answer</strong>: Yes/No/Partially.
       - <strong>Legal Basis</strong>: Cite the specific provision/doctrine.
       - <strong>Application</strong>: How the law applies to the facts.
       - <strong>Conclusion</strong>: Summary of the reasoning.
    10. <h3>Relevant Case(s)</h3>: List landmark cases cited in the decision (e.g., Francisco vs. House of Representatives).
    11. <h3>Case Analysis</h3>: A scholar-level analysis of how this case changes or reinforces current jurisprudence.
    12. <h3>Dispositive Portion</h3>: Verbatim "ACCORDINGLY..." or "WHEREFORE..." section.
    13. Finish with center-aligned <strong>SO ORDERED.</strong>`
  });

  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: { parts: contentParts },
    schemaKey: 'CASE_DIGEST_HTML',
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: `You are a Senior Supreme Court Reporter. Matching the provided high-fidelity sample is mandatory.
      Output HTML must follow the hierarchical structure with specific formatting: 
      - Use <h3> and <h4> for headers.
      - Use 2.5em paragraph indention for Facts.
      - Use 'statute-box' class for provisions.
      - Use 'categorical-answer' format for Ratio.
      - ZERO HALLUCINATION POLICY.`
    }
  });
  
  return { text: result.text, sources: result.groundingChunks };
}

export async function getCaseSuggestions(input: string): Promise<string[]> {
  const result = await InferenceGateway.invokeWithGrounding({
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
  return JSON.parse(result.text);
}

export async function analyzeLegalResearch(query: string): Promise<string> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: query,
    schemaKey: 'GENERAL_LEGAL_HTML',
    config: {
      systemInstruction: "You are a legal research director. Provide a comprehensive strategy in HTML with citations."
    }
  });
  return result.text;
}

export async function fetchLegalNews(): Promise<string> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-flash-preview',
    contents: "Retrieve 5 recent legal updates in the Philippines.",
    schemaKey: 'LEGAL_NEWS_LIST',
    config: {
      systemInstruction: "Return <li> items with <strong> headlines and summaries."
    }
  });
  return result.text;
}

export async function generateLawSyllabus(topic: string, profile: string): Promise<string> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: `Synthesize a comprehensive book-grade study module for: ${topic}. Targeted at: ${profile}.`,
    schemaKey: 'JD_MODULE_HTML',
    config: {
      systemInstruction: `Act as an elite Philippine Law Professor and Syllabus Director.
      Output a definitive legal review module in HTML.
      STRUCTURE: 1. <h1>Title</h1> 2. <div class="headnote"><h3>SYLLABUS OVERVIEW</h3></div> 3. <h3>I. BLACK-LETTER LAW</h3> 4. <h3>II. JURISPRUDENTIAL DOCTRINES</h3> 5. <h3>III. BAR-RELEVANT SYNTHESIS</h3> 6. <h3>IV. RECOMMENDED READINGS</h3>.`
    }
  });
  return result.text;
}

export async function generateContract(mode: 'TEMPLATE' | 'CUSTOM', prompt: string, data: any): Promise<string> {
  const context = mode === 'TEMPLATE' 
    ? `Draft a contract for ${prompt} using: ${JSON.stringify(data)}`
    : `Draft a custom contract based on: ${prompt}`;
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: context,
    schemaKey: 'CONTRACT_HTML'
  });
  return result.text;
}

export async function generateJDModuleContent(code: string, title: string): Promise<string> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: `Draft a JD Program study guide for ${code}: ${title}`,
    schemaKey: 'JD_MODULE_HTML',
    config: {
      systemInstruction: `You are an elite Philippine Law Professor. Format in HTML. STRUCTURE: 1. <h1>Title</h1> 2. <h3>SYLLABUS OVERVIEW</h3> 3. <h3>I. BLACK-LETTER LAW</h3> 4. <h3>II. JURISPRUDENTIAL DOCTRINES</h3> 5. <h3>III. BAR-RELEVANT SYNTHESIS</h3> 6. <h3>IV. RECOMMENDED READINGS</h3>.`
    }
  });
  return result.text;
}
