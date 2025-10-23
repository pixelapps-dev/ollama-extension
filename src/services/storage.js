/**
 * Storage service for managing settings and data persistence
 */

import { STORAGE_KEYS, DEFAULT_CONFIG } from '../utils/constants.js';

/**
 * Get settings from storage
 * @returns {Object} Application settings
 */
export function getSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      const settings = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      return deepMerge(DEFAULT_CONFIG, settings);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Save settings to storage
 * @param {Object} settings - Settings to save
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

/**
 * Update specific setting
 * @param {string} path - Dot-notation path (e.g., 'ollama.host')
 * @param {*} value - Value to set
 */
export function updateSetting(path, value) {
  const settings = getSettings();
  setNestedValue(settings, path, value);
  return saveSettings(settings);
}

/**
 * Get specific setting
 * @param {string} path - Dot-notation path
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Setting value
 */
export function getSetting(path, defaultValue = null) {
  const settings = getSettings();
  return getNestedValue(settings, path, defaultValue);
}

/**
 * Get all conversations
 * @returns {Array} Array of conversation objects
 */
export function getConversations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
}

/**
 * Save all conversations
 * @param {Array} conversations - Array of conversation objects
 */
export function saveConversations(conversations) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    return true;
  } catch (error) {
    console.error('Error saving conversations:', error);
    return false;
  }
}

/**
 * Get a specific conversation by ID
 * @param {string} id - Conversation ID
 * @returns {Object|null} Conversation object or null
 */
export function getConversation(id) {
  const conversations = getConversations();
  return conversations.find(c => c.id === id) || null;
}

/**
 * Save a conversation
 * @param {Object} conversation - Conversation object
 */
export function saveConversation(conversation) {
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === conversation.id);

  if (index >= 0) {
    conversations[index] = conversation;
  } else {
    conversations.push(conversation);
  }

  return saveConversations(conversations);
}

/**
 * Delete a conversation
 * @param {string} id - Conversation ID
 */
export function deleteConversation(id) {
  const conversations = getConversations();
  const filtered = conversations.filter(c => c.id !== id);
  return saveConversations(filtered);
}

/**
 * Get active conversation ID
 * @returns {string|null} Active conversation ID
 */
export function getActiveConversationId() {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONVERSATION);
}

/**
 * Set active conversation ID
 * @param {string} id - Conversation ID
 */
export function setActiveConversationId(id) {
  if (id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVERSATION, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONVERSATION);
  }
}

/**
 * Get page context
 * @returns {Object|null} Page context object
 */
export function getPageContext() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PAGE_CONTEXT);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading page context:', error);
    return null;
  }
}

/**
 * Save page context
 * @param {Object} context - Page context object
 */
export function savePageContext(context) {
  try {
    if (context) {
      localStorage.setItem(STORAGE_KEYS.PAGE_CONTEXT, JSON.stringify(context));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PAGE_CONTEXT);
    }
    return true;
  } catch (error) {
    console.error('Error saving page context:', error);
    return false;
  }
}

/**
 * Clear all data (reset app)
 */
export function clearAllData() {
  localStorage.clear();
}

/**
 * Export all data
 * @returns {Object} All app data
 */
export function exportData() {
  return {
    settings: getSettings(),
    conversations: getConversations(),
    version: '2.0.0',
    exportDate: new Date().toISOString()
  };
}

/**
 * Import data
 * @param {Object} data - Data to import
 * @returns {boolean} Success status
 */
export function importData(data) {
  try {
    if (data.settings) {
      saveSettings(data.settings);
    }
    if (data.conversations) {
      saveConversations(data.conversations);
    }
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

// Helper functions

/**
 * Deep merge objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
}

/**
 * Get nested object value using dot notation
 * @param {Object} obj - Object to query
 * @param {string} path - Dot notation path
 * @param {*} defaultValue - Default value
 * @returns {*} Value or default
 */
function getNestedValue(obj, path, defaultValue = null) {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }

  return result;
}

/**
 * Set nested object value using dot notation
 * @param {Object} obj - Object to modify
 * @param {string} path - Dot notation path
 * @param {*} value - Value to set
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}
