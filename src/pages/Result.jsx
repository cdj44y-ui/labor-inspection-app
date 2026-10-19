import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { QUESTIONS, CATEGORIES } from '../data/questions.js'
import { getTotalScore, getCategoryScores, getGrade, GRADE_LABELS } from '../utils/score.js'
import { buildTallyUrl } from '../utils/tally.js'
import { getVerifiedPenalty } from '../data/penalties.js'
import SiteFooter from '../components/common/SiteFooter.jsx'
import ResultSheet from '../components/result/ResultSheet.jsx'
import { buildEnrichedItems, filterViolations } from '../utils/penaltyCalculator.js'

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
          <Link to="/diagnosis" className="mt-7 inline-flex h-[56px] items-center rounded-[10px] bg-[#1976D2] px-8 text-[18px] font-bold text-white no-underline visited:text-white">진단 시작하기 →</Link>
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

  const weakest = CATEGORIES.map((c, i) => ({ name: c.name, score: categoryScores[i] })).sort((a, b) => a.score - b.score)

  return (
    <div className="min-h-screen bg-white pb-28 text-[#14213D] [word-break:keep-all]">
      <header className="border-b border-[#DDE2EA]">
        <div className="mx-auto flex h-[68px] max-w-[1040px] items-center justify-between px-5 md:px-8">
          <Link to="/" className="text-[21px] font-extrabold no-underline text-[#14213D]">RISK<span className="text-[#1976D2]">119</span></Link>
          <span className="text-[16px] font-semibold text-[#5B6680]">노무법인 위너스</span>
        </div>
      </header>

      {/* 결과지 — 브랜드 v1.1 공통 형식 */}
      <ResultSheet answers={answers} totalScore={totalScore} gradeLabel={gradeInfo.label} gradeMessage={gradeInfo.message} categoryScores={categoryScores} items={items} />
      <div className="bg-[#F9FAFB] pb-12">
        <div className="mx-auto flex max-w-[880px] flex-col items-center gap-3 px-4 text-center md:px-8">
          <a href={tallyCall} target="_blank" rel="noopener noreferrer" className="inline-flex h-[60px] w-full items-center justify-center rounded-[12px] bg-[#1F4E79] text-[20px] font-bold text-white no-underline hover:bg-[#173B5C] visited:text-white md:w-auto md:px-12">상담 신청 →</a>
          <p className="text-[15px] text-[#6B7280]">진단 결과가 신청서에 자동으로 담깁니다. 상담은 유료 자문으로 진행됩니다.</p>
        </div>
      </div>

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
            <p className="mt-2 text-[18px] text-[#5B6680]">위반 소지가 있는 항목입니다. 처벌 수준이 확인된 항목부터 보여드립니다.</p>
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
      <section className="border-b border-[#DDE2EA] py-14 md:py-[72px]">
        <div className="mx-auto max-w-[1040px] px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[28px] font-bold tracking-[-0.6px] md:text-[32px]">영역별 점수</h2>
              <p className="mt-1.5 text-[17px] text-[#5B6680]">점수가 낮은 영역부터 보여드립니다. 점선은 양호 기준(90점)입니다.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-[14px] font-semibold text-[#3D4A63]">
              {[['양호', '#1565C0'], ['주의', '#C08A1E'], ['경고', '#D2601A'], ['위험', '#B42318']].map(([l, c]) => (
                <span key={l} className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: c }} />{l}</span>
              ))}
            </div>
          </div>
          <div className="mt-8 divide-y divide-[#E6EAF0] rounded-[16px] border border-[#DDE2EA] bg-white">
            {weakest.map((c) => {
              const s = c.score >= 90 ? ['양호', '#1565C0', '#E3F0FB'] : c.score >= 70 ? ['주의', '#C08A1E', '#FBF3E2'] : c.score >= 50 ? ['경고', '#D2601A', '#FDEEE4'] : ['위험', '#B42318', '#FDECEC']
              return (
                <div key={c.name} className="px-5 py-5 md:px-7">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[19px] font-bold">{c.name}</p>
                    <p className="flex items-baseline gap-2">
                      <span className="rounded-md px-2 py-0.5 text-[14px] font-bold" style={{ color: s[1], background: s[2] }}>{s[0]}</span>
                      <span className="text-[28px] font-extrabold leading-none tracking-[-0.5px]" style={{ color: s[1] }}>{c.score}</span>
                      <span className="text-[16px] font-semibold text-[#5B6680]">점</span>
                    </p>
                  </div>
                  <div className="relative mt-3 h-[18px] rounded-full bg-[#EEF1F5]">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: Math.max(c.score, 2) + '%', background: s[1] }} />
                    <div className="absolute inset-y-[-4px] w-0 border-l-2 border-dashed border-[#14213D]/40" style={{ left: '90%' }} aria-hidden />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. 먼저 지나온 사람 */}
      <section className="border-b border-[#DDE2EA] bg-[#F5F7FA] py-14 md:py-[72px]">
        <div className="mx-auto grid max-w-[1040px] items-start gap-10 px-5 md:grid-cols-[200px_1fr] md:px-8">
          <img src="/expert/cho-daejin.jpg" alt="조대진 대표노무사" width="200" height="260" className="h-[260px] w-[200px] rounded-xl object-cover" />
          <div>
            <p className="text-[17px] font-bold text-[#1976D2]">이 결과를 함께 정리할 사람</p>
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
                  <span className="text-[22px] font-extrabold text-[#1976D2]">{n}</span>
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
          <a href={tallyCall} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex h-[64px] w-full items-center justify-center rounded-[12px] bg-[#1F4E79] text-[21px] font-bold text-white no-underline hover:bg-[#173B5C] visited:text-white md:w-auto md:px-12">
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
