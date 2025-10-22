/**
 * Theme Management Utility
 * Handles theme switching and persistence
 */

import { THEMES } from './constants.js';
import { getSetting, updateSetting } from '../services/storage.js';

/**
 * Apply a theme to the document
 * @param {string} themeId - Theme identifier
 */
export function applyTheme(themeId) {
  const validThemes = Object.values(THEMES).map(t => t.id);

  if (!validThemes.includes(themeId)) {
    console.warn(`Invalid theme: ${themeId}, falling back to dark`);
    themeId = 'dark';
  }

  document.documentElement.setAttribute('data-theme', themeId);
  updateSetting('ui.theme', themeId);
}

/**
 * Get current theme
 * @returns {string} Current theme ID
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || getSetting('ui.theme', 'dark');
}

/**
 * Toggle between dark and light themes
 */
export function toggleTheme() {
  const current = getCurrentTheme();
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

/**
 * Apply font size setting
 * @param {string} size - 'small', 'medium', or 'large'
 */
export function applyFontSize(size) {
  const validSizes = ['small', 'medium', 'large'];

  if (!validSizes.includes(size)) {
    size = 'medium';
  }

  document.documentElement.setAttribute('data-font-size', size);
  updateSetting('ui.fontSize', size);
}

/**
 * Apply compact mode
 * @param {boolean} enabled - Whether compact mode is enabled
 */
export function applyCompactMode(enabled) {
  document.documentElement.setAttribute('data-compact', enabled ? 'true' : 'false');
  updateSetting('ui.compactMode', enabled);
}

/**
 * Initialize theme from settings
 */
export function initializeTheme() {
  const theme = getSetting('ui.theme', 'dark');
  const fontSize = getSetting('ui.fontSize', 'medium');
  const compact = getSetting('ui.compactMode', false);

  applyTheme(theme);
  applyFontSize(fontSize);
  applyCompactMode(compact);

  // Also check for OS preference
  checkSystemThemePreference();
}

/**
 * Check system theme preference and apply if user hasn't set one
 */
function checkSystemThemePreference() {
  // Only apply system preference if user hasn't explicitly set a theme
  const hasUserTheme = localStorage.getItem('app-settings');

  if (!hasUserTheme && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    if (prefersHighContrast) {
      applyTheme('high-contrast');
    } else if (prefersLight) {
      applyTheme('light');
    } else if (prefersDark) {
      applyTheme('dark');
    }
  }
}

/**
 * Listen for system theme changes
 */
export function watchSystemTheme() {
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    darkModeQuery.addEventListener('change', (e) => {
      // Only auto-switch if user wants to follow system
      const followSystem = getSetting('ui.followSystemTheme', false);
      if (followSystem) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

/**
 * Get list of available themes
 * @returns {Array} Array of theme objects
 */
export function getAvailableThemes() {
  return Object.values(THEMES);
}

/**
 * Export current theme settings
 * @returns {Object} Theme configuration
 */
export function exportThemeSettings() {
  return {
    theme: getCurrentTheme(),
    fontSize: getSetting('ui.fontSize', 'medium'),
    compactMode: getSetting('ui.compactMode', false)
  };
}

/**
 * Import theme settings
 * @param {Object} settings - Theme settings to import
 */
export function importThemeSettings(settings) {
  if (settings.theme) applyTheme(settings.theme);
  if (settings.fontSize) applyFontSize(settings.fontSize);
  if (settings.compactMode !== undefined) applyCompactMode(settings.compactMode);
}
