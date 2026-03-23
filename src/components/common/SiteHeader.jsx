import { Link } from 'react-router-dom'
import { DIAGNOSIS_CTA_CLASS } from '../../constants/contact.js'

export default function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-300/80 bg-white px-4 py-3 shadow-card md:px-6">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink bg-white text-xs font-extrabold text-ink">
          R
        </span>
        <span className="text-[15px] font-bold tracking-tight text-ink">RISK119</span>
      </Link>
      <nav className="flex flex-wrap items-center gap-4 text-[13px] md:gap-6">
        <Link to="/diagnosis" className="font-medium text-zinc-800 transition hover:text-ink">
          자가진단
        </Link>
        <Link to="/about" className="font-medium text-zinc-800 transition hover:text-ink">
          전문가소개
        </Link>
        <Link to="/contact" className="font-medium text-zinc-800 transition hover:text-ink">
          상담신청
        </Link>
        <Link
          to="/diagnosis"
          className={`hidden rounded-full px-4 py-2 text-xs font-bold sm:inline-flex ${DIAGNOSIS_CTA_CLASS}`}
        >
          무료로 우리 회사 리스크 확인하기
        </Link>
      </nav>
    </header>
  )
}
