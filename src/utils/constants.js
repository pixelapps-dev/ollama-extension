/**
 * Application constants
 */

export const APP_NAME = 'Ollama UI';
export const APP_VERSION = '2.0.0';

/**
 * API Provider types
 */
export const PROVIDERS = {
  OLLAMA: 'ollama',
  OPENROUTER: 'openrouter'
};

/**
 * Default configuration
 */
export const DEFAULT_CONFIG = {
  provider: PROVIDERS.OLLAMA,
  ollama: {
    host: 'http://localhost:11434'
  },
  openrouter: {
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1'
  },
  ui: {
    theme: 'dark',
    autoScroll: true
  },
  model: {
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    systemPrompt: ''
  }
};

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  SETTINGS: 'app-settings',
  CONVERSATIONS: 'conversations',
  ACTIVE_CONVERSATION: 'active-conversation',
  PAGE_CONTEXT: 'page-context'
};

/**
 * API endpoints
 */
export const ENDPOINTS = {
  OLLAMA: {
    TAGS: '/api/tags',
    GENERATE: '/api/generate',
    CHAT: '/api/chat'
  },
  OPENROUTER: {
    MODELS: '/models',
    CHAT: '/chat/completions'
  }
};

/**
 * Error messages
 */
export const ERRORS = {
  NETWORK_ERROR: 'Unable to connect to the API server. Please check your connection and settings.',
  INVALID_API_KEY: 'Invalid API key. Please check your settings.',
  MODEL_NOT_FOUND: 'Selected model not found. Please choose another model.',
  CONTEXT_TOO_LARGE: 'Context is too large. Please reduce the amount of text.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
};

/**
 * UI constants
 */
export const UI = {
  MAX_CONTEXT_LENGTH: 100000, // characters
  AUTO_SAVE_INTERVAL: 5000, // ms
  TYPING_INDICATOR_DELAY: 100, // ms
  MAX_CONVERSATION_PREVIEW: 50 // characters
};

/**
 * Model parameter ranges
 */
export const MODEL_PARAMS = {
  temperature: { min: 0, max: 2, step: 0.1, default: 0.7 },
  topP: { min: 0, max: 1, step: 0.05, default: 0.9 },
  maxTokens: { min: 1, max: 32000, step: 1, default: 2048 }
};

/**
 * Keyboard shortcuts
 */
export const SHORTCUTS = {
  SEND_MESSAGE: ['Ctrl+Enter', 'Cmd+Enter'],
  NEW_CHAT: ['Ctrl+N', 'Cmd+N'],
  TOGGLE_SETTINGS: ['Ctrl+,', 'Cmd+,'],
  FOCUS_INPUT: ['Ctrl+L', 'Cmd+L']
};
