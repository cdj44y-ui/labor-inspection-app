/** 형제 사이트 — audit119.site 연결 완료(2026-10-18) */
export const AUDIT119_URL = 'https://www.audit119.site'
export const FAMILY_SITES = [
  { key: 'RISK119', name: '근로감독 자가진단', desc: '임금·근로시간·연차·4대보험, 감독관이 보는 항목 점검', url: 'https://risk119.site' },
  { key: 'SAFE119', name: '중대재해처벌법 자가진단', desc: '경영책임자 의무와 위험성평가, 수사에서 보는 기록 점검', url: 'https://safe119.site' },
  { key: 'FREE119', name: '근로자성 자가진단', desc: '3.3% 프리랜서 계약이 근로관계로 판단될지 점검', url: 'https://free119.site' },
  { key: 'AUDIT119', name: '직장 내 괴롭힘 독립조사', desc: '사내 조사체계 진단과 외부 독립조사', url: AUDIT119_URL },
]

export default function FamilySites() {
  return (
    <section className="border-t border-[#DDE2EA] bg-[#F5F7FA] py-10 text-left">
      <div className="mx-auto max-w-[1120px] px-6 md:px-8">
        <p className="text-[15px] font-bold text-[#5B6680]">노무법인 위너스 진단 서비스</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILY_SITES.map((s) => {
            const self = s.key === 'RISK119'
            return (
              <a key={s.key} href={s.url} target={self ? undefined : '_blank'} rel="noopener noreferrer" aria-current={self ? 'page' : undefined}
                className={'block rounded-[12px] border p-5 text-left transition-colors ' + (self ? 'border-[#14213D] bg-[#14213D] text-white' : 'border-[#DDE2EA] bg-white text-[#14213D] hover:border-[#1B2A44]')}>
                <p className="text-[17px] font-extrabold tracking-[-0.2px]">{s.key.replace('119', '')}<span className={self ? 'text-[#90CAF9]' : 'text-[#1B2A44]'}>119</span>{self ? <span className="ml-2 align-middle text-[12px] font-bold text-[#90CAF9]">현재 사이트</span> : null}</p>
                <p className="mt-1 text-[15px] font-bold">{s.name}</p>
                <p className={'mt-1.5 text-[14px] leading-[1.6] ' + (self ? 'text-[#C9D1E0]' : 'text-[#5B6680]')}>{s.desc}</p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
