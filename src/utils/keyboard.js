/**
 * Keyboard Shortcuts Manager
 * Provides efficient keyboard navigation for power users
 */

import { showKeyboardShortcuts } from './onboarding.js';

const shortcuts = new Map();
let isEnabled = true;

/**
 * Initialize keyboard shortcuts system
 */
export function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', handleKeyDown);
  console.log('Keyboard shortcuts initialized');
}

/**
 * Register a keyboard shortcut
 * @param {string} key - Key combination (e.g., 'ctrl+n', 'escape')
 * @param {Function} handler - Handler function
 * @param {string} description - Human-readable description
 */
export function registerShortcut(key, handler, description) {
  shortcuts.set(key.toLowerCase(), { handler, description });
}

/**
 * Unregister a keyboard shortcut
 */
export function unregisterShortcut(key) {
  shortcuts.delete(key.toLowerCase());
}

/**
 * Enable/disable shortcuts system
 */
export function setShortcutsEnabled(enabled) {
  isEnabled = enabled;
}

/**
 * Handle keydown events
 */
function handleKeyDown(e) {
  if (!isEnabled) return;

  // Don't trigger shortcuts when typing in inputs (except for specific cases)
  const target = e.target;
  const isInput = target.tagName === 'INPUT' ||
                  target.tagName === 'TEXTAREA' ||
                  target.isContentEditable;

  // Build key combination string
  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push('ctrl');
  if (e.altKey) parts.push('alt');
  if (e.shiftKey) parts.push('shift');

  // Add the actual key
  let key = e.key.toLowerCase();
  if (key === ' ') key = 'space';
  parts.push(key);

  const combo = parts.join('+');

  // Check if we have a handler for this combination
  const shortcut = shortcuts.get(combo);
  if (shortcut) {
    // Allow certain shortcuts even in inputs
    const allowedInInputs = ['ctrl+enter', 'escape', 'ctrl+/', 'ctrl+k'];

    if (!isInput || allowedInInputs.includes(combo)) {
      e.preventDefault();
      shortcut.handler(e);
    }
  }
}

/**
 * Register all default shortcuts
 */
export function registerDefaultShortcuts() {
  // Navigation shortcuts
  registerShortcut('ctrl+n', () => {
    const newChatBtn = document.getElementById('new-chat-btn');
    if (newChatBtn) newChatBtn.click();
  }, 'New Chat');

  registerShortcut('ctrl+k', () => {
    const searchInput = document.getElementById('conversation-search');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }, 'Search Conversations');

  registerShortcut('ctrl+,', () => {
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) settingsBtn.click();
  }, 'Open Settings');

  registerShortcut('ctrl+b', () => {
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    if (toggleBtn) toggleBtn.click();
  }, 'Toggle Sidebar');

  // Chat shortcuts (Ctrl+Enter handled in app.js)
  registerShortcut('ctrl+p', () => {
    const pageContextBtn = document.getElementById('page-context-btn');
    if (pageContextBtn && !pageContextBtn.disabled) {
      pageContextBtn.click();
    }
  }, 'Add Page Context');

  registerShortcut('escape', () => {
    // Check if generating, if so stop it
    const sendBtn = document.getElementById('send-button');
    if (sendBtn && sendBtn.disabled) {
      // Trigger abort if we have a way to do it
      window.dispatchEvent(new CustomEvent('stopGeneration'));
    }

    // Also close any open modals
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    });

    // Close context menus
    const contextMenus = document.querySelectorAll('.context-menu');
    contextMenus.forEach(menu => menu.remove());
  }, 'Stop Generation / Close Modals');

  // Help shortcut
  registerShortcut('ctrl+/', () => {
    showKeyboardShortcuts();
  }, 'Show Keyboard Shortcuts');

  // Theme cycling (for power users)
  registerShortcut('ctrl+shift+t', () => {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      const options = Array.from(themeSelect.options);
      const currentIndex = options.findIndex(opt => opt.selected);
      const nextIndex = (currentIndex + 1) % options.length;
      themeSelect.value = options[nextIndex].value;
      themeSelect.dispatchEvent(new Event('change'));
    }
  }, 'Cycle Themes');

  // Focus message input
  registerShortcut('ctrl+l', () => {
    const input = document.getElementById('user-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, 'Focus Message Input');
}

/**
 * Get all registered shortcuts
 */
export function getAllShortcuts() {
  return Array.from(shortcuts.entries()).map(([key, data]) => ({
    key,
    description: data.description
  }));
}
