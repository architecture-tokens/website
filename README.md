# Architecture Tokens

The specification and public website for [Architecture Tokens](https://architecturetokens.org). The website is deployed as a Cloudflare Worker with Static Assets.

## Repository layout

- `spec/` contains the normative specification, schemas, libraries, examples, and validator.
- `src/` and `public/` contain the website.
- Generated reference pages are built directly from the in-repository spec workspace.

## Development

```shell
npm install
npm run types
npm run dev
```

## Verification

```shell
npm run check
```

## Deployment

Wrangler configuration is the source of truth for the Worker and its four Custom Domains. Deploy only from a clean, reviewed commit:

```shell
npm run deploy
```

The canonical hostname is `architecturetokens.org`. The `.com` and `www` hostnames redirect to it while preserving paths and query parameters.
