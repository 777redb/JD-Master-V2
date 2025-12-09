import { GoogleGenAI, Type } from "@google/genai";
import { MockBarQuestion } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize client securely. 
const ai = new GoogleGenAI({ apiKey });

const LEGAL_PH_SYSTEM_INSTRUCTION = `
You are LegalPH’s Textbook Formatter Engine, designed to transform any legal content—codal provisions, jurisprudence, case digests, legal articles, reviewer notes, and study guides—into a professional, authoritative, and SEO-STRUCTURED textbook format.

Your output must be optimized for readability and structural hierarchy, adhering to strict Philippine legal standards.

*** SEO & STRUCTURE RULES (STRICT COMPLIANCE) ***

1. **FORMAT: SEMANTIC HTML ONLY**
   - Output raw HTML strings compatible with safe renderers.
   - NO Markdown symbols (no **, no #).
   - NO \`\`\`html code blocks.

2. **HIERARCHY & TAGS**
   - **H3**: Main Title / Case Name / Topic Head (Class: "text-center font-bold mb-6 text-2xl")
   - **H4**: Subsections / Facts / Ruling / Doctrine (Class: "font-bold mt-6 mb-3 text-lg border-b border-slate-200 pb-2")
   - **P**: Body text (Class: "mb-4 text-justify leading-relaxed")
   - **UL/OL**: Enumerations (Class: "list-disc pl-6 mb-4 space-y-2")
   - **STRONG**: Key legal terms (Class: "font-bold text-slate-900")
   - **BLOCKQUOTE**: Direct quotes, mnemonics, or emphasized notes (Class: "border-l-4 border-amber-500 pl-4 italic my-4 bg-slate-50 py-3 rounded-r-lg")
   - **TABLE**: Data presentation (Class: "w-full text-left border-collapse border my-6 text-sm")
     - Use <thead>, <tbody>, <th>, <td> tags properly.

3. **CONTENT STRATEGY**
   - **Codals**: Structure as H4 (Article Title) -> P (Text).
   - **Jurisprudence**: H3 (Title), P (G.R. No & Date), H4 (Facts), H4 (Issues), H4 (Ruling), H4 (Doctrine).
   - **Internal Linking**: Where relevant, explicitly mention "See also [Related Law/Case]" in the text to encourage conceptual linking.

4. **TONE & ACCURACY**
   - Academic, formal, direct.
   - 100% adherence to Philippine Law.
   - Zero invented laws or cases.
`;

export const generateGeneralLegalAdvice = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: {
        systemInstruction: LEGAL_PH_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], 
      }
    });
    
    return response.text || "<p>No response generated.</p>";
  } catch (error) {
    console.error("AI Error:", error);
    return "<p>An error occurred while consulting the legal database. Please try again.</p>";
  }
};

