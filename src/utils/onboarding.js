/**
 * Onboarding and First-Time User Experience
 * Guides new users through setup and feature discovery
 */

import { getSetting, updateSetting } from '../services/storage.js';
import { showToast } from './ui.js';

const ONBOARDING_VERSION = '2.0.0';

/**
 * Check if user needs onboarding
 */
export function needsOnboarding() {
  const completedVersion = getSetting('onboarding.completedVersion');
  const hasSeenWelcome = getSetting('onboarding.hasSeenWelcome');

  return !hasSeenWelcome || completedVersion !== ONBOARDING_VERSION;
}

/**
 * Show welcome screen for first-time users
 */
export function showWelcomeScreen() {
  const modal = createWelcomeModal();
  document.body.appendChild(modal);

  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  // Mark as seen
  updateSetting('onboarding.hasSeenWelcome', true);

  // Cleanup on close
  modal.addEventListener('hidden.bs.modal', () => {
    modal.remove();
  });
}

/**
 * Create welcome modal HTML
 */
function createWelcomeModal() {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'welcome-modal';
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('aria-labelledby', 'welcomeModalLabel');
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content bg-dark text-light border-secondary">
        <div class="modal-header border-secondary">
          <h4 class="modal-title" id="welcomeModalLabel">
            <span class="welcome-emoji">👋</span> Welcome to AI Chat Assistant!
          </h4>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="welcome-content">
            <p class="lead mb-4">
              Your intelligent AI companion for browsing and research.
            </p>

            <div class="feature-grid">
              <div class="feature-item">
                <div class="feature-icon">🤖</div>
                <h6>Multiple AI Providers</h6>
                <p class="small text-muted">Connect to Ollama (local) or OpenRouter (cloud) models</p>
              </div>

              <div class="feature-item">
                <div class="feature-icon">📄</div>
                <h6>Page Context</h6>
                <p class="small text-muted">Discuss any webpage by adding its content to your conversation</p>
              </div>

              <div class="feature-item">
                <div class="feature-icon">🎨</div>
                <h6>Customizable Themes</h6>
                <p class="small text-muted">Choose from 4 beautiful themes including monochrome</p>
              </div>

              <div class="feature-item">
                <div class="feature-icon">⚡</div>
                <h6>Prompt Templates</h6>
                <p class="small text-muted">10 professional templates for different use cases</p>
              </div>

              <div class="feature-item">
                <div class="feature-icon">⌨️</div>
                <h6>Keyboard Shortcuts</h6>
                <p class="small text-muted">Efficient navigation with power-user shortcuts</p>
              </div>

              <div class="feature-item">
                <div class="feature-icon">💾</div>
                <h6>Export & History</h6>
                <p class="small text-muted">Save conversations as JSON or Markdown</p>
              </div>
            </div>

            <div class="setup-prompt mt-4 p-3 bg-secondary bg-opacity-10 border border-secondary rounded">
              <h6 class="mb-2">🚀 Quick Setup</h6>
              <p class="small mb-3">Get started in 3 easy steps:</p>
              <ol class="small mb-0">
                <li>Choose your AI provider (Ollama for local, OpenRouter for cloud)</li>
                <li>Configure your API endpoint or key in Settings</li>
                <li>Select a model and start chatting!</li>
              </ol>
            </div>
          </div>
        </div>
        <div class="modal-footer border-secondary">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Skip</button>
          <button type="button" class="btn btn-primary" id="start-setup-btn">
            Start Setup Guide
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach event listener for setup button
  const setupBtn = modal.querySelector('#start-setup-btn');
  setupBtn.addEventListener('click', () => {
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal.hide();
    setTimeout(startSetupWizard, 300);
  });

  return modal;
}

/**
 * Start guided setup wizard
 */
export function startSetupWizard() {
  // Open settings panel
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.click();
  }

  // Highlight provider selection
  setTimeout(() => {
    const providerSelect = document.getElementById('provider-select');
    if (providerSelect) {
      providerSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      providerSelect.focus();

      // Add pulsing highlight
      providerSelect.classList.add('highlight-pulse');
      setTimeout(() => providerSelect.classList.remove('highlight-pulse'), 3000);
    }

    showToast('Select your AI provider to get started', 'info', 5000);
  }, 500);

  updateSetting('onboarding.wizardStarted', true);
}

/**
 * Show keyboard shortcuts help
 */
export function showKeyboardShortcuts() {
  const modal = createShortcutsModal();
  document.body.appendChild(modal);

  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  modal.addEventListener('hidden.bs.modal', () => {
    modal.remove();
  });
}

/**
 * Create keyboard shortcuts modal
 */
function createShortcutsModal() {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'shortcuts-modal';
  modal.setAttribute('tabindex', '-1');

  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark text-light border-secondary">
        <div class="modal-header border-secondary">
          <h5 class="modal-title">⌨️ Keyboard Shortcuts</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="shortcuts-list">
            <div class="shortcut-group">
              <h6 class="text-muted small mb-2">Navigation</h6>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>N</kbd>
                <span>New Chat</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>K</kbd>
                <span>Search Conversations</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>,</kbd>
                <span>Open Settings</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>B</kbd>
                <span>Toggle Sidebar</span>
              </div>
            </div>

            <div class="shortcut-group mt-3">
              <h6 class="text-muted small mb-2">Chat Actions</h6>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
                <span>Send Message</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>P</kbd>
                <span>Add Page Context</span>
              </div>
              <div class="shortcut-item">
                <kbd>Escape</kbd>
                <span>Stop Generation</span>
              </div>
            </div>

            <div class="shortcut-group mt-3">
              <h6 class="text-muted small mb-2">Help</h6>
              <div class="shortcut-item">
                <kbd>Ctrl</kbd> + <kbd>/</kbd>
                <span>Show Shortcuts</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-secondary">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  `;

  return modal;
}

/**
 * Show feature tips based on context
 */
export function showContextualTip(tipType) {
  const tips = {
    'firstMessage': {
      message: 'Tip: Use Ctrl+Enter to send messages quickly!',
      type: 'info'
    },
    'pageContext': {
      message: 'Pro tip: Click "Add Page" to discuss any webpage with AI!',
      type: 'info'
    },
    'templates': {
      message: 'Try prompt templates for optimized responses!',
      type: 'info'
    },
    'export': {
      message: 'Right-click conversations to export, rename, or delete',
      type: 'info'
    }
  };

  const tip = tips[tipType];
  if (tip && !hasSeenTip(tipType)) {
    setTimeout(() => {
      showToast(tip.message, tip.type, 6000);
      markTipAsSeen(tipType);
    }, 1000);
  }
}

/**
 * Check if user has seen a specific tip
 */
function hasSeenTip(tipType) {
  const seenTips = getSetting('onboarding.seenTips', []);
  return seenTips.includes(tipType);
}

/**
 * Mark a tip as seen
 */
function markTipAsSeen(tipType) {
  const seenTips = getSetting('onboarding.seenTips', []);
  if (!seenTips.includes(tipType)) {
    seenTips.push(tipType);
    updateSetting('onboarding.seenTips', seenTips);
  }
}

/**
 * Complete onboarding
 */
export function completeOnboarding() {
  updateSetting('onboarding.completedVersion', ONBOARDING_VERSION);
  showToast('Setup complete! You\'re all set to start chatting.', 'success', 4000);
}
