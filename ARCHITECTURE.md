# Architecture Documentation

This document provides a detailed overview of the AI Chat Assistant extension's architecture, design patterns, and implementation details.

## Table of Contents

- [Overview](#overview)
- [Core Principles](#core-principles)
- [System Architecture](#system-architecture)
- [Module Breakdown](#module-breakdown)
- [Data Flow](#data-flow)
- [API Provider System](#api-provider-system)
- [Storage Strategy](#storage-strategy)
- [UI Architecture](#ui-architecture)
- [Security Considerations](#security-considerations)
- [Extension Points](#extension-points)

## Overview

AI Chat Assistant is built as a Chrome Extension (Manifest V3) with a modular, service-oriented architecture. The system is designed to be extensible, maintainable, and easy to understand.

### Technology Stack

- **JavaScript**: ES6+ modules (no build step)
- **UI Framework**: Bootstrap 5
- **Markdown**: Marked.js
- **Sanitization**: DOMPurify
- **Storage**: localStorage (browser-native)
- **Extension**: Chrome Extension Manifest V3

## Core Principles

### 1. Separation of Concerns
Each module has a single, well-defined responsibility:
- API providers handle external communication
- Services manage business logic
- UI components handle presentation
- Utilities provide shared functionality

### 2. Provider Abstraction
All AI providers implement a common interface (`BaseAPIProvider`), allowing:
- Easy addition of new providers
- Consistent error handling
- Unified API across the application

### 3. Immutable State
- Settings and conversations are loaded from storage
- Modifications create new objects
- Explicit save operations prevent data loss

### 4. Error Handling
- Custom error classes for different error types
- Centralized error formatting
- User-friendly error messages
- Detailed logging for debugging

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Background  │  │   Content    │  │      UI      │      │
│  │   Worker     │  │   Script     │  │   (HTML/JS)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         │                  │                  │               │
│  ┌──────▼──────────────────▼──────────────────▼───────┐    │
│  │              Application Core                       │    │
│  │                                                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │   API    │  │ Services │  │ Utilities│         │    │
│  │  │ Providers│  │          │  │          │         │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘         │    │
│  │       │             │             │                │    │
│  └───────┼─────────────┼─────────────┼────────────────┘    │
│          │             │             │                      │
└──────────┼─────────────┼─────────────┼──────────────────────┘
           │             │             │
    ┌──────▼─────┐  ┌───▼────┐  ┌────▼─────┐
    │  Ollama /  │  │localStorage│  │ Browser │
    │ OpenRouter │  │            │  │   APIs  │
    └────────────┘  └────────────┘  └──────────┘
```

## Module Breakdown

### 1. API Layer (`src/api/`)

#### `base.js` - BaseAPIProvider
Abstract base class defining the provider interface:

```javascript
class BaseAPIProvider {
  getName()           // Provider identification
  testConnection()    // Health check
  getModels()         // Fetch available models
  generateResponse()  // Stream generation
  validateConfig()    // Configuration validation
}
```

**Responsibilities:**
- Define provider contract
- Common HTTP request handling
- Streaming response parsing
- Error normalization

#### `ollama.js` - OllamaProvider
Implements Ollama-specific API calls:

**Features:**
- Uses `/api/chat` endpoint for conversations
- Fallback to `/api/generate` for simple prompts
- Context preservation across messages
- CORS header management for Chrome extension

**Key Methods:**
- `generateChatResponse()`: Multi-turn conversations
- `generateSingleResponse()`: Simple prompt-response
- `updateCORSRules()`: Chrome extension CORS handling

#### `openrouter.js` - OpenRouterProvider
Implements OpenRouter API integration:

**Features:**
- Server-Sent Events (SSE) streaming
- Model catalog with pricing
- Cost estimation
- Usage tracking

**Key Methods:**
- `formatMessages()`: Convert to OpenAI format
- `estimateCost()`: Calculate request cost
- `getModelPricing()`: Fetch pricing info

#### `factory.js` - Provider Factory
Creates and manages provider instances:

```javascript
createProvider(type, config)  // Create provider instance
getCurrentProvider()          // Get active provider
testProvider(type, config)    // Test connection
getAvailableModels()          // Fetch models
generateResponse(params)      // Generate with active provider
```

### 2. Services Layer (`src/services/`)

#### `storage.js` - Storage Service
Manages all localStorage operations:

**Settings Management:**
- `getSettings()` / `saveSettings()`
- `getSetting(path)` / `updateSetting(path, value)`
- Deep merge with defaults
- Dot-notation path support

**Conversation Management:**
- `getConversations()` / `saveConversations()`
- `getConversation(id)` / `saveConversation(conv)`
- `deleteConversation(id)`
- Active conversation tracking

**Data Import/Export:**
- `exportData()` / `importData()`
- `clearAllData()`

#### `conversation.js` - Conversation Service
High-level conversation management:

**Core Functions:**
- `createConversation()`: Generate new conversation
- `addMessage()`: Append message to conversation
- `updateConversationMetadata()`: Store context/settings
- `getMessagesForAPI()`: Format for API requests

**Utility Functions:**
- `searchConversations()`: Full-text search
- `exportConversationJSON()` / `exportConversationMarkdown()`
- `duplicateConversation()`: Clone conversation
- Auto-title generation from first message

### 3. Utilities Layer (`src/utils/`)

#### `constants.js`
Centralized configuration:
- Provider types
- Default settings
- Storage keys
- API endpoints
- Error messages
- UI constants
- Model parameter ranges

#### `errors.js`
Custom error handling:
- `APIError`: API-specific errors
- `NetworkError`: Connection issues
- `ValidationError`: Input validation
- `formatError()`: User-friendly formatting
- `logError()`: Structured logging

#### `markdown.js`
Markdown processing:
- `renderMarkdown()`: Parse and sanitize
- `markdownToPlainText()`: Extract text
- `estimateTokens()`: Approximate token count
- `enhanceCodeBlocks()`: Add copy buttons

### 4. Content Scripts (`src/content/`)

#### `page-extractor.js`
Extracts page content for context:

**Extraction Strategy:**
1. Find main content area (semantic HTML, common selectors)
2. Extract text, headings, links, images
3. Extract metadata (Open Graph, meta tags)
4. Filter out navigation, ads, boilerplate
5. Format for LLM consumption

**Key Functions:**
- `extractPageContent()`: Main extraction
- `findMainContent()`: Locate primary content
- `formatContextForLLM()`: Create prompt-ready text
- `getSelectedText()`: Get user selection

### 5. UI Layer (`src/ui/`)

#### `app.js` - Main Application Controller
Coordinates all UI interactions:

**State Management:**
```javascript
state = {
  currentConversation,  // Active conversation
  isGenerating,         // Generation in progress
  pageContext,          // Current page context
  abortController,      // For cancellation
  settings              // Cached settings
}
```

**Event Handlers:**
- User input (keyboard, buttons)
- Settings changes
- Conversation switching
- Page context management
- Model parameter updates

**UI Updates:**
- Real-time message streaming
- Conversation list updates
- Model/provider badge updates
- Error/success notifications

### 6. Background Worker (`src/background.js`)

Handles extension-level events:
- Extension icon clicks → Open chat interface
- Installation/update events
- CORS rule management
- Message passing coordination

## Data Flow

### Message Generation Flow

```
1. User Input
   ↓
2. UI Validation (app.js)
   ↓
3. Add to Conversation (conversation.js)
   ↓
4. Format Messages (conversation.js)
   ↓
5. Get Current Provider (factory.js)
   ↓
6. Call generateResponse (provider)
   ↓
7. Stream Tokens
   ↓
8. Update UI (app.js onToken callback)
   ↓
9. Save Response (conversation.js)
   ↓
10. Update Conversation List
```

### Settings Update Flow

```
1. User Changes Setting
   ↓
2. Update UI Element
   ↓
3. updateSetting(path, value) (storage.js)
   ↓
4. Merge with Current Settings
   ↓
5. Save to localStorage
   ↓
6. Update Application State
   ↓
7. Trigger Dependent Updates
   (e.g., reload models if provider changed)
```

### Page Context Flow

```
1. User Clicks "Add Page"
   ↓
2. Get Active Tab (Chrome API)
   ↓
3. Send Message to Content Script
   ↓
4. Extract Page Content (page-extractor.js)
   ↓
5. Return Formatted Context
   ↓
6. Store in Application State
   ↓
7. Include in Next API Request
   ↓
8. Clear When Conversation Changes
```

## API Provider System

### Provider Interface Contract

All providers must implement:

```javascript
interface APIProvider {
  // Identification
  getName(): string

  // Connection
  testConnection(): Promise<boolean>

  // Models
  getModels(): Promise<Array<Model>>

  // Generation
  generateResponse(params: {
    model: string,
    messages: Array<Message>,
    options: GenerationOptions,
    signal: AbortSignal,
    onToken: (token: string) => void
  }): Promise<Response>

  // Validation
  validateConfig(): { valid: boolean, errors: Array<string> }
}
```

### Adding a New Provider

1. Create `src/api/new-provider.js`
2. Extend `BaseAPIProvider`
3. Implement required methods
4. Add to `PROVIDERS` constant
5. Update factory.js switch statement
6. Add UI settings section
7. Update documentation

Example:

```javascript
import { BaseAPIProvider } from './base.js';

export class NewProvider extends BaseAPIProvider {
  getName() {
    return 'new-provider';
  }

  async testConnection() {
    // Implementation
  }

  async getModels() {
    // Implementation
  }

  async generateResponse(params) {
    // Implementation
  }

  validateConfig() {
    // Implementation
  }
}
```

## Storage Strategy

### localStorage Schema

```javascript
{
  "app-settings": {
    provider: "ollama",
    ollama: { host: "http://localhost:11434" },
    openrouter: { apiKey: "", baseUrl: "..." },
    model: {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048,
      systemPrompt: ""
    },
    currentModel: "llama2"
  },

  "conversations": [
    {
      id: "conv_123",
      title: "Example Chat",
      messages: [...],
      model: "llama2",
      provider: "ollama",
      createdAt: "2025-01-...",
      updatedAt: "2025-01...",
      metadata: {
        context: [...],  // Ollama context
        systemPrompt: "",
        pageContext: null
      }
    }
  ],

  "active-conversation": "conv_123"
}
```

### Data Migration Strategy

When updating schema:
1. Check version in settings
2. Apply migrations incrementally
3. Update version number
4. Log migration success

## UI Architecture

### Component Structure

```
App (app.js)
├── Sidebar
│   ├── ConversationList
│   └── SearchBox
├── ChatMain
│   ├── Header
│   │   ├── Title (editable)
│   │   ├── ProviderBadge
│   │   ├── ModelBadge
│   │   └── PageContextButton
│   ├── MessageList
│   │   └── Message[]
│   └── InputArea
└── SettingsPanel (offcanvas)
    ├── ProviderSelector
    ├── ProviderSettings
    ├── ModelSelector
    ├── ModelParameters
    └── DataManagement
```

### State Updates

UI follows unidirectional data flow:
1. User action triggers event
2. Event handler updates state/storage
3. State change triggers UI update
4. UI renders new state

### Styling Strategy

- CSS custom properties for theming
- Bootstrap utilities for layout
- Custom classes for components
- Responsive breakpoints for mobile
- Dark theme by default

## Security Considerations

### XSS Prevention
- All user content sanitized with DOMPurify
- Markdown rendered then sanitized
- No `eval()` or `innerHTML` with unsanitized data

### API Key Storage
- Stored in localStorage (browser-managed)
- Not exposed in logs or errors
- Transmitted only to configured endpoints
- Can be cleared by user

### Content Script Security
- Runs in isolated environment
- Limited permissions
- Message-based communication
- No direct DOM manipulation from extension

### CORS Handling
- Chrome's declarativeNetRequest for Ollama
- Proper origin headers
- Limited to user-configured domains

## Extension Points

### Adding Features

**New UI Component:**
1. Create HTML structure
2. Add CSS styles
3. Wire up event listeners in app.js
4. Update state management

**New Setting:**
1. Add to DEFAULT_CONFIG in constants.js
2. Add UI control in settings panel
3. Add event handler in app.js
4. Use via getSetting()

**New Export Format:**
1. Add function to conversation.js
2. Add UI button
3. Implement format conversion
4. Trigger download

**New Keyboard Shortcut:**
1. Add to SHORTCUTS constant
2. Add event listener
3. Implement handler
4. Document in README

### Testing Strategy

**Manual Testing:**
1. Load extension in Chrome
2. Test each provider
3. Test page context extraction
4. Test conversation management
5. Test settings persistence
6. Test error scenarios

**Automated Testing (Future):**
- Unit tests for utilities
- Integration tests for API providers
- E2E tests for UI flows

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load conversations on demand
2. **Debouncing**: Search input, auto-save
3. **Streaming**: Progressive rendering of responses
4. **Pagination**: Conversation list virtual scrolling
5. **Caching**: Model lists, settings

### Memory Management

- Limit conversation list size
- Clear old page contexts
- Release message stream readers
- Remove event listeners on cleanup

## Future Architecture Improvements

1. **State Management Library**: Redux/Zustand for complex state
2. **Build Process**: Bundling, minification, tree-shaking
3. **TypeScript**: Type safety and better IDE support
4. **Testing Framework**: Jest + Testing Library
5. **Web Workers**: Background processing
6. **IndexedDB**: Better storage for large data
7. **Service Worker Caching**: Offline support

---

This architecture is designed to be:
- **Maintainable**: Clear separation, easy to understand
- **Extensible**: Easy to add providers, features
- **Testable**: Modular, mockable components
- **Performant**: Efficient rendering, streaming
- **Secure**: Input sanitization, proper permissions
