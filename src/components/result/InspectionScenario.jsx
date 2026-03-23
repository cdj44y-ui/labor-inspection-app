/**
 * @param {{ scenarios: { scenario: string, question: string, penaltyDetail: string }[] }} props
 */
export default function InspectionScenario({ scenarios }) {
  if (!scenarios.length) return null

  return (
    <section className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-7">
      <h2 className="text-sm font-bold text-ink md:text-base">위험 시나리오 TOP {scenarios.length}</h2>
      <p className="mt-1 text-[11px] text-zinc-700">미충족 항목 중 예상 제재 규모가 큰 순으로 정리했습니다.</p>
      <ol className="mt-4 space-y-4">
        {scenarios.map((s, i) => (
          <li key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Scenario {i + 1}</p>
            <p className="mt-1 text-[12px] font-semibold text-ink">{s.question}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-800">{s.scenario}</p>
            <p className="mt-2 text-[10px] text-zinc-600">⚠️ {s.penaltyDetail}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
