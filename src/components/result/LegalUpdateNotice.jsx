const UPDATES = [
  {
    date: '2026.10.08',
    text: '근로기준법 벌칙 조항 개편 시행(법률 제21533호) — 임금 정기지급(제43조)·임금체불(제36조) 등 위반 시 형사처벌이 제109조(3년/3천만원)에서 제107조(5년/5천만원)로 상향·이관됨에 따라 관련 문항의 처벌 수위를 갱신했습니다.',
  },
  {
    date: '2026.10.01',
    text: '[입법 동향] 국회 본회의, 1년간 산재 사망 3명 이상 발생 사업장에 영업이익 최대 5% 과징금을 부과하는 산업안전보건법 개정안 통과(작업중지권 행사 요건도 확대). 아직 공포·시행 전이며, 구체적 부과기준은 하위법령에서 정해질 예정입니다.',
  },
  {
    date: '2026.09.22',
    text: '남녀고용평등법 조문 인용 정정 — 육아기 근로시간 단축 근거조문을 최신 조문(제19조의2)으로 업데이트',
  },
  {
    date: '2026.09.21',
    text: '남녀고용평등법 개정 반영 — 배우자 출산전후휴가 확대(출산 예정일 50일 전~출산 후 120일), 단기 육아휴직 신설 안내 추가',
  },
]

export default function LegalUpdateNotice() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 md:px-6 md:py-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-toss text-[11px] font-bold text-white">
          ✓
        </span>
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600">법령 업데이트 반영 현황</h2>
      </div>
      <ul className="mt-3 space-y-2">
        {UPDATES.map((u, i) => (
          <li key={i} className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
            <span className="shrink-0 font-mono text-xs text-zinc-500">{u.date}</span>
            <span className="text-zinc-800">{u.text}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-zinc-500">
        본 진단 문항의 법령 근거는 매일 노동관계 법령 개정 여부를 점검해 최신 상태로 유지합니다.
      </p>
    </section>
  )
}
