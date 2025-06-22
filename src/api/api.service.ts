import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT, ENABLE_DEBUG_MODE } from './config';
import { ApiResponse, User, Label } from './types';
import axios from 'axios';
import { LabelRequest, ParagraphRequest, GetNextSentenceResponse, GetUnlabeledSentencesResponse, LabelResponse, ParagraphResponse } from './types';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      if (ENABLE_DEBUG_MODE) {
        console.log(`API Request: ${API_BASE_URL}${endpoint}`, options);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (ENABLE_DEBUG_MODE) {
        console.log(`API Response:`, data);
      }
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (ENABLE_DEBUG_MODE) {
        console.error(`API Error:`, error);
      }
      throw error;
    }
  }

  // Users API
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>(API_ENDPOINTS.USERS);
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USER_BY_ID(id));
  }

  async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    return this.request<User>(API_ENDPOINTS.USERS, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Labels API
  async getLabels(): Promise<ApiResponse<Label[]>> {
    return this.request<Label[]>(API_ENDPOINTS.LABELS);
  }

  async getLabelById(id: number): Promise<ApiResponse<Label>> {
    return this.request<Label>(API_ENDPOINTS.LABEL_BY_ID(id));
  }

  async createLabel(labelData: Omit<Label, 'id' | 'createdAt'>): Promise<ApiResponse<Label>> {
    return this.request<Label>(API_ENDPOINTS.LABELS, {
      method: 'POST',
      body: JSON.stringify(labelData),
    });
  }

  async updateLabel(id: number, labelData: Partial<Omit<Label, 'id' | 'createdAt'>>): Promise<ApiResponse<Label>> {
    return this.request<Label>(API_ENDPOINTS.LABEL_BY_ID(id), {
      method: 'PATCH',
      body: JSON.stringify(labelData),
    });
  }

  async deleteLabel(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.LABEL_BY_ID(id), {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

// Configure axios with default settings
axios.defaults.timeout = API_TIMEOUT;
axios.defaults.baseURL = API_BASE_URL;

if (ENABLE_DEBUG_MODE) {
    axios.interceptors.request.use(request => {
        console.log('Axios Request:', request);
        return request;
    });
    
    axios.interceptors.response.use(
        response => {
            console.log('Axios Response:', response);
            return response;
        },
        error => {
            console.error('Axios Error:', error);
            return Promise.reject(error);
        }
    );
}

export const LabelingService = {
    // Get next unlabeled sentence
    getNextSentence: async (): Promise<GetNextSentenceResponse> => {
        const response = await axios.get<GetNextSentenceResponse>('/api/random-text');
        return response.data;
    },

    // Get all unlabeled sentences
    getUnlabeledSentences: async (): Promise<string[]> => {
        const response = await axios.get<GetUnlabeledSentencesResponse>('/api/unlabeled');
        return response.data.sentences;
    },

    // Submit a paragraph to be split into sentences
    submitParagraph: async (paragraph: string): Promise<ParagraphResponse> => {
        const response = await axios.post<ParagraphResponse>('/api/admin/sentences', {
            paragraph
        } as ParagraphRequest);
        return response.data;
    },

    // Label a sentence
    labelSentence: async (text: string, category: string): Promise<LabelResponse> => {
        const response = await axios.post<LabelResponse>('/api/label', {
            text,
            category
        } as LabelRequest);
        return response.data;
    },

    // Label user input directly
    labelUserInput: async (text: string, category: string): Promise<LabelResponse> => {
        const response = await axios.post<LabelResponse>('/api/label-user-input', {
            text,
            category
        } as LabelRequest);
        return response.data;
    }
}; 