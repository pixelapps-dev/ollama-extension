#!/bin/bash

echo "🔍 AI Chat Assistant - Extension Verification"
echo "=============================================="
echo ""

# Check required files
echo "📋 Checking Required Files..."
files=(
  "manifest.json"
  "background.js"
  "index.html"
  "icon16.png"
  "icon32.png"
  "icon48.png"
  "icon128.png"
)

all_present=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - MISSING!"
    all_present=false
  fi
done

echo ""

# Check directories
echo "📁 Checking Required Directories..."
dirs=(
  "src/api"
  "src/services"
  "src/ui"
  "src/utils"
  "src/content"
  "src/styles"
  "resources"
)

for dir in "${dirs[@]}"; do
  if [ -d "$dir" ]; then
    file_count=$(find "$dir" -type f | wc -l)
    echo "  ✅ $dir ($file_count files)"
  else
    echo "  ❌ $dir - MISSING!"
    all_present=false
  fi
done

echo ""

# Validate manifest.json
echo "🔍 Validating manifest.json..."
if python3 -m json.tool manifest.json > /dev/null 2>&1; then
  echo "  ✅ manifest.json is valid JSON"
  version=$(grep -oP '"version":\s*"\K[^"]+' manifest.json)
  echo "  📌 Version: $version"
else
  echo "  ❌ manifest.json has JSON errors!"
  all_present=false
fi

echo ""

# Check for node_modules or unnecessary files
echo "🧹 Checking for Unnecessary Files..."
if [ -d "node_modules" ]; then
  echo "  ⚠️  node_modules directory found (not needed)"
else
  echo "  ✅ No node_modules"
fi

if [ -d ".git" ]; then
  echo "  ℹ️  .git directory present (normal for development)"
fi

echo ""

# Calculate size
echo "📊 Extension Statistics..."
total_files=$(find . -type f | wc -l)
total_size=$(du -sh . | cut -f1)
echo "  📁 Total files: $total_files"
echo "  💾 Total size: $total_size"

echo ""

# Final verdict
if [ "$all_present" = true ]; then
  echo "✅ VERIFICATION PASSED!"
  echo ""
  echo "🚀 Extension is ready to test in Chrome!"
  echo ""
  echo "Next steps:"
  echo "  1. Open chrome://extensions/"
  echo "  2. Enable Developer Mode"
  echo "  3. Click 'Load unpacked'"
  echo "  4. Select this directory"
  echo ""
  echo "📖 See QUICK_START.md for detailed instructions"
else
  echo "❌ VERIFICATION FAILED!"
  echo "   Some required files are missing."
  echo "   Please check the errors above."
fi

echo ""
