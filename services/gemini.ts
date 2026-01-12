
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
    authorizedSources: ['1987 Constitution of the Republic of the Philippines', 'Philippine Reports', 'Official Gazette of the Philippines', 'Rules of Court'],
    forbiddenCaseLawSets: ['U.S. Supreme Court', 'Federal Rules of Evidence', 'U.S. Constitution', 'Common Law Doctrines'],
    detectionPatterns: [
      /\bU\.S\.\s+Supreme\s+Court\b/i,
      /\bSCOTUS\b/i,
      /\bCommon\s+Law\b(?!\s+principles\s+applied\s+in\s+PH)/i,
      /\bFederal\s+Rules\s+of\s+Evidence\b/i,
      /\bMiranda\s+Rights\b(?!\s+as\s+codified\s+in\s+PH)/i,
      /\bSecond\s+Amendment\b/i,
      /\bCommerce\s+Clause\b(?!\s+PH\s+equivalent)/i
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

      // ENHANCED CLEANUP: Aggressively strip conversational preambles and markdown blocks
      if (textResponse.includes('```')) {
        // Remove everything before and including the first code fence, and after the last fence
        textResponse = textResponse.replace(/^[\s\S]*?```(?:html|markdown|json)?\n?/i, '').replace(/\n?```[\s\S]*?$/i, '').trim();
      } else {
        // If no code fence but has HTML, strip everything before the first tag and after the last
        const firstTag = textResponse.indexOf('<');
        const lastTag = textResponse.lastIndexOf('>');
        if (firstTag !== -1 && lastTag !== -1 && lastTag > firstTag) {
           const snippet = textResponse.substring(firstTag, firstTag + 20).toLowerCase();
           // Only strip if the detected tags look like our structural tags
           if (snippet.includes('<h') || snippet.includes('<p') || snippet.includes('<div')) {
              textResponse = textResponse.substring(firstTag, lastTag + 1).trim();
           }
        }
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
      systemInstruction: "You are a senior Philippine legal consultant. Provide detailed legal commentary STRICTLY within the Philippine jurisdiction. NEVER use US/UK law. Output in HTML using <h3> and <p> tags."
    }
  });
  return result.text;
}

export async function generateMockBarQuestion(subject: string, profile: string, examType: 'MCQ' | 'ESSAY'): Promise<MockBarQuestion> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: `Generate a 2024 Philippine Bar Examination question for: ${subject}. STRICTLY following PH laws. Candidate level: ${profile}. Type: ${examType}.`,
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
    text: `STRICT PHILIPPINE CASE DIGESTION REQUEST:
    1. ANALYZE INPUT FOR ABSOLUTE FACTUAL ACCURACY WITHIN PH JURISPRUDENCE.
    2. TARGET CASE: ${query}
    
    REQUIRED STRUCTURE (HTML ONLY):
    1. <h3>High-Level Case Summary</h3>
    2. <h3>Case Title and G.R. Nos.</h3>
    3. <h3>Ponente</h3>
    4. <h3>Date Promulgated</h3>
    5. <h3>Relevant Constitutional Provisions</h3>
    6. <h3>Facts</h3>
    7. <h3>Issues</h3>
    8. <h3>Ruling</h3>
    9. <h3>Ratio Decidendi</h3>
    10. <h3>Case Analysis</h3>
    11. <div class="so-ordered">SO ORDERED.</div>`
  });

  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: { parts: contentParts },
    schemaKey: 'CASE_DIGEST_HTML',
    config: {
      tools: [{googleSearch: {}}],
      systemInstruction: "You are a senior Supreme Court reporter in the Philippines. Provide precise, zero-hallucination case digests using Philippine jurisprudence ONLY. NEVER refer to foreign laws."
    }
  });

  return { text: result.text, sources: result.groundingChunks };
}

export async function getCaseSuggestions(query: string): Promise<string[]> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-flash-preview',
    contents: `List 5 landmark Philippine Supreme Court cases or G.R. numbers related to: "${query}". Return as a simple JSON array of strings.`,
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

