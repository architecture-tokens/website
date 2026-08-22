import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(new URL('..', import.meta.url).pathname);
const dist = path.join(root, 'dist');
const required = ['/docs/', '/docs/getting-started/', '/docs/cli/', '/docs/reference/', '/docs/reference/specification/', '/docs/reference/schemas/architecture-model/', '/docs/specification/architecture-model/', '/docs/decisions-and-roadmap/'];
const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, {withFileTypes:true})) { const p = path.join(dir, entry.name); if (entry.isDirectory()) walk(p); else if (entry.name.endsWith('.html')) files.push(p); } }
walk(dist);
const routeOf = (p) => p === path.join(dist, 'index.html') ? '/' : p === path.join(dist, '404.html') ? '/404/' : `/${path.relative(dist, p).split(path.sep).join('/').replace(/index\.html$/, '')}`;
const routes = new Map();
const titles = new Set(); const descriptions = new Set(); const canonicals = new Set();
const normalized = (value) => value.endsWith('/') ? value : `${value}/`;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8'); const route = routeOf(file); if (routes.has(route)) throw new Error(`duplicate route ${route}`); routes.set(route, html);
  if (!/<main\b/.test(html)) throw new Error(`${route}: missing main landmark`);
  for (const field of ['<title>', 'name="description"', 'rel="canonical"']) if (!html.includes(field)) throw new Error(`${route}: missing ${field}`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]; const description = html.match(/name="description" content="([^"]+)"/)?.[1]; const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  if (!title || !description || !canonical || new URL(canonical).pathname !== normalized(route)) throw new Error(`${route}: invalid metadata`);
  if (titles.has(title) || descriptions.has(description) || canonicals.has(canonical)) throw new Error(`${route}: duplicate title, description, or canonical`); titles.add(title); descriptions.add(description); canonicals.add(canonical);
  for (const link of html.matchAll(/(?:href|src)="([^"]+)"/g)) { const target = link[1]; if (!target.startsWith('/') || target.startsWith('//')) continue; const pathname = new URL(target, 'https://architecturetokens.org').pathname; const fileTarget = pathname.endsWith('/') ? path.join(dist, pathname.slice(1), 'index.html') : path.join(dist, pathname.slice(1)); if (!fs.existsSync(fileTarget) && !routes.has(normalized(pathname))) throw new Error(`${route}: broken internal link ${target}`); }
}
for (const route of required) if (!routes.has(route)) throw new Error(`missing required route ${route}`);
for (const route of ['/cli/', '/reference/', '/getting-started/', '/specification/']) if (routes.has(route)) throw new Error(`accidental root docs route ${route}`);
const docs = routes.get('/docs/'); const hashes = [...docs.matchAll(/sha256-[A-Za-z0-9+/=]{20,}/g)]; if (hashes.length < 2 || /unsafe-inline/.test(docs)) throw new Error('CSP hash policy missing or unsafe-inline present');
const pagefind = fs.existsSync(path.join(dist, 'pagefind/pagefind-entry.json')); if (!pagefind) throw new Error('Pagefind assets missing');
const provenance = fs.readFileSync(path.join(root, 'generated/spec-provenance.json'), 'utf8'); if (!provenance.includes('50729a0912e190979a122e1c2b31fdf3c367f2e5')) throw new Error('provenance missing pinned commit');
const css = fs.readFileSync(path.join(dist, 'styles.css'), 'utf8'); if (!css.includes('focus-visible') || !css.includes('prefers-reduced-motion')) throw new Error('accessibility CSS missing');
console.log(`Built-site checks passed: ${files.length} HTML routes, ${hashes.length} CSP hashes, Pagefind index present.`);
