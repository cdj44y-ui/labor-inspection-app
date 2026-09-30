import { Link, useLocation } from 'react-router-dom'

/** 전체 페이지 공통 고정(floating) 상담 신청 버튼 — 검정 CTA, 우하단 고정 */
export default function FloatingConsultButton() {
  const { pathname } = useLocation()
  // 상담 신청 페이지 자체에서는 숨김(이미 해당 페이지에 있으므로 중복 방지)
  if (pathname === '/contact' || pathname === '/c/consult') return null

  return (
    <Link
      to="/contact"
      className="btn-black-cta fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold shadow-[0_8px_24px_rgba(10,10,10,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(10,10,10,0.4)] sm:bottom-6 sm:right-6 sm:px-6 sm:py-4 sm:text-base"
      aria-label="상담 신청하기"
    >
      <span aria-hidden>💬</span>
      <span>상담 신청</span>
    </Link>
  )
}
