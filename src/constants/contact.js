// 사이트 도메인 (RISK119.SITE)
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://risk119.site'
// 연락처·온라인 상담 URL (랜딩·결과 페이지 공통)
export const CONTACT_PHONE = '02-2138-0240'
// 비대면 상담 플랜 ID (Supabase plans.id — 결제 연동용)
export const CONSULT_PLAN_ID = 'a0000000-0000-0000-0000-000000000001'
// 결제 완료 후 비대면 상담 진행 URL — 래피드(Latpeed) (.env의 VITE_RAPIDO_CONTENT_URL 으로 덮어쓰기 가능)
export const RAPIDO_CONTENT_URL =
  import.meta.env.VITE_RAPIDO_CONTENT_URL ||
  'https://www.latpeed.com/spaces/0/products/editor?product_short_id=oYzwz&type=link&content_closed=true'
// 검정 버튼 공통 — 가독성 최우선, 마우스 없이도 흰 글자 확실 (index.css .btn-black-cta와 연동)
const BLACK_BTN_BASE =
  'btn-black-cta inline-flex items-center justify-center rounded-full bg-[#0a0a0a] text-white shadow-edge transition no-underline cursor-pointer'
const BLACK_BTN_STATES =
  'hover:bg-zinc-800 hover:!text-white active:bg-zinc-800 active:!text-white focus:bg-[#0a0a0a] focus:!text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 visited:!text-white'
// 비대면 상담 버튼
export const CONSULT_BUTTON_CLASS =
  BLACK_BTN_BASE + ' px-6 py-3 text-sm font-bold ' + BLACK_BTN_STATES
// 바로 진단하기 버튼
export const DIAGNOSIS_CTA_CLASS =
  BLACK_BTN_BASE + ' ' + BLACK_BTN_STATES
