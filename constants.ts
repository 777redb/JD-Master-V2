
import { LawCode, ContractTemplate, LawCategory } from "./types";

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
  // --- POLITICAL LAW ---
  { 
    id: '1987_CONSTI', 
    name: '1987 Constitution', 
    description: 'The fundamental law of the land.', 
    category: 'Political and Public International Law',
    subcategory: 'Political Law',
    structure: [
      { title: 'Preamble', query: '1987 Constitution Preamble' },
      { title: 'Article I', subtitle: 'National Territory', query: '1987 Constitution Article I' },
      { title: 'Article II', subtitle: 'Declaration of Principles and State Policies', query: '1987 Constitution Article II' },
      { title: 'Article III', subtitle: 'Bill of Rights', query: '1987 Constitution Article III' },
      { title: 'Article IV', subtitle: 'Citizenship', query: '1987 Constitution Article IV' },
      { title: 'Article V', subtitle: 'Suffrage', query: '1987 Constitution Article V' },
      { title: 'Article VI', subtitle: 'The Legislative Department', query: '1987 Constitution Article VI' },
      { title: 'Article VII', subtitle: 'The Executive Department', query: '1987 Constitution Article VII' },
      { title: 'Article VIII', subtitle: 'The Judicial Department', query: '1987 Constitution Article VIII' },
      { title: 'Article IX', subtitle: 'Constitutional Commissions', query: '1987 Constitution Article IX' },
      { title: 'Article X', subtitle: 'Local Government', query: '1987 Constitution Article X' },
      { title: 'Article XI', subtitle: 'Accountability of Public Officers', query: '1987 Constitution Article XI' },
      { title: 'Article XII', subtitle: 'National Economy and Patrimony', query: '1987 Constitution Article XII' },
      { title: 'Article XIII', subtitle: 'Social Justice and Human Rights', query: '1987 Constitution Article XIII' },
      { title: 'Article XIV', subtitle: 'Education, Science and Technology, Arts, Culture and Sports', query: '1987 Constitution Article XIV' },
      { title: 'Article XV', subtitle: 'The Family', query: '1987 Constitution Article XV' },
      { title: 'Article XVI', subtitle: 'General Provisions', query: '1987 Constitution Article XVI' },
      { title: 'Article XVII', subtitle: 'Amendments or Revisions', query: '1987 Constitution Article XVII' },
      { title: 'Article XVIII', subtitle: 'Transitory Provisions', query: '1987 Constitution Article XVIII' },
    ]
  },
  { 
    id: 'ADMIN_CODE', 
    name: 'Administrative Code of 1987 (EO 292)', 
    description: 'Structure and Administration of Government.', 
    category: 'Political and Public International Law',
    subcategory: 'Political Law',
    structure: [
      { title: 'Book I', subtitle: 'Sovereignty and General Administration', query: 'EO 292 Book I' },
      { title: 'Book II', subtitle: 'Distribution of Powers of Government', query: 'EO 292 Book II' },
      { title: 'Book III', subtitle: 'Office of the President', query: 'EO 292 Book III' },
      { title: 'Book IV', subtitle: 'The Executive Branch', query: 'EO 292 Book IV' },
      { title: 'Book V', subtitle: 'Title I: Civil Service Commission', query: 'EO 292 Book V Title I' },
      { title: 'Book VI', subtitle: 'National Government Budgeting', query: 'EO 292 Book VI' },
      { title: 'Book VII', subtitle: 'Administrative Procedure', query: 'EO 292 Book VII' },
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
           { title: 'Title I', subtitle: 'Basic Principles', query: 'LGC Book I Title I' },
           { title: 'Title II', subtitle: 'Elective Officials', query: 'LGC Book I Title II' },
           { title: 'Title III', subtitle: 'Human Resources and Development', query: 'LGC Book I Title III' },
           { title: 'Title IV', subtitle: 'Local School Boards', query: 'LGC Book I Title IV' },
           { title: 'Title V', subtitle: 'Local Health Boards', query: 'LGC Book I Title V' },
           { title: 'Title VI', subtitle: 'Local Development Councils', query: 'LGC Book I Title VI' },
           { title: 'Title VII', subtitle: 'Local Peace and Order Council', query: 'LGC Book I Title VII' },
           { title: 'Title VIII', subtitle: 'Autonomous Special Economic Zones', query: 'LGC Book I Title VIII' },
           { title: 'Title IX', subtitle: 'Other Provisions Applicable to Local Government Officials', query: 'LGC Book I Title IX' },
        ]
      },
      { 
        title: 'Book II', 
        subtitle: 'Local Taxation and Fiscal Matters', 
        query: 'Local Government Code Book II',
        children: [
           { title: 'Title I', subtitle: 'Local Government Taxation', query: 'LGC Book II Title I' },
           { title: 'Title II', subtitle: 'Real Property Taxation', query: 'LGC Book II Title II' },
           { title: 'Title III', subtitle: 'Shares of LGUs in the Proceeds of National Taxes', query: 'LGC Book II Title III' },
           { title: 'Title IV', subtitle: 'Credit Financing', query: 'LGC Book II Title IV' },
           { title: 'Title V', subtitle: 'Local Fiscal Administration', query: 'LGC Book II Title V' },
           { title: 'Title VI', subtitle: 'Property and Supply Management', query: 'LGC Book II Title VI' },
        ]
      },
      { 
        title: 'Book III', 
        subtitle: 'Local Government Units', 
        query: 'Local Government Code Book III',
        children: [
           { title: 'Title I', subtitle: 'The Barangay', query: 'LGC Book III Title I' },
           { title: 'Title II', subtitle: 'The Municipality', query: 'LGC Book III Title II' },
           { title: 'Title III', subtitle: 'The City', query: 'LGC Book III Title III' },
           { title: 'Title IV', subtitle: 'The Province', query: 'LGC Book III Title IV' },
           { title: 'Title V', subtitle: 'Appointed Local Officials', query: 'LGC Book III Title V' },
        ]
      },
      { 
        title: 'Book IV', 
        subtitle: 'Miscellaneous and Final Provisions', 
        query: 'Local Government Code Book IV',
        children: [
           { title: 'Title I', subtitle: 'Penal Provisions', query: 'LGC Book IV Title I' },
           { title: 'Title II', subtitle: 'Provisions for Implementation', query: 'LGC Book IV Title II' },
           { title: 'Title III', subtitle: 'Transitory Provisions', query: 'LGC Book IV Title III' },
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
      { title: 'Article I', subtitle: 'Name and Purpose', query: 'RA 11054 Article I' },
      { title: 'Article II', subtitle: 'Bangsamoro Identity', query: 'RA 11054 Article II' },
      { title: 'Article III', subtitle: 'Territory', query: 'RA 11054 Article III' },
      { title: 'Article IV', subtitle: 'General Principles and Policies', query: 'RA 11054 Article IV' },
      { title: 'Article V', subtitle: 'Powers of Government', query: 'RA 11054 Article V' },
      { title: 'Article VI', subtitle: 'Intergovernmental Relations', query: 'RA 11054 Article VI' },
      { title: 'Article VII', subtitle: 'The Bangsamoro Government', query: 'RA 11054 Article VII' },
      { title: 'Article VIII', subtitle: 'Wali', query: 'RA 11054 Article VIII' },
      { title: 'Article IX', subtitle: 'Basic Rights', query: 'RA 11054 Article IX' },
      { title: 'Article X', subtitle: 'Bangsamoro Justice System', query: 'RA 11054 Article X' },
    ]
  },
  { 
    id: 'ELECTION_CODE', 
    name: 'Omnibus Election Code (BP 881)', 
    description: 'Laws governing elections and political parties.', 
    category: 'Political and Public International Law',
    subcategory: 'Political Law',
    structure: [
      { title: 'Article I', subtitle: 'General Provisions', query: 'Omnibus Election Code Article I' },
      { title: 'Article II', subtitle: 'Election of President and Vice-President', query: 'Omnibus Election Code Article II' },
      { title: 'Article III', subtitle: 'Election of Members of the Batasang Pambansa', query: 'Omnibus Election Code Article III' },
      { title: 'Article IV', subtitle: 'Election of Local Officials', query: 'Omnibus Election Code Article IV' },
      { title: 'Article VII', subtitle: 'The Commission on Elections', query: 'Omnibus Election Code Article VII' },
      { title: 'Article IX', subtitle: 'Eligibility of Candidates and Certificate of Candidacy', query: 'Omnibus Election Code Article IX' },
      { title: 'Article X', subtitle: 'Campaign and Election Propaganda', query: 'Omnibus Election Code Article X' },
      { title: 'Article XXII', subtitle: 'Election Offenses', query: 'Omnibus Election Code Article XXII' },
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
      { title: 'Preamble', query: 'UN Charter Preamble' },
      { title: 'Chapter I', subtitle: 'Purposes and Principles', query: 'UN Charter Chapter I' },
      { title: 'Chapter II', subtitle: 'Membership', query: 'UN Charter Chapter II' },
      { title: 'Chapter III', subtitle: 'Organs', query: 'UN Charter Chapter III' },
      { title: 'Chapter IV', subtitle: 'The General Assembly', query: 'UN Charter Chapter IV' },
      { title: 'Chapter V', subtitle: 'The Security Council', query: 'UN Charter Chapter V' },
      { title: 'Chapter VI', subtitle: 'Pacific Settlement of Disputes', query: 'UN Charter Chapter VI' },
      { title: 'Chapter VII', subtitle: 'Action with Respect to Threats to the Peace', query: 'UN Charter Chapter VII' },
      { title: 'Chapter XIV', subtitle: 'The International Court of Justice', query: 'UN Charter Chapter XIV' },
    ]
  },
  { 
    id: 'ASEAN_CHARTER', 
    name: 'ASEAN Charter', 
    description: 'Constituent instrument of the Association of Southeast Asian Nations.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Chapter I', subtitle: 'Purposes and Principles', query: 'ASEAN Charter Chapter I' },
      { title: 'Chapter II', subtitle: 'Legal Personality', query: 'ASEAN Charter Chapter II' },
      { title: 'Chapter IV', subtitle: 'Organs', query: 'ASEAN Charter Chapter IV' },
      { title: 'Chapter VII', subtitle: 'Decision-Making', query: 'ASEAN Charter Chapter VII' },
      { title: 'Chapter VIII', subtitle: 'Settlement of Disputes', query: 'ASEAN Charter Chapter VIII' },
    ]
  },
  { 
    id: 'ICJ_STATUTE', 
    name: 'Statute of the International Court of Justice', 
    description: 'Integral part of the UN Charter.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Chapter I', subtitle: 'Organization of the Court', query: 'ICJ Statute Chapter I' },
      { title: 'Chapter II', subtitle: 'Competence of the Court', query: 'ICJ Statute Chapter II' },
      { title: 'Chapter III', subtitle: 'Procedure', query: 'ICJ Statute Chapter III' },
      { title: 'Chapter IV', subtitle: 'Advisory Opinions', query: 'ICJ Statute Chapter IV' },
    ]
  },
  { 
    id: 'ROME_STATUTE', 
    name: 'Rome Statute of the ICC', 
    description: 'Establishes the International Criminal Court.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Part 1', subtitle: 'Establishment of the Court', query: 'Rome Statute Part 1' },
      { title: 'Part 2', subtitle: 'Jurisdiction, Admissibility and Applicable Law', query: 'Rome Statute Part 2' },
      { title: 'Part 3', subtitle: 'General Principles of Criminal Law', query: 'Rome Statute Part 3' },
      { title: 'Part 5', subtitle: 'Investigation and Prosecution', query: 'Rome Statute Part 5' },
    ]
  },
  { 
    id: 'VCLT', 
    name: 'Vienna Convention on the Law of Treaties', 
    description: 'Treaty on Treaties.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Part I', subtitle: 'Introduction', query: 'VCLT Part I' },
      { title: 'Part II', subtitle: 'Conclusion and Entry into Force of Treaties', query: 'VCLT Part II' },
      { title: 'Part III', subtitle: 'Observance, Application and Interpretation of Treaties', query: 'VCLT Part III' },
      { title: 'Part V', subtitle: 'Invalidity, Termination and Suspension', query: 'VCLT Part V' },
    ]
  },
  { 
    id: 'VCDR', 
    name: 'Vienna Convention on Diplomatic Relations', 
    description: 'Diplomatic intercourse, privileges and immunities.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Articles 1-19', subtitle: 'Establishment of Diplomatic Relations', query: 'VCDR Articles 1-19' },
      { title: 'Articles 20-28', subtitle: 'Inviolability of Premises', query: 'VCDR Articles 20-28' },
      { title: 'Articles 29-40', subtitle: 'Personal Immunities', query: 'VCDR Articles 29-40' },
    ]
  },
  { 
    id: 'UNCLOS', 
    name: 'UN Convention on the Law of the Sea', 
    description: 'Constitution for the oceans.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Part II', subtitle: 'Territorial Sea and Contiguous Zone', query: 'UNCLOS Part II' },
      { title: 'Part III', subtitle: 'Straits Used for International Navigation', query: 'UNCLOS Part III' },
      { title: 'Part IV', subtitle: 'Archipelagic States', query: 'UNCLOS Part IV' },
      { title: 'Part V', subtitle: 'Exclusive Economic Zone', query: 'UNCLOS Part V' },
      { title: 'Part VI', subtitle: 'Continental Shelf', query: 'UNCLOS Part VI' },
      { title: 'Part XI', subtitle: 'The Area', query: 'UNCLOS Part XI' },
    ]
  },
  { 
    id: 'UDHR_ICCPR', 
    name: 'Human Rights Law (UDHR & ICCPR)', 
    description: 'International Bill of Human Rights.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'UDHR', subtitle: 'Universal Declaration of Human Rights', query: 'Universal Declaration of Human Rights' },
      { title: 'ICCPR Part III', subtitle: 'Civil and Political Rights', query: 'ICCPR Part III' },
      { title: 'ICESCR Part III', subtitle: 'Economic, Social and Cultural Rights', query: 'ICESCR Part III' },
      { title: 'Geneva Convention IV', subtitle: 'Protection of Civilian Persons in Time of War', query: 'Geneva Convention IV' },
    ]
  },
  { 
    id: 'ILO_CONST', 
    name: 'International Labor Law (ILO)', 
    description: 'ILO Constitution and Core Conventions.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'Preamble', subtitle: 'ILO Constitution Preamble', query: 'ILO Constitution Preamble' },
      { title: 'Declaration of Philadelphia', subtitle: 'Aims and Purposes', query: 'Declaration of Philadelphia' },
      { title: 'Core Principles', subtitle: 'Freedom of Association', query: 'ILO Freedom of Association' },
    ]
  },
  { 
    id: 'WTO_TRIPS', 
    name: 'Intl Trade & IP (WTO & TRIPS)', 
    description: 'World Trade Organization and Intellectual Property.', 
    category: 'Political and Public International Law',
    subcategory: 'Public International Law',
    structure: [
      { title: 'WTO Agreement', subtitle: 'Establishment of the WTO', query: 'Marrakesh Agreement Establishing the WTO' },
      { title: 'TRIPS Part I', subtitle: 'General Provisions', query: 'TRIPS Agreement Part I' },
      { title: 'TRIPS Part II', subtitle: 'Standards concerning IP Rights', query: 'TRIPS Agreement Part II' },
    ]
  },

  // --- CIVIL LAW ---
  { 
    id: 'CIVIL_CODE', 
    name: 'Civil Code (RA 386)', 
    description: 'Persons, Property, Succession, Obligations & Contracts.', 
    category: 'Civil Law',
    structure: [
      { title: 'Preliminary Title', subtitle: 'Effect and Application of Laws (Arts. 1-36)', query: 'Civil Code Preliminary Title Articles 1-36' },
      { 
        title: 'Book I', 
        subtitle: 'Persons', 
        query: 'Civil Code Book I Persons',
        children: [
           { title: 'Title I', subtitle: 'Civil Personality (Arts. 37-47)', query: 'Civil Code Book I Title I' },
           { title: 'Title II', subtitle: 'Citizenship and Domicile (Arts. 48-51)', query: 'Civil Code Book I Title II' },
           { title: 'Title III', subtitle: 'Marriage (Repealed/Superseded by Family Code)', query: 'Civil Code Book I Title III' },
           { title: 'Title X', subtitle: 'Funerals (Arts. 305-310)', query: 'Civil Code Book I Title X' },
        ]
      },
      { 
        title: 'Book II', 
        subtitle: 'Property, Ownership, and its Modifications', 
        query: 'Civil Code Book II Property',
        children: [
          { title: 'Title I', subtitle: 'Classification of Property (Arts. 414-426)', query: 'Civil Code Book II Title I' },
          { title: 'Title II', subtitle: 'Ownership (Arts. 427-483)', query: 'Civil Code Book II Title II' },
          { title: 'Title V', subtitle: 'Possession (Arts. 523-561)', query: 'Civil Code Book II Title V' },
          { title: 'Title VII', subtitle: 'Easements or Servitudes (Arts. 613-693)', query: 'Civil Code Book II Title VII' },
        ]
      },
      { 
        title: 'Book III', 
        subtitle: 'Different Modes of Acquiring Ownership', 
        query: 'Civil Code Book III',
        children: [
          { title: 'Title I', subtitle: 'Occupation (Arts. 713-720)', query: 'Civil Code Book III Title I' },
          { title: 'Title III', subtitle: 'Donation (Arts. 725-773)', query: 'Civil Code Book III Title III' },
          { title: 'Title IV', subtitle: 'Succession (Arts. 774-1105)', query: 'Civil Code Book III Title IV' },
          { title: 'Title V', subtitle: 'Prescription (Arts. 1106-1155)', query: 'Civil Code Book III Title V' },
        ]
      },
      { 
        title: 'Book IV', 
        subtitle: 'Obligations and Contracts', 
        query: 'Civil Code Book IV',
        children: [
          { title: 'Title I', subtitle: 'Obligations (Arts. 1156-1304)', query: 'Civil Code Book IV Title I Obligations' },
          { title: 'Title II', subtitle: 'Contracts (Arts. 1305-1422)', query: 'Civil Code Book IV Title II Contracts' },
          { title: 'Title III', subtitle: 'Natural Obligations (Arts. 1423-1430)', query: 'Civil Code Book IV Title III' },
          { title: 'Title VI', subtitle: 'Sales (Arts. 1458-1637)', query: 'Civil Code Book IV Title VI Sales' },
          { title: 'Title VIII', subtitle: 'Lease (Arts. 1642-1766)', query: 'Civil Code Book IV Title VIII Lease' },
          { title: 'Title IX', subtitle: 'Partnership (Arts. 1767-1867)', query: 'Civil Code Book IV Title IX Partnership' },
          { title: 'Title X', subtitle: 'Agency (Arts. 1868-1932)', query: 'Civil Code Book IV Title X Agency' },
          { title: 'Title XVII', subtitle: 'Extra-contractual Obligations (Quasi-contracts/Delicts) (Arts. 2142-2194)', query: 'Civil Code Book IV Title XVII' },
          { title: 'Title XVIII', subtitle: 'Damages (Arts. 2195-2235)', query: 'Civil Code Book IV Title XVIII Damages' },
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
      { title: 'Title I', subtitle: 'Marriage (Arts. 1-54)', query: 'Family Code Title I Marriage' },
      { title: 'Title II', subtitle: 'Legal Separation (Arts. 55-67)', query: 'Family Code Title II Legal Separation' },
      { title: 'Title III', subtitle: 'Rights and Obligations between Husband and Wife (Arts. 68-73)', query: 'Family Code Title III' },
      { title: 'Title IV', subtitle: 'Property Relations between Husband and Wife (Arts. 74-148)', query: 'Family Code Title IV Property Relations' },
      { title: 'Title V', subtitle: 'The Family (Arts. 149-162)', query: 'Family Code Title V' },
      { title: 'Title VI', subtitle: 'Paternity and Filiation (Arts. 163-182)', query: 'Family Code Title VI Paternity' },
      { title: 'Title VII', subtitle: 'Adoption (Superseded by RA 8552/RA 11642)', query: 'Domestic Administrative Adoption and Child Care Act' },
      { title: 'Title VIII', subtitle: 'Support (Arts. 194-208)', query: 'Family Code Title VIII Support' },
      { title: 'Title IX', subtitle: 'Parental Authority (Arts. 209-233)', query: 'Family Code Title IX Parental Authority' },
    ] 
  },
  { 
    id: 'PD_1529', 
    name: 'Property Registration Decree (PD 1529)', 
    description: 'Registration of land titles and deeds.', 
    category: 'Civil Law',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'PD 1529 Chapter I' },
      { title: 'Chapter II', subtitle: 'Original Registration', query: 'PD 1529 Chapter II' },
      { title: 'Chapter III', subtitle: 'Certificate of Title', query: 'PD 1529 Chapter III' },
      { title: 'Chapter IV', subtitle: 'Voluntary Dealings with Registered Lands', query: 'PD 1529 Chapter IV' },
      { title: 'Chapter V', subtitle: 'Involuntary Dealings', query: 'PD 1529 Chapter V' },
      { title: 'Chapter VII', subtitle: 'Assurance Fund', query: 'PD 1529 Chapter VII' },
      { title: 'Chapter X', subtitle: 'Petitions and Actions', query: 'PD 1529 Chapter X' },
    ]
  },
  { 
    id: 'RA_4726', 
    name: 'Condominium Act (RA 4726)', 
    description: 'Ownership and management of condominiums.', 
    category: 'Civil Law',
    structure: [
      { title: 'Section 2', subtitle: 'Definition of Terms', query: 'RA 4726 Section 2' },
      { title: 'Section 4', subtitle: 'Rights of Unit Owners', query: 'RA 4726 Section 4' },
      { title: 'Section 6', subtitle: 'Common Areas', query: 'RA 4726 Section 6' },
      { title: 'Section 10', subtitle: 'The Condominium Corporation', query: 'RA 4726 Section 10' },
    ]
  },
  { 
    id: 'RA_6552', 
    name: 'Maceda Law (RA 6552)', 
    description: 'Realty Installment Buyer Protection Act.', 
    category: 'Civil Law',
    structure: [
      { title: 'Section 3', subtitle: 'Rights of Buyer (At least 2 years installments)', query: 'RA 6552 Section 3' },
      { title: 'Section 4', subtitle: 'Rights of Buyer (Less than 2 years installments)', query: 'RA 6552 Section 4' },
    ]
  },
  { 
    id: 'RA_11642', 
    name: 'Domestic Adoption Act (RA 11642)', 
    description: 'Domestic Administrative Adoption and Child Care Act.', 
    category: 'Civil Law',
    structure: [
      { title: 'Article I', subtitle: 'General Provisions', query: 'RA 11642 Article I' },
      { title: 'Article III', subtitle: 'Domestic Administrative Adoption', query: 'RA 11642 Article III' },
      { title: 'Article IV', subtitle: 'Procedure', query: 'RA 11642 Article IV' },
      { title: 'Article V', subtitle: 'Effects of Adoption', query: 'RA 11642 Article V' },
    ]
  },
  { 
    id: 'PD_1083', 
    name: 'Code of Muslim Personal Laws (PD 1083)', 
    description: 'Personal laws for Muslims in the Philippines.', 
    category: 'Civil Law',
    structure: [
      { title: 'Book I', subtitle: 'General Provisions', query: 'PD 1083 Book I' },
      { title: 'Book II', subtitle: 'Persons and Family Relations', query: 'PD 1083 Book II' },
      { title: 'Book III', subtitle: 'Succession', query: 'PD 1083 Book III' },
      { title: 'Book IV', subtitle: 'Adjudication and Settlement of Disputes', query: 'PD 1083 Book IV' },
    ]
  },

  // --- CRIMINAL LAW ---
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
          { title: 'Title I', subtitle: 'Felonies and Circumstances which Affect Criminal Liability (Arts. 1-20)', query: 'RPC Book I Title I' },
          { title: 'Title II', subtitle: 'Persons Criminally Liable (Arts. 16-20)', query: 'RPC Book I Title II' },
          { title: 'Title III', subtitle: 'Penalties (Arts. 21-88)', query: 'RPC Book I Title III' },
          { title: 'Title IV', subtitle: 'Extinction of Criminal Liability (Arts. 89-99)', query: 'RPC Book I Title IV' },
          { title: 'Title V', subtitle: 'Civil Liability (Arts. 100-113)', query: 'RPC Book I Title V' },
        ]
      },
      { 
        title: 'Book II', 
        subtitle: 'Crimes and Penalties', 
        query: 'Revised Penal Code Book II',
        children: [
          { title: 'Title I', subtitle: 'Crimes Against National Security (Arts. 114-123)', query: 'RPC Book II Title I' },
          { title: 'Title II', subtitle: 'Crimes Against Fundamental Laws of the State (Arts. 124-133)', query: 'RPC Book II Title II' },
          { title: 'Title III', subtitle: 'Crimes Against Public Order (Arts. 134-160)', query: 'RPC Book II Title III' },
          { title: 'Title IV', subtitle: 'Crimes Against Public Interest (Arts. 161-189)', query: 'RPC Book II Title IV' },
          { title: 'Title VII', subtitle: 'Crimes Committed by Public Officers (Arts. 203-245)', query: 'RPC Book II Title VII' },
          { title: 'Title VIII', subtitle: 'Crimes Against Persons (Arts. 246-266)', query: 'RPC Book II Title VIII' },
          { title: 'Title IX', subtitle: 'Crimes Against Personal Liberty and Security (Arts. 267-292)', query: 'RPC Book II Title IX' },
          { title: 'Title X', subtitle: 'Crimes Against Property (Arts. 293-332)', query: 'RPC Book II Title X' },
          { title: 'Title XI', subtitle: 'Crimes Against Chastity (Arts. 333-346)', query: 'RPC Book II Title XI' },
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
      { title: 'Part I', subtitle: 'Civil Procedure (Rules 1-71)', query: 'Rules of Court Civil Procedure' },
      { title: 'Part II', subtitle: 'Special Proceedings (Rules 72-109)', query: 'Rules of Court Special Proceedings' },
      { title: 'Part III', subtitle: 'Criminal Procedure (Rules 110-127)', query: 'Rules of Court Criminal Procedure' },
      { title: 'Part IV', subtitle: 'Evidence (Rules 128-134)', query: 'Rules of Court Evidence' },
    ]
  },
  {
    id: 'BP_129',
    name: 'Judiciary Reorganization Act (BP 129)',
    description: 'Organization of Courts.',
    category: 'Remedial Law',
    subcategory: 'Judiciary & Courts',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'BP 129 Chapter I' },
      { title: 'Chapter II', subtitle: 'Court of Appeals', query: 'BP 129 Chapter II' },
      { title: 'Chapter III', subtitle: 'Regional Trial Courts', query: 'BP 129 Chapter III' },
      { title: 'Chapter IV', subtitle: 'Metropolitan Trial Courts, etc.', query: 'BP 129 Chapter IV' },
    ]
  },
  {
    id: 'PD_1606',
    name: 'Sandiganbayan Law (PD 1606)',
    description: 'Act Creating the Sandiganbayan.',
    category: 'Remedial Law',
    subcategory: 'Judiciary & Courts',
    structure: [
      { title: 'Section 1', subtitle: 'Sandiganbayan; Composition', query: 'PD 1606 Section 1' },
      { title: 'Section 4', subtitle: 'Jurisdiction', query: 'PD 1606 Section 4' },
    ]
  },
  {
    id: 'RA_9285',
    name: 'ADR Act of 2004 (RA 9285)',
    description: 'Alternative Dispute Resolution Act.',
    category: 'Remedial Law',
    subcategory: 'Alternative Dispute Resolution',
    structure: [
      { title: 'Chapter 1', subtitle: 'General Provisions', query: 'RA 9285 Chapter 1' },
      { title: 'Chapter 2', subtitle: 'Institutionalization of ADR', query: 'RA 9285 Chapter 2' },
      { title: 'Chapter 4', subtitle: 'International Commercial Arbitration', query: 'RA 9285 Chapter 4' },
      { title: 'Chapter 5', subtitle: 'Domestic Arbitration', query: 'RA 9285 Chapter 5' },
    ]
  },
  {
    id: 'SPEEDY_TRIAL',
    name: 'Speedy Trial Act (RA 8493)',
    description: 'Laws ensuring speedy trial of criminal cases.',
    category: 'Remedial Law',
    subcategory: 'Laws and Rules on Criminal Procedure',
    structure: [
      { title: 'Section 1', subtitle: 'Title', query: 'RA 8493 Section 1' },
      { title: 'Section 6', subtitle: 'Time Limit for Trial', query: 'RA 8493 Section 6' },
      { title: 'Section 9', subtitle: 'Exclusions', query: 'RA 8493 Section 9' },
    ]
  },
  {
    id: 'JUDICIAL_AFFIDAVIT',
    name: 'Judicial Affidavit Rule',
    description: 'A.M. No. 12-8-8-SC.',
    category: 'Remedial Law',
    subcategory: 'Revised Rules on Evidence',
    structure: [
      { title: 'Section 1', subtitle: 'Scope', query: 'A.M. No. 12-8-8-SC Section 1' },
      { title: 'Section 3', subtitle: 'Contents of Judicial Affidavit', query: 'A.M. No. 12-8-8-SC Section 3' },
      { title: 'Section 10', subtitle: 'Effect of Non-Compliance', query: 'A.M. No. 12-8-8-SC Section 10' },
    ]
  },
  {
    id: 'SUMMARY_PROCEDURE',
    name: 'Rule on Summary Procedure',
    description: 'Expedited proceedings for small cases.',
    category: 'Remedial Law',
    subcategory: 'Other Rules on Civil Procedure',
    structure: [
      { title: 'Section 1', subtitle: 'Scope', query: 'Rule on Summary Procedure Section 1' },
      { title: 'Section 3', subtitle: 'Pleadings', query: 'Rule on Summary Procedure Section 3' },
      { title: 'Section 4', subtitle: 'Duty of Court', query: 'Rule on Summary Procedure Section 4' },
    ]
  },
  
  // --- COMMERCIAL LAW ---
  { 
    id: 'CORP_CODE', 
    name: 'Revised Corporation Code (RA 11232)', 
    description: 'Corporate organization, powers, and governance.', 
    category: 'Commercial Law',
    subcategory: 'Corporate Law',
    structure: [
      { title: 'Title I', subtitle: 'General Provisions', query: 'RA 11232 Title I' },
      { title: 'Title II', subtitle: 'Incorporation and Organization of Private Corporations', query: 'RA 11232 Title II' },
      { title: 'Title III', subtitle: 'Board of Directors/Trustees and Officers', query: 'RA 11232 Title III' },
      { title: 'Title IV', subtitle: 'Powers of Corporations', query: 'RA 11232 Title IV' },
      { title: 'Title VI', subtitle: 'Meetings', query: 'RA 11232 Title VI' },
      { title: 'Title VII', subtitle: 'Stocks and Stockholders', query: 'RA 11232 Title VII' },
      { title: 'Title XIII', subtitle: 'One Person Corporations', query: 'RA 11232 Title XIII' },
    ]
  },
  { 
    id: 'SRC', 
    name: 'Securities Regulation Code (RA 8799)', 
    description: 'Regulation of Securities and the SEC.', 
    category: 'Commercial Law',
    subcategory: 'Securities and Insurance',
    structure: [
      { title: 'Title I', subtitle: 'Title and Definitions', query: 'RA 8799 Title I' },
      { title: 'Title II', subtitle: 'Securities and Exchange Commission', query: 'RA 8799 Title II' },
      { title: 'Title III', subtitle: 'Registration of Securities', query: 'RA 8799 Title III' },
      { title: 'Title IV', subtitle: 'Regulation of Pre-Need Plans', query: 'RA 8799 Title IV' },
      { title: 'Title V', subtitle: 'Reportorial Requirements', query: 'RA 8799 Title V' },
      { title: 'Title VII', subtitle: 'Prohibitions on Fraud, Manipulation', query: 'RA 8799 Title VII' },
      { title: 'Title VIII', subtitle: 'Regulation of Securities Market Professionals', query: 'RA 8799 Title VIII' },
    ]
  },
  { 
    id: 'INSURANCE', 
    name: 'Insurance Code (RA 10607)', 
    description: 'Insurance contracts and regulations.', 
    category: 'Commercial Law',
    subcategory: 'Securities and Insurance',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 10607 Chapter I' },
      { title: 'Chapter II', subtitle: 'The Policy', query: 'RA 10607 Chapter II' },
      { title: 'Chapter III', subtitle: 'Insurable Interest', query: 'RA 10607 Chapter III' },
      { title: 'Title IV', subtitle: 'Insurance Commissioner', query: 'RA 10607 Title IV' },
    ]
  },
  { 
    id: 'PRE_NEED', 
    name: 'Pre-Need Code (RA 9829)', 
    description: 'Regulation of Pre-Need Companies.', 
    category: 'Commercial Law',
    subcategory: 'Securities and Insurance',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 9829 Chapter I' },
      { title: 'Chapter II', subtitle: 'Authority of the Commission', query: 'RA 9829 Chapter II' },
      { title: 'Chapter III', subtitle: 'Organization and Licensing', query: 'RA 9829 Chapter III' },
    ]
  },
  { 
    id: 'IP_CODE', 
    name: 'Intellectual Property Code (RA 8293)', 
    description: 'Copyrights, Trademarks, and Patents.', 
    category: 'Commercial Law',
    subcategory: 'Intellectual Property',
    structure: [
      { title: 'Part I', subtitle: 'The Intellectual Property Office', query: 'RA 8293 Part I' },
      { title: 'Part II', subtitle: 'The Law on Patents', query: 'RA 8293 Part II' },
      { title: 'Part III', subtitle: 'The Law on Trademarks', query: 'RA 8293 Part III' },
      { title: 'Part IV', subtitle: 'The Law on Copyright', query: 'RA 8293 Part IV' },
      { title: '2020 Rules', subtitle: 'Rules of Procedure for IP Rights Cases', query: '2020 Revised Rules of Procedure for Intellectual Property Rights Cases' },
    ]
  },
  { 
    id: 'NIL', 
    name: 'Negotiable Instruments Law (Act 2031)', 
    description: 'Bills of Exchange and Promissory Notes.', 
    category: 'Commercial Law',
    subcategory: 'Negotiable Instruments',
    structure: [
      { title: 'Title I', subtitle: 'Negotiable Instruments in General', query: 'Negotiable Instruments Law Title I' },
      { title: 'Title II', subtitle: 'Bills of Exchange', query: 'Negotiable Instruments Law Title II' },
      { title: 'Title III', subtitle: 'Promissory Notes and Checks', query: 'Negotiable Instruments Law Title III' },
      { title: 'Title IV', subtitle: 'General Provisions', query: 'Negotiable Instruments Law Title IV' },
    ]
  },
  { 
    id: 'BANKING_LAWS', 
    name: 'Banking Laws', 
    description: 'NCBA, GBL, and Secrecy of Bank Deposits.', 
    category: 'Commercial Law',
    subcategory: 'Banking and Investments',
    structure: [
      { title: 'RA 7653', subtitle: 'New Central Bank Act', query: 'RA 7653 New Central Bank Act' },
      { title: 'RA 8791', subtitle: 'General Banking Law', query: 'RA 8791 General Banking Law' },
      { title: 'RA 1405', subtitle: 'Secrecy of Bank Deposits', query: 'RA 1405 Secrecy of Bank Deposits' },
      { title: 'PDIC', subtitle: 'PDIC Charter (RA 3591)', query: 'RA 3591 PDIC Charter' },
    ]
  },
  { 
    id: 'TRANSPORT_LAWS', 
    name: 'Transportation Laws', 
    description: 'Public Service Act and Common Carriers.', 
    category: 'Commercial Law',
    subcategory: 'Transportation',
    structure: [
      { title: 'Common Carriers', subtitle: 'Civil Code Arts. 1732-1766', query: 'Civil Code Common Carriers Articles 1732-1766' },
      { title: 'Public Service Act', subtitle: 'CA 146 as amended by RA 11659', query: 'Public Service Act CA 146' },
      { title: 'Maritime Commerce', subtitle: 'Code of Commerce (Book III)', query: 'Code of Commerce Book III' },
    ]
  },
  { 
    id: 'FRIA', 
    name: 'FRIA (RA 10142)', 
    description: 'Financial Rehabilitation and Insolvency Act.', 
    category: 'Commercial Law',
    subcategory: 'Insolvency and Secured Transactions',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 10142 Chapter I' },
      { title: 'Chapter II', subtitle: 'Court-Supervised Rehabilitation', query: 'RA 10142 Chapter II' },
      { title: 'Chapter III', subtitle: 'Pre-Negotiated Rehabilitation', query: 'RA 10142 Chapter III' },
      { title: 'Chapter VI', subtitle: 'Liquidation of Juridical Debtors', query: 'RA 10142 Chapter VI' },
    ]
  },
  { 
    id: 'PPSA', 
    name: 'PPSA (RA 11057)', 
    description: 'Personal Property Security Act.', 
    category: 'Commercial Law',
    subcategory: 'Insolvency and Secured Transactions',
    structure: [
      { title: 'Chapter 1', subtitle: 'General Provisions', query: 'RA 11057 Chapter 1' },
      { title: 'Chapter 2', subtitle: 'Creation of Security Interest', query: 'RA 11057 Chapter 2' },
      { title: 'Chapter 3', subtitle: 'Perfection of Security Interest', query: 'RA 11057 Chapter 3' },
      { title: 'Chapter 6', subtitle: 'Enforcement of Security Interest', query: 'RA 11057 Chapter 6' },
    ]
  },
  { 
    id: 'COMPETITION', 
    name: 'Philippine Competition Act (RA 10667)', 
    description: 'Anti-trust and fair competition.', 
    category: 'Commercial Law',
    subcategory: 'Competition and Trade',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 10667 Chapter I' },
      { title: 'Chapter II', subtitle: 'Philippine Competition Commission', query: 'RA 10667 Chapter II' },
      { title: 'Chapter III', subtitle: 'Prohibited Acts', query: 'RA 10667 Chapter III' },
    ]
  },
  { 
    id: 'DPA', 
    name: 'Data Privacy Act (RA 10173)', 
    description: 'Protection of personal data.', 
    category: 'Special Laws',
    subcategory: 'Cyber and Technology',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 10173 Chapter I' },
      { title: 'Chapter II', subtitle: 'The National Privacy Commission', query: 'RA 10173 Chapter II' },
      { title: 'Chapter III', subtitle: 'Processing of Personal Information', query: 'RA 10173 Chapter III' },
      { title: 'Chapter IV', subtitle: 'Rights of the Data Subject', query: 'RA 10173 Chapter IV' },
      { title: 'Chapter VIII', subtitle: 'Penalties', query: 'RA 10173 Chapter VIII' },
    ]
  },
  { 
    id: 'CONSUMER_ACT', 
    name: 'Consumer Act (RA 7394)', 
    description: 'Consumer protection standards.', 
    category: 'Commercial Law',
    subcategory: 'Competition and Trade',
    structure: [
      { title: 'Title I', subtitle: 'General Provisions', query: 'RA 7394 Title I' },
      { title: 'Title II', subtitle: 'Consumer Product Quality and Safety', query: 'RA 7394 Title II' },
      { title: 'Title III', subtitle: 'Protection Against Deceptive Sales Acts', query: 'RA 7394 Title III' },
    ]
  },
  
  // --- LABOR LAW ---
  { 
    id: 'LABOR_CODE', 
    name: 'Labor Code (PD 442)', 
    description: 'Employment, Labor Relations, and Termination.', 
    category: 'Labor Law and Social Legislation',
    structure: [
      { title: 'Preliminary Title', subtitle: 'General Provisions', query: 'Labor Code Preliminary Title' },
      { title: 'Book I', subtitle: 'Pre-Employment', query: 'Labor Code Book I' },
      { title: 'Book II', subtitle: 'Human Resources Development', query: 'Labor Code Book II' },
      { title: 'Book III', subtitle: 'Conditions of Employment (Arts. 82-96)', query: 'Labor Code Book III' },
      { title: 'Book IV', subtitle: 'Health, Safety and Social Welfare Benefits', query: 'Labor Code Book IV' },
      { title: 'Book V', subtitle: 'Labor Relations', query: 'Labor Code Book V' },
      { title: 'Book VI', subtitle: 'Post Employment (Termination)', query: 'Labor Code Book VI' },
      { title: 'Book VII', subtitle: 'Transitory and Final Provisions', query: 'Labor Code Book VII' },
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
      { title: 'Section 1', subtitle: 'Coverage', query: 'PD 851 Section 1' },
      { title: 'Section 2', subtitle: 'Amount', query: 'PD 851 Section 2' },
      { title: 'Section 3', subtitle: 'Payment', query: 'PD 851 Section 3' },
    ]
  },
  { 
    id: 'SERVICE_CHARGE', 
    name: 'Service Charge Law (RA 11360)', 
    description: 'An Act Providing that 100% of Service Charges shall be Distributed to Employees.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Special Labor Laws',
    structure: [
      { title: 'Section 1', subtitle: 'Amendment to Art 96 of Labor Code', query: 'RA 11360 Section 1' },
      { title: 'DOLE DO 206-19', subtitle: 'Implementing Rules and Regulations', query: 'DOLE Department Order 206-19' },
    ]
  },
  { 
    id: 'PATERNITY_LEAVE', 
    name: 'Paternity Leave Act (RA 8187)', 
    description: 'Granting Paternity Leave to all Married Male Employees.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Special Labor Laws',
    structure: [
      { title: 'Section 2', subtitle: 'Paternity Leave', query: 'RA 8187 Section 2' },
      { title: 'Section 3', subtitle: 'Conditions', query: 'RA 8187 Section 3' },
    ]
  },
  { 
    id: 'SOLO_PARENT', 
    name: 'Solo Parents Welfare Act (RA 11861)', 
    description: 'Expanded benefits for solo parents.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Special Labor Laws',
    structure: [
      { title: 'Section 3', subtitle: 'Definition of Terms', query: 'RA 11861 Section 3' },
      { title: 'Section 8', subtitle: 'Parental Leave', query: 'RA 11861 Section 8' },
      { title: 'Section 15', subtitle: 'Additional Benefits', query: 'RA 11861 Section 15' },
    ]
  },
  { 
    id: 'KASAMBAHAY', 
    name: 'Kasambahay Law (RA 10361)', 
    description: 'Domestic Workers Act.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Special Labor Laws',
    structure: [
      { title: 'Article I', subtitle: 'General Provisions', query: 'RA 10361 Article I' },
      { title: 'Article II', subtitle: 'Rights and Privileges', query: 'RA 10361 Article II' },
      { title: 'Article III', subtitle: 'Pre-Employment', query: 'RA 10361 Article III' },
      { title: 'Article IV', subtitle: 'Employment', query: 'RA 10361 Article IV' },
      { title: 'Article V', subtitle: 'Post Employment', query: 'RA 10361 Article V' },
    ]
  },
  { 
    id: 'DO_174', 
    name: 'DOLE DO 174-17 (Contracting)', 
    description: 'Rules Implementing Articles 106-109 of the Labor Code.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'DOLE Issuances',
    structure: [
      { title: 'Section 1', subtitle: 'Scope', query: 'DOLE DO 174-17 Section 1' },
      { title: 'Section 5', subtitle: 'Prohibition against Labor-only Contracting', query: 'DOLE DO 174-17 Section 5' },
      { title: 'Section 14', subtitle: 'Mandatory Provisions of Service Agreement', query: 'DOLE DO 174-17 Section 14' },
    ]
  },
  { 
    id: 'OSH_LAW', 
    name: 'OSH Law (RA 11058)', 
    description: 'Occupational Safety and Health Standards Law.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'DOLE Issuances',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 11058 Chapter I' },
      { title: 'Chapter III', subtitle: 'Duties of Employers, Workers', query: 'RA 11058 Chapter III' },
      { title: 'Chapter IV', subtitle: 'Covered Workplaces', query: 'RA 11058 Chapter IV' },
    ]
  },
  { 
    id: 'CARL', 
    name: 'CARL (RA 6657)', 
    description: 'Comprehensive Agrarian Reform Law.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Agrarian Reform',
    structure: [
      { title: 'Chapter I', subtitle: 'Preliminary Provisions', query: 'RA 6657 Chapter I' },
      { title: 'Chapter II', subtitle: 'Coverage', query: 'RA 6657 Chapter II' },
      { title: 'Chapter VII', subtitle: 'Land Acquisition', query: 'RA 6657 Chapter VII' },
    ]
  },
  { 
    id: 'AGRARIAN_CODE', 
    name: 'Code of Agrarian Reforms (RA 3844)', 
    description: 'Agricultural Land Reform Code.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Agrarian Reform',
    structure: [
      { title: 'Chapter I', subtitle: 'Agricultural Leasehold System', query: 'RA 3844 Chapter I' },
      { title: 'Chapter II', subtitle: 'Bill of Rights for Agricultural Labor', query: 'RA 3844 Chapter II' },
    ]
  },
  { 
    id: 'SSS_LAW', 
    name: 'Social Security Act (RA 11199)', 
    description: 'SSS Law of 2018.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Social Legislation',
    structure: [
      { title: 'Title I', subtitle: 'General Provisions', query: 'RA 11199 Title I' },
      { title: 'Title II', subtitle: 'Coverage and Benefits', query: 'RA 11199 Title II' },
    ]
  },
  { 
    id: 'GSIS_LAW', 
    name: 'GSIS Act (RA 8291)', 
    description: 'Government Service Insurance System Act.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Social Legislation',
    structure: [
      { title: 'Title I', subtitle: 'General Provisions', query: 'RA 8291 Title I' },
      { title: 'Title II', subtitle: 'Membership and Contribution', query: 'RA 8291 Title II' },
      { title: 'Title III', subtitle: 'Benefits', query: 'RA 8291 Title III' },
    ]
  },
  { 
    id: 'PHILHEALTH', 
    name: 'PhilHealth Act (RA 7875/RA 11223)', 
    description: 'Universal Health Care Act.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Social Legislation',
    structure: [
      { title: 'Chapter I', subtitle: 'General Provisions', query: 'RA 11223 Chapter I' },
      { title: 'Chapter II', subtitle: 'Universal Health Care', query: 'RA 11223 Chapter II' },
    ]
  },
  { 
    id: 'MIGRANT_WORKERS', 
    name: 'Migrant Workers Act (RA 8042)', 
    description: 'Protection of Filipino Migrant Workers.', 
    category: 'Labor Law and Social Legislation',
    subcategory: 'Social Legislation',
    structure: [
      { title: 'Section 1', subtitle: 'Short Title & Declaration of Policies', query: 'RA 8042 Section 1' },
      { title: 'Section 6', subtitle: 'Illegal Recruitment', query: 'RA 8042 Section 6' },
      { title: 'Section 10', subtitle: 'Money Claims', query: 'RA 8042 Section 10' },
    ]
  },

  // --- TAXATION LAW ---
  { 
    id: 'TAX_CODE', 
    name: 'NIRC (RA 8424 as Amended)', 
    description: 'National Internal Revenue Code (TRAIN/CREATE).', 
    category: 'Taxation Law',
    structure: [
      { title: 'Title I', subtitle: 'Organization and Function of BIR', query: 'NIRC Title I' },
      { title: 'Title II', subtitle: 'Tax on Income', query: 'NIRC Title II Tax on Income' },
      { title: 'Title III', subtitle: 'Estate and Donor\'s Taxes', query: 'NIRC Title III' },
      { title: 'Title IV', subtitle: 'Value-Added Tax', query: 'NIRC Title IV VAT' },
      { title: 'Title V', subtitle: 'Other Percentage Taxes', query: 'NIRC Title V' },
      { title: 'Title X', subtitle: 'Statutory Offenses and Penalties', query: 'NIRC Title X' },
    ]
  },
  { 
    id: 'CMTA', 
    name: 'CMTA (RA 10863)', 
    description: 'Customs Modernization and Tariff Act.', 
    category: 'Taxation Law',
    structure: [
      { title: 'Title I', subtitle: 'Preliminary Provisions', query: 'RA 10863 Title I' },
      { title: 'Title II', subtitle: 'Bureau of Customs', query: 'RA 10863 Title II' },
      { title: 'Title IV', subtitle: 'Import Clearance and Formalities', query: 'RA 10863 Title IV' },
    ]
  },
  { 
    id: 'TAX_AMNESTY', 
    name: 'Tax Amnesty Act (RA 11213)', 
    description: 'Estate Tax Amnesty and General Tax Amnesty.', 
    category: 'Taxation Law',
    structure: [
      { title: 'Title II', subtitle: 'Estate Tax Amnesty', query: 'RA 11213 Title II' },
      { title: 'Title III', subtitle: 'General Tax Amnesty', query: 'RA 11213 Title III' },
    ]
  },
  { 
    id: 'CTA_LAW', 
    name: 'CTA Law (RA 1125/RA 9282)', 
    description: 'Jurisdiction of the Court of Tax Appeals.', 
    category: 'Taxation Law',
    structure: [
      { title: 'Section 7', subtitle: 'Jurisdiction', query: 'RA 1125 Section 7' },
      { title: 'Section 11', subtitle: 'Who May Appeal', query: 'RA 1125 Section 11' },
    ]
  },
  { 
    id: 'LGC_TAX', 
    name: 'Real Property Taxation', 
    description: 'Local Government Code Book II Title II.', 
    category: 'Taxation Law',
    structure: [
      { title: 'Chapter 1', subtitle: 'General Provisions', query: 'LGC Book II Title II Chapter 1' },
      { title: 'Chapter 2', subtitle: 'Appraisal and Assessment', query: 'LGC Book II Title II Chapter 2' },
      { title: 'Chapter 4', subtitle: 'Imposition of Real Property Tax', query: 'LGC Book II Title II Chapter 4' },
    ]
  },

  // --- ENVIRONMENTAL LAW ---
  {
    id: 'ENV_RULES',
    name: 'Rules of Procedure for Environmental Cases',
    description: 'A.M. No. 09-6-8-SC',
    category: 'Environmental Law',
    subcategory: 'Procedure',
    structure: [
      { title: 'Part I', subtitle: 'General Provisions', query: 'A.M. No. 09-6-8-SC Part I' },
      { title: 'Part II', subtitle: 'Civil Procedure', query: 'A.M. No. 09-6-8-SC Part II' },
      { title: 'Part III', subtitle: 'Special Civil Actions (Kalikasan)', query: 'A.M. No. 09-6-8-SC Part III' },
      { title: 'Part IV', subtitle: 'Criminal Procedure', query: 'A.M. No. 09-6-8-SC Part IV' },
    ]
  },
  {
    id: 'CLIMATE_CHANGE',
    name: 'Climate Change Act (RA 9729)',
    description: 'Mainstreaming climate change into government policy.',
    category: 'Environmental Law',
    subcategory: 'Energy and Climate',
    structure: [
      { title: 'Section 2', subtitle: 'Declaration of Policy', query: 'RA 9729 Section 2' },
      { title: 'Section 4', subtitle: 'Climate Change Commission', query: 'RA 9729 Section 4' },
    ]
  },
  {
    id: 'DRRM_ACT',
    name: 'DRRM Act (RA 10121)',
    description: 'Disaster Risk Reduction and Management Act.',
    category: 'Environmental Law',
    subcategory: 'Energy and Climate',
    structure: [
      { title: 'Section 5', subtitle: 'NDRPMC', query: 'RA 10121 Section 5' },
      { title: 'Section 10', subtitle: 'LDRRMC', query: 'RA 10121 Section 10' },
    ]
  },
  {
    id: 'RE_ACT',
    name: 'Renewable Energy Act (RA 9513)',
    description: 'Promoting development of renewable energy.',
    category: 'Environmental Law',
    subcategory: 'Energy and Climate',
    structure: [
      { title: 'Chapter III', subtitle: 'On-Grid Renewable Energy Development', query: 'RA 9513 Chapter III' },
      { title: 'Chapter VII', subtitle: 'General Incentives', query: 'RA 9513 Chapter VII' },
    ]
  },
  {
    id: 'CLEAN_AIR',
    name: 'Clean Air Act (RA 8749)',
    description: 'Comprehensive Air Pollution Policy.',
    category: 'Environmental Law',
    subcategory: 'Environment and Resource Management',
    structure: [
      { title: 'Chapter 1', subtitle: 'General Provisions', query: 'RA 8749 Chapter 1' },
      { title: 'Chapter 2', subtitle: 'Air Quality Management System', query: 'RA 8749 Chapter 2' },
    ]
  },
  {
    id: 'CLEAN_WATER',
    name: 'Clean Water Act (RA 9275)',
    description: 'Protection of water bodies.',
    category: 'Environmental Law',
    subcategory: 'Environment and Resource Management',
    structure: [
      { title: 'Chapter 1', subtitle: 'General Provisions', query: 'RA 9275 Chapter 1' },
      { title: 'Chapter 2', subtitle: 'Water Quality Management Area', query: 'RA 9275 Chapter 2' },
    ]
  },
  {
    id: 'SOLID_WASTE',
    name: 'Ecological Solid Waste Management (RA 9003)',
    description: 'Systematic solid waste management.',
    category: 'Environmental Law',
    subcategory: 'Environment and Resource Management',
    structure: [
      { title: 'Chapter I', subtitle: 'Basic Policies', query: 'RA 9003 Chapter I' },
      { title: 'Chapter III', subtitle: 'Generation and Storage', query: 'RA 9003 Chapter III' },
    ]
  },
  {
    id: 'MINING_ACT',
    name: 'Philippine Mining Act (RA 7942)',
    description: 'Exploration and development of mineral resources.',
    category: 'Environmental Law',
    subcategory: 'Conservation and Land Use',
    structure: [
      { title: 'Chapter I', subtitle: 'Introductory Provisions', query: 'RA 7942 Chapter I' },
      { title: 'Chapter III', subtitle: 'Mineral Agreements', query: 'RA 7942 Chapter III' },
    ]
  },
  {
    id: 'FORESTRY_CODE',
    name: 'Forestry Code (PD 705)',
    description: 'Revised Forestry Code.',
    category: 'Environmental Law',
    subcategory: 'Conservation and Land Use',
    structure: [
      { title: 'Chapter I', subtitle: 'Organization and Jurisdiction', query: 'PD 705 Chapter I' },
      { title: 'Chapter III', subtitle: 'Utilization and Management', query: 'PD 705 Chapter III' },
    ]
  },
  {
    id: 'NIPAS',
    name: 'NIPAS Act (RA 7586 / RA 11038)',
    description: 'National Integrated Protected Areas System.',
    category: 'Environmental Law',
    subcategory: 'Conservation and Land Use',
    structure: [
      { title: 'Section 4', subtitle: 'Definition of Terms', query: 'RA 7586 Section 4' },
      { title: 'Section 5', subtitle: 'Establishment of NIPAS', query: 'RA 7586 Section 5' },
    ]
  },

  // --- SPECIAL LAWS (Added to separate category) ---
  {
    id: 'DANGEROUS_DRUGS',
    name: 'Dangerous Drugs Act (RA 9165)',
    description: 'Comprehensive Dangerous Drugs Act of 2002.',
    category: 'Special Laws',
    structure: [
      { title: 'Article I', subtitle: 'Definition of Terms', query: 'RA 9165 Article I' },
      { title: 'Article II', subtitle: 'Unlawful Acts and Penalties', query: 'RA 9165 Article II' },
      { title: 'Article III', subtitle: 'Dangerous Drugs Board', query: 'RA 9165 Article III' },
    ]
  },
  {
    id: 'VAWC',
    name: 'VAWC Act (RA 9262)',
    description: 'Anti-Violence Against Women and Their Children.',
    category: 'Special Laws',
    structure: [
      { title: 'Section 3', subtitle: 'Definitions', query: 'RA 9262 Section 3' },
      { title: 'Section 5', subtitle: 'Acts of Violence', query: 'RA 9262 Section 5' },
      { title: 'Section 8', subtitle: 'Protection Orders', query: 'RA 9262 Section 8' },
    ]
  },
  {
    id: 'ANTI_GRAFT',
    name: 'Anti-Graft (RA 3019)',
    description: 'Anti-Graft and Corrupt Practices Act.',
    category: 'Special Laws',
    structure: [
      { title: 'Section 3', subtitle: 'Corrupt Practices', query: 'RA 3019 Section 3' },
      { title: 'Section 7', subtitle: 'Statement of Assets and Liabilities', query: 'RA 3019 Section 7' },
    ]
  },
  {
    id: 'CHILD_ABUSE',
    name: 'Child Abuse Law (RA 7610)',
    description: 'Special Protection of Children Against Abuse.',
    category: 'Special Laws',
    structure: [
      { title: 'Article I', subtitle: 'Title and Policy', query: 'RA 7610 Article I' },
      { title: 'Article III', subtitle: 'Child Prostitution/Trafficking', query: 'RA 7610 Article III' },
      { title: 'Article VI', subtitle: 'Other Acts of Abuse', query: 'RA 7610 Article VI' },
    ]
  },
  {
    id: 'ANTI_TERROR',
    name: 'Anti-Terrorism Act (RA 11479)',
    description: 'Prevention and punishment of terrorism.',
    category: 'Special Laws',
    structure: [
      { title: 'Section 4', subtitle: 'Terrorism', query: 'RA 11479 Section 4' },
      { title: 'Section 25', subtitle: 'Designation of Terrorist', query: 'RA 11479 Section 25' },
      { title: 'Section 29', subtitle: 'Detention without Warrant', query: 'RA 11479 Section 29' },
    ]
  },
  {
    id: 'SAFE_SPACES',
    name: 'Safe Spaces Act (RA 11313)',
    description: 'Bawal Bastos Law.',
    category: 'Special Laws',
    structure: [
      { title: 'Article I', subtitle: 'Gender-Based Streets/Public Spaces Harassment', query: 'RA 11313 Article I' },
      { title: 'Article II', subtitle: 'Gender-Based Online Sexual Harassment', query: 'RA 11313 Article II' },
    ]
  },
  {
    id: 'BP_22',
    name: 'Bouncing Checks Law (BP 22)',
    description: 'An Act Penalizing the Making or Drawing of Checks without Sufficient Funds.',
    category: 'Special Laws',
    structure: [
      { title: 'Section 1', subtitle: 'Checks without sufficient funds', query: 'BP 22 Section 1' },
      { title: 'Section 2', subtitle: 'Evidence of knowledge', query: 'BP 22 Section 2' },
    ]
  },
  {
    id: 'CPRA',
    name: 'Code of Professional Responsibility (CPRA)',
    description: 'A.M. No. 22-09-01-SC (New Ethical Code).',
    category: 'Legal and Judicial Ethics',
    structure: [
      { title: 'Canon I', subtitle: 'Independence', query: 'CPRA Canon I' },
      { title: 'Canon II', subtitle: 'Propriety', query: 'CPRA Canon II' },
      { title: 'Canon III', subtitle: 'Fidelity', query: 'CPRA Canon III' },
      { title: 'Canon IV', subtitle: 'Competence and Diligence', query: 'CPRA Canon IV' },
      { title: 'Canon V', subtitle: 'Equality', query: 'CPRA Canon V' },
      { title: 'Canon VI', subtitle: 'Accountability', query: 'CPRA Canon VI' },
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
