import { FAMILY, FAMILY_NAME, SITE_NAME } from '../../constants/brand.js'

/** A1 상단 패밀리 바 — 네 사이트 공통(높이 40px, 흰 바탕) */
export default function FamilyBar() {
  return (
    <div className="no-print h-10 border-b border-[#E5E7EB] bg-white text-[14px] [word-break:keep-all]" style={{ fontFamily: "'Pretendard', system-ui, sans-serif" }}>
      <div className="mx-auto flex h-10 max-w-[1120px] items-center justify-between gap-4 px-5 md:px-8">
        <p className="truncate text-[#111827]"><b className="text-[#1F4E79]">{FAMILY_NAME}</b> · <b>{SITE_NAME}</b></p>
        <nav className="hidden items-center gap-5 md:flex">
          {FAMILY.filter((f) => f.key !== SITE_NAME).map((f) => (
            <a key={f.key} href={f.url} target="_blank" rel="noopener noreferrer" className="text-[#4B5563] no-underline hover:text-[#1F4E79] hover:underline">{f.label}</a>
          ))}
        </nav>
      </div>
    </div>
  )
}
