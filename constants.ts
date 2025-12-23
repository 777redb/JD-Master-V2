
import { LawCode, ContractTemplate, LawCategory, JDYear } from "./types";

export const JD_CURRICULUM: JDYear[] = [
  {
    year: 1,
    semesters: [
      {
        name: "First Semester: Foundations & Legal Thinking",
        subjects: [
          { code: "JD 111", title: "Constitutional Law I (State & Powers)", units: 4 },
          { code: "JD 112", title: "Civil Law I (Persons & Family Relations)", units: 4 },
          { code: "JD 113", title: "Criminal Law I (RPC Book I)", units: 3 },
          { code: "JD 114", title: "Legal Method & Jurisprudence", units: 2 },
          { code: "JD 115", title: "Legal Research & Writing I", units: 2 }
        ]
      },
      {
        name: "Second Semester: Statutory & Ethical Foundations",
        subjects: [
          { code: "JD 121", title: "Constitutional Law II (Rights & Liberties)", units: 4 },
          { code: "JD 122", title: "Civil Law II (Property)", units: 4 },
          { code: "JD 123", title: "Criminal Law II (RPC Book II)", units: 4 },
          { code: "JD 124", title: "Statutory Construction", units: 2 },
          { code: "JD 125", title: "Legal Ethics I", units: 2 }
        ]
      }
    ]
  },
  {
    year: 2,
    semesters: [
      {
        name: "First Semester: Core Doctrines & Procedure",
        subjects: [
          { code: "JD 211", title: "Civil Law III (Obligations & Contracts)", units: 5 },
          { code: "JD 212", title: "Remedial Law I (Civil Procedure)", units: 4 },
          { code: "JD 213", title: "Public International Law", units: 3 },
          { code: "JD 214", title: "Legal Research & Writing II (Pleadings)", units: 2 },
          { code: "JD 215", title: "Trial Advocacy I", units: 2 }
        ]
      },
      {
        name: "Second Semester: Evidence & Public Administration",
        subjects: [
          { code: "JD 221", title: "Civil Law IV (Sales, Lease, Agency)", units: 4 },
          { code: "JD 222", title: "Remedial Law II (Criminal Procedure)", units: 3 },
          { code: "JD 223", title: "Administrative Law", units: 3 },
          { code: "JD 224", title: "Evidence", units: 4 },
          { code: "JD 225", title: "Legal Ethics II", units: 2 }
        ]
      }
    ]
  },
  {
    year: 3,
    semesters: [
      {
        name: "First Semester: Integration & Strategy",
        subjects: [
          { code: "JD 311", title: "Civil Law V (Credit Transactions)", units: 3 },
          { code: "JD 312", title: "Commercial Law I (Negotiable Instruments)", units: 3 },
          { code: "JD 313", title: "Remedial Law III (Special Proceedings)", units: 2 },
          { code: "JD 314", title: "Labor Law I (Social Legislation)", units: 3 },
          { code: "JD 315", title: "Trial Advocacy II", units: 2 }
        ]
      },
      {
        name: "Second Semester: Transactions & Clinical Prep",
        subjects: [
          { code: "JD 321", title: "Commercial Law II (Corporations)", units: 4 },
          { code: "JD 322", title: "Taxation Law I (Income Taxation)", units: 3 },
          { code: "JD 323", title: "Labor Law II (Relations)", units: 3 },
          { code: "JD 324", title: "Remedial Law IV (Special Civil Actions)", units: 2 },
          { code: "JD 325", title: "Clinical Legal Education I", units: 2 }
        ]
      }
    ]
  },
  {
    year: 4,
    semesters: [
      {
        name: "First Semester: Mastery & Specialized Laws",
        subjects: [
          { code: "JD 411", title: "Taxation Law II (Transfer & Business Taxes)", units: 3 },
          { code: "JD 412", title: "Conflict of Laws", units: 2 },
          { code: "JD 413", title: "Environmental & Natural Resources Law", units: 2 },
          { code: "JD 414", title: "Clinical Legal Education II", units: 4 },
          { code: "JD 415", title: "Bar Integration I (Pre-Week Style)", units: 4 }
        ]
      },
      {
        name: "Second Semester: Advanced Practice & Bar Readiness",
        subjects: [
          { code: "JD 421", title: "Legal Profession & Advanced Ethics", units: 2 },
          { code: "JD 422", title: "Law on Public Officers & Election Law", units: 3 },
          { code: "JD 423", title: "Advanced Remedial Law (Bar-Focused)", units: 4 },
          { code: "JD 424", title: "Bar Integration II", units: 4 },
          { code: "JD 425", title: "Capstone: Integrated Case Strategy", units: 2 }
        ]
      }
    ]
  }
];

