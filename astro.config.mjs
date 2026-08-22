import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://architecturetokens.org',
  output: 'static',
  outDir: './dist',
  markdown: { syntaxHighlight: 'prism' },
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: ["default-src 'self'", "base-uri 'none'", "connect-src 'self'", "font-src 'self'", "form-action 'none'", "frame-ancestors 'none'", "img-src 'self' data:", "object-src 'none'"],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  integrations: [
    starlight({
      title: 'Architecture Tokens',
      description: 'A shared semantic model for architecture.',
      expressiveCode: false,
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/architecture-tokens' }],
      sidebar: [
        { label: 'Overview', link: '/docs/' },
        { label: 'Getting started', items: [{ label: 'Author, validate, render', link: '/docs/getting-started/' }] },
        { label: 'Specification', items: [
          { label: 'Architecture model', link: '/docs/specification/architecture-model/' },
          { label: 'Token libraries', link: '/docs/specification/token-libraries/' },
          { label: 'Applicability and composition', link: '/docs/specification/applicability-and-composition/' },
          { label: 'Policies and validation', link: '/docs/specification/policies-and-validation/' },
          { label: 'Renderer contract', link: '/docs/specification/renderer-contract/' },
        ] },
        { label: 'CLI', items: [{ label: 'Commands and workflows', link: '/docs/cli/' }] },
        { label: 'Reference', items: [{ label: 'Schemas and provenance', link: '/docs/reference/' }] },
        { label: 'Decisions and roadmap', link: '/docs/decisions-and-roadmap/' },
      ],
      customCss: ['./src/styles/tokens.css'],
    }),
  ],
});
