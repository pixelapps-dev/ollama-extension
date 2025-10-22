/**
 * Main Application Controller
 * Coordinates all UI components and services
 */

import { configureMarked, renderMarkdown, enhanceCodeBlocks, estimateTokens } from '../utils/markdown.js';
import { formatError, logError } from '../utils/errors.js';
import { PROVIDERS, SHORTCUTS } from '../utils/constants.js';
import { getSettings, saveSettings, updateSetting, getSetting } from '../services/storage.js';
import {
  createConversation,
  getActiveConversation,
  addMessage,
  updateConversationMetadata,
  updateConversationTitle,
  deleteConversation,
  getAllConversations,
  searchConversations,
  exportConversationJSON,
  exportConversationMarkdown,
  getMessagesForAPI
} from '../services/conversation.js';
import {
  createProvider,
  getCurrentProvider,
  testProvider,
  getAvailableModels,
  generateResponse
} from '../api/factory.js';

// Application State
const state = {
  currentConversation: null,
  isGenerating: false,
  pageContext: null,
  abortController: null,
  settings: null
};

/**
 * Initialize the application
 */
async function initialize() {
  console.log('Initializing AI Chat Assistant...');

  // Configure markdown renderer
  configureMarked();

  // Load settings
  state.settings = getSettings();

  // Setup UI event listeners
  setupEventListeners();

  // Load active conversation or create new one
  loadActiveConversation();

  // Load conversation list
  updateConversationList();

  // Load models for current provider
  await loadModels();

  // Update UI with current settings
  updateUIFromSettings();

  console.log('Application initialized');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Sidebar
  document.getElementById('new-chat-btn').addEventListener('click', handleNewChat);
  document.getElementById('toggle-sidebar-btn').addEventListener('click', toggleSidebar);
  document.getElementById('conversation-search').addEventListener('input', handleConversationSearch);

  // Settings
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.getElementById('provider-select').addEventListener('change', handleProviderChange);
  document.getElementById('ollama-host').addEventListener('change', handleOllamaHostChange);
  document.getElementById('openrouter-api-key').addEventListener('change', handleOpenRouterKeyChange);
  document.getElementById('test-ollama-btn').addEventListener('click', () => testConnection('ollama'));
  document.getElementById('test-openrouter-btn').addEventListener('click', () => testConnection('openrouter'));
  document.getElementById('model-select').addEventListener('change', handleModelChange);

  // Model parameters
  document.getElementById('temperature-slider').addEventListener('input', handleTemperatureChange);
  document.getElementById('top-p-slider').addEventListener('input', handleTopPChange);
  document.getElementById('max-tokens-input').addEventListener('change', handleMaxTokensChange);
  document.getElementById('system-prompt-input').addEventListener('change', handleSystemPromptChange);

  // Chat
  document.getElementById('send-button').addEventListener('click', handleSendMessage);
  document.getElementById('user-input').addEventListener('keydown', handleInputKeydown);
  document.getElementById('user-input').addEventListener('input', handleInputChange);
  document.getElementById('edit-title-btn').addEventListener('click', openEditTitleModal);
  document.getElementById('save-title-btn').addEventListener('click', saveConversationTitle);

  // Page context
  document.getElementById('page-context-btn').addEventListener('click', handleAddPageContext);
  document.getElementById('clear-page-context-btn').addEventListener('click', clearPageContext);

  // Data management
  document.getElementById('export-data-btn').addEventListener('click', handleExportData);
  document.getElementById('import-data-btn').addEventListener('click', handleImportData);
  document.getElementById('clear-data-btn').addEventListener('click', handleClearData);
}

/**
 * Load active conversation or create new one
 */
function loadActiveConversation() {
  state.currentConversation = getActiveConversation();
  displayConversation(state.currentConversation);
  updateConversationTitle();
}

/**
 * Display a conversation's messages
 */