export const BAR_SUBJECTS_INFO = [
  {
    title: "Political & Public International Law",
    description: "Constitution, State Powers, Admin Law, Public Officers, Elections, and International Law.",
    color: "amber"
  },
  {
    title: "Commercial & Taxation Laws",
    description: "Corporations, Insurance, IP, Banking, and NIRC (Income, Business, & Transfer Taxes).",
    color: "blue"
  },
  {
    title: "Civil Law",
    description: "Persons, Family, Property, Obligations, Contracts, Sales, Credit, and Succession.",
    color: "emerald"
  },
  {
    title: "Labor Law & Social Legislation",
    description: "Labor Standards, Relations, Social Security, and Employee Welfare.",
    color: "orange"
  },
  {
    title: "Criminal Law",
    description: "Revised Penal Code (Book 1 & 2) and Special Penal Laws.",
    color: "red"
  },
  {
    title: "Remedial Law & Legal Ethics",
    description: "Procedures, Evidence, Special Proceedings, and the Code of Professional Responsibility (CPRA).",
    color: "indigo"
  }
];

export const BAR_SUBJECTS = BAR_SUBJECTS_INFO.map(s => s.title);

export const CODAL_CATEGORIES: LawCategory[] = [
  'Political and Public International Law',
  'Civil Law',
  'Criminal Law',
  'Remedial Law',
  'Commercial Law',
  'Labor Law and Social Legislation',
  'Taxation Law',
  'Legal and Judicial Ethics',
  'Environmental Law',
  'Special Laws'
];

