import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  WORKER_STATUS_QUESTIONS,
  WORKER_STATUS_STORAGE_KEY,
} from '../data/workerStatusData.js'
import {
  getWorkerStatusPercent,
  getWorkerStatusVerdict,
  getWorkerStatusCategoryBreakdown,
  getPresumptionChecklist,
} from '../utils/workerStatusScore.js'
import {
  CONTACT_PHONE,
  CONSULT_BUTTON_CLASS,
  DIAGNOSIS_CTA_CLASS,
  NOTION_REMOTE_CONSULT_URL,
} from '../constants/contact.js'

function verdictBarColor(id) {
  if (id === 'worker') return 'bg-danger'
  if (id === 'gray') return 'bg-caution'
  return 'bg-safe'
}

export default function WorkerStatusResult() {
  const [answers, setAnswers] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem(WORKER_STATUS_STORAGE_KEY)
      setAnswers(s ? JSON.parse(s) : null)
    } catch {
      setAnswers(null)
    }
  }, [])

  if (!answers || !Array.isArray(answers) || answers.length !== WORKER_STATUS_QUESTIONS.length) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <div className="relative mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-10">
          <div className="w-full rounded-3xl border-2 border-zinc-200 bg-white p-8 text-center shadow-edge md:p-10">
            <p className="mb-3 text-base font-bold text-ink">근로자성 진단 결과가 없습니다</p>
            <p className="mb-8 text-sm text-zinc-800">
              문항에 모두 응답하면 종합 점수, 영역별 분석, 추정제 대비 체크리스트를 볼 수 있습니다.
            </p>
            <Link
              to="/worker-status"
              className={'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold ' + DIAGNOSIS_CTA_CLASS}
            >
              근로자성 진단 시작
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const pct = getWorkerStatusPercent(answers)
  const verdict = getWorkerStatusVerdict(pct)
  const breakdown = getWorkerStatusCategoryBreakdown(answers)
  const presumption = getPresumptionChecklist(answers)

  const handleCopy = async () => {
    const lines = [
      `근로자성 자가진단 요약 (추정제·감독 대비 참고)`,
      `- 종합: ${pct} / 100 (${verdict.title})`,
      `- 핵심 5지표 충족: ${presumption.metCount} / 5`,
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (_) {}
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3 shadow-edge md:mb-8 md:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-white text-[11px] font-bold text-ink">
              W
            </span>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                Worker status report
              </span>
              <p className="text-sm font-bold text-ink">근로자성 · 추정제 대비 리포트</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/worker-status"
              className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
            >
              진단으로
            </Link>
            <Link to="/" className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50">
              홈
            </Link>
          </div>
        </header>

        <section className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-extrabold tracking-tight text-ink md:text-2xl">종합 근로자성 지수</h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-800">
                0에 가까울수록 독립 사업·프리랜서 쪽, 100에 가까울수록 근로자성(사용종속) 쪽 해석이 강해집니다.
                임계값 40·65는 참고용입니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-[12px] font-semibold text-zinc-800 transition hover:bg-zinc-50"
                >
                  {copied ? '복사됨' : '요약 복사'}
                </button>
                <a
                  href={NOTION_REMOTE_CONSULT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CONSULT_BUTTON_CLASS + ' no-underline visited:text-white text-center inline-flex items-center justify-center rounded-full px-4 py-2 text-[12px] font-semibold'}
                >
                  비대면 상담
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center md:min-w-[200px]">
              <p
                className={`text-5xl font-black tabular-nums md:text-6xl ${
                  verdict.id === 'worker'
                    ? 'text-danger'
                    : verdict.id === 'gray'
                      ? 'text-caution'
                      : 'text-safe'
                }`}
              >
                {pct}
                <span className="ml-1 text-xl font-semibold text-zinc-500">/ 100</span>
              </p>
              <div className="mt-3 h-3 w-full max-w-[240px] overflow-hidden rounded-full bg-zinc-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${verdictBarColor(verdict.id)}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <p className="mt-2 text-center text-[10px] text-zinc-500">
                0 사업자 —— 40~65 회색 —— 100 근로자
              </p>
            </div>
          </div>

          <div
            className={`mt-8 rounded-2xl border-2 px-5 py-6 text-center text-white ${
              verdict.id === 'worker'
                ? 'border-red-800 bg-gradient-to-br from-red-900 to-red-600'
                : verdict.id === 'gray'
                  ? 'border-amber-800 bg-gradient-to-br from-amber-900 to-amber-600'
                  : 'border-emerald-800 bg-gradient-to-br from-emerald-900 to-emerald-600'
            }`}
          >
            <p className="text-lg font-black md:text-xl">{verdict.title}</p>
            <p className="mx-auto mt-2 max-w-xl text-sm opacity-95">{verdict.body}</p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-7">
          <h2 className="text-sm font-bold text-ink md:text-base">영역별 분석</h2>
          <p className="mb-4 text-[11px] text-zinc-600">각 영역 내 가중합 대비 비율입니다.</p>
          <div className="space-y-3">
            {breakdown.map((row) => {
              const g =
                row.pct >= 65 ? 'danger' : row.pct >= 40 ? 'caution' : 'safe'
              const bar = g === 'danger' ? 'bg-danger' : g === 'caution' ? 'bg-caution' : 'bg-safe'
              return (
                <div key={row.name} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-xs font-medium text-zinc-600 md:w-44">
                    {row.short}
                  </span>
                  <div className="flex-1 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${bar}`}
                      style={{ width: `${Math.min(100, row.pct)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-xs font-bold text-zinc-800">
                    {row.pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border-2 border-indigo-200 bg-indigo-50/60 p-6 shadow-edge md:p-7">
          <h2 className="text-sm font-bold text-indigo-900 md:text-base">근로자 추정제 대비 · 핵심 5지표 (참고)</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-indigo-950/90">
            실제 입법안이 확정되면 기준이 달라질 수 있습니다. 아래는 자가진단용으로, 문항 점수 3 이상이면
            ‘충족’으로 표시합니다.
          </p>
          <p className="mt-3 text-sm font-semibold text-indigo-900">
            충족 {presumption.metCount} / 5
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {presumption.items.map((it) => (
              <span
                key={it.qid}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                  it.met
                    ? 'border-emerald-300 bg-emerald-100 text-emerald-900'
                    : 'border-zinc-200 bg-white text-zinc-600'
                }`}
              >
                {it.met ? '✓' : '✗'} {it.label}
              </span>
            ))}
          </div>
          {presumption.metCount >= 3 ? (
            <p className="mt-4 text-[12px] leading-relaxed text-indigo-950">
              핵심 지표가 다수 충족됩니다. 추정제 도입 시 사용자 측 반증 부담이 커질 수 있는 유형으로{' '}
              <strong>사전에 실질관계·계약·증빙을 정리</strong>해 두는 것이 유리합니다.
            </p>
          ) : (
            <p className="mt-4 text-[12px] leading-relaxed text-indigo-950">
              핵심 지표 충족이 적습니다. 다만 종합 점수·개별 사실관계에 따라 달라질 수 있으므로 회색지대는 전문가
              상담을 권합니다.
            </p>
          )}
        </section>

        <section className="mt-6 rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-7">
          <h2 className="text-sm font-bold text-ink md:text-base">다음 액션 (참고)</h2>
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-zinc-800">
            {verdict.id === 'worker' && (
              <>
                <li>· 실질 지휘·감독, 근태·보수 구조를 문서화하고 위장도급 시비를 줄이세요.</li>
                <li>· 4대보험·퇴직금·연차 등 적용 여부를 노무 전문가와 점검하세요.</li>
              </>
            )}
            {verdict.id === 'gray' && (
              <>
                <li>· 업무지시·근태·보수 명세·메신저 기록 등 객관적 증빙을 확보하세요.</li>
                <li>· 계약 명칭과 실질관계의 괴리를 줄이는 방향으로 관계를 재설계하세요.</li>
              </>
            )}
            {verdict.id === 'freelancer' && (
              <>
                <li>· 독립성(장소·시간·다수 거래처·대체 수행)을 계약·실무 모두에서 유지하세요.</li>
                <li>· 산재 특례·고용보험 임의가입 등 사회안전망을 별도 검토하세요.</li>
              </>
            )}
          </ul>
        </section>

        <section className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/worker-status"
            className={'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold ' + DIAGNOSIS_CTA_CLASS}
          >
            다시 진단하기
          </Link>
          <Link
            to="/diagnosis"
            className="inline-flex items-center justify-center rounded-full border-2 border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-ink hover:bg-zinc-50"
          >
            근로감독 진단
          </Link>
        </section>

        <section className="mt-6 rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Labor Risk Partner</p>
              <h2 className="mt-1 text-base font-bold text-ink md:text-lg">노무법인 위너스 조대진 노무사</h2>
              <p className="mt-2 text-[11px] text-zinc-800">
                근로자성·위장도급·플랫폼 노무 이슈는 사실관계 정리가 핵심입니다.
              </p>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="mt-3 inline-block text-sm font-bold text-toss underline"
              >
                {CONTACT_PHONE}
              </a>
            </div>
            <a
              href={NOTION_REMOTE_CONSULT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={CONSULT_BUTTON_CLASS + ' no-underline visited:text-white text-center inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold'}
            >
              비대면 상담
            </a>
          </div>
        </section>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-950">
          <strong>면책</strong> 본 결과는 판례·가이드라인을 참고한 자가진단이며 법적 효력이 없습니다. 근로자 추정제
          입법·시행령·행정해석은 변동될 수 있습니다.
        </div>
      </div>
    </div>
  )
}
