---
title: Renderer contract
description: Normalized input for diagram renderers.
---

Renderers consume a normalized resolved model. Layout is intentionally outside the v0.1 semantic contract, so a renderer can choose a structured layout without changing meaning.

The renderer input preserves model identity, resolved library tokens, element configuration, and relationship endpoints. A renderer must not reinterpret provider names as semantic types; it receives resolved token meaning and produces an artifact such as draw.io.
