/**
 * Model Information and Capabilities
 * Provides detailed information about AI models
 */

/**
 * Known model capabilities database
 */
const MODEL_CAPABILITIES = {
  // OpenRouter models
  'gpt-4-turbo': {
    capabilities: ['vision', 'code', 'long-context'],
    contextLength: 128000,
    description: 'Most capable GPT-4 model with vision',
    speed: 'medium',
    pricing: 'high'
  },
  'gpt-4': {
    capabilities: ['code', 'reasoning'],
    contextLength: 8192,
    description: 'Advanced reasoning and complex tasks',
    speed: 'slow',
    pricing: 'high'
  },
  'gpt-3.5-turbo': {
    capabilities: ['fast', 'code'],
    contextLength: 16384,
    description: 'Fast and efficient for most tasks',
    speed: 'fast',
    pricing: 'low'
  },
  'claude-3-opus': {
    capabilities: ['vision', 'code', 'reasoning', 'long-context'],
    contextLength: 200000,
    description: 'Most capable Claude model',
    speed: 'medium',
    pricing: 'high'
  },
  'claude-3-sonnet': {
    capabilities: ['vision', 'code', 'long-context'],
    contextLength: 200000,
    description: 'Balanced performance and speed',
    speed: 'fast',
    pricing: 'medium'
  },
  'claude-3-haiku': {
    capabilities: ['fast', 'code'],
    contextLength: 200000,
    description: 'Fastest Claude model',
    speed: 'very-fast',
    pricing: 'low'
  },

  // Common Ollama models
  'llama3': {
    capabilities: ['code', 'reasoning'],
    contextLength: 8192,
    description: 'Meta\'s latest Llama model',
    speed: 'medium',
    pricing: 'free'
  },
  'llama3.1': {
    capabilities: ['code', 'reasoning', 'long-context'],
    contextLength: 128000,
    description: 'Enhanced Llama with longer context',
    speed: 'medium',
    pricing: 'free'
  },
  'mistral': {
    capabilities: ['code', 'fast'],
    contextLength: 8192,
    description: 'Efficient open-source model',
    speed: 'fast',
    pricing: 'free'
  },
  'mixtral': {
    capabilities: ['code', 'reasoning'],
    contextLength: 32768,
    description: 'Mixture of experts model',
    speed: 'medium',
    pricing: 'free'
  },
  'codellama': {
    capabilities: ['code', 'fast'],
    contextLength: 16384,
    description: 'Specialized for code generation',
    speed: 'fast',
    pricing: 'free'
  },
  'phi': {
    capabilities: ['fast', 'code'],
    contextLength: 2048,
    description: 'Small, efficient Microsoft model',
    speed: 'very-fast',
    pricing: 'free'
  },
  'gemma': {
    capabilities: ['code', 'reasoning'],
    contextLength: 8192,
    description: 'Google\'s open model',
    speed: 'fast',
    pricing: 'free'
  }
};

/**
 * Capability descriptions
 */
const CAPABILITY_INFO = {
  'vision': {
    icon: '👁️',
    label: 'Vision',
    description: 'Can understand and analyze images'
  },
  'code': {
    icon: '💻',
    label: 'Code',
    description: 'Optimized for programming tasks'
  },
  'reasoning': {
    icon: '🧠',
    label: 'Reasoning',
    description: 'Advanced logical reasoning'
  },
  'long-context': {
    icon: '📚',
    label: 'Long Context',
    description: 'Can handle very long inputs'
  },
  'fast': {
    icon: '⚡',
    label: 'Fast',
    description: 'Quick response times'
  },
  'very-fast': {
    icon: '🚀',
    label: 'Very Fast',
    description: 'Extremely quick responses'
  }
};

/**
 * Get model information
 */
export function getModelInfo(modelId) {
  // Try exact match first
  if (MODEL_CAPABILITIES[modelId]) {
    return {
      ...MODEL_CAPABILITIES[modelId],
      id: modelId,
      name: formatModelName(modelId)
    };
  }

  // Try partial match (for versioned models)
  for (const [key, value] of Object.entries(MODEL_CAPABILITIES)) {
    if (modelId.includes(key) || key.includes(modelId)) {
      return {
        ...value,
        id: modelId,
        name: formatModelName(modelId)
      };
    }
  }

  // Return default info
  return {
    id: modelId,
    name: formatModelName(modelId),
    capabilities: [],
    contextLength: 4096,
    description: 'AI language model',
    speed: 'medium',
    pricing: 'unknown'
  };
}

/**
 * Format model name for display
 */
