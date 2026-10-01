/**
 * @param {{ scenarios: { scenario: string, question: string, penaltyDetail: string }[] }} props
 */
export default function InspectionScenario({ scenarios }) {
  if (!scenarios.length) return null

  return (
    <section className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-ink md:text-base">위험 시나리오 TOP {scenarios.length}</h2>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-caution/10 px-2.5 py-1 text-[11px] font-semibold text-caution">
          📖 적발 스토리
        </span>
      </div>
      <p className="mt-1 text-sm text-zinc-700">
        실제 근로감독에서 벌어질 수 있는 상황을 서사형으로 재구성했습니다. 미충족 항목 중 예상 제재 규모가 큰 순으로
        정리했습니다.
      </p>
      <ol className="mt-4 space-y-4">
        {scenarios.map((s, i) => (
          <li key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Scenario {i + 1}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{s.question}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-800">{s.scenario}</p>
            <p className="mt-2 text-xs text-zinc-600">⚠️ {s.penaltyDetail}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
