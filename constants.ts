
import { LawCode, ContractTemplate, LawCategory, JDYear } from "./types";

export const JD_CURRICULUM: JDYear[] = [
  {
    year: 1,
    semesters: [
      {
        name: "First Semester",
        subjects: [
          { code: "Law 99", title: "Legal Bibliography", units: 1 },
          { code: "Law 100", title: "Persons and Family Relations", units: 4 },
          { code: "Law 109", title: "Criminal Law 1", units: 3 },
          { code: "Law 115", title: "Legal History", units: 2 },
          { code: "Law 116", title: "Legal Method", units: 2 },
          { code: "Law 121", title: "Constitutional Law 1", units: 4 }
        ]
      },
      {
        name: "Second Semester",
        subjects: [
          { code: "Law 101", title: "Obligations and Contracts", units: 5 },
          { code: "Law 110", title: "Criminal Law 2", units: 4 },
          { code: "Law 117", title: "Legal Theory", units: 2 },
          { code: "Law 120", title: "The Legal Profession", units: 2 },
          { code: "Law 122", title: "Constitutional Law 2", units: 4 }
        ]
      }
    ]
  },
  {
    year: 2,
    semesters: [
      {
        name: "First Semester",
        subjects: [
          { code: "Law 102", title: "Property", units: 4 },
          { code: "Law 103", title: "Sales", units: 2 },
          { code: "Law 104", title: "Torts and Damages", units: 3 },
          { code: "Law 113", title: "Labor Law 1 (Social Legislation)", units: 3 },
          { code: "Law 124", title: "Remedial Law 1 (Criminal Procedure)", units: 3 },
          { code: "Law 139", title: "Insurance", units: 2 }
        ]
      },
      {
        name: "Second Semester",
        subjects: [
          { code: "Law 107", title: "Credit Transactions", units: 3 },
          { code: "Law 114", title: "Labor Law 2 (Relations)", units: 3 },
          { code: "Law 123", title: "Administrative Law", units: 3 },
          { code: "Law 125", title: "Remedial Law 2 (Civil Procedure)", units: 5 },
          { code: "Law 173", title: "Agency and Partnership", units: 3 }
        ]
      }
    ]
  },
  {
    year: 3,
    semesters: [
      {
        name: "First Semester",
        subjects: [
          { code: "Law 105", title: "Succession", units: 3 },
          { code: "Law 108", title: "Negotiable Instruments", units: 3 },
          { code: "Law 111", title: "Public International Law", units: 3 },
          { code: "Law 126", title: "Remedial Law 3 (Evidence)", units: 3 },
          { code: "Law 129-A", title: "Taxation 1", units: 3 },
          { code: "Law 138", title: "Transportation and Public Utilities", units: 2 }
        ]
      },
      {
        name: "Second Semester",
        subjects: [
          { code: "Law 106", title: "Corporation Law and Securities", units: 5 },
          { code: "Law 112", title: "Private International Law", units: 2 },
          { code: "Law 118", title: "Medical Jurisprudence", units: 1 },
          { code: "Law 129-B", title: "Taxation 2", units: 3 },
          { code: "Law 154", title: "Local Governments", units: 2 },
          { code: "Law 174", title: "Remedial Law 4 (Special Proceedings)", units: 2 }
        ]
      }
    ]
  },
  {
    year: 4,
    semesters: [
      {
        name: "First Semester",
        subjects: [
          { code: "Law 119", title: "Supervised Legal Research & Writing", units: 2 },
          { code: "Law 127", title: "Remedial Law 5 (Practicum 1)", units: 4 },
          { code: "Law 156", title: "Electoral Process and Public Office", units: 3 },
          { code: "Law Elective", title: "Major Elective 1", units: 2 },
          { code: "Law Elective", title: "Major Elective 2", units: 2 }
        ]
      },
      {
        name: "Second Semester",
        subjects: [
          { code: "Law 128", title: "Remedial Law 6 (Practicum 2)", units: 4 },
          { code: "Law Elective", title: "Major Elective 3", units: 2 },
          { code: "Law Elective", title: "Major Elective 4", units: 2 },
          { code: "Law 152", title: "Thesis", units: 2 }
        ]
      }
    ]
  }
];

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

export const JURISPRUDENCE_TOPICS = [
  {
    category: "Political Law",
    topics: [
      { title: "Doctrine of Constitutional Supremacy", query: "Explain the Doctrine of Constitutional Supremacy in Philippine Law with key jurisprudence" },
      { title: "Separation of Powers", query: "Jurisprudence and principles on Separation of Powers in the Philippines" },
      { title: "Checks and Balances", query: "Doctrine of Checks and Balances Philippine Supreme Court decisions" },
      { title: "Delegation of Powers", query: "Potestas delegata non delegari potest Philippines jurisprudence" },
      { title: "Doctrine of Qualified Political Agency", query: "Explain the Doctrine of Qualified Political Agency (Alter Ego Doctrine) with cases" },
      { title: "State Immunity from Suit", query: "Doctrine of State Immunity from Suit Philippines jurisprudence" },
      { title: "Archipelagic Doctrine", query: "Archipelagic Doctrine under UNCLOS and the Philippine Constitution" },
      { title: "Police Power", query: "Police Power of the State Philippines jurisprudence" },
      { title: "Power of Eminent Domain", query: "Eminent Domain Philippines requisites and jurisprudence" },
      { title: "Taxation Power", query: "Power of Taxation limitations and principles Philippines" },
      { title: "Moot and Academic Principle", query: "Moot and Academic principle in judicial review Philippines" },
      { title: "Political Question Doctrine", query: "Political Question Doctrine vs Judicial Power Philippines" },
      { title: "Operative Fact Doctrine", query: "Doctrine of Operative Fact Philippines jurisprudence" }
    ]
  },
  {
    category: "Civil Law",
    topics: [
      { title: "Abuse of Rights Principle", query: "Article 19, 20, 21 Civil Code Abuse of Rights Doctrine jurisprudence" },
      { title: "Accion Publiciana vs Accion Reivindicatoria", query: "Distinguish Accion Publiciana, Accion Reivindicatoria, and Accion Interdictal with cases" },
      { title: "Doctrine of Piercing the Veil", query: "Piercing the Veil of Corporate Fiction Philippines jurisprudence" },
      { title: "Psychological Incapacity", query: "Psychological Incapacity Art 36 Family Code jurisprudence Tan-Andal case" },
      { title: "Prejudicial Question", query: "Elements of Prejudicial Question Philippines jurisprudence" },
      { title: "Rescission vs Resolution", query: "Distinction between Rescission (Art 1381) and Resolution (Art 1191) Civil Code" },
      { title: "Solutio Indebiti", query: "Principle of Solutio Indebiti Philippines jurisprudence" },
      { title: "Negotiorum Gestio", query: "Negotiorum Gestio Philippines jurisprudence" },
      { title: "Doctrine of Last Clear Chance", query: "Doctrine of Last Clear Chance Philippines Torts jurisprudence" },
      { title: "Vicarious Liability", query: "Vicarious Liability Article 2180 Civil Code jurisprudence" },
      { title: "Builder in Good Faith", query: "Rights of Builder in Good Faith Art 448 Civil Code jurisprudence" }
    ]
  },
  {
    category: "Criminal Law",
    topics: [
      { title: "Pro Reo Principle", query: "Indubio Pro Reo principle Philippines criminal law" },
      { title: "Doctrine of Proximate Cause", query: "Proximate Cause in Felories Philippines jurisprudence" },
      { title: "Aberratio Ictus vs Error in Personae", query: "Aberratio Ictus vs Error in Personae vs Praeter Intentionem Philippines" },
      { title: "Impossible Crime", query: "Concept of Impossible Crime Philippines jurisprudence" },
      { title: "Conspiracy", query: "Requisites of Conspiracy Philippines jurisprudence" },
      { title: "Entrapment vs Instigation", query: "Distinguish Entrapment from Instigation Philippines jurisprudence" },
      { title: "Complex Crimes", query: "Complex Crimes Art 48 Revised Penal Code jurisprudence" },
      { title: "Self-Defense", query: "Requisites of Self-Defense Philippines jurisprudence" },
      { title: "Battered Woman Syndrome", query: "Battered Woman Syndrome as a defense Philippines jurisprudence" }
    ]
  },
  {
    category: "Remedial Law",
    topics: [
      { title: "Doctrine of Hierarchy of Courts", query: "Doctrine of Hierarchy of Courts Philippines exceptions jurisprudence" },
      { title: "Res Judicata", query: "Requisites of Res Judicata Philippines jurisprudence" },
      { title: "Litis Pendentia", query: "Requisites of Litis Pendentia Philippines jurisprudence" },
      { title: "Forum Shopping", query: "Test of Forum Shopping Philippines jurisprudence" },
      { title: "Neypes Doctrine", query: "Neypes Doctrine Fresh Period Rule Philippines" },
      { title: "Doctrine of Exhaustion of Admin Remedies", query: "Doctrine of Exhaustion of Administrative Remedies Philippines" },
      { title: "Admissibility vs Weight of Evidence", query: "Admissibility vs Weight of Evidence Philippines jurisprudence" },
      { title: "Chain of Custody Rule", query: "Chain of Custody Rule Drug Cases RA 9165 jurisprudence" },
      { title: "Writ of Amparo", query: "Writ of Amparo nature and coverage Philippines" },
      { title: "Writ of Kalikasan", query: "Writ of Kalikasan nature and coverage Philippines" }
    ]
  },
  {
    category: "Commercial Law",
    topics: [
      { title: "Business Judgment Rule", query: "Business Judgment Rule Philippines Corporation Law jurisprudence" },
      { title: "Trust Fund Doctrine", query: "Trust Fund Doctrine Corporation Law Philippines" },
      { title: "Grandfather Rule", query: "Grandfather Rule vs Control Test Philippines Nationality" },
      { title: "Doctrine of Separate Juridical Personality", query: "Separate Juridical Personality Doctrine Philippines cases" },
      { title: "Hold-Over Principle", query: "Hold-Over Principle Corporation Law Philippines" },
      { title: "Insurable Interest", query: "Insurable Interest Life vs Property Philippines jurisprudence" }
    ]
  },
  {
    category: "Labor Law",
    topics: [
      { title: "Security of Tenure", query: "Security of Tenure Philippines Labor Code jurisprudence" },
      { title: "Four-Fold Test", query: "Four-Fold Test Employer-Employee Relationship Philippines" },
      { title: "Twin Notice Rule", query: "Twin Notice Rule in Dismissal Cases Philippines" },
      { title: "Strike and Lockout", query: "Legal requirements for Strike and Lockout Philippines" },
      { title: "Totality of Conduct Doctrine", query: "Totality of Conduct Doctrine Sexual Harassment Philippines" }
    ]
  }
];

