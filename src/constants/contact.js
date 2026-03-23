// 사이트 도메인 (RISK119.SITE)
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://risk119.site'
/** Calendly 15분 무료 상담 URL — `VITE_CALENDLY_URL` 로 덮어쓰기 */
export const CALENDLY_URL =
  (typeof import.meta.env.VITE_CALENDLY_URL === 'string' && import.meta.env.VITE_CALENDLY_URL.trim()) ||
  'https://calendly.com/cdj44y/15min'
/** Formspree 폼 ID (f/ 뒤) — 설정 시 결과 페이지 이메일 CTA 활성화 */
export const FORMSPREE_FORM_ID =
  typeof import.meta.env.VITE_FORMSPREE_ID === 'string' ? import.meta.env.VITE_FORMSPREE_ID.trim() : ''
/** FREE119 근로자성 진단 (상호 링크) */
export const FREE119_SITE_URL =
  (typeof import.meta.env.VITE_FREE119_URL === 'string' && import.meta.env.VITE_FREE119_URL.trim()) ||
  'https://free119.site'
// 연락처·온라인 상담 URL (랜딩·결과 페이지 공통)
export const CONTACT_PHONE = '02-2138-0240'
/** 비대면 상담 Notion — `VITE_NOTION_REMOTE_CONSULT_URL` 로 덮어쓰기 가능 */
export const NOTION_REMOTE_CONSULT_URL =
  (typeof import.meta.env.VITE_NOTION_REMOTE_CONSULT_URL === 'string' &&
    import.meta.env.VITE_NOTION_REMOTE_CONSULT_URL.trim()) ||
  'https://north-saffron-5b7.notion.site/cc7a5b60e4104ef697435cbf880d8341'
// 비대면 상담 플랜 ID (Supabase plans.id — 결제 연동용)
export const CONSULT_PLAN_ID = 'a0000000-0000-0000-0000-000000000001'
// 결제 완료 후 비대면 상담 진행 URL — 래피드(Latpeed) (.env의 VITE_RAPIDO_CONTENT_URL 으로 덮어쓰기 가능)
export const RAPIDO_CONTENT_URL =
  import.meta.env.VITE_RAPIDO_CONTENT_URL ||
  'https://www.latpeed.com/spaces/0/products/editor?product_short_id=oYzwz&type=link&content_closed=true'
// 버튼 공통: 검정/토스 블루 (index.css .btn-black-cta / .btn-toss-cta와 연동)
const BLACK_BTN_BASE =
  'btn-black-cta inline-flex items-center justify-center rounded-full text-white shadow-edge transition no-underline cursor-pointer'
const BLACK_BTN_STATES =
  'hover:bg-zinc-800 hover:!text-white active:bg-zinc-800 active:!text-white focus:bg-[#0a0a0a] focus:!text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 visited:!text-white'

const TOSS_BTN_BASE =
  'btn-toss-cta inline-flex items-center justify-center rounded-full text-white shadow-edge transition no-underline cursor-pointer'
const TOSS_BTN_STATES =
  'hover:!text-white active:!text-white focus:!text-white focus:outline-none focus:ring-2 focus:ring-toss focus:ring-offset-2 visited:!text-white'

// 비대면 상담 버튼 — 검정
export const CONSULT_BUTTON_CLASS =
  BLACK_BTN_BASE + ' px-6 py-3 text-sm font-bold ' + BLACK_BTN_STATES
// 바로 진단하기 버튼 — 토스 블루 포인트
export const DIAGNOSIS_CTA_CLASS =
  TOSS_BTN_BASE + ' ' + TOSS_BTN_STATES
