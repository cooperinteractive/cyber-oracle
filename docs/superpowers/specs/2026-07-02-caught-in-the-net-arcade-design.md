# Caught in the Net: Kiosk Arcade Design

Date: 2026-07-02. Status: approved for build (autonomous session; user request is the mandate).

## What we are building

A seven-game touch arcade for a Cybersecurity Awareness Month wall installation
("Caught in the Net", fishing theme). Runs on iPads, fully offline, kiosk mounted.
Ratio: 80% arcade fun, 20% security learning. Learning is delivered as one
"Catch of the Day" fact card on each game-over screen, never as a quiz gate.

Deliverables:

| File | Game | Status |
|---|---|---|
| `caught-in-the-net.html` | New table of contents / arcade hub | new |
| `reel-em-in.html` | Reel 'Em In (phishing fishing, hook-drop arcade) | new |
| `packet-trawler.html` | Packet Trawler (firewall catcher, drag the net) | new |
| `sonar-sweep.html` | Sonar Sweep (threat-hunt minesweeper) | new |
| `kraken-attack.html` | Kraken Attack (tap-defense waves, multi-touch) | new |
| `deep-dive-dash.html` | Deep Dive Dash (one-touch endless swimmer) | new |
| `password-slot.html` | Password Slot Machine (reinvented: lock-and-respin push-your-luck) | full rewrite |
| `connect-four.html` | Hook, Line & Sinker (reinvented Connect Four with power chips) | full rewrite |

`games.html`, `nav.js` and the rest of the catalog stay untouched. The hub
footer links to `games.html` as "the full archive". Kiosk pages are standalone
(no `nav.js`), matching the pattern the user already established in commit
2047ff0. Every game includes `<script src="sounds.js"></script>`.

## Aesthetic direction: "Bait Shop Deco"

NOT neon-cyber (that is the cheese we are replacing). Vintage tackle-shop meets
WPA national-park poster, underwater. Deep ink-teal water, warm cream
signpainting, lure-orange and bobber-red accents, one restrained bioluminescent
cyan reserved for interactive/glowing things. Chunky geometric display caps
(Futura renders natively on iPad, the actual target hardware). Rope and net as
recurring decorative motifs. Rounded "boardwalk sign" panels. Texture from
subtle net-grid overlays and drifting bubbles, not glow spam.

### Canonical tokens (copy verbatim into every page)

```css
:root {
  /* water */
  --abyss: #041B26;        /* page background base */
  --depth: #072A3C;        /* gradient partner */
  --panel: #0B3348;        /* sign boards / cards */
  --panel-deep: #082838;   /* inset wells */
  --line: rgba(244, 235, 217, 0.16);   /* rope hairlines */
  /* ink */
  --cream: #F4EBD9;        /* primary text */
  --cream-dim: #C9BFA8;    /* secondary text */
  /* accents */
  --lure: #FF7A45;         /* orange: primary action, player warmth */
  --bobber: #E8564A;       /* red: danger, phish, enemies */
  --biolume: #53DFE8;      /* cyan: glow, defense, friendly tech */
  --kelp: #4FC98C;         /* green: success, safe */
  --brass: #F5C15C;        /* gold: score, coins, trophies */
  /* type */
  --display: 'Futura', 'Avenir Next Condensed', 'Avenir Next', 'Trebuchet MS', sans-serif;
  --body: 'Avenir Next', 'Avenir', 'Gill Sans', 'Trebuchet MS', system-ui, sans-serif;
  --mono: 'Menlo', 'SF Mono', ui-monospace, 'Courier New', monospace;
}
```

Page background recipe: `linear-gradient(180deg, var(--depth) 0%, var(--abyss) 55%, #02141D 100%)`
plus a fixed, `aria-hidden` decor layer containing (a) a faint diagonal net-grid
(two crossed `repeating-linear-gradient`s of `--line` at ~0.35 opacity, ~72px
cells, rotated), (b) 8 to 14 slowly rising CSS bubble dots, (c) soft light rays
from the top (`linear-gradient` wedges at ~0.05 opacity). All decor animation
is inside `@media (prefers-reduced-motion: no-preference)`.

