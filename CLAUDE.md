# Google Font Tester

## What This Is
A lightweight, self-contained JavaScript widget that lets users preview Google Fonts on any website. Include the script and a floating "Aa" button appears in the bottom-right corner.

## Project Structure
- `google-font-tester.js` - The entire widget (single file, ~620 lines)
- `test.html` - Test page with sample content

## Architecture
- IIFE pattern to avoid global scope pollution
- Injects its own CSS into `<head>`
- Creates widget DOM and appends to `<body>`
- Lazy-loads fonts via Google Fonts CSS API using IntersectionObserver

## Key Components
- **Font data**: Hardcoded array of 80+ fonts with categories (sans-serif, serif, display, handwriting, monospace)
- **UI**: Panel grows from trigger button (0.2s animation), close button in header
- **Font loading**: `loadFont()` creates `<link>` elements pointing to fonts.googleapis.com (loads weights 300-900)
- **Font application**: Uses `el.style.setProperty()` to support !important flag

## UI Structure
- `#gft-panel` - Main container, starts collapsed (44x40px), expands to full height
- `#gft-trigger` - "Aa" text shown when collapsed
- `#gft-content` - Fades in when panel opens
- `#gft-header` - Title row with Reset and Close buttons, selector input, controls
- `#gft-list` - Scrollable font list (flex: 1 fills remaining space)
- `#gft-current` - Status bar showing current font

## Controls
- **CSS Selector** - target specific elements (defaults to `body`)
- **Font Weight** - dropdown: 300 Light through 900 Black
- **Font Size** - text input, auto-appends `px` if no unit provided
- **Line Height** - slider from -0.5 to 5
- **!important** - checkbox to force override existing styles

All controls trigger live updates via `applyFont(currentFont)`.

Original styles (fontFamily, fontWeight, fontSize, lineHeight) stored in a Map and restored on reset.

## Current Limitations
- No persistence across refresh (intentional)

## Usage (via jsDelivr CDN)
```html
<script src="https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js"></script>
```

GitHub raw URLs don't work for hotlinking JS (wrong MIME type). jsDelivr serves files with correct headers automatically from any public GitHub repo.

## Build/Test
No build process. Open `test.html` in a browser to test locally.
