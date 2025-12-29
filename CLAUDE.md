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
- No persistence across refresh (intentional)

## Controls
- **CSS Selector** - target specific elements (defaults to `body`)
- **Font Weight** - dropdown: 300 Light through 900 Black
- **Font Size** - text input, auto-appends `px` if no unit provided
- **Line Height** - slider from -0.5 to 5
- **!important** - checkbox to force override existing styles

All controls trigger live updates via `applyFont(currentFont)`.

Original styles (fontFamily, fontWeight, fontSize, lineHeight) stored in a Map and restored on reset.

## Usage (via jsDelivr CDN)
```html
<script src="https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js"></script>
```

GitHub raw URLs don't work for hotlinking JS (wrong MIME type). jsDelivr serves files with correct headers automatically from any public GitHub repo.

## Build/Test
No build process. Include script directly in any HTML page to test.
