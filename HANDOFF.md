# HANDOFF: Cyber Oracle / Caught in the Net

_Last updated: 2026-07-13_

## What this is
A collection of offline cybersecurity web toys. There is no build step or network dependency. Most pages are single HTML files; premium 3D review builds may load local assets from `assets/`. See `README.md` for the full inventory.

The active workstream is **Caught in the Net**, a fishing-themed touch arcade for a Cybersecurity Awareness Month wall installation. It runs on **offline iPads in kiosk mounts**. Design target: 80% arcade fun, 20% security learning (one "Catch of the Day" tip per game over, never a quiz gate).

## Current status
Caught in the Net is **built and verified**. The seven-game arcade and its premium standalone prototypes share one design language ("Bait Shop Deco": vintage tackle-shop / WPA-poster underwater, deep teal water, cream lettering, lure orange / brass / restrained biolume cyan). This replaces the cheesy neon look.

Design spec: `docs/superpowers/specs/2026-07-02-caught-in-the-net-arcade-design.md`.

Inventory (all at repo root):
- `caught-in-the-net.html`: the new arcade hub / table of contents (poster hero + 7 game cards with best-score badges).
- `reel-em-in.html`: phishing fishing (hold to drop hook, read the tag, snag phish). Ships with illustrated linocut fish (offline webp).
- `reel-em-in-v2.html`: **3D review fork** titled "Ghost Net Protocol." Full-screen Three.js ocean, animated water/caustics/particles, local illustrated fish, projected signal tags, four escalating sectors, three difficulty modes, catch analysis, a whaling boss, S-to-D mission ranks, and responsive pointer/touch/keyboard controls. The original remains canonical until approval.
- `packet-trawler.html`: firewall net catcher.
- `packet-trawler-v2.html`: cinematic rebuild of Packet Trawler (rendered harbor art, glowing sprites, streak multiplier). Standalone; see Open decisions.
- `sonar-sweep.html`: threat-hunt minesweeper.
- `kraken-attack.html`: multi-touch botnet defense.
- `kraken-attack-v2.html`: cinematic rebuild of Kraken Attack (rendered abyssal background, sprite tentacles, bot-fish, boss, and treasure locker). The friendly crew diver is deliberately kept as the original canvas mascot. Standalone; see Open decisions.
- `deep-dive-dash.html`: **promoted premium build** titled "Blackwater Protocol." The courier-fish concept is now a three-sector mission with integrity and encryption systems, a charged disruption pulse, adaptive threats, combo scoring, difficulty modes, cinematic transitions, and a Zero-Day Leviathan boss.
- `password-slot.html`: **reinvented** push-your-luck password slots (was the old entropy console).
- `connect-four.html`: **reinvented** as "Hook, Line & Sinker": 2-player net-board Connect Four with Depth Charge and Tangle Net power chips.
- `leaderboard.js` + `leaderboard.html`: shared local leaderboard (per-game top-8, touch initials entry) and a Hall of Fame page linked from the hub.

The older Cyber Oracle pages and the original `games.html` arcade are untouched; the hub footer links to `games.html` as the "full archive".

## Kiosk rules honored on every page
Offline only. Shared references are local `sounds.js` and `leaderboard.js`; the 3D Reel review fork also vendors Three.js under `assets/vendor/` and loads extracted WebP fish from `assets/reel-fish/`. Viewport locked for iPad, touch targets >= 56px, `touch-action`/`user-select` handled, `role="status"` live regions, `:focus-visible` rings, `prefers-reduced-motion` support, and localStorage high scores under the `citn-` prefix (`citn-reel-best`, `citn-reel-v2-best`, `citn-trawler-best`, `citn-sonar-best`, `citn-kraken-best`, `citn-dash-best`, `citn-slot-best`, `citn-c4-wins`). The hub reads canonical keys only until a review build is promoted.

## How to run / preview
Static files. Serve the folder and open the hub:
`python3 -m http.server 8471` then visit `http://localhost:8471/caught-in-the-net.html`.
(There is a `.claude/launch.json` "arcade" config on port 8471 for the preview tooling.)

## Deploy to the kiosks
Copy the repo files to each iPad (or host on the local network) and open `caught-in-the-net.html` full-screen (Guided Access recommended). No internet needed. To pre-warm high-score badges, nothing is required; they populate as people play.

## The Reel 'Em In fish art (how it was made)
The fish are illustrated linocut/screenprint sprites generated via the Magnific image connector (Recraft V4.1), background-removed and defringed locally, downscaled, and encoded as alpha **webp** embedded as base64 data URIs so the page stays fully offline. Sprites are assigned to fish independently of phish/legit, so the picture never signals the answer; the red/green verdict shows only as an after-catch glow. Source assets and the build script live in this session's scratchpad (not committed): `.../scratchpad/fish/`. It is now the live `reel-em-in.html` (~447 KB self-contained); the fish were sized down 15% per feedback and the standalone v2 file was merged in and removed.

