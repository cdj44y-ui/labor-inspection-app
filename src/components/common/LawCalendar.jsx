import { useEffect, useState } from 'react'
import { VERIFIED_DATE, SITE_COLOR } from '../../constants/brand.js'

/** D3 법 개정 한 장 — 네 사이트 공통 데이터·모양 */
export const LAW_ITEMS = [
  { date: '2026.10.08', status: '시행', title: '임금 정기지급·체불 등 위반 처벌 상향(3년·3천만원 → 5년·5천만원)', basis: '근로기준법 제107조(법률 제21533호)' },
  { date: '2027.04.28', status: '공포 · 시행 예정', title: '반복 산재 사망(1년간 3명 이상) 사업장 영업이익 최대 5% 과징금·작업중지 범위 확대·등록말소요청', basis: '산업안전보건법 개정 법률 제22122호(2026.10.27 공포)' },
  { date: '2027.01.28', status: '시행 예정', title: '안전한일터위원회 신설·신고포상금 지급 근거', basis: '산업안전보건법 제7조의2·제158조의2(법률 제22122호)' },
  { date: '2026.12.08', status: '시행 예정', title: '근로감독관 명칭 → 노동감독관', basis: '근로기준법 제101조(법률 제21533호)' },
  { date: '2027.01.01', status: '시행 예정', title: '위험성평가 미이행 과태료(상시 50명 이상, 건설업 공사금액 50억원 이상)', basis: '산업안전보건법 제175조, 시행령 [별표 35]' },
  { date: '2027.01.08', status: '시행 예정', title: '외국인 근로자 기초안전보건교육 의무화', basis: '산업안전보건법 제31조의2' },
  { date: '2028.01.01', status: '시행 예정', title: '위험성평가 미이행 과태료(상시 50명 미만)', basis: '산업안전보건법 제175조, 시행령 [별표 35]' },
  { date: '입법 전', status: '국회 계류', title: '근로자 추정제(일하는 사람을 근로자로 추정, 반증 책임은 사업주)', basis: '근로기준법 개정안(2025.12.24 발의 등)' },
]

const statusColor = (s) => (s === '시행' ? '#111827' : s === '시행 예정' ? SITE_COLOR : '#6B7280')
const LAW_URL = 'https://win119.site/data/law-changes.json'

export default function LawCalendar({ id = 'law' }) {
  const [items, setItems] = useState(LAW_ITEMS)
  const [verified, setVerified] = useState(VERIFIED_DATE)

  useEffect(() => {
    let alive = true
    fetch(LAW_URL, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad status'))))
      .then((json) => {
        if (!alive || !json || !Array.isArray(json.items)) return
        const list = json.items.filter((i) => Array.isArray(i.sites) && i.sites.includes('risk'))
        if (list.length > 0) {
          setItems(list)
          if (json.verifiedAt) setVerified(json.verifiedAt)
        }
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  return (
    <section id={id} className="border-t border-[#E5E7EB] bg-[#F9FAFB] py-4 text-[#111827] [word-break:keep-all]">
      <div className="mx-auto max-w-[1120px] px-6 md:px-8">
        <details>
          <summary className="flex min-h-[48px] cursor-pointer items-center text-[19px] font-bold leading-[1.45] md:text-[20px]">
            앞으로 달라지는 노동·안전 법령 · {items.length}건 (원문 대조 {verified})
          </summary>
          <p className="mt-2 text-[16px] text-[#6B7280]">국가법령정보센터 원문 대조 · 시행 전 법령은 시행일 표기</p>
          <div className="mt-4 border-t-2 border-[#111827]">
            {items.map((r) => (
              <div key={r.date + r.title} className="grid gap-1.5 border-b border-[#E5E7EB] py-5 md:grid-cols-[130px_150px_1fr] md:items-baseline md:gap-6">
                <p className="text-[18px] font-bold tabular-nums">{r.date}</p>
                <p className="text-[15px] font-bold" style={{ color: statusColor(r.status) }}>{r.status}</p>
                <div>
                  <p className="text-[18px] font-bold leading-[1.55]">{r.title}</p>
                  <p className="mt-0.5 text-[15px] text-[#6B7280]">{r.basis}</p>
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  )
}
