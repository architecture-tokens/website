---
title: Policies and validation
description: Deterministic schema and policy checks.
---

Policy sets are safe typed YAML—not code or CEL. Rules support recursive `all`, `any`, and `not` conditions plus predicates such as `kind`, `type`, `hasToken`, `missingToken`, and `connectedTo`.

```yaml
kind: policy-set
id: security-baseline
policies:
  - id: encrypted-databases
    description: Databases must declare encryption at rest.
    severity: error
    target: component
    where: {type: core:component.database}
    assert: {hasToken: security:security.encryption.at-rest}
    message: Add the encryption-at-rest token.
```

Reports contain stable `code`, `severity`, `layer`, document `path`, message, and optional element/rule identifiers, making CI output reviewable and machine-readable.
