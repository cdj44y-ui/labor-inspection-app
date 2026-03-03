import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../data/questions.js'
import { getTotalScore, getCategoryScores, getGrade, GRADE_LABELS } from '../utils/score.js'

// 연락처/문의 URL은 실제 운영 시 정확한 정보로 교체하세요.
const CONTACT_PHONE = '02-2138-0240'
const CONTACT_ONLINE_URL = 'https://example.com/winners-contact'

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
  const [aiSummary, setAiSummary] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [hasPaidDetails, setHasPaidDetails] = useState(false)

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
      <div className="min-h-screen bg-transparent text-slate-900">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#e0f2fe_0,_#f9fafb_45%,_#f9fafb_100%)]" />
        <div className="relative mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-10">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-700 shadow-[0_18px_70px_rgba(148,163,184,0.35)] backdrop-blur md:p-8">
            <p className="mb-3 text-sm text-slate-800">
              진단 결과가 없습니다. 먼저 진단을 완료해 주세요.
            </p>
            <p className="mb-6 text-xs text-slate-500">
              사업장 정보를 입력하고 53개 문항에 응답하면,
              카테고리별 리스크와 우선순위 액션 플랜이 자동으로 생성됩니다.
            </p>
            <Link
              to="/diagnosis"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-[11px] font-semibold tracking-wide text-white shadow-lg shadow-slate-300/70 transition hover:bg-primary-hover"
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

  const handleGenerateAiSummary = async () => {
    setAiLoading(true)
    setAiError(null)
    try {
      const categoriesPayload = CATEGORIES.map((cat, i) => ({
        name: cat.name,
        score: categoryScores[i],
      }))
      const nonCompliantPreview = nonCompliant.slice(0, 30).map((item) => ({
        text: item.text,
        answer: item.answer,
        categoryName: item.categoryName,
      }))

      const res = await fetch('http://localhost:8787/api/gemini/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalScore,
          grade: gradeInfo?.label,
          categories: categoriesPayload,
          nonCompliantPreview,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'AI 분석 요청에 실패했습니다.')
      }

      const data = await res.json()
      setAiSummary(data.summary || '')
    } catch (e) {
      setAiError(e.message || 'AI 분석 요청 중 오류가 발생했습니다.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleAskDetail = async () => {
    if (!chatInput.trim()) return
    const userMessage = { role: 'user', content: chatInput.trim() }
    const nextHistory = [...chatHistory, userMessage]
    setChatHistory(nextHistory)
    setChatInput('')
    setChatLoading(true)
    setChatError(null)

    try {
      const categoriesPayload = CATEGORIES.map((cat, i) => ({
        name: cat.name,
        score: categoryScores[i],
      }))
      const nonCompliantPreview = nonCompliant.slice(0, 30).map((item) => ({
        text: item.text,
        answer: item.answer,
        categoryName: item.categoryName,
      }))

      const res = await fetch('http://localhost:8787/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalScore,
          grade: gradeInfo?.label,
          categories: categoriesPayload,
          nonCompliantPreview,
          question: userMessage.content,
          history: nextHistory,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || '상세 상담 요청에 실패했습니다.')
      }

      const data = await res.json()
      const answer = data.answer || ''
      setChatHistory((prev) => [...prev, { role: 'assistant', content: answer }])
    } catch (e) {
      setChatError(e.message || '상세 상담 요청 중 오류가 발생했습니다.')
    } finally {
      setChatLoading(false)
    }
  }

  // 카테고리별 리스크 요약 (점수 기준 상위 3개 개선 영역)
  const riskCategoryIndices = CATEGORIES.map((_, idx) => idx)
    .sort((a, b) => categoryScores[a] - categoryScores[b])
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#e0f2fe_0,_#f9fafb_45%,_#f9fafb_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <header className="mb-6 flex items-center justify-between text-xs text-slate-500 md:mb-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-secondary via-sky-400 to-emerald-300 text-[11px] font-semibold text-slate-950 shadow-md shadow-secondary/40">
              R
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em]">
              Result Snapshot
            </span>
          </div>
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] text-slate-600">
            근로감독 리스크 리포트
          </span>
        </header>

        <div className="space-y-5 md:space-y-6">
          {/* (A) 종합 점수 + 한 줄 요약 */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(148,163,184,0.35)] backdrop-blur md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-1 text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                  진단 결과 요약
                </h1>
                <p className="text-xs leading-relaxed text-slate-600 md:text-sm">
                  종합 점수는 {totalScore}점, 등급은 {gradeInfo.label}입니다. 아래 우선 개선 영역 3가지를 먼저
                  정비하면 근로감독 리스크를 빠르게 줄일 수 있습니다.
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <Gauge score={totalScore} />
              </div>
            </div>
          </section>

          {/* (B) 우선 개선 영역 Top 3 */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 text-xs text-slate-900 shadow-[0_18px_70px_rgba(148,163,184,0.35)] backdrop-blur md:p-6">
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
          <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-[0_18px_70px_rgba(148,163,184,0.35)] backdrop-blur md:p-6">
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
        <section className="mt-6 flex flex-wrap gap-3 text-[11px] text-slate-700">
          <Link
            to="/diagnosis"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-2.5 font-medium transition hover:bg-slate-50"
          >
            다시 진단하기
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 font-semibold tracking-wide text-white shadow-lg shadow-slate-300/70 transition hover:bg-primary-hover"
          >
            홈으로
          </Link>
        </section>

        {/* (F) 노무법인 위너스 상담 연결 */}
        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 text-[11px] text-slate-800 shadow-[0_24px_90px_rgba(15,23,42,0.35)] backdrop-blur md:mt-6 md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-[12px] font-semibold text-white shadow-md md:h-14 md:w-14">
                JD
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Labor Risk Partner
                </p>
                <h2 className="text-base font-semibold text-slate-900 md:text-lg">
                  노무법인 위너스 조대진 노무사 1:1 리스크 코칭
                </h2>
                <p className="text-[11px] text-slate-600">
                  근로감독 리스크를 실제로 줄이고 싶다면, HR·산업안전·컨설팅 실무를 두루 경험한 조대진 노무사에게
                  진단 결과를 기반으로 한 맞춤 코칭을 받아보세요.
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-700">
                  <li className="rounded-full bg-slate-100 px-2 py-1">
                    현대카드 · 삼성서울병원 HR팀 출신
                  </li>
                  <li className="rounded-full bg-slate-100 px-2 py-1">
                    컨설팅 회사 근무 · 산업안전공학 박사 과정
                  </li>
                  <li className="rounded-full bg-slate-100 px-2 py-1">
                    삼성전자 · SK가스 · 두산그룹 등 다수 기업 강의
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 md:mt-0 md:w-64">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg shadow-primary/40 transition hover:bg-primary-hover"
              >
                지금 바로 전화 상담 연결 (대표 {CONTACT_PHONE})
              </a>
              <a
                href={CONTACT_ONLINE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-medium text-slate-800 transition hover:bg-white"
              >
                진단 결과 기반 온라인 상담 신청
              </a>
              <p className="mt-1 text-[10px] text-slate-500">
                * 온라인 상담 신청 시에만, 암호화된 진단 요약 정보가 필요한 범위 내에서 노무사에게 공유되도록 설계할
                수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* (G) 상세 결과 · AI 리포트 · AI 상담 (토글) */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 text-[11px] text-slate-800 shadow-[0_18px_70px_rgba(148,163,184,0.25)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-800">
                전체 상세 결과와 AI 리포트를 유료 리포트로 받아보고 싶다면
              </p>
              <p className="text-[10px] text-slate-500">
                문항별 응답·AI 요약·AI 상담 내역을 한 번에 정리한 상세 리포트(1회 10,000원)를 제공할 수 있습니다.
                현재 화면은 프로토타입으로, 실제 결제 연동은 별도 협의 후 PG사와 연동해야 합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!hasPaidDetails) {
                  // 실제 서비스에서는 PG 결제 창으로 연동해야 합니다.
                  const ok = window.confirm(
                    '상세 리포트(10,000원) 결제 완료로 처리합니다. 실제 결제 연동은 추후 PG사와의 연동이 필요합니다.',
                  )
                  if (!ok) return
                  setHasPaidDetails(true)
                  setShowDetails(true)
                } else {
                  setShowDetails((v) => !v)
                }
              }}
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-black"
            >
              {!hasPaidDetails
                ? '10,000원 결제하고 상세 리포트 보기'
                : showDetails
                ? '상세 리포트 접기'
                : '상세 리포트 다시 보기'}
            </button>
          </div>
        </section>

        {showDetails && (
          <div className="mt-4 grid flex-1 gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="space-y-5 md:space-y-6">
              {/* AI 요약 */}
              <section className="rounded-3xl border border-secondary/40 bg-gradient-to-r from-sky-100 via-indigo-100 to-emerald-100 p-5 text-xs text-slate-900 shadow-[0_18px_70px_rgba(129,140,248,0.35)] backdrop-blur md:p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 md:text-base">
                      Gemini AI 근로감독 코멘트
                    </h2>
                    <p className="mt-1 text-[11px] text-slate-800/80">
                      점수와 미준수 항목을 기반으로, 노무 관점에서 한 번 더 요약해 드립니다.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-900/20 bg-white/70 px-2 py-0.5 text-[10px] font-medium text-slate-900">
                    Powered by Gemini
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="min-h-[60px] rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] text-slate-900">
                    {aiLoading && <p>AI가 리포트를 작성 중입니다…</p>}
                    {!aiLoading && aiSummary && (
                      <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed">
                        {aiSummary}
                      </pre>
                    )}
                    {!aiLoading && !aiSummary && !aiError && (
                      <p className="text-slate-500">
                        아래 버튼을 눌러 Gemini가 진단 결과를 요약하도록 할 수 있습니다.
                      </p>
                    )}
                    {aiError && !aiLoading && (
                      <p className="text-[11px] text-rose-500">
                        {aiError}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleGenerateAiSummary}
                      disabled={aiLoading}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-[11px] font-semibold text-white shadow-md shadow-slate-300/60 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {aiLoading ? 'AI 요약 생성 중…' : 'Gemini로 리포트 생성'}
                    </button>
                  </div>
                </div>
              </section>

              {/* 상세 상담 (Gemini) */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 text-xs text-slate-900 shadow-[0_18px_70px_rgba(148,163,184,0.35)] backdrop-blur md:p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 md:text-base">
                      상세 상담 · Gemini에게 물어보기
                    </h2>
                    <p className="mt-1 text-[11px] text-slate-500">
                      우리 사업장 상황에 맞는 구체적인 질문을 남기면, 노무 상담 형태로 답변해 줍니다.
                    </p>
                  </div>
                </div>
                <div className="mb-3 max-h-60 space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px]">
                  {chatHistory.length === 0 && (
                    <p className="text-slate-500">
                      예시) &quot;연장근로 관리에서 당장 손봐야 할 서류는 무엇인가요?&quot;,
                      &quot;연차휴가 관리 개선은 어떤 순서로 진행하면 좋을까요?&quot;
                    </p>
                  )}
                  {chatHistory.map((m, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <p
                        className={`font-semibold ${
                          m.role === 'user' ? 'text-sky-600' : 'text-emerald-600'
                        }`}
                      >
                        {m.role === 'user' ? '나' : 'Gemini 상담'}
                      </p>
                      <p className="whitespace-pre-wrap break-words text-slate-800">
                        {m.content}
                      </p>
                    </div>
                  ))}
                  {chatError && (
                    <p className="mt-1 text-[11px] text-rose-500">
                      {chatError}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 md:flex-row">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    rows={2}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-900 outline-none transition focus:border-secondary focus:ring-1 focus:ring-secondary/40 md:flex-1"
                    placeholder="궁금한 점을 자유롭게 적어 주세요. 예: 연차휴가 관리에서 지금 제도가 법에 맞는지 알고 싶어요."
                  />
                  <button
                    type="button"
                    onClick={handleAskDetail}
                    disabled={chatLoading || !chatInput.trim()}
                    className="mt-1 inline-flex items-center justify-center rounded-2xl bg-secondary px-4 py-2 text-[11px] font-semibold text-slate-950 shadow-md shadow-secondary/50 transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60 md:mt-0 md:w-32"
                  >
                    {chatLoading ? '상담 중…' : '질문 보내기'}
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-slate-500">
                  ※ 실제 법률 자문이 아니며, 구체적인 분쟁/사건이 있는 경우에는 노무사·변호사와의 개별 상담이 필요합니다.
                </p>
              </section>
            </div>

            <div className="space-y-5 md:space-y-6">
              {/* 상세 결과 아코디언 */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-[0_18px_70px_rgba(148,163,184,0.35)] backdrop-blur md:p-6">
                <h2 className="mb-3 text-sm font-semibold text-slate-900 md:text-base">
                  문항별 상세 결과
                </h2>
                <div className="max-h-[320px] space-y-1 overflow-auto pr-1 text-xs md:max-h-[360px]">
                  {CATEGORIES.map((cat, cid) => (
                    <div key={cid} className="border-b border-slate-100 last:border-0">
                      <button
                        className="flex w-full items-center justify-between py-3 text-left font-medium text-slate-900"
                        onClick={() => setOpenAccordion(openAccordion === cid ? null : cid)}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[11px] text-slate-500">
                          {openAccordion === cid ? '접기' : '펼치기'}
                        </span>
                      </button>
                      {openAccordion === cid && (
                        <div className="pb-3">
                          {QUESTIONS.filter((q) => q.categoryId === cid).map((q) => {
                            const globalIndex = QUESTIONS.findIndex((x) => x === q)
                            const ans = answers[globalIndex]
                            const isNonCompliant =
                              ans === '아니오' || ['일부', '모름', '확인필요'].includes(ans)
                            return (
                              <div
                                key={globalIndex}
                                className="mb-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-800 last:mb-0"
                              >
                                <p className="mb-1 text-slate-900">{q.text}</p>
                                <p>
                                  응답:{' '}
                                  <span
                                    className={
                                      isNonCompliant
                                        ? 'font-semibold text-rose-600'
                                        : 'text-slate-600'
                                    }
                                  >
                                    {ans}
                                  </span>
                                </p>
                                {isNonCompliant && (
                                  <p className="mt-1 text-[10px] text-amber-700/90">
                                    → 해당 항목은 근로감독 시 지적 가능성이 높은 영역입니다.
                                    관련 법령과 취업규칙, 근로계약서를 우선적으로 점검해 주세요.
                                  </p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* 액션 플랜 - 미준수 항목 전체 목록 */}
              {nonCompliant.length > 0 && (
                <section className="rounded-3xl border border-slate-200 bg-white p-5 text-xs text-slate-800 shadow-[0_18px_70px_rgba(148,163,184,0.35)] backdrop-blur md:p-6">
                  <h2 className="mb-3 text-sm font-semibold text-slate-900 md:text-base">
                    개선이 필요한 핵심 항목 전체
                  </h2>
                  <ul className="space-y-1.5">
                    {nonCompliant.slice(0, 30).map((item) => (
                      <li key={item.index} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                        <div className="space-y-0.5">
                          <p className="text-[11px] text-slate-800">{item.text}</p>
                          <p className="text-[10px] text-slate-500">
                            응답: <span className="font-medium text-rose-600">{item.answer}</span>{' '}
                            · {item.categoryName}
                          </p>
                        </div>
                      </li>
                    ))}
                    {nonCompliant.length > 30 && (
                      <li className="text-[11px] text-slate-500">
                        외 {nonCompliant.length - 30}개 항목
                      </li>
                    )}
                  </ul>
                </section>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-[10px] text-slate-400">
          본 진단 결과와 AI 코멘트는 노동관계 법령과 일반적인 실무를 바탕으로 한 참고용 정보이며, 개별 사건에 대한
          법률 자문이나 행정해석을 대체하지 않습니다. 구체적인 조치·분쟁 대응은 노무법인 위너스 조대진 노무사 등
          전문가와 별도 상담을 통해 결정하시기 바랍니다.
        </p>
      </div>
    </div>
  )
}
