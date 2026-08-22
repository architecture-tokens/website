import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import { parse } from 'yaml';
import { validateArchitecture, validateLibraries } from '@architecture-tokens/spec';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const specRoot = path.join(root, 'node_modules/@architecture-tokens/spec');
const libraries = ['core', 'security', 'environment', 'lifecycle'].map((name) => parse(fs.readFileSync(path.join(specRoot, 'libraries', `${name}.yaml`), 'utf8')));
const ajv = new Ajv2020({ allErrors: true, strict: true });
const policySchema = JSON.parse(fs.readFileSync(path.join(specRoot, 'schema/policy-set.schema.json'), 'utf8'));
const validatePolicy = ajv.compile(policySchema);
if (!validateLibraries(libraries).valid) throw new Error('Pinned reference libraries failed validation');
let checked = 0;
function check(value, file) {
  if (value.kind === 'architecture-model') { const result = validateArchitecture(value, libraries); if (!result.valid) throw new Error(`${file}: ${result.diagnostics.map((d) => d.message).join('; ')}`); }
  else if (value.kind === 'token-library') { const dependencies = libraries.filter((library) => library.namespace !== value.namespace); if (!validateLibraries([...dependencies, value]).valid) throw new Error(`${file}: invalid token-library example`); }
  else if (value.kind === 'policy-set') { if (!validatePolicy(value)) throw new Error(`${file}: invalid policy-set example: ${ajv.errorsText(validatePolicy.errors)}`); }
  else throw new Error(`${file}: unknown declared YAML kind ${value.kind}`);
  checked++;
}
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) walk(file); else if (file.endsWith('.md')) { const text = fs.readFileSync(file, 'utf8'); for (const match of text.matchAll(/```yaml\n([\s\S]*?)\n```/g)) { const value = parse(match[1]); if (value?.kind) check(value, file); } } } }
walk(path.join(root, 'src/content/docs/docs'));
const homepage = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
const homepageExample = homepage.match(/const architectureModelExample = `([\s\S]*?)`;/)?.[1];
if (!homepageExample) throw new Error('Homepage architecture model example is missing');
check(parse(homepageExample), 'src/pages/index.astro');
if (checked < 5) throw new Error(`Expected homepage, architecture, token-library, and policy examples; found ${checked}`);
console.log(`Validated ${checked} embedded YAML examples by declared kind.`);
