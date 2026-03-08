// 사이트 도메인 (RISK119.SITE)
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://risk119.site'
// 연락처·온라인 상담 URL (랜딩·결과 페이지 공통)
export const CONTACT_PHONE = '02-2138-0240'
// 비대면 상담 버튼 클릭 시 이동 — 래피드(Latpeed) 상품/에디터 링크 (.env의 VITE_RAPIDO_CONTENT_URL 으로 덮어쓰기 가능)
export const RAPIDO_CONTENT_URL =
  import.meta.env.VITE_RAPIDO_CONTENT_URL ||
  'https://www.latpeed.com/spaces/0/products/editor?product_short_id=oYzwz&type=link&content_closed=true'
// 비대면 상담 버튼 스타일 — 항상 검정(ink)
export const CONSULT_BUTTON_CLASS =
  'inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-edge transition hover:bg-zinc-800'
// 바로 진단하기 버튼 스타일 — 항상 검정(ink)
export const DIAGNOSIS_CTA_CLASS =
  'inline-flex items-center justify-center rounded-full bg-ink text-white shadow-edge transition hover:bg-zinc-800'
