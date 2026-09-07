---
title: Author, validate, and render
description: A minimal local workflow for Architecture Tokens.
---

Install the specification package:

```sh
npm install @architecture-tokens/spec
```

Create `payments.yaml` with `kind: architecture-model`, an `id`, exact library versions, and `tokens` arrays. Validate it, then generate a normalized renderer input for draw.io. The smallest useful command sequence is:

```sh
npm install github:architecture-tokens/drawio-prototype#f9e00c7c12750fe3c6fd576c48ca01b18ffcde62
npx archtokens validate payments.yaml --format human
npx archtokens generate payments.yaml --out payments.drawio --ai-model gpt-5.6 --format human
```

The CLI loads its reference libraries automatically. Add repeatable `--library` and `--policy` flags only when you have created additional local libraries or policy sets. Pin released package versions in automation so a build cannot silently change its vocabulary or layout implementation. The validator checks schema, token applicability, required values, conflicts, and policy rules before generation. `--ai-model` takes precedence over `ARCHTOKENS_OPENAI_MODEL`, then the default `gpt-5.6`; `OPENAI_API_KEY` is only needed by `generate`. No live API call is part of this documentation check.
