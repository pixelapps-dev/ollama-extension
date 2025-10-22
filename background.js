/**
 * Background Service Worker
 * Handles extension icon clicks and initialization
 */

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // Open the chat interface in a new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
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
