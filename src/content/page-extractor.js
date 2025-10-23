/**
 * Page Context Extraction Content Script
 * Extracts meaningful content from web pages for use as context in conversations
 */

/**
 * Extract main content from the current page
 * @returns {Object} Extracted page context
 */
function extractPageContent() {
  const context = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    content: {
      text: '',
      headings: [],
      links: [],
      images: [],
      metadata: {}
    }
  };

  // Extract metadata
  context.content.metadata = extractMetadata();

  // Extract main content
  const mainContent = findMainContent();
  if (mainContent) {
    context.content.text = extractTextFromElement(mainContent);
    context.content.headings = extractHeadings(mainContent);
    context.content.links = extractLinks(mainContent);
    context.content.images = extractImages(mainContent);
  } else {
    // Fallback to body if no main content found
    context.content.text = extractTextFromElement(document.body);
    context.content.headings = extractHeadings(document.body);
  }

  // Clean up and trim
  context.content.text = cleanText(context.content.text);

  return context;
}

/**
 * Find the main content area of the page
 * @returns {Element|null} Main content element
 */
function findMainContent() {
  // Try common selectors for main content
  const selectors = [
    'main',
    'article',
    '[role="main"]',
    '.main-content',
    '#main-content',
    '.content',
    '#content',
    '.post-content',
    '.article-content'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim().length > 100) {
      return element;
    }
  }

  // Try to find the largest text container
  return findLargestTextContainer();
}

/**
 * Find the element with the most text content
 * @returns {Element|null} Element with most text
 */
function findLargestTextContainer() {
  const candidates = document.querySelectorAll('div, section, article');
  let maxLength = 0;
  let bestElement = null;

  candidates.forEach(element => {
    // Skip navigation, headers, footers, sidebars
    if (isIgnoredElement(element)) return;

    const textLength = element.textContent.trim().length;
    if (textLength > maxLength) {
      maxLength = textLength;
      bestElement = element;
    }
  });

  return bestElement;
}

/**
 * Check if element should be ignored
 * @param {Element} element - Element to check
 * @returns {boolean} True if should be ignored
 */
function isIgnoredElement(element) {
  const ignoredTags = ['nav', 'header', 'footer', 'aside', 'script', 'style', 'noscript'];
  const ignoredClasses = ['nav', 'navigation', 'header', 'footer', 'sidebar', 'ad', 'advertisement', 'menu'];
  const ignoredIds = ['nav', 'navigation', 'header', 'footer', 'sidebar'];

  // Check tag name
  if (ignoredTags.includes(element.tagName.toLowerCase())) {
    return true;
  }

  // Check classes
  const classes = element.className.toLowerCase();
  if (ignoredClasses.some(ignored => classes.includes(ignored))) {
    return true;
  }

  // Check ID
  const id = element.id.toLowerCase();
  if (ignoredIds.some(ignored => id.includes(ignored))) {
    return true;
  }

  return false;
}

/**
 * Extract text from an element, ignoring scripts, styles, etc.
 * @param {Element} element - Element to extract from
 * @returns {string} Extracted text
 */
function extractTextFromElement(element) {
  const clone = element.cloneNode(true);

  // Remove unwanted elements
  const unwanted = clone.querySelectorAll('script, style, noscript, iframe, nav, header, footer, aside');
  unwanted.forEach(el => el.remove());

  // Get text content
  return clone.textContent || '';
}

/**
 * Extract headings from an element
 * @param {Element} element - Element to extract from
 * @returns {Array} Array of heading objects
 */
function extractHeadings(element) {
  const headings = [];
  const headingElements = element.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headingElements.forEach((heading, index) => {
    if (index < 20) { // Limit to first 20 headings
      headings.push({
        level: parseInt(heading.tagName[1]),
        text: heading.textContent.trim()
      });
    }
  });

  return headings;
}

/**
 * Extract links from an element
 * @param {Element} element - Element to extract from
 * @returns {Array} Array of link objects
 */
function extractLinks(element) {
  const links = [];
  const linkElements = element.querySelectorAll('a[href]');

  linkElements.forEach((link, index) => {
    if (index < 50) { // Limit to first 50 links
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        links.push({
          text: link.textContent.trim(),
          href: new URL(href, window.location.href).href
        });
      }
    }
  });

  return links;
}

/**
 * Extract images from an element
 * @param {Element} element - Element to extract from
 * @returns {Array} Array of image objects
 */
function extractImages(element) {
  const images = [];
  const imgElements = element.querySelectorAll('img[src]');

  imgElements.forEach((img, index) => {
    if (index < 20) { // Limit to first 20 images
      images.push({
        src: new URL(img.src, window.location.href).href,
        alt: img.alt || ''
      });
    }
  });

  return images;
}

/**
 * Extract metadata from page
 * @returns {Object} Metadata object
 */
function extractMetadata() {
  const metadata = {};

  // Open Graph metadata
  const ogTags = {
    'og:title': 'title',
    'og:description': 'description',
    'og:type': 'type',
    'og:url': 'url',
    'og:site_name': 'siteName'
  };

  for (const [ogTag, key] of Object.entries(ogTags)) {
    const element = document.querySelector(`meta[property="${ogTag}"]`);
    if (element) {
      metadata[key] = element.getAttribute('content');
    }
  }

  // Standard meta tags
  const metaTags = {
    'description': 'description',
    'keywords': 'keywords',
    'author': 'author'
  };

  for (const [name, key] of Object.entries(metaTags)) {
    if (!metadata[key]) {
      const element = document.querySelector(`meta[name="${name}"]`);
      if (element) {
        metadata[key] = element.getAttribute('content');
      }
    }
  }

  return metadata;
}

/**
 * Clean and normalize text
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
    .trim();
}

/**
 * Get selected text on the page
 * @returns {string} Selected text or empty string
 */
function getSelectedText() {
  return window.getSelection().toString().trim();
}

/**
 * Format context for LLM
 * @param {Object} context - Page context object
 * @param {boolean} includeLinks - Whether to include links
 * @returns {string} Formatted context string
 */
function formatContextForLLM(context, includeLinks = false) {
  let formatted = `# Page Context\n\n`;
  formatted += `**URL:** ${context.url}\n`;
  formatted += `**Title:** ${context.title}\n\n`;

  if (context.content.metadata.description) {
    formatted += `**Description:** ${context.content.metadata.description}\n\n`;
  }

  formatted += `## Content\n\n`;
  formatted += context.content.text.substring(0, 50000); // Limit to ~50k chars

  if (context.content.headings.length > 0) {
    formatted += `\n\n## Page Structure\n\n`;
    context.content.headings.forEach(h => {
      formatted += `${'#'.repeat(h.level)} ${h.text}\n`;
    });
  }

  if (includeLinks && context.content.links.length > 0) {
    formatted += `\n\n## Links\n\n`;
    context.content.links.forEach(link => {
      formatted += `- [${link.text}](${link.href})\n`;
    });
  }

  return formatted;
}

// Listen for messages from the extension
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractPageContext') {
      try {
        const context = extractPageContent();
        const formatted = formatContextForLLM(context, request.includeLinks);

        sendResponse({
          success: true,
          context: {
            raw: context,
            formatted: formatted
          }
        });
      } catch (error) {
        sendResponse({
          success: false,
          error: error.message
        });
      }
    } else if (request.action === 'getSelectedText') {
      try {
        const selectedText = getSelectedText();
        sendResponse({
          success: true,
          text: selectedText
        });
      } catch (error) {
        sendResponse({
          success: false,
          error: error.message
        });
      }
    }

    return true; // Keep channel open for async response
  });
}
