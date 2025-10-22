/**
 * UI Utility Functions
 * Helper functions for common UI operations
 */

/**
 * Auto-expand textarea as user types
 * @param {HTMLTextAreaElement} textarea - The textarea element
 */
export function setupAutoExpandTextarea(textarea) {
  if (!textarea) return;

  const adjust = () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
  };

  textarea.addEventListener('input', adjust);
  // Initial adjustment
  adjust();

  return () => textarea.removeEventListener('input', adjust);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info'
 * @param {number} duration - Duration in ms (default 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Create container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Add to container
  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.style.animation = 'toast-slide-in 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Show context menu at position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Array} items - Menu items [{ label, icon, action, danger }]
 * @returns {HTMLElement} The context menu element
 */
export function showContextMenu(x, y, items) {
  // Remove any existing context menu
  removeContextMenu();

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.id = 'active-context-menu';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  items.forEach((item, index) => {
    if (item.divider) {
      const divider = document.createElement('div');
      divider.className = 'context-menu-divider';
      menu.appendChild(divider);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = `context-menu-item${item.danger ? ' danger' : ''}`;

      if (item.icon) {
        const icon = document.createElement('span');
        icon.className = 'context-menu-icon';
        icon.innerHTML = item.icon;
        menuItem.appendChild(icon);
      }

      const label = document.createElement('span');
      label.textContent = item.label;
      menuItem.appendChild(label);

      menuItem.addEventListener('click', () => {
        item.action();
        removeContextMenu();
      });

      menu.appendChild(menuItem);
    }
  });

  document.body.appendChild(menu);

  // Adjust position if menu goes off-screen
  const rect = menu.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    menu.style.left = `${x - rect.width}px`;
  }
  if (rect.bottom > window.innerHeight) {
    menu.style.top = `${y - rect.height}px`;
  }

  // Close on click outside
  setTimeout(() => {
    document.addEventListener('click', removeContextMenu, { once: true });
    document.addEventListener('contextmenu', removeContextMenu, { once: true });
  }, 100);

  return menu;
}

/**
 * Remove active context menu
 */
export function removeContextMenu() {
  const menu = document.getElementById('active-context-menu');
  if (menu) menu.remove();
}

/**
 * Create loading skeleton
 * @param {number} lines - Number of skeleton lines
 * @returns {HTMLElement} Skeleton element
 */
export function createSkeleton(lines = 3) {
  const container = document.createElement('div');
  container.className = 'skeleton-container';

  for (let i = 0; i < lines; i++) {
    const line = document.createElement('div');
    line.className = `skeleton skeleton-text ${i === lines - 1 ? 'short' : i % 2 === 0 ? 'long' : 'medium'}`;
    container.appendChild(line);
  }

  return container;
}

/**
 * Format duration in ms to readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted string
 */
export function formatDuration(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return num.toLocaleString();
}

/**
 * Calculate tokens per second
 * @param {number} tokens - Number of tokens
 * @param {number} durationMs - Duration in milliseconds
 * @returns {number} Tokens per second
 */
export function calculateTokensPerSecond(tokens, durationMs) {
  if (durationMs === 0) return 0;
  return (tokens / (durationMs / 1000)).toFixed(1);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Copy text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Download text as file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} type - MIME type
 */
export function downloadAsFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Scroll element into view smoothly
 * @param {HTMLElement} element - Element to scroll to
 * @param {Object} options - Scroll options
 */
export function smoothScrollTo(element, options = {}) {
  element?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    ...options
  });
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if in viewport
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Format bytes to human readable string
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted string
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
