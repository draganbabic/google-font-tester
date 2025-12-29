/**
 * Google Font Tester
 *
 * A lightweight widget for previewing Google Fonts on any website.
 * Displays a fixed panel in the bottom-right corner with search,
 * category filters, and instant font preview.
 *
 * Usage:
 *   <script src="https://cdn.jsdelivr.net/gh/draganbabic/google-font-tester@main/google-font-tester.js"></script>
 *
 * That's it! The widget will automatically initialize and appear
 * as a small "Aa" button in the bottom-right corner of your page.
 *
 * Features:
 *   - Search through 80+ popular Google Fonts
 *   - Filter by category: Sans, Serif, Display, Script, Mono
 *   - Custom CSS selector to target specific elements (defaults to body)
 *   - Lazy-loads fonts as you scroll for performance
 *   - Click any font to preview it on your site
 *   - Reset button to restore original fonts
 *   - Nothing persists - refresh to reset
 *
 * License: MIT
 */

(function() {
  'use strict';

  // Popular Google Fonts with categories
  const fonts = [
    // Sans-serif
    { family: 'Inter', category: 'sans-serif' },
    { family: 'Roboto', category: 'sans-serif' },
    { family: 'Open Sans', category: 'sans-serif' },
    { family: 'Lato', category: 'sans-serif' },
    { family: 'Montserrat', category: 'sans-serif' },
    { family: 'Poppins', category: 'sans-serif' },
    { family: 'Source Sans 3', category: 'sans-serif' },
    { family: 'Nunito', category: 'sans-serif' },
    { family: 'Raleway', category: 'sans-serif' },
    { family: 'Ubuntu', category: 'sans-serif' },
    { family: 'Rubik', category: 'sans-serif' },
    { family: 'Work Sans', category: 'sans-serif' },
    { family: 'Nunito Sans', category: 'sans-serif' },
    { family: 'Fira Sans', category: 'sans-serif' },
    { family: 'Quicksand', category: 'sans-serif' },
    { family: 'Mulish', category: 'sans-serif' },
    { family: 'Barlow', category: 'sans-serif' },
    { family: 'Karla', category: 'sans-serif' },
    { family: 'Manrope', category: 'sans-serif' },
    { family: 'Outfit', category: 'sans-serif' },
    { family: 'Plus Jakarta Sans', category: 'sans-serif' },
    { family: 'DM Sans', category: 'sans-serif' },
    { family: 'Space Grotesk', category: 'sans-serif' },
    { family: 'Sora', category: 'sans-serif' },
    { family: 'Figtree', category: 'sans-serif' },
    { family: 'Albert Sans', category: 'sans-serif' },
    { family: 'Geist', category: 'sans-serif' },
    // Serif
    { family: 'Playfair Display', category: 'serif' },
    { family: 'Merriweather', category: 'serif' },
    { family: 'Lora', category: 'serif' },
    { family: 'PT Serif', category: 'serif' },
    { family: 'Source Serif 4', category: 'serif' },
    { family: 'Libre Baskerville', category: 'serif' },
    { family: 'EB Garamond', category: 'serif' },
    { family: 'Cormorant Garamond', category: 'serif' },
    { family: 'Crimson Text', category: 'serif' },
    { family: 'Bitter', category: 'serif' },
    { family: 'Frank Ruhl Libre', category: 'serif' },
    { family: 'Spectral', category: 'serif' },
    { family: 'Vollkorn', category: 'serif' },
    { family: 'Fraunces', category: 'serif' },
    { family: 'Newsreader', category: 'serif' },
    { family: 'Instrument Serif', category: 'serif' },
    // Display
    { family: 'Oswald', category: 'display' },
    { family: 'Anton', category: 'display' },
    { family: 'Bebas Neue', category: 'display' },
    { family: 'Archivo Black', category: 'display' },
    { family: 'Righteous', category: 'display' },
    { family: 'Alfa Slab One', category: 'display' },
    { family: 'Lilita One', category: 'display' },
    { family: 'Staatliches', category: 'display' },
    { family: 'Bungee', category: 'display' },
    { family: 'Big Shoulders Display', category: 'display' },
    { family: 'Fredoka', category: 'display' },
    { family: 'Titan One', category: 'display' },
    // Handwriting
    { family: 'Dancing Script', category: 'handwriting' },
    { family: 'Pacifico', category: 'handwriting' },
    { family: 'Caveat', category: 'handwriting' },
    { family: 'Satisfy', category: 'handwriting' },
    { family: 'Great Vibes', category: 'handwriting' },
    { family: 'Lobster', category: 'handwriting' },
    { family: 'Sacramento', category: 'handwriting' },
    { family: 'Kalam', category: 'handwriting' },
    { family: 'Indie Flower', category: 'handwriting' },
    { family: 'Shadows Into Light', category: 'handwriting' },
    { family: 'Permanent Marker', category: 'handwriting' },
    { family: 'Amatic SC', category: 'handwriting' },
    // Monospace
    { family: 'Fira Code', category: 'monospace' },
    { family: 'JetBrains Mono', category: 'monospace' },
    { family: 'Source Code Pro', category: 'monospace' },
    { family: 'Roboto Mono', category: 'monospace' },
    { family: 'IBM Plex Mono', category: 'monospace' },
    { family: 'Space Mono', category: 'monospace' },
    { family: 'DM Mono', category: 'monospace' },
    { family: 'Inconsolata', category: 'monospace' },
    { family: 'Ubuntu Mono', category: 'monospace' },
    { family: 'Cousine', category: 'monospace' },
  ];

  let currentCategory = 'all';
  let loadedFonts = new Set();
  let originalFonts = new Map(); // stores original fonts for targeted elements

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #gft-picker {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
    }
    #gft-toggle {
      background: #1a1a1a;
      color: #fff;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    #gft-toggle:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.4);
    }
    #gft-panel {
      display: none;
      position: absolute;
      bottom: 50px;
      right: 0;
      width: 320px;
      max-height: 450px;
      background: #1a1a1a;
      color: #e5e5e5;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      overflow: hidden;
      flex-direction: column;
    }
    #gft-panel.open { display: flex; }
    #gft-header {
      padding: 16px;
      border-bottom: 1px solid #333;
    }
    #gft-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    #gft-title {
      font-weight: 600;
      font-size: 15px;
    }
    #gft-reset {
      background: #333;
      color: #999;
      border: none;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.15s, color 0.15s;
    }
    #gft-reset:hover {
      background: #444;
      color: #fff;
    }
    #gft-search {
      width: 100%;
      padding: 10px 12px;
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #fff;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
    }
    #gft-search:focus {
      border-color: #0057ff;
    }
    #gft-selector {
      width: 100%;
      padding: 8px 12px;
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #fff;
      font-size: 12px;
      font-family: monospace;
      box-sizing: border-box;
      outline: none;
      margin-top: 8px;
    }
    #gft-selector:focus {
      border-color: #0057ff;
    }
    #gft-selector::placeholder {
      color: #666;
    }
    #gft-categories {
      display: flex;
      gap: 6px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .gft-cat {
      background: #2a2a2a;
      color: #999;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.15s;
    }
    .gft-cat:hover {
      background: #333;
      color: #fff;
    }
    .gft-cat.active {
      background: #0057ff;
      color: #fff;
    }
    #gft-list {
      flex: 1;
      overflow-y: auto;
      max-height: 280px;
    }
    #gft-list::-webkit-scrollbar { width: 8px; }
    #gft-list::-webkit-scrollbar-track { background: #1a1a1a; }
    #gft-list::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
    .gft-item {
      padding: 10px 16px;
      cursor: pointer;
      border-bottom: 1px solid #2a2a2a;
      transition: background 0.15s;
    }
    .gft-item:hover { background: #2a2a2a; }
    .gft-item-name {
      font-size: 14px;
      margin-bottom: 2px;
      color: #888;
    }
    .gft-item-preview {
      font-size: 18px;
      color: #fff;
    }
    #gft-current {
      padding: 12px 16px;
      background: #222;
      border-top: 1px solid #333;
      font-size: 12px;
      color: #888;
    }
  `;
  document.head.appendChild(style);

  // Create widget HTML
  const widget = document.createElement('div');
  widget.id = 'gft-picker';
  widget.innerHTML = `
    <button id="gft-toggle">Aa</button>
    <div id="gft-panel">
      <div id="gft-header">
        <div id="gft-title-row">
          <span id="gft-title">Font Preview</span>
          <button id="gft-reset">Reset</button>
        </div>
        <input id="gft-search" type="text" placeholder="Search fonts...">
        <input id="gft-selector" type="text" placeholder="body">
        <div id="gft-categories">
          <button class="gft-cat active" data-category="all">All</button>
          <button class="gft-cat" data-category="sans-serif">Sans</button>
          <button class="gft-cat" data-category="serif">Serif</button>
          <button class="gft-cat" data-category="display">Display</button>
          <button class="gft-cat" data-category="handwriting">Script</button>
          <button class="gft-cat" data-category="monospace">Mono</button>
        </div>
      </div>
      <div id="gft-list"></div>
      <div id="gft-current">Current: Default</div>
    </div>
  `;

  // Wait for DOM
  function init() {
    document.body.appendChild(widget);

    const toggle = document.getElementById('gft-toggle');
    const panel = document.getElementById('gft-panel');
    const search = document.getElementById('gft-search');
    const selector = document.getElementById('gft-selector');
    const list = document.getElementById('gft-list');
    const current = document.getElementById('gft-current');
    const resetBtn = document.getElementById('gft-reset');
    const categories = document.querySelectorAll('.gft-cat');

    // Get current selector target (defaults to body)
    function getSelector() {
      return selector.value.trim() || 'body';
    }

    // Store original font for display
    const defaultFont = getComputedStyle(document.body).fontFamily.split(',')[0].replace(/['"]/g, '');
    current.textContent = `Current: ${defaultFont}`;

    // Toggle panel
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        renderFonts();
        search.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target)) {
        panel.classList.remove('open');
      }
    });

    // Render font list
    function renderFonts() {
      const query = search.value.toLowerCase();
      const filtered = fonts.filter(font => {
        const matchesSearch = font.family.toLowerCase().includes(query);
        const matchesCategory = currentCategory === 'all' || font.category === currentCategory;
        return matchesSearch && matchesCategory;
      });

      if (filtered.length === 0) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No fonts found</div>';
        return;
      }

      list.innerHTML = filtered.map(font => `
        <div class="gft-item" data-font="${font.family}">
          <div class="gft-item-name">${font.family}</div>
          <div class="gft-item-preview">The quick brown fox</div>
        </div>
      `).join('');

      // Lazy load font previews
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fontName = entry.target.dataset.font;
            loadFont(fontName);
            entry.target.querySelector('.gft-item-preview').style.fontFamily = `"${fontName}", sans-serif`;
            observer.unobserve(entry.target);
          }
        });
      }, { root: list, threshold: 0 });

      list.querySelectorAll('.gft-item').forEach(item => {
        observer.observe(item);
        item.addEventListener('click', () => applyFont(item.dataset.font));
      });
    }

    // Load a font from Google
    function loadFont(fontName) {
      if (loadedFonts.has(fontName)) return;
      loadedFonts.add(fontName);
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Apply font to elements matching selector
    function applyFont(fontName) {
      loadFont(fontName);
      const sel = getSelector();
      try {
        const elements = document.querySelectorAll(sel);
        elements.forEach(el => {
          // Store original font if not already stored
          if (!originalFonts.has(el)) {
            originalFonts.set(el, el.style.fontFamily);
          }
          el.style.fontFamily = `"${fontName}", sans-serif`;
        });
        current.textContent = `Current: ${fontName}`;
      } catch (e) {
        current.textContent = 'Invalid selector';
      }
    }

    // Reset to original
    resetBtn.addEventListener('click', () => {
      originalFonts.forEach((originalValue, el) => {
        el.style.fontFamily = originalValue;
      });
      originalFonts.clear();
      current.textContent = `Current: ${defaultFont}`;
    });

    // Search input
    search.addEventListener('input', renderFonts);

    // Category filter
    categories.forEach(btn => {
      btn.addEventListener('click', () => {
        categories.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderFonts();
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
