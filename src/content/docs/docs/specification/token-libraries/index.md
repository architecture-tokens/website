---
title: Token libraries
description: Versioned namespaces for reusable architecture vocabulary.
---

Libraries own lowercase namespaces, domains, and SemVer versions. A reference is qualified as `namespace:token.id`; core types stay separate from domain libraries such as security, environment, and lifecycle.

```yaml
kind: token-library
namespace: security
domains: [security]
version: 0.1.0
name: Security
tokens:
  - id: security.encryption.at-rest
    kind: applied
    name: Encryption at rest
    description: Stored data is encrypted.
    appliesTo: {elementKinds: [component], componentTypes: [core:component.database]}
    valueSchema: {type: object, required: [algorithm], properties: {algorithm: {type: string}}}
```
