# Ongoing Research Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two visually distinct ongoing-research entries for Monocular 3D and gaze-aware AI work beneath the portfolio's publication list.

**Architecture:** Store the two entries in `info.json`, render them through a focused `OngoingResearch` component, and compose that component into the existing Research section. Reuse the publication-row box classes for layout and add component-owned inline SVG graphics keyed by a small data field, with responsive and dark-mode styling in the existing stylesheet.

**Tech Stack:** React 19, JSON content data, inline SVG, CSS, Node test runner, Vite

**Spec:** `docs/superpowers/specs/2026-11-26-ongoing-research-design.md`

## Global Constraints

- Use "Monocular 3D," not "3D detection," in the first title.
- Show exactly two entries and label both as ongoing research.
- Do not add external links, publication claims, raster images, packages, or runtime dependencies.
- SVG graphics are decorative (`aria-hidden="true"`) and must remain legible in light and dark themes.
- Preserve the existing Research section, responsive behavior, and visual language.
- Use the same full-width thumbnail-and-content box layout as the publication entries.

## Review Focus

- Missing or malformed `ongoingResearch` data must be caught by a data-contract test.
- An unsupported graphic key must not crash rendering; the component must provide a neutral fallback graphic.
- Long titles must wrap without clipping at 320px width.
- Inline SVGs must not enter the accessibility tree or create unnamed interactive elements.
- Dark mode must retain readable contrast for text, tags, status, and illustration strokes.

---

### Task 1: Ongoing Research Data Contract

**Files:**
- Modify: `src/data/info.json`
- Create: `src/data/info.test.js`

**Interfaces:**
- Produces: `info.ongoingResearch`, an array of `{ title, status, lab, description, tags, graphic }` objects.
- Consumes: Existing JSON content conventions in `src/data/info.json`.

- [ ] **Step 1: Write the failing data-contract test**

Add a Node test that loads `info.json` and asserts there are exactly two entries; their titles are "Geometry-Controlled Interventions for Monocular 3D" and "Gaze-Aware AI Coding Assistant"; both statuses are `Ongoing`; both have a lab, description, at least two tags, and a supported `graphic` value (`monocular3d` or `gaze`).

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test src/data/info.test.js`

Expected: FAIL because `ongoingResearch` does not exist.

- [ ] **Step 3: Add the two entries to `src/data/info.json`**

Use descriptions grounded in the approved design and current CV: controlled CAD-based interventions for size-versus-distance reasoning; and eye tracking, code edits, and execution feedback feeding spoken LLM guidance. Attribute the first to ViLab and the second to DIVA Lab.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `node --test src/data/info.test.js`

Expected: 1 test passes, 0 failures.

- [ ] **Step 5: Commit the data slice**

```bash
git add src/data/info.json src/data/info.test.js
git commit -m "feat: add ongoing research content"
```

### Task 2: Ongoing Research Cards and Graphics

**Files:**
- Create: `src/components/OngoingResearch.jsx`
- Modify: `src/components/Publication.jsx`
- Modify: `src/i18n.js`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `info.ongoingResearch` from Task 1 and `t.researchProfile.ongoingResearch` / `t.researchProfile.ongoingStatus` labels.
- Produces: `OngoingResearch`, a React component rendered after `.pub-list` within `#research`.

- [ ] **Step 1: Add localized UI labels**

Add English and Chinese strings for the subsection heading and ongoing-status label to the existing `researchProfile` dictionaries in `src/i18n.js`.

- [ ] **Step 2: Implement `OngoingResearch` and its graphics**

Create a data-driven card list with a `ResearchGraphic({ type })` helper. Implement original `monocular3d` and `gaze` inline SVG illustrations plus a neutral fallback. Mark the visual wrapper/SVG decorative and keep all meaningful content as text.

- [ ] **Step 3: Compose the component into Publications**

Import and render `<OngoingResearch />` immediately after the existing publication list in `src/components/Publication.jsx`.

- [ ] **Step 4: Add responsive, dark-mode-aware styles**

Add styles for the subsection heading, publication-style rows, visual panels, status/lab metadata, descriptions, and tags. Reuse the existing publication responsive behavior; allow titles and descriptions to wrap naturally without fixed heights.

- [ ] **Step 5: Run tests and build**

Run: `npm test && npm run build`

Expected: all Node tests pass and Vite exits 0.

- [ ] **Step 6: Verify in a real browser**

At desktop and 320px widths, confirm both cards appear after Publications, graphics render, text does not clip, and dark mode remains readable. Confirm the accessibility tree exposes the subsection heading and card text but not the decorative SVG content, and the console has zero errors.

- [ ] **Step 7: Commit the UI slice**

```bash
git add src/components/OngoingResearch.jsx src/components/Publication.jsx src/i18n.js src/index.css
git commit -m "feat: showcase ongoing research"
```

