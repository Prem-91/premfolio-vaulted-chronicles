// Browser security headers applied to every SSR response in src/server.ts.
// Keep CSP permissive enough for: TanStack hydration scripts (inline),
// Google Fonts CSS/woff, Supabase REST + storage signed URLs + realtime WS.

const SUPABASE_HOSTS = "https://*.supabase.co wss://*.supabase.co";

const CSP = [
  "default-src 'self'",
  // TanStack Start injects inline hydration scripts; allow self + inline.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  `img-src 'self' data: blob: ${SUPABASE_HOSTS}`,
  `connect-src 'self' ${SUPABASE_HOSTS}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const HEADERS: Record<string, string> = {
  "content-security-policy": CSP,
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "cross-origin-opener-policy": "same-origin",
};

export function applySecurityHeaders(response: Response): Response {
  // Avoid mutating immutable responses (e.g. static asset 304s).
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
