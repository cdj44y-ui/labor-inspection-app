import { VERIFIED_DATE, SITE_COLOR } from '../../constants/brand.js'

/** D3 법 개정 한 장 — 네 사이트 공통 데이터·모양 */
export const LAW_ITEMS = [
  { date: '2026.10.08', status: '시행', title: '임금 정기지급·체불 등 위반 처벌 상향(3년·3천만원 → 5년·5천만원)', basis: '근로기준법 제107조(법률 제21533호)' },
  { date: '2026.10.01', status: '국회 통과 · 공포 전', title: '반복 산재 사망 사업장 영업이익 최대 5% 과징금', basis: '산업안전보건법 개정안' },
  { date: '2026.12.08', status: '시행 예정', title: '근로감독관 명칭 → 노동감독관', basis: '근로기준법 제101조(법률 제21533호)' },
  { date: '2027.01.01', status: '시행 예정', title: '위험성평가 미이행 과태료(상시 50명 이상, 건설업 공사금액 50억원 이상)', basis: '산업안전보건법 제175조, 시행령 [별표 35]' },
  { date: '2027.01.08', status: '시행 예정', title: '외국인 근로자 기초안전보건교육 의무화', basis: '산업안전보건법 제31조의2' },
  { date: '2028.01.01', status: '시행 예정', title: '위험성평가 미이행 과태료(상시 50명 미만)', basis: '산업안전보건법 제175조, 시행령 [별표 35]' },
  { date: '입법 전', status: '국회 계류', title: '근로자 추정제(일하는 사람을 근로자로 추정, 반증 책임은 사업주)', basis: '근로기준법 개정안(2025.12.24 발의 등)' },
]

const statusColor = (s) => (s === '시행' ? '#111827' : s === '시행 예정' ? SITE_COLOR : '#6B7280')

export default function LawCalendar({ id = 'law' }) {
  return (
    <section id={id} className="border-t border-[#E5E7EB] bg-[#F9FAFB] py-16 text-[#111827] [word-break:keep-all] md:py-[88px]">
      <div className="mx-auto max-w-[1120px] px-6 md:px-8">
        <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[36px]">앞으로 달라지는 노동·안전 법령</h2>
        <p className="mt-2.5 text-[17px] text-[#6B7280] md:text-[18px]">국가법령정보센터 원문 대조 {VERIFIED_DATE} · 시행 전 법령은 시행일 표기</p>
        <div className="mt-10 border-t-2 border-[#111827]">
          {LAW_ITEMS.map((r) => (
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
      </div>
    </section>
  )
}
