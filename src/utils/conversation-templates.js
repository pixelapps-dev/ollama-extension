/**
 * Conversation Templates
 * Pre-built conversation starters for common use cases
 */

export const CONVERSATION_TEMPLATES = {
  'brainstorm': {
    id: 'brainstorm',
    name: '💡 Brainstorming Session',
    description: 'Generate creative ideas and explore possibilities',
    category: 'creative',
    icon: '💡',
    systemPrompt: 'You are a creative brainstorming partner. Help generate diverse ideas, ask thought-provoking questions, and encourage unconventional thinking. Build on ideas and explore multiple angles.',
    initialMessages: [
      {
        role: 'user',
        content: 'I want to brainstorm ideas for: [TOPIC]'
      }
    ],
    placeholder: 'What do you want to brainstorm about?',
    tags: ['creative', 'ideation']
  },

  'code-review': {
    id: 'code-review',
    name: '🔍 Code Review',
    description: 'Review code for bugs, improvements, and best practices',
    category: 'development',
    icon: '🔍',
    systemPrompt: 'You are an experienced code reviewer. Analyze code for:\n• Bugs and potential issues\n• Performance optimizations\n• Code readability and maintainability\n• Best practices and design patterns\n• Security vulnerabilities\n\nProvide constructive feedback with specific suggestions.',
    initialMessages: [
      {
        role: 'user',
        content: 'Please review this code:\n\n```\n[PASTE CODE HERE]\n```'
      }
    ],
    placeholder: 'Paste your code for review',
    tags: ['code', 'development']
  },

  'learning': {
    id: 'learning',
    name: '📚 Learn a Topic',
    description: 'Structured learning with explanations and examples',
    category: 'education',
    icon: '📚',
    systemPrompt: 'You are a patient teacher. Explain concepts clearly with:\n• Simple analogies\n• Step-by-step breakdowns\n• Real-world examples\n• Practice exercises\n\nAdjust complexity based on the user\'s understanding.',
    initialMessages: [
      {
        role: 'user',
        content: 'I want to learn about: [TOPIC]'
      }
    ],
    placeholder: 'What do you want to learn?',
    tags: ['education', 'learning']
  },

  'debug': {
    id: 'debug',
    name: '🐛 Debug Helper',
    description: 'Troubleshoot errors and fix code issues',
    category: 'development',
    icon: '🐛',
    systemPrompt: 'You are a debugging expert. Help identify and fix issues by:\n• Analyzing error messages\n• Asking clarifying questions\n• Suggesting potential causes\n• Providing step-by-step solutions\n• Recommending debugging strategies',
    initialMessages: [
      {
        role: 'user',
        content: 'I\'m getting this error:\n\n```\n[ERROR MESSAGE]\n```\n\nHere\'s the code:\n\n```\n[CODE]\n```'
      }
    ],
    placeholder: 'Describe your bug or error',
    tags: ['code', 'debugging', 'development']
  },

  'writing': {
    id: 'writing',
    name: '✍️ Writing Assistant',
    description: 'Help with writing, editing, and improving text',
    category: 'writing',
    icon: '✍️',
    systemPrompt: 'You are a professional writing assistant. Help with:\n• Improving clarity and flow\n• Correcting grammar and style\n• Enhancing vocabulary\n• Structuring arguments\n• Maintaining consistent tone',
    initialMessages: [
      {
        role: 'user',
        content: 'I need help with this text:\n\n[YOUR TEXT HERE]'
      }
    ],
    placeholder: 'What writing do you need help with?',
    tags: ['writing', 'editing']
  },

  'research': {
    id: 'research',
    name: '🔬 Research Assistant',
    description: 'Deep dive into topics with comprehensive analysis',
    category: 'research',
    icon: '🔬',
    systemPrompt: 'You are a thorough research assistant. Provide:\n• Comprehensive analysis\n• Multiple perspectives\n• Evidence-based insights\n• Source recommendations\n• Critical thinking\n\nBe objective and acknowledge limitations.',
    initialMessages: [
      {
        role: 'user',
        content: 'I want to research: [TOPIC]'
      }
    ],
    placeholder: 'What do you want to research?',
    tags: ['research', 'analysis']
  },

  'planning': {
    id: 'planning',
    name: '📋 Project Planner',
    description: 'Break down projects into actionable steps',
    category: 'productivity',
    icon: '📋',
    systemPrompt: 'You are a project planning expert. Help create:\n• Clear objectives\n• Actionable steps\n• Realistic timelines\n• Resource allocation\n• Risk mitigation strategies\n\nBe practical and organized.',
    initialMessages: [
      {
        role: 'user',
        content: 'I want to plan: [PROJECT]'
      }
    ],
    placeholder: 'What project do you want to plan?',
    tags: ['planning', 'productivity']
  },

  'explain-eli5': {
    id: 'explain-eli5',
    name: '👶 Explain Like I\'m 5',
    description: 'Simple explanations for complex topics',
    category: 'education',
    icon: '👶',
    systemPrompt: 'Explain complex topics in the simplest way possible, as if talking to a 5-year-old. Use:\n• Simple words\n• Everyday analogies\n• Short sentences\n• Relatable examples\n\nAvoid jargon and technical terms.',
    initialMessages: [
      {
        role: 'user',
        content: 'Explain this like I\'m 5: [TOPIC]'
      }
    ],
    placeholder: 'What needs a simple explanation?',
    tags: ['education', 'simple']
  },

  'pros-cons': {
    id: 'pros-cons',
    name: '⚖️ Pros & Cons Analysis',
    description: 'Balanced analysis of decisions and options',
    category: 'analysis',
    icon: '⚖️',
    systemPrompt: 'You are an objective analyst. Provide balanced pros and cons analysis:\n• List advantages and disadvantages\n• Consider multiple perspectives\n• Identify potential risks\n• Suggest mitigation strategies\n• Remain neutral and factual',
    initialMessages: [
      {
        role: 'user',
        content: 'What are the pros and cons of: [DECISION/OPTION]'
      }
    ],
    placeholder: 'What decision needs analysis?',
    tags: ['analysis', 'decision-making']
  },

  'summarize': {
    id: 'summarize',
    name: '📝 Summarizer',
    description: 'Create concise summaries of long content',
    category: 'productivity',
    icon: '📝',
    systemPrompt: 'You are a summarization expert. Create:\n• Clear, concise summaries\n• Key points and takeaways\n• Structured bullet points\n• Preserved essential information\n\nAdapt length to content complexity.',
    initialMessages: [
      {
        role: 'user',
        content: 'Please summarize this:\n\n[CONTENT]'
      }
    ],
    placeholder: 'What needs summarizing?',
    tags: ['summary', 'productivity']
  },

  'technical-docs': {
    id: 'technical-docs',
    name: '📖 Technical Documentation',
    description: 'Create clear technical documentation',
    category: 'development',
    icon: '📖',
    systemPrompt: 'You are a technical writer. Create documentation that is:\n• Clear and structured\n• Complete with examples\n• Easy to follow\n• Properly formatted\n• Includes edge cases\n\nUse standard documentation patterns.',
    initialMessages: [
      {
        role: 'user',
        content: 'I need documentation for: [CODE/API/FEATURE]'
      }
    ],
    placeholder: 'What needs documentation?',
    tags: ['documentation', 'development']
  },

  'interview-prep': {
    id: 'interview-prep',
    name: '💼 Interview Preparation',
    description: 'Practice interviews with feedback',
    category: 'career',
    icon: '💼',
    systemPrompt: 'You are an interview coach. Help with:\n• Common interview questions\n• Answer strategies\n• Behavioral questions (STAR method)\n• Technical questions\n• Constructive feedback\n\nAsk follow-up questions like a real interviewer.',
    initialMessages: [
      {
        role: 'user',
        content: 'I\'m preparing for an interview for: [POSITION]'
      }
    ],
    placeholder: 'What role are you interviewing for?',
    tags: ['career', 'interview']
  }
};