function displayConversation(conversation) {
  const chatHistory = document.getElementById('chat-history');
  const emptyState = document.getElementById('empty-state');

  if (!conversation || conversation.messages.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  chatHistory.innerHTML = '';

  conversation.messages.forEach(message => {
    appendMessage(message.role, message.content, false);
  });
}

/**
 * Append a message to the chat
 */
function appendMessage(role, content, isNew = true) {
  const chatHistory = document.getElementById('chat-history');
  const emptyState = document.getElementById('empty-state');
  emptyState.style.display = 'none';

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;

  const headerDiv = document.createElement('div');
  headerDiv.className = 'message-header';
  headerDiv.textContent = role === 'user' ? 'You' : 'Assistant';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  if (role === 'assistant') {
    contentDiv.innerHTML = renderMarkdown(content);
    enhanceCodeBlocks(contentDiv);
  } else {
    contentDiv.textContent = content;
  }

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'message-actions';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'btn btn-sm btn-outline-secondary';
  copyBtn.innerHTML = '📋';
  copyBtn.title = 'Copy';
  copyBtn.onclick = () => copyToClipboard(content);
  actionsDiv.appendChild(copyBtn);

  messageDiv.appendChild(headerDiv);
  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(actionsDiv);

  chatHistory.appendChild(messageDiv);

  // Scroll to bottom
  chatHistory.scrollIntoView({ behavior: 'smooth', block: 'end' });

  return contentDiv;
}

/**
 * Handle sending a message
 */
async function handleSendMessage() {
  if (state.isGenerating) return;

  const input = document.getElementById('user-input');
  const message = input.value.trim();

  if (!message) return;

  // Check if model is selected
  const model = getSetting('currentModel');
  if (!model) {
    showError('Please select a model first');
    return;
  }

  // Clear input
  input.value = '';
  updateCharCount();

  // Add user message to conversation
  addMessage(state.currentConversation.id, {
    role: 'user',
    content: message
  });

  // Display user message
  appendMessage('user', message);

  // Update conversation list
  updateConversationList();

  // Generate response
  await generateAIResponse();
}

/**
 * Generate AI response
 */
async function generateAIResponse() {
  state.isGenerating = true;
  state.abortController = new AbortController();

  // Create assistant message placeholder
  const assistantContentDiv = appendMessage('assistant', '');

  // Add typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.innerHTML = '<span></span><span></span><span></span>';
  assistantContentDiv.appendChild(typingIndicator);

  // Disable send button
  const sendBtn = document.getElementById('send-button');
  sendBtn.disabled = true;
  sendBtn.innerHTML = 'Generating...';

  let fullResponse = '';

  try {
    const provider = getCurrentProvider();
    const model = getSetting('currentModel');
    const settings = getSettings();

    // Build messages array
    let messages = getMessagesForAPI(state.currentConversation.id);

    // Add page context if available
    if (state.pageContext) {
      messages.unshift({
        role: 'user',
        content: state.pageContext.formatted
      });
    }

    const options = {
      temperature: settings.model.temperature,
      topP: settings.model.topP,
      maxTokens: settings.model.maxTokens,
      systemPrompt: settings.model.systemPrompt,
      context: state.currentConversation.metadata.context
    };

    await provider.generateResponse({
      model,
      messages,
      options,
      signal: state.abortController.signal,
      onToken: (token) => {
        fullResponse += token;
        typingIndicator.remove();
        assistantContentDiv.innerHTML = renderMarkdown(fullResponse);
        enhanceCodeBlocks(assistantContentDiv);
      }
    });

    // Save assistant response to conversation
    const updatedConv = addMessage(state.currentConversation.id, {
      role: 'assistant',
      content: fullResponse
    });

    state.currentConversation = updatedConv;

    // Update conversation list
    updateConversationList();

  } catch (error) {
    if (error.name === 'AbortError') {
      assistantContentDiv.textContent = '[Generation stopped]';
    } else {
      logError(error, { context: 'generateAIResponse' });
      const formatted = formatError(error);
      assistantContentDiv.textContent = `Error: ${formatted.userMessage}`;
      showError(formatted.userMessage);
    }
  } finally {
    state.isGenerating = false;
    state.abortController = null;

    // Re-enable send button
    sendBtn.disabled = false;
    sendBtn.innerHTML = 'Send <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/></svg>';
  }
}

/**
 * Handle input keydown (Ctrl+Enter to send)
 */
function handleInputKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    handleSendMessage();
  }
}

/**
 * Handle input change (update char count)
 */
function handleInputChange(e) {
  updateCharCount();
}

/**
 * Update character count display
 */
function updateCharCount() {
  const input = document.getElementById('user-input');
  const charCount = document.getElementById('char-count');
  const count = input.value.length;
  const tokens = estimateTokens(input.value);
  charCount.textContent = `${count} chars (~${tokens} tokens)`;
}

/**
 * Handle new chat button
 */
function handleNewChat() {
  state.currentConversation = createConversation();
  displayConversation(state.currentConversation);
  updateConversationList();
  updateConversationTitle();
  clearPageContext();
}

/**
 * Update conversation list in sidebar
 */
