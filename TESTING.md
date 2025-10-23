# Testing Guide - AI Chat Assistant

This guide will help you test all functionality of the AI Chat Assistant extension with both Ollama and OpenRouter.

## Quick Start

### 1. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `ollama-extension` folder
5. The extension should now appear in your extensions list

### 2. Open the Extension

- Click the extension icon in your Chrome toolbar
- OR right-click any webpage and select "AI Chat Assistant" > "Open Chat"

---

## Testing with Ollama (Local AI)

### Prerequisites

1. **Install Ollama**: https://ollama.com/download
2. **Start Ollama server**:
   ```bash
   ollama serve
   ```
3. **Pull a model** (if you haven't already):
   ```bash
   ollama pull llama2
   # or
   ollama pull mistral
   # or
   ollama pull codellama
   ```

### Test Ollama Connection

1. Click the **⚙️ Settings** button in the sidebar
2. Verify settings:
   - **API Provider**: Should be "Ollama (Local)"
   - **Ollama Host URL**: Should be `http://localhost:11434`
3. Click **"Test Connection"** button
   - ✅ Success: You should see a success message
   - ❌ Failure: Check that Ollama is running (`ollama serve`)

### Test Ollama Model Selection

1. In Settings > **Model** dropdown
2. You should see all your installed Ollama models
3. Select a model (e.g., "llama2")
4. The header should now show: **Ollama | llama2**

### Test Ollama Chat

1. Type a message in the input box: `Hello! Can you help me?`
2. Press **Send** or hit `Ctrl+Enter`
3. You should see:
   - Your message appears (blue background)
   - Typing indicator shows
   - AI response streams in real-time (gray background with border)
   - Messages are properly formatted with markdown

---

## Testing with OpenRouter (Cloud AI)

### Prerequisites

1. **Get API Key**: Visit https://openrouter.ai/keys
2. Create an account if needed
3. Generate an API key (starts with `sk-or-...`)
4. Add credits to your account (minimum $5 recommended)

### Test OpenRouter Connection

1. Click **⚙️ Settings** button
2. Change **API Provider** dropdown to **"OpenRouter"**
3. The settings panel should now show **OpenRouter Configuration**
4. Enter your API key in the **API Key** field
5. Click **"Test Connection"** button
   - ✅ Success: Connection confirmed
   - ❌ Failure: Check your API key is correct

### Test OpenRouter Model Selection

1. After successful connection, go to **Model** dropdown
2. You should see 100+ models from various providers:
   - OpenAI (GPT-4, GPT-3.5)
   - Anthropic (Claude)
   - Google (Gemini)
   - Meta (Llama)
   - And many more!
3. Select a model (recommended: `anthropic/claude-3-haiku` for testing - it's fast and cheap)
4. The header should show: **OpenRouter | claude-3-haiku**

### Test OpenRouter Chat

1. Type a message: `Tell me a short joke`
2. Press Send
3. Verify:
   - Response streams correctly
   - Markdown formatting works
   - Different models produce different response styles

---

## Testing UI Features

### 1. Page Context Feature

**Test Adding Page Context:**

1. Navigate to any webpage (e.g., a Wikipedia article)
2. In the sidebar, click **📄 Add Page Context**
3. You should see a green badge: "📄 Page context active"
4. Send a message: `Summarize this page`
5. The AI should reference the current page content

**Test Clearing Page Context:**

1. Click the ❌ button on the green context badge
2. Badge should disappear
3. Next message won't include page context

### 2. Conversations

**Test Creating New Chat:**

1. Click the **+ (New Chat)** button in sidebar header
2. A new empty conversation should start
3. Previous conversation should be saved in the sidebar

**Test Switching Conversations:**

1. Start multiple conversations with different topics
2. Click on any conversation in the sidebar
3. That conversation should load with all its messages
4. Header title updates to match conversation

**Test Searching Conversations:**

1. Create several conversations with different topics
2. Use the search box in sidebar
3. Type a keyword that appears in one conversation
4. Sidebar filters to show only matching conversations

### 3. Settings & Customization

**Test Themes:**

1. Open Settings → **Appearance** → **Theme**
2. Try each theme:
   - **Dark**: Default dark theme (professional)
   - **Light**: Clean light theme
   - **Monochrome**: Black & white only
   - **High Contrast**: Accessibility mode
3. UI should update immediately

**Test Font Sizes:**

1. Settings → **Appearance** → **Font Size**
2. Try: Small, Medium, Large
3. All text should scale appropriately

**Test Compact Mode:**

1. Settings → **Appearance** → Check **Compact Mode**
2. UI should become more space-efficient
3. Good for smaller screens

**Test Model Parameters:**

1. Settings → **Model Parameters**
2. Adjust **Temperature** slider (0 = focused, 2 = creative)
3. Try different values and notice response style changes
4. Adjust **Top P** and **Max Tokens**

**Test System Prompts:**

1. Settings → **System Prompt**
2. Select a template from **Quick Templates** dropdown
3. OR write a custom prompt: `You are a helpful coding assistant`
4. New conversations will use this system prompt

### 4. Message Actions

**Test Copy Message:**

1. Hover over any assistant message
2. Action buttons should appear
3. Click copy icon
4. Message content copied to clipboard

**Test Message Context Menu:**

1. Right-click any message
2. Context menu should appear with options
3. Try each option

### 5. Keyboard Shortcuts

- `Ctrl+Enter` or `Cmd+Enter`: Send message
- `Ctrl+N` or `Cmd+N`: New chat
- `Ctrl+B` or `Cmd+B`: Toggle sidebar
- `Ctrl+,` or `Cmd+,`: Open settings
- `Ctrl+L` or `Cmd+L`: Focus input

### 6. Data Management

**Test Export Data:**

1. Settings → **Data Management** → **Export All Data**
2. Downloads JSON file with all conversations
3. Check file contains your data

**Test Clear Data:**

1. Settings → **Clear All Data**
2. Confirms before deleting
3. All conversations removed (use with caution!)

---

## Testing Error Handling

### Test Network Errors

1. **Stop Ollama** (if using Ollama)
2. Try to send a message
3. Should show clear error message
4. UI remains functional

### Test Invalid API Key

1. Switch to OpenRouter
2. Enter an invalid API key
3. Try to load models
4. Should show authentication error

### Test No Model Selected

1. Don't select any model
2. Try to send a message
3. Should show: "Please select a model first"

---

## Performance Testing

### Test Streaming Performance

1. Ask for a long response: `Write a 500-word essay about AI`
2. Verify:
   - Response streams smoothly
   - No lag or stuttering
   - Can scroll while streaming
   - Performance stats show (if enabled in settings)

### Test Multiple Conversations

1. Create 10+ conversations
2. Switch between them
3. Should load instantly
4. No memory issues

### Test Long Conversations

1. Have a conversation with 20+ messages
2. Verify:
   - All messages display correctly
   - Scrolling works smoothly
   - New messages still stream correctly

---

## Browser Compatibility

Test in different scenarios:

- [ ] Normal Chrome window
- [ ] Incognito mode
- [ ] Different screen sizes (resize window)
- [ ] Multiple tabs with the extension open

---

## Known Limitations

1. **Side Panel**: Currently opens in a new tab. Full side panel support coming soon.
2. **Image Analysis**: Text-only for now. Image models not yet supported.
3. **File Uploads**: Not currently supported.

---

## Troubleshooting

### Extension won't load

- Check Chrome version (need 88+)
- Check for console errors: F12 → Console tab
- Try reloading the extension

### Ollama won't connect

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Should return JSON with your models
# If not, start Ollama:
ollama serve
```

### OpenRouter won't connect

- Verify API key is correct
- Check you have credits: https://openrouter.ai/credits
- Try the test connection button
- Check browser console for specific errors

### Buttons don't work

- Hard refresh: Ctrl+Shift+R
- Reload extension in chrome://extensions
- Check browser console for JavaScript errors

### UI looks broken

- Clear browser cache
- Reload extension
- Check that all CSS files are loading (Network tab in DevTools)

---

## Reporting Issues

If you find bugs:

1. Open browser console (F12)
2. Look for errors (red text)
3. Take screenshots
4. Note exact steps to reproduce
5. Report with all details

---

## Success Criteria

Extension is working correctly if:

- ✅ Settings panel opens and closes smoothly
- ✅ Can connect to Ollama locally
- ✅ Can connect to OpenRouter with API key
- ✅ Models load and display in dropdown
- ✅ Chat messages send and receive correctly
- ✅ Responses stream in real-time
- ✅ Markdown renders properly (code blocks, lists, etc.)
- ✅ Page context can be added and used
- ✅ Conversations save and load correctly
- ✅ Themes change the UI appearance
- ✅ All buttons and controls are functional
- ✅ No console errors during normal operation

Enjoy your AI Chat Assistant! 🚀
