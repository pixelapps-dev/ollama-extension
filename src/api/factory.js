/**
 * API Provider Factory
 * Creates and manages API provider instances
 */

import { OllamaProvider } from './ollama.js';
import { OpenRouterProvider } from './openrouter.js';
import { PROVIDERS } from '../utils/constants.js';
import { getSettings } from '../services/storage.js';

/**
 * Create an API provider instance based on configuration
 * @param {string} providerType - Provider type (PROVIDERS.OLLAMA or PROVIDERS.OPENROUTER)
 * @param {Object} config - Provider configuration (optional, will use stored settings if not provided)
 * @returns {BaseAPIProvider} API provider instance
 */
export function createProvider(providerType = null, config = null) {
  // If no provider type specified, use current settings
  if (!providerType) {
    const settings = getSettings();
    providerType = settings.provider;
  }

  // If no config specified, use stored settings
  if (!config) {
    const settings = getSettings();
    config = settings[providerType] || {};
  }

  switch (providerType) {
    case PROVIDERS.OLLAMA:
      return new OllamaProvider(config);

    case PROVIDERS.OPENROUTER:
      return new OpenRouterProvider(config);

    default:
      throw new Error(`Unknown provider type: ${providerType}`);
  }
}

/**
 * Get the current active provider instance
 * @returns {BaseAPIProvider} Current provider instance
 */
export function getCurrentProvider() {
  const settings = getSettings();
  return createProvider(settings.provider);
}

/**
 * Test connection for a specific provider
 * @param {string} providerType - Provider type
 * @param {Object} config - Provider configuration
 * @returns {Promise<Object>} Test result { success: boolean, error?: string }
 */
export async function testProvider(providerType, config) {
  try {
    const provider = createProvider(providerType, config);
    const validation = provider.validateConfig();

    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    const connected = await provider.testConnection();

    return {
      success: connected,
      error: connected ? null : 'Connection test failed'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get available models for current provider
 * @returns {Promise<Array>} Array of models
 */
export async function getAvailableModels() {
  try {
    const provider = getCurrentProvider();
    return await provider.getModels();
  } catch (error) {
    console.error('Error getting models:', error);
    throw error;
  }
}

/**
 * Generate response using current provider
 * @param {Object} params - Generation parameters
 * @returns {Promise<Object>} Response object
 */
export async function generateResponse(params) {
  const provider = getCurrentProvider();
  return await provider.generateResponse(params);
}
