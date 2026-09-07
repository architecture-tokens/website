import assert from 'node:assert/strict';

const canonicalOrigin = 'https://architecturetokens.org';
const redirectOrigins = [
  'https://architecturetokens.com',
  'https://www.architecturetokens.org',
  'https://www.architecturetokens.com',
];

async function request(url) {
  return fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  });
}

const homepage = await request(`${canonicalOrigin}/`);
assert.equal(homepage.status, 200, 'canonical homepage must return 200');
const homepageBody = await homepage.text();
assert.match(homepageBody, /Architecture should mean the same thing everywhere\./);
assert.match(homepageBody, /http-equiv="content-security-policy" content="default-src 'self'/);
assert.equal(homepage.headers.get('content-security-policy'), null, 'HTML CSP must remain in the generated meta tag');

const commonTokens = await request(`${canonicalOrigin}/docs/specification/common-tokens/`);
assert.equal(commonTokens.status, 200, 'Common Tokens page must return 200');
const commonTokensBody = await commonTokens.text();
assert.match(commonTokensBody, /common:database/);
assert.match(commonTokensBody, /http-equiv="content-security-policy" content="default-src 'self'/);
assert.equal(commonTokens.headers.get('content-security-policy'), null, 'HTML CSP must remain in the generated meta tag');

for (const path of [
  '/docs/reference/',
  '/docs/specification/common-tokens/',
  '/docs/specification/token-libraries/',
]) {
  const response = await request(`${canonicalOrigin}${path}`);
  assert.equal(response.status, 200, `specification link ${path} must return 200`);
}

const missingPath = `/__not-found-check-${Date.now()}`;
const missingPage = await request(`${canonicalOrigin}${missingPath}`);
assert.equal(missingPage.status, 404, 'unknown canonical path must return 404');
assert.equal(missingPage.headers.get('location'), null, 'branded 404 must not redirect');
assert.match(await missingPage.text(), /Page not found/);

for (const origin of redirectOrigins) {
  const response = await request(`${origin}/spec/example?source=verify`);
  assert.equal(response.status, 308, `${origin} must return 308`);
  assert.equal(
    response.headers.get('location'),
    `${canonicalOrigin}/spec/example?source=verify`,
    `${origin} must preserve path and query`,
  );
}

console.log('Production website verification passed.');
