import { FAMILY, FAMILY_NAME, SITE_NAME } from '../../constants/brand.js'

/** 2026-10-18 고객 2층 분리: 사업주 라인(RISK·SAFE·FREE·1분 상담소)만 상단에 표시. AUDIT119·리더 강의는 푸터와 회사 소개에서 연결 */
const TIER_LINKS = [
  { key: 'RISK119', label: 'RISK119 근로감독', url: 'https://risk119.site' },
  { key: 'SAFE119', label: 'SAFE119 중대재해', url: 'https://safe119.site' },
  { key: 'FREE119', label: 'FREE119 근로자성', url: 'https://free119.site' },
  { key: 'SANGDAMSO', label: '사장님 1분 상담소', url: 'https://risk119.site/sangdamso' },
]

/** A1 상단 패밀리 바 — 네 사이트 공통(높이 40px, 흰 바탕). 회사 소개: /winners.html */
export default function FamilyBar() {
  return (
    <div className="no-print h-10 border-b border-[#E5E7EB] bg-white text-[14px] [word-break:keep-all]" style={{ fontFamily: "'Pretendard', system-ui, sans-serif" }}>
      <div className="mx-auto flex h-10 max-w-[1120px] items-center justify-between gap-4 px-5 md:px-8">
        <p className="truncate text-[#111827]"><a href="/winners.html" className="font-bold text-[#1F4E79] no-underline hover:underline">{FAMILY_NAME}</a> · <b>{SITE_NAME}</b></p>
        <nav className="flex shrink-0 items-center gap-5">
          <a href="/winners.html" className="font-bold text-[#1F4E79] no-underline hover:underline">회사 소개</a>
          {TIER_LINKS.filter((f) => f.key !== SITE_NAME).map((f) => (
            <a key={f.key} href={f.url} target="_blank" rel="noopener noreferrer" className="hidden text-[#4B5563] no-underline hover:text-[#1F4E79] hover:underline md:inline">{f.label}</a>
          ))}
        </nav>
      </div>
    </div>
  )
}
