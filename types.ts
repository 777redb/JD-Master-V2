
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CODAL_LIBRARY = 'CODAL_LIBRARY',
  LEGAL_DOCTRINES = 'LEGAL_DOCTRINES',
  CASE_DIGEST = 'CASE_DIGEST',
  MOCK_BAR = 'MOCK_BAR',
  CASE_BUILD = 'CASE_BUILD',
  LAW_REVIEW = 'LAW_REVIEW',
  CONTRACT_DRAFTING = 'CONTRACT_DRAFTING',
  LEGAL_PAD = 'LEGAL_PAD',
  JD_PROGRAM = 'JD_PROGRAM',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface CodalNavigation {
  title: string;
  subtitle?: string;
  query: string; 
  children?: CodalNavigation[];
}

export type LawCategory = 
  | 'Political and Public International Law'
  | 'Civil Law'
  | 'Criminal Law'
  | 'Remedial Law'
  | 'Commercial Law'
  | 'Labor Law and Social Legislation'
  | 'Taxation Law'
  | 'Legal and Judicial Ethics'
  | 'Environmental Law'
  | 'Special Laws';

export interface LawCode {
  id: string;
  name: string;
  description: string;
  category: LawCategory;
  subcategory?: string; 
  structure?: CodalNavigation[];
}

export interface JDSubject {
  code: string;
  title: string;
  units: number;
  description?: string;
}

export interface JDSemester {
  name: string;
  subjects: JDSubject[];
}

export interface JDYear {
  year: number;
  semesters: JDSemester[];
}

export interface MockBarQuestion {
  type?: 'MCQ' | 'ESSAY';
  question: string;
  choices: string[]; 
  correctAnswerIndex: number; 
  explanation: string; 
  citation: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  fields: string[];
}
