import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../data/questions.js'
import { getTotalScore, getCategoryScores, getGrade, GRADE_LABELS } from '../utils/score.js'
import {
  CONTACT_PHONE,
  CONSULT_BUTTON_CLASS,
  DIAGNOSIS_CTA_CLASS,
  NOTION_REMOTE_CONSULT_URL,
} from '../constants/contact.js'
import SiteHeader from '../components/common/SiteHeader.jsx'
import SiteFooter from '../components/common/SiteFooter.jsx'
import RiskGauge from '../components/result/RiskGauge.jsx'
import PenaltySummary from '../components/result/PenaltySummary.jsx'
import CategoryCard from '../components/result/CategoryCard.jsx'
import InspectionScenario from '../components/result/InspectionScenario.jsx'
import ExpertProfile from '../components/result/ExpertProfile.jsx'
import CTASection from '../components/result/CTASection.jsx'
import {
  buildEnrichedItems,
  filterViolations,
  aggregatePenaltyTotals,
  groupByCategory,
  getIndustryComparisonHint,
} from '../utils/penaltyCalculator.js'
import { getTopRiskScenarios } from '../utils/scenarioGenerator.js'

const ANSWERS_KEY = 'labor_diagnosis_answers'

export default function Result() {
  const [answers, setAnswers] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem(ANSWERS_KEY)
      setAnswers(s ? JSON.parse(s) : null)
    } catch {
      setAnswers(null)
    }
  }, [])

  const enriched = useMemo(
    () => (answers && answers.length === QUESTIONS.length ? buildEnrichedItems(answers) : []),
    [answers],
  )

  const violations = useMemo(() => filterViolations(enriched), [enriched])
  const penaltyTotals = useMemo(() => aggregatePenaltyTotals(violations), [violations])
  const byCat = useMemo(() => groupByCategory(violations), [violations])
  const topScenarios = useMemo(() => getTopRiskScenarios(enriched, 3), [enriched])

  if (!answers || answers.length !== QUESTIONS.length) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <div className="relative mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-10">
          <div className="w-full rounded-3xl border-2 border-zinc-200 bg-white p-8 text-center shadow-edge md:p-10">
            <p className="mb-3 text-base font-bold text-ink">진단 결과가 없습니다. 먼저 진단을 완료해 주세요.</p>
            <p className="mb-8 text-sm text-zinc-800">
              50여개 핵심 문항에 응답하면 카테고리별 리스크와 예상 제재 추정·우선순위가 정리됩니다.
            </p>
            <Link
              to="/diagnosis"
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-edge transition hover:bg-zinc-800"
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

  const industryHint = getIndustryComparisonHint(totalScore)
  const violationSummary = violations.map((v) => v.categoryLabel).filter(Boolean)
  const violationSummaryText = [...new Set(violationSummary)].join(', ') || '미충족 없음'

  const riskCategoryIndices = CATEGORIES.map((_, idx) => idx)
    .sort((a, b) => categoryScores[a] - categoryScores[b])
    .slice(0, 3)

  const handleCopy = async () => {
    const summaryLines = [
      `근로감독 자가진단 결과 요약`,
      `- 종합 점수: ${totalScore}점 (${gradeInfo.label})`,
      `- 예상 과태료·벌금 합(참고): 약 ${Math.round(penaltyTotals.total)}만원`,
      `- 미충족 ${violations.length}건`,
    ].filter(Boolean)
    try {
      await navigator.clipboard.writeText(summaryLines.join('\n'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (_) {}
  }

  const categoryKeysSorted = Object.keys(byCat).sort()

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <SiteHeader />

        <div className="mt-6 space-y-5 md:space-y-6">
          <section className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="mb-2 text-xl font-extrabold tracking-tight text-ink md:text-2xl">진단 결과 요약</h1>
                <p className="text-sm leading-relaxed text-zinc-800">
                  종합 점수 <span className="font-bold text-toss">{totalScore}점</span>, 등급{' '}
                  <span className="font-semibold text-ink">{gradeInfo.label}</span>. 아래 예상 제재는 항목별 최대
                  수준을 단순 합산한 참고치입니다.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-[12px] font-semibold text-zinc-800 transition hover:bg-zinc-50"
                  >
                    {copied ? '요약 복사됨' : '요약 복사'}
                  </button>
                  <a
                    href={NOTION_REMOTE_CONSULT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CONSULT_BUTTON_CLASS + ' no-underline visited:text-white text-center text-sm'}
                  >
                    비대면 상담(자문 요청)
                  </a>
                </div>
              </div>
              <RiskGauge score={totalScore} grade={grade} />
            </div>
            <div className="mt-6">
              <PenaltySummary
                totalManwon={penaltyTotals.total}
                fineSum={penaltyTotals.fineSum}
                adminSum={penaltyTotals.adminSum}
                industryHint={industryHint}
              />
            </div>
          </section>

          {violations.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-ink md:text-base">영역별 위반 요약</h2>
              <div className="grid gap-4 md:grid-cols-1">
                {categoryKeysSorted.map((key) => (
                  <CategoryCard key={key} categoryKey={key} items={byCat[key]} />
                ))}
              </div>
            </section>
          )}

          <InspectionScenario scenarios={topScenarios} />

          <section className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-7">
            <h2 className="mb-3 text-sm font-bold text-ink md:text-base">카테고리별 점수</h2>
            <div className="space-y-3">
              {CATEGORIES.map((cat, i) => {
                const score = categoryScores[i]
                const g = score >= 90 ? 'safe' : score >= 70 ? 'caution' : score >= 50 ? 'warning' : 'danger'
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-xs font-medium text-zinc-600 md:w-44">
                      {cat.name}
                    </span>
                    <div className="flex-1 overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className={`h-3 rounded-full ${colorMap[g]} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-bold text-toss">
                      {score}
                      <span className="ml-0.5 text-[11px] text-ink">점</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-7">
            <h2 className="mb-2 text-sm font-bold text-ink md:text-base">우선 개선이 필요한 3가지 영역</h2>
            <ol className="space-y-2">
              {riskCategoryIndices.map((cid, idx) => {
                const cat = CATEGORIES[cid]
                const score = categoryScores[cid]
                const issuesInCat = violations.filter((n) => n.categoryId === cid).slice(0, 3)
                if (!cat) return null
                return (
                  <li
                    key={cid}
                    className="rounded-2xl border-l-4 border-toss border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-[11px]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-toss text-[10px] font-bold text-white">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-ink">{cat.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-toss">{score}점</span>
                    </div>
                    {issuesInCat.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {issuesInCat.map((item) => (
                          <li key={item.id} className="text-[10px] text-zinc-700">
                            ❌ {item.question} — ⚠️ {item.penaltyDetail} ({item.legalBasis.split(' ')[0]}…)
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>

          <ExpertProfile />

          <CTASection
            riskLevelLabel={gradeInfo.label}
            totalPenaltyManwon={Math.round(penaltyTotals.total)}
            violationSummary={violationSummaryText}
          />

          <section className="flex flex-wrap gap-3">
            <Link
              to="/diagnosis"
              className={
                'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold ' +
                DIAGNOSIS_CTA_CLASS
              }
            >
              다시 진단하기
            </Link>
            <Link
              to="/"
              className={
                'inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-bold shadow-edge ' +
                CONSULT_BUTTON_CLASS
              }
            >
              홈으로
            </Link>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Labor Risk Partner</p>
            <h2 className="mt-1 text-base font-bold text-ink md:text-lg">노무법인 위너스 조대진 노무사 1:1 리스크 코칭</h2>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-800">
              근로감독 리스크를 실제로 줄이고 싶다면 맞춤 코칭을 받아보세요.
            </p>
          </div>
          <a
            href={`tel:${CONTACT_PHONE.replace(/-/g, '')}`}
            className="mt-4 inline-flex text-lg font-bold text-toss md:mt-0"
          >
            {CONTACT_PHONE}
          </a>
        </section>

        <p className="mt-6 text-center text-[10px] text-zinc-800">
          본 진단 결과는 노동관계 법령과 일반적인 실무를 바탕으로 한 참고용 정보이며, 개별 사건에 대한 법률 자문이나
          행정해석을 대체하지 않습니다. 예상 과태료·벌금은 단순 합산 추정치입니다.
        </p>

        <SiteFooter />
      </div>
    </div>
  )
}
