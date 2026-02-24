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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {answeredCount} / {QUESTIONS.length} 문항
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-5xl mx-auto w-full">
        {/* 사이드바: 카테고리 (데스크톱) */}
        <aside className="hidden md:block w-56 shrink-0 border-r border-gray-200 bg-white p-4 overflow-y-auto">
          <nav className="space-y-1">
            {CATEGORIES.map((cat, cid) => {
              const allDone = categoryAllDone[cid]
              return (
                <button
                  key={cid}
                  onClick={() => {
                    const first = QUESTIONS.findIndex((q) => q.categoryId === cid)
                    if (first >= 0) setCurrentIndex(first)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                    currentQ?.categoryId === cid ? 'bg-secondary/10 text-primary font-medium' : 'text-gray-600'
                  }`}
                >
                  <span>{allDone ? '✓' : '○'}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* 메인: 질문 카드 */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl shadow-sm border border-gray-100 p-6 bg-white">
              <p className="text-sm text-gray-500 mb-2">
                {CATEGORIES[currentQ?.categoryId]?.name} · {QUESTIONS.filter((q) => q.categoryId === currentQ?.categoryId).length}문항 중{' '}
                {QUESTIONS.filter((q) => q.categoryId === currentQ?.categoryId).indexOf(currentQ) + 1}
              </p>
              <h2 className="text-lg font-medium text-[#1E293B] mb-6">{currentQ?.text}</h2>
              <div className="flex flex-wrap gap-3">
                {currentQ?.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswer(opt)}
                    className={`px-5 py-3 rounded-lg font-medium transition ${
                      answers[currentIndex] === opt
                        ? answerButtonClass[opt] || 'bg-gray-400 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="px-5 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                이전
              </button>
              {currentIndex < QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                >
                  다음
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={!allAnswered}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  결과 보기
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 모바일 하단 탭: 카테고리 */}
      <div className="md:hidden flex gap-1 overflow-x-auto p-2 bg-white border-t border-gray-200">
        {CATEGORIES.map((cat, cid) => (
          <button
            key={cid}
            onClick={() => {
              const first = QUESTIONS.findIndex((q) => q.categoryId === cid)
              if (first >= 0) setCurrentIndex(first)
            }}
            className={`shrink-0 px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
              currentQ?.categoryId === cid ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
