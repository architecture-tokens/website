---
title: Architecture Tokens
description: The mental model for portable architecture meaning.
---

Architecture Tokens give architecture tools a shared semantic vocabulary: a model declares components and relationships, then composes reusable tokens to describe intent.

```yaml
kind: architecture-model
id: payments
libraries: [core@0.1.0, security@0.1.0, environment@0.1.0, lifecycle@0.1.0]
components:
  - id: api
    type: core:component.service
    tokens: [{token: environment:environment.production}]
  - id: ledger
    type: core:component.database
    configuration: {engine: postgres}
    tokens: [{token: security:security.encryption.at-rest, value: {algorithm: aes-256}}]
relationships:
  - id: api-ledger
    type: core:relationship.call.sync
    from: api
    to: ledger
    tokens: [{token: security:security.encryption.in-transit}]
```

The path is deliberate: author a model, validate schema and policy, normalize it for a renderer, then generate an inspectable draw.io artifact.
