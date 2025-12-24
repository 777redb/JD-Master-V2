
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
  // --- I. POLITICAL LAW & PUBLIC INTERNATIONAL LAW ---
  {
    id: 'CONST_1987',
    name: '1987 Constitution',
    description: 'The Supreme Law of the Republic of the Philippines.',
    category: 'Political and Public International Law',
    subcategory: 'Political / Public Law',
    structure: [
      { title: 'Preamble', query: '1987 Philippine Constitution Preamble' },
      { title: 'Article I', subtitle: 'National Territory', query: '1987 Philippine Constitution Article I' },
      { title: 'Article II', subtitle: 'Declaration of Principles and State Policies', query: '1987 Philippine Constitution Article II' },
      { title: 'Article III', subtitle: 'Bill of Rights', query: '1987 Philippine Constitution Article III' },
      { title: 'Article IV', subtitle: 'Citizenship', query: '1987 Philippine Constitution Article IV' },
      { title: 'Article V', subtitle: 'Suffrage', query: '1987 Philippine Constitution Article V' },
      { title: 'Article VI', subtitle: 'Legislative Department', query: '1987 Philippine Constitution Article VI' },
      { title: 'Article VII', subtitle: 'Executive Department', query: '1987 Philippine Constitution Article VII' },
      { title: 'Article VIII', subtitle: 'Judicial Department', query: '1987 Philippine Constitution Article VIII' },
      { title: 'Article IX', subtitle: 'Constitutional Commissions', query: '1987 Philippine Constitution Article IX' },
      { title: 'Article X', subtitle: 'Local Government', query: '1987 Philippine Constitution Article X' },
      { title: 'Article XI', subtitle: 'Accountability of Public Officers', query: '1987 Philippine Constitution Article XI' },
      { title: 'Article XII', subtitle: 'National Economy and Patrimony', query: '1987 Philippine Constitution Article XII' },
      { title: 'Article XIII', subtitle: 'Social Justice and Human Rights', query: '1987 Philippine Constitution Article XIII' },
      { title: 'Article XIV', subtitle: 'Education, Science and Technology, Arts, Culture and Sports', query: '1987 Philippine Constitution Article XIV' },
      { title: 'Article XV', subtitle: 'The Family', query: '1987 Philippine Constitution Article XV' },
      { title: 'Article XVI', subtitle: 'General Provisions', query: '1987 Philippine Constitution Article XVI' },
      { title: 'Article XVII', subtitle: 'Amendments or Revisions', query: '1987 Philippine Constitution Article XVII' },
      { title: 'Article XVIII', subtitle: 'Transitory Provisions', query: '1987 Philippine Constitution Article XVIII' }
    ]
  },
  {
    id: 'ADMIN_CODE_1987',
    name: 'Administrative Code of 1987',
    description: 'Executive Order No. 292',
    category: 'Political and Public International Law',
    subcategory: 'Political / Public Law',
    structure: [
      { title: 'Introductory Provisions', query: 'Administrative Code 1987 Introductory' },
      { title: 'Book I', subtitle: 'Sovereignty and General Administration', query: 'Administrative Code 1987 Book I' },
      { title: 'Book II', subtitle: 'Distribution of Powers', query: 'Administrative Code 1987 Book II' },
      { title: 'Book III', subtitle: 'Office of the President', query: 'Administrative Code 1987 Book III' },
      { title: 'Book IV', subtitle: 'The Executive Departments', query: 'Administrative Code 1987 Book IV' },
      { title: 'Book V', subtitle: 'Constitutional Commissions', query: 'Administrative Code 1987 Book V' },
      { title: 'Book VI', subtitle: 'National Government Budgeting', query: 'Administrative Code 1987 Book VI' },
      { title: 'Book VII', subtitle: 'Administrative Procedure', query: 'Administrative Code 1987 Book VII' }
    ]
  },
  { id: 'LGC_1991', name: 'Local Government Code of 1991', description: 'RA 7160', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'OEC_BP881', name: 'Omnibus Election Code', description: 'BP Blg. 881', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'RA_7941', name: 'Party-List System Act', description: 'RA 7941', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'RA_9164', name: 'Barangay Election Law', description: 'RA 9164', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'CIVIL_SERVICE', name: 'Civil Service Law', description: 'EO 292, Book V', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'PD_1445', name: 'Revised Government Auditing Code', description: 'PD 1445', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'RA_3019', name: 'Anti-Graft and Corrupt Practices Act', description: 'RA 3019', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'RA_6713', name: 'Code of Conduct for Public Officials', description: 'RA 6713', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'JUDICIAL_AFFIDAVIT_RULE', name: 'Judicial Affidavit Rule', description: 'A.M. No. 12-8-8-SC', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'ROC_PUBLIC', name: 'Rules of Court (Public Law provisions)', description: 'Relevant provisions', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },

  { id: 'UN_CHARTER', name: 'UN Charter', description: 'Charter of the United Nations', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'VCLT_1969', name: 'Vienna Convention on the Law of Treaties', description: '1969 Convention', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'UNCLOS', name: 'UNCLOS', description: 'United Nations Convention on the Law of the Sea', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'GENEVA_CONV', name: 'Geneva Conventions & Additional Protocols', description: 'IHL Framework', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'ROME_STATUTE', name: 'Rome Statute of the ICC', description: 'International Criminal Court', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'ASEAN_CHARTER', name: 'ASEAN Charter', description: 'Association of Southeast Asian Nations', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'ICCPR', name: 'ICCPR', description: 'International Covenant on Civil and Political Rights', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'ICESCR', name: 'ICESCR', description: 'International Covenant on Economic, Social and Cultural Rights', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'CAT_UN', name: 'Convention Against Torture (CAT)', description: 'Anti-Torture framework', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'UDHR', name: 'Universal Declaration of Human Rights', description: 'UDHR 1948', category: 'Political and Public International Law', subcategory: 'Public International Law' },

  // --- II. CIVIL LAW ---
  {
    id: 'CIVIL_CODE_RA386',
    name: 'Civil Code of the Philippines',
    description: 'Republic Act No. 386',
    category: 'Civil Law',
    structure: [
      { title: 'Preliminary Title', query: 'Civil Code RA 386 Preliminary Title' },
      { 
        title: 'Book I', subtitle: 'Persons', query: 'Civil Code RA 386 Book I',
        children: [
          { title: 'Title I', subtitle: 'Civil Personality', query: 'Civil Code RA 386 Book I Title I' },
          { title: 'Title II', subtitle: 'Citizenship and Domicile', query: 'Civil Code RA 386 Book I Title II' },
          { title: 'Title III', subtitle: 'Marriage (Repealed by Family Code)', query: 'Civil Code RA 386 Book I Title III' },
          { title: 'Title IV', subtitle: 'Legal Separation (Repealed by Family Code)', query: 'Civil Code RA 386 Book I Title IV' },
          { title: 'Title XII', subtitle: 'Absence', query: 'Civil Code RA 386 Book I Title XII' },
          { title: 'Title XIII', subtitle: 'Use of Surnames', query: 'Civil Code RA 386 Book I Title XIII' }
        ]
      },
      { 
        title: 'Book II', subtitle: 'Property, Ownership, and its Modifications', query: 'Civil Code RA 386 Book II',
        children: [
          { title: 'Title I', subtitle: 'Classification of Property', query: 'Civil Code RA 386 Book II Title I' },
          { title: 'Title II', subtitle: 'Ownership', query: 'Civil Code RA 386 Book II Title II' },
          { title: 'Title III', subtitle: 'Co-ownership', query: 'Civil Code RA 386 Book II Title III' },
          { title: 'Title IV', subtitle: 'Some Special Properties', query: 'Civil Code RA 386 Book II Title IV' },
          { title: 'Title V', subtitle: 'Possession', query: 'Civil Code RA 386 Book II Title V' },
          { title: 'Title VI', subtitle: 'Usufruct', query: 'Civil Code RA 386 Book II Title VI' },
          { title: 'Title VII', subtitle: 'Easements or Servitudes', query: 'Civil Code RA 386 Book II Title VII' }
        ]
      },
      { 
        title: 'Book III', subtitle: 'Different Modes of Acquiring Ownership', query: 'Civil Code RA 386 Book III',
        children: [
          { title: 'Title I', subtitle: 'Occupation', query: 'Civil Code RA 386 Book III Title I' },
          { title: 'Title II', subtitle: 'Intellectual Creation', query: 'Civil Code RA 386 Book III Title II' },
          { title: 'Title III', subtitle: 'Donation', query: 'Civil Code RA 386 Book III Title III' },
          { title: 'Title IV', subtitle: 'Succession', query: 'Civil Code RA 386 Book III Title IV' }
        ]
      },
      { 
        title: 'Book IV', subtitle: 'Obligations and Contracts', query: 'Civil Code RA 386 Book IV',
        children: [
          { title: 'Title I', subtitle: 'Obligations', query: 'Civil Code RA 386 Book IV Title I' },
          { title: 'Title II', subtitle: 'Contracts', query: 'Civil Code RA 386 Book IV Title II' },
          { title: 'Title III', subtitle: 'Natural Obligations', query: 'Civil Code RA 386 Book IV Title III' },
          { title: 'Title IV', subtitle: 'Estoppel', query: 'Civil Code RA 386 Book IV Title IV' },
          { title: 'Title V', subtitle: 'Trusts', query: 'Civil Code RA 386 Book IV Title V' },
          { title: 'Title VI', subtitle: 'Sales', query: 'Civil Code RA 386 Book IV Title VI' },
          { title: 'Title IX', subtitle: 'Partnership', query: 'Civil Code RA 386 Book IV Title IX' },
          { title: 'Title X', subtitle: 'Agency', query: 'Civil Code RA 386 Book IV Title X' },
          { title: 'Title XI', subtitle: 'Loan', query: 'Civil Code RA 386 Book IV Title XI' }
        ]
      }
    ]
  },
  { id: 'FAMILY_CODE_EO209', name: 'Family Code of the Philippines', description: 'EO 209', category: 'Civil Law' },
  { id: 'PD_1529', name: 'Property Registration Decree', description: 'PD 1529', category: 'Civil Law' },
  { id: 'CA_141', name: 'Public Land Act', description: 'CA 141', category: 'Civil Law' },
  { id: 'LAND_REG_ACT', name: 'Land Registration Act', description: 'Act No. 496', category: 'Civil Law' },
  { id: 'CIVIL_REGISTRY_LAW', name: 'Civil Registry Law', description: 'Act No. 3753', category: 'Civil Law' },
  { id: 'PD_1083_MUSLIM', name: 'Code of Muslim Personal Laws', description: 'PD 1083', category: 'Civil Law' },
  { id: 'RA_8552_ADOPTION', name: 'Domestic Adoption Act', description: 'RA 8552', category: 'Civil Law' },
  { id: 'RA_8043_INTERADOPT', name: 'Inter-Country Adoption Act', description: 'RA 8043', category: 'Civil Law' },
  { id: 'RA_9285_ADR', name: 'Alternative Dispute Resolution Act', description: 'RA 9285', category: 'Civil Law' },
  { id: 'NOTARIAL_RULES', name: 'Notarial Practice Rules', description: 'Relevant Rules', category: 'Civil Law' },
  { id: 'GUARDIANSHIP_RULES', name: 'Rules on Guardianship', description: 'Relevant Rules', category: 'Civil Law' },
  { id: 'ESTATE_RULES', name: 'Settlement of Estate of Deceased Persons', description: 'Relevant Rules', category: 'Civil Law' },

  // --- III. CRIMINAL LAW ---
  {
    id: 'RPC_ACT3815',
    name: 'Revised Penal Code',
    description: 'Act No. 3815',
    category: 'Criminal Law',
    structure: [
      { 
        title: 'Book I', subtitle: 'General Principles', query: 'Revised Penal Code Book I',
        children: [
          { title: 'Title I', subtitle: 'Felonies and Circumstances', query: 'Revised Penal Code Book I Title I' },
          { title: 'Title II', subtitle: 'Persons Criminally Liable', query: 'Revised Penal Code Book I Title II' },
          { title: 'Title III', subtitle: 'Penalties', query: 'Revised Penal Code Book I Title III' },
          { title: 'Title IV', subtitle: 'Extinction of Criminal Liability', query: 'Revised Penal Code Book I Title IV' },
          { title: 'Title V', subtitle: 'Civil Liability', query: 'Revised Penal Code Book I Title V' }
        ]
      },
      { 
        title: 'Book II', subtitle: 'Crimes and Penalties', query: 'Revised Penal Code Book II',
        children: [
          { title: 'Title I', subtitle: 'Crimes Against National Security', query: 'Revised Penal Code Book II Title I' },
          { title: 'Title II', subtitle: 'Crimes Against Fundamental Laws of the State', query: 'Revised Penal Code Book II Title II' },
          { title: 'Title III', subtitle: 'Crimes Against Public Order', query: 'Revised Penal Code Book II Title III' },
          { title: 'Title IV', subtitle: 'Crimes Against Public Interest', query: 'Revised Penal Code Book II Title IV' },
          { title: 'Title VIII', subtitle: 'Crimes Against Persons', query: 'Revised Penal Code Book II Title VIII' },
          { title: 'Title IX', subtitle: 'Crimes Against Personal Liberty and Security', query: 'Revised Penal Code Book II Title IX' },
          { title: 'Title X', subtitle: 'Crimes Against Property', query: 'Revised Penal Code Book II Title X' },
          { title: 'Title XI', subtitle: 'Crimes Against Chastity', query: 'Revised Penal Code Book II Title XI' }
        ]
      }
    ]
  },
  { id: 'ACT_4103_ISL', name: 'Indeterminate Sentence Law', description: 'Act No. 4103', category: 'Criminal Law' },
  { id: 'PD_968_PROBATION', name: 'Probation Law', description: 'PD 968', category: 'Criminal Law' },
  { id: 'RA_11053_HAZING', name: 'Anti-Hazing Act', description: 'RA 11053', category: 'Criminal Law' },
  { id: 'RA_9165_DRUGS', name: 'Dangerous Drugs Act', description: 'RA 9165', category: 'Criminal Law' },
  { id: 'RA_9208_TRAFFICKING', name: 'Anti-Trafficking in Persons Act', description: 'RA 9208', category: 'Criminal Law' },
  { id: 'RA_8353_RAPE', name: 'Anti-Rape Law', description: 'RA 8353', category: 'Criminal Law' },
  { id: 'RA_9262_VAWC', name: 'Violence Against Women and Children Act', description: 'RA 9262', category: 'Criminal Law' },
  { id: 'RA_9344_JUVENILE', name: 'Juvenile Justice and Welfare Act', description: 'RA 9344', category: 'Criminal Law' },
  { id: 'RA_10175_CYBER', name: 'Cybercrime Prevention Act', description: 'RA 10175', category: 'Criminal Law' },
  { id: 'RA_11479_TERROR', name: 'Anti-Terrorism Act', description: 'RA 11479', category: 'Criminal Law' },

  // --- IV. REMEDIAL LAW ---
  {
    id: 'RULES_OF_COURT',
    name: 'Rules of Court',
    description: 'Procedural Law of the Philippines.',
    category: 'Remedial Law',
    structure: [
      { title: 'Civil Procedure', query: 'Rules of Court Civil Procedure' },
      { title: 'Criminal Procedure', query: 'Rules of Court Criminal Procedure' },
      { title: 'Evidence', query: 'Rules of Court Evidence' },
      { title: 'Special Proceedings', query: 'Rules of Court Special Proceedings' }
    ]
  },
  { id: 'ROC_2019_AMEND', name: 'Revised Rules of Civil Procedure (2019 Amendments)', description: 'AM No. 19-10-20-SC', category: 'Remedial Law' },
  { id: 'ELECTRONIC_EVID', name: 'Rules on Electronic Evidence', description: 'AM No. 01-7-01-SC', category: 'Remedial Law' },
  { id: 'SUMMARY_PROC', name: 'Rules on Summary Procedure', description: 'Rules of Court', category: 'Remedial Law' },
  { id: 'JUDICIAL_AFFIDAVIT', name: 'Judicial Affidavit Rule', description: 'AM No. 12-8-8-SC', category: 'Remedial Law' },
  { id: 'SMALL_CLAIMS_RULES', name: 'Rules on Small Claims', description: 'Simplified procedure', category: 'Remedial Law' },
  { id: 'WRIT_AMPARO', name: 'Rules on Writ of Amparo', description: 'AM No. 07-9-12-SC', category: 'Remedial Law' },
  { id: 'WRIT_HABEAS_DATA', name: 'Rules on Writ of Habeas Data', description: 'AM No. 08-1-16-SC', category: 'Remedial Law' },
  { id: 'WRIT_KALIKASAN', name: 'Rules on Writ of Kalikasan', description: 'Environmental Procedure', category: 'Remedial Law' },
  { id: 'RULES_ADR', name: 'Rules on Alternative Dispute Resolution', description: 'ADR Procedure', category: 'Remedial Law' },
  { id: 'PROVISIONAL_REMEDIES', name: 'Rules on Provisional Remedies', description: 'Interim relief', category: 'Remedial Law' },

  // --- V. COMMERCIAL LAW ---
  { id: 'CODE_OF_COMMERCE', name: 'Code of Commerce', description: 'Relevant provisions', category: 'Commercial Law' },
  { id: 'RA_11232_RCC', name: 'Revised Corporation Code', description: 'RA 11232', category: 'Commercial Law' },
  { id: 'ACT_2031_NIL', name: 'Negotiable Instruments Law', description: 'Act No. 2031', category: 'Commercial Law' },
  { id: 'PD_612_INSURANCE', name: 'Insurance Code', description: 'PD 612 as amended', category: 'Commercial Law' },
  { id: 'RA_8799_SRC', name: 'Securities Regulation Code', description: 'RA 8799', category: 'Commercial Law' },
  { id: 'RA_8791_GBL', name: 'General Banking Law', description: 'RA 8791', category: 'Commercial Law', subcategory: 'Banking Laws' },
  { id: 'RA_7653_NCBA', name: 'New Central Bank Act', description: 'RA 7653 / RA 11211', category: 'Commercial Law', subcategory: 'Banking Laws' },
  { id: 'RA_8293_IPCODE', name: 'Intellectual Property Code', description: 'RA 8293', category: 'Commercial Law' },
  { id: 'RA_8792_ECOMMERCE', name: 'E-Commerce Act', description: 'RA 8792', category: 'Commercial Law' },
  { id: 'PD_115_TRUSTREC', name: 'Trust Receipts Law', description: 'PD 115', category: 'Commercial Law' },
  { id: 'CHATTEL_MORTGAGE', name: 'Chattel Mortgage Law', description: 'Act No. 1508', category: 'Commercial Law' },
  { id: 'WAREHOUSE_REC', name: 'Warehouse Receipts Law', description: 'Act No. 2137', category: 'Commercial Law' },

  // --- VI. LABOR LAW & SOCIAL LEGISLATION ---
  {
    id: 'LABOR_CODE_PD442',
    name: 'Labor Code of the Philippines',
    description: 'Presidential Decree No. 442',
    category: 'Labor Law and Social Legislation',
    structure: [
      { title: 'Preliminary Title', query: 'Labor Code PD 442 Preliminary Title' },
      { title: 'Book I', subtitle: 'Pre-employment', query: 'Labor Code PD 442 Book I' },
      { title: 'Book II', subtitle: 'Human Resources Development Program', query: 'Labor Code PD 442 Book II' },
      { title: 'Book III', subtitle: 'Conditions of Employment', query: 'Labor Code PD 442 Book III' },
      { title: 'Book IV', subtitle: 'Health, Safety and Social Welfare Benefits', query: 'Labor Code PD 442 Book IV' },
      { title: 'Book V', subtitle: 'Labor Relations', query: 'Labor Code PD 442 Book V' },
      { title: 'Book VI', subtitle: 'Post-employment', query: 'Labor Code PD 442 Book VI' },
      { title: 'Book VII', subtitle: 'Penal Provisions, Transitory and Final Provisions', query: 'Labor Code PD 442 Book VII' }
    ]
  },
  { id: 'DOLE_RULES', name: 'DOLE Rules', description: 'Department of Labor and Employment Rules', category: 'Labor Law and Social Legislation' },
  { id: 'RA_11199_SSS', name: 'Social Security Act', description: 'RA 11199', category: 'Labor Law and Social Legislation' },
  { id: 'RA_8291_GSIS', name: 'GSIS Act', description: 'RA 8291', category: 'Labor Law and Social Legislation' },
  { id: 'RA_11223_PHILHEALTH', name: 'PhilHealth Law', description: 'RA 11223', category: 'Labor Law and Social Legislation' },
  { id: 'EMP_COMP_LAW', name: 'Employees’ Compensation Law', description: 'Relevant provisions', category: 'Labor Law and Social Legislation' },
  { id: 'RA_10361_KASAMBAHAY', name: 'Kasambahay Law', description: 'RA 10361', category: 'Labor Law and Social Legislation' },
  { id: 'RA_8042_MIGRANT', name: 'Migrant Workers Act', description: 'RA 8042 as amended', category: 'Labor Law and Social Legislation' },
  { id: 'ANTI_ILLEGAL_REC', name: 'Anti-Illegal Recruitment Law', description: 'Relevant provisions', category: 'Labor Law and Social Legislation' },
  { id: 'RA_11058_OSH', name: 'Occupational Safety and Health Law', description: 'RA 11058', category: 'Labor Law and Social Legislation' },

  // --- VII. TAXATION LAW ---
  {
    id: 'NIRC_RA8424',
    name: 'National Internal Revenue Code (NIRC)',
    description: 'RA 8424 as amended',
    category: 'Taxation Law',
    structure: [
      { title: 'Title I', subtitle: 'Organization and Administration', query: 'NIRC RA 8424 Title I' },
      { title: 'Title II', subtitle: 'Tax on Income', query: 'NIRC RA 8424 Title II' },
      { title: 'Title III', subtitle: 'Estate and Donor\'s Taxes', query: 'NIRC RA 8424 Title III' },
      { title: 'Title IV', subtitle: 'Value-Added Tax', query: 'NIRC RA 8424 Title IV' },
      { title: 'Title V', subtitle: 'Other Percentage Taxes', query: 'NIRC RA 8424 Title V' },
      { title: 'Title VI', subtitle: 'Excise Taxes on Certain Goods', query: 'NIRC RA 8424 Title VI' }
    ]
  },
  { id: 'LGC_TAX_PROV', name: 'Local Government Code (Taxation Provisions)', description: 'RA 7160', category: 'Taxation Law' },
  { id: 'RA_10863_CMTA', name: 'Customs Modernization and Tariff Act', description: 'RA 10863', category: 'Taxation Law' },
  { id: 'TARIFF_CUSTOMS_LEGACY', name: 'Tariff and Customs Code', description: 'Legacy provisions', category: 'Taxation Law' },
  { id: 'RA_10963_TRAIN', name: 'TRAIN Law', description: 'RA 10963', category: 'Taxation Law' },
  { id: 'RA_11534_CREATE', name: 'CREATE Act', description: 'RA 11534', category: 'Taxation Law' },
  { id: 'REAL_PROPERTY_TAX', name: 'Real Property Tax Code', description: 'Relevant provisions', category: 'Taxation Law' },
  { id: 'BIR_REGS', name: 'BIR Regulations', description: 'Bureau of Internal Revenue Regulations', category: 'Taxation Law' },

  // --- VIII. LEGAL & JUDICIAL ETHICS ---
  { id: 'CPR_LEGACY', name: 'Code of Professional Responsibility', description: 'Legacy code', category: 'Legal and Judicial Ethics' },
  { id: 'CPRA_2023', name: 'Code of Professional Responsibility and Accountability (CPRA)', description: 'Updated 2023 Code', category: 'Legal and Judicial Ethics' },
  { id: 'CANONS_JUDICIAL', name: 'Canons of Judicial Ethics', description: 'Relevant Canons', category: 'Legal and Judicial Ethics' },
  { id: 'NEW_JUDICIAL_CONDUCT', name: 'New Code of Judicial Conduct', description: 'AM No. 03-05-01-SC', category: 'Legal and Judicial Ethics' },
  { id: 'ROC_ATTORNEY', name: 'Rules of Court (Attorney Discipline)', description: 'Relevant provisions', category: 'Legal and Judicial Ethics' },
  { id: 'NOTARIAL_PRACTICE_ETHICS', name: 'Rules on Notarial Practice', description: 'Ethics focus', category: 'Legal and Judicial Ethics' },
  { id: 'JUDICIAL_INTEGRITY_RULES', name: 'Judicial Integrity Board Rules', description: 'Relevant Rules', category: 'Legal and Judicial Ethics' },
  { id: 'IBP_BYLAWS', name: 'IBP By-Laws', description: 'Integrated Bar of the Philippines', category: 'Legal and Judicial Ethics' },

  // --- IX. ENVIRONMENTAL LAW ---
  { id: 'PD_1152_ENV_CODE', name: 'Philippine Environmental Code', description: 'PD 1152', category: 'Environmental Law' },
  { id: 'RA_8749_CLEAN_AIR', name: 'Clean Air Act', description: 'RA 8749', category: 'Environmental Law' },
  { id: 'RA_9275_CLEAN_WATER', name: 'Clean Water Act', description: 'RA 9275', category: 'Environmental Law' },
  { id: 'RA_9003_SOLID_WASTE', name: 'Ecological Solid Waste Management Act', description: 'RA 9003', category: 'Environmental Law' },
  { id: 'PD_1586_EIS', name: 'Environmental Impact Statement Law', description: 'PD 1586', category: 'Environmental Law' },
  { id: 'RA_7586_NIPAS', name: 'National Integrated Protected Areas System Act', description: 'RA 7586 / RA 11038', category: 'Environmental Law' },
  { id: 'RA_9147_WILDLIFE', name: 'Wildlife Resources Conservation Act', description: 'RA 9147', category: 'Environmental Law' },
  { id: 'RA_9729_CLIMATE', name: 'Climate Change Act', description: 'RA 9729', category: 'Environmental Law' },
  { id: 'ENV_RULES_PROC', name: 'Rules of Procedure for Environmental Cases', description: 'Special procedural rules', category: 'Environmental Law' },

  // --- X. SPECIAL LAWS ---
  { id: 'RA_9160_AMLA', name: 'Anti-Money Laundering Act', description: 'RA 9160', category: 'Special Laws' },
  { id: 'RA_10173_PRIVACY', name: 'Data Privacy Act', description: 'RA 10173', category: 'Special Laws' },
  { id: 'FOI_EO', name: 'Freedom of Information EO', description: 'Executive Order No. 2', category: 'Special Laws' },
  { id: 'RA_11032_ARTA', name: 'Anti-Red Tape Act', description: 'RA 11032', category: 'Special Laws' },
  { id: 'FOREIGN_INVEST_ACT', name: 'Foreign Investments Act', description: 'RA 7042', category: 'Special Laws' },
  { id: 'PPP_LAW', name: 'Public–Private Partnership Law', description: 'RA 11957', category: 'Special Laws' },
  { id: 'ANTI_DUMMY_LAW', name: 'Anti-Dummy Law', description: 'CA 108', category: 'Special Laws' },
  { id: 'RA_10667_COMPETITION', name: 'Philippine Competition Act', description: 'RA 10667', category: 'Special Laws' },
  { id: 'HUMAN_SEC_TERROR', name: 'Human Security / Anti-Terrorism Laws', description: 'Relevant provisions', category: 'Special Laws' },
  { id: 'RA_7279_UDHA', name: 'Urban Development and Housing Act', description: 'RA 7279', category: 'Special Laws' }
];

export const JURISPRUDENCE_TOPICS = [
  {
    category: 'Political & Public International Law',
    topics: [
      { title: 'Judicial Power & Review', query: 'Philippine Judicial Power and the power of Judicial Review Article VIII Section 1' },
      { title: 'Separation of Powers', query: 'Doctrine of Separation of Powers and Checks and Balances in the Philippines' },
      { title: 'State Immunity', query: 'Doctrine of State Immunity from Suit and the exceptions under Philippine law' }
    ]
  },
  {
    category: 'Criminal Law',
    topics: [
      { title: 'Self-Defense', query: 'Requisites of Justifying Circumstances under Article 11 RPC' },
      { title: 'Conspiracy', query: 'Doctrine of Conspiracy: The act of one is the act of all' }
    ]
  }
];

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'DEED_SALE',
    name: 'Deed of Absolute Sale',
    description: 'Transfer ownership of real or personal property.',
    fields: ['Seller Name', 'Buyer Name', 'Property Description (TCT No.)', 'Purchase Price', 'Location']
  }
];

export const LEARNER_LEVELS = [
  'Freshman Law Student',
  'Junior/Senior Law Student',
  'Bar Reviewee',
  'Lawyer / Professional'
];
