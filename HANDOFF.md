# HANDOFF — Cyber Oracle

_Last updated: 2026-06-30_

## What this is
A collection of self-contained cybersecurity / quantum-learning web toys ("Cyber Oracle"). Each page is a single HTML file: no build step, no dependencies, drop on any static host. See `README.md` for the full page inventory.

## Current status
Active. Most recent work: applied the **Mission Control** design system (from the Open Design / nexu-io repo, `design-systems/mission-control`) to two games, replacing the old purple/neon look.

- `password-slot.html` — reskinned as a "Entropy telemetry console."
- `connect-four.html` — reskinned as a "Red Team vs Blue Team ops board."

Both redesigns are **CSS + cosmetic-color-only**. All game logic, element IDs, class names, and the shared `sounds.js` / `nav.js` hooks are untouched and verified intact.

## Mission Control design language (for consistency if reskinning more pages)
- Canvas `#0B1120` navy, panels `#111827`, borders `#1E3A5F`, faint command-grid overlay (replaces starfield).
- Amber `#FFB800` = primary telemetry/data. Cyan `#00D4FF` = healthy/active/accent. Red `#FF4757` = critical/alert. Warn `#FF9F43`, success `#26DE81`.
- In Connect Four: **Red Team (attackers) = `#FF4757`, Blue Team (defenders) = cyan `#00D4FF`**.
- Monospace for all data values (`JetBrains Mono` stack, system fallback). Inter/system-ui for labels/prose.
- Functional geometry: border-radius ≤ 4px (circles for game pieces/board holes are the only exception). No decorative color, no big rounded "friendly" cards.
- `prefers-reduced-motion` block neutralizes all animation.
- Kept **dependency-free**: uses the design system's font *stacks* with system fallbacks (no Google Fonts network call), so the offline/static ethos holds.

## How to run / preview
Static files. Open directly, or serve the folder: `python3 -m http.server 8000` then visit e.g. `http://localhost:8000/password-slot.html`.

## Reference material
Open Design repo cloned to scratchpad for this session (not committed): `…/scratchpad/open-design`. The 152 design systems live in `design-systems/<name>/` (each has `DESIGN.md`, `tokens.css`, `components.html`). Re-clone from https://github.com/nexu-io/open-design if needed.

## Open decisions / next steps
- Decide whether to roll Mission Control across the rest of the arcade (whack-a-mole, phish-or-legit, honeypot, etc.) and the hubs (`index.html`, `games.html`, `quantum.html`) for a unified look, or keep it scoped to these two.
- Not yet visually screenshot-verified in-session (preview/Chrome tooling was unavailable); live previews render in the editor panel. Eyeball both before merging.
