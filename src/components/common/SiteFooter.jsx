import FamilySites from './FamilySites.jsx'
import { FAMILY, FAMILY_NAME, PROMISE, DISCLAIMER, KAKAO_URL } from '../../constants/brand.js'

/** A5 푸터 — 네 사이트 동일 문구·순서 (브랜드 v1.1) */
export default function SiteFooter() {
  return (
    <>
      <FamilySites />
      <footer className="border-t border-[#E5E7EB] bg-white py-10 text-[15px] leading-[1.75] text-[#4B5563] [word-break:keep-all]">
        <div className="mx-auto max-w-[1120px] space-y-2 px-6 md:px-8">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <b className="text-[#1F4E79]">{FAMILY_NAME}</b>
            <a href="https://win119.site" className="font-bold text-[#1F4E79] no-underline hover:underline">회사 소개</a>
            {FAMILY.map((f) => <a key={f.key} href={f.url} target="_blank" rel="noopener noreferrer" className="text-[#4B5563] no-underline hover:text-[#1F4E79] hover:underline">{f.label}</a>)}
          </p>
          <p className="font-semibold text-[#111827]">{PROMISE}</p>
          <p>노무법인 위너스 | 대표노무사 조대진 | 사업자등록번호 134-85-60666</p>
          <p>서울시 강서구 마곡중앙로 171, 304호 | Tel. <a href="tel:0221380240" className="text-[#4B5563]">02-2138-0240</a> | Email. <a href="mailto:cdj44y@gmail.com" className="break-all text-[#4B5563]">cdj44y@gmail.com</a></p>
          <p className="text-[14px] text-[#6B7280]">{DISCLAIMER}</p>
          <p className="pt-1">
            <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE500] px-4 py-1.5 text-[14px] font-bold text-[#391B1B] no-underline hover:bg-[#F5D800]">💬 법 바뀌기 전에 먼저 알기 — 채널 추가</a>
          </p>
          <p className="text-[14px] text-[#6B7280]">© 2026 노무법인 위너스</p>
        </div>
      </footer>
    </>
  )
}
