import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const specRoot = path.join(root, 'spec');
const pkgPath = path.join(specRoot, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (pkg.version !== '0.1.0') throw new Error(`Unsupported spec version: ${pkg.version}`);
const schemaDir = path.join(specRoot, 'schema');
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
  fs.writeFileSync(path.join(outDir, `${slug}.md`), `---\ntitle: ${title}\ndescription: Generated field reference for ${title}.\n---\n\n> Generated from the in-repository **@architecture-tokens/spec ${pkg.version}** workspace. Do not edit this page by hand.\n\n| Field | Type | Required | Description |\n| --- | --- | --- | --- |\n${fields}\n`);
  rows.push(`- [${title}](./schemas/${slug}/)`);
}
const specLinkTargets = new Map([
  ['./schema/', '/docs/reference/'],
  ['./libraries/common.yaml', '/docs/specification/common-tokens/'],
  ['./libraries/core.yaml', '/docs/specification/token-libraries/'],
  ['./examples/', 'https://github.com/architecture-tokens/website/tree/main/spec/examples'],
]);
let spec = fs.readFileSync(path.join(specRoot, 'SPEC.md'), 'utf8');
for (const [source, target] of specLinkTargets) spec = spec.replaceAll(`](${source})`, `](${target})`);
const specOut = path.join(root, 'src/content/docs/docs/reference/specification.md');
fs.writeFileSync(specOut, `---\ntitle: Normative specification\ndescription: Generated normative content from the in-repository spec workspace.\n---\n\n> Generated from the in-repository **@architecture-tokens/spec ${pkg.version}** workspace. Do not edit this page by hand.\n\n${spec}`);
fs.writeFileSync(path.join(root, 'generated/spec-provenance.json'), JSON.stringify({ package: '@architecture-tokens/spec', version: pkg.version, source: 'spec/', schemas: rows.length, specification: 'docs/reference/specification' }, null, 2) + '\n');
const index = `---\ntitle: Schema reference\ndescription: Generated JSON Schema field reference and provenance.\n---\n\n> Generated from the in-repository **@architecture-tokens/spec ${pkg.version}** workspace.\n\n${rows.join('\n')}\n`;
fs.writeFileSync(path.join(root, 'src/content/docs/docs/reference/index.md'), index);
