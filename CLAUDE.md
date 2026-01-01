# Google Font Tester

## What This Is
A lightweight, self-contained JavaScript widget that lets users preview Google Fonts on any website. Include the script and a floating "Aa" button appears in the bottom-right corner.

## Project Structure
- `google-font-tester.js` - The entire widget (single file, ~850 lines)
- `test.html` - Test page with sample content (mirrors README content)
- `README.md` - User documentation

**Important:** When updating README.md, also update test.html with the same content (converted to HTML).

## Architecture
- IIFE pattern to avoid global scope pollution
- Injects its own CSS into `<head>`
- Creates widget DOM and appends to `<body>`
- Fetches 1700+ fonts from Google Fonts API (sorted by popularity)
- Falls back to hardcoded 80 fonts if API fails
- Virtual scrolling for performance with large font lists
- Lazy-loads font previews via IntersectionObserver

## API Integration
- Uses Google Fonts Developer API (`www.googleapis.com/webfonts/v1/webfonts`)
- Default API key included, users can override via `window.GFT_API_KEY`
- Fonts fetched on first panel open, cached in memory
- Response transformed to `{ family, category }` format

## Virtual Scrolling
- Fixed item height: 52px
- Only renders visible items + 5-item buffer above/below
- Scroll handler triggers re-render of visible slice
- Inner container with absolute positioning for items

## Key Components
- **Font data**: API-fetched array with fallback to 80 curated fonts
- **UI**: Panel grows from trigger button (0.2s animation), close button in header
- **Font loading**: `loadFont()` creates `<link>` elements pointing to fonts.googleapis.com
- **Font application**: Uses `el.style.setProperty()` to support !important flag
- **Keyboard nav**: Arrow keys navigate list, Enter applies selection

## UI Structure
- `#gft-panel` - Main container, starts collapsed (44x40px), expands to full height
- `#gft-trigger` - "Aa" text shown when collapsed
- `#gft-content` - Fades in when panel opens
- `#gft-header` - Title row with Reset, Copy CSS, and Close buttons
- `#gft-list` - Virtual scrolling container (flex: 1 fills remaining space)
- `#gft-list-inner` - Positioned container for font items
- `#gft-current` - Status bar showing font count or current font

## Controls
- **CSS Selector** - target specific elements (defaults to `body`)
- **Font Weight** - dropdown: 300 Light through 900 Black
- **Font Size** - text input, auto-appends `px` if no unit provided
- **Line Height** - slider from -0.5 to 5
- **!important** - checkbox to force override existing styles
- **Copy CSS** - copies only changed properties to clipboard

All controls trigger live updates via `applyFont(currentFont)`.

## Keyboard Navigation
- **Arrow Down/Up** - Move selection through font list
- **Enter** - Apply selected font
- List auto-scrolls to keep selection visible

## State Variables
- `fonts` - Array of all fonts (from API or fallback)
- `fontsLoaded` - Boolean, prevents re-fetching
- `currentFiltered` - Filtered fonts for current search/category
- `selectedIndex` - Current keyboard selection index
- `currentFont` - Currently applied font name
- `originalFonts` - Map storing original styles for reset

## Current Limitations
- No persistence across refresh (intentional)

## Usage (via jsDelivr CDN)
```html
<script src="https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js"></script>
```

### Custom API Key
```html
<script>window.GFT_API_KEY = 'your-api-key-here';</script>
<script src="https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js"></script>
```

## Build/Test
No build process. Open `test.html` in a browser to test locally.

## Content Security Policy (CSP)
If the host site uses CSP, these directives are required:
- `style-src 'unsafe-inline'` - for injected widget styles
- `connect-src fonts.googleapis.com www.googleapis.com` - for font CSS and API requests
- `font-src fonts.gstatic.com` - for actual font file downloads
