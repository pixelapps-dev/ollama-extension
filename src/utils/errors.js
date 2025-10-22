/**
 * Custom error classes for better error handling
 */

export class APIError extends Error {
  constructor(message, statusCode = null, provider = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.provider = provider;
  }
}

export class NetworkError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Parse and format errors for user display
 * @param {Error} error - The error object
 * @returns {Object} Formatted error with message and type
 */
export function formatError(error) {
  if (error instanceof APIError) {
    return {
      type: 'api',
      message: error.message,
      statusCode: error.statusCode,
      provider: error.provider,
      userMessage: `API Error: ${error.message}`
    };
  }

  if (error instanceof NetworkError) {
    return {
      type: 'network',
      message: error.message,
      userMessage: 'Network error: Unable to connect to the server. Please check your internet connection and settings.'
    };
  }

  if (error instanceof ValidationError) {
    return {
      type: 'validation',
      message: error.message,
      field: error.field,
      userMessage: error.message
    };
  }

  // Generic error
  return {
    type: 'unknown',
    message: error.message,
    userMessage: 'An unexpected error occurred. Please try again.'
  };
}

/**
 * Log errors with additional context
 * @param {Error} error - The error to log
 * @param {Object} context - Additional context information
 */
export function logError(error, context = {}) {
  console.error('[Error]', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString()
  });
}
