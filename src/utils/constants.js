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
  currentModel: '',
  ollama: {
    host: 'http://localhost:11434'
  },
  openrouter: {
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1'
  },
  ui: {
    theme: 'dark', // 'dark', 'light', 'monochrome', 'high-contrast'
    autoScroll: true,
    openMode: 'sidepanel', // 'sidepanel' or 'tab'
    sidebarWidth: 280,
    fontSize: 'medium', // 'small', 'medium', 'large'
    compactMode: false,
    showTokenCount: true,
    showPerformanceMetrics: false
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
  FOCUS_INPUT: ['Ctrl+L', 'Cmd+L'],
  COMMAND_PALETTE: ['Ctrl+K', 'Cmd+K'],
  TOGGLE_SIDEBAR: ['Ctrl+B', 'Cmd+B']
};

/**
 * Available themes
 */
export const THEMES = {
  DARK: {
    id: 'dark',
    name: 'Dark',
    description: 'Default dark theme'
  },
  LIGHT: {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme'
  },
  MONOCHROME: {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Simple black and white'
  },
  HIGH_CONTRAST: {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Enhanced accessibility'
  }
};

/**
 * Prompt templates for quick use
 */
export const PROMPT_TEMPLATES = [
  {
    id: 'default',
    name: 'Default Assistant',
    description: 'Balanced, helpful responses',
    prompt: 'You are a helpful AI assistant. Provide clear, accurate, and thoughtful responses.'
  },
  {
    id: 'concise',
    name: 'Concise Mode',
    description: 'Short, direct answers',
    prompt: 'You are a concise AI assistant. Provide brief, direct answers in 2-3 sentences maximum. Get straight to the point.'
  },
  {
    id: 'detailed',
    name: 'Detailed Explainer',
    description: 'Thorough, comprehensive responses',
    prompt: 'You are a detailed AI assistant. Provide comprehensive explanations with examples, context, and multiple perspectives. Be thorough and educational.'
  },
  {
    id: 'code',
    name: 'Coding Assistant',
    description: 'Programming help with best practices',
    prompt: 'You are an expert programming assistant. Provide clean, well-commented code following best practices. Explain your reasoning and suggest improvements. Always consider edge cases and error handling.'
  },
  {
    id: 'teacher',
    name: 'Patient Teacher',
    description: 'Educational, step-by-step guidance',
    prompt: 'You are a patient, encouraging teacher. Break down complex topics into simple steps. Use analogies and examples. Check for understanding and adjust explanations as needed.'
  },
  {
    id: 'creative',
    name: 'Creative Writer',
    description: 'Imaginative, engaging content',
    prompt: 'You are a creative writing assistant. Use vivid language, interesting metaphors, and engaging storytelling. Be imaginative while maintaining clarity.'
  },
  {
    id: 'analyst',
    name: 'Critical Analyst',
    description: 'Analytical, objective evaluation',
    prompt: 'You are a critical analyst. Examine topics from multiple angles. Identify strengths, weaknesses, assumptions, and implications. Be objective and thorough in your analysis.'
  },
  {
    id: 'debug',
    name: 'Debug Helper',
    description: 'Systematic debugging assistance',
    prompt: 'You are a debugging expert. Systematically analyze errors, suggest fixes, and explain root causes. Ask clarifying questions. Provide step-by-step troubleshooting guidance.'
  },
  {
    id: 'summarizer',
    name: 'Summarizer',
    description: 'Extract key points efficiently',
    prompt: 'You are a summarization expert. Extract and present the most important information concisely. Use bullet points for clarity. Highlight key takeaways.'
  },
  {
    id: 'socratic',
    name: 'Socratic Guide',
    description: 'Ask questions to guide learning',
    prompt: 'You are a Socratic tutor. Guide learning through thoughtful questions. Help users discover answers themselves. Encourage critical thinking and reflection.'
  }
];

/**
 * Model capability indicators
 */
export const MODEL_CAPABILITIES = {
  VISION: 'vision',
  TOOLS: 'tools',
  LONG_CONTEXT: 'long_context',
  CODE: 'code',
  MULTILINGUAL: 'multilingual',
  FAST: 'fast'
};

/**
 * Message actions
 */
export const MESSAGE_ACTIONS = {
  COPY: 'copy',
  EDIT: 'edit',
  REGENERATE: 'regenerate',
  DELETE: 'delete',
  BRANCH: 'branch'
};
