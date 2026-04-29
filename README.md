# Cyber Oracle

A pair of interactive web toys for cybersecurity learning, plus four animated explainers for core quantum-computing concepts. Each page is a self-contained HTML file with no build step and no dependencies. Drop them on any static host (GitHub Pages, Netlify, your own site, a SharePoint embed) and they work.

## Pages

| File | What it is |
|---|---|
| `index.html` | **Cyber 8-Ball.** Magic-8-ball-style oracle with 48 cybersecurity-themed answers across approved/inconclusive/denied categories. Animated fog, particle bursts, mobile-tuned layout. |
| `quantum.html` | **Quantum Oracle.** Schrodinger-flavored 8-ball alternative. 30 quantum-and-PQC-themed answers. Each result includes a "Decoded for humans" explainer card so the jokes also teach. Includes a navigation grid that links to the four concept pages below. |
| `superposition.html` | Animated explainer: a coin you can flip, then a Bloch-sphere visualization of a qubit holding both states at once, then the security implications (Grover's algorithm, AES-256). |
| `entanglement.html` | Animated explainer: two interactive particles you can measure, with a glowing entanglement link that breaks on observation, then a BB84/QKD visualization with an optional eavesdropper. |
| `quantum-tunneling.html` | Animated explainer: classical bounce vs. quantum wave tunneling on a live canvas, then the cybersecurity metaphor (Shor's algorithm, HNDL attacks). |
| `schrodingers-cat.html` | Animated explainer: open-the-box thought experiment with random alive/dead collapse, plus the data-shelf-life security parallel. |

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
