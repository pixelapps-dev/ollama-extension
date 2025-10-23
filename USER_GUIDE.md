# User Guide - AI Chat Assistant

Complete guide to using all features of the AI Chat Assistant Chrome extension.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
- [Page Context Feature](#page-context-feature)
- [Conversation Management](#conversation-management)
- [Settings & Configuration](#settings--configuration)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [Tips & Best Practices](#tips--best-practices)
- [FAQ](#faq)

## Getting Started

### First-Time Setup

#### Option 1: Using Ollama (Local/Free)

1. **Install Ollama**
   - Visit [ollama.ai](https://ollama.ai)
   - Download and install for your OS
   - Verify installation: `ollama --version`

2. **Download a Model**
   ```bash
   # Recommended models:
   ollama pull llama2          # General purpose, 7B
   ollama pull mistral         # Fast, efficient
   ollama pull codellama       # For coding tasks
   ollama pull llama2:13b      # More capable, slower
   ```

3. **Start Ollama Server**
   ```bash
   ollama serve
   ```
   Server runs on `http://localhost:11434` by default

4. **Configure Extension**
   - Click extension icon
   - Open Settings (⚙️ button)
   - Provider: Select "Ollama (Local)"
   - Host: Leave as `http://localhost:11434`
   - Click "Test Connection" → Should show "Connection successful!"

5. **Select Model**
   - In settings, choose your downloaded model
   - Click Save
   - Start chatting!

#### Option 2: Using OpenRouter (Cloud/Paid)

1. **Sign Up**
   - Visit [openrouter.ai](https://openrouter.ai)
   - Create account (GitHub or email)
   - Get free credits ($1-5) on signup

2. **Generate API Key**
   - Go to Keys section
   - Click "Create Key"
   - Copy the key (starts with `sk-or-`)

3. **Configure Extension**
   - Click extension icon
   - Open Settings (⚙️)
   - Provider: Select "OpenRouter"
   - Paste API key
   - Click "Test Connection"

4. **Browse Models**
   - 100+ models available
   - Free tier: Limited free models
   - Paid: GPT-4, Claude, Llama, etc.
   - Check pricing at [openrouter.ai/models](https://openrouter.ai/models)

5. **Start Chatting**
   - Select a model
   - Begin conversation!

## Basic Usage

### Starting a Conversation

1. **Open Extension**
   - Click extension icon in toolbar
   - New tab opens with chat interface

2. **Type Your Message**
   - Click in text box at bottom
   - Type your question or message
   - Press **Ctrl+Enter** (or Cmd+Enter on Mac) to send
   - Or click "Send" button

3. **Receive Response**
   - AI response streams in real-time
   - Markdown formatted (code blocks, lists, etc.)
   - Copy button appears for each message

### Message Features

**Markdown Support:**
- **Bold**: `**text**` → **text**
- *Italic*: `*text*` → *text*
- Code: `` `code` `` → `code`
- Code blocks with syntax highlighting
- Lists, headers, links, tables

**Code Blocks:**
```python
def hello():
    print("Hello, world!")
```
- Auto-detected language
- Copy button for easy copying
- Syntax highlighting

**Copying Messages:**
- Click 📋 button next to any message
- Entire message copied to clipboard
- Works for both text and code

### Creating a New Chat

**Method 1: New Chat Button**
- Click "+ New Chat" in sidebar
- Creates fresh conversation
- Previous chat auto-saved

**Method 2: Keyboard Shortcut**
- Press **Ctrl+N** (Cmd+N on Mac)
- Instant new conversation

**What Happens:**
- Current chat saved automatically
- New chat gets default title "New Chat"
- Title auto-updates from first message

## Page Context Feature

### What is Page Context?

The extension can extract and include the current webpage's content in your conversation, allowing you to:
- Summarize articles
- Ask questions about documentation
- Analyze blog posts
- Extract specific information
- Compare multiple sources

### How to Use

1. **Navigate to Target Page**
   - Open any webpage you want to discuss
   - Wait for page to fully load

2. **Add Page Context**
   - Click extension icon
   - Click "📄 Add Page" button
   - Green badge appears: "📄 Page context active"

3. **Chat About the Page**
   ```
   You: Summarize the main points of this article
   AI: [Provides summary based on page content]

   You: What are the key takeaways?
   AI: [Extracts specific insights]
   ```

4. **Clear Page Context**
   - Click X on the green badge
   - Or start a new chat (auto-clears)

### What Gets Extracted

**Included:**
- Main article/content text
- Headings structure
- Page title and metadata
- Selected text (if you highlight before clicking)

**Excluded:**
- Navigation menus
- Ads and sidebars
- Comments sections
- Footer content
- Scripts and styles

### Example Use Cases

**1. Article Summarization**
```
Page: Long Medium article about AI
You: Give me a 3-bullet summary
AI: • Point 1... • Point 2... • Point 3...
```

**2. Documentation Help**
```
Page: React documentation
You: Explain hooks to a beginner
AI: [Explains using context from the page]
```

**3. Research Analysis**
```
Page: Research paper
You: What methodology did they use?
AI: [Extracts methodology from paper]
```

**4. Code Explanation**
```
Page: GitHub repository README
You: How do I install this?
AI: [Provides installation steps from README]
```

### Tips for Page Context

- **Best for text-heavy pages**: Articles, docs, blogs
- **Not ideal for**: SPAs with dynamic content, video sites
- **Character limit**: ~50,000 characters (auto-truncated)
- **Refresh context**: Click "Add Page" again to update
- **Combine with questions**: Be specific about what you want

## Conversation Management

### Viewing All Conversations

**Sidebar** (left side):
- All conversations listed
- Sorted by most recent
- Shows title and time
- Active conversation highlighted

**Search Conversations:**
- Type in search box
- Searches titles and content
- Real-time filtering

### Switching Conversations

**Method 1: Click in Sidebar**
- Click any conversation
- Loads instantly
- Continues where you left off

**Method 2: Search Then Select**
- Search for keyword
- Click result

### Renaming Conversations

1. Click edit icon (✏️) next to title
2. Enter new title
3. Click "Save"
4. Updates in sidebar immediately

**Auto-Naming:**
- First message auto-generates title
- Truncated to 50 characters
- Can override anytime

### Deleting Conversations

**Right-click menu** (future feature):
- Right-click conversation in sidebar
- Select "Delete"
- Confirm deletion

**Current method:**
- No UI yet, use Clear All Data (⚠️ dangerous)

### Exporting Conversations

**Export to JSON:**
```json
{
  "title": "Chat about React",
  "messages": [...],
  "model": "llama2",
  "createdAt": "..."
}
```

**Export to Markdown:**
```markdown
# Chat about React

**You:**
How do React hooks work?

**Assistant:**
React hooks allow you to...
```

**How to Export:**
1. Open Settings
2. Click "Export All Data"
3. Downloads JSON file
4. Contains all conversations + settings

### Importing Conversations

1. Open Settings
2. Click "Import Data"
3. Select JSON file
4. All data restored
5. Refreshes automatically

## Settings & Configuration

### Provider Settings

#### Ollama Configuration

**Host URL:**
- Default: `http://localhost:11434`
- Remote server: `http://192.168.1.100:11434`
- HTTPS supported: `https://example.com:11434`

**Test Connection:**
- Click button to verify
- Success = green message
- Failure = shows error

**Common Issues:**
- Server not running → Start with `ollama serve`
- Wrong port → Check Ollama config
- CORS error → See troubleshooting section

#### OpenRouter Configuration

**API Key:**
- Format: `sk-or-xxxxxxxx`
- Get from [openrouter.ai/keys](https://openrouter.ai/keys)
- Free credits on signup

**Test Connection:**
- Validates API key
- Checks account status
- Shows error if invalid

### Model Selection

**Ollama Models:**
- Shows only locally downloaded models
- Pull new models: `ollama pull <model>`
- Refresh list: Change provider and back

**OpenRouter Models:**
- 100+ models available
- Sorted alphabetically
- Shows pricing (if available)
- Free vs paid indicated

**Model Info:**
- Name and description
- Parameter count (Ollama)
- Context length (OpenRouter)
- Pricing (OpenRouter)

### Model Parameters

#### Temperature (0.0 - 2.0)

**Controls randomness:**
- **0.0**: Deterministic, focused
  - Use for: Facts, coding, precision
- **0.7**: Balanced (default)
  - Use for: General conversation
- **1.5+**: Creative, varied
  - Use for: Brainstorming, storytelling

**Examples:**
```
Temperature 0.0:
Q: What is 2+2?
A: 4

Temperature 2.0:
Q: What is 2+2?
A: Well, typically that would be 4, though in some mathematical systems...
```

#### Top P (0.0 - 1.0)

**Nucleus sampling:**
- **0.9**: Default, good balance
- **1.0**: All tokens considered
- **0.5**: More focused, less diverse

**When to adjust:**
- High (0.95-1.0): More creative responses
- Low (0.5-0.8): More focused, consistent

#### Max Tokens

**Response length limit:**
- **Default**: 2048 tokens (~1500 words)
- **Longer**: 4096, 8192 for detailed responses
- **Shorter**: 512, 1024 for concise answers

**Note**: 1 token ≈ 0.75 words (English)

#### System Prompt

**Defines AI behavior:**

**Examples:**

*Helpful Assistant:*
```
You are a helpful, patient assistant who explains concepts clearly.
```

*Coding Expert:*
```
You are an expert programmer. Provide concise, well-commented code.
Always explain your reasoning.
```

*Concise Responder:*
```
Respond in 2-3 sentences maximum. Be direct and concise.
```

*Specific Role:*
```
You are a React expert. All answers should reference React best practices.
```

**Tips:**
- Be specific about tone and style
- Include constraints (length, format)
- Define expertise area
- Persists for entire conversation

## Advanced Features

### Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Send message
- **Ctrl/Cmd + N**: New chat
- **Ctrl/Cmd + ,**: Open settings
- **Ctrl/Cmd + L**: Focus input box

### Data Management

**Export All Data:**
- Includes all conversations
- Includes all settings
- JSON format
- Use for backup

**Import Data:**
- Restore from export
- Merge or replace options
- Validates format

**Clear All Data:**
- ⚠️ **WARNING**: Cannot be undone
- Deletes everything
- Resets to defaults
- Requires confirmation

### Markdown Tips

**Advanced Formatting:**

*Tables:*
```markdown
| Feature | Ollama | OpenRouter |
|---------|--------|------------|
| Cost    | Free   | Paid       |
| Speed   | Fast   | Variable   |
```

*Task Lists:*
```markdown
- [x] Completed task
- [ ] Pending task
```

*Blockquotes:*
```markdown
> Important information
> spans multiple lines
```

## Troubleshooting

### Connection Issues

**"Unable to connect to Ollama server"**

1. Check if Ollama is running:
   ```bash
   # Terminal 1: Start server
   ollama serve

   # Terminal 2: Verify
   curl http://localhost:11434/api/tags
   ```

2. Check firewall settings
3. Verify port not in use
4. Try `http://127.0.0.1:11434` instead

**"OpenRouter API Error"**

1. Verify API key is correct
2. Check account credits
3. Check model availability
4. Try different model

### Page Context Not Working

1. **Refresh the page** before extracting
2. **Wait for full load** (dynamic content)
3. **Try manual selection**: Highlight text first
4. **Check page type**: Works best on article pages
5. **Extension permissions**: Allow on all sites

### Models Not Loading

**Ollama:**
1. Pull models first: `ollama list`
2. Restart Ollama server
3. Click Test Connection
4. Reload extension

**OpenRouter:**
1. Verify API key
2. Check internet connection
3. Try different browser
4. Check OpenRouter status page

### Conversations Not Saving

1. Check browser storage quota
2. Clear old conversations
3. Export and reimport
4. Try incognito mode (test)

### Extension Not Appearing

1. Check if extension enabled
2. Reload extension
3. Check for Chrome updates
4. Reinstall extension

## Tips & Best Practices

### Getting Better Responses

**Be Specific:**
```
❌ Tell me about React
✓ Explain React hooks with a simple example
```

**Provide Context:**
```
❌ How do I fix this?
✓ I'm getting error X in React app. Here's my code: ...
```

**Use System Prompts:**
- Set expertise level
- Define response style
- Add constraints

**Break Down Complex Questions:**
```
Instead of:
"Explain everything about databases"

Try:
1. "What is a database?"
2. "What's the difference between SQL and NoSQL?"
3. "When should I use each?"
```

### Optimizing for Speed

**Ollama (Local):**
- Use smaller models (7B vs 13B)
- Reduce max tokens
- Close other applications
- Use GPU if available

**OpenRouter:**
- Choose faster models
- Reduce max tokens
- Lower temperature slightly
- Use paid tier for priority

### Managing Costs (OpenRouter)

1. **Check pricing** before selecting model
2. **Set max tokens** to avoid long responses
3. **Use free models** for testing
4. **Monitor usage** in OpenRouter dashboard
5. **Set budget alerts** in OpenRouter

### Privacy Best Practices

**Ollama (Private):**
- All data stays local
- No internet required (after model download)
- Safe for sensitive information

**OpenRouter (Cloud):**
- Data sent to OpenRouter
- Don't share passwords, keys, PII
- Read privacy policy
- Use Ollama for sensitive data

## FAQ

**Q: Is this free?**
A: Ollama is completely free. OpenRouter has free models but most are paid.

**Q: Do I need to sign up?**
A: No signup needed for Ollama. OpenRouter requires account.

**Q: Can I use this offline?**
A: Yes with Ollama. No with OpenRouter (requires internet).

**Q: How much does OpenRouter cost?**
A: Varies by model. $0.001-$0.10 per 1K tokens. Check pricing page.

**Q: Which models are best?**
A:
- **General**: Llama2, Mistral, GPT-3.5
- **Coding**: CodeLlama, GPT-4, Claude
- **Creative**: GPT-4, Claude, Llama2-13B

**Q: Can I use multiple providers?**
A: Yes! Switch in settings. Each conversation remembers its provider.

**Q: Is my data safe?**
A: With Ollama: Yes, completely local. With OpenRouter: Sent to their servers.

**Q: Can I export my chats?**
A: Yes, Export All Data in settings.

**Q: What browsers are supported?**
A: Chrome and Chromium-based browsers (Edge, Brave, etc.).

**Q: Can I use GPT-4?**
A: Yes, through OpenRouter (paid).

**Q: How do I update models?**
A: Ollama: `ollama pull <model>`. OpenRouter: Automatic.

**Q: My responses are nonsensical. Why?**
A: Try lowering temperature, checking model, or adding system prompt.

**Q: Can I use this for coding?**
A: Yes! Use CodeLlama (Ollama) or GPT-4 (OpenRouter).

**Q: Does it remember past conversations?**
A: Yes, all conversations saved locally. Switch between them anytime.

**Q: Can I rename conversations?**
A: Yes, click edit icon next to title.

**Q: What's the difference between Ollama and OpenRouter?**
A:
- Ollama: Local, free, private, slower, limited models
- OpenRouter: Cloud, paid, fast, 100+ models, requires internet

**Q: Can I contribute?**
A: Yes! See CONTRIBUTING.md and GitHub repository.

---

**Need more help?**
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Documentation: README.md, ARCHITECTURE.md

**Enjoy chatting with AI! 🚀**
