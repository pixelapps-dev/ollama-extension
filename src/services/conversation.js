/**
 * Conversation Management Service
 * Handles creating, updating, and managing conversations
 */

import {
  getConversations,
  saveConversations,
  getConversation,
  saveConversation,
  deleteConversation as deleteConversationFromStorage,
  getActiveConversationId,
  setActiveConversationId
} from './storage.js';
import { markdownToPlainText } from '../utils/markdown.js';

/**
 * Generate a unique conversation ID
 * @returns {string} Unique ID
 */
function generateId() {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new conversation
 * @param {Object} options - Conversation options
 * @returns {Object} New conversation object
 */
export function createConversation(options = {}) {
  const conversation = {
    id: generateId(),
    title: options.title || 'New Chat',
    messages: [],
    model: options.model || null,
    provider: options.provider || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      context: null, // For Ollama context
      systemPrompt: options.systemPrompt || null,
      pageContext: null
    }
  };

  saveConversation(conversation);
  setActiveConversationId(conversation.id);

  return conversation;
}

/**
 * Get active conversation or create new one
 * @returns {Object} Active conversation
 */
export function getActiveConversation() {
  const activeId = getActiveConversationId();

  if (activeId) {
    const conversation = getConversation(activeId);
    if (conversation) {
      return conversation;
    }
  }

  // No active conversation, create new one
  return createConversation();
}

/**
 * Add message to conversation
 * @param {string} conversationId - Conversation ID
 * @param {Object} message - Message object { role, content }
 * @returns {Object} Updated conversation
 */
export function addMessage(conversationId, message) {
  const conversation = getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  conversation.messages.push({
    id: `msg_${Date.now()}`,
    role: message.role,
    content: message.content,
    timestamp: new Date().toISOString()
  });

  conversation.updatedAt = new Date().toISOString();

  // Auto-update title based on first user message
  if (conversation.messages.length === 1 && message.role === 'user') {
    conversation.title = generateTitle(message.content);
  }

  saveConversation(conversation);
  return conversation;
}

/**
 * Update conversation metadata
 * @param {string} conversationId - Conversation ID
 * @param {Object} metadata - Metadata to update
 * @returns {Object} Updated conversation
 */
export function updateConversationMetadata(conversationId, metadata) {
  const conversation = getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  conversation.metadata = {
    ...conversation.metadata,
    ...metadata
  };

  conversation.updatedAt = new Date().toISOString();
  saveConversation(conversation);

  return conversation;
}

/**
 * Update conversation title
 * @param {string} conversationId - Conversation ID
 * @param {string} title - New title
 */
export function updateConversationTitle(conversationId, title) {
  const conversation = getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  conversation.title = title;
  conversation.updatedAt = new Date().toISOString();
  saveConversation(conversation);

  return conversation;
}

/**
 * Delete a conversation
 * @param {string} conversationId - Conversation ID
 */
export function deleteConversation(conversationId) {
  // If deleting active conversation, clear active ID
  if (getActiveConversationId() === conversationId) {
    setActiveConversationId(null);
  }

  return deleteConversationFromStorage(conversationId);
}

/**
 * Get all conversations sorted by update time
 * @returns {Array} Sorted conversations
 */
export function getAllConversations() {
  const conversations = getConversations();
  return conversations.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

/**
 * Search conversations by title or content
 * @param {string} query - Search query
 * @returns {Array} Matching conversations
 */
export function searchConversations(query) {
  const conversations = getConversations();
  const lowerQuery = query.toLowerCase();

  return conversations.filter(conv => {
    // Search in title
    if (conv.title.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    // Search in message content
    return conv.messages.some(msg =>
      msg.content.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Export conversation to JSON
 * @param {string} conversationId - Conversation ID
 * @returns {string} JSON string
 */
export function exportConversationJSON(conversationId) {
  const conversation = getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return JSON.stringify(conversation, null, 2);
}

/**
 * Export conversation to Markdown
 * @param {string} conversationId - Conversation ID
 * @returns {string} Markdown string
 */
export function exportConversationMarkdown(conversationId) {
  const conversation = getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  let markdown = `# ${conversation.title}\n\n`;
  markdown += `**Created:** ${new Date(conversation.createdAt).toLocaleString()}\n`;
  markdown += `**Model:** ${conversation.model || 'Unknown'}\n`;
  markdown += `**Provider:** ${conversation.provider || 'Unknown'}\n\n`;
  markdown += `---\n\n`;

  for (const message of conversation.messages) {
    const roleLabel = message.role === 'user' ? '**You:**' : '**Assistant:**';
    markdown += `${roleLabel}\n\n${message.content}\n\n---\n\n`;
  }

  return markdown;
}

/**
 * Import conversation from JSON
 * @param {string} jsonString - JSON string
 * @returns {Object} Imported conversation
 */
export function importConversationJSON(jsonString) {
  try {
    const conversation = JSON.parse(jsonString);

    // Generate new ID and timestamps
    conversation.id = generateId();
    conversation.createdAt = new Date().toISOString();
    conversation.updatedAt = new Date().toISOString();

    // Ensure required fields exist
    if (!conversation.title) conversation.title = 'Imported Chat';
    if (!conversation.messages) conversation.messages = [];
    if (!conversation.metadata) conversation.metadata = {};

    saveConversation(conversation);
    return conversation;
  } catch (error) {
    throw new Error('Invalid conversation JSON: ' + error.message);
  }
}

/**
 * Generate a title from message content
 * @param {string} content - Message content
 * @returns {string} Generated title
 */
function generateTitle(content) {
  const plainText = markdownToPlainText(content);
  const truncated = plainText.substring(0, 50);
  return truncated + (plainText.length > 50 ? '...' : '');
}

/**
 * Get conversation messages formatted for API
 * @param {string} conversationId - Conversation ID
 * @returns {Array} Array of messages for API
 */
export function getMessagesForAPI(conversationId) {
  const conversation = getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return conversation.messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

/**
 * Clear all messages from a conversation
 * @param {string} conversationId - Conversation ID
 */
export function clearConversationMessages(conversationId) {
  const conversation = getConversation(conversationId);
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  conversation.messages = [];
  conversation.metadata.context = null;
  conversation.updatedAt = new Date().toISOString();

  saveConversation(conversation);
  return conversation;
}

/**
 * Duplicate a conversation
 * @param {string} conversationId - Conversation ID to duplicate
 * @returns {Object} New duplicated conversation
 */
export function duplicateConversation(conversationId) {
  const original = getConversation(conversationId);
  if (!original) {
    throw new Error('Conversation not found');
  }

  const duplicate = {
    ...original,
    id: generateId(),
    title: `${original.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveConversation(duplicate);
  return duplicate;
}
