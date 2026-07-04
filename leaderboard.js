/* ============================================================
   Caught in the Net: shared local leaderboard.
   Offline, localStorage-backed. Per-game top-8 board with a
   touch-friendly arcade initials entry.

   Drop into any page with:  <script src="leaderboard.js"></script>
   Then at game over call:
     CyberLeaderboard.record({
       game: 'trawler', title: 'Packet Trawler',
       score: 1240, unit: 'pts', onDone: function () { ... }
     });

   record() shows the initials entry only when the score earns a
   spot on the board, then shows the board, then calls onDone.
   If the score does not qualify it calls onDone right away.
   ============================================================ */
(function () {
  'use strict';

  var CAP = 8;
  var PREFIX = 'citn-lb-';

  /* literal palette so the widget looks identical on every page */
  var C = {
    scrim: 'rgba(2, 15, 22, 0.94)',
    panel: '#0B3348',
    panelDeep: '#082838',
    line: 'rgba(244, 235, 217, 0.16)',
    cream: '#F4EBD9',
    creamDim: '#C9BFA8',
    lure: '#FF7A45',
    bobber: '#E8564A',
    biolume: '#53DFE8',
    kelp: '#4FC98C',
    brass: '#F5C15C'
  };
  var DISPLAY = "'Futura', 'Avenir Next Condensed', 'Avenir Next', 'Trebuchet MS', sans-serif";
  var MONO = "'Menlo', 'SF Mono', ui-monospace, 'Courier New', monospace";
  var BODY = "'Avenir Next', 'Avenir', 'Gill Sans', 'Trebuchet MS', system-ui, sans-serif";

  function reduced() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function sfx(name, arg) {
    try { var S = window.CyberSounds; if (S && typeof S[name] === 'function') S[name](arg); } catch (e) {}
  }
  function fmt(n) { try { return Math.round(n).toLocaleString(); } catch (e) { return String(Math.round(n)); } }

  /* ---------- storage ---------- */
  function key(game) { return PREFIX + game; }
  function load(game) {
    var arr = [];
    try {
      var raw = localStorage.getItem(key(game));
      arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) arr = [];
    } catch (e) { arr = []; }
    arr = arr
      .filter(function (e) { return e && typeof e.score === 'number' && isFinite(e.score); })
      .map(function (e) { return { ini: cleanIni(e.ini), score: Math.round(e.score) }; });
    arr.sort(function (a, b) { return b.score - a.score; });
    return arr.slice(0, CAP);
  }
  function store(game, list) {
    try { localStorage.setItem(key(game), JSON.stringify(list.slice(0, CAP))); } catch (e) {}
  }
  function cleanIni(s) {
    s = String(s == null ? '' : s).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
    while (s.length < 3) s += 'A';
    return s;
  }
  function qualifies(game, score) {
    if (!(score > 0)) return false;
    var list = load(game);
    if (list.length < CAP) return true;
    return score > list[list.length - 1].score;
  }
  function wouldRank(game, score) {
    var list = load(game), r = 1;
    for (var i = 0; i < list.length; i++) { if (score > list[i].score) break; r++; }
    return r;
  }
  function add(game, ini, score) {
    ini = cleanIni(ini);
    score = Math.round(score);
    var list = load(game);
    var entry = { ini: ini, score: score };
    list.push(entry);
    list.sort(function (a, b) { return b.score - a.score; });
    list = list.slice(0, CAP);
    store(game, list);
    return list.indexOf(entry);
  }

  /* ---------- styles (injected once) ---------- */
  var styled = false;
  function injectStyles() {
    if (styled) return;
    styled = true;
    var css = [
      '.clb-scrim{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;',
        'padding:18px;background:' + C.scrim + ';backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);',
        'font-family:' + BODY + ';color:' + C.cream + ';-webkit-tap-highlight-color:transparent;',
        'opacity:0;transition:opacity .18s ease;overflow-y:auto;}',
      '.clb-scrim.clb-in{opacity:1;}',
      '.clb-card{width:min(560px,100%);background:linear-gradient(180deg,' + C.panel + ',' + C.panelDeep + ');',
        'border:2px solid ' + C.line + ';border-radius:18px;padding:22px 20px;',
        'box-shadow:0 24px 70px rgba(2,15,22,.6);text-align:center;}',
      '.clb-kicker{font-family:' + DISPLAY + ';font-weight:700;text-transform:uppercase;letter-spacing:.24em;',
        'font-size:.72rem;color:' + C.brass + ';margin-bottom:8px;}',
      '.clb-kicker.clb-leader{color:' + C.brass + ';font-size:1.05rem;letter-spacing:.18em;}',
      '.clb-scoreline{font-family:' + MONO + ';color:' + C.creamDim + ';font-size:.82rem;letter-spacing:.04em;margin-bottom:16px;}',
      '.clb-scoreline b{color:' + C.brass + ';}',
      '.clb-slots{display:flex;gap:12px;justify-content:center;margin:6px 0 14px;}',
      '.clb-slot{width:64px;height:80px;border:2px solid ' + C.line + ';border-radius:12px;background:' + C.panelDeep + ';',
        'display:flex;align-items:center;justify-content:center;font-family:' + DISPLAY + ';font-weight:700;',
        'font-size:2.6rem;color:' + C.cream + ';transition:border-color .12s,transform .12s;}',
      '.clb-slot.clb-active{border-color:' + C.lure + ';box-shadow:0 0 0 2px rgba(255,122,69,.25);}',
      '.clb-hint{color:' + C.creamDim + ';font-size:.8rem;margin-bottom:12px;}',
      '.clb-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;}',
      '.clb-key{min-height:52px;border:2px solid ' + C.line + ';border-radius:10px;background:rgba(8,40,56,.55);',
        'color:' + C.cream + ';font-family:' + DISPLAY + ';font-weight:700;font-size:1.05rem;cursor:pointer;',
        'display:flex;align-items:center;justify-content:center;touch-action:manipulation;user-select:none;',
        '-webkit-user-select:none;transition:transform .08s,background .12s;}',
      '.clb-key:active{transform:scale(.92);background:rgba(83,223,232,.18);}',
      '.clb-key.clb-wide{grid-column:span 2;}',
      '.clb-key.clb-ok{grid-column:span 3;border-color:' + C.lure + ';color:' + C.lure + ';background:rgba(255,122,69,.1);}',
      '.clb-key.clb-del{grid-column:span 2;color:' + C.bobber + ';border-color:rgba(232,86,74,.45);}',
      '.clb-title{font-family:' + DISPLAY + ';font-weight:700;text-transform:uppercase;letter-spacing:.12em;',
        'font-size:1.3rem;margin-bottom:14px;color:' + C.cream + ';}',
      '.clb-list{list-style:none;margin:0 0 16px;padding:0;text-align:left;}',
      '.clb-row{display:flex;align-items:center;gap:12px;padding:8px 12px;border-radius:9px;',
        'font-family:' + MONO + ';border:1px solid transparent;}',
      '.clb-row+.clb-row{margin-top:3px;}',
      '.clb-row .clb-rank{width:28px;color:' + C.creamDim + ';font-size:.9rem;text-align:right;}',
      '.clb-row .clb-ini{width:64px;font-family:' + DISPLAY + ';font-weight:700;font-size:1.15rem;letter-spacing:.14em;color:' + C.cream + ';}',
      '.clb-row .clb-sc{flex:1;text-align:right;color:' + C.brass + ';font-size:1.05rem;}',
      '.clb-row .clb-unit{color:' + C.creamDim + ';font-size:.72rem;margin-left:5px;}',
      '.clb-row.clb-me{background:rgba(255,122,69,.12);border-color:' + C.lure + ';}',
      '.clb-row.clb-top .clb-rank{color:' + C.brass + ';}',
      '.clb-row.clb-empty{color:rgba(244,235,217,.28);}',
      '.clb-row.clb-empty .clb-ini,.clb-row.clb-empty .clb-sc{color:rgba(244,235,217,.28);}',
      '.clb-continue{min-height:60px;padding:0 44px;border:2px solid ' + C.lure + ';border-radius:14px;',
        'background:rgba(255,122,69,.1);color:' + C.lure + ';font-family:' + DISPLAY + ';font-weight:700;',
        'font-size:1.05rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;touch-action:manipulation;}',
      '.clb-continue:active{transform:scale(.97);background:rgba(255,122,69,.24);}',
      '.clb-key:focus-visible,.clb-continue:focus-visible{outline:3px solid ' + C.biolume + ';outline-offset:3px;}',
      '@media (prefers-reduced-motion:no-preference){',
        '.clb-slot.clb-active{animation:clb-pulse 1s ease-in-out infinite;}',
        '@keyframes clb-pulse{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}',
        '.clb-row.clb-me{animation:clb-flash 1.1s ease-in-out infinite;}',
        '@keyframes clb-flash{0%,100%{background:rgba(255,122,69,.10);}50%{background:rgba(255,122,69,.24);}}}',
      '@media (max-width:420px){.clb-slot{width:54px;height:68px;font-size:2.1rem;}.clb-key{min-height:46px;font-size:.95rem;}}'
    ].join('');
    var s = document.createElement('style');
    s.setAttribute('data-clb', '');
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- overlay lifecycle ---------- */
  var scrim = null, card = null, keyHandler = null, lastFocus = null;

  function openScrim() {
    injectStyles();
    lastFocus = document.activeElement;
    scrim = document.createElement('div');
    scrim.className = 'clb-scrim';
    scrim.setAttribute('role', 'dialog');
    scrim.setAttribute('aria-modal', 'true');
    scrim.setAttribute('aria-label', 'Leaderboard');
    card = document.createElement('div');
    card.className = 'clb-card';
    scrim.appendChild(card);
    document.body.appendChild(scrim);
    requestAnimationFrame(function () { scrim.classList.add('clb-in'); });
  }
  function closeScrim(done) {
    if (keyHandler) { window.removeEventListener('keydown', keyHandler, true); keyHandler = null; }
    if (!scrim) { if (done) done(); return; }
    var node = scrim; scrim = null; card = null;
    node.classList.remove('clb-in');
    setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
      try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (e) {}
      if (done) done();
    }, reduced() ? 0 : 180);
  }

  /* ---------- initials entry view ---------- */
  function renderEntry(game, title, unit, score, onConfirm) {
    var rank = wouldRank(game, score);
    var slots = ['A', 'A', 'A'];
    var cur = 0;

    card.innerHTML = '';
    var kicker = document.createElement('div');
    kicker.className = 'clb-kicker' + (rank === 1 ? ' clb-leader' : '');
    kicker.textContent = rank === 1 ? 'NEW LEADER' : 'YOU MADE THE BOARD';
    card.appendChild(kicker);

    var line = document.createElement('div');
    line.className = 'clb-scoreline';
    line.innerHTML = title.toUpperCase() + ' &middot; <b>' + fmt(score) + '</b> ' + unit + ' &middot; RANK ' + rank;
    card.appendChild(line);

    var slotWrap = document.createElement('div');
    slotWrap.className = 'clb-slots';
    var slotEls = [];
    for (var i = 0; i < 3; i++) {
      var sd = document.createElement('div');
      sd.className = 'clb-slot';
      slotWrap.appendChild(sd);
      slotEls.push(sd);
    }
    card.appendChild(slotWrap);

    var hint = document.createElement('div');
    hint.className = 'clb-hint';
    hint.textContent = 'Tap letters to enter your initials';
    card.appendChild(hint);

    function renderSlots() {
      for (var i = 0; i < 3; i++) {
        slotEls[i].textContent = slots[i];
        slotEls[i].classList.toggle('clb-active', i === cur);
      }
    }
    function setLetter(ch) {
      slots[cur] = ch;
      if (cur < 2) cur++;
      renderSlots();
      sfx('click');
    }
    function back() {
      if (cur > 0) cur--;
      renderSlots();
      sfx('click');
    }
    function confirm() {
      sfx('place');
      onConfirm(slots.join(''));
    }

    var grid = document.createElement('div');
    grid.className = 'clb-grid';
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.forEach(function (ch) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'clb-key';
      b.textContent = ch;
      b.addEventListener('click', function () { setLetter(ch); });
      grid.appendChild(b);
    });
    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'clb-key clb-del';
    del.setAttribute('aria-label', 'Back');
    del.innerHTML = '&#9003;';
    del.addEventListener('click', back);
    grid.appendChild(del);
    var ok = document.createElement('button');
    ok.type = 'button';
    ok.className = 'clb-key clb-ok';
    ok.textContent = 'ENTER';
    ok.addEventListener('click', confirm);
    grid.appendChild(ok);
    card.appendChild(grid);

    renderSlots();

    keyHandler = function (e) {
      var k = e.key;
      if (/^[a-zA-Z]$/.test(k)) { e.preventDefault(); setLetter(k.toUpperCase()); }
      else if (k === 'Backspace') { e.preventDefault(); back(); }
      else if (k === 'Enter') { e.preventDefault(); confirm(); }
    };
    window.addEventListener('keydown', keyHandler, true);

    if (rank === 1) sfx('win');
    setTimeout(function () { try { letters.length; slotEls[0].scrollIntoView({ block: 'nearest' }); } catch (e) {} }, 10);
  }

  /* ---------- board view ---------- */
  function renderBoard(game, title, unit, meIndex, onClose) {
    if (keyHandler) { window.removeEventListener('keydown', keyHandler, true); keyHandler = null; }
    var list = load(game);
    card.innerHTML = '';

    var kicker = document.createElement('div');
    kicker.className = 'clb-kicker';
    kicker.textContent = 'Hall of Fame';
    card.appendChild(kicker);

    var t = document.createElement('div');
    t.className = 'clb-title';
    t.textContent = title;
    card.appendChild(t);

    var ol = document.createElement('ol');
    ol.className = 'clb-list';
    for (var i = 0; i < CAP; i++) {
      var row = document.createElement('li');
      row.className = 'clb-row' + (i < 3 ? ' clb-top' : '') + (i === meIndex ? ' clb-me' : '');
      var e = list[i];
      var rankEl = '<span class="clb-rank">' + (i + 1) + '</span>';
      if (e) {
        row.innerHTML = rankEl +
          '<span class="clb-ini">' + e.ini + '</span>' +
          '<span class="clb-sc">' + fmt(e.score) + '<span class="clb-unit">' + unit + '</span></span>';
      } else {
        row.className += ' clb-empty';
        row.innerHTML = rankEl + '<span class="clb-ini">' + '&middot;&middot;&middot;' + '</span><span class="clb-sc">&middot;</span>';
      }
      ol.appendChild(row);
    }
    card.appendChild(ol);

    var cont = document.createElement('button');
    cont.type = 'button';
    cont.className = 'clb-continue';
    cont.textContent = 'Continue';
    cont.addEventListener('click', function () { sfx('click'); closeScrim(onClose); });
    card.appendChild(cont);

    keyHandler = function (e) {
      if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); sfx('click'); closeScrim(onClose); }
    };
    window.addEventListener('keydown', keyHandler, true);
    setTimeout(function () { try { cont.focus(); } catch (e) {} }, 10);
  }

  /* ---------- public API ---------- */
  function record(opts) {
    opts = opts || {};
    var game = opts.game, title = opts.title || game, unit = opts.unit || 'pts';
    var score = Math.round(opts.score || 0);
    var onDone = typeof opts.onDone === 'function' ? opts.onDone : function () {};
    if (!game) { onDone(); return; }
    if (!qualifies(game, score)) { onDone(); return; }
    openScrim();
    renderEntry(game, title, unit, score, function (ini) {
      var idx = add(game, ini, score);
      renderBoard(game, title, unit, idx, onDone);
    });
  }
  function show(opts) {
    opts = opts || {};
    var game = opts.game, title = opts.title || game, unit = opts.unit || 'pts';
    var onDone = typeof opts.onDone === 'function' ? opts.onDone : function () {};
    if (!game) { onDone(); return; }
    openScrim();
    renderBoard(game, title, unit, -1, onDone);
  }

  window.CyberLeaderboard = {
    record: record,
    show: show,
    top: function (game, n) { return load(game).slice(0, n || CAP); },
    qualifies: qualifies,
    CAP: CAP
  };
})();
