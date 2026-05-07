/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Vercel Edge Middleware — Rate Limiting (100 req/day/IP)
 */
import { NextResponse, type NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Upstash Redis (Environment variables required)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter: 100 requests per day per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '86400s'), // 100 req / 24h
  analytics: true,
  prefix: "@upstash/ratelimit/web-id",
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export default async function middleware(request: NextRequest) {
  // Skip rate limiting for static assets
  if (request.nextUrl.pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Use client IP (Vercel provides this)
  const ip = request.ip ?? '127.0.0.1';

  // Apply rate limiting
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    // Return 429 Too Many Requests
    const response = new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  }

  // Add rate limit headers to the response
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString());

  return response;
}