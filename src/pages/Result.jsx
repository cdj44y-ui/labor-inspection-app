import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../data/questions.js'
import { getTotalScore, getCategoryScores, getGrade, GRADE_LABELS } from '../utils/score.js'
import { buildTallyUrl } from '../utils/tally.js'
import { getVerifiedPenalty } from '../data/penalties.js'
import SiteFooter from '../components/common/SiteFooter.jsx'
import ResultSheet from '../components/result/ResultSheet.jsx'
import { buildEnrichedItems, filterViolations } from '../utils/penaltyCalculator.js'
import ReportRequest from '../components/result/ReportRequest.jsx'

const ANSWERS_KEY = 'labor_diagnosis_answers'
const GRADE_TONE = {
  safe: { bar: '#1565C0', text: '#1565C0' },
  caution: { bar: '#B7791F', text: '#B7791F' },
  warning: { bar: '#C2410C', text: '#C2410C' },
  danger: { bar: '#B42318', text: '#B42318' },
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

  const enriched = useMemo(() => (answers && answers.length === QUESTIONS.length ? buildEnrichedItems(answers) : []), [answers])
  const violations = useMemo(() => filterViolations(enriched), [enriched])

  if (!answers || answers.length !== QUESTIONS.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-5 text-[#14213D]">
        <div className="w-full max-w-[560px] rounded-[16px] border border-[#DDE2EA] bg-white p-10 text-center">
          <p className="text-[22px] font-bold">아직 진단 결과가 없습니다</p>
          <p className="mt-2 text-[17px] text-[#5B6680]">50여 개 질문에 답하시면 위반 소지 항목과 법적 근거를 정리해 드립니다.</p>
          <Link to="/diagnosis" className="mt-7 inline-flex h-[56px] items-center rounded-[10px] bg-[#1B2A44] px-8 text-[18px] font-bold text-white no-underline visited:text-white">진단 시작하기 →</Link>
        </div>
      </div>
    )
  }

  const totalScore = getTotalScore(answers)
  const categoryScores = getCategoryScores(answers)
  const grade = getGrade(totalScore)
  const gradeInfo = GRADE_LABELS[grade]
  const tone = GRADE_TONE[grade]

  // 위반 항목: 처벌이 원문으로 확인된 항목 → 고위험 → 나머지 순
  const items = violations.map((v) => ({ ...v, verified: getVerifiedPenalty(v.questionIndex) }))
  const rank = (v) => (v.verified ? 0 : v.riskLevel === 'high' ? 1 : 2)
  items.sort((a, b) => rank(a) - rank(b))
  const criminalCount = items.filter((v) => v.verified && /징역/.test(v.verified.penaltyDetail)).length
  const verifiedCount = items.filter((v) => v.verified).length
  const shown = items.slice(0, 6)
  const rest = items.length - shown.length
  const areas = [...new Set(items.map((v) => v.categoryLabel).filter(Boolean))]

  const tallyCall = buildTallyUrl({
    score: totalScore + '점',
    grade: '[RISK119] ' + gradeInfo.label,
    area: areas.join(', ') || '위반 소지 없음',
    items: '상담 신청 · 위반 소지 ' + items.length + '건' + (criminalCount ? ' (형사처벌 조문 ' + criminalCount + '건)' : ''),
  })

  try { if (!window.__riskDone) { window.__riskDone = 1; window.va && window.va('event', { name: 'diag_complete', data: { site: 'risk', grade: gradeInfo.label } }) } } catch (_) {}

  // 2026-10-25 '지금 우리 회사는 어디쯤' 흐름 — 근거: 노동감독관 수사규칙(고용노동부훈령 제612호, 2026.10.2. 시행)
  const FLOW = [
    ['신고·제보', '익명 신고나 보도만으로도 입건 전 확인이 시작될 수 있습니다.', '제17조'],
    ['감독', '감독관이 기록을 확인하고 대개 기한을 정해 시정을 지시합니다. 중대한 위반은 바로 수사로 갈 수 있습니다.', '제18조 제2항 제2호·제5호'],
    ['시정기한', '기한 안에 이행하지 않으면 감독관은 즉시 범죄를 인지해 수사를 시작합니다.', '제18조 제2항 제4호'],
    ['수사', '원칙적으로 3개월 안에 송치 여부를 결정합니다(일부 법률 제외).', '제21조'],
    ['송치', '수사 결과와 의견서가 검찰로 넘어갑니다.', '제44조'],
  ]

  const weakest = CATEGORIES.map((c, i) => ({ name: c.name, score: categoryScores[i] })).sort((a, b) => a.score - b.score)

  return (
    <div className="min-h-screen bg-white pb-28 text-[#14213D] [word-break:keep-all]">
      <header className="border-b border-[#DDE2EA]">
        <div className="mx-auto flex h-[68px] max-w-[1040px] items-center justify-between px-5 md:px-8">
          <Link to="/" className="text-[21px] font-extrabold no-underline text-[#14213D]">RISK<span className="text-[#1B2A44]">119</span></Link>
          <span className="text-[16px] font-semibold text-[#5B6680]">노무법인 위너스</span>
        </div>
      </header>

      {/* 결과지 — 브랜드 v1.1 공통 형식 */}
      <ResultSheet answers={answers} totalScore={totalScore} gradeLabel={gradeInfo.label} gradeMessage={gradeInfo.message} categoryScores={categoryScores} items={items} />
      {/* 영역별 점수 — 2026-10-31 읽기 쉽게: 막대는 사이트색 하나, 낮은 영역만 굵게 */}
      <section className="border-b border-[#E6E6E6] py-12 md:py-[64px]">
        <div className="mx-auto max-w-[1040px] px-5 md:px-8">
          <h2 className="text-[26px] font-bold tracking-[-0.6px] md:text-[30px]">영역별 점수</h2>
          <p className="mt-1.5 text-[16px] text-[#666]">낮은 영역부터 보여드립니다. 90점 이상이면 양호입니다.</p>
          <div className="mt-6 border-t border-[#111]">
            {weakest.map((c) => {
              const low = c.score < 70
              const word = c.score >= 90 ? '양호' : c.score >= 70 ? '주의' : c.score >= 50 ? '경고' : '위험'
              return (
                <div key={c.name} className="border-b border-[#E6E6E6] py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className={'text-[18px] ' + (low ? 'font-extrabold text-[#111]' : 'font-semibold text-[#333]')}>{c.name}</p>
                    <p className="flex items-baseline gap-2"><span className="text-[15px] text-[#666]">{word}</span><span className="text-[24px] font-extrabold leading-none text-[#1B2A44]">{c.score}</span></p>
                  </div>
                  <div className="mt-2.5 h-[8px] bg-[#EEEEEE]">
                    <div className="h-full" style={{ width: Math.max(c.score, 2) + '%', background: low ? '#1B2A44' : '#8A93A6' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 2026-10-29 리포트 받기 */}
      <ReportRequest answers={answers} tallyUrl={tallyCall} />

      {/* 4. 먼저 지나온 사람 */}
      <section className="border-b border-[#DDE2EA] bg-[#F5F7FA] py-14 md:py-[72px]">
        <div className="mx-auto grid max-w-[1040px] items-start gap-10 px-5 md:grid-cols-[200px_1fr] md:px-8">
          <img src="/expert/cho-daejin.jpg" alt="조대진 대표노무사" width="200" height="260" className="h-[156px] w-[120px] rounded-[4px] object-cover md:h-[200px] md:w-[154px]" />
          <div>
            <p className="text-[17px] font-bold text-[#1B2A44]">이 결과를 함께 정리할 사람</p>
            <h2 className="mt-2 text-[30px] font-bold md:text-[34px]">대기업 인사팀 출신 노무사, 조대진</h2>
            <p className="mt-1 text-[17px] text-[#5B6680]">공인노무사 16년 · 안전공학 박사 · 노무법인 위너스 · 현대카드·삼성서울병원 인사 출신</p>
            <p className="mt-5 text-[20px] font-semibold leading-[1.6]">대기업 근로감독을 매년 현장에서 대응해 왔습니다. 위반 항목을 어떤 순서와 서류로 정리할지 함께 짚어 드립니다.</p>
            <div className="mt-7 border-t-2 border-[#14213D]">
              {[
                ['1', '결과 검토', '신청서에 담긴 진단 결과를 검토해 먼저 손볼 항목을 정리합니다.'],
                ['2', '정비와 소급 정리', '계약서·임금대장·근로시간 기록을 맞추고 과거분 정리 방안을 세웁니다.'],
                ['3', '감독 대비', '감독관이 요구하는 서류와 설명 순서를 미리 준비합니다.'],
              ].map(([n, t, d]) => (
                <div key={n} className="grid grid-cols-[44px_1fr] gap-3 border-b border-[#DDE2EA] py-4">
                  <span className="text-[22px] font-extrabold text-[#1B2A44]">{n}</span>
                  <p className="text-[18px] leading-[1.6]"><b>{t}</b> — <span className="text-[#3D4A63]">{d}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 제안 */}
      <section className="py-14 md:py-[80px]">
        <div className="mx-auto max-w-[760px] px-5 text-center md:px-8">
          <h2 className="text-[32px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[38px]">감독 통지서가 오기 전에<br />결과를 함께 정리하십시오</h2>
          <p className="mt-4 text-[19px] leading-[1.7] text-[#3D4A63]">진단 결과는 신청서에 자동으로 담깁니다.</p>
          <a href={tallyCall} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex h-[64px] w-full items-center justify-center bg-[#111] text-[21px] font-bold text-white no-underline hover:bg-[#333] visited:text-white md:w-auto md:px-12">
            상담 신청 →
          </a>
          <p className="mt-4 text-[16px] leading-[1.7] text-[#5B6680]">상담은 유료 자문으로 진행됩니다. 신청서를 확인한 뒤 일정과 비용을 안내드립니다.<br />일정에 따라 노무법인 위너스 소속 노무사가 먼저 연락드릴 수 있습니다.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[17px]">
            <Link to="/diagnosis" className="text-[#5B6680] underline underline-offset-4">다시 진단하기</Link>
          </div>
        </div>
      </section>

      <p className="mx-auto max-w-[1040px] px-5 pb-10 text-[14px] leading-[1.7] text-[#5B6680] md:px-8">
        본 결과는 응답 내용과 노동관계 법령을 바탕으로 한 참고용 점검이며 법률 자문이나 행정해석을 대체하지 않습니다. 처벌 수준은 법령 원문으로 확인된 항목에만 표시했고, 시행 전 조항은 시행일을 함께 적었습니다.
      </p>
      <SiteFooter />

      {/* 하단 고정 */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#DDE2EA] bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-3 px-5 py-3 md:px-8">
            <p className="text-[16px] font-bold md:text-[18px]">위반 소지 <span className="text-[#B42318]">{items.length}건</span><span className="hidden font-normal text-[#5B6680] md:inline"> · 진단 결과가 신청서에 자동으로 담깁니다</span></p>
            <a href={tallyCall} target="_blank" rel="noopener noreferrer" className="inline-flex h-[52px] shrink-0 items-center rounded-[10px] bg-[#1F4E79] hover:bg-[#173B5C] px-6 text-[17px] font-bold text-white no-underline visited:text-white">상담 신청</a>
          </div>
        </div>
      )}
    </div>
  )
}