The new 3D review fork reuses eight of those sprites as local files under `assets/reel-fish/`. It vendors Three.js 0.185.1 and only the required post-processing modules under `assets/vendor/`; the upstream license is retained as `assets/vendor/three-LICENSE.txt`. No CDN or package install is required at runtime.

## Leaderboard
Shared `leaderboard.js` gives every scored game a local per-game top-8 board (keys `citn-lb-<game>`). At game over each game calls `CyberLeaderboard.record({game, title, score, unit, onDone})`; if the run earns a spot it shows a touch initials entry (a NEW LEADER moment at rank 1), then the board, then returns to the game-over screen. `leaderboard.html` (Hall of Fame) shows every board and has an operator "Reset all boards" button. The promoted Deep Dive game records mission points to the canonical `dash` board and migrates any local best score or board earned under the temporary `dash-v2` identifier. Connect Four is 2-player and has no score board.

## Open decisions / next steps
1. **Review Reel 'Em In 3D.** Open `reel-em-in-v2.html`. If approved, promote it over `reel-em-in.html`, migrate the `reel-v2` local best/board into `reel`, and update the hub link. Do not promote from review without approval.
2. **Promote the remaining v2 games?** `reel-em-in-v2.html`, `packet-trawler-v2.html`, and `kraken-attack-v2.html` are standalone (originals untouched). Deep Dive's premium build is approved and promoted.
3. **Merge to main.** Work is on branch `claude/mystifying-lalande-811d3d` (a worktree). Fast-forward or PR into `main` when ready.
4. Optional: add the new arcade to `games.html` or cross-link the two hubs.

## Live deployment (2026-07-13)

The arcade is live on practicethepause.com under `/arcade/`:
hub at https://practicethepause.com/arcade/ (redirects to caught-in-the-net.html),
all 7 games plus the 3 v2 builds, leaderboard page, shared scripts, and local
assets (reel-fish webp, vendored Three.js). Deployed by copying into
`public/arcade/` of the practice-pause-site repo (Cloudflare Pages, auto-deploy
from main; commit 888a628). The copied hub's footer links to the site home
instead of games.html. This repo stays the source of truth; re-copy to update.

## Physical wall installation
Design plan + $30K budget + prop sourcing list: `docs/installation/caught-in-the-net-wall.md`.
Four rendered concept mockups (Zeke mascot in the mural, three iPad kiosks) live in
`assets/wall-mockups/` (bait shop storefront, abyss hero mural, boardwalk pier,
poster gallery triptych). Clean full-bleed banner key art for ALL FOUR concepts is
generated and upscaled: working files in `assets/banner-art/`, print files in
`assets/banner-art/print/`, full 4x masters in the Magnific account library.
Next step: user picks the concept to produce; vendor crops 21:9 art to the 20x8 ft frame.

## Notes
- A multi-agent review pass (offline safety, sound-API validity, game logic, accessibility, theme) ran over all 8 pages; its confirmed findings are fixed (themed the injected mute toggle everywhere, clamped the sonar counter, guarded a double game-over, enlarged the Depth Charge tap target, locked slot-page scroll).
- `deep-dive-dash.html` was browser-verified on 2026-07-10 at 1280x720, 1024x768, and 768x1024. Tested title, gameplay, pause/resume, pulse damage, boss victory, deliberate integrity failure, leaderboard handoff, and local-only network requests. The premium build was approved and promoted over v1. Final run had zero browser console errors or warnings.
- `reel-em-in-v2.html` was browser-verified on 2026-07-10 at 1280x720, 1024x768, 768x1024, and 390x844. Tested title and gameplay framing, real pointer hold/drag/release, pause/resume, correct-threat and false-positive catches, whaling boss entry/catch, S-rank success, D-rank failure, results, local leaderboard behavior, and zero page overflow. WebGL readback probes were nonblank and changed between frames at all primary desktop/iPad sizes; final browser console had zero errors or warnings.
- `reel-em-in-v2.html` received a brighter mood pass on 2026-07-10: tropical teal water and sky, lighter fog/exposure, reduced vignette/noise, brighter local UI panels, more visible boat/seafloor materials, and warm coral clusters. Threat sectors still become progressively cooler and darker. Title and active gameplay were rechecked in the in-app browser with zero console warnings or errors.
- The hub hero title has a gentle per-letter wave animation (respects reduced motion).
- Writing-style rule holds throughout: no em/en dashes anywhere (verified by scan).
