# Google Font Tester

## What This Is
A lightweight, self-contained JavaScript widget that lets users preview Google Fonts on any website. Include the script and a floating "Aa" button appears in the bottom-right corner.

## Project Structure
- `google-font-tester.js` - The entire widget (single file, ~400 lines)

## Architecture
- IIFE pattern to avoid global scope pollution
- Injects its own CSS into `<head>`
- Creates widget DOM and appends to `<body>`
- Lazy-loads fonts via Google Fonts CSS API using IntersectionObserver

## Key Components
- **Font data**: Hardcoded array of 80+ fonts with categories (sans-serif, serif, display, handwriting, monospace)
- **UI**: Toggle button, search input, category filter buttons, scrollable font list
- **Font loading**: `loadFont()` creates `<link>` elements pointing to fonts.googleapis.com
- **Font application**: Sets `document.body.style.fontFamily` directly

## Current Limitations
- No font weight/style selection
- No persistence across refresh (intentional)

## Selector Feature
Users can enter any CSS selector in the input field (defaults to `body`). Examples:
- `*` - all elements
- `h1, h2, h3` - all headings
- `.content` - elements with class "content"

Original fonts are stored in a Map and restored on reset.

## Usage (via jsDelivr CDN)
```html
<script src="https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js"></script>
```

GitHub raw URLs don't work for hotlinking JS (wrong MIME type). jsDelivr serves files with correct headers automatically from any public GitHub repo.

## Build/Test
No build process. Include script directly in any HTML page to test.