Signage: h1 in `--display`, uppercase, `letter-spacing: 0.12em`, weight 700,
cream, with a short rope rule under it (a 2px dashed `--line` line with a small
fish or anchor glyph centered). Subtitles in `--cream-dim`, small caps feel.

Buttons ("boardwalk chips"): min height 56px, `border: 2px solid var(--cream)`,
`border-radius: 14px`, transparent-to-dark fill, `--display` caps at ~0.9rem,
pressed state `transform: scale(0.96)` + fill brightens. Primary action uses
`--lure` border/fill. No hover-dependent affordances (hover may echo pressed
state). `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent`
everywhere interactive.

Score readouts: `--mono`, `--brass`, in small inset wells (`--panel-deep`,
1px `--line` border, radius 10px).

## Kiosk / iPad rules (every page)

- `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">`
- Zero network: no Google Fonts, no CDN, no images (CSS/SVG/emoji art only).
  Only local `sounds.js` script tag.
- Layout must work at 768x1024 and 1024x768 (fluid + clamp; game canvases
  resize with the window).
- Touch targets >= 56px. Whole-surface gestures preferred over small controls.
- `user-select: none` and `-webkit-user-select: none` on game surfaces;
  prevent default on touchstart in canvas games to stop scroll/bounce.
- Sessions are short (45 to 90 seconds) with an idle "attract" title state,
  a huge PLAY button, instant restart, and a localStorage high score
  (key prefix `citn-`, e.g. `citn-reel-best`).
- Keyboard fallback kept (Space/Enter/arrows where sensible) plus
  `prefers-reduced-motion` support and `role="status"` live regions for
  score/game-over, matching the repo's accessibility baseline.
- Every game has a fixed home chip top-left: `<a class="home-chip" href="caught-in-the-net.html">⌂ ARCADE</a>`
  (56px min, boardwalk chip style) and a "Catch of the Day" fact card on the
  game-over screen: one rotating security tip themed to that game.

## Per-game specs