export function formatModelName(modelId) {
  return modelId
    .split(/[-_:]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get capability badge HTML
 */
export function getCapabilityBadge(capability) {
  const info = CAPABILITY_INFO[capability];
  if (!info) return '';

  return `
    <span class="capability-badge ${capability}" title="${info.description}">
      ${info.icon} ${info.label}
    </span>
  `;
}

/**
 * Get all capability badges for a model
 */
export function getModelCapabilityBadges(modelId) {
  const info = getModelInfo(modelId);
  if (!info.capabilities || info.capabilities.length === 0) {
    return '';
  }

  return info.capabilities.map(cap => getCapabilityBadge(cap)).join('');
}

/**
 * Get model info HTML
 */
export function getModelInfoHTML(modelId) {
  const info = getModelInfo(modelId);

  const capabilitiesHTML = info.capabilities && info.capabilities.length > 0
    ? `<div class="model-capabilities mt-2">${getModelCapabilityBadges(modelId)}</div>`
    : '';

  const contextInfo = info.contextLength
    ? `<div class="small text-muted mt-1">Context: ${formatContextLength(info.contextLength)}</div>`
    : '';

  const descriptionHTML = info.description
    ? `<div class="small text-muted mt-1">${info.description}</div>`
    : '';

  return `
    <div class="model-info">
      <div class="model-name">${info.name}</div>
      ${descriptionHTML}
      ${contextInfo}
      ${capabilitiesHTML}
    </div>
  `;
}

/**
 * Format context length for display
 */
export function formatContextLength(length) {
  if (length >= 1000000) {
    return `${(length / 1000000).toFixed(1)}M tokens`;
  } else if (length >= 1000) {
    return `${(length / 1000).toFixed(0)}K tokens`;
  } else {
    return `${length} tokens`;
  }
}

/**
 * Get speed indicator
 */
export function getSpeedIndicator(speed) {
  const indicators = {
    'very-fast': '🚀🚀🚀',
    'fast': '⚡⚡',
    'medium': '⚡',
    'slow': '🐌'
  };

  return indicators[speed] || '⚡';
}

/**
 * Get pricing indicator
 */
export function getPricingIndicator(pricing) {
  const indicators = {
    'free': '🆓',
    'low': '$',
    'medium': '$$',
    'high': '$$$',
    'unknown': '?'
  };

  return indicators[pricing] || '?';
}

/**
 * Compare models
 */
export function compareModels(modelId1, modelId2) {
  const model1 = getModelInfo(modelId1);
  const model2 = getModelInfo(modelId2);

  return {
    model1: model1.name,
    model2: model2.name,
    comparison: {
      contextLength: {
        model1: model1.contextLength,
        model2: model2.contextLength,
        winner: model1.contextLength > model2.contextLength ? 'model1' : 'model2'
      },
      speed: {
        model1: model1.speed,
        model2: model2.speed,
        winner: getSpeedRank(model1.speed) > getSpeedRank(model2.speed) ? 'model1' : 'model2'
      },
      capabilities: {
        model1: model1.capabilities,
        model2: model2.capabilities,
        unique1: model1.capabilities.filter(c => !model2.capabilities.includes(c)),
        unique2: model2.capabilities.filter(c => !model1.capabilities.includes(c)),
        shared: model1.capabilities.filter(c => model2.capabilities.includes(c))
      }
    }
  };
}

/**
 * Get speed rank for comparison
 */
function getSpeedRank(speed) {
  const ranks = {
    'very-fast': 4,
    'fast': 3,
    'medium': 2,
    'slow': 1
  };
  return ranks[speed] || 2;
}

/**
 * Suggest model based on task
 */
export function suggestModelForTask(task, availableModels) {
  const taskKeywords = {
    'code': ['code', 'programming', 'debug', 'function'],
    'vision': ['image', 'picture', 'photo', 'visual'],
    'reasoning': ['analyze', 'think', 'solve', 'complex'],
    'fast': ['quick', 'simple', 'fast', 'brief']
  };

  // Determine required capabilities
  const requiredCapabilities = [];
  const taskLower = task.toLowerCase();

  for (const [capability, keywords] of Object.entries(taskKeywords)) {
    if (keywords.some(keyword => taskLower.includes(keyword))) {
      requiredCapabilities.push(capability);
    }
  }

  // Score available models
  const scores = availableModels.map(modelId => {
    const info = getModelInfo(modelId);
    let score = 0;

    // Match capabilities
    requiredCapabilities.forEach(cap => {
      if (info.capabilities.includes(cap)) {
        score += 10;
      }
    });

    // Bonus for speed if no specific requirements
    if (requiredCapabilities.length === 0 && info.speed === 'fast') {
      score += 5;
    }

    return { modelId, score, info };
  });

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  return scores.length > 0 ? scores[0] : null;
}

/**
 * Get model recommendation HTML
 */
export function getModelRecommendationHTML(task, availableModels) {
  const suggestion = suggestModelForTask(task, availableModels);

  if (!suggestion || suggestion.score === 0) {
    return '';
  }

  return `
    <div class="model-recommendation alert alert-info">
      <strong>💡 Suggested Model:</strong> ${suggestion.info.name}
      <div class="small mt-1">${suggestion.info.description}</div>
    </div>
  `;
}
