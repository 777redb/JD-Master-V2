
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
  const isAdvanced = profile.toLowerCase().includes('bar') || profile.toLowerCase().includes('lawyer') || profile.toLowerCase().includes('senior');
  
  // -- ADVANCED / BAR REVIEWEE STRATEGY --
  // Focus: Exceptions, Jurisprudential Shifts, Bar Traps, Remedial Integration
  const advancedStrategy = `
    **ROLE:** You are a **Bar Review Director** and **Senior Legal Editor**.
    **AUDIENCE:** ${profile} (Advanced/Bar Candidates). They know the basics. Do NOT give them generic definitions.
    **TASK:** Write a **Premium Reviewer Chapter** on "${topic}".
    **TONE:** Authoritative, high-density, jurisprudential, and analytical.
    
    **MANDATORY CONTENT REQUIREMENTS:**
    1.  **DEPTH OVER BREADTH:** Do not summarize. Elaborate on the *nuances*.
    2.  **JURISPRUDENCE HEAVY:** You MUST cite at least 4-6 specific Supreme Court cases (include G.R. Nos. where possible). Explain *why* the doctrine applies.
    3.  **EXCEPTIONS TO THE RULE:** Devote at least 30% of the content to exceptions, qualifications, and "Bar Exam Traps".
    4.  **CONFLICTING DOCTRINES:** If applicable, discuss the evolution of the rule (Old Rule vs. New Rule).
    5.  **REMEDIAL INTEGRATION:** Explain the procedural aspect (Jurisdiction, Evidence, Pleadings) related to this substantive topic.
    
    **STRUCTURE (HTML):**
    <h1>${topic.toUpperCase()}</h1>
    <hr />
    
    <h3>I. DOCTRINAL CORE & NUANCES</h3>
    <p>[Deep dive into the specific legal provision. Go beyond the text. Explain the "Verba Legis" vs "Ratio Legis".]</p>
    
    <h3>II. THE "GENERAL RULE" VS. EXCEPTIONS</h3>
    <p>[State the general rule briefly, then EXPAND HEAVILY on the exceptions. Use bullet points for exceptions.]</p>
    <ul>
      <li><strong>Exception 1:</strong> [Detailed explanation with case citation]</li>
      <li><strong>Exception 2:</strong> [Detailed explanation with case citation]</li>
    </ul>

    <h3>III. CRITICAL JURISPRUDENCE (MUST KNOW)</h3>
    <p>The Supreme Court has clarified this doctrine in the following landmark cases:</p>
    <blockquote>
       <strong>[Case Name 1]</strong><br/>
       "[Insert the specific controlling doctrine/ruling here. Not just the facts, but the legal principle.]"
    </blockquote>
    <blockquote>
       <strong>[Case Name 2]</strong><br/>
       "[Insert the specific controlling doctrine/ruling here.]"
    </blockquote>

    <h3>IV. BAR EXAM TRAPS & DISTINCTIONS</h3>
    <p>[Identify common confusing concepts. Distinguish them clearly.]</p>
    <table>
       <thead><tr><th>Concept A</th><th>Concept B</th><th>Distinction</th></tr></thead>
       <tbody><tr><td>...</td><td>...</td><td>...</td></tr></tbody>
    </table>

    <h3>V. PROCEDURAL & PRACTICAL APPLICATION</h3>
    <p>[How is this applied in court? What are the evidentiary requirements? Which court has jurisdiction?]</p>
  `;

  // -- FOUNDATIONAL / FRESHMAN STRATEGY --
  // Focus: Rationale, Elements, Definitions, Illustrations
  const foundationalStrategy = `
    **ROLE:** You are a **Professor of Law** and **Book Author**.
    **AUDIENCE:** ${profile} (Freshman/Foundational). They need clarity and structure.
    **TASK:** Write a **Comprehensive Textbook Chapter** on "${topic}".
    **TONE:** Didactic, clear, explanatory, and illustrative.
    
    **MANDATORY CONTENT REQUIREMENTS:**
    1.  **CLARITY FIRST:** Define every legal term used. Explain the Latin maxims.
    2.  **RATIO LEGIS:** Explain the *purpose* of the law. Why does it exist?
    3.  **ELEMENTS-BASED:** Break down the concept into its essential requisites/elements.
    4.  **ILLUSTRATIONS:** Provide concrete, real-world examples (hypothetical scenarios) for every major point.
    
    **STRUCTURE (HTML):**
    <h1>${topic.toUpperCase()}</h1>
    <hr />
    
    <h3>I. GENERAL CONCEPT & DEFINITION</h3>
    <p>[Define the concept in simple terms first, then provide the legal definition. Explain the etymology or history if relevant.]</p>
    
    <h3>II. THE PURPOSE OF THE LAW (RATIO LEGIS)</h3>
    <p>[Why did Congress enact this? What evil does it seek to prevent?]</p>

    <h3>III. ESSENTIAL REQUISITES (ELEMENTS)</h3>
    <p>For this law to apply, the following elements must be present:</p>
    <ul>
      <li><strong>Element 1: [Name]</strong> — [Explain what this means. Give an example.]</li>
      <li><strong>Element 2: [Name]</strong> — [Explain what this means. Give an example.]</li>
    </ul>

    <h3>IV. STATUTORY BASIS</h3>
    <div class="statute-box">
       <p><strong>[Article/Section Number]</strong></p>
       <p>[Verbatim Text of the Law]</p>
       <p><em>Professor's Note:</em> [Break down the difficult words in the provision.]</p>
    </div>

    <h3>V. ILLUSTRATIVE EXAMPLES</h3>
    <p><strong>Scenario A:</strong> [Give a simple facts scenario]</p>
    <p><strong>Answer:</strong> [Explain the answer using the elements above.]</p>
  `;

  const selectedStrategy = isAdvanced ? advancedStrategy : foundationalStrategy;

  const prompt = `
    ${selectedStrategy}

    **UNIVERSAL FORMATTING RULES (STRICT):**
    1.  **HTML ONLY:** Output pure HTML. No Markdown (\`\`\`).
    2.  **NO SUMMARIES:** This must be a **full chapter**. Target length: equivalent to 3-5 book pages.
    3.  **SEMANTIC TAGS:** Use <h3> for main headers, <h4> for sub-headers.
    4.  **PARAGRAPHS:** Use dense, well-structured paragraphs (5-8 sentences minimum). Do not write one-sentence paragraphs.
    5.  **INDENTATION:** Do NOT add non-breaking spaces. The CSS handles indentation.
    
    <div class="end-marker">*** END OF CHAPTER ***</div>
  `;
  
  return generateGeneralLegalAdvice(prompt);
};
