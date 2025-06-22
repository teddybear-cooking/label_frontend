// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Example types for your API
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  createdAt: string;
}

export type LabelCategory = 'normal' | 'hate_speech' | 'offensive' | 'religious_hate' | 'political_hate';

export interface LabelRequest {
    text: string;
    category: LabelCategory;
}

export interface ParagraphRequest {
    paragraph: string;
}

export interface TextResponse {
    text: string;
}

export interface LabelResponse {
    success: boolean;
    message?: string;
}

export interface ParagraphResponse {
    message: string;
    count: number;
    sentences: string[];
}

export interface GetNextSentenceResponse {
    text: string;
}

export interface GetUnlabeledSentencesResponse {
    sentences: string[];
} 