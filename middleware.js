// win119.site 루트는 회사 소개(winners.html)를 보여 준다 — 정적 index.html이 rewrite보다 먼저 잡히므로 미들웨어로 처리 (2026-10-18)
export const config = { matcher: ['/', '/index.html'] };

export default function middleware(request) {
  const url = new URL(request.url);
  if (url.hostname === 'win119.site') {
    url.pathname = '/winners.html';
    return new Response(null, { headers: { 'x-middleware-rewrite': url.toString() } });
  }
  return undefined;
}
