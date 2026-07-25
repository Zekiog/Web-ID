/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Vercel Edge Middleware — Rate Limiting (100 req/day/IP)
 *
 * Fail-open by design: if Upstash env vars are not configured the
 * middleware passes every request through untouched, so a missing
 * secret can never take the site down. Rate limiting activates
 * automatically once UPSTASH_REDIS_REST_URL / _TOKEN are set.
 */
import { next } from '@vercel/edge';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const config = {
  // Only page routes — skip static assets and any file with an extension.
  matcher: ['/((?!assets/|.*\\..*).*)'],
};

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(100, '86400 s'), // 100 req / 24h
        analytics: true,
        prefix: '@upstash/ratelimit/web-id',
      })
    : null;

export default async function middleware(request: Request): Promise<Response> {
  // Not configured → no-op pass-through.
  if (!ratelimit) return next();

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const response = next();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());
  return response;
}
