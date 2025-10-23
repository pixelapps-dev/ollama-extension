/**
 * Markdown utilities for rendering and sanitizing content
 */

/**
 * Configure marked with custom settings
 */
export function configureMarked() {
  if (typeof marked !== 'undefined') {
    marked.use({
      mangle: false,
      headerIds: false,
      breaks: true,
      gfm: true
    });
  }
}

/**
 * Render markdown to HTML with sanitization
 * @param {string} markdown - The markdown text to render
 * @returns {string} Sanitized HTML
 */
export function renderMarkdown(markdown) {
  if (!markdown) return '';

  try {
    const html = marked.parse(markdown);
    return DOMPurify.sanitize(html, {
      ADD_ATTR: ['target'], // Allow target attribute for links
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'u', 's', 'code',
        'pre', 'blockquote',
        'ul', 'ol', 'li',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span'
      ]
    });
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return DOMPurify.sanitize(markdown);
  }
}

/**
 * Extract plain text from markdown
 * @param {string} markdown - The markdown text
 * @returns {string} Plain text
 */
export function markdownToPlainText(markdown) {
  if (!markdown) return '';

  // Remove code blocks
  let text = markdown.replace(/```[\s\S]*?```/g, '[code]');
  // Remove inline code
  text = text.replace(/`[^`]+`/g, '[code]');
  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  // Remove headers
  text = text.replace(/^#+\s+/gm, '');
  // Remove emphasis
  text = text.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');
  // Remove blockquotes
  text = text.replace(/^>\s+/gm, '');
  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, '');

  return text.trim();
}

/**
 * Count tokens (approximate) in text
 * Rough estimate: 1 token ≈ 4 characters
 * @param {string} text - The text to count
 * @returns {number} Approximate token count
 */
export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Truncate text to approximate token limit
 * @param {string} text - The text to truncate
 * @param {number} maxTokens - Maximum tokens
 * @returns {string} Truncated text
 */
export function truncateToTokens(text, maxTokens) {
  if (!text) return '';

  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;

  return text.substring(0, maxChars) + '...';
}

/**
 * Add syntax highlighting classes to code blocks
 * @param {HTMLElement} element - The element containing code blocks
 */
export function enhanceCodeBlocks(element) {
  const codeBlocks = element.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    // Add copy button to code blocks
    const pre = block.parentElement;
    if (!pre.querySelector('.code-copy-btn')) {
      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn-sm btn-secondary code-copy-btn';
      copyBtn.innerHTML = '📋 Copy';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(block.textContent)
          .then(() => {
            copyBtn.innerHTML = '✓ Copied!';
            setTimeout(() => {
              copyBtn.innerHTML = '📋 Copy';
            }, 2000);
          })
          .catch(err => console.error('Copy failed:', err));
      };
      pre.style.position = 'relative';
      pre.appendChild(copyBtn);
    }
  });
}
