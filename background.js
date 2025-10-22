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
    // Could show welcome page or setup wizard here
  } else if (details.reason === 'update') {
    console.log('AI Chat Assistant updated to version', chrome.runtime.getManifest().version);
  }
});

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
