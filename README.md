# AI Chat Assistant 🤖

A powerful Chrome extension for chatting with AI models through multiple providers (Ollama and OpenRouter) with advanced features including page context extraction, conversation management, and customizable model parameters.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Multi-Provider Support
- **Ollama**: Chat with locally-hosted open-source models
- **OpenRouter**: Access 100+ commercial and open-source models through a unified API

### Page Context Integration 📄
- Extract and include current webpage content as context
- Smart content extraction (ignores navigation, ads, etc.)
- Discuss articles, documentation, or any web page with AI

### Advanced Chat Features
- 💬 Unlimited conversation history
- 🔍 Search through conversations
- 📁 Organize and manage multiple chats
- 💾 Export conversations (JSON/Markdown)
- 📋 Copy messages with one click
- ✏️ Edit conversation titles

### Customizable Model Parameters
- Temperature control (creativity vs. focus)
- Top-P (nucleus sampling)
- Max tokens limit
- Custom system prompts
- Per-conversation settings

### Modern UI/UX
- Clean, intuitive interface
- Dark theme optimized
- Responsive design (mobile-friendly)
- Keyboard shortcuts
- Real-time streaming responses
- Markdown rendering with syntax highlighting

## 🚀 Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/ollama-ui/ollama-ui.git
   cd ollama-ui
   ```

2. **Download required resources**
   ```bash
   make download_resources
   ```

3. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `ollama-extension` directory

4. **Pin the extension** (optional)
   - Click the puzzle icon in Chrome toolbar
   - Find "AI Chat Assistant"
   - Click the pin icon

## 📖 Usage

### Getting Started with Ollama (Local)

1. **Install Ollama**
   - Download from [ollama.ai](https://ollama.ai)
   - Pull a model: `ollama pull llama2`

2. **Configure the extension**
   - Click the extension icon
   - Open Settings (⚙️)
   - Select "Ollama (Local)" as provider
   - Default host: `http://localhost:11434`
   - Click "Test Connection"

3. **Select a model and start chatting!**

### Getting Started with OpenRouter

1. **Get an API key**
   - Sign up at [openrouter.ai](https://openrouter.ai)
   - Generate an API key

2. **Configure the extension**
   - Click the extension icon
   - Open Settings (⚙️)
   - Select "OpenRouter" as provider
   - Enter your API key
   - Click "Test Connection"

3. **Choose from 100+ models and chat!**

### Using Page Context

1. **Navigate to any webpage** you want to discuss
2. **Click "📄 Add Page"** in the chat interface
3. **Ask questions** about the page content
4. The AI will have full context of the page

**Example use cases:**
- Summarize long articles
- Explain complex documentation
- Analyze blog posts
- Extract key information from research papers
- Answer questions about current page

### Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Send message
- **Ctrl/Cmd + N**: New chat
- **Ctrl/Cmd + ,**: Open settings
- **Ctrl/Cmd + L**: Focus input

## ⚙️ Configuration

### Ollama Settings

- **Host URL**: Address of your Ollama server (default: `http://localhost:11434`)
- Supports remote servers (e.g., `http://192.168.1.100:11434`)
- Supports HTTPS

### OpenRouter Settings

- **API Key**: Your OpenRouter API key (starts with `sk-or-`)
- Get free credits on signup
- Pay-as-you-go pricing

### Model Parameters

- **Temperature** (0.0 - 2.0): Controls randomness
  - Lower = More focused and deterministic
  - Higher = More creative and random
  - Default: 0.7

- **Top P** (0.0 - 1.0): Nucleus sampling threshold
  - Controls diversity of responses
  - Default: 0.9

- **Max Tokens**: Maximum response length
  - Default: 2048
  - Adjust based on your needs

- **System Prompt**: Instructions for the AI's behavior
  - Example: "You are a helpful coding assistant"
  - Persists across messages in a conversation

## 🏗️ Architecture

The extension is built with a modular architecture:

```
src/
├── api/              # API provider abstractions
│   ├── base.js       # Base provider interface
│   ├── ollama.js     # Ollama implementation
│   ├── openrouter.js # OpenRouter implementation
│   └── factory.js    # Provider factory
├── services/         # Core services
│   ├── storage.js    # Settings & data persistence
│   └── conversation.js # Conversation management
├── ui/               # User interface
│   └── app.js        # Main UI controller
├── utils/            # Utilities
│   ├── constants.js  # App constants
│   ├── errors.js     # Error handling
│   └── markdown.js   # Markdown utilities
├── content/          # Content scripts
│   └── page-extractor.js # Page context extraction
├── styles/           # Stylesheets
│   └── main.css      # Main styles
├── background.js     # Background service worker
└── index.html        # Main UI
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation.

## 🔒 Privacy & Security

- **All data stored locally** in your browser (localStorage)
- **No telemetry or tracking**
- **No data sent to third parties** (except chosen AI provider)
- **API keys encrypted** in browser storage
- **Open source** - audit the code yourself

### For Ollama Users
- Everything runs on your machine
- No data leaves your computer
- Complete privacy

### For OpenRouter Users
- Data sent to OpenRouter's API
- Subject to OpenRouter's privacy policy
- Review their terms at [openrouter.ai/privacy](https://openrouter.ai/privacy)

## 🛠️ Development

### Setup

```bash
git clone https://github.com/ollama-ui/ollama-ui.git
cd ollama-ui
make download_resources
```

### Project Structure

- ES6 modules for clean code organization
- No build step required (uses native ES modules)
- Bootstrap 5 for UI components
- Marked.js for Markdown rendering
- DOMPurify for XSS protection

### Testing Locally

1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click reload icon for "AI Chat Assistant"
4. Test your changes

## 📝 Changelog

### Version 2.0.0 (2025-01-XX)

**Major Rewrite:**
- ✨ Added OpenRouter support
- ✨ Added page context extraction
- ✨ Complete UI redesign
- ✨ Conversation management system
- ✨ Advanced model parameters
- ✨ Export/import functionality
- 🏗️ Modular architecture
- 📚 Comprehensive documentation
- 🐛 Fixed numerous bugs
- 🔒 Improved security

### Version 1.6 (Previous)
- Basic Ollama chat functionality
- Simple UI
- Local storage for chat history

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) for making local AI accessible
- [OpenRouter](https://openrouter.ai) for unified LLM API access
- [Bootstrap](https://getbootstrap.com) for UI components
- [Marked.js](https://marked.js.org) for Markdown parsing
- [DOMPurify](https://github.com/cure53/DOMPurify) for sanitization

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ollama-ui/ollama-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ollama-ui/ollama-ui/discussions)
- **Documentation**: [User Guide](USER_GUIDE.md)

## 🗺️ Roadmap

- [ ] Voice input support
- [ ] Image input for vision models
- [ ] Conversation branching/forking
- [ ] Prompt library/templates
- [ ] Browser action popup UI
- [ ] Sync across devices (optional)
- [ ] More AI providers (Anthropic, Google, etc.)
- [ ] Plugin system
- [ ] Mobile app version

---

**Made with ❤️ by the Ollama UI community**
