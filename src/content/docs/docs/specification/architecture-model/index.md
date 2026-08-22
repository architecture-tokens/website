---
title: Architecture model
description: Components, relationships, and applied meaning.
---

An architecture model requires `kind`, `id`, exact `libraries`, `components`, and `relationships`. Each element has a unique `id`, one type reference, and a `tokens` array. Relationships connect existing component IDs.

```yaml
kind: architecture-model
id: payments
libraries: [core@0.1.0, security@0.1.0]
components:
  - id: ledger
    type: core:component.database
    configuration: {engine: postgres}
    tokens: [{token: security:security.encryption.at-rest, value: {algorithm: aes-256}}]
relationships: []
```