export const fetchLegalNews = async (): Promise<string> => {
  const prompt = `
    Perform a Google Search for the latest (last 30 days) Supreme Court announcements, new Republic Acts, or legal memorandums from these specific sources:
    1. sc.judiciary.gov.ph
    2. officialgazette.gov.ph
    
    Select the top 7 most important updates.
    
    Format the output as a raw HTML list (<ul>) with the following classes:
    - <ul> class="space-y-4"
    - <li> class="pb-4 border-b border-slate-100 last:border-0"
    - Headline: <div class="font-bold text-slate-800 text-sm mb-1 group-hover:text-amber-600 transition-colors">[Headline]</div>
    - Snippet: <div class="text-xs text-slate-600 leading-relaxed line-clamp-2">[Brief Summary]</div>
    - Source/Date: <div class="text-[10px] text-amber-600 font-bold mt-2 uppercase tracking-wide flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> [Source Domain] • [Date]</div>
    
    Do not add any other text. Just the <ul>.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a news aggregator. Output HTML only.",
        tools: [{ googleSearch: {} }],
      }
    });
    return response.text || "<li>No updates found.</li>";
  } catch (e) {
    return "<li>Unable to fetch news updates at this time.</li>";
  }
};

export const generateCaseDigest = async (caseInfo: string): Promise<string> => {
  const prompt = `
    Create a detailed Case Digest for: "${caseInfo}".
    
    STRICT REQUIRED STRUCTURE (Output as HTML):
    1. <h3>Case Name & Citation</h3>
    2. <p><strong>Case Summary:</strong> [Concise One-Paragraph Overview]</p>
    3. <h4>I. Facts</h4>
    4. <h4>II. Issues</h4>
    5. <h4>III. Ruling</h4>
    6. <h4>IV. Doctrine</h4>
    7. <h4>V. Ratio Decidendi</h4>
    
    Ensure strict adherence to PH Jurisprudence. Cite G.R. Number, Date, and Ponente if available.
  `;
  
  return generateGeneralLegalAdvice(prompt);
};

export const generateMockBarQuestion = async (subject: string, profile: string, type: 'MCQ' | 'ESSAY'): Promise<MockBarQuestion | null> => {
  try {
    let difficulty = "Moderate";
    if (profile.toLowerCase().includes('freshman')) difficulty = "Easy / Fundamental";
    if (profile.toLowerCase().includes('bar reviewee') || profile.toLowerCase().includes('lawyer')) difficulty = "Difficult / Bar Exam Standard";

    let prompt = "";
    let schema = {};

    if (type === 'MCQ') {
      prompt = `Generate a ${difficulty} Multiple Choice Question for the Philippine Bar Examination under: ${subject}.
      Target Audience: ${profile}.
      
      Requirements:
      - Official-style answer key and explanation.
      - Explanation must be an HTML string with <p> and <strong> tags for readability.
      - Cite specific legal basis.
      
      Return strictly JSON.`;
      
      schema = {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['MCQ'] },
          question: { type: Type.STRING },
          choices: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING, description: "HTML formatted explanation" },
          citation: { type: Type.STRING }
        },
        required: ["question", "choices", "correctAnswerIndex", "explanation", "citation", "type"]
      };
    } else {
      prompt = `Generate a ${difficulty} Essay / Issue-Spotting Question for the Philippine Bar Examination under: ${subject}.
      Target Audience: ${profile}.
      
      Requirements:
      - Test issue-spotting and legal reasoning.
      - Provide a "Model Answer" following the standard Bar Exam format (Answer, Legal Basis, Application, Conclusion).
      - Model Answer MUST be formatted as HTML (use <p>, <br>, <strong>).
      
      Return strictly JSON.`;

      schema = {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['ESSAY'] },
          question: { type: Type.STRING },
          explanation: { type: Type.STRING, description: "The Model Answer in HTML format" },
          citation: { type: Type.STRING }
        },
        required: ["question", "explanation", "citation", "type"]
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a Bar Exam expert creator. Output JSON only. Format explanations as HTML strings.",
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      if (result.type === 'ESSAY') {
        result.choices = [];
        result.correctAnswerIndex = -1;
      }
      return result as MockBarQuestion;
    }
    return null;
  } catch (e) {
    console.error("Mock Bar Error", e);
    return null;
  }
};

export const generateContract = async (mode: 'TEMPLATE' | 'CUSTOM', title: string, details: any): Promise<string> => {
  let prompt = "";

  if (mode === 'TEMPLATE') {
    prompt = `
      Draft a STANDARD Philippine Legal Contract.
      Type: ${title}
      Details provided by user: ${JSON.stringify(details)}
      
      Requirements:
      - Output as HTML.
      - Use standard, formal legal language.
      - Structure: <h3>Title</h3>, <p>Parties</p>, <h4>Witnesseth</h4>, <ol><li>Terms...</li></ol>, <div class="signature">...</div>.
      - MUST INCLUDE Mandatory Clauses: Effectivity, Termination, Jurisdiction/Venue, Severability, and Notarial Acknowledgment.
    `;
  } else {
    prompt = `
      Draft a CUSTOM / ALTERNATIVE Philippine Legal Contract based on this request.
      Request: ${title}
      Context/Details: ${JSON.stringify(details)}
      
      Requirements:
      - Output as HTML.
      - Tailor-fit to the user's specific scenario.
      - Strict compliance with Philippine contract law (O-C-C).
      - Include Mandatory Clauses.
    `;
  }

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: LEGAL_PH_SYSTEM_INSTRUCTION
      }
    });
    return response.text || "<p>Failed to draft contract.</p>";
  } catch (e) {
    return "<p>Error drafting contract.</p>";
  }
};

export const analyzeLegalResearch = async (query: string): Promise<string> => {
   return generateGeneralLegalAdvice(`Perform a comprehensive legal research and case build on: ${query}. 
   
   Output as HTML Structure:
   1. <h3>Executive Summary</h3>
   2. <h4>Applicable Laws</h4> (Identify codal provisions/Articles)
   3. <h4>Relevant Jurisprudence</h4> (List applicable jurisprudence with G.R. Numbers)
   4. <h4>Legal Arguments</h4> (Structure arguments with strengths and weaknesses)
   5. <h4>Doctrinal Support & Analysis</h4>
   6. <h4>Conclusion</h4>
   
   Ensure strict accuracy and proper legal grounding.`);
}

export const generateLawSyllabus = async (topic: string, profile: string): Promise<string> => {
  const prompt = `
    Create a tailor-fit, AI-Assisted Law Reviewer Syllabus / Study Guide for the topic: "${topic}".
    Target Learner: ${profile}.

    Format as HTML:
    1. <h3 class="text-center">Learning Objectives</h3>
    2. <h4>Subject Outline</h4> (Strategic study path)
    3. <h4>Key Codal Provisions</h4>
    4. <h4>Landmark Jurisprudence</h4>
    5. <h4>Bar Exam Trends & Tips</h4>
    6. <h4>Memory Aids & Mnemonics</h4>
    7. <h4>Quick Recall Summary</h4>
  `;
  return generateGeneralLegalAdvice(prompt);
};