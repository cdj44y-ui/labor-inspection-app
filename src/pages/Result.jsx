import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../data/questions.js'
import { getTotalScore, getCategoryScores, getGrade, GRADE_LABELS } from '../utils/score.js'

const ANSWERS_KEY = 'labor_diagnosis_answers'

function Gauge({ score }) {
  const grade = getGrade(score)
  const info = GRADE_LABELS[grade]
  const colorMap = { safe: '#22C55E', caution: '#EAB308', warning: '#F97316', danger: '#EF4444' }
  const r = 80
  const circumference = 2 * Math.PI * r
  const stroke = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" className="overflow-visible">
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="12"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={colorMap[info.color]}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - stroke}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          className="transition-all duration-500"
        />
      </svg>
      <p className="text-3xl font-bold mt-2" style={{ color: colorMap[info.color] }}>
        {score}점
      </p>
      <p className="font-semibold text-gray-700">{info.label}</p>
      <p className="text-sm text-gray-500">{info.message}</p>
    </div>
  )
}

export default function Result() {
  const [answers, setAnswers] = useState(null)
  const [openAccordion, setOpenAccordion] = useState(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem(ANSWERS_KEY)
      setAnswers(s ? JSON.parse(s) : null)
    } catch {
      setAnswers(null)
    }
  }, [])

  if (!answers || answers.length !== QUESTIONS.length) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">진단 결과가 없습니다. 진단을 먼저 완료해 주세요.</p>
          <Link to="/diagnosis" className="text-primary font-medium hover:underline">
            진단하기
          </Link>
        </div>
      </div>
    )
  }

  const totalScore = getTotalScore(answers)
  const categoryScores = getCategoryScores(answers)
  const grade = getGrade(totalScore)
  const gradeInfo = GRADE_LABELS[grade]
  const colorMap = { safe: 'bg-safe', caution: 'bg-caution', warning: 'bg-warning', danger: 'bg-danger' }

  // 미준수 항목 (아니오 또는 일부/모름/확인필요 중 개선 필요)
  const nonCompliant = QUESTIONS.map((q, i) => ({
    ...q,
    index: i,
    answer: answers[i],
    categoryName: CATEGORIES[q.categoryId].name,
  })).filter((x) => x.answer === '아니오' || ['일부', '모름', '확인필요'].includes(x.answer))

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-primary mb-8">진단 결과</h1>

        {/* (A) 종합 점수 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">종합 점수</h2>
          <Gauge score={totalScore} />
        </section>

        {/* (B) 카테고리별 막대 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">카테고리별 점수</h2>
          <div className="space-y-3">
            {CATEGORIES.map((cat, i) => {
              const score = categoryScores[i]
              const g = score >= 90 ? 'safe' : score >= 70 ? 'caution' : score >= 50 ? 'warning' : 'danger'
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-40 text-sm text-gray-700 shrink-0 truncate">{cat.name}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorMap[g]} transition-all duration-500`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="w-10 text-sm font-medium text-right">{score}점</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* (C) 상세 결과 아코디언 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">상세 결과</h2>
          {CATEGORIES.map((cat, cid) => (
            <div key={cid} className="border-b border-gray-200 last:border-0">
              <button
                className="w-full py-4 flex justify-between items-center text-left font-medium"
                onClick={() => setOpenAccordion(openAccordion === cid ? null : cid)}
              >
                <span>{cat.name}</span>
                <span className="text-gray-500">{openAccordion === cid ? '▲' : '▼'}</span>
              </button>
              {openAccordion === cid && (
                <div className="pb-4 space-y-2">
                  {QUESTIONS.filter((q) => q.categoryId === cid).map((q, i) => {
                    const globalIndex = QUESTIONS.findIndex((x) => x === q)
                    const ans = answers[globalIndex]
                    const isNonCompliant = ans === '아니오' || ['일부', '모름', '확인필요'].includes(ans)
                    return (
                      <div key={globalIndex} className="text-sm pl-2 border-l-2 border-gray-100">
                        <p className="text-gray-700">{q.text}</p>
                        <p>
                          응답: <span className={isNonCompliant ? 'text-red-600 font-medium' : 'text-gray-600'}>{ans}</span>
                        </p>
                        {isNonCompliant && (
                          <p className="text-amber-700 text-xs mt-1">→ 해당 항목 개선이 필요합니다. 관련 법령 및 취업규칙을 확인하세요.</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* (D) 액션 플랜 - 미준수 항목 */}
        {nonCompliant.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">개선이 필요한 항목</h2>
            <ul className="space-y-2">
              {nonCompliant.slice(0, 15).map((item) => (
                <li key={item.index} className="flex items-start gap-2 text-sm">
                  <span className="text-danger shrink-0">•</span>
                  <span className="text-gray-700">{item.text}</span>
                  <span className="text-gray-500 shrink-0">({item.answer})</span>
                </li>
              ))}
              {nonCompliant.length > 15 && (
                <li className="text-gray-500 text-sm">외 {nonCompliant.length - 15}개 항목</li>
              )}
            </ul>
          </section>
        )}

        {/* (E) CTA */}
        <section className="flex flex-wrap gap-3">
          <Link
            to="/diagnosis"
            className="inline-block px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            다시 진단하기
          </Link>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium"
          >
            홈으로
          </Link>
        </section>
      </div>
    </div>
  )
}
