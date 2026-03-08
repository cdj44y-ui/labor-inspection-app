import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../data/questions.js'
import { getTotalScore, getCategoryScores, getGrade, GRADE_LABELS } from '../utils/score.js'

import { CONTACT_PHONE, RAPIDO_CONTENT_URL } from '../constants/contact.js'

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
      <div className="min-h-screen bg-paper text-ink">
        <div className="relative mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-10">
          <div className="w-full rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-card md:p-10">
            <p className="mb-3 text-base font-semibold text-ink">
              진단 결과가 없습니다. 먼저 진단을 완료해 주세요.
            </p>
            <p className="mb-8 text-sm text-slate-600">
              ​50여개 핵심 문항에 응답하면 카테고리별 리스크와 우선순위 액션 플랜이 자동으로 생성됩니다.
            </p>
            <Link
              to="/diagnosis"
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              지금 진단하러 가기
            </Link>
          </div>
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

  // 카테고리별 리스크 요약 (점수 기준 상위 3개 개선 영역)
  const riskCategoryIndices = CATEGORIES.map((_, idx) => idx)
    .sort((a, b) => categoryScores[a] - categoryScores[b])
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <header className="mb-6 flex items-center justify-between md:mb-8">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-[11px] font-bold text-white">
              R
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
              Result Snapshot
            </span>
          </div>
          <span className="rounded-full border border-slate-100 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600">
            근로감독 리스크 리포트
          </span>
        </header>

        <div className="space-y-5 md:space-y-6">
          {/* (A) 종합 점수 + 한 줄 요약 */}
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-xl font-bold tracking-tight text-ink md:text-2xl">
                  진단 결과 요약
                </h1>
                <p className="text-sm leading-relaxed text-slate-600">
                  종합 점수 {totalScore}점, 등급 {gradeInfo.label}. 아래 우선 개선 영역 3가지를 먼저 정비하면 리스크를 줄일 수 있습니다.
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <Gauge score={totalScore} />
              </div>
            </div>
          </section>

          {/* (B) 우선 개선 영역 Top 3 */}
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card md:p-7">
            <h2 className="mb-2 text-sm font-semibold text-slate-900 md:text-base">
              우선 개선이 필요한 3가지 영역
            </h2>
            <p className="mb-3 text-[11px] text-slate-600">
              점수가 낮은 카테고리를 기준으로 정리했습니다. 각 영역별로 1~2개 대표 항목을 함께 제시합니다.
            </p>
            <ol className="space-y-2">
              {riskCategoryIndices.map((cid, idx) => {
                const cat = CATEGORIES[cid]
                const score = categoryScores[cid]
                const issuesInCat = nonCompliant.filter((n) => n.categoryId === cid).slice(0, 2)
                if (!cat) return null
                return (
                  <li
                    key={cid}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-900">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        점수 {score}점
                      </span>
                    </div>
                    {issuesInCat.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {issuesInCat.map((item) => (
                          <li key={item.index} className="text-[10px] text-slate-600">
                            • {item.text} ({item.answer})
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>

          {/* (C) 카테고리별 점수 요약 (압축형) */}
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card md:p-7">
            <h2 className="mb-3 text-sm font-semibold text-slate-900 md:text-base">
              카테고리별 점수 한눈에 보기
            </h2>
            <div className="space-y-3">
              {CATEGORIES.map((cat, i) => {
                const score = categoryScores[i]
                const g = score >= 90 ? 'safe' : score >= 70 ? 'caution' : score >= 50 ? 'warning' : 'danger'
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-xs text-slate-600 md:w-40">
                      {cat.name}
                    </span>
                    <div className="flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-3 rounded-full ${colorMap[g]} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-medium text-slate-800">
                      {score}점
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* (E) CTA */}
        <section className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/diagnosis"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-ink transition hover:bg-slate-50"
          >
            다시 진단하기
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            홈으로
          </Link>
        </section>

        {/* (F) 노무법인 위너스 · 조대진 노무사 리스크 코칭 */}
        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-card md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white md:h-16 md:w-16">
                JD
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  Labor Risk Partner
                </p>
                <h2 className="text-base font-bold tracking-tight text-ink md:text-lg">
                  노무법인 위너스 조대진 노무사 1:1 리스크 코칭
                </h2>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  근로감독 리스크를 실제로 줄이고 싶다면, HR·산업안전·컨설팅 실무를 두루 경험한 조대진 노무사에게
                  맞춤 코칭을 받아보세요.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    유선 연락처
                  </span>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="text-sm font-semibold tracking-tight text-slate-900 transition hover:text-primary md:text-base"
                  >
                    {CONTACT_PHONE}
                  </a>
                </div>
                <ul className="flex flex-wrap gap-1.5 text-[10px] text-slate-700">
                  <li className="rounded-full bg-slate-100 px-2.5 py-1">
                    현대카드 · 삼성서울병원 HR팀 출신
                  </li>
                  <li className="rounded-full bg-slate-100 px-2.5 py-1">
                    컨설팅 회사 근무 · 산업안전공학 박사 과정
                  </li>
                  <li className="rounded-full bg-slate-100 px-2.5 py-1">
                    삼성전자 · SK가스 · 두산그룹 등 다수 기업 강의
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:shrink-0 md:basis-44">
              <a
                href={RAPIDO_CONTENT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold tracking-tight text-white transition hover:bg-primary-hover"
              >
                비대면 상담
              </a>
              <p className="text-center text-[10px] leading-relaxed text-slate-500">
                온라인 상담 신청 시 필요한 범위 내에서만 노무사에게 정보가 공유됩니다.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-[10px] text-slate-400">
          본 진단 결과는 노동관계 법령과 일반적인 실무를 바탕으로 한 참고용 정보이며, 개별 사건에 대한
          법률 자문이나 행정해석을 대체하지 않습니다. 구체적인 조치·분쟁 대응은 노무법인 위너스 조대진 노무사 등
          전문가와 별도 상담을 통해 결정하시기 바랍니다.
        </p>
      </div>
    </div>
  )
}
