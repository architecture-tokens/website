# Architecture Tokens Website and Domain Implementation Plan

Date: 2026-08-22
Design: `../specs/2026-08-22-website-and-domain-design.md`

## Outcome

Publish a tested Cloudflare Worker at `architecturetokens.org`, redirect the `.com` and `www` hostnames to it, publish the source at `architecture-tokens/website`, and verify the two domain registrations are protected.

## 1. Project Foundation

Create a small TypeScript Worker project with:

- current Wrangler and Workers runtime types;
- current compatibility date and `nodejs_compat`;
- generated binding types rather than a hand-written `Env`;
- Static Assets bound as `ASSETS`;
- Workers logs enabled with conservative sampling;
- `workers.dev` and preview URLs disabled for the production surface.

Verification: Wrangler configuration validation, generated types, and TypeScript compilation all succeed.

## 2. Request Routing

Implement the request handler as independently testable functions:

- recognize the canonical `.org` hostname;
- redirect the other three supported hostnames with HTTP 308;
- preserve path and query parameters;
- reject unsupported hostnames;
- serve static assets on the canonical host;
- convert missing assets into a branded 404 response;
- attach security and cache headers without buffering response bodies.

Verification: Workers-runtime tests exercise each branch and response header.

## 3. Static Website

Build a semantic, framework-free page containing:

- the v0.1 draft status;
- the project definition;
- the real `component.database` example;
- the semantic-to-provider mapping rail;
- links to the specification and GitHub organization;
- a concise 404 page;
- self-hosted IBM Plex Sans and IBM Plex Mono font assets with their license.

Verification: inspect desktop and mobile renders, keyboard focus, reduced-motion CSS, overflow, and browser console errors.

## 4. Pre-deployment Checks

Run:

- generated binding type freshness check;
- TypeScript type checking;
- Workers-runtime tests;
- Wrangler dry-run;
- Worker startup profile;
- whitespace and repository status checks.

Resolve all failures before deployment.

## 5. Publish Source

Commit the implementation, create public repository `architecture-tokens/website`, set its description and homepage, push `main`, and verify its first GitHub Actions run.

## 6. Deploy Custom Domains

Deploy the clean commit with Wrangler. The configuration attaches:

- `architecturetokens.org`;
- `www.architecturetokens.org`;
- `architecturetokens.com`;
- `www.architecturetokens.com`.

If Cloudflare reports a conflicting DNS record, inspect it before changing anything. Do not delete an unresolved record or route.

## 7. Production Verification

Verify with independent HTTP and DNS checks:

- all hostnames negotiate HTTPS;
- `.org` returns `200` and the canonical page;
- redirecting hostnames return `308` to `.org`;
- nested path and query parameters survive redirection;
- unknown `.org` paths return `404`;
- security headers are present;
- the live page renders correctly on desktop and mobile;
- no browser console errors occur.

## 8. Registrar Verification

Use the Cloudflare dashboard to inspect both domains and confirm:

- auto-renew is enabled;
- registrar lock is enabled;
- DNSSEC is enabled or confirmed pending registry publication;
- no registrant contact or payment information is changed.

If enabling DNSSEC requires a confirmation action, perform it only for these two domains and re-check the resulting status.

## Rollback

If production verification fails, roll the Worker back to its previous version when one exists. For a first deployment with no previous version, remove only the newly created Worker Custom Domain bindings after resolving their exact identities; keep the domain registrations and unrelated DNS records untouched.
