const UPDATES = [
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
