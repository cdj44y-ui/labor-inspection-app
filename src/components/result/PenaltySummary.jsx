/**
 * @param {{
 *   totalManwon: number,
 *   fineSum: number,
 *   adminSum: number,
 *   industryHint: { percentile: string, hint: string }
 * }} props
 */
export default function PenaltySummary({ totalManwon, fineSum, adminSum, industryHint }) {
  const fmt = (n) => Math.round(n).toLocaleString('ko-KR')

  return (
    <div className="rounded-2xl border-2 border-amber-200/80 bg-amber-50/90 p-5 shadow-sm">
      <p className="text-xs font-bold text-amber-900">⚠️ 근로감독 적발 시 예상 과태료·벌금 합계(참고)</p>
      <p className="mt-1 text-[11px] leading-relaxed text-amber-950/80">
        항목별 최대 제재 수준을 단순 합산한 추정치이며, 실제 과태료·벌금은 사업장 규모·위반 정도에 따라 달라질 수
        있습니다.
      </p>
      <div className="mt-4 rounded-xl border border-amber-200 bg-white px-4 py-5 text-center">
        <p className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">약 {fmt(totalManwon)}만원</p>
        <p className="mt-2 text-xs text-zinc-700">
          (과태료 {fmt(adminSum)}만원 + 벌금 {fmt(fineSum)}만원)
        </p>
      </div>
      <div className="mt-4 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-[11px] text-zinc-800">
        <span className="font-semibold text-ink">동종업계 비교(추정):</span> {industryHint.percentile} —{' '}
        {industryHint.hint}
      </div>
    </div>
  )
}
