# Ongoing Research Design

## Intent

Show two active research directions on the portfolio without presenting unfinished work as publications. The section should help research and ML/HCI recruiters quickly understand the problems currently being explored.

## Goals

- Add exactly two entries: "Geometry-Controlled Interventions for Monocular 3D" and "Gaze-Aware AI Coding Assistant."
- Place them directly after the publication list inside the Research section.
- Give each entry a bespoke, lightweight graphic that communicates the research idea at a glance.
- Label both entries as ongoing and attribute the relevant lab.
- Preserve the site's responsive behavior, dark mode, typography, and accessibility.

## Non-goals

- Do not describe either project as a paper, publication, or completed result.
- Do not add external links until public project pages or manuscripts exist.
- Do not add raster stock imagery or new dependencies.

## Constraints

- Use "Monocular 3D," not "3D detection," in the first title.
- Use concise descriptions grounded in the current CV.
- Graphics must be original inline SVG illustrations, decorative to assistive technology, and visually legible in light and dark themes.
- Keep the change data-driven so future ongoing projects can be added without rewriting the layout.

## Approaches

1. Add the work to Publications. Rejected because it would blur the line between active research and published/manuscript work.
2. Add the work to Selected Projects. Rejected because these are research directions rather than standalone portfolio products.
3. Add a compact Ongoing Research block beneath Publications. Selected because it preserves the information hierarchy while keeping all research together.

## Design

The Research section retains its existing heading and publication rows. Below them, an "Ongoing Research" subheading introduces a responsive two-card grid. Each card contains an original abstract SVG thumbnail, an "Ongoing" status label, lab attribution, title, one-sentence description, and topic tags. Cards stack on narrow screens and sit side by side on wider screens.