### 1. Reel 'Em In (`reel-em-in.html`): canvas
Boat on the surface, hook on a line. Press-and-hold anywhere: hook drops.
Release: hook reels back up, catching the first fish it touches. Fish swim
horizontally at 4 depth lanes carrying short email-subject tags. Red-flagged
phish fish (e.g. "URGENT!! verify acct", "Free g1ft card", "CEO needs iTunes
cards") score +100 (deeper = more); legit fish ("Team standup 10am", "Invoice
#2231 from Acme") cost a bait (3 baits per round) and -50. 60-second round,
combo multiplier for consecutive phish. Speed and fish density ramp. Catch
banner shows WHY the catch was phish/legit (the 20%). Sounds: `caught`,
`wrong`, `combo`, `win`.

### 2. Packet Trawler (`packet-trawler.html`): canvas
You drag a trawl net (follows finger x, eased) above the harbor floor. Malware
mines (spiky, red) sink from the surface; clean packets (cyan envelope bubbles)
sink too. Catch malware in the net: +75. Let clean packets pass below into the
harbor: +25. Catching a clean packet = FALSE POSITIVE (-100, net flashes);
malware reaching the harbor = breach (lose 1 of 3 harbor lights). Waves speed
up; occasional gold "zero-day" worth 300. Teaches firewall filtering and false
positives. Sounds: `caught`, `breach`, `miss`, `win`.

### 3. Sonar Sweep (`sonar-sweep.html`): DOM grid
Threat-hunt minesweeper, 8x8 with 10 lurkers. Tap = ping a tile (reveals count
of adjacent lurkers as sonar ring styling; flood-fill zeros). Toggle chip
switches to BUOY mode to mark suspected lurkers (long-press also works). Ping
a lurker = hull breach, game over with board reveal. Clear all safe tiles to
win; score = time + wrong-buoy penalty. Numbers colored on a cyan-to-red ramp.
Teaches threat hunting: "quiet signals around a threat" fact card. Sounds:
`click` (ping), `place` (buoy), `breach`, `win`.

### 4. Kraken Attack (`kraken-attack.html`): canvas, multi-touch
The Catch Locker (server chest) sits center. Kraken tentacles + bot-fish swarm
inward from screen edges in waves. Tap them to zap (multi-touch: several
fingers at once, two-player-friendly). Blue crew divers occasionally drift in;
tapping crew = -200 and screen shake (insider false-alarm lesson). Locker has
5 HP; each enemy that reaches it deals 1. Survive waves, boss tentacle every
5th wave. Score + best wave. Teaches botnets/DDoS. Sounds: `whack`, `alert`,
`breach`, `levelUp`, `lose`.

### 5. Deep Dive Dash (`deep-dive-dash.html`): canvas
One-touch endless swimmer. You are a courier data-packet fish. Hold to dive,
release to float up (buoyancy). Dodge dangling phish hooks (from above) and
jellyfish botnets (drifting). Collect padlock pickups = encryption shield
(absorbs one hit, visible bubble around fish). Distance + pickups = score,
speed ramps forever. Teaches "encrypted in transit survives a snag". Sounds:
`pop` (pickup), `miss` (hit), `tick`, `lose`.

### 6. Password Slot Machine (`password-slot.html`): DOM reels, full rewrite
Push-your-luck slots, 5 rounds, bankroll of coins.
Round loop: PULL spins 6 reels (each lands one character). Between pulls, tap
reels to LOCK them. 3 pulls max, or CASH OUT early for a x1.5 multiplier after
pull 1 / x1.2 after pull 2. Char values: lowercase 10, UPPER 20, digit 30,
symbol 50; jackpot bonuses: 3+ symbols = x2 "JACKPOT", all four charsets
present = +250 "FULL NET". After locking, the CRACK-BOT (crab in a diving
helmet) runs an odometer: the password's real charset/length entropy converts
to a crack-time display ("cracked in 0.3s" vs "14 years") which pays out the
coins. Occasionally a TEMPTATION lever appears: "Add 'password' to the end?"
- taking it looks longer but the crack-bot instantly dictionary-hits it and
halves the payout (the lesson, played as a trap). Best bankroll saved.
Sounds: `click`, `place` (lock), `crackTick`, `crackWin`, `win`, `lose`.

### 7. Hook, Line & Sinker (`connect-four.html`): DOM board, full rewrite
Connect Four on a rope-net 7x6 grid. Local 2-player: PHISHERS (orange hook
chips) vs DEFENDERS (cyan shield chips). Tap a column to drop; chip falls with
bubble trail and splash. Each player holds 2 one-shot power chips:
- DEPTH CHARGE: remove any one enemy chip (tap it); chips above sink down.
- TANGLE NET: block one column for the opponent's next turn (net overlay).
Powers are optional, used instead of a normal drop... no: used BEFORE your
drop (power then still drop), keeping turn rhythm simple? DECISION: a power
USE consumes your turn. Simpler to reason about, adds real cost.
Win = 4 in a row; winning line gets "hauled up in the net" animation. Round
wins tracked, rematch button. Fact card: red team / blue team exercises.
Sounds: `place`, `alert` (power), `win`.

### Hub (`caught-in-the-net.html`)
Poster-style hero: "CAUGHT IN THE NET" stacked Futura caps over a CSS scene
(waves, dangling hooks baited with padlock/coin/at-sign glyphs, rising
bubbles). Subtitle "A Cybersecurity Awareness Month Arcade". Below, 7 big
tackle-box cards (2-col on portrait iPad, 3-col landscape): glyph, name,
tagline, difficulty pips, personal-best badge read from localStorage. Footer:
tiny link to `games.html` ("full archive") + mute note. Cards are whole-card
touch targets.

## Build plan

1. Commit this spec.
2. Dispatch parallel build agents, one per game (7), each given the canonical
   tokens + kiosk rules + its spec verbatim. Hub built by the main session in
   parallel (sets the reference implementation of the theme).
3. Review pass on every file: theme fidelity, offline check (no external URLs),
   touch rules, sounds.js API validity, localStorage keys.
4. Preview-server smoke test of all 8 pages at iPad sizes; fix.
5. Update README.md page table + HANDOFF.md.
