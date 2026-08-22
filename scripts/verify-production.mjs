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
assert.match(await homepage.text(), /Architecture should mean the same thing everywhere\./);
assert.match(homepage.headers.get('content-security-policy') ?? '', /default-src 'self'/);

const missingPage = await request(`${canonicalOrigin}/not-a-page`);
assert.equal(missingPage.status, 404, 'unknown canonical path must return 404');
assert.equal(missingPage.headers.get('location'), null, 'branded 404 must not redirect');
assert.match(await missingPage.text(), /That token does not exist\./);

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
