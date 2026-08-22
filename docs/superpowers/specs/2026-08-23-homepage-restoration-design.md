# Architecture Tokens Homepage Restoration Design

Date: 2026-08-23
Status: Approved visual direction; written design awaiting review
Supersedes: Homepage content, visual direction, and responsive sections of `2026-08-22-website-and-domain-design.md`

## Objective

Restore the homepage identity and content rhythm that existed before the Astro documentation migration, while keeping the public copy truthful to the current v0.1 specification.

The restoration is not a verbatim rollback. The old homepage is the contract for visual identity and information architecture; the current specification is the source of truth for examples, terminology, and destinations.

## Baseline

The visual and structural baseline is the pre-migration homepage at commit `8e89b96ff1e1a24bbb43da1f3b2adbb9bd09575c`.

The following elements return:

- Branded header with the Architecture Tokens mark and visible draft status.
- Cool blueprint grid background.
- Two-column hero with a concrete token card.
- A mapping section that connects stable architectural meaning to provider implementations.
- Three concise principles.
- Dark contribution call to action.
- Full project footer.

The following migration regressions are removed:

- The generic drafting-system visual language appended after the original CSS.
- A code panel wider than the mobile viewport.
- The narrow product framing implied by making cross-environment mapping the headline.
- Competing warm editorial and cool blueprint design systems on the same page.

## Message Hierarchy

The homepage promise remains broad:

> Architecture should mean the same thing everywhere.

This is the primary heading. It describes shared architectural meaning across people, teams, tools, documents, and implementation environments.

The supporting definition explains the mechanism without reducing the product to one use case:

> A portable way to express architectural intent across teams, tools, and environments.

The next line reinforces semantic stability:

> Keep the meaning stable while implementations evolve.

Cross-environment mapping moves to the second section under:

> One meaning. Many implementations.

Mapping is evidence that a shared vocabulary travels; it is not the complete product promise.

## Page Structure

### 1. Header

- Architecture Tokens mark and wordmark on the left.
- `v0.1 Draft` status with the signal-orange dot.
- Links to Specification, Docs, and GitHub.
- On small screens, preserve the brand and the two highest-value destinations without introducing a menu dependency.

### 2. Hero

- Eyebrow: `A shared vocabulary for architecture`.
- Primary heading: `Architecture should mean the same thing everywhere.`
- Supporting definition and stability line described above.
- Primary action: `Explore the specification`.
- Secondary action: `Read the docs`.
- Current v0.1 token-library example, not the obsolete `component.database` schema from the original page.

The token card uses a compact excerpt of the current documented `security.encryption.at-rest` token. It preserves the current `kind: applied`, `appliesTo`, and `valueSchema` terminology. If the visual card abbreviates the document, it must be visibly presented as an excerpt rather than as a standalone valid token library.

### 3. Mapping Proof

The section maps one stable architectural intent to representative implementations:

```text
Stored data is encrypted
  → AWS implementation
  → Azure implementation
  → Google Cloud implementation
```

Provider examples are illustrative mappings, not claims that the specification endorses one provider or that every mapping is complete.

### 4. Principles

Three principles explain the larger value beyond provider mapping:

1. **Shared meaning** — people and tools interpret the same architectural intent.
2. **Vendor neutral** — implementation choices do not own the vocabulary.
3. **Composable** — tokens combine into architecture models that can be checked.

### 5. Contribution CTA

Restore the dark `Help shape the vocabulary` panel. It labels the project as an open draft and routes to the appropriate GitHub contribution destination.

### 6. Footer

Restore the full footer with project identity and Specification, Docs, and GitHub destinations.

## Exact Visual Identity

The production design reuses the original CSS variables rather than approximating the palette:

| Role | Value | Use |
| --- | --- | --- |
| Blueprint | `#243BFD` | Primary actions, labels, active semantic nodes, focus states |
| Blueprint dark | `#1728CA` | Primary-action hover state |
| Ink | `#132238` | Primary text and dark CTA |
| Steel | `#607089` | Supporting copy and utility text |
| Field | `#F4F7FB` | Cool technical page background |
| Paper | `#FFFFFF` | Token and mapping surfaces |
| Signal | `#F15A3A` | Draft status and code-value accent only |
| Line | `#CFD8E5` | Dividers and quiet borders |
| Line strong | `#9EACC0` | Structural card borders |

