/**
 * Advanced Features
 * Favorites, pinning, tags, archives, and more
 */

import { updateSetting, getSetting } from '../services/storage.js';
import { getAllConversations } from '../services/conversation.js';

/**
 * Toggle conversation favorite status
 */
export function toggleFavorite(conversationId) {
  const favorites = getSetting('favorites', []);
  const index = favorites.indexOf(conversationId);

  if (index === -1) {
    favorites.push(conversationId);
  } else {
    favorites.splice(index, 1);
  }

  updateSetting('favorites', favorites);
  return favorites.includes(conversationId);
}

/**
 * Check if conversation is favorited
 */
export function isFavorite(conversationId) {
  const favorites = getSetting('favorites', []);
  return favorites.includes(conversationId);
}

/**
 * Get all favorited conversations
 */
export function getFavoriteConversations() {
  const favorites = getSetting('favorites', []);
  const allConversations = getAllConversations();
  return allConversations.filter(conv => favorites.includes(conv.id));
}

/**
 * Toggle conversation pinned status
 */
export function togglePin(conversationId) {
  const pinned = getSetting('pinned', []);
  const index = pinned.indexOf(conversationId);

  if (index === -1) {
    pinned.unshift(conversationId); // Add to beginning
  } else {
    pinned.splice(index, 1);
  }

  updateSetting('pinned', pinned);
  return pinned.includes(conversationId);
}

/**
 * Check if conversation is pinned
 */
export function isPinned(conversationId) {
  const pinned = getSetting('pinned', []);
  return pinned.includes(conversationId);
}

/**
 * Get pinned conversations in order
 */
export function getPinnedConversations() {
  const pinned = getSetting('pinned', []);
  const allConversations = getAllConversations();

  // Return pinned conversations in pinned order
  return pinned
    .map(id => allConversations.find(conv => conv.id === id))
    .filter(conv => conv !== undefined);
}

/**
 * Add tag to conversation
 */
export function addTag(conversationId, tag) {
  const tags = getSetting('conversationTags', {});
  if (!tags[conversationId]) {
    tags[conversationId] = [];
  }

  const normalizedTag = tag.trim().toLowerCase();
  if (!tags[conversationId].includes(normalizedTag)) {
    tags[conversationId].push(normalizedTag);
    updateSetting('conversationTags', tags);
  }

  return tags[conversationId];
}

/**
 * Remove tag from conversation
 */
export function removeTag(conversationId, tag) {
  const tags = getSetting('conversationTags', {});
  if (tags[conversationId]) {
    const normalizedTag = tag.trim().toLowerCase();
    tags[conversationId] = tags[conversationId].filter(t => t !== normalizedTag);
    updateSetting('conversationTags', tags);
  }

  return tags[conversationId] || [];
}

/**
 * Get tags for a conversation
 */
export function getConversationTags(conversationId) {
  const tags = getSetting('conversationTags', {});
  return tags[conversationId] || [];
}

/**
 * Get all unique tags
 */
export function getAllTags() {
  const tags = getSetting('conversationTags', {});
  const allTags = new Set();

  Object.values(tags).forEach(conversationTags => {
    conversationTags.forEach(tag => allTags.add(tag));
  });

  return Array.from(allTags).sort();
}

/**
 * Get conversations by tag
 */
export function getConversationsByTag(tag) {
  const tags = getSetting('conversationTags', {});
  const normalizedTag = tag.trim().toLowerCase();
  const conversationIds = [];

  Object.entries(tags).forEach(([id, convTags]) => {
    if (convTags.includes(normalizedTag)) {
      conversationIds.push(id);
    }
  });

  const allConversations = getAllConversations();
  return allConversations.filter(conv => conversationIds.includes(conv.id));
}

/**
 * Archive conversation
 */
export function archiveConversation(conversationId) {
  const archived = getSetting('archived', []);
  if (!archived.includes(conversationId)) {
    archived.push(conversationId);
    updateSetting('archived', archived);
  }
}

/**
 * Unarchive conversation
 */
export function unarchiveConversation(conversationId) {
  const archived = getSetting('archived', []);
  const index = archived.indexOf(conversationId);
  if (index !== -1) {
    archived.splice(index, 1);
    updateSetting('archived', archived);
  }
}

/**
 * Check if conversation is archived
 */
export function isArchived(conversationId) {
  const archived = getSetting('archived', []);
  return archived.includes(conversationId);
}

/**
 * Get archived conversations
 */
export function getArchivedConversations() {
  const archived = getSetting('archived', []);
  const allConversations = getAllConversations();
  return allConversations.filter(conv => archived.includes(conv.id));
}

/**
 * Get active (non-archived) conversations
 */
export function getActiveConversations() {
  const archived = getSetting('archived', []);
  const allConversations = getAllConversations();
  return allConversations.filter(conv => !archived.includes(conv.id));
}

/**
 * Sort conversations by various criteria
 */
export function sortConversations(conversations, sortBy = 'updated') {
  const sorted = [...conversations];

  switch (sortBy) {
    case 'updated':
      sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      break;
    case 'created':
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'messages':
      sorted.sort((a, b) => b.messages.length - a.messages.length);
      break;
    default:
      break;
  }

  return sorted;
}

