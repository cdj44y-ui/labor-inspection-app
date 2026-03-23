import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  WORKER_STATUS_QUESTIONS,
  WORKER_STATUS_CATEGORIES,
  WORKER_STATUS_STORAGE_KEY,
} from '../data/workerStatusData.js'
import { DIAGNOSIS_CTA_CLASS } from '../constants/contact.js'

const optTagClass = {
  high: 'bg-red-50 text-red-700 border-red-200',
  mid: 'bg-amber-50 text-amber-900 border-amber-200',
  low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  zero: 'bg-zinc-100 text-zinc-600 border-zinc-200',
}

export default function WorkerStatusDiagnosis() {
  const navigate = useNavigate()
  const [showHint, setShowHint] = useState(true)
  const [answers, setAnswers] = useState(() => {
    try {
      const s = localStorage.getItem(WORKER_STATUS_STORAGE_KEY)
      if (s) {
        const parsed = JSON.parse(s)
        if (Array.isArray(parsed) && parsed.length === WORKER_STATUS_QUESTIONS.length) return parsed
      }
    } catch (_) {}
    return WORKER_STATUS_QUESTIONS.map(() => null)
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoAdvance, setAutoAdvance] = useState(true)

  useEffect(() => {
    try {
      localStorage.setItem(WORKER_STATUS_STORAGE_KEY, JSON.stringify(answers))
    } catch (_) {}
  }, [answers])

  const currentQ = WORKER_STATUS_QUESTIONS[currentIndex]
  const answeredCount = answers.filter((a) => a != null).length
  const progress = WORKER_STATUS_QUESTIONS.length
    ? Math.round((answeredCount / WORKER_STATUS_QUESTIONS.length) * 100)
    : 0

  const setOption = (optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = optionIndex
      return next
    })
    if (autoAdvance && currentIndex < WORKER_STATUS_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }
  const goNext = () => {
    if (currentIndex < WORKER_STATUS_QUESTIONS.length - 1) setCurrentIndex((i) => i + 1)
  }

  const categoryAllDone = WORKER_STATUS_CATEGORIES.map((_, cid) => {
    const indices = WORKER_STATUS_QUESTIONS.map((q, i) => (q.categoryId === cid ? i : null)).filter(
      (i) => i !== null,
    )
    return indices.length > 0 && indices.every((i) => answers[i] != null)
  })

  const allAnswered = answers.every((a) => a != null)
  const handleFinish = () => {
    if (!allAnswered) return
    navigate('/worker-status/result')
  }

  const questionsInCategory = WORKER_STATUS_QUESTIONS.map((q, i) => ({ ...q, index: i })).filter(
    (q) => q.categoryId === currentQ?.categoryId,
  )

  return (
    <div className="min-h-screen bg-paper text-ink pb-24 md:pb-16">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3 shadow-edge md:mb-6 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-white text-[11px] font-bold text-ink">
                W
              </span>
              <div>
                <span className="section-label text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Worker status
                </span>
                <p className="text-sm font-bold text-ink">근로자 추정제 대비 · 근로자성 자가진단</p>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-600 md:pl-12">
              대법원 판례·노동부 가이드 취지를 참고한 참고용 도구입니다. 실제 입법·행정해석과 다를 수 있습니다.
            </p>
          </div>
          <div className="w-full md:w-2/3">
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full bg-toss transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-medium text-zinc-700">
              {answeredCount} / {WORKER_STATUS_QUESTIONS.length} 문항 · 추정제·감독 대비 체크리스트
            </p>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
          <Link
            to="/"
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50"
          >
            ← 홈
          </Link>
          <Link
            to="/diagnosis"
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50"
          >
            근로감독 진단
          </Link>
        </div>

        <div className="flex flex-1 flex-col md:flex-row md:gap-5">
          <aside className="mb-3 hidden w-60 shrink-0 md:block">
            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-3 text-xs text-zinc-700 shadow-edge">
              <p className="mb-3 text-[11px] font-medium text-slate-600">영역</p>
              <nav className="space-y-1.5">
                {WORKER_STATUS_CATEGORIES.map((cat, cid) => {
                  const done = categoryAllDone[cid]
                  const active = currentQ?.categoryId === cid
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => {
                        const first = WORKER_STATUS_QUESTIONS.findIndex((q) => q.categoryId === cid)
                        if (first >= 0) setCurrentIndex(first)
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition ${
                        active
                          ? 'border border-ink bg-ink/10 text-ink'
                          : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-ink/50 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border-2 text-[9px] font-bold ${
                          done
                            ? 'border-ink bg-white text-ink'
                            : 'border-slate-300 bg-slate-100 text-slate-400'
                        }`}
                      >
                        {done ? '✓' : ''}
                      </span>
                      <span className="truncate">{cat.short}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            <div className="rounded-3xl border-2 border-zinc-200 bg-white p-5 text-sm text-slate-900 shadow-edge md:p-7">
              <p className="mb-2 text-[11px] text-slate-500">
                {WORKER_STATUS_CATEGORIES[currentQ?.categoryId]?.name} ·{' '}
                {questionsInCategory.findIndex((q) => q.index === currentIndex) + 1} /{' '}
                {questionsInCategory.length}
              </p>
              <h2 className="mb-4 text-base font-semibold leading-relaxed text-slate-900 md:text-lg">
                {currentQ?.text}
              </h2>
              {currentQ?.refs?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {currentQ.refs.map((r) => (
                    <span
                      key={r}
                      className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-toss"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-toss/10 text-[10px] font-bold text-toss">
                    i
                  </span>
                  해설 {showHint ? '닫기' : '보기'}
                </button>
                {showHint && currentQ?.hint && (
                  <p className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] leading-relaxed text-zinc-700">
                    {currentQ.hint}
                  </p>
                )}
              </div>
              <p className="mb-3 text-[10px] font-semibold text-zinc-500">
                가중치 {currentQ?.weight} / 5 (판례상 중요도 참고)
              </p>
              <div className="flex flex-col gap-2.5">
                {currentQ?.options.map((opt, oi) => {
                  const selected = answers[currentIndex] === oi
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => setOption(oi)}
                      className={`flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
                        selected
                          ? 'border-toss bg-blue-50/80 ring-2 ring-toss/30'
                          : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                          selected ? 'border-toss bg-toss text-white' : 'border-zinc-300 bg-white text-zinc-400'
                        }`}
                      >
                        {selected ? '✓' : ''}
                      </span>
                      <span className="flex-1 text-[14px] font-medium leading-snug text-ink">{opt.label}</span>
                      <span
                        className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold ${optTagClass[opt.cls] || optTagClass.mid}`}
                      >
                        {opt.tag}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-600 md:mt-4">
              <button
                type="button"
                onClick={() => setAutoAdvance((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition ${
                  autoAdvance
                    ? 'border-ink bg-ink/10 text-ink'
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-ink/50'
                }`}
              >
                <span
                  className={`flex h-3 w-3 items-center justify-center rounded-full border-2 text-[9px] font-bold ${
                    autoAdvance
                      ? 'border-ink bg-white text-ink'
                      : 'border-slate-300 bg-slate-100 text-slate-400'
                  }`}
                >
                  {autoAdvance ? '✓' : ''}
                </span>
                자동 다음 문항
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-xs md:mt-5">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                이전 문항
              </button>
              {currentIndex < WORKER_STATUS_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className={
                    'inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold shadow-edge ' +
                    DIAGNOSIS_CTA_CLASS
                  }
                >
                  다음 문항
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={!allAnswered}
                  className={
                    'inline-flex items-center rounded-full px-7 py-2.5 text-[11px] font-semibold tracking-wide shadow-edge disabled:cursor-not-allowed disabled:opacity-50 ' +
                    DIAGNOSIS_CTA_CLASS
                  }
                >
                  결과 보기
                </button>
              )}
            </div>
          </main>
        </div>

        <div className="md:hidden fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-2 text-[11px] backdrop-blur">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-slate-500">영역 이동</span>
            <span className="text-slate-500">
              {answeredCount} / {WORKER_STATUS_QUESTIONS.length}
            </span>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {WORKER_STATUS_CATEGORIES.map((cat, cid) => (
              <button
                key={cid}
                type="button"
                onClick={() => {
                  const first = WORKER_STATUS_QUESTIONS.findIndex((q) => q.categoryId === cid)
                  if (first >= 0) setCurrentIndex(first)
                }}
                className={`shrink-0 whitespace-nowrap rounded-full border-2 px-3 py-1.5 ${
                  currentQ?.categoryId === cid
                    ? 'border-ink bg-white font-semibold text-ink'
                    : 'border-slate-200 bg-slate-100 text-slate-600'
                }`}
              >
                {cat.short}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-8 text-center text-[10px] text-slate-500 md:px-6">
        본 진단은 근로자 추정제·근로자성에 관한 일반 정보 제공 목적이며 법률 자문이 아닙니다. 분쟁·감독 대응은
        공인노무사·변호사와 상담하세요.
      </div>
    </div>
  )
}