The background uses the original 32-pixel blueprint grid at four-percent blueprint opacity.

Typography also returns to the original system:

- IBM Plex Sans for display and body copy.
- IBM Plex Mono for code, labels, version badges, and technical metadata.
- No serif display face.

The original square blueprint brand mark, sharp borders, offset shadows, and restrained signal-orange details are retained. Warm cream, green, and yellow introduced during exploration are excluded.

## Responsive Behavior

Mobile is a true reflow, not a scaled desktop layout.

- The page remains within the viewport at 320 CSS pixels and above.
- The hero changes to one column; the token card follows the explanatory copy and actions.
- Every grid child uses shrink-safe sizing (`min-width: 0`) where required.
- Token code wraps or scrolls inside its own bounded surface; it never expands the document width.
- The mapping rail becomes a vertical sequence with a clear downward relationship.
- Principle cards stack vertically.
- The dark CTA stacks its action below the copy.
- Header links reduce by priority while preserving a direct path to Docs and GitHub.
- Touch targets are at least 44 CSS pixels where the visual treatment permits.
- No horizontal document scrolling is allowed at 320, 375, 390, 768, or 1024 CSS pixels.

Desktop retains the old homepage's generous negative space and two-column hero. Content width remains bounded so the layout does not become sparse on very wide displays.

## Accessibility

- Preserve semantic landmarks and one logical `h1`.
- Maintain keyboard-reachable links with visible blueprint focus treatment.
- Meet WCAG AA contrast for text and controls.
- Do not use blueprint or signal orange as the only carrier of meaning.
- Preserve usable layout at 200% zoom.
- Respect `prefers-reduced-motion`; motion is optional and decorative.
- Token examples have an accessible label and readable plain text.

## Implementation Boundaries

- Keep Astro and the current documentation architecture.
- Rebuild the Astro homepage using the approved legacy structure; do not restore the old static `public/index.html` runtime architecture.
- Consolidate homepage styles into one coherent system based on the original design tokens.
- Remove or replace the appended `v0.1 homepage drafting system` rules that conflict with the restored identity.
- Reuse the self-hosted IBM Plex assets already in the repository.
- Keep existing domain, redirect, Worker, security, and documentation behavior unchanged.
- Do not add a client-side framework, analytics, theme switcher, animation library, or navigation drawer for this restoration.

## Verification

Before release:

- Build and existing automated tests pass.
- The current v0.1 example is checked against the specification or its schema.
- Automated browser checks assert `document.documentElement.scrollWidth === window.innerWidth` at 320, 375, 390, 768, and 1024 CSS pixels.
- Hero, token card, mapping sequence, principles, CTA, and footer are visually inspected on phone and desktop sizes.
- Header destinations, primary actions, and contribution links are verified.
- Keyboard navigation, focus visibility, reduced motion, and 200% zoom are checked.
- A before/after review confirms that the restored page matches the pre-migration visual identity while using current terminology.

## Acceptance Criteria

The restoration is complete when:

1. A returning visitor recognizes the pre-migration blueprint identity immediately.
2. The broad shared-meaning promise remains the homepage headline.
3. Cross-environment mapping is presented as supporting proof rather than the entire proposition.
4. Current v0.1 terminology and examples replace obsolete schema content.
5. The page has no horizontal overflow at the defined mobile widths.
6. The old and new homepage CSS no longer compete in the rendered page.
7. No existing documentation, domain, redirect, or Worker behavior regresses.

## Non-goals

- Changing the specification or schema design.
- Reworking the documentation information architecture.
- Adding new product features, interactive editors, or a token registry.
- Redesigning the project identity beyond restoring the approved legacy system.
- Publishing npm packages or creating unrelated releases as part of this homepage repair.
