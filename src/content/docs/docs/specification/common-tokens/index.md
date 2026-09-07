---
title: Common tokens
description: Portable component meanings and presentation affordances shared across diagram formats.
---

The `common` library holds tokens that retain the same meaning across architecture notations. It contains two component types, three appearance-only tokens, and one ordinal annotation.

## Semantic component types

<div class="common-token-gallery">
  <article>
    <img src="/tokens/common.database.svg" alt="Database cylinder symbol" />
    <div>
      <h3><code>common:database</code></h3>
      <p>A persistent structured data store. It is the canonical database type; add <code>common@0.1.0</code> to the model's libraries before using it.</p>
    </div>
  </article>
  <article>
    <img src="/tokens/common.user.svg" alt="Human user symbol" />
    <div>
      <h3><code>common:user</code></h3>
      <p>A human participant who interacts with a software system. It is narrower than an external actor, which may also be another system.</p>
    </div>
  </article>
</div>

## Presentation tokens

These applied tokens affect rendering only. They do not turn a component into a decision, change its domain role, or assert that an ordinal is time-based.

<div class="common-token-gallery common-token-gallery--visual">
  <article>
    <img src="/tokens/common.decision-hexagon.svg" alt="Expanded hexagon symbol" />
    <div><h3><code>common:visual.decision-hexagon</code></h3><p>A wide six-sided component appearance.</p></div>
  </article>
  <article>
    <img src="/tokens/common.diamond.svg" alt="Diamond symbol" />
    <div><h3><code>common:visual.diamond</code></h3><p>A compact diamond component appearance.</p></div>
  </article>
  <article>
    <img src="/tokens/common.parallelogram.svg" alt="Parallelogram symbol" />
    <div><h3><code>common:visual.parallelogram</code></h3><p>A right-leaning component appearance.</p></div>
  </article>
  <article>
    <img src="/tokens/common.ordinal-marker.svg" alt="Ordinal marker with the number 1" />
    <div><h3><code>common:ordinal-marker</code></h3><p>An annotation with a required positive ordinal value.</p></div>
  </article>
</div>

## Evidence boundary

The common library records portable meaning, not every shape or label found in a diagram. Cross-format review found direct support for the database and human-user meanings in Mermaid C4 and draw.io C4 examples. A generic database glyph, a generic actor, or a visual group is not enough to infer storage, humanity, ownership, deployment, or a new common token.

This boundary keeps semantic tokens separate from renderer and layout policy. Renderer mappings may reuse the SVG assets shown above; the mapping does not change a token's architectural meaning.
