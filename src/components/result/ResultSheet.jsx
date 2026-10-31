import { QUESTIONS, CATEGORIES } from '../../data/questions.js'
import { SITE_NAME, SITE_COLOR, VERIFIED_DATE, KAKAO_URL } from '../../constants/brand.js'

/** A4 결과지 — 네 사이트 공통 형식(① 결론 ② 먼저 고칠 3가지 ③ 항목별 근거 ④ 확인 필요 ⑤ 다음 점검일). 인쇄·PDF 없음 */
const fmt = (d) => d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0')
const ymd = (d) => '' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0')
const shortLaw = (s) => (s || '').split(/[,·]/)[0].replace(/\(.*$/, '').trim()

function downloadIcs(next) {
  const end = new Date(next.getTime() + 86400000)
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Winners//119//KO', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    'UID:' + SITE_NAME + '-' + ymd(next) + '-' + Date.now() + '@risk119.site',
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    'DTSTART;VALUE=DATE:' + ymd(next), 'DTEND;VALUE=DATE:' + ymd(end),
    'SUMMARY:' + SITE_NAME + ' 반기 재진단', 'DESCRIPTION:같은 문항으로 다시 점검합니다. https://risk119.site', 'URL:https://risk119.site',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'RISK119-반기재진단-' + ymd(next) + '.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function Head({ n, t, right }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="text-[18px] font-bold text-[#111827]"><span style={{ color: SITE_COLOR }}>{n}</span> {t}</h3>
      {right ? <span className="text-[14px] font-semibold text-[#6B7280]">{right}</span> : null}
    </div>
  )
}

export default function ResultSheet({ answers, totalScore, gradeLabel, gradeMessage, categoryScores, items }) {
  const today = new Date()
  const next = new Date(today)
  next.setMonth(next.getMonth() + 6)
  const order = { '아니오': 0, '일부': 1, '모름': 2, '확인필요': 2 }
  const fix = [...items].sort((a, b) => (order[a.answer] ?? 3) - (order[b.answer] ?? 3) || (a.verified ? 0 : 1) - (b.verified ? 0 : 1)).slice(0, 3)
  const pending = QUESTIONS.map((q, i) => ({ q, a: answers[i] })).filter((x) => ['모름', '확인필요', '일부'].includes(x.a))

  return (
    <section className="bg-[#F9FAFB] py-10 md:py-14">
      <div className="mx-auto max-w-[880px] px-4 md:px-8">
        <article className="rounded-[12px] border border-[#D1D5DB] bg-white p-5 text-[17px] leading-[1.7] text-[#374151] [word-break:keep-all] md:p-8">
          <header className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-[#111827] pb-4">
            <h2 className="text-[24px] font-bold text-[#111827]">{SITE_NAME} 진단 결과지</h2>
            <p className="text-[15px] font-semibold text-[#6B7280]">진단일 {fmt(today)}</p>
          </header>

          <div className="border-b border-[#E5E7EB] py-6">
            <Head n="①" t="결론" />
            <p className="mt-2 text-[22px] font-bold text-[#111827]">{gradeLabel} 단계입니다 <span style={{ color: SITE_COLOR }}>({totalScore}점)</span></p>
            <p className="mt-1">{gradeMessage}{items.length > 0 ? ' · 위반 소지 ' + items.length + '건' : ''}</p>
          </div>

          <div className="border-b border-[#E5E7EB] py-6">
            <Head n="②" t="먼저 고칠 3가지" />
            {fix.length === 0 ? (
              <p className="mt-2">지금 응답 기준으로 급히 고칠 항목은 없습니다.</p>
            ) : (
              <ol className="mt-3 space-y-3">
                {fix.map((v, i) => (
                  <li key={v.id} className="grid grid-cols-[28px_1fr] gap-2">
                    <b style={{ color: SITE_COLOR }}>{i + 1}</b>
                    <div>
                      <p className="font-semibold text-[#111827]">{v.question} <span className="font-normal text-[#6B7280]">(응답: {v.answer})</span></p>
                      <p className="text-[15px] text-[#6B7280]">근거: {QUESTIONS[v.questionIndex]?.law || v.legalBasis}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* 2026-10-31 부분 공개: 상세 근거·확인 필요는 메일 리포트로(정보에 걸맞은 3칸 입력 — 대표님 결정) */}
          <div className="border-b border-[#E5E7EB] py-6">
            <div className="border border-[#111827] bg-[#F9FAFB] px-5 py-5">
              <p className="text-[18px] font-bold text-[#111827]">전체 결과지는 메일로 보내 드립니다</p>
              <ul className="mt-2 space-y-1 text-[16px] leading-[1.6] text-[#374151]">
                <li>③ 항목별 근거 · 영역 {CATEGORIES.length}개</li>
                <li>④ 확인 필요 · {pending.length}개 문항</li>
                <li>문항별 답과 근거 조문, 다음 점검일</li>
              </ul>
              <a href="#report" className="mt-4 inline-flex h-[48px] items-center bg-[#111827] px-5 text-[16px] font-bold text-white no-underline visited:text-white">리포트 받기 ↓</a>
            </div>
          </div>

          <div className="py-6">
            <Head n="⑤" t="다음 점검일" />
            <p className="mt-2 text-[22px] font-bold text-[#111827] tabular-nums">{fmt(next)}</p>
            <p className="mt-1">결과는 서버에 저장되지 않습니다. 6개월 뒤 같은 문항으로 다시 점검하시면 달라진 점을 바로 확인할 수 있습니다.</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <button type="button" onClick={() => downloadIcs(next)} className="inline-flex h-[48px] items-center rounded-lg border-2 px-5 text-[16px] font-bold" style={{ borderColor: SITE_COLOR, color: SITE_COLOR }}>캘린더에 추가</button>
              <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-[48px] items-center rounded-lg bg-[#FEE500] px-5 text-[16px] font-bold text-[#391B1B] no-underline">법 바뀌기 전에 먼저 알기</a>
            </div>
          </div>

          <p className="border-t border-[#E5E7EB] pt-5 text-center text-[15px] font-semibold text-[#6B7280]">형식은 같고, 내용은 귀사뿐입니다</p>
        </article>
      </div>
    </section>
  )
}