export const PHILIPPINE_CODALS: LawCode[] = [
  // ... rest of file remains unchanged
  { 
    id: '1987_CONSTI', 
    name: '1987 Constitution', 
    description: 'The fundamental law of the land.', 
    category: 'Political and Public International Law',
    subcategory: 'Political Law',
    structure: [
      { title: 'Preamble', query: '1987 Constitution Preamble verbatim' },
      { title: 'Article I', subtitle: 'National Territory', query: '1987 Constitution Article I verbatim' },
      { title: 'Article II', subtitle: 'Declaration of Principles and State Policies', query: '1987 Constitution Article II verbatim' },
      { title: 'Article III', subtitle: 'Bill of Rights', query: '1987 Constitution Article III verbatim' },
      { title: 'Article IV', subtitle: 'Citizenship', query: '1987 Constitution Article IV verbatim' },
      { title: 'Article V', subtitle: 'Suffrage', query: '1987 Constitution Article V verbatim' },
      { 
        title: 'Article VI', 
        subtitle: 'The Legislative Department', 
        query: '1987 Constitution Article VI',
        children: [
            { title: 'Sections 1-16', subtitle: 'Composition, Qualifications, and Terms', query: '1987 Constitution Article VI Sections 1-16 verbatim' },
            { title: 'Sections 17-23', subtitle: 'Electoral Tribunals and Commission on Appointments', query: '1987 Constitution Article VI Sections 17-23 verbatim' },
            { title: 'Sections 24-32', subtitle: 'Legislative Powers, Bills, and Procedures', query: '1987 Constitution Article VI Sections 24-32 verbatim' },
        ]
      },
      { 
        title: 'Article VII', 
        subtitle: 'The Executive Department', 
        query: '1987 Constitution Article VII',
        children: [
            { title: 'Sections 1-12', subtitle: 'President and Vice-President', query: '1987 Constitution Article VII Sections 1-12 verbatim' },
            { title: 'Sections 13-23', subtitle: 'Powers and Functions of the President', query: '1987 Constitution Article VII Sections 13-23 verbatim' },
        ]
      },
      { 
        title: 'Article VIII', 
        subtitle: 'The Judicial Department', 
        query: '1987 Constitution Article VIII',
        children: [
            { title: 'Sections 1-5', subtitle: 'Judicial Power and the Supreme Court', query: '1987 Constitution Article VIII Sections 1-5 verbatim' },
            { title: 'Sections 6-16', subtitle: 'Powers, JBC, and Lower Courts', query: '1987 Constitution Article VIII Sections 6-16 verbatim' },
        ]
      },
      { 
        title: 'Article IX', 
        subtitle: 'Constitutional Commissions', 
        query: '1987 Constitution Article IX',
        children: [
            { title: 'A. Common Provisions', subtitle: 'General Provisions', query: '1987 Constitution Article IX-A verbatim' },
            { title: 'B. Civil Service Commission', subtitle: 'Scope and Powers', query: '1987 Constitution Article IX-B verbatim' },
            { title: 'C. Commission on Elections', subtitle: 'Scope and Powers', query: '1987 Constitution Article IX-C verbatim' },
            { title: 'D. Commission on Audit', subtitle: 'Scope and Powers', query: '1987 Constitution Article IX-D verbatim' },
        ]
      },
      { 
        title: 'Article X', 
        subtitle: 'Local Government', 
        query: '1987 Constitution Article X',
        children: [
            { title: 'General Provisions', subtitle: 'Sections 1-14', query: '1987 Constitution Article X Sections 1-14 verbatim' },
            { title: 'Autonomous Regions', subtitle: 'Sections 15-21', query: '1987 Constitution Article X Sections 15-21 verbatim' },
        ]
      },
      { title: 'Article XI', subtitle: 'Accountability of Public Officers', query: '1987 Constitution Article XI verbatim' },
      { 
        title: 'Article XII', 
        subtitle: 'National Economy and Patrimony', 
        query: '1987 Constitution Article XII',
        children: [
             { title: 'Sections 1-9', subtitle: 'Goals, Lands, and Natural Resources', query: '1987 Constitution Article XII Sections 1-9 verbatim' },
             { title: 'Sections 10-22', subtitle: 'Investment, Franchises, and Regulation', query: '1987 Constitution Article XII Sections 10-22 verbatim' },
        ]
      },
      { 
        title: 'Article XIII', 
        subtitle: 'Social Justice and Human Rights', 
        query: '1987 Constitution Article XIII',
        children: [
            { title: 'Sections 1-10', subtitle: 'Labor, Agrarian Reform, Urban Land', query: '1987 Constitution Article XIII Sections 1-10 verbatim' },
            { title: 'Sections 11-19', subtitle: 'Health, Women, People\'s Orgs, Human Rights', query: '1987 Constitution Article XIII Sections 11-19 verbatim' },
        ]
      },
      { 
        title: 'Article XIV', 
        subtitle: 'Education, Sci-Tech, Arts, Culture & Sports', 
        query: '1987 Constitution Article XIV',
        children: [
            { title: 'Sections 1-9', subtitle: 'Education and Language', query: '1987 Constitution Article XIV Sections 1-9 verbatim' },
            { title: 'Sections 10-19', subtitle: 'Science, Arts, Culture, and Sports', query: '1987 Constitution Article XIV Sections 10-19 verbatim' },
        ]
      },
      { title: 'Article XV', subtitle: 'The Family', query: '1987 Constitution Article XV verbatim' },
      { title: 'Article XVI', subtitle: 'General Provisions', query: '1987 Constitution Article XVI verbatim' },
      { title: 'Article XVII', subtitle: 'Amendments or Revisions', query: '1987 Constitution Article XVII verbatim' },
      { 
        title: 'Article XVIII', 
        subtitle: 'Transitory Provisions', 
        query: '1987 Constitution Article XVIII',
        children: [
            { title: 'Sections 1-4', subtitle: 'Elections and Existing Laws', query: '1987 Constitution Article XVIII Sections 1-4 verbatim' },
            { title: 'Sections 5-8', subtitle: 'Incumbent Officials', query: '1987 Constitution Article XVIII Sections 5-8 verbatim' },
            { title: 'Sections 9-14', subtitle: 'Judiciary and Legal System', query: '1987 Constitution Article XVIII Sections 9-14 verbatim' },
            { title: 'Sections 15-18', subtitle: 'Civil Service and Salaries', query: '1987 Constitution Article XVIII Sections 15-18 verbatim' },
            { title: 'Sections 19-21', subtitle: 'Properties and Assets', query: '1987 Constitution Article XVIII Sections 19-21 verbatim' },
            { title: 'Sections 22-24', subtitle: 'Land and Private Armies', query: '1987 Constitution Article XVIII Sections 22-24 verbatim' },
            { title: 'Sections 25-27', subtitle: 'Military Bases, Sequestration, Effectivity', query: '1987 Constitution Article XVIII Sections 25-27 verbatim' },
        ]
      },
    ]
  },
  // ... and so on ...
];

