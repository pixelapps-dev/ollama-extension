/**
 * Empty States and Error States Components
 * Provides helpful, engaging UI for various application states
 */

/**
 * Create enhanced empty state for chat
 */
export function createChatEmptyState() {
  const div = document.createElement('div');
  div.className = 'empty-state-enhanced';
  div.innerHTML = `
    <div class="empty-state-content">
      <div class="empty-state-icon">💬</div>
      <h2>Start a Conversation</h2>
      <p class="text-muted mb-4">
        Ask me anything, discuss ideas, or add page context to talk about what you're reading.
      </p>

      <div class="empty-state-suggestions">
        <div class="suggestion-category">
          <h6 class="text-muted small mb-2">Try asking:</h6>
          <div class="suggestion-chips">
            <button class="suggestion-chip" data-prompt="Explain quantum computing in simple terms">
              Explain a complex topic
            </button>
            <button class="suggestion-chip" data-prompt="Write a Python function to sort a list">
              Help with code
            </button>
            <button class="suggestion-chip" data-prompt="What are the latest trends in AI?">
              Research a topic
            </button>
            <button class="suggestion-chip" data-prompt="Brainstorm ideas for a blog post about productivity">
              Brainstorm ideas
            </button>
          </div>
        </div>

        <div class="suggestion-category mt-4">
          <h6 class="text-muted small mb-2">Quick actions:</h6>
          <div class="quick-action-buttons">
            <button class="btn btn-outline-primary btn-sm" id="empty-add-context-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
              </svg>
              Add Page Context
            </button>
            <button class="btn btn-outline-secondary btn-sm" id="empty-browse-templates-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
              </svg>
              Browse Templates
            </button>
            <button class="btn btn-outline-secondary btn-sm" id="empty-shortcuts-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"/>
                <path d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5z"/>
              </svg>
              Keyboard Shortcuts
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  return div;
}

/**
 * Create empty state for conversation list
 */
export function createConversationListEmptyState() {
  return `
    <div class="conversations-empty-state">
      <div class="empty-icon">💭</div>
      <p class="text-muted small mb-3">No conversations yet</p>
      <button class="btn btn-primary btn-sm" onclick="document.getElementById('new-chat-btn').click()">
        Start Your First Chat
      </button>
    </div>
  `;
}

/**
 * Create no results state for search
 */
export function createNoSearchResultsState(query) {
  return `
    <div class="no-results-state">
      <div class="empty-icon">🔍</div>
      <p class="text-muted small mb-2">No conversations found</p>
      <p class="text-muted smaller">Try a different search term</p>
      ${query ? `<p class="small"><code>"${query}"</code></p>` : ''}
    </div>
  `;
}

/**
 * Create error state component
 */
export function createErrorState(error, options = {}) {
  const {
    title = 'Something went wrong',
    message = error.message || 'An unexpected error occurred',
    showDetails = false,
    recoveryActions = []
  } = options;

  const div = document.createElement('div');
  div.className = 'error-state';

  let actionsHTML = '';
  if (recoveryActions.length > 0) {
    actionsHTML = `
      <div class="error-actions mt-3">
        ${recoveryActions.map(action => `
          <button class="btn btn-${action.variant || 'primary'} btn-sm" data-action="${action.id}">
            ${action.icon || ''} ${action.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  div.innerHTML = `
    <div class="error-state-content">
      <div class="error-icon">⚠️</div>
      <h5 class="error-title">${title}</h5>
      <p class="error-message text-muted">${message}</p>
      ${showDetails && error.stack ? `
        <details class="error-details mt-2">
          <summary class="small text-muted">Technical details</summary>
          <pre class="small mt-2 p-2 bg-dark rounded"><code>${error.stack}</code></pre>
        </details>
      ` : ''}
      ${actionsHTML}
    </div>
  `;

  // Attach action handlers
  recoveryActions.forEach(action => {
    const btn = div.querySelector(`[data-action="${action.id}"]`);
    if (btn && action.handler) {
      btn.addEventListener('click', action.handler);
    }
  });

  return div;
}

/**
 * Create connection error state
 */
export function createConnectionErrorState(provider) {
  const isOllama = provider === 'ollama';

  const recoveryActions = [
    {
      id: 'open-settings',
      label: 'Open Settings',
      icon: '⚙️',
      variant: 'primary',
      handler: () => {
        document.getElementById('settings-btn').click();
      }
    },
    {
      id: 'retry',
      label: 'Retry Connection',
      icon: '🔄',
      variant: 'secondary',
      handler: () => {
        window.location.reload();
      }
    }
  ];

  if (isOllama) {
    recoveryActions.push({
      id: 'help',
      label: 'Ollama Setup Guide',
      icon: '📖',
      variant: 'outline-secondary',
      handler: () => {
        window.open('https://github.com/ollama/ollama#installation', '_blank');
      }
    });
  }

  return createErrorState(
    { message: `Cannot connect to ${provider}` },
    {
      title: 'Connection Failed',
      message: isOllama
        ? 'Unable to connect to Ollama. Make sure Ollama is running and accessible.'
        : 'Unable to connect to OpenRouter. Check your API key and internet connection.',
      recoveryActions
    }
  );
}

/**
 * Create model loading error state
 */
export function createModelLoadingErrorState() {
  return createErrorState(
    { message: 'Failed to load models' },
    {
      title: 'Cannot Load Models',
      message: 'There was a problem loading the available models. Check your connection and try again.',
      recoveryActions: [
        {
          id: 'retry',
          label: 'Retry',
          icon: '🔄',
          variant: 'primary',
          handler: () => {
            const modelSelect = document.getElementById('model-select');
            if (modelSelect) {
              // Trigger model reload
              window.dispatchEvent(new CustomEvent('reloadModels'));
            }
          }
        },
        {
          id: 'change-provider',
          label: 'Change Provider',
          variant: 'secondary',
          handler: () => {
            const settingsBtn = document.getElementById('settings-btn');
            if (settingsBtn) settingsBtn.click();
            setTimeout(() => {
              const providerSelect = document.getElementById('provider-select');
              if (providerSelect) {
                providerSelect.scrollIntoView({ behavior: 'smooth' });
                providerSelect.focus();
              }
            }, 300);
          }
        }
      ]
    }
  );
}

/**
 * Create inline error banner
 */
export function createErrorBanner(message, type = 'error') {
  const banner = document.createElement('div');
  banner.className = `alert alert-${type === 'error' ? 'danger' : 'warning'} alert-dismissible fade show`;
  banner.setAttribute('role', 'alert');
  banner.innerHTML = `
    <div class="d-flex align-items-center">
      <span class="me-2">${type === 'error' ? '❌' : '⚠️'}</span>
      <span>${message}</span>
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  return banner;
}

/**
 * Create loading skeleton for conversations
 */
export function createConversationSkeleton(count = 3) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="conversation-item skeleton-item">
        <div class="skeleton skeleton-text mb-2" style="width: 70%;"></div>
        <div class="skeleton skeleton-text" style="width: 40%; height: 0.75rem;"></div>
      </div>
    `;
  }
  return html;
}

/**
 * Create loading skeleton for messages
 */
export function createMessageSkeleton() {
  const div = document.createElement('div');
  div.className = 'message assistant skeleton-message';
  div.innerHTML = `
    <div class="message-header">
      <div class="skeleton skeleton-text" style="width: 80px; height: 0.875rem;"></div>
    </div>
    <div class="message-content">
      <div class="skeleton skeleton-text mb-2" style="width: 100%;"></div>
      <div class="skeleton skeleton-text mb-2" style="width: 95%;"></div>
      <div class="skeleton skeleton-text" style="width: 80%;"></div>
    </div>
  `;
  return div;
}

/**
 * Create model selection placeholder state
 */
export function createNoModelSelectedState() {
  return createErrorState(
    { message: 'No model selected' },
    {
      title: 'Select a Model',
      message: 'Choose an AI model from Settings to start chatting.',
      recoveryActions: [
        {
          id: 'open-settings',
          label: 'Select Model',
          icon: '⚙️',
          variant: 'primary',
          handler: () => {
            document.getElementById('settings-btn').click();
            setTimeout(() => {
              const modelSelect = document.getElementById('model-select');
              if (modelSelect) {
                modelSelect.scrollIntoView({ behavior: 'smooth' });
                modelSelect.focus();
              }
            }, 300);
          }
        }
      ]
    }
  );
}