export async function fetchLegalNews(): Promise<{headline: string, summary: string, url: string}[]> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-flash-preview',
    contents: "Provide the 5 latest significant legal updates, Supreme Court bulletins, or new laws in the Philippines (2024-2025). Return ONLY a JSON array of objects.",
    schemaKey: 'JSON_ARRAY',
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            summary: { type: Type.STRING },
            url: { type: Type.STRING }
          },
          required: ['headline', 'summary', 'url']
        }
      },
      tools: [{googleSearch: {}}],
      systemInstruction: "You are a news aggregator for Philippine Law. Use Google Search to find verified updates from sc.judiciary.gov.ph or officialgazette.gov.ph."
    }
  });
  return JSON.parse(result.text);
}

export async function generateLawSyllabus(topic: string, profile: string): Promise<string> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: `
      Act as a Lead Law Professor. Synthesize a comprehensive PHILIPPINE Law Study Module for: "${topic}". 
      Jurisdiction Profile: ${profile}.
      
      STRICT OUTPUT REQUIREMENTS:
      - Use ONLY Semantic HTML tags (<h3>, <h4>, <p>, <blockquote>, <ul>, <li>).
      - NEVER use Markdown symbols like ### or **.
      - Ensure professional academic hierarchy.
      
      MANDATORY SECTIONS:
      1. <div class="headnote"><h3>MODULE OVERVIEW</h3><p>Synthesized summary for the candidate.</p></div>
      2. <h3>I. SYLLABUS OVERVIEW</h3><p>Scope and core objectives.</p>
      3. <h3>II. BLACK-LETTER LAW</h3><p>Deep statutory analysis.</p>
      4. <div class="statute-box"><strong>CODIFIED PROVISION:</strong><p>Quote the relevant Article/Section here.</p></div>
      5. <h3>III. JURISPRUDENTIAL APPLICATIONS</h3><p>Critical PH Supreme Court rulings.</p>
      6. <h3>IV. RECOMMENDED READINGS</h3><ul><li>Cite leading treatises.</li></ul>
      7. <div class="end-marker">*** END OF CHAPTER ***</div>
    `,
    schemaKey: 'JD_MODULE_HTML',
    config: {
      systemInstruction: "You are a senior Law Professor from a top Philippine University. Provide structured, academic-grade PH law reviewers. NEVER use US or foreign legal frameworks. Format strictly in Semantic HTML."
    }
  });
  return result.text;
}

export async function generateContract(mode: 'TEMPLATE' | 'CUSTOM', promptOrName: string, data: any): Promise<string> {
  const prompt = mode === 'TEMPLATE' 
    ? `Draft a formal Philippine legal contract for: ${promptOrName}. Details: ${JSON.stringify(data)}.`
    : `Draft a custom Philippine legal contract based on these instructions: ${promptOrName}.`;

  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    schemaKey: 'CONTRACT_HTML',
    config: {
      systemInstruction: "You are an expert legal draftsman specializing in Philippine Civil and Commercial law."
    }
  });
  return result.text;
}

export async function generateJDModuleContent(code: string, title: string): Promise<string> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: `Synthesize a detailed PHILIPPINE JD study module for ${code}: ${title}. 
    REQUIREMENTS: 
    - Base content EXCLUSIVELY on the Philippine legal system (1987 Constitution, RPC, Civil Code, PH Statutes). 
    - NEVER refer to US or UK laws. 
    - Synthesize the specific core strengths of UP (Policy), Ateneo (Practice), and San Beda (Discipline) traditions.
    - Include syllabus overview, black-letter law sections, PH case citations, and recommended readings. 
    - Use JD_MODULE_HTML format. 
    - Output Semantic HTML tags only.`,
    schemaKey: 'JD_MODULE_HTML',
    config: {
      systemInstruction: "You are a highly distinguished Law Dean from an integrated Philippine Law Center. You provide academic modules STRICTLY based on the Philippine legal system, Constitution, and Jurisprudence. Your pedagogical style synthesizes the traditions of UP Law (Critical Policy), Ateneo Law (Clinical Practice), and San Beda Law (Strict Discipline). UNDER NO CIRCUMSTANCES should you use US, UK, or other foreign laws as a primary basis. Output strictly Semantic HTML."
    }
  });
  return result.text;
}

export async function analyzeLegalResearch(prompt: string): Promise<string> {
  const result = await InferenceGateway.invokeWithGrounding({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    schemaKey: 'GENERAL_LEGAL_HTML',
    config: {
      systemInstruction: "You are a lead litigation strategist in the Philippines. Provide deep legal analysis and strategy in HTML based ONLY on PH procedure and law."
    }
  });
  return result.text;
}
