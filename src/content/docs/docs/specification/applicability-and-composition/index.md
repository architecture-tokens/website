---
title: Applicability and composition
description: How applied tokens attach to model elements.
---

An applied token may restrict `appliesTo` element kinds and type tokens. Its optional `value` is checked against `valueSchema`. Composition keeps the element's type and applied intent explicit together.

For example, `security:security.encryption.at-rest` applies to database components and requires `{algorithm: aes-256}`. A token that is inapplicable, missing a required value, or duplicated produces a deterministic validation finding.