/**
 * Get all templates
 */
export function getAllConversationTemplates() {
  return Object.values(CONVERSATION_TEMPLATES);
}

/**
 * Get template by ID
 */
export function getTemplate(templateId) {
  return CONVERSATION_TEMPLATES[templateId] || null;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category) {
  return Object.values(CONVERSATION_TEMPLATES).filter(t => t.category === category);
}

/**
 * Get all categories
 */
export function getTemplateCategories() {
  const categories = new Set();
  Object.values(CONVERSATION_TEMPLATES).forEach(t => categories.add(t.category));
  return Array.from(categories);
}

/**
 * Search templates
 */
export function searchTemplates(query) {
  const lowerQuery = query.toLowerCase();
  return Object.values(CONVERSATION_TEMPLATES).filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.includes(lowerQuery))
  );
}

/**
 * Create conversation from template
 */
export function createConversationFromTemplate(templateId, userInput = '') {
  const template = getTemplate(templateId);
  if (!template) return null;

  // Replace placeholders in messages
  const messages = template.initialMessages.map(msg => ({
    ...msg,
    content: userInput
      ? msg.content.replace(/\[.*?\]/g, userInput)
      : msg.content
  }));

  return {
    id: Date.now().toString(),
    title: template.name.replace(/^[^\s]+\s/, ''), // Remove emoji
    messages: messages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      systemPrompt: template.systemPrompt,
      fromTemplate: templateId,
      templateCategory: template.category,
      tags: template.tags
    }
  };
}

/**
 * Get template selector HTML
 */
export function getTemplateSelectorHTML() {
  const categories = getTemplateCategories();

  let html = '<div class="template-selector">';

  categories.forEach(category => {
    const templates = getTemplatesByCategory(category);
    html += `
      <div class="template-category">
        <h6 class="text-capitalize mb-2">${category}</h6>
        <div class="template-grid">
    `;

    templates.forEach(template => {
      html += `
        <div class="template-card" data-template-id="${template.id}">
          <div class="template-icon">${template.icon}</div>
          <div class="template-name">${template.name}</div>
          <div class="template-description">${template.description}</div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  html += '</div>';

  return html;
}
