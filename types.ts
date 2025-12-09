
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CODAL_LIBRARY = 'CODAL_LIBRARY',
  JURISPRUDENCE = 'JURISPRUDENCE',
  CASE_DIGEST = 'CASE_DIGEST',
  MOCK_BAR = 'MOCK_BAR',
  CASE_BUILD = 'CASE_BUILD',
  LAW_REVIEW = 'LAW_REVIEW',
  CONTRACT_DRAFTING = 'CONTRACT_DRAFTING',
  LEGAL_PAD = 'LEGAL_PAD',
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
  query: string; // The specific search query to send to AI (e.g. "Civil Code Book 1 Title 1")
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
  subcategory?: string; // Optional for finer grouping (e.g. "Public International Law")
  structure?: CodalNavigation[];
}

export interface MockBarQuestion {
  type?: 'MCQ' | 'ESSAY';
  question: string;
  choices: string[]; // Empty if Essay
  correctAnswerIndex: number; // -1 if Essay
  explanation: string; // Model Answer for Essay
  citation: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  fields: string[];
}