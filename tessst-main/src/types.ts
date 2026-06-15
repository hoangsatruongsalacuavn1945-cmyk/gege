export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  mass: string;
  category: string;
  phase: 'gas' | 'liquid' | 'solid' | 'synthetic';
  electronegativity?: number;
  density?: string;
  meltingPoint?: string;
  summary: string;
  electronConfiguration: string;
}

export type IntentType = 'search_qa' | 'compare' | 'pronunciation' | 'game_quiz' | 'reaction_simulate' | 'curriculum_prep';

export interface SearchQAResponse {
  intent: 'search_qa';
  elements_to_highlight: string[];
  spoken_response: string;
}

export interface CompareResponse {
  intent: 'compare';
  elements_to_compare: string[]; // e.g. ["O", "S"]
  spoken_response: string;
}

export interface PronunciationResponse {
  intent: 'pronunciation';
  score: number;
  spoken_response: string;
}

export interface GameQuizResponse {
  intent: 'game_quiz';
  target_element: string;
  spoken_response: string;
}

export interface ReactionSimulateResponse {
  intent: 'reaction_simulate';
  balanced_equation: string;
  reactants: string[];
  products: string[];
  hazard_rating: 'safe' | 'caution' | 'danger';
  spoken_response: string;
  visual_description?: string;
}

export interface CurriculumPrepResponse {
  intent: 'curriculum_prep';
  quiz_question: string;
  quiz_options: string[]; // Exactly 4 options: ["Option A", "Option B", "Option C", "Option D"]
  quiz_answer: string; // "A" | "B" | "C" | "D"
  academic_notes: string;
  spoken_response: string;
}

export type ChemResponse = 
  | SearchQAResponse 
  | CompareResponse 
  | PronunciationResponse 
  | GameQuizResponse 
  | ReactionSimulateResponse 
  | CurriculumPrepResponse;
