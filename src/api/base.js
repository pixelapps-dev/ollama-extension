/**
 * Base API interface that all providers must implement
 * This ensures consistent behavior across different AI providers
 */

import { APIError, NetworkError } from '../utils/errors.js';

export class BaseAPIProvider {
  constructor(config) {
    this.config = config;
  }

  /**
   * Get provider name
   * @returns {string} Provider name
   */
  getName() {
    throw new Error('getName() must be implemented');
  }

  /**
   * Test connection to the API
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    throw new Error('testConnection() must be implemented');
  }

  /**
   * Get available models
   * @returns {Promise<Array>} Array of model objects with { id, name, description }
   */
  async getModels() {
    throw new Error('getModels() must be implemented');
  }

  /**
   * Generate a response from the model (streaming)
   * @param {Object} params - Generation parameters
   * @param {string} params.model - Model ID
   * @param {Array} params.messages - Array of message objects { role, content }
   * @param {Object} params.options - Model options (temperature, topP, etc.)
   * @param {AbortSignal} params.signal - Abort signal for cancellation
   * @param {Function} params.onToken - Callback for each token (chunk) received
   * @returns {Promise<Object>} Final response object
   */
  async generateResponse(params) {
    throw new Error('generateResponse() must be implemented');
  }

  /**
   * Validate configuration
   * @returns {Object} { valid: boolean, errors: Array }
   */
  validateConfig() {
    throw new Error('validateConfig() must be implemented');
  }

  /**
   * Helper: Make HTTP request with error handling
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new APIError(
          `API request failed: ${errorText}`,
          response.status,
          this.getName()
        );
      }

      return response;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Network or other errors
      throw new NetworkError(
        `Network request failed: ${error.message}`,
        error
      );
    }
  }

  /**
   * Helper: Stream response and call onToken for each chunk
   * @param {Response} response - Fetch response
   * @param {Function} onToken - Callback for each token
   * @param {Function} parseLine - Function to parse each line
   * @returns {Promise<Object>} Final response data
   */
  async streamResponse(response, onToken, parseLine) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalData = null;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === '') continue;

          try {
            const data = parseLine(line);
            if (data) {
              if (data.token) {
                onToken(data.token);
              }
              if (data.done) {
                finalData = data;
              }
            }
          } catch (error) {
            console.error('Error parsing line:', line, error);
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        try {
          const data = parseLine(buffer);
          if (data && data.token) {
            onToken(data.token);
          }
          if (data && data.done) {
            finalData = data;
          }
        } catch (error) {
          console.error('Error parsing final buffer:', buffer, error);
        }
      }

      return finalData || {};
    } finally {
      reader.releaseLock();
    }
  }
}
