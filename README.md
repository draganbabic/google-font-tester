# Google Font Tester

A lightweight widget for previewing Google Fonts on any website. Add one line of code and get a floating font picker with access to 1700+ fonts via the Google Fonts API.

![Google Font Tester Panel](google-font-tester-panel.png)

## Installation

Add this to your HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js"></script>
```

That's it. A small "Aa" button will appear in the bottom-right corner of your page.

## Bookmarklet

Want to test fonts on any website without editing code? Create a bookmarklet:

1. Create a new bookmark in your browser
2. Name it "Font Tester"
3. Paste this as the URL:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js';document.body.appendChild(s);})();
```

4. Visit any website and click the bookmark to activate the font tester

**Note:** Some sites (e.g., x.com) have strict Content Security Policy that blocks external scripts. For these sites, use a userscript manager like Tampermonkey, or paste the script directly in DevTools console:

```javascript
fetch('https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js').then(r=>r.text()).then(eval)
```

## Features

- **1700+ Google Fonts** via API (sorted by popularity)
- Filter by category: Sans, Serif, Display, Script, Mono
- Search fonts by name
- **Keyboard navigation** - Arrow keys to browse, Enter to select
- **Copy CSS** - export your font settings to clipboard
- **Custom CSS selector** - target specific elements (defaults to `body`)
- **Font weight** - select from 300 (Light) to 900 (Black)
- **Font size** - enter any value (e.g., `16`, `1.5rem`, `14px`)
- **Line height** - adjustable slider
- **Force !important** - override existing styles when needed
- Virtual scrolling for smooth performance with large font lists
- Falls back to 80 curated fonts if API is unavailable
- Zero dependencies
- Nothing persists - refresh to reset

## Custom API Key

The widget includes a default API key, but you can use your own:

```html
<script>window.GFT_API_KEY = 'your-api-key-here';</script>
<script src="https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js"></script>
```

Get a free API key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (enable the Web Fonts Developer API).

## Use Cases

- Designers exploring font options for a project
- Developers testing font readability
- Quick font comparisons without editing CSS

## Content Security Policy (CSP)

If your site uses CSP, add these directives:

```
style-src 'unsafe-inline';
connect-src fonts.googleapis.com www.googleapis.com;
font-src fonts.gstatic.com;
```

## License

MIT
