/* ============================================================
   Cyber Games shared sound library.
   Pure Web Audio API. No external assets. Subtle arcade tones.
   Usage: <script src="sounds.js"></script> then call CyberSounds.whack() etc.
   ============================================================ */
(function () {
  let ctx = null;
  const muteKey = 'cyber-sound-muted';
  let muted = (typeof localStorage !== 'undefined' && localStorage.getItem(muteKey) === 'true');

  function getCtx() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(opts) {
    if (muted) return;
    const c = getCtx();
    if (!c) return;
    const {
      freq = 440, duration = 0.1, type = 'sine',
      volume = 0.12, attack = 0.005, freqEnd = null
    } = opts;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    const now = c.currentTime;
    osc.frequency.setValueAtTime(freq, now);
    if (freqEnd !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function noise(opts) {
    if (muted) return;
    const c = getCtx();
    if (!c) return;
    const { duration = 0.08, volume = 0.08, filterFreq = 1500, type = 'lowpass' } = opts;
    const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * duration)), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = filterFreq;
    const gain = c.createGain();
    const now = c.currentTime;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter).connect(gain).connect(c.destination);
    src.start(now);
    src.stop(now + duration + 0.02);
  }

  const Sounds = {
    pop: () => tone({ freq: 240, freqEnd: 520, duration: 0.07, type: 'square', volume: 0.05 }),
    whack: () => {
      noise({ duration: 0.06, volume: 0.1, filterFreq: 1800 });
      setTimeout(() => tone({ freq: 1100, freqEnd: 600, duration: 0.05, type: 'triangle', volume: 0.08 }), 10);
    },
    miss: () => tone({ freq: 220, freqEnd: 90, duration: 0.28, type: 'sawtooth', volume: 0.09 }),
    fail: () => tone({ freq: 220, freqEnd: 90, duration: 0.28, type: 'sawtooth', volume: 0.09 }),
    click: () => tone({ freq: 720, duration: 0.03, type: 'square', volume: 0.04 }),
    correct: () => {
      tone({ freq: 740, duration: 0.1, type: 'sine', volume: 0.08 });
      setTimeout(() => tone({ freq: 1110, duration: 0.14, type: 'sine', volume: 0.07 }), 70);
    },
    wrong: () => {
      tone({ freq: 320, duration: 0.1, type: 'square', volume: 0.07 });
      setTimeout(() => tone({ freq: 220, duration: 0.18, type: 'square', volume: 0.07 }), 90);
    },
    place: () => tone({ freq: 380, freqEnd: 540, duration: 0.08, type: 'triangle', volume: 0.06 }),
    caught: () => {
      tone({ freq: 660, duration: 0.07, type: 'square', volume: 0.06 });
      setTimeout(() => tone({ freq: 990, duration: 0.1, type: 'square', volume: 0.05 }), 50);
    },
    breach: () => {
      tone({ freq: 880, duration: 0.08, type: 'square', volume: 0.1 });
      setTimeout(() => tone({ freq: 660, duration: 0.12, type: 'square', volume: 0.09 }), 80);
    },
    combo: (lvl) => tone({ freq: 600 + Math.min(lvl, 6) * 90, duration: 0.05, type: 'square', volume: 0.04 }),
    tick: () => tone({ freq: 1200, duration: 0.015, type: 'square', volume: 0.025 }),
    timeWarn: () => tone({ freq: 880, duration: 0.06, type: 'square', volume: 0.06 }),
    alert: () => {
      tone({ freq: 880, duration: 0.1, type: 'square', volume: 0.07 });
      setTimeout(() => tone({ freq: 660, duration: 0.12, type: 'square', volume: 0.07 }), 110);
    },
    win: () => {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => setTimeout(() => tone({ freq: n, duration: 0.18, type: 'square', volume: 0.08 }), i * 110));
    },
    lose: () => {
      const notes = [400, 360, 320, 220];
      notes.forEach((n, i) => setTimeout(() => tone({ freq: n, duration: 0.24, type: 'sawtooth', volume: 0.09 }), i * 140));
    },
    levelUp: () => {
      const notes = [659, 880, 1175];
      notes.forEach((n, i) => setTimeout(() => tone({ freq: n, duration: 0.13, type: 'triangle', volume: 0.07 }), i * 80));
    },
    send: () => tone({ freq: 540, freqEnd: 720, duration: 0.06, type: 'sine', volume: 0.04 }),
    receive: () => tone({ freq: 480, freqEnd: 360, duration: 0.06, type: 'sine', volume: 0.04 }),
    crackTick: () => tone({ freq: 200 + Math.random() * 300, duration: 0.018, type: 'square', volume: 0.025 }),
    crackWin: () => {
      [440, 660, 880, 1320].forEach((n, i) => setTimeout(() => tone({ freq: n, duration: 0.16, type: 'sawtooth', volume: 0.08 }), i * 90));
    },
    setMuted(v) { muted = !!v; try { localStorage.setItem(muteKey, v ? 'true' : 'false'); } catch (e) {} },
    isMuted() { return muted; },
    toggle() { Sounds.setMuted(!muted); return muted; }
  };

  // Inject a fixed-position mute toggle into the top-right of every page that uses this lib
  function injectToggle() {
    if (document.getElementById('cyber-sound-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'cyber-sound-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle sound');
    btn.style.cssText = [
      'position:fixed', 'top:14px', 'right:14px', 'z-index:200',
      'width:38px', 'height:38px', 'border-radius:50%',
      'background:rgba(0,10,30,0.7)', 'color:#00ffff',
      'border:1px solid rgba(0,255,255,0.4)',
      'font-family:inherit', 'font-size:1rem', 'cursor:pointer',
      'backdrop-filter:blur(8px)', '-webkit-backdrop-filter:blur(8px)',
      'transition:all 0.2s', 'box-shadow:0 0 12px rgba(0,255,255,0.15)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'padding:0'
    ].join(';');
    function render() {
      btn.innerHTML = muted ? '&#128263;' : '&#128266;';
      btn.title = muted ? 'Sound off (click to enable)' : 'Sound on (click to mute)';
    }
    btn.addEventListener('click', () => {
      Sounds.toggle();
      render();
      if (!muted) Sounds.click();
    });
    btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(0,255,255,0.18)'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(0,10,30,0.7)'; });
    render();

    if (document.body) document.body.appendChild(btn);
    else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(btn));
  }

  injectToggle();

  window.CyberSounds = Sounds;
})();