/**
 * FIX: Exporting JURISPRUDENCE_TOPICS to satisfy import in Jurisprudence.tsx
 */
export const JURISPRUDENCE_TOPICS = [
  {
    category: 'Political Law',
    topics: [
      { title: 'Judicial Power', query: 'Supreme Court Doctrine on Judicial Power and Section 1 Article VIII' },
      { title: 'Due Process', query: 'Landmark Philippine cases on Procedural and Substantive Due Process' },
      { title: 'Equal Protection', query: 'Supreme Court rulings on the Equal Protection Clause' },
      { title: 'Search and Seizure', query: 'Warrantless searches and seizures jurisprudence in the Philippines' },
      { title: 'Freedom of Expression', query: 'Prior restraint and subsequent punishment doctrines in PH law' }
    ]
  },
  {
    category: 'Civil Law',
    topics: [
      { title: 'Psychological Incapacity', query: 'Article 36 Family Code landmark cases and the Tan-Andal ruling' },
      { title: 'Obligations and Contracts', query: 'Doctrines on Fortuitous Events and Breach of Contract' },
      { title: 'Property & Ownership', query: 'Jurisprudence on Builders in Good Faith vs Bad Faith' },
      { title: 'Succession', query: 'Landmark rulings on Preterition and Reserval Troncal' }
    ]
  },
  {
    category: 'Criminal Law',
    topics: [
      { title: 'Self-Defense', query: 'Requisites of Self-Defense in Philippine Criminal Jurisprudence' },
      { title: 'Conspiracy', query: 'The "Act of One is Act of All" doctrine in PH law' },
      { title: 'Probable Cause', query: 'Jurisprudence on Probable Cause for Warrant of Arrest vs Preliminary Investigation' }
    ]
  },
  {
    category: 'Remedial Law',
    topics: [
      { title: 'Certiorari', query: 'Rule 65: Grave Abuse of Discretion amounting to lack or excess of jurisdiction' },
      { title: 'Hearsay Rule', query: 'Exceptions to the Hearsay Rule in Philippine Evidence Law' },
      { title: 'Execution of Judgment', query: 'Rules and jurisprudence on the Ministerial Duty to Execute' }
    ]
  }
];

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'DEED_SALE',
    name: 'Deed of Absolute Sale',
    description: 'Transfer ownership of real or personal property.',
    fields: ['Seller Name', 'Buyer Name', 'Property Description (TCT No.)', 'Purchase Price', 'Location']
  },
  {
    id: 'LEASE',
    name: 'Contract of Lease',
    description: 'Rental agreement for residential or commercial property.',
    fields: ['Lessor Name', 'Lessee Name', 'Property Address', 'Monthly Rental', 'Lease Term (Years/Months)', 'Advance/Deposit']
  },
  {
    id: 'EMPLOYMENT',
    name: 'Employment Contract',
    description: 'Standard employer-employee agreement.',
    fields: ['Employer', 'Employee', 'Position Title', 'Basic Salary', 'Start Date', 'Probationary Period']
  },
  {
    id: 'SERVICE',
    name: 'Service Agreement',
    description: 'Contract for independent contractors/consultants.',
    fields: ['Client', 'Service Provider', 'Scope of Work', 'Fee/Rate', 'Project Timeline']
  },
  {
    id: 'AFFIDAVIT_LOSS',
    name: 'Affidavit of Loss',
    description: 'Sworn statement regarding lost items/documents.',
    fields: ['Affiant Name', 'Item Description', 'Circumstances of Loss', 'Date of Loss']
  },
  {
    id: 'SPA',
    name: 'Special Power of Attorney',
    description: 'Authorization for an agent to act on behalf of a principal.',
    fields: ['Principal Name', 'Agent/Attorney-in-Fact', 'Specific Powers/Acts Authorized']
  },
  {
    id: 'LOAN',
    name: 'Loan Agreement',
    description: 'Contract for money lending with terms of payment.',
    fields: ['Lender', 'Borrower', 'Principal Amount', 'Interest Rate', 'Maturity Date']
  }
];

export const LEARNER_LEVELS = [
  'Freshman Law Student',
  'Junior/Senior Law Student',
  'Bar Reviewee',
  'Lawyer / Professional'
];
