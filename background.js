/**
 * Background Service Worker
 * Handles extension icon clicks and initialization
 */

// Handle extension icon click - open side panel by default
chrome.action.onClicked.addListener(async (tab) => {
  // Get user preference for opening mode
  const result = await chrome.storage.local.get(['openMode']);
  const openMode = result.openMode || 'sidepanel'; // default to side panel

  if (openMode === 'sidepanel') {
    // Open in side panel (Chrome 114+)
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
      console.error('Side panel not supported, opening in tab:', error);
      // Fallback to tab if side panel not supported
      chrome.tabs.create({
        url: chrome.runtime.getURL('index.html')
      });
    }
  } else {
    // Open in new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html')
    });
  }
});

// Initialize extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('AI Chat Assistant installed');
    // Show welcome screen on first install
    chrome.storage.local.set({ firstInstall: true });
  } else if (details.reason === 'update') {
    console.log('AI Chat Assistant updated to version', chrome.runtime.getManifest().version);
  }

  // Create context menu
  createContextMenus();
});

/**
 * Create right-click context menus
 */
function createContextMenus() {
  // Remove existing menus
  chrome.contextMenus.removeAll(() => {
    // Main menu item
    chrome.contextMenus.create({
      id: 'ai-chat-main',
      title: 'AI Chat Assistant',
      contexts: ['page', 'selection', 'link', 'image']
    });

    // Discuss this page
    chrome.contextMenus.create({
      id: 'discuss-page',
      parentId: 'ai-chat-main',
      title: 'Discuss This Page',
      contexts: ['page']
    });

    // Discuss selected text
    chrome.contextMenus.create({
      id: 'discuss-selection',
      parentId: 'ai-chat-main',
      title: 'Discuss Selected Text',
      contexts: ['selection']
    });

    // Explain this link
    chrome.contextMenus.create({
      id: 'explain-link',
      parentId: 'ai-chat-main',
      title: 'Explain This Link',
      contexts: ['link']
    });

    // Describe this image
    chrome.contextMenus.create({
      id: 'describe-image',
      parentId: 'ai-chat-main',
      title: 'Describe This Image',
      contexts: ['image']
    });

    // Separator
    chrome.contextMenus.create({
      id: 'separator',
      parentId: 'ai-chat-main',
      type: 'separator',
      contexts: ['page', 'selection', 'link', 'image']
    });

    // Open chat
    chrome.contextMenus.create({
      id: 'open-chat',
      parentId: 'ai-chat-main',
      title: 'Open Chat',
      contexts: ['page', 'selection', 'link', 'image']
    });
  });
}

/**
 * Handle context menu clicks
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let prompt = '';

  switch (info.menuItemId) {
    case 'discuss-page':
      // Extract page context and open chat
      await openChatWithContext(tab, null, 'page');
      break;

    case 'discuss-selection':
      prompt = `Discuss this text: "${info.selectionText}"`;
      await openChatWithPrompt(tab, prompt);
      break;

    case 'explain-link':
      prompt = `Explain what this link is about: ${info.linkUrl}`;
      await openChatWithPrompt(tab, prompt);
      break;

    case 'describe-image':
      prompt = `This image is located at: ${info.srcUrl}. Please help me understand or work with this image.`;
      await openChatWithPrompt(tab, prompt);
      break;

    case 'open-chat':
      // Just open the chat
      chrome.action.onClicked.dispatch(tab);
      break;
  }
});

/**
 * Open chat with a specific prompt
 */
async function openChatWithPrompt(tab, prompt) {
  // Store the prompt temporarily
  await chrome.storage.local.set({ pendingPrompt: prompt });

  // Get opening mode preference
  const result = await chrome.storage.local.get(['openMode']);
  const openMode = result.openMode || 'sidepanel';

  if (openMode === 'sidepanel') {
    try {
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    }
  } else {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
  }
}

/**
 * Open chat with page context
 */
async function openChatWithContext(tab, prompt, contextType = 'page') {
  try {
    // Extract context from the page
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'extractPageContext',
      includeLinks: contextType === 'page'
    });

    if (response.success) {
      // Store context and prompt
      await chrome.storage.local.set({
        pendingContext: response.context,
        pendingPrompt: prompt || `Let's discuss this page: ${response.context.title}`
      });

      // Open chat
      const result = await chrome.storage.local.get(['openMode']);
      const openMode = result.openMode || 'sidepanel';

      if (openMode === 'sidepanel') {
        try {
          await chrome.sidePanel.open({ windowId: tab.windowId });
        } catch (error) {
          chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
        }
      } else {
        chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
      }
    }
  } catch (error) {
    console.error('Error extracting page context:', error);
    // Fall back to just opening chat
    chrome.action.onClicked.dispatch(tab);
  }
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateCORSRules') {
    updateCORSRules(request.domain)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

/**
 * Update CORS rules for Ollama server
 * @param {string} domain - Domain to allow
 */
async function updateCORSRules(domain) {
  try {
    const rules = [{
      id: 1,
      condition: {
        requestDomains: [domain]
      },
      action: {
        type: 'modifyHeaders',
        requestHeaders: [{
          header: 'origin',
          operation: 'set',
          value: `http://${domain}`
        }]
      }
    }];

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: rules
    });

    console.log('CORS rules updated for domain:', domain);
  } catch (error) {
    console.error('Error updating CORS rules:', error);
    throw error;
  }
}

console.log('AI Chat Assistant background service worker loaded');
