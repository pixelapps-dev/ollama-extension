/**
 * Ollama API Provider Implementation
 * Handles communication with local or remote Ollama servers
 */

import { BaseAPIProvider } from './base.js';
import { ENDPOINTS, PROVIDERS } from '../utils/constants.js';
import { APIError, ValidationError } from '../utils/errors.js';

export class OllamaProvider extends BaseAPIProvider {
  constructor(config) {
    super(config);
    this.baseUrl = config.host || 'http://localhost:11434';
    // Ensure no trailing slash
    this.baseUrl = this.baseUrl.replace(/\/$/, '');
  }

  getName() {
    return PROVIDERS.OLLAMA;
  }

  /**
   * Test connection to Ollama server
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const response = await this.makeRequest(`${this.baseUrl}${ENDPOINTS.OLLAMA.TAGS}`);
      const data = await response.json();
      return data && Array.isArray(data.models);
    } catch (error) {
      console.error('Ollama connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models from Ollama
   * @returns {Promise<Array>} Array of model objects
   */
  async getModels() {
    const response = await this.makeRequest(`${this.baseUrl}${ENDPOINTS.OLLAMA.TAGS}`);
    const data = await response.json();

    if (!data.models || !Array.isArray(data.models)) {
      throw new APIError('Invalid response from Ollama server', null, this.getName());
    }

    return data.models.map(model => ({
      id: model.name,
      name: model.name,
      description: model.details?.parameter_size || '',
      size: model.size,
      modified: model.modified_at,
      family: model.details?.family || ''
    }));
  }

  /**
   * Generate response using Ollama's generate endpoint
   * @param {Object} params - Generation parameters
   * @returns {Promise<Object>} Final response
   */
  async generateResponse({ model, messages, options = {}, signal = null, onToken = () => {} }) {
    // Convert messages to Ollama format
    // Ollama's /api/generate expects a prompt and optional context
    // For chat-like behavior, we'll use /api/chat if available, or format for /api/generate

    const useChat = true; // Prefer chat endpoint for multi-turn conversations

    if (useChat) {
      return this.generateChatResponse({ model, messages, options, signal, onToken });
    } else {
      return this.generateSingleResponse({ model, messages, options, signal, onToken });
    }
  }

  /**
   * Generate using /api/chat endpoint (preferred for conversations)
   * @private
   */
  async generateChatResponse({ model, messages, options, signal, onToken }) {
    const requestBody = {
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      stream: true,
      options: this.buildOllamaOptions(options)
    };

    const response = await this.makeRequest(
      `${this.baseUrl}${ENDPOINTS.OLLAMA.CHAT}`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        signal
      }
    );

    let fullResponse = '';
    let context = null;

    const finalData = await this.streamResponse(
      response,
      (token) => {
        fullResponse += token;
        onToken(token);
      },
      (line) => {
        const data = JSON.parse(line);
        return {
          token: data.message?.content || '',
          done: data.done,
          context: data.context,
          model: data.model
        };
      }
    );

    return {
      content: fullResponse,
      context: finalData.context,
      model: finalData.model,
      done: true
    };
  }

  /**
   * Generate using /api/generate endpoint (for simple prompts)
   * @private
   */
  async generateSingleResponse({ model, messages, options, signal, onToken }) {
    // Convert messages to a single prompt
    const prompt = messages.map(msg => {
      const prefix = msg.role === 'user' ? 'User: ' : 'Assistant: ';
      return prefix + msg.content;
    }).join('\n\n') + '\n\nAssistant: ';

    const requestBody = {
      model,
      prompt,
      stream: true,
      options: this.buildOllamaOptions(options),
      context: options.context || undefined
    };

    const response = await this.makeRequest(
      `${this.baseUrl}${ENDPOINTS.OLLAMA.GENERATE}`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        signal
      }
    );

    let fullResponse = '';
    let context = null;

    const finalData = await this.streamResponse(
      response,
      (token) => {
        fullResponse += token;
        onToken(token);
      },
      (line) => {
        const data = JSON.parse(line);
        return {
          token: data.response || '',
          done: data.done,
          context: data.context,
          model: data.model
        };
      }
    );

    return {
      content: fullResponse,
      context: finalData.context,
      model: finalData.model,
      done: true
    };
  }

  /**
   * Build Ollama-specific options object
   * @private
   */
  buildOllamaOptions(options) {
    const ollamaOptions = {};

    if (options.temperature !== undefined) {
      ollamaOptions.temperature = options.temperature;
    }
    if (options.topP !== undefined) {
      ollamaOptions.top_p = options.topP;
    }
    if (options.maxTokens !== undefined) {
      ollamaOptions.num_predict = options.maxTokens;
    }

    return Object.keys(ollamaOptions).length > 0 ? ollamaOptions : undefined;
  }

  /**
   * Validate Ollama configuration
   * @returns {Object} Validation result
   */
  validateConfig() {
    const errors = [];

    if (!this.baseUrl) {
      errors.push('Ollama host URL is required');
    } else {
      try {
        new URL(this.baseUrl);
      } catch (error) {
        errors.push('Invalid Ollama host URL');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Update Chrome extension rules for CORS handling
   * This is specific to the Chrome extension environment
   */
  async updateCORSRules() {
    if (typeof chrome !== 'undefined' && chrome.declarativeNetRequest) {
      try {
        const url = new URL(this.baseUrl);
        const domain = url.hostname;

        const rules = [{
          id: 1,
          condition: {
            requestDomains: [domain]
          },
          action: {
            type: 'modifyHeaders',
            requestHeaders: [{
              header: 'origin',
              operation: 'set',
              value: this.baseUrl
            }]
          }
        }];

        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: [1],
          addRules: rules
        });

        return true;
      } catch (error) {
        console.error('Error updating CORS rules:', error);
        return false;
      }
    }
    return false;
  }
}
