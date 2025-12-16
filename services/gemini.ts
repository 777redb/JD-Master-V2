
import { GoogleGenAI, Type } from "@google/genai";
import { MockBarQuestion } from "../types";

// Helper to get client with latest key
const getAi = () => {
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

// Helper to handle errors and retries with key selection
async function withErrorHandling<T>(
  operation: (ai: GoogleGenAI) => Promise<T>, 
  fallback: T
): Promise<T> {
  try {
    const ai = getAi();
    return await operation(ai);
  } catch (error: any) {
    // Check for quota (429) or auth errors
    const isQuotaError = error.status === 429 || 
                         (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));
    
    // Cast window to any to access aistudio which might have conflicting global types
    const win = window as any;

    if (isQuotaError && win.aistudio) {
      try {
        console.log("Quota exceeded, triggering key selection...");
        await win.aistudio.openSelectKey();
        // Retry immediately with the new key (instantiate new client)
        const aiRetry = getAi();
        return await operation(aiRetry);
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        return fallback;
      }
    }
    
    console.error("AI Error:", error);
    return fallback;
  }
}

const LEGAL_PH_SYSTEM_INSTRUCTION = `
You are the **LegalPH Readability & Formatting Engine**.
Your task is to transform ALL generated legal content—codals, jurisprudence, case digests, reviewer chapters, case-build outputs, contracts, and articles—into **highly readable, professionally typeset, book-quality text**, consistent throughout the entire LegalPH ecosystem.

You must present information with **perfect structural clarity**, using consistent rules for:
* Typography
* Margins
* Spacing
* Hierarchical headings
* Chapter structuring
* Section breaks
* Numbering
* Visual element placeholders

Your formatting must be compatible with the existing LegalPH UI and must render cleanly in 'dangerouslySetInnerHTML' without modifying the application’s architecture, CSS, or typography system.

# 1. **Typography Standards (Content-Level Only)**

Your generated output must follow these rules:

### **Font & Typography**
* Use a **serif typeface style** (book-like) in content (the UI already handles font-family; you just generate clean HTML semantics).
* Use proper typographic punctuation:
  * Curly quotes
  * En-dashes and em-dashes
  * Proper ellipses
* Ensure consistent **emphasis rules**:
  * Italics for doctrines, case names, special terms
  * Bold only for section titles or key legal points

### **Readable Text Flow**
* Avoid long unbroken blocks.
* Use paragraphs of 3–6 lines for ideal readability.
* Ensure proper transitions between ideas.

# 2. **Spacing, Margins, and Paragraph Structure**

All generated text must simulate the spacing of a legal textbook:

### **Margins (simulated via spacing rules)**
* Add comfortable whitespace before major headings.
* Use consistent vertical rhythm:
  * 1 line space before H2 headings
  * 0.75 line space before H3
  * 2 lines before chapter titles

### **Line Spacing**
Represent 1.5 book-style line spacing by:
* Avoiding crammed paragraphs
* Adding sufficient paragraph breaks

### **Paragraph Indentation**
* **Do NOT indent** paragraphs with special characters or HTML; instead begin each paragraph with:
  * A clear topic sentence
  * Natural separation via blank lines

# 3. **Section Structuring Rules**

All generated content must be formatted like a professional legal publication.

### **Core Section Layout**
Use a hierarchical structure like:

<h3>CHAPTER TITLE (H3)</h3>
<p>Short introductory paragraph.</p>

<h4>I. Section Heading (H4)</h4>
<p>Short section introduction.</p>

<p><strong>A. Subsection Heading</strong></p>
<p>Detailed content.</p>

<ol>
  <li>Numbered paragraph
    <p>Explanations, steps, or legal doctrine.</p>
  </li>
</ol>

### **Key Rules**
* Never skip heading levels.
* Use consistent numbering for legal analysis:
  * I, II, III → Roman numerals for major sections (H4)
  * A, B, C → Subsections
  * 1, 2, 3 → Steps or key points

# 4. **Chapter Breaks & Section Dividers**

When generating long-form content (reviewers, jurisprudence compilations, legal commentary):

### **Chapter Break Format**
Begin a new chapter with:
<hr />
<h3>CHAPTER [Number]: [Chapter Title]</h3>
<hr />
<p>Introductory overview paragraph...</p>

### **Section Dividers**
Between major conceptual blocks use <hr />

# 5. **Visual Elements (Text-Compatible Only)**

For diagrams, flowcharts, tables, or case-maps that cannot render naturally:

### **Use structured placeholders:**

**Table:**
<table>
  <thead><tr><th>Column 1</th><th>Column 2</th></tr></thead>
  <tbody><tr><td>Data 1</td><td>Data 2</td></tr></tbody>
</table>

**Diagram:**
<blockquote>[Diagram: Liability Flow – Offender → Act → Damage]</blockquote>

# 6. **Formatting Rules for Specific LegalPH Outputs**

### **Codal Text**
* Present articles as:
  <h4>ARTICLE 315. – Estafa</h4>
  <p>[Statutory text...]</p>
* Use consistent indentation and spacing.
* Maintain fidelity to official text.

### **Case Digest**
ALWAYS begin with a **case summary** before the full structure.

<p><strong>CASE SUMMARY</strong></p>
<p>One-paragraph overview...</p>

<h4>I. Facts</h4>
<h4>II. Issues</h4>
<h4>III. Ruling</h4>
<h4>IV. Doctrine</h4>

### **Jurisprudence**
* Use clear citation formatting.
* Italicize case titles.
* Use block-style quotes for excerpts.

### **Contract Drafting**
* Use numbered articles.
* Use consistent clause spacing.
* Add section dividers between major parts.

# 7. **Output Requirements (Non-Negotiable)**

All generated text must be:
* Clean, professional, and book-like.
* Textbook-readable on mobile or desktop.
* Structured with proper hierarchy (H3, H4, P, UL/OL).
* Free of casual or informal tone.
* Typographically consistent.
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
  }, "<p>Unable to retrieve legal information. Please check your API key quota or internet connection.</p>");
};

export const fetchLegalNews = async (): Promise<string> => {
  const prompt = `
    Perform a Google Search for the latest (last 30 days) Supreme Court announcements, new Republic Acts, or legal memorandums from these specific sources:
    1. sc.judiciary.gov.ph
    2. officialgazette.gov.ph
    
    Select the top 12 most important updates.
    
    Format the output as a raw HTML list (<ul>) with the following classes:
    - <ul> class="space-y-4"
    - <li> class="pb-4 border-b border-slate-100 last:border-0"
    - Wrap the content in an anchor tag pointing to the source URL: <a href="[Source Link]" target="_blank" rel="noopener noreferrer" class="block group">
      - Headline: <div class="font-bold text-slate-800 text-sm mb-1 group-hover:text-amber-600 transition-colors">[Headline]</div>
      - Snippet: <div class="text-xs text-slate-600 leading-relaxed line-clamp-2">[Brief Summary]</div>
      - Source/Date: <div class="text-[10px] text-amber-600 font-bold mt-2 uppercase tracking-wide flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> [Source Domain] • [Date]</div>
    - </a>
    
    Do not add any other text. Just the <ul>.
  `;

  return withErrorHandling(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a news aggregator. Output HTML only.",
        tools: [{ googleSearch: {} }],
      }
    });
    return response.text || "<li>No updates found.</li>";
  }, "<li>Unable to fetch news updates at this time.</li>");
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

export const getCaseSuggestions = async (query: string): Promise<string[]> => {
  if (query.length < 3) return [];
  
  const prompt = `
    List 5 specific, real Philippine Supreme Court case titles that start with or contain: "${query}".
    Return ONLY a JSON array of strings. Example: ["Chi Ming Tsoi v. CA", "Chavez v. JBC"].
    Do not invent cases. If none found, return empty array.
  `;

  return withErrorHandling(async (ai) => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Use flash for speed
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  }, []);
};

export const generateMockBarQuestion = async (subject: string, profile: string, type: 'MCQ' | 'ESSAY'): Promise<MockBarQuestion | null> => {
  return withErrorHandling(async (ai) => {
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
  }, null);
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

  return withErrorHandling(async (ai) => {
     const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: LEGAL_PH_SYSTEM_INSTRUCTION
      }
    });
    return response.text || "<p>Failed to draft contract.</p>";
  }, "<p>Error drafting contract.</p>");
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
  // Determine sophistication level based on profile
  const isAdvanced = profile.toLowerCase().includes('bar') || profile.toLowerCase().includes('lawyer') || profile.toLowerCase().includes('senior');
  
  let instructions = "";
  let structure = "";

  if (isAdvanced) {
    instructions = `
      **Target Audience:** ${profile} (Advanced Level).
      **Approach:** Act as a Bar Review Director. 
      **Goal:** Create a high-yield, dense reviewer module.
      **Strict Rules:**
      1. **NO FLUFF.** Do not define basic terms unless necessary for distinction.
      2. **FOCUS:** Focus on **Exceptions to the Rule**, **Conflicting Doctrines**, **Recent Jurisprudence (2015-Present)**, and **Remedial Complexities**.
      3. **DEPTH:** Minimum 2000 words equivalent.
    `;
    structure = `
      <h1>${topic.toUpperCase()} (ADVANCED REVIEWER)</h1>
      <p><strong>Focus:</strong> High-Yield Bar Topics & Jurisprudential Updates</p>
      <hr />

      <h3>I. DOCTRINAL REFRESHER & NUANCES</h3>
      <p>[Briefly state the general rule, then immediately pivot to the <strong>Exceptions</strong> and <strong>Qualifications</strong>. Cite specific provisions.]</p>
      
      <h3>II. JURISPRUDENTIAL EVOLUTION</h3>
      <p>[Analyze how the Supreme Court's interpretation has shifted. Compare old vs. new rulings.]</p>
      <ul>
         <li><strong><em>Old Doctrine:</em></strong> [Case Name]</li>
         <li><strong><em>Controlling Doctrine:</em></strong> [Case Name] - [Explain the shift]</li>
      </ul>

      <h3>III. COMPLEX SCENARIOS & BAR TRAPS</h3>
      <p>[Present complex hypothetical scenarios often found in Bar Exams. Explain the solution using the "Legal Basis - Application - Conclusion" format.]</p>

      <h3>IV. REMEDIAL LAW INTEGRATION</h3>
      <p>[Explain the procedural aspects relevant to this substantive topic (e.g., Jurisdiction, Pleadings, Evidence required).]</p>
    `;
  } else {
    // Freshman / Junior
    instructions = `
      **Target Audience:** ${profile} (Foundational Level).
      **Approach:** Act as a Professor of Law. 
      **Goal:** Create a comprehensive, textbook-style chapter.
      **Strict Rules:**
      1. **CLARITY:** Define every legal term. Explain the "Why" (Ratio Legis).
      2. **BASICS:** Focus on **Statutory Construction**, **Verba Legis**, **Elements/Requisites**, and **Illustrative Examples**.
      3. **DEPTH:** Minimum 1500 words equivalent.
    `;
    structure = `
      <h1>${topic.toUpperCase()} (FOUNDATIONAL MODULE)</h1>
      <p><strong>Scope:</strong> Comprehensive Analysis for Law Students</p>
      <hr />

      <h3>I. GENERAL CONCEPT & RATIONALE</h3>
      <p>[Define the concept clearly. Explain the "Why" (Ratio Legis). What is the purpose of this law?]</p>

      <h3>II. ESSENTIAL ELEMENTS (REQUISITES)</h3>
      <p>For this law to apply, the following elements must concur. Memorize these:</p>
      <ul>
         <li><strong>Element 1: [Name]</strong> — [Detailed explanation with simple example]</li>
         <li><strong>Element 2: [Name]</strong> — [Detailed explanation with simple example]</li>
      </ul>

      <h3>III. STATUTORY BASIS (CODAL PROVISIONS)</h3>
      <div class="statute-box">
         <p><strong>[Primary Article/Section]</strong></p>
         <p>[Verbatim Text of the Law]</p>
         <p><em>Professor's Annotation:</em> [Break down the legalese into plain English.]</p>
      </div>

      <h3>IV. ILLUSTRATIVE CASES</h3>
      <p>How does the Supreme Court apply this?</p>
      <blockquote>
         <strong>[Case Name]</strong><br/>
         "[Key Ruling/Doctrine. Keep it focused on the application of the elements.]"
      </blockquote>
    `;
  }

  const prompt = `
    Act as the **Editor-in-Chief of a Premium Philippine Law Publishing House**.
    
    **Task:** Write a **Reviewer Module** on: "${topic}".
    ${instructions}

    **STRICT HTML FORMATTING RULES:**
    1. Use semantic HTML (h1, h3, p, ul, li, blockquote).
    2. **NO Markdown** (no ** or ##). Use <strong> for bold, <em> for italics.
    3. **Paragraphs:** Must be substantial (5-8 sentences). Do NOT write one-sentence paragraphs.
    4. **Indentation:** Do NOT add spaces/tabs in HTML. The CSS handles indentation.
    
    **REQUIRED STRUCTURE:**
    ${structure}

    <h3>V. DISTINCTIONS</h3>
    <p>[Distinguish from similar concepts (e.g., Theft vs Estafa). Use a table.]</p>
    <table>
       <thead><tr><th>Concept A</th><th>Concept B</th></tr></thead>
       <tbody><tr><td>[Diff 1]</td><td>[Diff 1]</td></tr></tbody>
    </table>
    
    <div class="end-marker">*** END OF MODULE ***</div>
  `;
  
  return generateGeneralLegalAdvice(prompt);
};