export const PHILIPPINE_CODALS: LawCode[] = [
  // --- POLITICAL LAW ---
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
  { 
    id: 'ADMIN_CODE', 
    name: 'Administrative Code of 1987 (EO 292)', 
    description: 'Structure and Administration of Government.', 
    category: 'Political and Public International Law',
    subcategory: 'Political Law',
    structure: [
      { title: 'Book I', subtitle: 'Sovereignty and General Administration', query: 'EO 292 Book I verbatim' },
      { title: 'Book II', subtitle: 'Distribution of Powers of Government', query: 'EO 292 Book II verbatim' },
      { title: 'Book III', subtitle: 'Office of the President', query: 'EO 292 Book III verbatim' },
      { title: 'Book IV', subtitle: 'The Executive Branch', query: 'EO 292 Book IV verbatim' },
      { title: 'Book V', subtitle: 'Title I: Civil Service Commission', query: 'EO 292 Book V Title I verbatim' },
      { title: 'Book VI', subtitle: 'National Government Budgeting', query: 'EO 292 Book VI verbatim' },
      { title: 'Book VII', subtitle: 'Administrative Procedure', query: 'EO 292 Book VII verbatim' },
    ]
  },
  { 
    id: 'LGC', 
    name: 'Local Government Code (RA 7160)', 
    description: 'Decentralization and local governance.', 
    category: 'Political and Public International Law',
    subcategory: 'Political Law',
    structure: [
      { 
        title: 'Book I', 
        subtitle: 'General Provisions', 
        query: 'Local Government Code Book I',
        children: [
           { title: 'Title I', subtitle: 'Basic Principles', query: 'LGC Book I Title I verbatim' },
           { title: 'Title II', subtitle: 'Elective Officials', query: 'LGC Book I Title II verbatim' },
           { title: 'Title III', subtitle: 'Human Resources and Development', query: 'LGC Book I Title III verbatim' },
           { title: 'Title IV', subtitle: 'Local School Boards', query: 'LGC Book I Title IV verbatim' },
           { title: 'Title V', subtitle: 'Local Health Boards', query: 'LGC Book I Title V verbatim' },
           { title: 'Title VI', subtitle: 'Local Development Councils', query: 'LGC Book I Title VI verbatim' },
           { title: 'Title VII', subtitle: 'Local Peace and Order Council', query: 'LGC Book I Title VII verbatim' },
           { title: 'Title VIII', subtitle: 'Autonomous Special Economic Zones', query: 'LGC Book I Title VIII verbatim' },
           { title: 'Title IX', subtitle: 'Other Provisions Applicable to Local Government Officials', query: 'LGC Book I Title IX verbatim' },
        ]
      },
      { 
        title: 'Book II', 
        subtitle: 'Local Taxation and Fiscal Matters', 
        query: 'Local Government Code Book II',
        children: [
           { title: 'Title I', subtitle: 'Local Government Taxation', query: 'LGC Book II Title I verbatim' },
           { title: 'Title II', subtitle: 'Real Property Taxation', query: 'LGC Book II Title II verbatim' },
           { title: 'Title III', subtitle: 'Shares of LGUs in the Proceeds of National Taxes', query: 'LGC Book II Title III verbatim' },
           { title: 'Title IV', subtitle: 'Credit Financing', query: 'LGC Book II Title IV verbatim' },
           { title: 'Title V', subtitle: 'Local Fiscal Administration', query: 'LGC Book II Title V verbatim' },
           { title: 'Title VI', subtitle: 'Property and Supply Management', query: 'LGC Book II Title VI verbatim' },
        ]
      },
      { 
        title: 'Book III', 
        subtitle: 'Local Government Units', 
        query: 'Local Government Code Book III',
        children: [
           { title: 'Title I', subtitle: 'The Barangay', query: 'LGC Book III Title I verbatim' },
           { title: 'Title II', subtitle: 'The Municipality', query: 'LGC Book III Title II verbatim' },
           { title: 'Title III', subtitle: 'The City', query: 'LGC Book III Title III verbatim' },
           { title: 'Title IV', subtitle: 'The Province', query: 'LGC Book III Title IV verbatim' },
           { title: 'Title V', subtitle: 'Appointed Local Officials', query: 'LGC Book III Title V verbatim' },
        ]
      },
      { 
        title: 'Book IV', 
        subtitle: 'Miscellaneous and Final Provisions', 
        query: 'Local Government Code Book IV',
        children: [
           { title: 'Title I', subtitle: 'Penal Provisions', query: 'LGC Book IV Title I verbatim' },
           { title: 'Title II', subtitle: 'Provisions for Implementation', query: 'LGC Book IV Title II verbatim' },
           { title: 'Title III', subtitle: 'Transitory Provisions', query: 'LGC Book IV Title III verbatim' },
        ]
      },
    ] 
  },
  { 
    id: 'BANGSAMORO', 
    name: 'Bangsamoro Organic Law (RA 11054)', 
    description: 'Organic Law for the BARMM.', 
    category: 'Political and Public International Law',
    subcategory: 'Political Law',
    structure: [
      { title: 'Article I', subtitle: 'Name and Purpose', query: 'RA 11054 Article I verbatim' },
      { title: 'Article II', subtitle: 'Bangsamoro Identity', query: 'RA 11054 Article II verbatim' },
      { title: 'Article III', subtitle: 'Territory', query: 'RA 11054 Article III verbatim' },
      { title: 'Article IV', subtitle: 'General Principles and Policies', query: 'RA 11054 Article IV verbatim' },
      { title: 'Article VI', subtitle: 'Intergovernmental Relations', query: 'RA 11054 Article VI verbatim' },
      { title: 'Article VII', subtitle: 'The Bangsamoro Government', query: 'RA 11054 Article VII verbatim' },
      { title: 'Article VIII', subtitle: 'Wali', query: 'RA 11054 Article VIII verbatim' },
      { title: 'Article IX', subtitle: 'Basic Rights', query: 'RA 11054 Article IX verbatim' },
      { title: 'Article X', subtitle: 'Bangsamoro Justice System', query: 'RA 11054 Article X verbatim' },
    ]
  },
  { 
    id: 'ELECTION_CODE', 
    name: 'Omnibus Election Code (BP 881)', 
    description: 'Laws governing elections and political parties.', 
    category: 'Political and Public International Law',
    subcategory: 'Political Law',
    structure: [
      { title: 'Article I', subtitle: 'General Provisions', query: 'Omnibus Election Code Article I verbatim' },
      { title: 'Article II', subtitle: 'Election of President and Vice-President', query: 'Omnibus Election Code Article II verbatim' },
      { title: 'Article III', subtitle: 'Election of Members of the Batasang Pambansa', query: 'Omnibus Election Code Article III verbatim' },
      { title: 'Article IV', subtitle: 'Election of Local Officials', query: 'Omnibus Election Code Article IV verbatim' },
      { title: 'Article VII', subtitle: 'The Commission on Elections', query: 'Omnibus Election Code Article VII verbatim' },
      { title: 'Article IX', subtitle: 'Eligibility of Candidates and Certificate of Candidacy', query: 'Omnibus Election Code Article IX verbatim' },
      { title: 'Article X', subtitle: 'Campaign and Election Propaganda', query: 'Omnibus Election Code Article X verbatim' },
      { title: 'Article XXII', subtitle: 'Election Offenses', query: 'Omnibus Election Code Article XXII verbatim' },
    ]
  },

  // --- PUBLIC INTERNATIONAL LAW ---
  { 
    id: 'UN_CHARTER', 
    name: 'Charter of the United Nations', 
    description: 'Foundational treaty of the UN.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Preamble', query: 'UN Charter Preamble verbatim' },
      { title: 'Chapter I', subtitle: 'Purposes and Principles', query: 'UN Charter Chapter I verbatim' },
      { title: 'Chapter II', subtitle: 'Membership', query: 'UN Charter Chapter II verbatim' },
      { title: 'Chapter III', subtitle: 'Organs', query: 'UN Charter Chapter III verbatim' },
      { title: 'Chapter IV', subtitle: 'The General Assembly', query: 'UN Charter Chapter IV verbatim' },
      { title: 'Chapter V', subtitle: 'The Security Council', query: 'UN Charter Chapter V verbatim' },
      { title: 'Chapter VI', subtitle: 'Pacific Settlement of Disputes', query: 'UN Charter Chapter VI verbatim' },
      { title: 'Chapter VII', subtitle: 'Action with Respect to Threats to the Peace', query: 'UN Charter Chapter VII verbatim' },
      { title: 'Chapter XIV', subtitle: 'The International Court of Justice', query: 'UN Charter Chapter XIV verbatim' },
    ]
  },
  { 
    id: 'ASEAN_CHARTER', 
    name: 'ASEAN Charter', 
    description: 'Constituent instrument of the Association of Southeast Asian Nations.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Chapter I', subtitle: 'Purposes and Principles', query: 'ASEAN Charter Chapter I verbatim' },
      { title: 'Chapter II', subtitle: 'Legal Personality', query: 'ASEAN Charter Chapter II verbatim' },
      { title: 'Chapter IV', subtitle: 'Organs', query: 'ASEAN Charter Chapter IV verbatim' },
      { title: 'Chapter VII', subtitle: 'Decision-Making', query: 'ASEAN Charter Chapter VII verbatim' },
      { title: 'Chapter VIII', subtitle: 'Settlement of Disputes', query: 'ASEAN Charter Chapter VIII verbatim' },
    ]
  },
  { 
    id: 'ICJ_STATUTE', 
    name: 'Statute of the International Court of Justice', 
    description: 'Integral part of the UN Charter.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Chapter I', subtitle: 'Organization of the Court', query: 'ICJ Statute Chapter I verbatim' },
      { title: 'Chapter II', subtitle: 'Competence of the Court', query: 'ICJ Statute Chapter II verbatim' },
      { title: 'Chapter III', subtitle: 'Procedure', query: 'ICJ Statute Chapter III verbatim' },
      { title: 'Chapter IV', subtitle: 'Advisory Opinions', query: 'ICJ Statute Chapter IV verbatim' },
    ]
  },
  { 
    id: 'ROME_STATUTE', 
    name: 'Rome Statute of the ICC', 
    description: 'Establishes the International Criminal Court.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Part 1', subtitle: 'Establishment of the Court', query: 'Rome Statute Part 1 verbatim' },
      { title: 'Part 2', subtitle: 'Jurisdiction, Admissibility and Applicable Law', query: 'Rome Statute Part 2 verbatim' },
      { title: 'Part 3', subtitle: 'General Principles of Criminal Law', query: 'Rome Statute Part 3 verbatim' },
      { title: 'Part 5', subtitle: 'Investigation and Prosecution', query: 'Rome Statute Part 5 verbatim' },
    ]
  },
  { 
    id: 'VCLT', 
    name: 'Vienna Convention on the Law of Treaties', 
    description: 'Treaty on Treaties.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Part I', subtitle: 'Introduction', query: 'VCLT Part I verbatim' },
      { title: 'Part II', subtitle: 'Conclusion and Entry into Force of Treaties', query: 'VCLT Part II verbatim' },
      { title: 'Part III', subtitle: 'Observance, Application and Interpretation of Treaties', query: 'VCLT Part III verbatim' },
      { title: 'Part V', subtitle: 'Invalidity, Termination and Suspension', query: 'VCLT Part V verbatim' },
    ]
  },
  { 
    id: 'VCDR', 
    name: 'Vienna Convention on Diplomatic Relations', 
    description: 'Diplomatic intercourse, privileges and immunities.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Articles 1-19', subtitle: 'Establishment of Diplomatic Relations', query: 'VCDR Articles 1-19 verbatim' },
      { title: 'Articles 20-28', subtitle: 'Inviolability of Premises', query: 'VCDR Articles 20-28 verbatim' },
      { title: 'Articles 29-40', subtitle: 'Personal Immunities', query: 'VCDR Articles 29-40 verbatim' },
    ]
  },
  { 
    id: 'UNCLOS', 
    name: 'UN Convention on the Law of the Sea', 
    description: 'Constitution for the oceans.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Part II', subtitle: 'Territorial Sea and Contiguous Zone', query: 'UNCLOS Part II verbatim' },
      { title: 'Part III', subtitle: 'Straits Used for International Navigation', query: 'UNCLOS Part III verbatim' },
      { title: 'Part IV', subtitle: 'Archipelagic States', query: 'UNCLOS Part IV verbatim' },
      { title: 'Part V', subtitle: 'Exclusive Economic Zone', query: 'UNCLOS Part V verbatim' },
      { title: 'Part VI', subtitle: 'Continental Shelf', query: 'UNCLOS Part VI verbatim' },
      { title: 'Part XI', subtitle: 'The Area', query: 'UNCLOS Part XI verbatim' },
    ]
  },
  { 
    id: 'UDHR_ICCPR', 
    name: 'Human Rights Law (UDHR & ICCPR)', 
    description: 'International Bill of Human Rights.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'UDHR', subtitle: 'Universal Declaration of Human Rights', query: 'Universal Declaration of Human Rights verbatim' },
      { title: 'ICCPR Part III', subtitle: 'Civil and Political Rights', query: 'ICCPR Part III verbatim' },
      { title: 'ICESCR Part III', subtitle: 'Economic, Social and Cultural Rights', query: 'ICESCR Part III verbatim' },
      { title: 'Geneva Convention IV', subtitle: 'Protection of Civilian Persons in Time of War', query: 'Geneva Convention IV verbatim' },
    ]
  },

  // --- CIVIL LAW (COMPLETE) ---
  { 
    id: 'CIVIL_CODE', 
    name: 'Civil Code (RA 386)', 
    description: 'Persons, Property, Succession, Obligations & Contracts.', 
    category: 'Civil Law',
    structure: [
      { title: 'Preliminary Title', subtitle: 'Effect and Application of Laws (Arts. 1-36)', query: 'Civil Code Preliminary Title Articles 1-36 verbatim' },
      { 
        title: 'Book I', 
        subtitle: 'Persons', 
        query: 'Civil Code Book I Persons',
        children: [
           { title: 'Title I', subtitle: 'Civil Personality (Arts. 37-47)', query: 'Civil Code Book I Title I verbatim' },
           { title: 'Title II', subtitle: 'Citizenship and Domicile (Arts. 48-51)', query: 'Civil Code Book I Title II verbatim' },
           { title: 'Title X', subtitle: 'Funerals (Arts. 305-310)', query: 'Civil Code Book I Title X verbatim' },
           { title: 'Title XII', subtitle: 'Care and Education of Children (Arts. 356-363)', query: 'Civil Code Book I Title XII verbatim' },
           { title: 'Title XIII', subtitle: 'Use of Surnames (Arts. 364-380)', query: 'Civil Code Book I Title XIII verbatim' },
           { title: 'Title XIV', subtitle: 'Absence (Arts. 381-396)', query: 'Civil Code Book I Title XIV verbatim' },
           { title: 'Title XVI', subtitle: 'Civil Register (Arts. 407-413)', query: 'Civil Code Book I Title XVI verbatim' },
        ]
      },
      { 
        title: 'Book II', 
        subtitle: 'Property, Ownership, and its Modifications', 
        query: 'Civil Code Book II Property',
        children: [
          { title: 'Title I', subtitle: 'Classification of Property (Arts. 414-426)', query: 'Civil Code Book II Title I verbatim' },
          { title: 'Title II', subtitle: 'Ownership (Arts. 427-483)', query: 'Civil Code Book II Title II verbatim' },
          { title: 'Title III', subtitle: 'Co-ownership (Arts. 484-501)', query: 'Civil Code Book II Title III verbatim' },
          { title: 'Title II', subtitle: 'Special Properties (Arts. 502-522)', query: 'Civil Code Book II Title IV verbatim' },
          { title: 'Title V', subtitle: 'Possession (Arts. 523-561)', query: 'Civil Code Book II Title V verbatim' },
          { title: 'Title VI', subtitle: 'Usufruct (Arts. 562-612)', query: 'Civil Code Book II Title VI verbatim' },
          { title: 'Title VII', subtitle: 'Easements or Servitudes (Arts. 613-693)', query: 'Civil Code Book II Title VII verbatim' },
          { title: 'Title VIII', subtitle: 'Nuisance (Arts. 694-707)', query: 'Civil Code Book II Title VIII verbatim' },
          { title: 'Title IX', subtitle: 'Registry of Property (Arts. 708-711)', query: 'Civil Code Book II Title IX verbatim' },
        ]
      },
      { 
        title: 'Book III', 
        subtitle: 'Different Modes of Acquiring Ownership', 
        query: 'Civil Code Book III',
        children: [
          { title: 'Title I', subtitle: 'Occupation (Arts. 713-720)', query: 'Civil Code Book III Title I verbatim' },
          { title: 'Title II', subtitle: 'Intellectual Creation (Arts. 721-724)', query: 'Civil Code Book III Title II verbatim' },
          { title: 'Title III', subtitle: 'Donation (Arts. 725-773)', query: 'Civil Code Book III Title III verbatim' },
          { title: 'Title IV', subtitle: 'Succession (Arts. 774-1105)', query: 'Civil Code Book III Title IV verbatim' },
          { title: 'Title V', subtitle: 'Prescription (Arts. 1106-1155)', query: 'Civil Code Book III Title V verbatim' },
        ]
      },
      { 
        title: 'Book IV', 
        subtitle: 'Obligations and Contracts', 
        query: 'Civil Code Book IV',
        children: [
          { title: 'Title I', subtitle: 'Obligations (Arts. 1156-1304)', query: 'Civil Code Book IV Title I Obligations verbatim' },
          { title: 'Title II', subtitle: 'Contracts (Arts. 1305-1422)', query: 'Civil Code Book IV Title II Contracts verbatim' },
          { title: 'Title III', subtitle: 'Natural Obligations (Arts. 1423-1430)', query: 'Civil Code Book IV Title III verbatim' },
          { title: 'Title IV', subtitle: 'Estoppel (Arts. 1431-1439)', query: 'Civil Code Book IV Title IV verbatim' },
          { title: 'Title V', subtitle: 'Trusts (Arts. 1440-1457)', query: 'Civil Code Book IV Title V verbatim' },
          { title: 'Title VI', subtitle: 'Sales (Arts. 1458-1637)', query: 'Civil Code Book IV Title VI Sales verbatim' },
          { title: 'Title VII', subtitle: 'Barter (Arts. 1638-1641)', query: 'Civil Code Book IV Title VII verbatim' },
          { title: 'Title VIII', subtitle: 'Lease (Arts. 1642-1766)', query: 'Civil Code Book IV Title VIII Lease verbatim' },
          { title: 'Title IX', subtitle: 'Partnership (Arts. 1767-1867)', query: 'Civil Code Book IV Title IX Partnership verbatim' },
          { title: 'Title X', subtitle: 'Agency (Arts. 1868-1932)', query: 'Civil Code Book IV Title X Agency verbatim' },
          { title: 'Title XI', subtitle: 'Loan (Arts. 1933-1961)', query: 'Civil Code Book IV Title XI verbatim' },
          { title: 'Title XII', subtitle: 'Deposit (Arts. 1962-2009)', query: 'Civil Code Book IV Title XII verbatim' },
          { title: 'Title XIII', subtitle: 'Aleatory Contracts (Arts. 2010-2027)', query: 'Civil Code Book IV Title XIII verbatim' },
          { title: 'Title XIV', subtitle: 'Compromises and Arbitrations (Arts. 2028-2046)', query: 'Civil Code Book IV Title XIV verbatim' },
          { title: 'Title XV', subtitle: 'Guaranty (Arts. 2047-2084)', query: 'Civil Code Book IV Title XV verbatim' },
          { title: 'Title XVI', subtitle: 'Pledge, Mortgage and Antichresis (Arts. 2085-2141)', query: 'Civil Code Book IV Title XVI verbatim' },
          { title: 'Title XVII', subtitle: 'Extra-contractual Obligations (Arts. 2142-2194)', query: 'Civil Code Book IV Title XVII verbatim' },
          { title: 'Title XVIII', subtitle: 'Damages (Arts. 2195-2235)', query: 'Civil Code Book IV Title XVIII Damages verbatim' },
          { title: 'Title XIX', subtitle: 'Concurrence and Preference of Credits (Arts. 2236-2251)', query: 'Civil Code Book IV Title XIX verbatim' },
        ]
      }
    ]
  },
  { 
    id: 'FAMILY_CODE', 
    name: 'Family Code (EO 209)', 
    description: 'Marriage, Property Relations, and Family Rights.', 
    category: 'Civil Law',
    structure: [
      { title: 'Title I', subtitle: 'Marriage (Arts. 1-54)', query: 'Family Code Title I Marriage verbatim' },
      { title: 'Title II', subtitle: 'Legal Separation (Arts. 55-67)', query: 'Family Code Title II Legal Separation verbatim' },
      { title: 'Title III', subtitle: 'Rights and Obligations between Husband and Wife (Arts. 68-73)', query: 'Family Code Title III verbatim' },
      { title: 'Title IV', subtitle: 'Property Relations between Husband and Wife (Arts. 74-148)', query: 'Family Code Title IV Property Relations verbatim' },
      { title: 'Title V', subtitle: 'The Family (Arts. 149-162)', query: 'Family Code Title V verbatim' },
      { title: 'Title VI', subtitle: 'Paternity and Filiation (Arts. 163-182)', query: 'Family Code Title VI Paternity verbatim' },
      { title: 'Title VII', subtitle: 'Adoption (Superseded by RA 8552/RA 11642)', query: 'Domestic Administrative Adoption and Child Care Act verbatim' },
      { title: 'Title VIII', subtitle: 'Support (Arts. 194-208)', query: 'Family Code Title VIII Support verbatim' },
      { title: 'Title IX', subtitle: 'Parental Authority (Arts. 209-233)', query: 'Family Code Title IX Parental Authority verbatim' },
      { title: 'Title X', subtitle: 'Emancipation and Age of Majority (Arts. 234-237)', query: 'Family Code Title X verbatim' },
      { title: 'Title XI', subtitle: 'Summary Judicial Proceedings (Arts. 238-253)', query: 'Family Code Title XI verbatim' },
      { title: 'Title XII', subtitle: 'Final Provisions (Arts. 254-257)', query: 'Family Code Title XII verbatim' },
    ] 
  },
  { 
    id: 'PD_1529', 
    name: 'Property Registration Decree (PD 1529)', 
    description: 'Registration of land titles and deeds.', 
    category: 'Civil Law',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'PD 1529 Chapter I verbatim' },
      { title: 'Chapter II', subtitle: 'Original Registration', query: 'PD 1529 Chapter II verbatim' },
      { title: 'Chapter III', subtitle: 'Certificate of Title', query: 'PD 1529 Chapter III verbatim' },
      { title: 'Chapter IV', subtitle: 'Voluntary Dealings with Registered Lands', query: 'PD 1529 Chapter IV verbatim' },
      { title: 'Chapter V', subtitle: 'Involuntary Dealings', query: 'PD 1529 Chapter V verbatim' },
      { title: 'Chapter VII', subtitle: 'Assurance Fund', query: 'PD 1529 Chapter VII verbatim' },
      { title: 'Chapter X', subtitle: 'Petitions and Actions', query: 'PD 1529 Chapter X verbatim' },
    ]
  },
  { 
    id: 'RA_4726', 
    name: 'Condominium Act (RA 4726)', 
    description: 'Ownership and management of condominiums.', 
    category: 'Civil Law',
    structure: [
      { title: 'Section 2', subtitle: 'Definition of Terms', query: 'RA 4726 Section 2 verbatim' },
      { title: 'Section 4', subtitle: 'Rights of Unit Owners', query: 'RA 4726 Section 4 verbatim' },
      { title: 'Section 6', subtitle: 'Common Areas', query: 'RA 4726 Section 6 verbatim' },
      { title: 'Section 10', subtitle: 'The Condominium Corporation', query: 'RA 4726 Section 10 verbatim' },
    ]
  },
  { 
    id: 'PD_1083', 
    name: 'Code of Muslim Personal Laws (PD 1083)', 
    description: 'Personal laws for Muslims in the Philippines.', 
    category: 'Civil Law',
    structure: [
      { title: 'Book I', subtitle: 'General Provisions', query: 'PD 1083 Book I verbatim' },
      { title: 'Book II', subtitle: 'Persons and Family Relations', query: 'PD 1083 Book II verbatim' },
      { title: 'Book III', subtitle: 'Succession', query: 'PD 1083 Book III verbatim' },
      { title: 'Book IV', subtitle: 'Adjudication and Settlement of Disputes', query: 'PD 1083 Book IV verbatim' },
    ]
  },

  // --- CRIMINAL LAW (COMPLETE) ---
  { 
    id: 'RPC', 
    name: 'Revised Penal Code (Act 3815)', 
    description: 'Felonies, Justifying Circumstances, and Penalties.', 
    category: 'Criminal Law',
    structure: [
      { 
        title: 'Book I', 
        subtitle: 'General Provisions', 
        query: 'Revised Penal Code Book I',
        children: [
          { title: 'Title I', subtitle: 'Felonies and Circumstances which Affect Criminal Liability (Arts. 1-20)', query: 'RPC Book I Title I verbatim' },
          { title: 'Title II', subtitle: 'Persons Criminally Liable (Arts. 16-20)', query: 'RPC Book I Title II verbatim' },
          { title: 'Title III', subtitle: 'Penalties (Arts. 21-88)', query: 'RPC Book I Title III verbatim' },
          { title: 'Title IV', subtitle: 'Extinction of Criminal Liability (Arts. 89-99)', query: 'RPC Book I Title IV verbatim' },
          { title: 'Title V', subtitle: 'Civil Liability (Arts. 100-113)', query: 'RPC Book I Title V verbatim' },
        ]
      },
      { 
        title: 'Book II', 
        subtitle: 'Crimes and Penalties', 
        query: 'Revised Penal Code Book II',
        children: [
          { title: 'Title I', subtitle: 'Crimes Against National Security (Arts. 114-123)', query: 'RPC Book II Title I verbatim' },
          { title: 'Title II', subtitle: 'Crimes Against Fundamental Laws of the State (Arts. 124-133)', query: 'RPC Book II Title II verbatim' },
          { title: 'Title III', subtitle: 'Crimes Against Public Order (Arts. 134-160)', query: 'RPC Book II Title III verbatim' },
          { title: 'Title IV', subtitle: 'Crimes Against Public Interest (Arts. 161-189)', query: 'RPC Book II Title IV verbatim' },
          { title: 'Title V', subtitle: 'Crimes Relative to Opium and Prohibited Drugs (Arts. 190-194)', query: 'RPC Book II Title V verbatim' },
          { title: 'Title VI', subtitle: 'Crimes Against Public Morals (Arts. 195-202)', query: 'RPC Book II Title VI verbatim' },
          { title: 'Title VII', subtitle: 'Crimes Committed by Public Officers (Arts. 203-245)', query: 'RPC Book II Title VII verbatim' },
          { title: 'Title VIII', subtitle: 'Crimes Against Persons (Arts. 246-266)', query: 'RPC Book II Title VIII verbatim' },
          { title: 'Title IX', subtitle: 'Crimes Against Personal Liberty and Security (Arts. 267-292)', query: 'RPC Book II Title IX verbatim' },
          { title: 'Title X', subtitle: 'Crimes Against Property (Arts. 293-332)', query: 'RPC Book II Title X verbatim' },
          { title: 'Title XI', subtitle: 'Crimes Against Chastity (Arts. 333-346)', query: 'RPC Book II Title XI verbatim' },
          { title: 'Title XII', subtitle: 'Crimes Against Civil Status of Persons (Arts. 347-352)', query: 'RPC Book II Title XII verbatim' },
          { title: 'Title XIII', subtitle: 'Crimes Against Honor (Arts. 353-364)', query: 'RPC Book II Title XIII verbatim' },
          { title: 'Title XIV', subtitle: 'Quasi-offenses (Art. 365)', query: 'RPC Book II Title XIV verbatim' },
        ]
      }
    ]
  },
  
  // --- REMEDIAL LAW ---
  { 
    id: 'ROC', 
    name: 'Rules of Court', 
    description: 'Civil & Criminal Procedure, Evidence, Special Proceedings.', 
    category: 'Remedial Law',
    structure: [
      { title: 'Part I', subtitle: 'Civil Procedure (Rules 1-71)', query: 'Rules of Court Civil Procedure verbatim' },
      { title: 'Part II', subtitle: 'Special Proceedings (Rules 72-109)', query: 'Rules of Court Special Proceedings verbatim' },
      { title: 'Part III', subtitle: 'Criminal Procedure (Rules 110-127)', query: 'Rules of Court Criminal Procedure verbatim' },
      { title: 'Part IV', subtitle: 'Evidence (Rules 128-134)', query: 'Rules of Court Evidence verbatim' },
    ]
  },
  {
    id: 'BP_129',
    name: 'Judiciary Reorganization Act (BP 129)',
    description: 'Organization of Courts.',
    category: 'Remedial Law',
    subcategory: 'Judiciary & Courts',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'BP 129 Chapter I verbatim' },
      { title: 'Chapter II', subtitle: 'Court of Appeals', query: 'BP 129 Chapter II verbatim' },
      { title: 'Chapter III', subtitle: 'Regional Trial Courts', query: 'BP 129 Chapter III verbatim' },
      { title: 'Chapter IV', subtitle: 'Metropolitan Trial Courts, etc.', query: 'BP 129 Chapter IV verbatim' },
    ]
  },
  {
    id: 'RA_9285',
    name: 'ADR Act of 2004 (RA 9285)',
    description: 'Alternative Dispute Resolution Act.',
    category: 'Remedial Law',
    subcategory: 'Alternative Dispute Resolution',
    structure: [
      { title: 'Chapter 1', subtitle: 'General Provisions', query: 'RA 9285 Chapter 1 verbatim' },
      { title: 'Chapter 2', subtitle: 'Institutionalization of ADR', query: 'RA 9285 Chapter 2 verbatim' },
      { title: 'Chapter 4', subtitle: 'International Commercial Arbitration', query: 'RA 9285 Chapter 4 verbatim' },
      { title: 'Chapter 5', subtitle: 'Domestic Arbitration', query: 'RA 9285 Chapter 5 verbatim' },
    ]
  },
  
  // --- COMMERCIAL LAW (COMPLETE) ---
  { 
    id: 'CORP_CODE', 
    name: 'Revised Corporation Code (RA 11232)', 
    description: 'Corporate organization, powers, and governance.', 
    category: 'Commercial Law',
    subcategory: 'Corporate Law',
    structure: [
      { title: 'Title I', subtitle: 'General Provisions', query: 'RA 11232 Title I verbatim' },
      { title: 'Title II', subtitle: 'Incorporation and Organization of Private Corporations', query: 'RA 11232 Title II verbatim' },
      { title: 'Title III', subtitle: 'Board of Directors/Trustees and Officers', query: 'RA 11232 Title III verbatim' },
      { title: 'Title IV', subtitle: 'Powers of Corporations', query: 'RA 11232 Title IV verbatim' },
      { title: 'Title V', subtitle: 'By Laws', query: 'RA 11232 Title V verbatim' },
      { title: 'Title VI', subtitle: 'Meetings', query: 'RA 11232 Title VI verbatim' },
      { title: 'Title VII', subtitle: 'Stocks and Stockholders', query: 'RA 11232 Title VII verbatim' },
      { title: 'Title VIII', subtitle: 'Corporate Books and Records', query: 'RA 11232 Title VIII verbatim' },
      { title: 'Title IX', subtitle: 'Merger and Consolidation', query: 'RA 11232 Title IX verbatim' },
      { title: 'Title X', subtitle: 'Appraisal Right', query: 'RA 11232 Title X verbatim' },
      { title: 'Title XI', subtitle: 'Non-Stock Corporations', query: 'RA 11232 Title XI verbatim' },
      { title: 'Title XII', subtitle: 'Close Corporations', query: 'RA 11232 Title XII verbatim' },
      { title: 'Title XIII', subtitle: 'One Person Corporations', query: 'RA 11232 Title XIII verbatim' },
      { title: 'Title XIV', subtitle: 'Dissolution', query: 'RA 11232 Title XIV verbatim' },
      { title: 'Title XV', subtitle: 'Foreign Corporations', query: 'RA 11232 Title XV verbatim' },
      { title: 'Title XVI', subtitle: 'Investigations, Offenses, and Penalties', query: 'RA 11232 Title XVI verbatim' },
      { title: 'Title XVII', subtitle: 'Miscellaneous Provisions', query: 'RA 11232 Title XVII verbatim' },
    ]
  },
  { 
    id: 'SRC', 
    name: 'Securities Regulation Code (RA 8799)', 
    description: 'Regulation of Securities and the SEC.', 
    category: 'Commercial Law',
    subcategory: 'Securities and Insurance',
    structure: [
      { title: 'Title I', subtitle: 'Title and Definitions', query: 'RA 8799 Title I verbatim' },
      { title: 'Title II', subtitle: 'Securities and Exchange Commission', query: 'RA 8799 Title II verbatim' },
      { title: 'Title III', subtitle: 'Registration of Securities', query: 'RA 8799 Title III verbatim' },
      { title: 'Title IV', subtitle: 'Regulation of Pre-Need Plans', query: 'RA 8799 Title IV verbatim' },
      { title: 'Title V', subtitle: 'Reportorial Requirements', query: 'RA 8799 Title V verbatim' },
      { title: 'Title VII', subtitle: 'Prohibitions on Fraud, Manipulation', query: 'RA 8799 Title VII verbatim' },
      { title: 'Title VIII', subtitle: 'Regulation of Securities Market Professionals', query: 'RA 8799 Title VIII verbatim' },
    ]
  },
  { 
    id: 'INSURANCE', 
    name: 'Insurance Code (RA 10607)', 
    description: 'Insurance contracts and regulations.', 
    category: 'Commercial Law',
    subcategory: 'Securities and Insurance',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 10607 Chapter I verbatim' },
      { title: 'Chapter II', subtitle: 'The Policy', query: 'RA 10607 Chapter II verbatim' },
      { title: 'Chapter III', subtitle: 'Insurable Interest', query: 'RA 10607 Chapter III verbatim' },
      { title: 'Title IV', subtitle: 'Insurance Commissioner', query: 'RA 10607 Title IV verbatim' },
    ]
  },
  { 
    id: 'IP_CODE', 
    name: 'Intellectual Property Code (RA 8293)', 
    description: 'Copyrights, Trademarks, and Patents.', 
    category: 'Commercial Law',
    subcategory: 'Intellectual Property',
    structure: [
      { title: 'Part I', subtitle: 'The Intellectual Property Office', query: 'RA 8293 Part I verbatim' },
      { title: 'Part II', subtitle: 'The Law on Patents', query: 'RA 8293 Part II verbatim' },
      { title: 'Part III', subtitle: 'The Law on Trademarks', query: 'RA 8293 Part III verbatim' },
      { title: 'Part IV', subtitle: 'The Law on Copyright', query: 'RA 8293 Part IV verbatim' },
    ]
  },
  { 
    id: 'NIL', 
    name: 'Negotiable Instruments Law (Act 2031)', 
    description: 'Bills of Exchange and Promissory Notes.', 
    category: 'Commercial Law',
    subcategory: 'Negotiable Instruments',
    structure: [
      { title: 'Title I', subtitle: 'Negotiable Instruments in General', query: 'Negotiable Instruments Law Title I verbatim' },
      { title: 'Title II', subtitle: 'Bills of Exchange', query: 'Negotiable Instruments Law Title II verbatim' },
      { title: 'Title III', subtitle: 'Promissory Notes and Checks', query: 'Negotiable Instruments Law Title III verbatim' },
      { title: 'Title IV', subtitle: 'General Provisions', query: 'Negotiable Instruments Law Title IV verbatim' },
    ]
  },
  { 
    id: 'BANKING_LAWS', 
    name: 'Banking Laws', 
    description: 'NCBA, GBL, and Secrecy of Bank Deposits.', 
    category: 'Commercial Law',
    subcategory: 'Banking and Investments',
    structure: [
      { title: 'RA 7653', subtitle: 'New Central Bank Act', query: 'RA 7653 New Central Bank Act verbatim' },
      { title: 'RA 8791', subtitle: 'General Banking Law', query: 'RA 8791 General Banking Law verbatim' },
      { title: 'RA 1405', subtitle: 'Secrecy of Bank Deposits', query: 'RA 1405 Secrecy of Bank Deposits verbatim' },
      { title: 'PDIC', subtitle: 'PDIC Charter (RA 3591)', query: 'RA 3591 PDIC Charter verbatim' },
    ]
  },
  { 
    id: 'FRIA', 
    name: 'FRIA (RA 10142)', 
    description: 'Financial Rehabilitation and Insolvency Act.', 
    category: 'Commercial Law',
    subcategory: 'Insolvency and Secured Transactions',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 10142 Chapter I verbatim' },
      { title: 'Chapter II', subtitle: 'Court-Supervised Rehabilitation', query: 'RA 10142 Chapter II verbatim' },
      { title: 'Chapter III', subtitle: 'Pre-Negotiated Rehabilitation', query: 'RA 10142 Chapter III verbatim' },
      { title: 'Chapter VI', subtitle: 'Liquidation of Juridical Debtors', query: 'RA 10142 Chapter VI verbatim' },
    ]
  },
  { 
    id: 'PPSA', 
    name: 'PPSA (RA 11057)', 
    description: 'Personal Property Security Act.', 
    category: 'Commercial Law',
    subcategory: 'Insolvency and Secured Transactions',
    structure: [
      { title: 'Chapter 1', subtitle: 'General Provisions', query: 'RA 11057 Chapter 1 verbatim' },
      { title: 'Chapter 2', subtitle: 'Creation of Security Interest', query: 'RA 11057 Chapter 2 verbatim' },
      { title: 'Chapter 3', subtitle: 'Perfection of Security Interest', query: 'RA 11057 Chapter 3 verbatim' },
      { title: 'Chapter 6', subtitle: 'Enforcement of Security Interest', query: 'RA 11057 Chapter 6 verbatim' },
    ]
  },
  { 
    id: 'COMPETITION', 
    name: 'Philippine Competition Act (RA 10667)', 
    description: 'Anti-trust and fair competition.', 
    category: 'Commercial Law',
    subcategory: 'Competition and Trade',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 10667 Chapter I verbatim' },
      { title: 'Chapter II', subtitle: 'Philippine Competition Commission', query: 'RA 10667 Chapter II verbatim' },
      { title: 'Chapter III', subtitle: 'Prohibited Acts', query: 'RA 10667 Chapter III verbatim' },
    ]
  },
  { 
    id: 'DPA', 
    name: 'Data Privacy Act (RA 10173)', 
    description: 'Protection of personal data.', 
    category: 'Special Laws',
    subcategory: 'Cyber and Technology',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 10173 Chapter I verbatim' },
      { title: 'Chapter II', subtitle: 'The National Privacy Commission', query: 'RA 10173 Chapter II verbatim' },
      { title: 'Chapter III', subtitle: 'Processing of Personal Information', query: 'RA 10173 Chapter III verbatim' },
      { title: 'Chapter IV', subtitle: 'Rights of the Data Subject', query: 'RA 10173 Chapter IV verbatim' },
      { title: 'Chapter VIII', subtitle: 'Penalties', query: 'RA 10173 Chapter VIII verbatim' },
    ]
  },
  
  // --- LABOR LAW (COMPLETE) ---
  { 
    id: 'LABOR_CODE', 
    name: 'Labor Code (PD 442)', 
    description: 'Employment, Labor Relations, and Termination.', 
    category: 'Labor Law and Social Legislation',
    structure: [
      { title: 'Preliminary Title', subtitle: 'General Provisions', query: 'Labor Code Preliminary Title verbatim' },
      { title: 'Book I', subtitle: 'Pre-Employment', query: 'Labor Code Book I verbatim' },
      { title: 'Book II', subtitle: 'Human Resources Development', query: 'Labor Code Book II verbatim' },
      { title: 'Book III', subtitle: 'Conditions of Employment (Arts. 82-96)', query: 'Labor Code Book III verbatim' },
      { title: 'Book IV', subtitle: 'Health, Safety and Social Welfare Benefits', query: 'Labor Code Book IV verbatim' },
      { title: 'Book V', subtitle: 'Labor Relations', query: 'Labor Code Book V verbatim' },
      { title: 'Book VI', subtitle: 'Post Employment (Termination)', query: 'Labor Code Book VI verbatim' },
      { title: 'Book VII', subtitle: 'Transitory and Final Provisions', query: 'Labor Code Book VII verbatim' },
    ]
  },
  // SPECIAL LABOR LAWS
  { 
    id: 'THIRTEENTH_MONTH', 
    name: '13th Month Pay Law (PD 851)', 
    description: 'Decree Requiring Employers to Pay Their Employees a 13th Month Pay.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Special Labor Laws',
    structure: [
      { title: 'Section 1', subtitle: 'Coverage', query: 'PD 851 Section 1 verbatim' },
      { title: 'Section 2', subtitle: 'Amount', query: 'PD 851 Section 2 verbatim' },
      { title: 'Section 3', subtitle: 'Payment', query: 'PD 851 Section 3 verbatim' },
    ]
  },
  { 
    id: 'SERVICE_CHARGE', 
    name: 'Service Charge Law (RA 11360)', 
    description: 'An Act Providing that 100% of Service Charges shall be Distributed to Employees.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Special Labor Laws',
    structure: [
      { title: 'Section 1', subtitle: 'Amendment to Art 96 of Labor Code', query: 'RA 11360 Section 1 verbatim' },
      { title: 'DOLE DO 206-19', subtitle: 'Implementing Rules and Regulations', query: 'DOLE Department Order 206-19 verbatim' },
    ]
  },
  { 
    id: 'PATERNITY_LEAVE', 
    name: 'Paternity Leave Act (RA 8187)', 
    description: 'Granting Paternity Leave to all Married Male Employees.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Special Labor Laws',
    structure: [
      { title: 'Section 2', subtitle: 'Paternity Leave', query: 'RA 8187 Section 2 verbatim' },
      { title: 'Section 3', subtitle: 'Conditions', query: 'RA 8187 Section 3 verbatim' },
    ]
  },
  { 
    id: 'SOLO_PARENT', 
    name: 'Solo Parents Welfare Act (RA 11861)', 
    description: 'Expanded benefits for solo parents.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Special Labor Laws',
    structure: [
      { title: 'Section 3', subtitle: 'Definition of Terms', query: 'RA 11861 Section 3 verbatim' },
      { title: 'Section 8', subtitle: 'Parental Leave', query: 'RA 11861 Section 8 verbatim' },
      { title: 'Section 15', subtitle: 'Additional Benefits', query: 'RA 11861 Section 15 verbatim' },
    ]
  },
  { 
    id: 'KASAMBAHAY', 
    name: 'Kasambahay Law (RA 10361)', 
    description: 'Domestic Workers Act.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Special Labor Laws',
    structure: [
      { title: 'Article I', subtitle: 'General Provisions', query: 'RA 10361 Article I verbatim' },
      { title: 'Article II', subtitle: 'Rights and Privileges', query: 'RA 10361 Article II verbatim' },
      { title: 'Article III', subtitle: 'Pre-Employment', query: 'RA 10361 Article III verbatim' },
      { title: 'Article IV', subtitle: 'Employment', query: 'RA 10361 Article IV verbatim' },
      { title: 'Article V', subtitle: 'Post Employment', query: 'RA 10361 Article V verbatim' },
    ]
  },
  
  // --- TAXATION LAW (COMPLETE) ---
  { 
    id: 'TAX_CODE', 
    name: 'NIRC (RA 8424 as Amended)', 
    description: 'National Internal Revenue Code (TRAIN/CREATE).', 
    category: 'Taxation Law',
    structure: [
      { title: 'Title I', subtitle: 'Organization and Function of BIR', query: 'NIRC Title I verbatim' },
      { title: 'Title II', subtitle: 'Tax on Income', query: 'NIRC Title II Tax on Income verbatim' },
      { title: 'Title III', subtitle: 'Estate and Donor\'s Taxes', query: 'NIRC Title III verbatim' },
      { title: 'Title IV', subtitle: 'Value-Added Tax', query: 'NIRC Title IV VAT verbatim' },
      { title: 'Title V', subtitle: 'Other Percentage Taxes', query: 'NIRC Title V verbatim' },
      { title: 'Title VI', subtitle: 'Excise Taxes', query: 'NIRC Title VI verbatim' },
      { title: 'Title VII', subtitle: 'Documentary Stamp Tax', query: 'NIRC Title VII verbatim' },
      { title: 'Title VIII', subtitle: 'Remedies', query: 'NIRC Title VIII verbatim' },
      { title: 'Title IX', subtitle: 'Compliance Requirements', query: 'NIRC Title IX verbatim' },
      { title: 'Title X', subtitle: 'Statutory Offenses and Penalties', query: 'NIRC Title X verbatim' },
    ]
  },
  { 
    id: 'CMTA', 
    name: 'CMTA (RA 10863)', 
    description: 'Customs Modernization and Tariff Act.', 
    category: 'Taxation Law',
    structure: [
      { title: 'Title I', subtitle: 'Preliminary Provisions', query: 'RA 10863 Title I verbatim' },
      { title: 'Title II', subtitle: 'Bureau of Customs', query: 'RA 10863 Title II verbatim' },
      { title: 'Title IV', subtitle: 'Import Clearance and Formalities', query: 'RA 10863 Title IV verbatim' },
    ]
  },
  { 
    id: 'TAX_AMNESTY', 
    name: 'Tax Amnesty Act (RA 11213)', 
    description: 'Estate Tax Amnesty and General Tax Amnesty.', 
    category: 'Taxation Law',
    structure: [
      { title: 'Title II', subtitle: 'Estate Tax Amnesty', query: 'RA 11213 Title II verbatim' },
      { title: 'Title III', subtitle: 'General Tax Amnesty', query: 'RA 11213 Title III verbatim' },
    ]
  },
  { 
    id: 'CTA_LAW', 
    name: 'CTA Law (RA 1125/RA 9282)', 
    description: 'Jurisdiction of the Court of Tax Appeals.', 
    category: 'Taxation Law',
    structure: [
      { title: 'Section 7', subtitle: 'Jurisdiction', query: 'RA 1125 Section 7 verbatim' },
      { title: 'Section 11', subtitle: 'Who May Appeal', query: 'RA 1125 Section 11 verbatim' },
    ]
  },

  // --- SPECIAL LAWS ---
  {
    id: 'DANGEROUS_DRUGS',
    name: 'Dangerous Drugs Act (RA 9165)',
    description: 'Comprehensive Dangerous Drugs Act of 2002.',
    category: 'Special Laws',
    structure: [
      { title: 'Article I', subtitle: 'Definition of Terms', query: 'RA 9165 Article I verbatim' },
      { title: 'Article II', subtitle: 'Unlawful Acts and Penalties', query: 'RA 9165 Article II verbatim' },
      { title: 'Article III', subtitle: 'Dangerous Drugs Board', query: 'RA 9165 Article III verbatim' },
      { title: 'Article XI', subtitle: 'Jurisdiction', query: 'RA 9165 Article XI verbatim' },
    ]
  },
  {
    id: 'VAWC',
    name: 'VAWC Act (RA 9262)',
    description: 'Anti-Violence Against Women and Their Children.',
    category: 'Special Laws',
    structure: [
      { title: 'Section 3', subtitle: 'Definitions', query: 'RA 9262 Section 3 verbatim' },
      { title: 'Section 5', subtitle: 'Acts of Violence', query: 'RA 9262 Section 5 verbatim' },
      { title: 'Section 8', subtitle: 'Protection Orders', query: 'RA 9262 Section 8 verbatim' },
      { title: 'Section 24', subtitle: 'Prescriptive Period', query: 'RA 9262 Section 24 verbatim' },
    ]
  },
  {
    id: 'ANTI_GRAFT',
    name: 'Anti-Graft (RA 3019)',
    description: 'Anti-Graft and Corrupt Practices Act.',
    category: 'Special Laws',
    structure: [
      { title: 'Section 3', subtitle: 'Corrupt Practices', query: 'RA 3019 Section 3 verbatim' },
      { title: 'Section 7', subtitle: 'Statement of Assets and Liabilities', query: 'RA 3019 Section 7 verbatim' },
      { title: 'Section 9', subtitle: 'Penalties', query: 'RA 3019 Section 9 verbatim' },
    ]
  },
  {
    id: 'CHILD_ABUSE',
    name: 'Child Abuse Law (RA 7610)',
    description: 'Special Protection of Children Against Abuse.',
    category: 'Special Laws',
    structure: [
      { title: 'Article I', subtitle: 'Title and Policy', query: 'RA 7610 Article I verbatim' },
      { title: 'Article III', subtitle: 'Child Prostitution/Trafficking', query: 'RA 7610 Article III verbatim' },
      { title: 'Article VI', subtitle: 'Other Acts of Abuse', query: 'RA 7610 Article VI verbatim' },
    ]
  },
  {
    id: 'ANTI_TERROR',
    name: 'Anti-Terrorism Act (RA 11479)',
    description: 'Prevention and punishment of terrorism.',
    category: 'Special Laws',
    structure: [
      { title: 'Section 4', subtitle: 'Terrorism', query: 'RA 11479 Section 4 verbatim' },
      { title: 'Section 25', subtitle: 'Designation of Terrorist', query: 'RA 11479 Section 25 verbatim' },
      { title: 'Section 29', subtitle: 'Detention without Warrant', query: 'RA 11479 Section 29 verbatim' },
    ]
  },
  {
    id: 'SAFE_SPACES',
    name: 'Safe Spaces Act (RA 11313)',
    description: 'Bawal Bastos Law.',
    category: 'Special Laws',
    structure: [
      { title: 'Article I', subtitle: 'Gender-Based Streets/Public Spaces Harassment', query: 'RA 11313 Article I verbatim' },
      { title: 'Article II', subtitle: 'Gender-Based Online Sexual Harassment', query: 'RA 11313 Article II verbatim' },
    ]
  },
  {
    id: 'BP_22',
    name: 'Bouncing Checks Law (BP 22)',
    description: 'An Act Penalizing the Making or Drawing of Checks without Sufficient Funds.',
    category: 'Special Laws',
    structure: [
      { title: 'Section 1', subtitle: 'Checks without sufficient funds', query: 'BP 22 Section 1 verbatim' },
      { title: 'Section 2', subtitle: 'Evidence of knowledge', query: 'BP 22 Section 2 verbatim' },
    ]
  },
  {
    id: 'CPRA',
    name: 'Code of Professional Responsibility (CPRA)',
    description: 'A.M. No. 22-09-01-SC (New Ethical Code).',
    category: 'Legal and Judicial Ethics',
    structure: [
      { title: 'Canon I', subtitle: 'Independence', query: 'CPRA Canon I verbatim' },
      { title: 'Canon II', subtitle: 'Propriety', query: 'CPRA Canon II verbatim' },
      { title: 'Canon III', subtitle: 'Fidelity', query: 'CPRA Canon III verbatim' },
      { title: 'Canon IV', subtitle: 'Competence and Diligence', query: 'CPRA Canon IV verbatim' },
      { title: 'Canon V', subtitle: 'Equality', query: 'CPRA Canon V verbatim' },
      { title: 'Canon VI', subtitle: 'Accountability', query: 'CPRA Canon VI verbatim' },
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

export const BAR_SUBJECTS = [
  'Political and Public International Law',
  'Commercial and Taxation Laws',
  'Civil Law',
  'Labor Law and Social Legislation',
  'Criminal Law',
  'Remedial Law, Legal and Judicial Ethics with Practical Exercises'
];

export const LEARNER_LEVELS = [
  'Freshman Law Student',
  'Junior/Senior Law Student',
  'Bar Reviewee',
  'Lawyer / Professional'
];
