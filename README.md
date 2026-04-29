# Cyber Oracle

A collection of interactive cybersecurity and quantum-learning web toys. Each page is a self-contained HTML file with no build step and no dependencies. Drop them on any static host (GitHub Pages, Netlify, your own site, a SharePoint embed) and they work.

## Pages

| File | What it is |
|---|---|
| `index.html` | **Cyber 8-Ball.** Magic-8-ball-style oracle with 48 cybersecurity-themed answers across approved/inconclusive/denied categories. Animated fog, particle bursts, mobile-tuned layout. |
| `quantum.html` | **Quantum Oracle.** Schrodinger-flavored 8-ball alternative. 30 quantum-and-PQC-themed answers. Each result includes a "Decoded for humans" explainer card so the jokes also teach. Includes a navigation grid that links to the four concept pages below. |
| `superposition.html` | Animated explainer: a coin you can flip, then a Bloch-sphere visualization of a qubit holding both states at once, then the security implications (Grover's algorithm, AES-256). |
| `entanglement.html` | Animated explainer: two interactive particles you can measure, with a glowing entanglement link that breaks on observation, then a BB84/QKD visualization with an optional eavesdropper. |
| `quantum-tunneling.html` | Animated explainer: classical bounce vs. quantum wave tunneling on a live canvas, then the cybersecurity metaphor (Shor's algorithm, HNDL attacks). |
| `schrodingers-cat.html` | Animated explainer: open-the-box thought experiment with random alive/dead collapse, plus the data-shelf-life security parallel. |
| `games.html` | **Cyber Games hub.** Table of contents for the interactive game arcade. Tiered grid of live games and "coming soon" placeholders. |
| `phish-or-legit.html` | **Game.** Phishing recognition trainer with 13 realistic emails. Score, streak, accuracy. Reveals the red flags after each guess. |
| `whack-a-mole.html` | **Game.** 60-second arcade game where CVEs pop up and you click to patch. Combo multiplier, breaches counter, accelerating spawn rate. |
| `honeypot.html` | **Game.** Place traps (firewall, tarpit, sandbox, canary) to catch attackers approaching a fake server. Threat-intel feed shows TTPs. |
| `prompt-injection.html` | **Game.** Five-level chatbot challenge teaching the most common prompt injection techniques (direct, override, roleplay, smuggling, multi-turn). |
| `decryption-race.html` | **Game.** Side-by-side classical vs. quantum cracking of an RSA key. Pick from RSA-128 to RSA-4096. Quantum always wins. |
| `password-slot.html` | **Game.** Slot machine for password entropy and crack-time intuition. |
| `incident-response.html` | **Game.** Pager-driven incident response scenarios with consequences. |
| `social-engineering.html` | **Game.** Branching dialogue about persuasion, pressure, and refusal. |
| `build-your-stack.html` | **Game.** Spend a limited security budget across layered defenses. |
| `cipher-lab.html` | **Game.** Transform text through historical and modern encryption styles. |
| `cia-triad.html` | **Game.** Balance confidentiality, integrity, and availability under pressure. |
| `deepfake-detective.html` | **Game.** Spot synthetic media clues and reveal the tells. |
| `shadow-it.html` | **Game.** Audit departments for unsanctioned SaaS and risky workflows. |
| `attack-surface.html` | **Game.** Visualize exposed assets and hidden external risk. |
| `insider-threat-bingo.html` | **Game.** Match insider-risk indicators against employee profiles. |
| `connect-four.html` | **Game.** Local multiplayer red-team vs. blue-team Connect Four. |
| `permission-panic.html` | **Game.** Consent prompt triage for least-privilege app permissions. |
| `backup-blaster.html` | **Game.** Ransomware recovery drill for clean snapshots, isolation, and RPO tradeoffs. |
| `zero-trust-gatekeeper.html` | **Game.** Context-based access decisions: allow, challenge, or block. |
| `assets/cyber-arcade-banner.png` | Generated hub banner art for the game arcade. |

## Accessibility

- Semantic landmarks: `<header>`, `<main>`, `<nav>`, `<section>`.
- Keyboard support: every interactive element responds to Enter and Space.
- Screen-reader live regions on answer reveals (`role="status"`, `aria-live="polite"`).
- Visible focus rings (`:focus-visible`) on every focusable element.
- Decorative animations are wrapped in `aria-hidden="true"`.
- `prefers-reduced-motion` honored on every page.
- Form inputs paired with hidden `<label>` elements.
- Sufficient color contrast on all body text against the dark background.

## Hosting on GitHub Pages

1. Push this repo (public).
2. Settings -> Pages -> Source: Deploy from a branch -> `main` / `(root)` -> Save.
3. Site goes live at `https://<username>.github.io/<repo>/`.

## Embedding in SharePoint

Edit a SharePoint page, add an **Embed** web part, paste the GitHub Pages URL or:

```html
<iframe src="https://yourusername.github.io/cyber-oracle/"
        width="100%" height="820"
        style="border:0; border-radius:12px;"
        title="Cyber 8-Ball"></iframe>
```

If the embed is blocked, ask your tenant admin to add `*.github.io` to **HTML Field Security** in the SharePoint admin center.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). No IE.
