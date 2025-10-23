/**
 * Message Actions
 * Handles message-level operations like edit, regenerate, copy, delete
 */

import { showToast, copyToClipboard, showContextMenu } from './ui.js';
import { renderMarkdown, enhanceCodeBlocks } from './markdown.js';

/**
 * Create message action buttons
 */
export function createMessageActions(message, messageIndex, onAction) {
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'message-actions';

  const actions = message.role === 'user'
    ? getUserMessageActions()
    : getAssistantMessageActions();

  actions.forEach(action => {
    const btn = document.createElement('button');
    btn.className = `message-action-btn ${action.danger ? 'danger' : ''}`;
    btn.innerHTML = action.icon;
    btn.title = action.label;
    btn.setAttribute('aria-label', action.label);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      action.handler(message, messageIndex, onAction);
    });

    actionsDiv.appendChild(btn);
  });

  return actionsDiv;
}

/**
 * Get action definitions for user messages
 */
function getUserMessageActions() {
  return [
    {
      id: 'copy',
      label: 'Copy',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
      </svg>`,
      handler: async (message) => {
        const success = await copyToClipboard(message.content);
        showToast(success ? 'Copied!' : 'Copy failed', success ? 'success' : 'error', 2000);
      }
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
      </svg>`,
      handler: (message, messageIndex, onAction) => {
        onAction('edit', { message, messageIndex });
      }
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>`,
      danger: true,
      handler: (message, messageIndex, onAction) => {
        if (confirm('Delete this message?')) {
          onAction('delete', { message, messageIndex });
        }
      }
    }
  ];
}

/**
 * Get action definitions for assistant messages
 */
function getAssistantMessageActions() {
  return [
    {
      id: 'copy',
      label: 'Copy',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
      </svg>`,
      handler: async (message) => {
        const success = await copyToClipboard(message.content);
        showToast(success ? 'Copied!' : 'Copy failed', success ? 'success' : 'error', 2000);
      }
    },
    {
      id: 'regenerate',
      label: 'Regenerate',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
      </svg>`,
      handler: (message, messageIndex, onAction) => {
        onAction('regenerate', { message, messageIndex });
      }
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>`,
      danger: true,
      handler: (message, messageIndex, onAction) => {
        if (confirm('Delete this message?')) {
          onAction('delete', { message, messageIndex });
        }
      }
    }
  ];
}

/**
 * Enable message editing mode
 */
export function enableMessageEditing(messageElement, message, onSave, onCancel) {
  const contentDiv = messageElement.querySelector('.message-content');
  const originalContent = message.content;

  // Save original HTML
  const originalHTML = contentDiv.innerHTML;

  // Create textarea
  const textarea = document.createElement('textarea');
  textarea.className = 'form-control message-edit-textarea';
  textarea.value = originalContent;
  textarea.rows = Math.min(originalContent.split('\n').length + 1, 10);

  // Create controls
  const controls = document.createElement('div');
  controls.className = 'message-edit-controls';
  controls.innerHTML = `
    <button class="btn btn-sm btn-secondary edit-cancel-btn">Cancel</button>
    <button class="btn btn-sm btn-primary edit-save-btn">Save</button>
  `;

  // Replace content with textarea
  contentDiv.innerHTML = '';
  contentDiv.appendChild(textarea);
  contentDiv.appendChild(controls);

  // Mark as editing
  messageElement.classList.add('message-editing');

  // Focus textarea
  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);

  // Handle save
  const saveBtn = controls.querySelector('.edit-save-btn');
  saveBtn.addEventListener('click', () => {
    const newContent = textarea.value.trim();
    if (newContent && newContent !== originalContent) {
      message.content = newContent;
      onSave(message);

      // Update display
      contentDiv.innerHTML = renderMarkdown(newContent);
      enhanceCodeBlocks(contentDiv);
      messageElement.classList.remove('message-editing');

      showToast('Message updated', 'success', 2000);
    } else {
      // Restore original
      contentDiv.innerHTML = originalHTML;
      messageElement.classList.remove('message-editing');
    }
  });

  // Handle cancel
  const cancelBtn = controls.querySelector('.edit-cancel-btn');
  cancelBtn.addEventListener('click', () => {
    contentDiv.innerHTML = originalHTML;
    messageElement.classList.remove('message-editing');
    if (onCancel) onCancel();
  });

  // Handle Escape key
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cancelBtn.click();
    } else if (e.ctrlKey && e.key === 'Enter') {
      saveBtn.click();
    }
  });
}

/**
 * Show message context menu (right-click)
 */
export function showMessageContextMenu(e, message, messageIndex, onAction) {
  e.preventDefault();

  const items = message.role === 'user'
    ? [
        {
          label: 'Copy',
          icon: '📋',
          action: async () => {
            const success = await copyToClipboard(message.content);
            showToast(success ? 'Copied!' : 'Copy failed', success ? 'success' : 'error');
          }
        },
        {
          label: 'Edit',
          icon: '✏️',
          action: () => onAction('edit', { message, messageIndex })
        },
        { divider: true },
        {
          label: 'Delete',
          icon: '🗑️',
          danger: true,
          action: () => {
            if (confirm('Delete this message?')) {
              onAction('delete', { message, messageIndex });
            }
          }
        }
      ]
    : [
        {
          label: 'Copy',
          icon: '📋',
          action: async () => {
            const success = await copyToClipboard(message.content);
            showToast(success ? 'Copied!' : 'Copy failed', success ? 'success' : 'error');
          }
        },
        {
          label: 'Regenerate',
          icon: '🔄',
          action: () => onAction('regenerate', { message, messageIndex })
        },
        { divider: true },
        {
          label: 'Delete',
          icon: '🗑️',
          danger: true,
          action: () => {
            if (confirm('Delete this message?')) {
              onAction('delete', { message, messageIndex });
            }
          }
        }
      ];

  showContextMenu(e.clientX, e.clientY, items);
}
