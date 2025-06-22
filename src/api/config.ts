// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10);
export const APP_ENV = process.env.REACT_APP_ENV || 'development';
export const ENABLE_DEBUG_MODE = process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true';
export const ENABLE_3D_MODEL = process.env.REACT_APP_ENABLE_3D_MODEL !== 'false';

// Development configurations
export const MOCK_API = process.env.REACT_APP_MOCK_API === 'true';
export const LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || 'info';

export const API_ENDPOINTS = {
  // Users
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  
  // Labels
  LABELS: '/labels',
  LABEL_BY_ID: (id: number) => `/labels/${id}`,
} as const; 