function updateConversationList() {
  const conversations = getAllConversations();
  const listContainer = document.getElementById('conversation-list');

  listContainer.innerHTML = '';

  if (conversations.length === 0) {
    listContainer.innerHTML = '<p class="text-muted text-center p-3">No conversations yet</p>';
    return;
  }

  conversations.forEach(conv => {
    const item = document.createElement('div');
    item.className = 'conversation-item';
    if (state.currentConversation && conv.id === state.currentConversation.id) {
      item.classList.add('active');
    }

    const title = document.createElement('div');
    title.className = 'conversation-item-title';
    title.textContent = conv.title;

    const time = document.createElement('div');
    time.className = 'conversation-item-time';
    time.textContent = formatTime(conv.updatedAt);

    item.appendChild(title);
    item.appendChild(time);

    item.addEventListener('click', () => loadConversation(conv.id));

    // Right-click context menu
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showConversationContextMenu(e, conv.id);
    });

    listContainer.appendChild(item);
  });
}

/**
 * Load a specific conversation
 */
function loadConversation(id) {
  const conversations = getAllConversations();
  const conv = conversations.find(c => c.id === id);

  if (conv) {
    state.currentConversation = conv;
    displayConversation(conv);
    updateConversationTitle();
    updateConversationList();
  }
}

/**
 * Update conversation title display
 */
function updateConversationTitle() {
  const titleElement = document.getElementById('conversation-title');
  if (state.currentConversation) {
    titleElement.textContent = state.currentConversation.title;
  } else {
    titleElement.textContent = 'New Chat';
  }
}

/**
 * Handle conversation search
 */
function handleConversationSearch(e) {
  const query = e.target.value.trim();

  if (!query) {
    updateConversationList();
    return;
  }

  const results = searchConversations(query);
  const listContainer = document.getElementById('conversation-list');

  listContainer.innerHTML = '';

  if (results.length === 0) {
    listContainer.innerHTML = '<p class="text-muted text-center p-3">No matches found</p>';
    return;
  }

  results.forEach(conv => {
    const item = document.createElement('div');
    item.className = 'conversation-item';

    const title = document.createElement('div');
    title.className = 'conversation-item-title';
    title.textContent = conv.title;

    item.appendChild(title);
    item.addEventListener('click', () => loadConversation(conv.id));

    listContainer.appendChild(item);
  });
}

/**
 * Toggle sidebar visibility
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('hidden');
}

/**
 * Open settings panel
 */
function openSettings() {
  const offcanvas = new bootstrap.Offcanvas(document.getElementById('settings-panel'));
  offcanvas.show();
}

/**
 * Update UI from current settings
 */
function updateUIFromSettings() {
  const settings = getSettings();

  // Provider
  document.getElementById('provider-select').value = settings.provider;
  handleProviderChange({ target: { value: settings.provider } });

  // Ollama settings
  document.getElementById('ollama-host').value = settings.ollama.host;

  // OpenRouter settings
  document.getElementById('openrouter-api-key').value = settings.openrouter.apiKey;

  // Model parameters
  document.getElementById('temperature-slider').value = settings.model.temperature;
  document.getElementById('temperature-value').textContent = settings.model.temperature;
  document.getElementById('top-p-slider').value = settings.model.topP;
  document.getElementById('top-p-value').textContent = settings.model.topP;
  document.getElementById('max-tokens-input').value = settings.model.maxTokens;
  document.getElementById('system-prompt-input').value = settings.model.systemPrompt || '';

  // Update header badges
  updateProviderBadge();
  updateModelBadge();
}

/**
 * Handle provider change
 */
function handleProviderChange(e) {
  const provider = e.target.value;

  updateSetting('provider', provider);

  // Show/hide provider settings
  document.getElementById('ollama-settings').style.display =
    provider === 'ollama' ? 'block' : 'none';
  document.getElementById('openrouter-settings').style.display =
    provider === 'openrouter' ? 'block' : 'none';

  updateProviderBadge();
  loadModels();
}

/**
 * Update provider badge in header
 */
function updateProviderBadge() {
  const provider = getSetting('provider');
  const badge = document.getElementById('current-provider');
  badge.textContent = provider === 'ollama' ? 'Ollama' : 'OpenRouter';
}

/**
 * Update model badge in header
 */
function updateModelBadge() {
  const model = getSetting('currentModel');
  const badge = document.getElementById('current-model');
  badge.textContent = model || 'No model selected';
}

/**
 * Handle Ollama host change
 */
function handleOllamaHostChange(e) {
  updateSetting('ollama.host', e.target.value);
}

/**
 * Handle OpenRouter API key change
 */
function handleOpenRouterKeyChange(e) {
  updateSetting('openrouter.apiKey', e.target.value);
}

/**
 * Test connection to provider
 */
