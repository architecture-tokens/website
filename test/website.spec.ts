import { env } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';

import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

async function fetchWebsite(url: string): Promise<Response> {
  return worker.fetch(new IncomingRequest(url), env);
}

describe('Architecture Tokens website', () => {
  it('serves the canonical homepage', async () => {
    const response = await fetchWebsite('https://architecturetokens.org/');
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('the smallest reusable semantic units');
    expect(body).toContain('<link rel="canonical" href="https://architecturetokens.org/">');
    expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
    expect(response.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
  });

  it.each([
    'architecturetokens.com',
    'www.architecturetokens.com',
    'www.architecturetokens.org',
  ])('redirects %s to the canonical hostname', async (hostname) => {
    const response = await fetchWebsite(`https://${hostname}/spec/example?source=test`);

    expect(response.status).toBe(308);
    expect(response.headers.get('Location')).toBe(
      'https://architecturetokens.org/spec/example?source=test',
    );
  });

  it('returns the branded 404 page for an unknown canonical path', async () => {
    const response = await fetchWebsite('https://architecturetokens.org/not-a-page');

    expect(response.status).toBe(404);
    expect(response.headers.get('Location')).toBeNull();
    expect(await response.text()).toContain('That token does not exist');
  });

  it('rejects unknown hostnames without reflecting them', async () => {
    const response = await fetchWebsite('https://untrusted.example/path');

    expect(response.status).toBe(404);
    expect(response.headers.get('Location')).toBeNull();
  });
});
