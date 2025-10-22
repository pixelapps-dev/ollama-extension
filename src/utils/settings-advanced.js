/**
 * Advanced Settings Management
 * Import/Export, Validation, Presets
 */

import { getSettings, saveSettings } from '../services/storage.js';
import { showToast } from './ui.js';

/**
 * Export all settings and data
 */
export function exportAllData() {
  const data = {
    version: '2.1.0',
    exportDate: new Date().toISOString(),
    settings: localStorage.getItem('ai-chat-settings'),
    conversations: localStorage.getItem('ai-chat-conversations'),
    favorites: localStorage.getItem('favorites'),
    pinned: localStorage.getItem('pinned'),
    tags: localStorage.getItem('conversationTags'),
    archived: localStorage.getItem('archived'),
    templates: localStorage.getItem('conversationTemplates')
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Import all settings and data
 */
export function importAllData(jsonData) {
  try {
    const data = JSON.parse(jsonData);

    // Validate version compatibility
    if (!data.version) {
      throw new Error('Invalid export file: missing version');
    }

    // Import each piece of data
    if (data.settings) localStorage.setItem('ai-chat-settings', data.settings);
    if (data.conversations) localStorage.setItem('ai-chat-conversations', data.conversations);
    if (data.favorites) localStorage.setItem('favorites', data.favorites);
    if (data.pinned) localStorage.setItem('pinned', data.pinned);
    if (data.tags) localStorage.setItem('conversationTags', data.tags);
    if (data.archived) localStorage.setItem('archived', data.archived);
    if (data.templates) localStorage.setItem('conversationTemplates', data.templates);

    return { success: true, message: 'Data imported successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Export only settings (no conversations)
 */
export function exportSettings() {
  const settings = getSettings();

  const data = {
    version: '2.1.0',
    type: 'settings',
    exportDate: new Date().toISOString(),
    settings
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Import settings
 */
export function importSettings(jsonData) {
  try {
    const data = JSON.parse(jsonData);

    if (data.type !== 'settings') {
      throw new Error('Invalid settings file');
    }

    // Validate settings structure
    if (!data.settings || typeof data.settings !== 'object') {
      throw new Error('Invalid settings structure');
    }

    // Merge with current settings (preserve API keys if not in import)
    const currentSettings = getSettings();
    const mergedSettings = {
      ...data.settings,
      // Preserve sensitive data if not included
      openrouter: {
        ...data.settings.openrouter,
        apiKey: data.settings.openrouter?.apiKey || currentSettings.openrouter?.apiKey || ''
      }
    };

    saveSettings(mergedSettings);

    return { success: true, message: 'Settings imported successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Settings presets
 */
export const SETTINGS_PRESETS = {
  'default': {
    name: 'Default',
    description: 'Balanced settings for general use',
    settings: {
      model: {
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 2048,
        systemPrompt: ''
      },
      ui: {
        theme: 'dark',
        fontSize: 'medium',
        compactMode: false,
        showTokenCount: true,
        showPerformanceMetrics: false,
        openMode: 'sidepanel',
        autoScroll: true
      }
    }
  },
  'creative': {
    name: 'Creative',
    description: 'Higher creativity for writing and brainstorming',
    settings: {
      model: {
        temperature: 1.2,
        topP: 0.95,
        maxTokens: 4096,
        systemPrompt: 'You are a creative assistant. Be imaginative and think outside the box.'
      },
      ui: {
        theme: 'light',
        fontSize: 'large',
        compactMode: false,
        showTokenCount: false,
        showPerformanceMetrics: false,
        openMode: 'tab',
        autoScroll: true
      }
    }
  },
  'focused': {
    name: 'Focused',
    description: 'Precise and deterministic responses',
    settings: {
      model: {
        temperature: 0.3,
        topP: 0.8,
        maxTokens: 2048,
        systemPrompt: 'Provide precise, factual, and concise responses.'
      },
      ui: {
        theme: 'monochrome',
        fontSize: 'medium',
        compactMode: true,
        showTokenCount: true,
        showPerformanceMetrics: true,
        openMode: 'sidepanel',
        autoScroll: true
      }
    }
  },
  'developer': {
    name: 'Developer',
    description: 'Optimized for coding and technical tasks',
    settings: {
      model: {
        temperature: 0.5,
        topP: 0.9,
        maxTokens: 4096,
        systemPrompt: 'You are an expert programmer. Provide detailed code examples and technical explanations.'
      },
      ui: {
        theme: 'dark',
        fontSize: 'small',
        compactMode: true,
        showTokenCount: true,
        showPerformanceMetrics: true,
        openMode: 'sidepanel',
        autoScroll: true
      }
    }
  },
  'accessibility': {
    name: 'Accessibility',
    description: 'High contrast and large text',
    settings: {
      model: {
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 2048,
        systemPrompt: ''
      },
      ui: {
        theme: 'high-contrast',
        fontSize: 'large',
        compactMode: false,
        showTokenCount: false,
        showPerformanceMetrics: false,
        openMode: 'tab',
        autoScroll: true
      }
    }
  }
};

/**
 * Apply preset
 */
export function applyPreset(presetId) {
  const preset = SETTINGS_PRESETS[presetId];
  if (!preset) {
    return { success: false, message: 'Preset not found' };
  }

  const currentSettings = getSettings();
  const newSettings = {
    ...currentSettings,
    model: { ...currentSettings.model, ...preset.settings.model },
    ui: { ...currentSettings.ui, ...preset.settings.ui }
  };

  saveSettings(newSettings);

  return { success: true, message: `Applied ${preset.name} preset` };
}

/**
 * Reset settings to default
 */
export function resetToDefaults() {
  const confirmed = confirm('Reset all settings to defaults? This cannot be undone.');
  if (!confirmed) {
    return { success: false, message: 'Cancelled' };
  }

  // Clear all settings
  localStorage.removeItem('ai-chat-settings');

  return { success: true, message: 'Settings reset to defaults' };
}

/**
 * Validate settings
 */
export function validateSettings(settings) {
  const errors = [];

  // Validate temperature
  if (settings.model?.temperature !== undefined) {
    const temp = settings.model.temperature;
    if (temp < 0 || temp > 2) {
      errors.push('Temperature must be between 0 and 2');
    }
  }

  // Validate topP
  if (settings.model?.topP !== undefined) {
    const topP = settings.model.topP;
    if (topP < 0 || topP > 1) {
      errors.push('Top P must be between 0 and 1');
    }
  }

  // Validate maxTokens
  if (settings.model?.maxTokens !== undefined) {
    const maxTokens = settings.model.maxTokens;
    if (maxTokens < 1 || maxTokens > 128000) {
      errors.push('Max tokens must be between 1 and 128000');
    }
  }

  // Validate Ollama host
  if (settings.ollama?.host) {
    try {
      new URL(settings.ollama.host);
    } catch (e) {
      errors.push('Invalid Ollama host URL');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get settings summary
 */
export function getSettingsSummary() {
  const settings = getSettings();

  return {
    provider: settings.provider || 'ollama',
    model: settings.currentModel || 'Not selected',
    theme: settings.ui?.theme || 'dark',
    temperature: settings.model?.temperature || 0.7,
    maxTokens: settings.model?.maxTokens || 2048,
    hasSystemPrompt: !!(settings.model?.systemPrompt && settings.model.systemPrompt.trim()),
    openMode: settings.ui?.openMode || 'sidepanel'
  };
}

/**
 * Create backup
 */
export function createBackup() {
  const backup = {
    timestamp: new Date().toISOString(),
    data: exportAllData()
  };

  const backups = JSON.parse(localStorage.getItem('ai-chat-backups') || '[]');
  backups.unshift(backup);

  // Keep only last 5 backups
  if (backups.length > 5) {
    backups.length = 5;
  }

  localStorage.setItem('ai-chat-backups', JSON.stringify(backups));

  return { success: true, message: 'Backup created' };
}

/**
 * Get all backups
 */
export function getBackups() {
  return JSON.parse(localStorage.getItem('ai-chat-backups') || '[]');
}

/**
 * Restore from backup
 */
export function restoreBackup(index) {
  const backups = getBackups();
  if (index < 0 || index >= backups.length) {
    return { success: false, message: 'Backup not found' };
  }

  const backup = backups[index];
  const result = importAllData(backup.data);

  if (result.success) {
    return { success: true, message: 'Backup restored successfully' };
  }

  return result;
}

/**
 * Clear all data with confirmation
 */
export function clearAllData() {
  const confirmed = confirm(
    'Are you sure you want to clear ALL data? This includes:\n\n' +
    '• All conversations\n' +
    '• All settings\n' +
    '• Favorites, pins, and tags\n' +
    '• Templates and backups\n\n' +
    'This action CANNOT be undone!'
  );

  if (!confirmed) {
    return { success: false, message: 'Cancelled' };
  }

  // Clear everything
  localStorage.clear();

  return { success: true, message: 'All data cleared' };
}
