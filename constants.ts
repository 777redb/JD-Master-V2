
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

// FIX: Added PHILIPPINE_CODALS export which was missing but referenced in CodalLibrary.tsx
export const PHILIPPINE_CODALS: LawCode[] = [
  {
    id: 'CONST_1987',
    name: '1987 Constitution',
    description: 'The supreme law of the Republic of the Philippines.',
    category: 'Political and Public International Law',
    structure: [
      { title: 'Preamble', query: 'Preamble of the 1987 Philippine Constitution' },
      { title: 'Article I', subtitle: 'National Territory', query: 'Article I 1987 Philippine Constitution' },
      { title: 'Article II', subtitle: 'Declaration of Principles and State Policies', query: 'Article II 1987 Philippine Constitution' },
      { title: 'Article III', subtitle: 'Bill of Rights', query: 'Article III 1987 Philippine Constitution' },
      { title: 'Article IV', subtitle: 'Citizenship', query: 'Article IV 1987 Philippine Constitution' },
      { title: 'Article V', subtitle: 'Suffrage', query: 'Article V 1987 Philippine Constitution' },
      { title: 'Article VI', subtitle: 'Legislative Department', query: 'Article VI 1987 Philippine Constitution' },
      { title: 'Article VII', subtitle: 'Executive Department', query: 'Article VII 1987 Philippine Constitution' },
      { title: 'Article VIII', subtitle: 'Judicial Department', query: 'Article VIII 1987 Philippine Constitution' }
    ]
  },
  {
    id: 'CIVIL_CODE',
    name: 'Civil Code',
    description: 'Republic Act No. 386',
    category: 'Civil Law',
    structure: [
      { title: 'Book I', subtitle: 'Persons and Family Relations', query: 'Civil Code of the Philippines Book I' },
      { title: 'Book II', subtitle: 'Property, Ownership, and its Modifications', query: 'Civil Code of the Philippines Book II' },
      { title: 'Book III', subtitle: 'Different Modes of Acquiring Ownership', query: 'Civil Code of the Philippines Book III' },
      { title: 'Book IV', subtitle: 'Obligations and Contracts', query: 'Civil Code of the Philippines Book IV' }
    ]
  },
  {
    id: 'REVISED_PENAL_CODE',
    name: 'Revised Penal Code',
    description: 'Act No. 3815',
    category: 'Criminal Law',
    structure: [
      { title: 'Book I', subtitle: 'General Provisions', query: 'Revised Penal Code Book I' },
      { title: 'Book II', subtitle: 'Crimes and Penalties', query: 'Revised Penal Code Book II' }
    ]
  },
  {
    id: 'LABOR_CODE',
    name: 'Labor Code',
    description: 'Presidential Decree No. 442',
    category: 'Labor Law and Social Legislation',
    structure: [
      { title: 'Book I', subtitle: 'Pre-Employment', query: 'Labor Code of the Philippines Book I' },
      { title: 'Book II', subtitle: 'Human Resources Development Program', query: 'Labor Code of the Philippines Book II' },
      { title: 'Book III', subtitle: 'Conditions of Employment', query: 'Labor Code of the Philippines Book III' }
    ]
  }
];

