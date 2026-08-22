# Architecture Tokens Homepage Restoration Implementation Plan

Date: 2026-08-23
Design: `../specs/2026-08-23-homepage-restoration-design.md`

## Outcome

Restore the pre-migration blueprint homepage identity inside the current Astro site, replace obsolete examples with current v0.1 terminology, and eliminate horizontal document overflow on phone-sized viewports without changing documentation, Worker, or domain behavior.

## 1. Lock the Homepage Contract

Update `test/website.spec.ts` before the page implementation so the canonical homepage response must contain:

- the approved broad heading;
- the `A shared vocabulary for architecture` positioning;
- current `security.encryption.at-rest` terminology;
- `One meaning. Many implementations.`;
- the restored `Help shape the vocabulary.` CTA;
- direct Docs and GitHub destinations.

Keep all existing canonical-host, documentation, redirect, CSP, and 404 assertions unchanged.

Verification: run the targeted Vitest file and observe the new restoration assertions fail against the current homepage before implementation.

## 2. Restore the Astro Homepage Structure

Replace the migrated drafting-system structure in `src/pages/index.astro` with the approved legacy information architecture:

1. site header and draft status;
2. two-column hero with the broad shared-meaning promise;
3. current token-library excerpt based on the documented `security.encryption.at-rest` token;
4. implementation mapping proof;
5. three principles: shared meaning, vendor neutral, composable;
6. dark contribution CTA;
7. complete footer.

Retain the canonical URL, metadata, theme color, Open Graph metadata, favicon, stylesheet loading, and semantic landmarks. Link primary actions to the current local documentation routes and GitHub organization/specification destinations.

Verification: targeted homepage tests pass and the generated homepage includes the approved section order and current terminology.

## 3. Consolidate the Visual System

Edit `public/styles.css` to keep the original identity system and remove the appended `v0.1 homepage drafting system` rules.

Preserve the exact legacy tokens:

- blueprint `#243BFD` and blueprint dark `#1728CA`;
- ink `#132238`, steel `#607089`, field `#F4F7FB`, paper `#FFFFFF`;
- signal orange `#F15A3A`;
- IBM Plex Sans and IBM Plex Mono;
- 32-pixel blueprint grid, square structural cards, offset shadows, and dark CTA.

Adapt the existing legacy selectors only where the new content needs different sizing. Add shrink-safe rules for grid children and bounded code content. At the narrow breakpoint:

- use one hero column;
- stack mapping targets and principles;
- stack actions and CTA content;
- reduce header links by priority;
- prevent negative-width or fixed-minimum children from expanding the document.

Keep 404-page styles, focus visibility, and reduced-motion behavior intact.

Verification: build succeeds; desktop retains the legacy signature; 320, 375, 390, 768, and 1024 CSS-pixel viewports have no horizontal document scrolling.

## 4. Validate Content and Behavior

Run the repository checks most relevant to this scoped change:

- `npm test`;
- `npm run check:examples`;
- `npm run build`;
- `npm run check:built`;
- `npm run typecheck`.

Then serve the built site locally and inspect the canonical homepage at desktop and phone widths. Measure `document.documentElement.scrollWidth` against `window.innerWidth`, check console output, follow primary links, and inspect keyboard focus and reduced-motion behavior.

If a high-cost browser check fails, reduce it to the smallest reproducible CSS or DOM condition before changing implementation.

## 5. Review and Commit

Compare the finished page with the pre-migration homepage at commit `8e89b96ff1e1a24bbb43da1f3b2adbb9bd09575c`.

Confirm:

- the legacy palette and typography are exact;
- the broad heading remains primary;
- mapping is supporting proof;
- no obsolete `component.database` homepage schema remains;
- the appended drafting-system stylesheet is gone;
- unrelated documentation and Worker files are untouched.

Commit the scoped implementation separately from the already committed design and plan documents. Do not deploy or publish a release until local verification is complete.

## Rollback

The homepage restoration is isolated to `src/pages/index.astro`, `public/styles.css`, and homepage assertions in `test/website.spec.ts`. If verification reveals an unresolved regression, revert only the implementation commit; the documentation site, Worker routing, and domain configuration remain unchanged.
