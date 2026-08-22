import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = path.join(root, 'node_modules/@architecture-tokens/spec/package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const expectedCommit = '50729a0912e190979a122e1c2b31fdf3c367f2e5';
const lock = fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8');
if (!lock.includes(expectedCommit)) throw new Error('Spec dependency drift: pinned commit is missing from package-lock.json');
if (pkg.version !== '0.1.0') throw new Error(`Unsupported spec version: ${pkg.version}`);
const schemaDir = path.join(root, 'node_modules/@architecture-tokens/spec/schema');
const outDir = path.join(root, 'src/content/docs/docs/reference/schemas');
fs.mkdirSync(outDir, { recursive: true });
const rows = [];
for (const filename of fs.readdirSync(schemaDir).filter((name) => name.endsWith('.json')).sort()) {
  const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, filename), 'utf8'));
  const fields = Object.entries(schema.properties ?? {}).map(([name, value]) => {
    const type = value.type ?? (value.$ref ? value.$ref.split('/').pop() : 'object');
    const required = (schema.required ?? []).includes(name) ? 'yes' : 'no';
    const enums = value.enum ? ` (${value.enum.join(', ')})` : '';
    return `| \`${name}\` | ${type}${enums} | ${required} | ${value.description ?? '—'} |`;
  }).join('\n');
  const title = schema.title ?? filename.replace('.schema.json', '');
  const slug = filename.replace('.schema.json', '');
  fs.writeFileSync(path.join(outDir, `${slug}.md`), `---\ntitle: ${title}\ndescription: Generated field reference for ${title}.\n---\n\n> Generated from **@architecture-tokens/spec ${pkg.version}**, pinned to commit \`${expectedCommit}\`. Do not edit this page by hand.\n\n| Field | Type | Required | Description |\n| --- | --- | --- | --- |\n${fields}\n`);
  rows.push(`- [${title}](./schemas/${slug}/)`);
}
const spec = fs.readFileSync(path.join(root, 'node_modules/@architecture-tokens/spec/SPEC.md'), 'utf8');
const specOut = path.join(root, 'src/content/docs/docs/reference/specification.md');
fs.writeFileSync(specOut, `---\ntitle: Normative specification\ndescription: Generated normative content from the pinned spec package.\n---\n\n> Generated from **@architecture-tokens/spec ${pkg.version}**, pinned to commit \`${expectedCommit}\`. Do not edit this page by hand.\n\n${spec}`);
fs.writeFileSync(path.join(root, 'generated/spec-provenance.json'), JSON.stringify({ package: '@architecture-tokens/spec', version: pkg.version, commit: expectedCommit, schemas: rows.length, specification: 'docs/reference/specification' }, null, 2) + '\n');
const index = `---\ntitle: Schema reference\ndescription: Generated JSON Schema field reference and provenance.\n---\n\n> Generated from **@architecture-tokens/spec ${pkg.version}**, pinned to commit \`${expectedCommit}\`.\n\n${rows.join('\n')}\n`;
fs.writeFileSync(path.join(root, 'src/content/docs/docs/reference/index.md'), index);
