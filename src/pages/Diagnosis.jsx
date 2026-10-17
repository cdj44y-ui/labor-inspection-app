import { VERIFIED_DATE, PROMISE } from '../constants/brand.js'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../data/questions.js'
import { getPenaltyMeta, getVerifiedPenalty } from '../data/penalties.js'

const STORAGE_KEY = 'labor_diagnosis_business'
const ANSWERS_KEY = 'labor_diagnosis_answers'

const OPTION_HINT = {
  예: '갖추고 있습니다',
  아니오: '갖추지 못했습니다',
  일부: '일부만 갖추었습니다',
  모름: '잘 모르겠습니다',
  확인필요: '확인이 필요합니다',
  해당없음: '우리 회사와 관계없습니다',
}

export default function Diagnosis() {
  const navigate = useNavigate()
  const [showGuide, setShowGuide] = useState(false)
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

  useEffect(() => {
    try {
      localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers))
    } catch (_) {}
  }, [answers])

  const currentQ = QUESTIONS[currentIndex]
  const currentMeta = getPenaltyMeta(currentIndex)
  const verified = getVerifiedPenalty(currentIndex)
  useEffect(() => {
    setShowGuide(false)
    try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch (_) {}
  }, [currentIndex])

  const answeredCount = answers.filter(Boolean).length
  const progress = QUESTIONS.length ? Math.round((answeredCount / QUESTIONS.length) * 100) : 0

  const setAnswer = (value) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = value
      return next
    })
    if (autoAdvance && currentIndex < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIndex((i) => Math.min(i + 1, QUESTIONS.length - 1)), 250)
    }
  }

  const goPrev = () => currentIndex > 0 && setCurrentIndex((i) => i - 1)
  const goNext = () => currentIndex < QUESTIONS.length - 1 && setCurrentIndex((i) => i + 1)

  const allAnswered = answers.every((a) => a != null)
  const firstUnanswered = answers.findIndex((a) => a == null)
  const handleFinish = () => {
    if (!allAnswered) {
      if (firstUnanswered >= 0) setCurrentIndex(firstUnanswered)
      return
    }
    navigate('/result')
  }

  const catStats = CATEGORIES.map((_, cid) => {
    const idx = QUESTIONS.map((q, i) => (q.categoryId === cid ? i : null)).filter((i) => i !== null)
    return { total: idx.length, done: idx.filter((i) => answers[i] != null).length, first: idx[0] }
  })
  const inCat = QUESTIONS.filter((q) => q.categoryId === currentQ?.categoryId)
  const orderInCat = inCat.indexOf(currentQ) + 1
  const isLast = currentIndex === QUESTIONS.length - 1

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-28 text-[#14213D] [word-break:keep-all] md:pb-16">
      {/* 상단 */}
      <header className="sticky top-0 z-20 border-b border-[#DDE2EA] bg-white">
        <div className="mx-auto flex max-w-[1120px] items-center gap-6 px-5 py-4 md:px-8">
          <Link to="/" className="shrink-0 no-underline text-[#14213D]">
            <span className="block text-[20px] font-extrabold leading-tight">RISK<span className="text-[#1976D2]">119</span></span>
          </Link>
          <div className="flex-1">
            <div className="flex items-baseline justify-between text-[16px]">
              <span className="font-bold">진행 {answeredCount} / {QUESTIONS.length} 문항</span>
              <span className="font-bold text-[#1976D2]">{progress}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E6EAF0]">
              <div className="h-full rounded-full bg-[#1976D2] transition-all" style={{ width: progress + '%' }} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-6 grid max-w-[1120px] gap-6 px-5 md:mt-8 md:grid-cols-[260px_1fr] md:px-8">
        {/* 영역 목록 */}
        <aside className="hidden md:block">
          <p className="mb-3 text-[15px] font-bold text-[#5B6680]">점검 영역</p>
          <nav className="overflow-hidden rounded-[14px] border border-[#DDE2EA] bg-white">
            {CATEGORIES.map((cat, cid) => {
              const s = catStats[cid]
              const active = currentQ?.categoryId === cid
              const done = s.total > 0 && s.done === s.total
              return (
                <button
                  key={cid}
                  type="button"
                  onClick={() => s.first != null && setCurrentIndex(s.first)}
                  className={'flex w-full items-center justify-between gap-3 border-b border-[#EEF1F5] px-4 py-3.5 text-left text-[16px] last:border-b-0 ' + (active ? 'bg-[#E3F0FB] font-bold text-[#14213D]' : 'bg-white text-[#3D4A63] hover:bg-[#F5F7FA]')}
                >
                  <span className="leading-snug">{cat.name}</span>
                  <span className={'shrink-0 text-[14px] font-bold ' + (done ? 'text-[#1565C0]' : 'text-[#8A94A6]')}>{done ? '완료' : s.done + '/' + s.total}</span>
                </button>
              )
            })}
          </nav>
          <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[15px] text-[#3D4A63]">
            <input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} className="h-5 w-5 accent-[#1976D2]" />
            답하면 다음 질문으로 자동 이동
          </label>
        </aside>

        {/* 질문 */}
        <main>
          <div className="rounded-[16px] border border-[#DDE2EA] bg-white p-6 md:p-10">
            <p className="text-[16px] font-bold text-[#1976D2] md:text-[17px]">
              {CATEGORIES[currentQ?.categoryId]?.name} · {orderInCat} / {inCat.length}
            </p>
            <h1 className="mt-3 text-[25px] font-bold leading-[1.5] tracking-[-0.5px] md:text-[30px]">
              {currentQ?.text}
            </h1>

            {/* 근거 */}
            <div className="mt-6 rounded-xl border border-[#DDE2EA] bg-[#F8FAFC] px-5 py-4">
              <div className="grid gap-1 md:grid-cols-[86px_1fr] md:gap-3">
                <p className="text-[15px] font-bold text-[#5B6680]">법적 근거</p>
                <p className="text-[17px] leading-[1.6]">{currentQ?.law}</p>
              </div>
              {verified && (
                <div className="mt-3 grid gap-1 border-t border-[#E6EAF0] pt-3 md:grid-cols-[86px_1fr] md:gap-3">
                  <p className="text-[15px] font-bold text-[#B42318]">위반 시</p>
                  <p className="text-[17px] leading-[1.6]"><b>{verified.penaltyDetail}</b> <span className="text-[15px] text-[#5B6680]">({verified.legalBasis})</span></p>
                </div>
              )}
              {currentMeta?.improvementGuide && (
                <div className="mt-3 border-t border-[#E6EAF0] pt-3">
                  <button type="button" onClick={() => setShowGuide((v) => !v)} className="text-[15px] font-bold text-[#1565C0]">
                    {showGuide ? '준비 방법 닫기 ▴' : '어떻게 준비하면 되나요? ▾'}
                  </button>
                  {showGuide && <p className="mt-2 text-[16px] leading-[1.7] text-[#3D4A63]">{currentMeta.improvementGuide}</p>}
                </div>
              )}
            </div>

            {/* 답변 */}
            <div className="mt-7 grid gap-3">
              {currentQ?.options.map((opt) => {
                const selected = answers[currentIndex] === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswer(opt)}
                    aria-pressed={selected}
                    className={'flex min-h-[68px] w-full items-center justify-between gap-4 rounded-xl border-2 px-6 text-left transition ' + (selected ? 'border-[#1976D2] bg-[#E3F0FB]' : 'border-[#DDE2EA] bg-white hover:border-[#90CAF9] hover:bg-[#F8FAFC]')}
                  >
                    <span>
                      <span className="block text-[21px] font-bold leading-tight">{opt}</span>
                      <span className="mt-0.5 block text-[15px] text-[#5B6680]">{OPTION_HINT[opt] || ''}</span>
                    </span>
                    <span className={'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[16px] font-extrabold ' + (selected ? 'border-[#1976D2] bg-[#1976D2] text-white' : 'border-[#C9D1DC] bg-white text-transparent')} aria-hidden>✓</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 이동 */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button type="button" onClick={goPrev} disabled={currentIndex === 0} className="h-[56px] rounded-[10px] border-[1.5px] border-[#C9D1DC] bg-white px-6 text-[18px] font-bold text-[#3D4A63] disabled:opacity-40">
              ← 이전 질문
            </button>
            {isLast ? (
              <button type="button" onClick={handleFinish} className="h-[56px] rounded-[10px] bg-[#1976D2] px-8 text-[18px] font-bold text-white hover:bg-[#1565C0]">
                {allAnswered ? '결과 보기 →' : '남은 질문 답하기 (' + (QUESTIONS.length - answeredCount) + ')'}
              </button>
            ) : (
              <button type="button" onClick={goNext} className="h-[56px] rounded-[10px] bg-[#14213D] px-8 text-[18px] font-bold text-white hover:bg-[#22325A]">
                다음 질문 →
              </button>
            )}
          </div>
          {allAnswered && !isLast && (
            <button type="button" onClick={handleFinish} className="mt-3 h-[56px] w-full rounded-[10px] bg-[#1976D2] text-[18px] font-bold text-white hover:bg-[#1565C0]">
              모든 질문에 답했습니다 · 결과 보기 →
            </button>
          )}
          <p className="mt-6 text-[14px] leading-[1.7] text-[#5B6680]">
            본 진단은 법령과 고용노동부 자율진단표를 바탕으로 한 참고용 점검입니다. 개별 사업장의 구체적인 판단은 노무사 상담으로 확인하시기 바랍니다.
          </p>
          <p className="mt-2 text-[14px] font-semibold text-[#5B6680]">근거 원문 대조일 {VERIFIED_DATE} · {PROMISE}</p>
        </main>
      </div>

      {/* 모바일 하단: 영역 이동 */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#DDE2EA] bg-white px-3 py-2.5 md:hidden">
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat, cid) => (
            <button
              key={cid}
              type="button"
              onClick={() => catStats[cid].first != null && setCurrentIndex(catStats[cid].first)}
              className={'shrink-0 whitespace-nowrap rounded-lg border px-3.5 py-2 text-[15px] ' + (currentQ?.categoryId === cid ? 'border-[#1976D2] bg-[#E3F0FB] font-bold text-[#14213D]' : 'border-[#DDE2EA] bg-white text-[#3D4A63]')}
            >
              {cat.name} {catStats[cid].done}/{catStats[cid].total}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
