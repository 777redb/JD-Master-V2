
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
    description: 'Supreme Law of the Philippines',
    category: 'Political and Public International Law',
    subcategory: 'Political / Public Law',
    structure: [
      { title: 'Preamble', query: '1987 Constitution Preamble' },
      { title: 'Article I', subtitle: 'National Territory', query: 'Constitution Article I' },
      { title: 'Article II', subtitle: 'Declaration of Principles', query: 'Constitution Article II' },
      { title: 'Article III', subtitle: 'Bill of Rights', query: 'Constitution Article III' },
      { title: 'Article IV', subtitle: 'Citizenship', query: 'Constitution Article IV' },
      { title: 'Article V', subtitle: 'Suffrage', query: 'Constitution Article V' },
      { title: 'Article VI', subtitle: 'Legislative Department', query: 'Constitution Article VI' },
      { title: 'Article VII', subtitle: 'Executive Department', query: 'Constitution Article VII' },
      { title: 'Article VIII', subtitle: 'Judicial Department', query: 'Constitution Article VIII' },
      { title: 'Article IX', subtitle: 'Constitutional Commissions', query: 'Constitution Article IX' },
      { title: 'Article X', subtitle: 'Local Government', query: 'Constitution Article X' },
      { title: 'Article XI', subtitle: 'Accountability of Public Officers', query: 'Constitution Article XI' },
      { title: 'Article XII', subtitle: 'National Economy and Patrimony', query: 'Constitution Article XII' },
      { title: 'Article XIII', subtitle: 'Social Justice and Human Rights', query: 'Constitution Article XIII' },
      { title: 'Article XIV', subtitle: 'Education, Arts and Sports', query: 'Constitution Article XIV' },
      { title: 'Article XV', subtitle: 'The Family', query: 'Constitution Article XV' },
      { title: 'Article XVI', subtitle: 'General Provisions', query: 'Constitution Article XVI' },
      { title: 'Article XVII', subtitle: 'Amendments', query: 'Constitution Article XVII' },
      { title: 'Article XVIII', subtitle: 'Transitory Provisions', query: 'Constitution Article XVIII' }
    ]
  },
  {
    id: 'EO_292_ADMIN',
    name: 'Administrative Code of 1987',
    description: 'Executive Order No. 292',
    category: 'Political and Public International Law',
    subcategory: 'Political / Public Law',
    structure: [
      { title: 'Book I', subtitle: 'Sovereignty and Gen Admin', query: 'Admin Code Book I' },
      { title: 'Book II', subtitle: 'Distribution of Powers', query: 'Admin Code Book II' },
      { title: 'Book III', subtitle: 'Office of the President', query: 'Admin Code Book III' },
      { title: 'Book IV', subtitle: 'Executive Departments', query: 'Admin Code Book IV' },
      { title: 'Book V', subtitle: 'Constitutional Commissions', query: 'Admin Code Book V' },
      { title: 'Book VI', subtitle: 'National Government Budgeting', query: 'Admin Code Book VI' },
      { title: 'Book VII', subtitle: 'Administrative Procedure', query: 'Admin Code Book VII' }
    ]
  },
  { id: 'RA_7160_LGC', name: 'Local Government Code of 1991', description: 'RA 7160', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'BP_881_OEC', name: 'Omnibus Election Code', description: 'BP Blg. 881', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'RA_7941', name: 'Party-List System Act', description: 'RA 7941', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'RA_9164', name: 'Barangay Election Law', description: 'RA 9164', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'PD_1445', name: 'Revised Gov Auditing Code', description: 'PD 1445', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'RA_3019', name: 'Anti-Graft Act', description: 'RA 3019', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'RA_6713', name: 'Code of Conduct (Ethical Standards)', description: 'RA 6713', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },
  { id: 'JUDICIAL_AFF_RULE', name: 'Judicial Affidavit Rule', description: 'AM No. 12-8-8-SC', category: 'Political and Public International Law', subcategory: 'Political / Public Law' },

  { id: 'UN_CHARTER', name: 'UN Charter', description: 'United Nations', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'VCLT', name: 'Vienna Convention Law of Treaties', description: 'Treaties', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'UNCLOS', name: 'UNCLOS', description: 'Law of the Sea', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'GENEVA_CONV', name: 'Geneva Conventions', description: 'IHL', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'ROME_STATUTE', name: 'Rome Statute of the ICC', description: 'Intl Criminal Law', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'ASEAN_CHARTER', name: 'ASEAN Charter', description: 'ASEAN', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'ICCPR', name: 'ICCPR', description: 'Civil and Political Rights', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'ICESCR', name: 'ICESCR', description: 'Econ, Social, Cultural Rights', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'CAT', name: 'Convention Against Torture', description: 'Human Rights', category: 'Political and Public International Law', subcategory: 'Public International Law' },
  { id: 'UDHR', name: 'Universal Declaration of Human Rights', description: 'UDHR', category: 'Political and Public International Law', subcategory: 'Public International Law' },

  // --- II. CIVIL LAW ---
  {
    id: 'CIVIL_CODE',
    name: 'Civil Code of the Philippines',
    description: 'Republic Act No. 386',
    category: 'Civil Law',
    structure: [
      { title: 'Preliminary Title', query: 'Civil Code Preliminary Title' },
      { title: 'Book I', subtitle: 'Persons', query: 'Civil Code Book I' },
      { title: 'Book II', subtitle: 'Property', query: 'Civil Code Book II' },
      { title: 'Book III', subtitle: 'Modes of Acquiring Ownership', query: 'Civil Code Book III' },
      { title: 'Book IV', subtitle: 'Obligations and Contracts', query: 'Civil Code Book IV' }
    ]
  },
  { id: 'FAMILY_CODE', name: 'Family Code', description: 'EO 209', category: 'Civil Law' },
  { id: 'PD_1529', name: 'Property Registration Decree', description: 'PD 1529', category: 'Civil Law' },
  { id: 'CA_141', name: 'Public Land Act', description: 'CA 141', category: 'Civil Law' },
  { id: 'ACT_496', name: 'Land Registration Act', description: 'Act 496', category: 'Civil Law' },
  { id: 'ACT_3753', name: 'Civil Registry Law', description: 'Act 3753', category: 'Civil Law' },
  { id: 'PD_1083', name: 'Code of Muslim Personal Laws', description: 'PD 1083', category: 'Civil Law' },
  { id: 'RA_8552', name: 'Domestic Adoption Act', description: 'RA 8552', category: 'Civil Law' },
  { id: 'RA_8043', name: 'Inter-Country Adoption Act', description: 'RA 8043', category: 'Civil Law' },
  { id: 'RA_9285', name: 'ADR Act of 2004', description: 'RA 9285', category: 'Civil Law' },
  { id: 'NOTARIAL_RULES', name: 'Notarial Practice Rules', description: 'Legal Practice', category: 'Civil Law' },
  { id: 'RULES_GUARDIANSHIP', name: 'Rules on Guardianship', description: 'Special Proceedings', category: 'Civil Law' },
  { id: 'ESTATE_SETTLEMENT', name: 'Settlement of Estate Rules', description: 'Special Proceedings', category: 'Civil Law' },

  // --- III. CRIMINAL LAW ---
  {
    id: 'REVISED_PENAL_CODE',
    name: 'Revised Penal Code',
    description: 'Act No. 3815',
    category: 'Criminal Law',
    structure: [
      { title: 'Book I', subtitle: 'General Principles', query: 'RPC Book I' },
      { title: 'Book II', subtitle: 'Crimes and Penalties', query: 'RPC Book II' }
    ]
  },
  { id: 'ACT_4103', name: 'Indeterminate Sentence Law', description: 'Act 4103', category: 'Criminal Law' },
  { id: 'PD_968', name: 'Probation Law', description: 'PD 968', category: 'Criminal Law' },
  { id: 'RA_11053', name: 'Anti-Hazing Act', description: 'RA 11053', category: 'Criminal Law' },
  { id: 'RA_9165', name: 'Dangerous Drugs Act', description: 'RA 9165', category: 'Criminal Law' },
  { id: 'RA_9208', name: 'Anti-Trafficking Act', description: 'RA 9208', category: 'Criminal Law' },
  { id: 'RA_8353', name: 'Anti-Rape Law', description: 'RA 8353', category: 'Criminal Law' },
  { id: 'RA_9262', name: 'VAWC Act', description: 'RA 9262', category: 'Criminal Law' },
  { id: 'RA_9344', name: 'Juvenile Justice Act', description: 'RA 9344', category: 'Criminal Law' },
  { id: 'RA_10175', name: 'Cybercrime Prevention Act', description: 'RA 10175', category: 'Criminal Law' },
  { id: 'RA_11479', name: 'Anti-Terrorism Act', description: 'RA 11479', category: 'Criminal Law' },

  // --- IV. REMEDIAL LAW ---
  {
    id: 'RULES_OF_COURT',
    name: 'Rules of Court',
    description: 'Procedural Rules',
    category: 'Remedial Law',
    structure: [
      { title: 'Civil Procedure', query: 'Rules of Court Civil Procedure' },
      { title: 'Criminal Procedure', query: 'Rules of Court Criminal Procedure' },
      { title: 'Evidence', query: 'Rules of Court Evidence' },
      { title: 'Special Proceedings', query: 'Rules of Court Special Proceedings' }
    ]
  },
  { id: 'ROC_2019_AMEND', name: '2019 Civil Procedure Amendments', description: 'AM 19-10-20-SC', category: 'Remedial Law' },
  { id: 'RULES_E_EVIDENCE', name: 'Rules on Electronic Evidence', description: 'AM 01-7-01-SC', category: 'Remedial Law' },
  { id: 'RULES_SUMMARY', name: 'Rules on Summary Procedure', description: 'Procedure', category: 'Remedial Law' },
  { id: 'SMALL_CLAIMS', name: 'Rules on Small Claims', description: 'Procedure', category: 'Remedial Law' },
  { id: 'WRIT_AMPARO', name: 'Rules on Writ of Amparo', description: 'AM 07-9-12-SC', category: 'Remedial Law' },
  { id: 'WRIT_HABEAS_DATA', name: 'Rules on Writ of Habeas Data', description: 'AM 08-1-16-SC', category: 'Remedial Law' },
  { id: 'WRIT_KALIKASAN', name: 'Rules on Writ of Kalikasan', description: 'AM 09-6-8-SC', category: 'Remedial Law' },
  { id: 'PROVISIONAL_REMEDIES', name: 'Rules on Provisional Remedies', description: 'ROC', category: 'Remedial Law' },

  // --- V. COMMERCIAL LAW ---
  { id: 'CODE_OF_COMMERCE', name: 'Code of Commerce', description: 'Merchantile Law', category: 'Commercial Law' },
  { id: 'RCC_RA11232', name: 'Revised Corporation Code', description: 'RA 11232', category: 'Commercial Law' },
  { id: 'NIL_ACT2031', name: 'Negotiable Instruments Law', description: 'Act 2031', category: 'Commercial Law' },
  { id: 'INSURANCE_CODE', name: 'Insurance Code', description: 'PD 612 as amended', category: 'Commercial Law' },
  { id: 'SRC_RA8799', name: 'Securities Regulation Code', description: 'RA 8799', category: 'Commercial Law' },
  { id: 'GBL_RA8791', name: 'General Banking Law', description: 'RA 8791', category: 'Commercial Law', subcategory: 'Banking Laws' },
  { id: 'NCBA_RA7653', name: 'New Central Bank Act', description: 'RA 7653 / RA 11211', category: 'Commercial Law', subcategory: 'Banking Laws' },
  { id: 'IP_CODE', name: 'Intellectual Property Code', description: 'RA 8293', category: 'Commercial Law' },
  { id: 'E_COMMERCE_ACT', name: 'E-Commerce Act', description: 'RA 8792', category: 'Commercial Law' },
  { id: 'TRUST_RECEIPTS', name: 'Trust Receipts Law', description: 'PD 115', category: 'Commercial Law' },
  { id: 'CHATTEL_MORTGAGE', name: 'Chattel Mortgage Law', description: 'Act 1508', category: 'Commercial Law' },
  { id: 'WAREHOUSE_RECEIPTS', name: 'Warehouse Receipts Law', description: 'Act 2137', category: 'Commercial Law' },

  // --- VI. LABOR LAW ---
  { id: 'LABOR_CODE', name: 'Labor Code of the Philippines', description: 'PD 442', category: 'Labor Law and Social Legislation' },
  { id: 'DOLE_RULES', name: 'DOLE Rules', description: 'Labor Regulations', category: 'Labor Law and Social Legislation' },
  { id: 'SSS_ACT', name: 'Social Security Act', description: 'RA 11199', category: 'Labor Law and Social Legislation' },
  { id: 'GSIS_ACT', name: 'GSIS Act', description: 'RA 8291', category: 'Labor Law and Social Legislation' },
  { id: 'PHILHEALTH_LAW', name: 'PhilHealth Law', description: 'RA 11223', category: 'Labor Law and Social Legislation' },
  { id: 'EMP_COMP_LAW', name: 'Employees Compensation Law', description: 'Labor Code', category: 'Labor Law and Social Legislation' },
  { id: 'KASAMBAHAY_LAW', name: 'Kasambahay Law', description: 'RA 10361', category: 'Labor Law and Social Legislation' },
  { id: 'MIGRANT_WORKERS_ACT', name: 'Migrant Workers Act', description: 'RA 8042', category: 'Labor Law and Social Legislation' },
  { id: 'OSH_LAW', name: 'OSH Law', description: 'RA 11058', category: 'Labor Law and Social Legislation' },

  // --- VII. TAXATION LAW ---
  { id: 'NIRC', name: 'NIRC (Tax Code)', description: 'RA 8424 as amended', category: 'Taxation Law' },
  { id: 'CMTA_RA10863', name: 'Customs Modernization (CMTA)', description: 'RA 10863', category: 'Taxation Law' },
  { id: 'TRAIN_LAW', name: 'TRAIN Law', description: 'RA 10963', category: 'Taxation Law' },
  { id: 'CREATE_ACT', name: 'CREATE Act', description: 'RA 11534', category: 'Taxation Law' },
  { id: 'REAL_PROP_TAX', name: 'Real Property Tax Code', description: 'Taxation', category: 'Taxation Law' },
  { id: 'BIR_REGULATIONS', name: 'BIR Regulations', description: 'Taxation', category: 'Taxation Law' },

  // --- VIII. ETHICS ---
  { id: 'CPR', name: 'Code of Professional Responsibility', description: 'Legal Ethics', category: 'Legal and Judicial Ethics' },
  { id: 'CPRA', name: 'CPRA (2023)', description: 'Updated Legal Ethics', category: 'Legal and Judicial Ethics' },
  { id: 'JUDICIAL_CONDUCT', name: 'New Code of Judicial Conduct', description: 'Judicial Ethics', category: 'Legal and Judicial Ethics' },
  { id: 'NOTARIAL_PRACTICE', name: 'Rules on Notarial Practice', description: 'Ethics', category: 'Legal and Judicial Ethics' },
  { id: 'IBP_BYLAWS', name: 'IBP By-Laws', description: 'Legal Profession', category: 'Legal and Judicial Ethics' },

  // --- IX. ENVIRONMENTAL LAW ---
  { id: 'ENV_CODE', name: 'Philippine Environmental Code', description: 'PD 1152', category: 'Environmental Law' },
  { id: 'CLEAN_AIR_ACT', name: 'Clean Air Act', description: 'RA 8749', category: 'Environmental Law' },
  { id: 'CLEAN_WATER_ACT', name: 'Clean Water Act', description: 'RA 9275', category: 'Environmental Law' },
  { id: 'SOLID_WASTE_ACT', name: 'Solid Waste Management Act', description: 'RA 9003', category: 'Environmental Law' },
  { id: 'EIS_LAW', name: 'Environmental Impact Statement', description: 'PD 1586', category: 'Environmental Law' },
  { id: 'NIPAS_ACT', name: 'NIPAS Act', description: 'RA 7586 / RA 11038', category: 'Environmental Law' },
  { id: 'WILDLIFE_ACT', name: 'Wildlife Conservation Act', description: 'RA 9147', category: 'Environmental Law' },
  { id: 'CLIMATE_CHANGE_ACT', name: 'Climate Change Act', description: 'RA 9729', category: 'Environmental Law' },

  // --- X. SPECIAL LAWS ---
  { id: 'AMLA', name: 'Anti-Money Laundering Act', description: 'RA 9160', category: 'Special Laws' },
  { id: 'DATA_PRIVACY', name: 'Data Privacy Act', description: 'RA 10173', category: 'Special Laws' },
  { id: 'ARTA', name: 'Anti-Red Tape Act', description: 'RA 11032', category: 'Special Laws' },
  { id: 'COMPETITION_ACT', name: 'Philippine Competition Act', description: 'RA 10667', category: 'Special Laws' },
  { id: 'UDHA', name: 'Urban Development and Housing', description: 'RA 7279', category: 'Special Laws' }
];

