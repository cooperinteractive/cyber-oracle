# HANDOFF: Cyber Oracle / Caught in the Net

_Last updated: 2026-07-04_

## What this is
A collection of self-contained cybersecurity web toys. Every page is a single HTML file: no build step, no dependencies, drop on any static host or load straight from disk. See `README.md` for the full inventory.

The active workstream is **Caught in the Net**, a fishing-themed touch arcade for a Cybersecurity Awareness Month wall installation. It runs on **offline iPads in kiosk mounts**. Design target: 80% arcade fun, 20% security learning (one "Catch of the Day" tip per game over, never a quiz gate).

## Current status
Caught in the Net is **built and verified**. Eight new/reinvented pages, all sharing one design language ("Bait Shop Deco": vintage tackle-shop / WPA-poster underwater, deep teal water, cream lettering, lure orange / brass / restrained biolume cyan). This replaces the cheesy neon look.

Design spec: `docs/superpowers/specs/2026-07-02-caught-in-the-net-arcade-design.md`.

Inventory (all at repo root):
- `caught-in-the-net.html`: the new arcade hub / table of contents (poster hero + 7 game cards with best-score badges).
- `reel-em-in.html`: phishing fishing (hold to drop hook, read the tag, snag phish). Ships with illustrated linocut fish (offline webp).
- `packet-trawler.html`: firewall net catcher.
- `packet-trawler-v2.html`: cinematic rebuild of Packet Trawler (rendered harbor art, glowing sprites, streak multiplier). Standalone; see Open decisions.
- `sonar-sweep.html`: threat-hunt minesweeper.
- `kraken-attack.html`: multi-touch botnet defense.
- `deep-dive-dash.html`: one-touch endless swimmer.
- `password-slot.html`: **reinvented** push-your-luck password slots (was the old entropy console).
- `connect-four.html`: **reinvented** as "Hook, Line & Sinker": 2-player net-board Connect Four with Depth Charge and Tangle Net power chips.
- `leaderboard.js` + `leaderboard.html`: shared local leaderboard (per-game top-8, touch initials entry) and a Hall of Fame page linked from the hub.

The older Cyber Oracle pages and the original `games.html` arcade are untouched; the hub footer links to `games.html` as the "full archive".

## Kiosk rules honored on every page
Offline only (the sole external reference is local `sounds.js`; art is CSS/SVG/canvas or embedded data URIs). Viewport locked for iPad, touch targets >= 56px, `touch-action`/`user-select` handled, `role="status"` live regions, `:focus-visible` rings, `prefers-reduced-motion` support, and localStorage high scores under the `citn-` prefix (`citn-reel-best`, `citn-trawler-best`, `citn-sonar-best`, `citn-kraken-best`, `citn-dash-best`, `citn-slot-best`, `citn-c4-wins`). The hub reads those keys for its "best" badges.

## How to run / preview
Static files. Serve the folder and open the hub:
`python3 -m http.server 8471` then visit `http://localhost:8471/caught-in-the-net.html`.
(There is a `.claude/launch.json` "arcade" config on port 8471 for the preview tooling.)

## Deploy to the kiosks
Copy the repo files to each iPad (or host on the local network) and open `caught-in-the-net.html` full-screen (Guided Access recommended). No internet needed. To pre-warm high-score badges, nothing is required; they populate as people play.

## The Reel 'Em In fish art (how it was made)
The fish are illustrated linocut/screenprint sprites generated via the Magnific image connector (Recraft V4.1), background-removed and defringed locally, downscaled, and encoded as alpha **webp** embedded as base64 data URIs so the page stays fully offline. Sprites are assigned to fish independently of phish/legit, so the picture never signals the answer; the red/green verdict shows only as an after-catch glow. Source assets and the build script live in this session's scratchpad (not committed): `.../scratchpad/fish/`. It is now the live `reel-em-in.html` (~447 KB self-contained); the fish were sized down 15% per feedback and the standalone v2 file was merged in and removed.

## Leaderboard
Shared `leaderboard.js` gives every scored game a local per-game top-8 board (keys `citn-lb-<game>`). At game over each game calls `CyberLeaderboard.record({game, title, score, unit, onDone})`; if the run earns a spot it shows a touch initials entry (a NEW LEADER moment at rank 1), then the board, then returns to the game-over screen. `leaderboard.html` (Hall of Fame) shows every board and has an operator "Reset all boards" button. All six scored games are wired in (Reel, Packet Trawler and its v2, Sonar on a win, Kraken, Deep Dive Dash, Slots). Connect Four is 2-player and has no score board.

## Open decisions / next steps
1. **Done: the illustrated version is live.** It is now the canonical `reel-em-in.html`. Optional next: roll the same illustrated-fish treatment out to the other games (each currently uses canvas/SVG art, which already looks good).
2. **Promote Packet Trawler v2?** `packet-trawler-v2.html` is standalone (the original is untouched). If approved, point the hub's Packet Trawler card at it or overwrite `packet-trawler.html` with the v2 contents, the same way Reel 'Em In was promoted.
3. **Merge to main.** Work is on branch `claude/mystifying-lalande-811d3d` (a worktree). Fast-forward or PR into `main` when ready.
4. Optional: add the new arcade to `games.html` or cross-link the two hubs.

## Notes
- A multi-agent review pass (offline safety, sound-API validity, game logic, accessibility, theme) ran over all 8 pages; its confirmed findings are fixed (themed the injected mute toggle everywhere, clamped the sonar counter, guarded a double game-over, enlarged the Depth Charge tap target, locked slot-page scroll).
- Writing-style rule holds throughout: no em/en dashes anywhere (verified by scan).
