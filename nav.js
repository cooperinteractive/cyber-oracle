/* ============================================================
   Unified prev/next navigation across all pages.
   Drop this script into any page with: <script src="nav.js"></script>
   It auto-detects the current page from window.location and
   injects a nav strip at the top of <body>.
   ============================================================ */
(function () {
  var pages = [
    { file: 'index.html',            title: 'Cyber 8-Ball',     short: '8-Ball' },
    { file: 'quantum.html',          title: 'Quantum Oracle',   short: 'Oracle' },
    { file: 'superposition.html',    title: 'Superposition',    short: 'Superpos.' },
    { file: 'entanglement.html',     title: 'Entanglement',     short: 'Entangle' },
    { file: 'quantum-tunneling.html',title: 'Quantum Tunneling',short: 'Tunneling' },
    { file: 'schrodingers-cat.html', title: "Schrodinger's Cat",short: 'Cat' },
    { file: 'games.html',            title: 'Cyber Games',      short: 'Games' }
  ];

  // Figure out which page we are on. Treat "/" or empty path as index.html.
  var path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === '') path = 'index.html';
  var idx = pages.findIndex(function (p) { return p.file === path; });
  if (idx === -1) idx = 0;

  var prev = pages[(idx - 1 + pages.length) % pages.length];
  var next = pages[(idx + 1) % pages.length];
  var current = pages[idx];

  // Inject CSS once
  var style = document.createElement('style');
  style.textContent = [
    '.cn-nav{',
      'position:relative;z-index:50;',
      'display:flex;align-items:center;justify-content:space-between;gap:8px;',
      'max-width:600px;margin:0 auto 16px;padding:8px 12px;',
      'background:rgba(0,10,30,0.7);',
      'border:1px solid rgba(0,255,255,0.25);',
      'border-radius:30px;',
      'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);',
      'font-family:"Courier New",monospace;font-size:0.7rem;',
      'letter-spacing:1.5px;text-transform:uppercase;',
      'box-shadow:0 4px 20px rgba(0,255,255,0.08);',
    '}',
    '.cn-nav a{',
      'display:flex;align-items:center;gap:6px;',
      'color:#00ffff;text-decoration:none;padding:6px 10px;',
      'border-radius:20px;transition:all 0.2s;',
      'min-width:0;flex:0 1 auto;',
      'text-shadow:0 0 8px rgba(0,255,255,0.4);',
    '}',
    '.cn-nav a:hover,.cn-nav a:focus-visible{',
      'background:rgba(0,255,255,0.12);color:#fff;outline:none;',
    '}',
    '.cn-nav a:focus-visible{box-shadow:0 0 0 2px rgba(0,255,255,0.6);}',
    '.cn-nav .cn-arrow{font-size:1rem;line-height:1;color:#ff00cc;text-shadow:0 0 8px rgba(255,0,200,0.6);}',
    '.cn-nav .cn-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.cn-nav .cn-pos{',
      'flex:0 0 auto;color:#c8d8ff;font-weight:bold;',
      'padding:0 8px;letter-spacing:2px;',
      'border-left:1px solid rgba(0,255,255,0.2);',
      'border-right:1px solid rgba(0,255,255,0.2);',
    '}',
    '.cn-nav .cn-current{',
      'display:none;color:#fff;font-weight:600;text-align:center;',
      'flex:1;letter-spacing:2px;',
    '}',
    '@media (max-width:520px){',
      '.cn-nav{font-size:0.62rem;padding:6px 8px;gap:4px;}',
      '.cn-nav a{padding:5px 8px;gap:4px;}',
      '.cn-nav .cn-label{display:none;}',
      '.cn-nav .cn-current{display:block;font-size:0.62rem;}',
      '.cn-nav .cn-pos{padding:0 4px;font-size:0.6rem;}',
    '}'
  ].join('');
  document.head.appendChild(style);

  // Build nav element
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var nav = document.createElement('nav');
    nav.className = 'cn-nav';
    nav.setAttribute('aria-label', 'Page navigation');
    nav.innerHTML = [
      '<a href="', prev.file, '" rel="prev" aria-label="Previous: ', prev.title, '">',
        '<span class="cn-arrow" aria-hidden="true">&#8592;</span>',
        '<span class="cn-label">', prev.title, '</span>',
      '</a>',
      '<span class="cn-current">', current.short, '</span>',
      '<span class="cn-pos" aria-label="Page ', (idx + 1), ' of ', pages.length, '">',
        (idx + 1), ' / ', pages.length,
      '</span>',
      '<a href="', next.file, '" rel="next" aria-label="Next: ', next.title, '">',
        '<span class="cn-label">', next.title, '</span>',
        '<span class="cn-arrow" aria-hidden="true">&#8594;</span>',
      '</a>'
    ].join('');
    document.body.insertBefore(nav, document.body.firstChild);

    // Keyboard shortcuts: left/right arrow with Alt key
    document.addEventListener('keydown', function (e) {
      if (!e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return;
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') { window.location.href = prev.file; }
      else if (e.key === 'ArrowRight') { window.location.href = next.file; }
    });
  });
})();
