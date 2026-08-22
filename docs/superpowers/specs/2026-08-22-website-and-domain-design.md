# Architecture Tokens Website and Domain Design

Date: 2026-08-22
Status: Approved direction; awaiting review of this written design

## Objective

Publish a small, credible public entry point for Architecture Tokens at `architecturetokens.org` and make every other registered hostname converge on it.

The page has one job: help a software architect understand the concept and reach the draft specification in less than one minute.

## Domain Behavior

One Cloudflare Worker owns four Custom Domains:

| Incoming hostname | Behavior |
| --- | --- |
| `architecturetokens.org` | Serve the project website. |
| `www.architecturetokens.org` | Permanent redirect to the same path and query on `architecturetokens.org`. |
| `architecturetokens.com` | Permanent redirect to the same path and query on `architecturetokens.org`. |
| `www.architecturetokens.com` | Permanent redirect to the same path and query on `architecturetokens.org`. |

Redirects use HTTP 308 so the request method, path, and query are preserved. The canonical HTML URL is `https://architecturetokens.org/`.

Cloudflare Custom Domains create the required DNS records and certificates. No separate origin server is used.

## Runtime Architecture

The site is a Cloudflare Worker with Static Assets:

```text
request
  → Cloudflare Custom Domain
  → Worker hostname canonicalization
      → redirect non-canonical hostnames
      → serve static asset on canonical hostname
```

The implementation is separated into:

- `src/index.ts`: hostname redirects, allowed-host checks, response security headers, and asset dispatch.
- `public/index.html`: semantic page structure and real project copy.
- `public/styles.css`: responsive presentation and reduced-motion behavior.
- `public/404.html`: clear response for unknown paths.
- `public/fonts/`: self-hosted IBM Plex Sans and IBM Plex Mono web fonts.
- `public/FONT-LICENSE.txt`: the font license and attribution.
- `wrangler.jsonc`: Worker name, current compatibility date, assets binding, observability, and four Custom Domains.

The Worker runs before assets so canonical-host and security behavior is consistent for every response. Unknown hostnames receive `404`; unknown paths on the canonical hostname receive the static `404.html` with status `404`.

No database, analytics, cookies, client framework, or runtime JavaScript is required.

## Page Content

The homepage contains four compact sections:

1. **Definition:** “The smallest reusable semantic unit for software architecture.”
2. **Token demonstration:** a real `component.database` YAML token.
3. **Semantic-to-concrete mapping:** the stable Database token mapped to AWS RDS, Azure SQL, and Google Cloud SQL.
4. **Actions:** “Read the specification” and “View on GitHub.”

The page clearly labels the project `v0.1 Draft`. It does not claim standardization, production maturity, a community size, or adoption that does not yet exist.

Primary links:

- Specification: `https://github.com/architecture-tokens/spec/blob/main/SPEC.md`
- GitHub organization: `https://github.com/architecture-tokens`

## Visual Direction

The visual language comes from architecture semantics rather than generic startup marketing.

### Palette

- Blueprint: `#243BFD` — links and the active semantic token.
- Ink: `#132238` — primary text.
- Steel: `#607089` — supporting text.
- Field: `#F4F7FB` — cool technical background.
- Paper: `#FFFFFF` — token surfaces.
- Signal: `#F15A3A` — draft status and focus detail.

### Type

- Display and body: self-hosted IBM Plex Sans, with a system sans-serif fallback.
- Code and utility labels: self-hosted IBM Plex Mono, with a system monospace fallback.

Only the required Latin web-font files are shipped. The page makes no runtime font requests to third parties.

### Layout and Signature

The hero is split between the definition and a semantic token card. A single “mapping rail” visually connects the stable token to three concrete provider implementations:

```text
Architecture Tokens             component.database
Small reusable semantics        ┌──────────────────────┐
for software architecture.      │ capabilities         │
                                │ constraints          │
[Read spec] [GitHub]             └──────────┬───────────┘
                                           │
                              AWS RDS ─ Azure SQL ─ Cloud SQL
```

The mapping rail is the page's one visual signature. It explains the product idea rather than decorating it. Motion is limited to a short page-load reveal and hover/focus feedback; `prefers-reduced-motion` disables the reveal.

## Accessibility and Responsive Behavior

- The document uses semantic landmarks and a logical heading hierarchy.
- All interactive elements are keyboard reachable with a visible focus state.
- Text and controls meet WCAG AA contrast targets.
- Content remains usable at 320 CSS pixels wide and at 200% zoom.
- Code blocks scroll horizontally instead of shrinking text.
- The layout becomes a single column on narrow screens.
- No essential meaning depends on color or motion.

## Security and Caching

The Worker adds these headers where appropriate:

- `Content-Security-Policy`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Permissions-Policy` disabling unused browser capabilities
- `Strict-Transport-Security` after HTTPS is verified on all four hostnames

Static HTML and CSS may be cached at the edge with revalidation. Redirect responses may use a short cache lifetime during initial verification and a longer lifetime after behavior is confirmed.

## Failure and Rollback

- An unsupported hostname returns `404` and is never reflected into a redirect target.
- An unknown canonical path returns the branded `404` page.
- If Custom Domain creation conflicts with an existing DNS record, deployment stops and the exact record is inspected before any deletion.
- The previous Worker version remains available for Wrangler rollback.
- Registrar settings are inspected independently from deployment; no contact or payment data is changed.

## Verification

Before deployment:

- TypeScript passes without errors.
- Wrangler configuration validates in a dry run.
- Automated tests cover all four hostnames, path/query preservation, unknown hosts, security headers, and 404 behavior.
- The page is inspected at desktop and mobile widths.
- Keyboard focus and reduced-motion behavior are checked.

After deployment:

- All four hostnames resolve over HTTPS.
- `.org` returns the site with a canonical link.
- `.com` and both `www` hostnames return the expected permanent redirect.
- A nested path and query string survive redirection.
- The certificate is valid for each hostname.
- Cloudflare reports the Worker deployment as healthy.

Registrar checks confirm auto-renew, registrar lock, and DNSSEC for both registered domains. Auto-renew is expected to be enabled by default, but the dashboard remains the source of truth.

## Repository and Deployment

The implementation lives in a standalone local `website` repository. After local verification it is published as `architecture-tokens/website` and deployed with Wrangler from a clean commit.

The initial deployment does not add continuous deployment credentials to GitHub. Automated deployment can be designed later after the project has a stable release process.

## Non-goals

- Documentation hosting beyond links to the specification.
- A token registry, search, playground, or editor.
- Authentication, analytics, newsletter capture, or community metrics.
- Provider comparison or endorsement.
- Multiple themes or a component library.
- `.dev` configuration, because that domain is not registered.
