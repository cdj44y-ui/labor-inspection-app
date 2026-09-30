export default function CrossRecommendation({ violations }) {
  const hasSafetyIssue = violations.some((v) => v.categoryId === 3)
  const hasWorkerClassificationIssue = violations.some(
    (v) => v.question?.includes('4대보험 가입') || v.question?.includes('위장도급'),
  )

  if (!hasSafetyIssue && !hasWorkerClassificationIssue) return null

  return (
    <section className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-7">
      <h2 className="mb-3 text-sm font-bold text-ink md:text-base">함께 확인하면 좋은 진단</h2>
      <div className="space-y-3">
        {hasSafetyIssue && (
          <a
            href="https://safe119.site"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:bg-zinc-100"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-extrabold text-amber-700">
              S119
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">산업안전보건 항목에서 미충족이 발견됐습니다</p>
              <p className="mt-0.5 text-sm text-zinc-700">
                중대재해처벌법상 안전보건관리체계 의무까지 함께 확인하려면 SAFE119에서 무료로 점검해보세요.
              </p>
            </div>
            <span className="shrink-0 text-zinc-400">→</span>
          </a>
        )}
        {hasWorkerClassificationIssue && (
          <a
            href="https://free119.site"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:bg-zinc-100"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-700">
              F119
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">4대보험·도급 형태 관련 항목에서 미충족이 발견됐습니다</p>
              <p className="mt-0.5 text-sm text-zinc-700">
                계약직·프리랜서 인력의 근로자성 여부를 FREE119에서 무료로 점검해보세요.
              </p>
            </div>
            <span className="shrink-0 text-zinc-400">→</span>
          </a>
        )}
      </div>
    </section>
  )
}