export const LEGAL_DOCTRINES_ARCHIVE = [
  {
    category: 'Constitutional & Political Law',
    topics: [
      { title: 'Judicial Review Doctrine', query: 'Philippine Judicial Review Doctrine: The Supreme Court power to declare executive or legislative acts unconstitutional' },
      { title: 'Separation of Powers Doctrine', query: 'Separation of Powers Doctrine: Each branch of government must respect the functions and limits of the others' },
      { title: 'Political Question Doctrine', query: 'Political Question Doctrine: Issues non-justiciable because they are entrusted to other branches' },
      { title: 'Due Process Doctrine', query: 'Due Process Doctrine: Fair procedures and substantive fairness before deprivation of life, liberty, or property' },
      { title: 'Equal Protection Doctrine', query: 'Equal Protection Doctrine: Treating similarly situated persons alike absent valid classification' },
      { title: 'Police Power Doctrine', query: 'Police Power Doctrine: State regulation for public welfare with reasonableness' },
      { title: 'Takings / Eminent Domain Doctrine', query: 'Eminent Domain Doctrine: Expropriation of private property for public use with just compensation' },
      { title: 'Freedom of Speech & Expression', query: 'Freedom of Speech and Expression Doctrine: Regulation must satisfy strict scrutiny' },
      { title: 'Freedom of Religion Doctrine', query: 'Freedom of Religion Doctrine: Non-establishment and free exercise clauses' },
      { title: 'Freedom of the Press Doctrine', query: 'Freedom of the Press Doctrine: Unconstitutionality of prior restraints' },
      { title: 'Suffrage Doctrine', query: 'Suffrage Doctrine: The right to vote and reasonable qualifications' },
      { title: 'Party-List Doctrine', query: 'Party-List Doctrine: Proportional representation reflecting marginalized sectors' },
      { title: 'Anti-Graft Doctrine', query: 'Anti-Graft Doctrine: Avoiding conflicts of interest and prohibited corrupt practices' },
      { title: 'Civil Service Doctrine', query: 'Civil Service Doctrine: Merit and fitness in appointments' }
    ]
  },
  {
    category: 'Public International Law',
    topics: [
      { title: 'Self-Executing Treaty Doctrine', query: 'Self-Executing Treaty Doctrine: Domestic legal effect without implementing legislation' },
      { title: 'Customary International Law', query: 'Customary International Law Doctrine: Binding norms absent conflicting domestic law' },
      { title: 'Treaty Supremacy Doctrine', query: 'Treaty Supremacy Doctrine: Treaties as part of the law of the land once ratified' }
    ]
  },
  {
    category: 'Civil Law',
    topics: [
      { title: 'Personhood Doctrine', query: 'Personhood Doctrine: Legal personality at birth and rights of the conceived' },
      { title: 'Marriage Doctrine', query: 'Marriage Doctrine: Special contract giving rise to family obligations' },
      { title: 'Property Relations spouses', query: 'Property Relations of Spouses Doctrine: Conjugal partnership of gains' },
      { title: 'Meeting of the Minds Doctrine', query: 'Meeting of the Minds Doctrine: Mutual consent in contracts' },
      { title: 'Consideration Doctrine', query: 'Consideration Doctrine: Requirement for contracts unless excepted' },
      { title: 'Mistake Doctrine', query: 'Mistake Doctrine: Voidability of contracts for mistake of fact' },
      { title: 'Estoppel Doctrine', query: 'Estoppel Doctrine: Barring assertions inconsistent with prior conduct' },
      { title: 'Ownership Doctrine', query: 'Ownership Doctrine: Rights to enjoy and dispose of property' },
      { title: 'Co-ownership Doctrine', query: 'Co-ownership Doctrine: Undivided interests and mutual management' },
      { title: 'Testate Succession Doctrine', query: 'Testate Succession Doctrine: Effectiveness of wills and probate' },
      { title: 'Damages Doctrine', query: 'Damages Doctrine: Proven with reasonable certainty and compensatory nature' },
      { title: 'Specific Performance Doctrine', query: 'Specific Performance Doctrine: Equitable remedy when monetary damages are inadequate' }
    ]
  },
  {
    category: 'Criminal Law',
    topics: [
      { title: 'Criminal Liability Doctrine', query: 'Criminal Liability Doctrine: Act, omission, and criminal intent/negligence' },
      { title: 'Concurrence Doctrine', query: 'Concurrence Doctrine: Concurrence of criminal act and intent' },
      { title: 'Circumstantial Evidence Doctrine', query: 'Circumstantial Evidence Doctrine: Conviction excluding reasonable doubt' },
      { title: 'Presumption of Innocence', query: 'Presumption of Innocence Doctrine: Innocent until proven guilty' },
      { title: 'Justifying Circumstances', query: 'Justifying Circumstances Doctrine: Acts like self-defense that are not criminal' },
      { title: 'Mitigating Circumstances', query: 'Mitigating Circumstances Doctrine: Reducing penalties without absolving guilt' },
      { title: 'Aggravating Circumstances', query: 'Aggravating Circumstances Doctrine: Circumstances increasing penalties' },
      { title: 'Dangerous Drugs Doctrine', query: 'Dangerous Drugs Doctrine: Possession thresholds and implied trafficking' },
      { title: 'Human Trafficking Doctrine', query: 'Human Trafficking Doctrine: Immateriality of consent where fraud or coercion exists' },
      { title: 'Cybercrime Doctrine', query: 'Cybercrime Doctrine: Unauthorized access and punishable cyber offenses' }
    ]
  },
  {
    category: 'Remedial Law',
    topics: [
      { title: 'Jurisdiction Doctrine', query: 'Jurisdiction Doctrine: Requirement for subject-matter and personal jurisdiction' },
      { title: 'Forum Doctrine', query: 'Forum Doctrine: Forum non conveniens and proper venue' },
      { title: 'Res Judicata Doctrine', query: 'Res Judicata Doctrine: Final and conclusive judgment on the merits' },
      { title: 'Collaterally Estoppel Doctrine', query: 'Collaterally Estoppel Doctrine: No relitigation of issues already litigated' },
      { title: 'Search & Seizure Doctrine', query: 'Search and Seizure Doctrine: Validity and exceptions for warrantless search' },
      { title: 'Bail Doctrine', query: 'Bail Doctrine: Right for bailable offenses vs statutory criteria' },
      { title: 'Best Evidence Doctrine', query: 'Best Evidence Doctrine: Preference for original documents' },
      { title: 'Chain of Custody Doctrine', query: 'Chain of Custody Doctrine: Integrity of evidence from seizure to presentation' },
      { title: 'Hearsay Doctrine', query: 'Hearsay Doctrine: Inadmissibility and defined exceptions' },
      { title: 'Certiorari Doctrine', query: 'Certiorari Doctrine: Correcting errors of jurisdiction or grave abuse' },
      { title: 'Prohibition Doctrine', query: 'Prohibition Doctrine: Preventing tribunals from exceeding jurisdiction' },
      { title: 'Mandamus Doctrine', query: 'Mandamus Doctrine: Compelling performance of ministerial duty' }
    ]
  },
  {
    category: 'Commercial Law',
    topics: [
      { title: 'Holder in Due Course', query: 'Holder in Due Course Doctrine: Taking free of many defenses' },
      { title: 'Presumption of Consideration', query: 'Presumption of Consideration Doctrine: Instrument issued for value' },
      { title: 'Separate Legal Personality', query: 'Separate Legal Personality Doctrine: Distinction between corp and shareholders' },
      { title: 'Piercing the Corporate Veil', query: 'Piercing the Corporate Veil Doctrine: Disregarding entity to prevent fraud' },
      { title: 'Registration Doctrine', query: 'Registration Doctrine: Securities before public offering' }
    ]
  },
  {
    category: 'Labor Law',
    topics: [
      { title: 'Employer-Employee Relationship', query: 'Employer-Employee Relationship Doctrine: Control and economic reality tests' },
      { title: 'Regularization Doctrine', query: 'Regularization Doctrine: Probationary period and regular status' },
      { title: 'Union Rights Doctrine', query: 'Union Rights Doctrine: Self-organization and collective bargaining' }
    ]
  },
  {
    category: 'Taxation Law',
    topics: [
      { title: 'Taxability Doctrine', query: 'Taxability Doctrine: Statutory authority and ambiguity resolution' },
      { title: 'Substance Over Form Doctrine', query: 'Substance Over Form Doctrine: Liability determined by economic substance' }
    ]
  },
  {
    category: 'Legal & Judicial Ethics',
    topics: [
      { title: 'Conflict of Interest Doctrine', query: 'Conflict of Interest Doctrine: Avoiding conflicts and limited dual representation' },
      { title: 'Candor to Tribunal Doctrine', query: 'Candor to Tribunal Doctrine: Not misleading the court' },
      { title: 'Judicial Impartiality Doctrine', query: 'Judicial Impartiality Doctrine: Performance of duties impartially' }
    ]
  },
  {
    category: 'Environmental Law',
    topics: [
      { title: 'Precautionary Principle', query: 'Precautionary Principle Doctrine: Scientific uncertainty not preventing protective measures' },
      { title: 'Public Trust Doctrine', query: 'Public Trust Doctrine: Resources held by state for public use' }
    ]
  },
  {
    category: 'Special & Modern Law',
    topics: [
      { title: 'Consent (Data Privacy)', query: 'Consent Doctrine in Data Privacy: Lawful processing and safeguards' },
      { title: 'Covered Transaction (AML)', query: 'Covered Transaction Doctrine: Thresholds for reporting and compliance' },
      { title: 'Idea Expression (IP)', query: 'Idea Expression Doctrine: Expression vs Idea protection in IP law' }
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