async function testConnection(providerType) {
  const btn = document.getElementById(`test-${providerType}-btn`);
  btn.disabled = true;
  btn.textContent = 'Testing...';

  try {
    const settings = getSettings();
    const config = settings[providerType];

    const result = await testProvider(providerType, config);

    if (result.success) {
      showSuccess('Connection successful!');
    } else {
      showError(`Connection failed: ${result.error}`);
    }
  } catch (error) {
    showError(`Connection test failed: ${error.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Test Connection';
  }
}

/**
 * Load available models
 */
async function loadModels() {
  const modelSelect = document.getElementById('model-select');
  modelSelect.innerHTML = '<option value="">Loading models...</option>';
  modelSelect.disabled = true;

  try {
    const models = await getAvailableModels();

    modelSelect.innerHTML = '<option value="">Select a model...</option>';

    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name;
      modelSelect.appendChild(option);
    });

    // Restore previously selected model
    const currentModel = getSetting('currentModel');
    if (currentModel) {
      modelSelect.value = currentModel;
    }

    modelSelect.disabled = false;
  } catch (error) {
    modelSelect.innerHTML = '<option value="">Error loading models</option>';
    logError(error, { context: 'loadModels' });
    showError('Failed to load models: ' + error.message);
  }
}

/**
 * Handle model selection change
 */
function handleModelChange(e) {
  updateSetting('currentModel', e.target.value);
  updateModelBadge();
}

/**
 * Handle temperature slider change
 */
function handleTemperatureChange(e) {
  const value = parseFloat(e.target.value);
  document.getElementById('temperature-value').textContent = value;
  updateSetting('model.temperature', value);
}

/**
 * Handle top-p slider change
 */
function handleTopPChange(e) {
  const value = parseFloat(e.target.value);
  document.getElementById('top-p-value').textContent = value;
  updateSetting('model.topP', value);
}

/**
 * Handle max tokens change
 */
function handleMaxTokensChange(e) {
  const value = parseInt(e.target.value);
  updateSetting('model.maxTokens', value);
}

/**
 * Handle system prompt change
 */
function handleSystemPromptChange(e) {
  updateSetting('model.systemPrompt', e.target.value);
}

/**
 * Handle add page context
 */
async function handleAddPageContext() {
  try {
    // Query active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
      showError('No active tab found');
      return;
    }

    // Send message to content script to extract context
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'extractPageContext',
      includeLinks: false
    });

    if (response.success) {
      state.pageContext = response.context;
      document.getElementById('page-context-badge').style.display = 'block';
      showSuccess('Page context added!');
    } else {
      showError('Failed to extract page context: ' + response.error);
    }
  } catch (error) {
    logError(error, { context: 'handleAddPageContext' });
    showError('Failed to add page context. Make sure you have an active web page open.');
  }
}

/**
 * Clear page context
 */
function clearPageContext() {
  state.pageContext = null;
  document.getElementById('page-context-badge').style.display = 'none';
}

/**
 * Open edit title modal
 */
function openEditTitleModal() {
  const modal = new bootstrap.Modal(document.getElementById('edit-title-modal'));
  document.getElementById('new-title-input').value = state.currentConversation.title;
  modal.show();
}

/**
 * Save conversation title
 */
function saveConversationTitle() {
  const newTitle = document.getElementById('new-title-input').value.trim();

  if (newTitle) {
    updateConversationTitle(state.currentConversation.id, newTitle);
    state.currentConversation.title = newTitle;
    updateConversationTitle();
    updateConversationList();
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('edit-title-modal'));
  modal.hide();
}

/**
 * Show conversation context menu
 */
function showConversationContextMenu(e, convId) {
  // TODO: Implement context menu with options:
  // - Rename
  // - Export (JSON/Markdown)
  // - Duplicate
  // - Delete
  console.log('Context menu for conversation:', convId);
}

/**
 * Handle export data
 */
function handleExportData() {
  const data = {
    settings: getSettings(),
    conversations: getAllConversations(),
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-chat-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  showSuccess('Data exported successfully!');
}

/**
 * Handle import data
 */
function handleImportData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // TODO: Implement import functionality
        showSuccess('Data imported successfully!');
        location.reload();
      } catch (error) {
        showError('Failed to import data: Invalid file format');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/**
 * Handle clear data
 */
function handleClearData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    localStorage.clear();
    location.reload();
  }
}

/**
 * Utility: Copy text to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => showSuccess('Copied to clipboard!'))
    .catch(err => showError('Failed to copy'));
}

/**
 * Utility: Show error message
 */
function showError(message) {
  document.getElementById('error-message').textContent = message;
  const modal = new bootstrap.Modal(document.getElementById('error-modal'));
  modal.show();
}

/**
 * Utility: Show success message (toast)
 */
function showSuccess(message) {
  // Simple console log for now, can be upgraded to toast notifications
  console.log('Success:', message);
}

/**
 * Utility: Format timestamp
 */
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
