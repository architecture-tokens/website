---
title: CLI commands and workflows
description: Local, offline-first validation and rendering.
---

Install the draw.io prototype from its pinned GitHub commit until npm publication:

```sh
npm install github:architecture-tokens/drawio-prototype#f9e00c7c12750fe3c6fd576c48ca01b18ffcde62
npx archtokens validate payments.yaml --library libraries/core.yaml --library libraries/security.yaml --policy policies.yaml --format human
npx archtokens generate payments.yaml --out payments.drawio --library libraries/core.yaml --library libraries/security.yaml --policy policies.yaml --format human
```

The CLI has no config files. Repeat `--library` and `--policy` for inputs. `--format` accepts `human` or `json`. For `generate`, `--ai-model` takes precedence over `ARCHTOKENS_OPENAI_MODEL`, then `gpt-5.6`; `OPENAI_API_KEY` is only used by generate. The offline golden workflow is the reproducible baseline, and no live API call is run here.

| Exit code | Meaning |
| --- | --- |
| 0 | Valid model and generated artifact |
| 1 | Invalid architecture |
| 2 | Usage or input error |
| 3 | API error |
| 4 | Invalid layout |
| 5 | Output error |

Live OpenAI verification is explicitly skipped in v0.1 and must never be required for offline builds.

Treat models as potentially sensitive: keep credentials out of YAML, prefer offline validation, and review generated artifacts before sharing.
