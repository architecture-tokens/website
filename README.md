# Architecture Tokens Website

The public entry point for [Architecture Tokens](https://architecturetokens.org), deployed as a Cloudflare Worker with Static Assets.

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
