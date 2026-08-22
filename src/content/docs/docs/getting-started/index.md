---
title: Author, validate, and render
description: A minimal local workflow for Architecture Tokens.
---

Install from GitHub until the package is published to npm:

```sh
npm install github:architecture-tokens/spec#50729a0912e190979a122e1c2b31fdf3c367f2e5
```

Create `payments.yaml` with `kind: architecture-model`, an `id`, exact library versions, and `tokens` arrays. Validate with the pinned validator, then generate a normalized renderer input for draw.io. The smallest useful command sequence is:

```sh
npm install github:architecture-tokens/drawio-prototype#f9e00c7c12750fe3c6fd576c48ca01b18ffcde62
npx archtokens validate payments.yaml --library libraries/core.yaml --library libraries/security.yaml --policy policies.yaml --format human
npx archtokens generate payments.yaml --out payments.drawio --library libraries/core.yaml --library libraries/security.yaml --policy policies.yaml --ai-model gpt-5.6 --format human
```

Keep both commits pinned in automation so a build cannot silently change its vocabulary or layout implementation. The validator checks schema, token applicability, required values, conflicts, and policy rules before generation. `--ai-model` takes precedence over `ARCHTOKENS_OPENAI_MODEL`, then the default `gpt-5.6`; `OPENAI_API_KEY` is only needed by `generate`. No live API call is part of this documentation check.
