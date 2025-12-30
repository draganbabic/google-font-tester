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
 *   - Font weight selector (300-900)
 *   - Font size input (supports any CSS unit, defaults to px)
 *   - Line height slider
 *   - Force !important option to override existing styles
 *   - Live preview updates as you adjust settings
 *   - Lazy-loads fonts as you scroll for performance
 *   - Click any font to preview it on your site
 *   - Reset button to restore original styles
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
  let currentFont = null; // tracks currently applied font for live updates
  let fontObserver = null; // tracks IntersectionObserver for cleanup

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
    #gft-panel {
      display: flex;
      flex-direction: column;
      width: 44px;
      height: 40px;
      background: #1a1a1a;
      color: #e5e5e5;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      overflow: hidden;
      cursor: pointer;
      transition: width 0.2s ease, height 0.2s ease, border-radius 0.2s ease, box-shadow 0.2s ease;
    }
    #gft-panel:hover:not(.open) {
      box-shadow: 0 6px 16px rgba(0,0,0,0.4);
    }
    #gft-panel.open {
      width: 320px;
      height: calc(100vh - 40px);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      cursor: default;
    }
    #gft-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      font-size: 14px;
      font-weight: 500;
      flex-shrink: 0;
      transition: opacity 0.2s ease;
    }
    #gft-panel.open #gft-trigger {
      display: none;
    }
    #gft-content {
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease 0.1s;
    }
    #gft-panel.open #gft-content {
      opacity: 1;
      pointer-events: auto;
    }
    #gft-close {
      background: #333;
      border: none;
      color: #999;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      width: 24px;
      height: 24px;
      padding: 0;
      margin-left: 6px;
      line-height: 24px;
      text-align: center;
      border-radius: 4px;
      transition: background 0.15s, color 0.15s;
    }
    #gft-close:hover {
      background: #444;
      color: #fff;
    }
    #gft-header {
      padding: 12px;
      border-bottom: 1px solid #333;
      flex-shrink: 0;
    }
    #gft-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    #gft-title-actions {
      display: flex;
      align-items: center;
    }
    #gft-title {
      font-weight: 600;
      font-size: 15px;
    }
    #gft-reset {
      background: #333;
      color: #999;
      border: none;
      height: 24px;
      padding: 0 10px;
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
      padding: 8px 10px;
      margin-top: 8px;
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
    #gft-controls {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #333;
    }
    .gft-control-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #gft-weight {
      flex: 1;
      padding: 6px 8px;
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      cursor: pointer;
      outline: none;
    }
    #gft-weight:focus {
      border-color: #0057ff;
    }
    #gft-size {
      width: 70px;
      padding: 6px 8px;
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      font-family: monospace;
      outline: none;
    }
    #gft-size:focus {
      border-color: #0057ff;
    }
    #gft-size::placeholder {
      color: #666;
    }
    .gft-control-row label {
      font-size: 12px;
      color: #888;
      white-space: nowrap;
    }
    #gft-line-height {
      flex: 1;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      background: #333;
      border-radius: 2px;
      outline: none;
    }
    #gft-line-height::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      background: #0057ff;
      border-radius: 50%;
      cursor: pointer;
    }
    #gft-line-height::-moz-range-thumb {
      width: 14px;
      height: 14px;
      background: #0057ff;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
    #gft-lh-value {
      font-size: 11px;
      color: #888;
      font-family: monospace;
      min-width: 28px;
      text-align: right;
    }
    .gft-important-row {
      justify-content: flex-start;
    }
    .gft-important-row label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    #gft-important {
      width: 14px;
      height: 14px;
      accent-color: #0057ff;
      cursor: pointer;
    }
    .gft-divider {
      height: 1px;
      background: #333;
      margin: 8px 0;
    }
    #gft-categories {
      display: flex;
      gap: 4px;
      flex-wrap: nowrap;
    }
    .gft-cat {
      background: #2a2a2a;
      color: #999;
      border: none;
      padding: 5px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
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
      min-height: 0;
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
    .gft-item.selected {
      background: #0057ff22;
      border-left: 3px solid #0057ff;
      padding-left: 13px;
    }
    .gft-item.selected:hover { background: #0057ff33; }
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
      padding: 10px 12px;
      background: #222;
      border-top: 1px solid #333;
      font-size: 12px;
      color: #888;
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);

  // Create widget HTML
  const widget = document.createElement('div');
  widget.id = 'gft-picker';
  widget.innerHTML = `
    <div id="gft-panel">
      <div id="gft-trigger">Aa</div>
      <div id="gft-content">
        <div id="gft-header">
          <div id="gft-title-row">
            <span id="gft-title">Font Preview</span>
            <div id="gft-title-actions">
              <button id="gft-reset">Reset</button>
              <button id="gft-close" title="Minimize panel">&#8211;</button>
            </div>
          </div>
        <input id="gft-selector" type="text" placeholder="body">
        <div id="gft-controls">
          <div class="gft-control-row">
            <select id="gft-weight">
              <option value="300">300 Light</option>
              <option value="400" selected>400 Regular</option>
              <option value="500">500 Medium</option>
              <option value="600">600 Semi-Bold</option>
              <option value="700">700 Bold</option>
              <option value="800">800 Extra-Bold</option>
              <option value="900">900 Black</option>
            </select>
            <input id="gft-size" type="text" placeholder="Size">
          </div>
          <div class="gft-control-row">
            <label>Line Height</label>
            <input id="gft-line-height" type="range" min="-0.5" max="5" step="0.1" value="1.5">
            <span id="gft-lh-value">1.5</span>
          </div>
          <div class="gft-control-row gft-important-row">
            <label><input id="gft-important" type="checkbox"> Force !important</label>
          </div>
        </div>
        <div class="gft-divider"></div>
        <div id="gft-categories">
          <button class="gft-cat active" data-category="all">All</button>
          <button class="gft-cat" data-category="sans-serif">Sans</button>
          <button class="gft-cat" data-category="serif">Serif</button>
          <button class="gft-cat" data-category="display">Display</button>
          <button class="gft-cat" data-category="handwriting">Script</button>
          <button class="gft-cat" data-category="monospace">Mono</button>
        </div>
        <input id="gft-search" type="text" placeholder="Search fonts...">
        </div>
        <div id="gft-list"></div>
        <div id="gft-current">Current: Default</div>
      </div>
    </div>
  `;

  // Wait for DOM
  function init() {
    document.body.appendChild(widget);

    const panel = document.getElementById('gft-panel');
    const trigger = document.getElementById('gft-trigger');
    const closeBtn = document.getElementById('gft-close');
    const search = document.getElementById('gft-search');
    const selector = document.getElementById('gft-selector');
    const weightSelect = document.getElementById('gft-weight');
    const sizeField = document.getElementById('gft-size');
    const lineHeightSlider = document.getElementById('gft-line-height');
    const lineHeightValue = document.getElementById('gft-lh-value');
    const importantCheckbox = document.getElementById('gft-important');
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

    // Open panel when clicking trigger or collapsed panel
    panel.addEventListener('click', (e) => {
      if (!panel.classList.contains('open')) {
        e.stopPropagation();
        panel.classList.add('open');
        renderFonts();
        setTimeout(() => search.focus(), 200);
      }
    });

    // Close panel
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.remove('open');
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
        <div class="gft-item${currentFont === font.family ? ' selected' : ''}" data-font="${font.family}">
          <div class="gft-item-name">${font.family}</div>
          <div class="gft-item-preview">The quick brown fox</div>
        </div>
      `).join('');

      // Clean up previous observer to prevent memory leak
      if (fontObserver) {
        fontObserver.disconnect();
      }

      // Lazy load font previews
      fontObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fontName = entry.target.dataset.font;
            loadFont(fontName);
            entry.target.querySelector('.gft-item-preview').style.fontFamily = `"${fontName}", sans-serif`;
            fontObserver.unobserve(entry.target);
          }
        });
      }, { root: list, threshold: 0 });

      list.querySelectorAll('.gft-item').forEach(item => {
        fontObserver.observe(item);
      });
    }

    // Load a font from Google
    function loadFont(fontName) {
      if (loadedFonts.has(fontName)) return;
      loadedFonts.add(fontName);
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;800;900&display=swap`;
      link.rel = 'stylesheet';
      link.onerror = () => {
        loadedFonts.delete(fontName);
        console.warn(`Google Font Tester: Failed to load "${fontName}". Google Fonts may be blocked on this network.`);
      };
      document.head.appendChild(link);
    }

    // Apply font to elements matching selector
    function applyFont(fontName) {
      if (!fontName) return;
      loadFont(fontName);
      currentFont = fontName;

      const sel = getSelector();
      const weight = weightSelect.value;
      const sizeInput = sizeField.value.trim();
      const lineHeight = lineHeightSlider.value;
      const useImportant = importantCheckbox.checked;

      // Parse size: add px if it's just a number
      const size = sizeInput ? (/^\d+(\.\d+)?$/.test(sizeInput) ? sizeInput + 'px' : sizeInput) : null;
      const priority = useImportant ? 'important' : '';

      try {
        const elements = document.querySelectorAll(sel);
        elements.forEach(el => {
          // Store original styles if not already stored
          if (!originalFonts.has(el)) {
            originalFonts.set(el, {
              fontFamily: el.style.fontFamily,
              fontWeight: el.style.fontWeight,
              fontSize: el.style.fontSize,
              lineHeight: el.style.lineHeight
            });
          }
          el.style.setProperty('font-family', `"${fontName}", sans-serif`, priority);
          el.style.setProperty('font-weight', weight, priority);
          if (size) el.style.setProperty('font-size', size, priority);
          el.style.setProperty('line-height', lineHeight, priority);
        });
        current.textContent = `Current: ${fontName}`;
      } catch (e) {
        current.textContent = 'Invalid selector';
      }
    }

    // Reset to original
    resetBtn.addEventListener('click', () => {
      originalFonts.forEach((original, el) => {
        el.style.fontFamily = original.fontFamily;
        el.style.fontWeight = original.fontWeight;
        el.style.fontSize = original.fontSize;
        el.style.lineHeight = original.lineHeight;
      });
      originalFonts.clear();
      currentFont = null;
      list.querySelectorAll('.gft-item.selected').forEach(el => el.classList.remove('selected'));
      current.textContent = `Current: ${defaultFont}`;
    });

    // Event delegation for font list clicks (single listener instead of one per item)
    list.addEventListener('click', (e) => {
      const item = e.target.closest('.gft-item');
      if (!item) return;
      list.querySelectorAll('.gft-item.selected').forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');
      applyFont(item.dataset.font);
    });

    // Search input
    search.addEventListener('input', renderFonts);

    // Live update controls
    lineHeightSlider.addEventListener('input', () => {
      lineHeightValue.textContent = lineHeightSlider.value;
      applyFont(currentFont);
    });

    weightSelect.addEventListener('change', () => applyFont(currentFont));
    sizeField.addEventListener('input', () => applyFont(currentFont));
    importantCheckbox.addEventListener('change', () => applyFont(currentFont));

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
