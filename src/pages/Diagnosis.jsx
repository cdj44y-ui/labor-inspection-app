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
    if (currentIndex < QUESTIONS.length - 1) setCurrentIndex((i) => i + 1)
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

            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-600 md:mt-6">
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
    </div>
  )
}