export const JURISPRUDENCE_TOPICS = [
  {
    category: 'Political & Public International Law',
    topics: [
      { title: 'Judicial Power & Review', query: 'Philippine Judicial Power and the power of Judicial Review Article VIII Section 1' },
      { title: 'Separation of Powers', query: 'Doctrine of Separation of Powers and Checks and Balances in the Philippines' },
      { title: 'Delegation of Powers', query: 'Non-delegability of legislative power and the Completeness & Sufficient Standard Tests' },
      { title: 'State Immunity', query: 'Doctrine of State Immunity from Suit and the exceptions under Philippine law' },
      { title: 'Due Process of Law', query: 'Procedural vs Substantive Due Process landmark Philippine cases' },
      { title: 'Equal Protection', query: 'Equal Protection Clause and valid classification requisites in PH law' },
      { title: 'Search & Seizure', query: 'Article III Section 2: Requisites of a valid warrant and warrantless searches' },
      { title: 'Freedom of Expression', query: 'Prior Restraint, Subsequent Punishment, and Content-based vs Content-neutral regulations' },
      { title: 'Eminent Domain', query: 'Requisites for the exercise of the Power of Eminent Domain by the State' },
      { title: 'Citizenship & Naturalization', query: 'Jus Sanguinis principle and Judicial Naturalization in the Philippines' },
      { title: 'Local Government Autonomy', query: 'Decentralization of Administration vs Decentralization of Power in LGUs' },
      { title: 'Public International Law', query: 'Doctrine of Incorporation vs Transformation and International Law Sources' }
    ]
  },
  {
    category: 'Civil Law',
    topics: [
      { title: 'Psychological Incapacity', query: 'Article 36 Family Code and the evolution of the Tan-Andal Doctrine' },
      { title: 'Property & Ownership', query: 'Landmark rulings on Builder in Good Faith vs Builder in Bad Faith' },
      { title: 'Obligations & Contracts', query: 'Principle of Relativity, Mutuality, and Autonomy of Contracts' },
      { title: 'Succession & Wills', query: 'Doctrines on Preterition, Reserval Troncal, and Disinheritance' },
      { title: 'Torts & Damages', query: 'Vicarious Liability and the Res Ipsa Loquitur doctrine in PH law' },
      { title: 'Sales & Lease', query: 'Right of First Refusal vs Option Contract in Philippine Sales Law' },
      { title: 'Credit Transactions', query: 'Distinction between Mutuum and Commodatum with relevant jurisprudence' },
      { title: 'Conflict of Laws', query: 'Lex Loci Celebrationis vs Lex Rei Sitae vs Mobilia Sequuntur Personam' }
    ]
  },
  {
    category: 'Criminal Law',
    topics: [
      { title: 'Self-Defense', query: 'Requisites of Justifying Circumstances under Article 11 RPC' },
      { title: 'Conspiracy', query: 'Doctrine of Conspiracy: The act of one is the act of all' },
      { title: 'Mala in Se vs Mala Prohibita', query: 'Distinction between Crimes under RPC and Special Penal Laws' },
      { title: 'Impossible Crime', query: 'Requisites of an Impossible Crime under the Revised Penal Code' },
      { title: 'Complex Crimes', query: 'Article 48 RPC: Compound Crimes vs Complex Crimes Proper' },
      { title: 'Stages of Execution', query: 'Attempted, Frustrated, and Consummated stages of felonies' },
      { title: 'Pro Reo Principle', query: 'The In Dubio Pro Reo rule in Philippine Criminal Jurisprudence' },
      { title: 'Battered Woman Syndrome', query: 'RA 9262 and the Battered Woman Syndrome as a defense' }
    ]
  },
  {
    category: 'Remedial Law',
    topics: [
      { title: 'Hierarchy of Courts', query: 'Doctrine of Hierarchy of Courts and the exceptions for direct recourse' },
      { title: 'Res Judicata', query: 'Requisites of Res Judicata: Bar by Prior Judgment vs Conclusiveness of Judgment' },
      { title: 'Forum Shopping', query: 'Test to determine Forum Shopping and the consequences of its violation' },
      { title: 'Rule 65: Certiorari', query: 'Grave Abuse of Discretion amounting to lack or excess of jurisdiction' },
      { title: 'Evidence: Hearsay Rule', query: 'Exceptions to the Hearsay Rule in the Revised Rules on Evidence' },
      { title: 'Writ of Amparo', query: 'Nature, coverage, and the "substantial evidence" requirement in Amparo' },
      { title: 'Chain of Custody', query: 'Section 21 of RA 9165 and the effect of its non-compliance' },
      { title: 'Fresh Period Rule', query: 'Neypes Doctrine: The fresh 15-day period to file an appeal' }
    ]
  },
  {
    category: 'Commercial Law',
    topics: [
      { title: 'Business Judgment Rule', query: 'Doctrine of Business Judgment Rule in Philippine Corporation Law' },
      { title: 'Piercing the Corporate Veil', query: 'When to disregard the separate juridical personality of a corporation' },
      { title: 'Trust Fund Doctrine', query: 'Protection of creditors under the Trust Fund Doctrine' },
      { title: 'Insurance: Insurable Interest', query: 'Insurable Interest in Life vs Property under the Insurance Code' },
      { title: 'Negotiable Instruments', query: 'Holder in Due Course requisites and the Shelter Rule' },
      { title: 'Intellectual Property', query: 'Holistic Test vs Dominancy Test in Trademark Infringement' },
      { title: 'Banking: Secrecy Laws', query: 'Exceptions to the Law on Secrecy of Bank Deposits' },
      { title: 'Financial Rehabilitation', query: 'Concepts of Insolvency and Liquidation under FRIA' }
    ]
  },
  {
    category: 'Labor Law & Social Legislation',
    topics: [
      { title: 'Employer-Employee Relationship', query: 'The Four-Fold Test and the Economic Reality Test' },
      { title: 'Security of Tenure', query: 'Substantial and Procedural Due Process in termination cases' },
      { title: 'Labor Standards: Wages', query: 'Principle of "A Fair Day\'s Wage for a Fair Day\'s Labor"' },
      { title: 'Unionism & Collective Bargaining', query: 'Duty to bargain collectively and Unfair Labor Practices' },
      { title: 'Managerial vs Rank-and-File', query: 'Distinction of employees under the Labor Code and their rights' },
      { title: 'Social Security', query: 'SSS and GSIS benefits and the Social Justice principle' }
    ]
  },
  {
    category: 'Taxation Law',
    topics: [
      { title: 'Lifeblood Doctrine', query: 'Taxes are the lifeblood of the government: Lifeblood Doctrine cases' },
      { title: 'Tax Exemption', query: 'Strictissimi Juris: Strict construction of tax exemptions' },
      { title: 'Double Taxation', query: 'Direct Duplicate vs Indirect Duplicate Taxation in the Philippines' },
      { title: 'Tax Remedies', query: 'Assessment and Collection remedies under the NIRC' },
      { title: 'Local Government Taxation', query: 'Fundamental principles of local taxation under the LGC' }
    ]
  },
  {
    category: 'Legal & Judicial Ethics',
    topics: [
      { title: 'CPRA: Fidelity', query: 'Canon III of the Code of Professional Responsibility and Accountability' },
      { title: 'Conflict of Interest', query: 'Prohibitions on lawyers representing conflicting interests' },
      { title: 'Attorney-Client Privilege', query: 'The sanctity and duration of the Attorney-Client relationship' },
      { title: 'Judicial Conduct', query: 'New Code of Judicial Conduct and the principle of Impartiality' },
      { title: 'Integrated Bar (IBP)', query: 'Nature of the Integrated Bar and the power of the SC over the legal profession' }
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