/**
 * Filter conversations by multiple criteria
 */
export function filterConversations(conversations, filters = {}) {
  let filtered = [...conversations];

  // Filter by favorites
  if (filters.favoritesOnly) {
    const favorites = getSetting('favorites', []);
    filtered = filtered.filter(conv => favorites.includes(conv.id));
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    const conversationTags = getSetting('conversationTags', {});
    filtered = filtered.filter(conv => {
      const tags = conversationTags[conv.id] || [];
      return filters.tags.some(tag => tags.includes(tag));
    });
  }

  // Filter by search query
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(conv => {
      return conv.title.toLowerCase().includes(query) ||
             conv.messages.some(msg => msg.content.toLowerCase().includes(query));
    });
  }

  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter(conv => new Date(conv.updatedAt) >= new Date(filters.dateFrom));
  }

  if (filters.dateTo) {
    filtered = filtered.filter(conv => new Date(conv.updatedAt) <= new Date(filters.dateTo));
  }

  return filtered;
}

/**
 * Get conversation statistics
 */
export function getConversationStats(conversationId) {
  const allConversations = getAllConversations();
  const conversation = allConversations.find(conv => conv.id === conversationId);

  if (!conversation) return null;

  const stats = {
    messageCount: conversation.messages.length,
    userMessages: conversation.messages.filter(m => m.role === 'user').length,
    assistantMessages: conversation.messages.filter(m => m.role === 'assistant').length,
    totalCharacters: conversation.messages.reduce((sum, m) => sum + m.content.length, 0),
    averageMessageLength: 0,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    duration: new Date(conversation.updatedAt) - new Date(conversation.createdAt),
    isFavorite: isFavorite(conversationId),
    isPinned: isPinned(conversationId),
    isArchived: isArchived(conversationId),
    tags: getConversationTags(conversationId)
  };

  if (stats.messageCount > 0) {
    stats.averageMessageLength = Math.round(stats.totalCharacters / stats.messageCount);
  }

  return stats;
}

/**
 * Get global statistics
 */
export function getGlobalStats() {
  const allConversations = getAllConversations();
  const activeConversations = getActiveConversations();
  const archivedConversations = getArchivedConversations();
  const favoriteConversations = getFavoriteConversations();

  const totalMessages = allConversations.reduce((sum, conv) => sum + conv.messages.length, 0);
  const totalCharacters = allConversations.reduce((sum, conv) => {
    return sum + conv.messages.reduce((msgSum, msg) => msgSum + msg.content.length, 0);
  }, 0);

  return {
    totalConversations: allConversations.length,
    activeConversations: activeConversations.length,
    archivedConversations: archivedConversations.length,
    favoriteConversations: favoriteConversations.length,
    pinnedConversations: getPinnedConversations().length,
    totalMessages,
    totalCharacters,
    averageMessagesPerConversation: allConversations.length > 0
      ? Math.round(totalMessages / allConversations.length)
      : 0,
    uniqueTags: getAllTags().length,
    oldestConversation: allConversations.length > 0
      ? new Date(Math.min(...allConversations.map(c => new Date(c.createdAt))))
      : null,
    newestConversation: allConversations.length > 0
      ? new Date(Math.max(...allConversations.map(c => new Date(c.createdAt))))
      : null
  };
}

/**
 * Duplicate conversation
 */
export function duplicateConversation(conversationId) {
  const allConversations = getAllConversations();
  const original = allConversations.find(conv => conv.id === conversationId);

  if (!original) return null;

  const duplicate = {
    id: Date.now().toString(),
    title: `${original.title} (Copy)`,
    messages: JSON.parse(JSON.stringify(original.messages)), // Deep copy
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: JSON.parse(JSON.stringify(original.metadata || {}))
  };

  // Save to storage (this would need to be integrated with your conversation service)
  return duplicate;
}

/**
 * Create conversation template
 */
export function saveAsTemplate(conversationId, templateName) {
  const templates = getSetting('conversationTemplates', {});
  const allConversations = getAllConversations();
  const conversation = allConversations.find(conv => conv.id === conversationId);

  if (!conversation) return false;

  templates[templateName] = {
    title: conversation.title,
    systemPrompt: conversation.metadata?.systemPrompt || '',
    initialMessages: conversation.messages.slice(0, 2), // First exchange only
    tags: getConversationTags(conversationId),
    createdAt: new Date().toISOString()
  };

  updateSetting('conversationTemplates', templates);
  return true;
}

/**
 * Get all templates
 */
export function getAllTemplates() {
  return getSetting('conversationTemplates', {});
}

/**
 * Create conversation from template
 */
export function createFromTemplate(templateName) {
  const templates = getSetting('conversationTemplates', {});
  const template = templates[templateName];

  if (!template) return null;

  return {
    id: Date.now().toString(),
    title: template.title,
    messages: JSON.parse(JSON.stringify(template.initialMessages || [])),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      systemPrompt: template.systemPrompt,
      fromTemplate: templateName
    }
  };
}
