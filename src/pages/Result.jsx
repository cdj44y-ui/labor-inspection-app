import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../data/questions.js'
import { getTotalScore, getCategoryScores, getGrade, GRADE_LABELS } from '../utils/score.js'
import { CONTACT_PHONE } from '../constants/contact.js'
import { buildTallyUrl } from '../utils/tally.js'
import { getVerifiedPenalty } from '../data/penalties.js'
import SiteFooter from '../components/common/SiteFooter.jsx'
import { buildEnrichedItems, filterViolations } from '../utils/penaltyCalculator.js'

const ANSWERS_KEY = 'labor_diagnosis_answers'
const GRADE_TONE = {
  safe: { bar: '#1B64DA', text: '#1B64DA' },
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
          <Link to="/diagnosis" className="mt-7 inline-flex h-[56px] items-center rounded-[10px] bg-[#3182F6] px-8 text-[18px] font-bold text-white no-underline visited:text-white">진단 시작하기 →</Link>
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
    grade: gradeInfo.label,
    area: areas.join(', ') || '위반 소지 없음',
    items: '15분 전화상담 요청 · 위반 소지 ' + items.length + '건' + (criminalCount ? ' (형사처벌 조문 ' + criminalCount + '건)' : ''),
  })
  const tallyGuide = buildTallyUrl({
    score: totalScore + '점',
    grade: gradeInfo.label,
    area: areas.join(', ') || '위반 소지 없음',
    items: '무료 개선 가이드 요청 · 위반 소지 ' + items.length + '건',
  })

  const weakest = CATEGORIES.map((c, i) => ({ name: c.name, score: categoryScores[i] })).sort((a, b) => a.score - b.score)

  return (
    <div className="min-h-screen bg-white pb-28 text-[#14213D] [word-break:keep-all]">
      <header className="border-b border-[#DDE2EA]">
        <div className="mx-auto flex h-[68px] max-w-[1040px] items-center justify-between px-5 md:px-8">
          <Link to="/" className="text-[21px] font-extrabold no-underline text-[#14213D]">RISK<span className="text-[#3182F6]">119</span></Link>
          <a href={'tel:' + String(CONTACT_PHONE).replace(/[^0-9]/g, '')} className="text-[16px] font-bold no-underline text-[#14213D]">상담 전화 {CONTACT_PHONE}</a>
        </div>
      </header>

      {/* 1. 나의 위험 */}
      <section className="bg-[#14213D] text-white">
        <div className="mx-auto grid max-w-[1040px] gap-10 px-5 py-14 md:grid-cols-[1fr_1.1fr] md:px-8 md:py-[72px]">
          <div>
            <p className="text-[17px] font-semibold text-[#AFC3E8]">근로감독 자가진단 결과</p>
            <p className="mt-3 text-[88px] font-extrabold leading-none tracking-[-3px] md:text-[104px]">{totalScore}<span className="ml-1 text-[32px] font-bold tracking-normal text-[#AFC3E8]">점</span></p>
            <p className="mt-4 inline-block rounded-md bg-white px-3 py-1.5 text-[18px] font-extrabold" style={{ color: tone.text }}>{gradeInfo.label} · {gradeInfo.message}</p>
          </div>
          <div className="self-end">
            {items.length > 0 ? (
              <>
                <p className="text-[30px] font-bold leading-[1.4] md:text-[36px]">
                  감독관이 확인하면 지적될 수 있는<br />항목이 <span className="text-[#FFB4A8]">{items.length}건</span> 있습니다.
                </p>
                {criminalCount > 0 && (
                  <p className="mt-4 text-[19px] leading-[1.6] text-[#DCE4F2]">그중 <b className="text-white">{criminalCount}건</b>은 징역형까지 규정된 조문에 해당합니다.</p>
                )}
                <p className="mt-2 text-[17px] text-[#AFC3E8]">위반 소지 영역: {areas.join(' · ')}</p>
              </>
            ) : (
              <p className="text-[28px] font-bold leading-[1.45]">현재 응답 기준으로 위반 소지 항목이 확인되지 않았습니다.</p>
            )}
          </div>
        </div>
      </section>

      {/* 2. 놓치고 있는 것 */}
      {items.length > 0 && (
        <section className="border-b border-[#DDE2EA] py-14 md:py-[72px]">
          <div className="mx-auto max-w-[1040px] px-5 md:px-8">
            <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[34px]">지금 놓치고 계신 것</h2>
            <p className="mt-2 text-[18px] text-[#5B6680]">답변하신 내용 중 위반 소지가 있는 항목입니다. 처벌 수준이 법령 원문으로 확인된 항목부터 보여드립니다.</p>
            <div className="mt-8 border-t-2 border-[#14213D]">
              {shown.map((v, i) => (
                <div key={v.id} className="grid gap-3 border-b border-[#DDE2EA] py-6 md:grid-cols-[48px_1fr]">
                  <p className="text-[22px] font-extrabold text-[#B42318]">{String(i + 1).padStart(2, '0')}</p>
                  <div>
                    <p className="text-[15px] font-bold text-[#5B6680]">{v.categoryLabel} · 응답: {v.answer}</p>
                    <h3 className="mt-1 text-[21px] font-bold leading-[1.5]">{v.question}</h3>
                    <p className="mt-2 text-[17px] text-[#3D4A63]"><b className="text-[#14213D]">법적 근거</b> · {v.legalBasis}</p>
                    {v.verified ? (
                      <p className="mt-1 text-[17px] text-[#B42318]"><b>위반 시</b> · {v.verified.penaltyDetail}</p>
                    ) : (
                      <p className="mt-1 text-[16px] text-[#5B6680]">처벌 수준은 위반 내용과 해당 조문에 따라 정해집니다.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {rest > 0 && <p className="mt-5 text-[18px] font-semibold">이 밖에도 <b className="text-[#B42318]">{rest}건</b>이 더 있습니다. 전체 목록은 상담에서 함께 확인해 드립니다.</p>}
          </div>
        </section>
      )}

      {/* 3. 왜 혼자 어려운가 */}
      {items.length > 0 && (
        <section className="border-b border-[#DDE2EA] bg-[#F5F7FA] py-14 md:py-[72px]">
          <div className="mx-auto max-w-[1040px] px-5 md:px-8">
            <h2 className="text-[30px] font-bold leading-[1.35] tracking-[-0.8px] md:text-[34px]">서류만 고친다고 끝나지 않습니다</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                ['과거분은 이미 쌓여 있습니다', '임금채권은 3년간 행사할 수 있습니다. 지금 고쳐도 지난 3년 치 미지급분은 따로 정리해야 합니다.', '근로기준법 제49조'],
                ['서류끼리 맞아야 합니다', '감독은 근로계약서, 임금대장, 출퇴근 기록을 서로 대조합니다. 한 곳만 고치면 오히려 불일치가 드러납니다.', '근로기준법 제17조·제41조·제48조'],
                ['제도를 바꾸는 데도 절차가 있습니다', '취업규칙을 근로자에게 불리하게 바꾸려면 근로자 과반수(과반수 노동조합이 있으면 그 노동조합)의 동의가 필요합니다. 절차를 놓치면 변경의 효력이 인정되지 않을 수 있습니다.', '근로기준법 제94조'],
              ].map(([t, d, law]) => (
                <div key={t} className="rounded-[14px] border border-[#DDE2EA] bg-white p-7">
                  <h3 className="text-[21px] font-bold leading-[1.45]">{t}</h3>
                  <p className="mt-2.5 text-[17px] leading-[1.7] text-[#3D4A63]">{d}</p>
                  <p className="mt-3 text-[14px] font-semibold text-[#5B6680]">근거: {law}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 영역별 점수 */}
      <section className="border-b border-[#DDE2EA] py-14 md:py-[64px]">
        <div className="mx-auto max-w-[1040px] px-5 md:px-8">
          <h2 className="text-[26px] font-bold md:text-[30px]">영역별 점수</h2>
          <div className="mt-6 space-y-4">
            {weakest.map((c) => (
              <div key={c.name} className="grid grid-cols-[150px_1fr_56px] items-center gap-4 md:grid-cols-[220px_1fr_64px]">
                <span className="text-[17px] font-semibold">{c.name}</span>
                <div className="h-3.5 overflow-hidden rounded-full bg-[#E6EAF0]">
                  <div className="h-full rounded-full" style={{ width: c.score + '%', background: c.score >= 90 ? '#1B64DA' : c.score >= 70 ? '#B7791F' : c.score >= 50 ? '#C2410C' : '#B42318' }} />
                </div>
                <span className="text-right text-[18px] font-bold">{c.score}점</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 먼저 지나온 사람 */}
      <section className="border-b border-[#DDE2EA] bg-[#F5F7FA] py-14 md:py-[72px]">
        <div className="mx-auto grid max-w-[1040px] items-start gap-10 px-5 md:grid-cols-[200px_1fr] md:px-8">
          <img src="/expert/cho-daejin.jpg" alt="조대진 대표노무사" width="200" height="260" className="h-[260px] w-[200px] rounded-xl object-cover" />
          <div>
            <p className="text-[17px] font-bold text-[#3182F6]">이 결과를 함께 정리할 사람</p>
            <h2 className="mt-2 text-[30px] font-bold md:text-[34px]">조대진 대표노무사</h2>
            <p className="mt-1 text-[17px] text-[#5B6680]">노무법인 위너스 · 공인노무사 16년 · 안전공학 박사 · 현대카드·삼성서울병원 인사 출신</p>
            <p className="mt-5 text-[20px] font-semibold leading-[1.6]">대기업 근로감독을 매년 현장에서 대응해 왔고, 금융·IT·보건의료·제조 자문사와 감독을 함께 준비해 왔습니다. 위반 항목을 어떤 순서로, 어떤 서류로 정리해야 하는지 알고 있습니다.</p>
            <div className="mt-7 border-t-2 border-[#14213D]">
              {[
                ['1', '결과 해설', '15분 통화로 위반 소지 항목 중 먼저 손볼 것을 짚어 드립니다.'],
                ['2', '정비와 소급 정리', '계약서·임금대장·근로시간 기록을 맞추고 과거분 정리 방안을 세웁니다.'],
                ['3', '감독 대비', '감독관이 요구하는 서류와 설명 순서를 미리 준비합니다.'],
              ].map(([n, t, d]) => (
                <div key={n} className="grid grid-cols-[44px_1fr] gap-3 border-b border-[#DDE2EA] py-4">
                  <span className="text-[22px] font-extrabold text-[#3182F6]">{n}</span>
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
          <p className="mt-4 text-[19px] leading-[1.7] text-[#3D4A63]">진단 결과는 상담 신청서에 자동으로 담깁니다. 다시 설명하실 필요가 없습니다.</p>
          <a href={tallyCall} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex h-[64px] w-full items-center justify-center rounded-[12px] bg-[#3182F6] text-[21px] font-bold text-white no-underline hover:bg-[#1B64DA] visited:text-white md:w-auto md:px-12">
            15분 무료 전화상담 요청하기 →
          </a>
          <p className="mt-4 text-[16px] text-[#5B6680]">상담 신청은 무료이며, 이후 진행 여부는 직접 결정하시면 됩니다.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[17px]">
            <a href={tallyGuide} target="_blank" rel="noopener noreferrer" className="font-bold text-[#1B64DA] underline underline-offset-4">무료 개선 가이드 받기</a>
            <a href={'tel:' + String(CONTACT_PHONE).replace(/[^0-9]/g, '')} className="font-bold text-[#14213D] underline underline-offset-4">바로 전화하기 {CONTACT_PHONE}</a>
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
            <p className="text-[16px] font-bold md:text-[18px]">위반 소지 <span className="text-[#B42318]">{items.length}건</span><span className="hidden font-normal text-[#5B6680] md:inline"> · 결과가 상담 신청서에 자동으로 담깁니다</span></p>
            <a href={tallyCall} target="_blank" rel="noopener noreferrer" className="inline-flex h-[52px] shrink-0 items-center rounded-[10px] bg-[#3182F6] px-6 text-[17px] font-bold text-white no-underline visited:text-white">15분 무료 상담 요청</a>
          </div>
        </div>
      )}
    </div>
  )
}
