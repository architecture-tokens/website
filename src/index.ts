const CANONICAL_HOST = 'architecturetokens.org';
const REDIRECT_HOSTS = new Set([
  'www.architecturetokens.org',
  'architecturetokens.com',
  'www.architecturetokens.com',
]);
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'none'",
    "connect-src 'self'",
    "font-src 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'none'",
    "style-src 'self'",
    'upgrade-insecure-requests',
  ].join('; '),
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
} as const;

function withResponseHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }

  if (response.status === 308) {
    headers.set('Cache-Control', 'public, max-age=3600');
  } else if (headers.get('Content-Type')?.includes('text/html')) {
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  } else {
    headers.set('Cache-Control', 'public, max-age=86400');
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

function redirectToCanonical(url: URL): Response {
  url.hostname = CANONICAL_HOST;
  url.protocol = 'https:';
  url.port = '';

  return withResponseHeaders(
    new Response(null, {
      headers: {
        Location: url.toString(),
      },
      status: 308,
    }),
  );
}

async function serveAsset(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request);

  if (response.status !== 404) {
    return response;
  }

  const notFoundUrl = new URL('/404.html', request.url);
  const notFoundAsset = await env.ASSETS.fetch(new Request(notFoundUrl, request));

  return new Response(notFoundAsset.body, {
    headers: notFoundAsset.headers,
    status: 404,
    statusText: 'Not Found',
  });
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (REDIRECT_HOSTS.has(url.hostname)) {
      return redirectToCanonical(url);
    }

    if (url.hostname !== CANONICAL_HOST && !LOCAL_HOSTS.has(url.hostname)) {
      return withResponseHeaders(new Response('Not Found', { status: 404 }));
    }

    try {
      const response = await serveAsset(request, env);
      return withResponseHeaders(response);
    } catch (error) {
      console.error(
        JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
          message: 'asset request failed',
          path: url.pathname,
        }),
      );

      return withResponseHeaders(
        new Response('Internal Server Error', {
          status: 500,
        }),
      );
    }
  },
} satisfies ExportedHandler<Env>;
