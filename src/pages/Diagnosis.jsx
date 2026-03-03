import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../data/questions.js'

const STORAGE_KEY = 'labor_diagnosis_business'
const ANSWERS_KEY = 'labor_diagnosis_answers'

const answerButtonClass = {
  예: 'bg-safe text-white hover:opacity-90',
  아니오: 'bg-danger text-white hover:opacity-90',
  일부: 'bg-caution text-gray-900 hover:opacity-90',
  모름: 'bg-caution text-gray-900 hover:opacity-90',
  확인필요: 'bg-caution text-gray-900 hover:opacity-90',
  해당없음: 'bg-gray-400 text-white hover:opacity-90',
}

export default function Diagnosis() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState(() => {
    try {
      const s = localStorage.getItem(ANSWERS_KEY)
      return s ? JSON.parse(s) : QUESTIONS.map(() => null)
    } catch {
      return QUESTIONS.map(() => null)
    }
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [showOnlyUnanswered, setShowOnlyUnanswered] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers))
    } catch (_) {}
  }, [answers])

  const currentQ = QUESTIONS[currentIndex]
  const answeredCount = answers.filter(Boolean).length
  const progress = QUESTIONS.length ? Math.round((answeredCount / QUESTIONS.length) * 100) : 0

  const setAnswer = (value) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = value
      return next
    })
    if (autoAdvance && currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  const goNext = () => {
    if (currentIndex < QUESTIONS.length - 1) setCurrentIndex((i) => i + 1)
  }

  const goToQuestion = (index) => setCurrentIndex(index)

  const allAnswered = answers.every((a) => a != null)
  const handleFinish = () => {
    if (!allAnswered) return
    navigate('/result')
  }

  const categoryAllDone = CATEGORIES.map((_, cid) => {
    const indices = QUESTIONS.map((q, i) => (q.categoryId === cid ? i : null)).filter((i) => i !== null)
    return indices.length > 0 && indices.every((i) => answers[i] != null)
  })

  const questionsInCurrentCategory = QUESTIONS.map((q, i) => ({ ...q, index: i })).filter(
    (q) => q.categoryId === currentQ?.categoryId,
  )

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#e0f2fe_0,_#f9fafb_45%,_#f9fafb_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-6 md:px-6 md:pt-8">
        {/* 상단 헤더 + 진행률 */}
        <div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-secondary via-sky-400 to-emerald-300 text-[11px] font-semibold text-slate-950 shadow-md shadow-secondary/40">
              D
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em]">
              Diagnosis Flow
            </span>
          </div>
          <div className="w-full md:w-2/3">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-secondary via-sky-400 to-emerald-300 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {answeredCount} / {QUESTIONS.length} 문항 응답 완료
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col md:flex-row md:gap-5">
          {/* 사이드바: 카테고리 (데스크톱) */}
          <aside className="mb-3 hidden w-60 shrink-0 md:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-[0_16px_60px_rgba(148,163,184,0.35)] backdrop-blur">
              <p className="mb-3 text-[11px] font-medium text-slate-600">
                카테고리 맵
              </p>
              <nav className="space-y-1.5">
                {CATEGORIES.map((cat, cid) => {
                  const allDone = categoryAllDone[cid]
                  const active = currentQ?.categoryId === cid
                  return (
                    <button
                      key={cid}
                      onClick={() => {
                        const first = QUESTIONS.findIndex((q) => q.categoryId === cid)
                        if (first >= 0) setCurrentIndex(first)
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition ${
                        active
                          ? 'border border-secondary/70 bg-secondary/10 text-primary'
                          : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-secondary/50 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${
                          allDone
                            ? 'border-transparent bg-emerald-400 text-white'
                            : 'border-slate-300 text-slate-400'
                        }`}
                      >
                        {allDone ? '✓' : ''}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* 메인: 질문 카드 */}
          <main className="flex-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-900 shadow-[0_18px_70px_rgba(148,163,184,0.35)] backdrop-blur md:p-7">
              <p className="mb-2 text-[11px] text-slate-500">
                {CATEGORIES[currentQ?.categoryId]?.name} ·{' '}
                {
                  QUESTIONS.filter((q) => q.categoryId === currentQ?.categoryId)
                    .length
                }
                문항 중{' '}
                {
                  QUESTIONS.filter((q) => q.categoryId === currentQ?.categoryId).indexOf(
                    currentQ,
                  ) + 1
                }
              </p>
              <h2 className="mb-5 text-base font-semibold leading-relaxed text-slate-900 md:text-lg">
                {currentQ?.text}
              </h2>
              {currentQ?.law && (
                <p className="mb-4 rounded-xl bg-slate-50 px-3 py-2 text-[10px] leading-relaxed text-slate-500">
                  <span className="font-semibold text-slate-600">관련 법령 근거 · </span>
                  {currentQ.law}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {currentQ?.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswer(opt)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                      answers[currentIndex] === opt
                        ? `${answerButtonClass[opt] || 'bg-gray-400 text-white'} shadow-md shadow-slate-300/50`
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-secondary/60 hover:bg-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-600 md:mt-4">
              <button
                type="button"
                onClick={() => setAutoAdvance((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition ${
                  autoAdvance
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-secondary/50'
                }`}
              >
                <span
                  className={`flex h-3 w-3 items-center justify-center rounded-full border text-[9px] ${
                    autoAdvance
                      ? 'border-transparent bg-secondary text-white'
                      : 'border-slate-300 text-slate-400'
                  }`}
                >
                  {autoAdvance ? '✓' : ''}
                </span>
                자동 다음 문항 이동
              </button>
              <div className="text-[10px] text-slate-500 md:text-[11px]">
                답변 후 자동으로 다음 문항으로 이동합니다. 필요하면 언제든 끌 수 있습니다.
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600 md:mt-5">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                이전 문항
              </button>
              {currentIndex < QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-[11px] font-semibold tracking-wide text-white shadow-lg shadow-slate-300/70 transition hover:bg-primary-hover"
                >
                  다음 문항
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={!allAnswered}
                  className="inline-flex items-center rounded-full bg-secondary px-7 py-2.5 text-[11px] font-semibold tracking-wide text-slate-950 shadow-lg shadow-secondary/60 transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  결과 보기
                </button>
              )}
            </div>
          </main>
        </div>

        {/* 현재 카테고리 빠른 이동 맵 (데스크톱 전용) */}
        <div className="mt-4 hidden rounded-2xl border border-slate-200 bg-white p-4 text-[11px] text-slate-700 shadow-[0_16px_60px_rgba(148,163,184,0.25)] backdrop-blur md:block">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">
                {CATEGORIES[currentQ?.categoryId]?.name} 질문 한눈에 보기
              </p>
              <span className="text-[10px] text-slate-400">
                카드 클릭 시 해당 문항으로 바로 이동합니다.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowOnlyUnanswered((v) => !v)}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] transition ${
                showOnlyUnanswered
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-amber-300'
              }`}
            >
              <span
                className={`flex h-3 w-3 items-center justify-center rounded-full border text-[9px] ${
                  showOnlyUnanswered
                    ? 'border-transparent bg-amber-500 text-white'
                    : 'border-slate-300 text-slate-400'
                }`}
              >
                {showOnlyUnanswered ? '!' : ''}
              </span>
              미응답만 보기
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {questionsInCurrentCategory
              .filter((q) => (showOnlyUnanswered ? answers[q.index] == null : true))
              .map((q) => {
                const answered = answers[q.index] != null
                const active = q.index === currentIndex
                const order =
                  QUESTIONS.filter((x) => x.categoryId === q.categoryId).indexOf(q) + 1
                const answerLabel = answers[q.index]
                return (
                  <button
                    key={q.index}
                    onClick={() => setCurrentIndex(q.index)}
                    className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-2 text-left text-[10px] transition ${
                      active
                        ? 'border-secondary bg-secondary/10 text-primary'
                        : answered
                        ? 'border-emerald-200 bg-emerald-50 text-slate-700'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-secondary/50 hover:bg-white'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold ${
                        answered
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {order}
                    </span>
                    <div className="flex-1">
                      <p className="line-clamp-2 text-[10px] md:text-[11px]">{q.text}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] ${
                            answered
                              ? 'bg-emerald-500/10 text-emerald-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {answered ? `응답: ${answerLabel}` : '미응답'}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
          </div>
        </div>

        {/* 모바일 하단 탭: 카테고리 */}
        <div className="md:hidden fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 p-2 text-[11px] text-slate-700 backdrop-blur">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-slate-500">
              카테고리 바로가기
            </span>
            <span className="text-slate-500">
              {answeredCount} / {QUESTIONS.length}
            </span>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {CATEGORIES.map((cat, cid) => (
              <button
                key={cid}
                onClick={() => {
                  const first = QUESTIONS.findIndex((q) => q.categoryId === cid)
                  if (first >= 0) setCurrentIndex(first)
                }}
                className={`shrink-0 rounded-full px-3 py-1.5 whitespace-nowrap ${
                  currentQ?.categoryId === cid
                    ? 'bg-secondary text-slate-950'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-5xl px-4 text-center text-[10px] text-slate-400 md:px-6">
        본 자가진단 문항과 관련 법령 정보는 최신 노동관계 법령과 실무 자료를 바탕으로 작성되었으나, 모든 개별
        사업장의 상황을 완전히 반영하지 않을 수 있습니다. 구체적인 사건·분쟁에 관한 해석과 대응은 반드시
        노무사·변호사 등 전문가와 별도로 상담하시기 바랍니다.
      </div>
    </div>
  )
}
