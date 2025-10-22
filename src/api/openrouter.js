/**
 * OpenRouter API Provider Implementation
 * Handles communication with OpenRouter's unified LLM API
 */

import { BaseAPIProvider } from './base.js';
import { ENDPOINTS, PROVIDERS } from '../utils/constants.js';
import { APIError, ValidationError } from '../utils/errors.js';

export class OpenRouterProvider extends BaseAPIProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey || '';
    this.baseUrl = config.baseUrl || 'https://openrouter.ai/api/v1';
    // Ensure no trailing slash
    this.baseUrl = this.baseUrl.replace(/\/$/, '');
  }

  getName() {
    return PROVIDERS.OPENROUTER;
  }

  /**
   * Test connection to OpenRouter API
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      await this.getModels();
      return true;
    } catch (error) {
      console.error('OpenRouter connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models from OpenRouter
   * @returns {Promise<Array>} Array of model objects
   */
  async getModels() {
    const response = await this.makeRequest(
      `${this.baseUrl}${ENDPOINTS.OPENROUTER.MODELS}`,
      {
        headers: this.getHeaders()
      }
    );

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      throw new APIError('Invalid response from OpenRouter API', null, this.getName());
    }

    return data.data.map(model => ({
      id: model.id,
      name: model.name || model.id,
      description: model.description || '',
      contextLength: model.context_length,
      pricing: model.pricing,
      topProvider: model.top_provider
    }));
  }

  /**
   * Generate response using OpenRouter's chat completions endpoint
   * @param {Object} params - Generation parameters
   * @returns {Promise<Object>} Final response
   */
  async generateResponse({ model, messages, options = {}, signal = null, onToken = () => {} }) {
    const requestBody = {
      model,
      messages: this.formatMessages(messages, options.systemPrompt),
      stream: true,
      ...this.buildOpenRouterOptions(options)
    };

    const response = await this.makeRequest(
      `${this.baseUrl}${ENDPOINTS.OPENROUTER.CHAT}`,
      {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
        signal
      }
    );

    let fullResponse = '';
    let finishReason = null;
    let usage = null;

    const finalData = await this.streamResponse(
      response,
      (token) => {
        fullResponse += token;
        onToken(token);
      },
      (line) => {
        // OpenRouter uses Server-Sent Events format
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6); // Remove 'data: ' prefix

          if (jsonStr === '[DONE]') {
            return { done: true };
          }

          try {
            const data = JSON.parse(jsonStr);
            const choice = data.choices?.[0];

            if (choice?.delta?.content) {
              return {
                token: choice.delta.content,
                done: false
              };
            }

            if (choice?.finish_reason) {
              finishReason = choice.finish_reason;
              usage = data.usage;
              return { done: true };
            }
          } catch (error) {
            console.error('Error parsing SSE data:', jsonStr, error);
          }
        }

        return null;
      }
    );

    return {
      content: fullResponse,
      finishReason,
      usage,
      model,
      done: true
    };
  }

  /**
   * Format messages for OpenRouter API
   * @private
   */
  formatMessages(messages, systemPrompt) {
    const formatted = [];

    // Add system prompt if provided
    if (systemPrompt) {
      formatted.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Add conversation messages
    for (const msg of messages) {
      formatted.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    }

    return formatted;
  }

  /**
   * Build OpenRouter-specific options
   * @private
   */
  buildOpenRouterOptions(options) {
    const orOptions = {};

    if (options.temperature !== undefined) {
      orOptions.temperature = options.temperature;
    }
    if (options.topP !== undefined) {
      orOptions.top_p = options.topP;
    }
    if (options.maxTokens !== undefined) {
      orOptions.max_tokens = options.maxTokens;
    }

    // OpenRouter-specific options
    if (options.topK !== undefined) {
      orOptions.top_k = options.topK;
    }
    if (options.frequencyPenalty !== undefined) {
      orOptions.frequency_penalty = options.frequencyPenalty;
    }
    if (options.presencePenalty !== undefined) {
      orOptions.presence_penalty = options.presencePenalty;
    }

    return orOptions;
  }

  /**
   * Get request headers for OpenRouter
   * @private
   */
  getHeaders() {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': 'https://github.com/ollama-ui/ollama-ui', // Optional: for OpenRouter analytics
      'X-Title': 'Ollama UI Extension' // Optional: for OpenRouter analytics
    };

    return headers;
  }

  /**
   * Validate OpenRouter configuration
   * @returns {Object} Validation result
   */
  validateConfig() {
    const errors = [];

    if (!this.apiKey || this.apiKey.trim() === '') {
      errors.push('OpenRouter API key is required');
    }

    if (!this.baseUrl) {
      errors.push('OpenRouter base URL is required');
    } else {
      try {
        new URL(this.baseUrl);
      } catch (error) {
        errors.push('Invalid OpenRouter base URL');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get pricing information for a model
   * @param {string} modelId - Model ID
   * @returns {Promise<Object|null>} Pricing information
   */
  async getModelPricing(modelId) {
    try {
      const models = await this.getModels();
      const model = models.find(m => m.id === modelId);
      return model?.pricing || null;
    } catch (error) {
      console.error('Error getting model pricing:', error);
      return null;
    }
  }

  /**
   * Estimate cost for a request
   * @param {string} modelId - Model ID
   * @param {number} inputTokens - Number of input tokens
   * @param {number} outputTokens - Number of output tokens
   * @returns {Promise<number|null>} Estimated cost in USD
   */
  async estimateCost(modelId, inputTokens, outputTokens) {
    try {
      const pricing = await this.getModelPricing(modelId);
      if (!pricing) return null;

      const inputCost = (inputTokens / 1000000) * parseFloat(pricing.prompt || 0);
      const outputCost = (outputTokens / 1000000) * parseFloat(pricing.completion || 0);

      return inputCost + outputCost;
    } catch (error) {
      console.error('Error estimating cost:', error);
      return null;
    }
  }
}
