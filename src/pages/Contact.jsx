import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SiteHeader from '../components/common/SiteHeader.jsx'
import SiteFooter from '../components/common/SiteFooter.jsx'
import TallyEmbed from '../components/common/TallyEmbed.jsx'
import { CONTACT_PHONE } from '../constants/contact.js'
import { EXPERT_PROFILE } from '../data/expert.js'
import { buildTallyEmbedUrl } from '../utils/tally.js'
import { CATEGORIES } from '../data/questions.js'
import { getTotalScore, getGrade, GRADE_LABELS } from '../utils/score.js'

const ANSWERS_KEY = 'labor_diagnosis_answers'

function readDiagnosisSummary() {
  try {
    const raw = localStorage.getItem(ANSWERS_KEY)
    if (!raw) return null
    const answers = JSON.parse(raw)
    if (!Array.isArray(answers) || answers.every((a) => !a)) return null
    const totalScore = getTotalScore(answers)
    const grade = getGrade(totalScore)
    return { totalScore, grade, label: GRADE_LABELS[grade].label }
  } catch {
    return null
  }
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const concernParam = searchParams.get('concerns')

  const [concerns, setConcerns] = useState(() => {
    if (!concernParam) return []
    const m = CATEGORIES.find((c) => c.name === concernParam)
    return m ? [m.name] : [concernParam]
  })

  const diagnosis = useMemo(() => readDiagnosisSummary(), [])

  const toggleConcern = (label) => {
    setConcerns((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]))
  }

  const tallySrc = useMemo(
    () =>
      buildTallyEmbedUrl({
        area: concerns.join(', '),
        score: diagnosis ? `${diagnosis.totalScore}점` : undefined,
        grade: diagnosis ? diagnosis.label : undefined,
      }),
    [concerns, diagnosis],
  )

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-12 pt-6 md:px-8 md:pt-8">
        <SiteHeader />
        <main className="mt-8">
          <h1 className="text-2xl font-extrabold">상담 신청</h1>
          <p className="mt-2 text-sm text-zinc-700">
            근로감독 대비 컨설팅·긴급 자문 요청을 남겨 주세요. 아래 폼을 제출하시면 담당 노무사에게 바로 접수됩니다.
          </p>

          {diagnosis && (
            <p className="mt-3 rounded-xl border border-toss/30 bg-toss/5 px-3 py-2 text-sm text-ink">
              방금 진행한 자가진단 결과({diagnosis.totalScore}점 · {diagnosis.label})가 문의 내용에 함께 전달됩니다.
            </p>
          )}

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-zinc-700">관심 영역 (복수 선택, 선택 사항)</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleConcern(c.name)}
                  className={
                    'rounded-full border px-3 py-1.5 text-sm font-medium ' +
                    (concerns.includes(c.name)
                      ? 'border-toss bg-toss/10 text-ink'
                      : 'border-zinc-300 bg-white text-zinc-700')
                  }
                >
                  {c.name}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 overflow-hidden rounded-3xl border-2 border-zinc-200 bg-white p-2 shadow-edge md:p-4">
            <TallyEmbed src={tallySrc} title="노무 상담 문의 · 조대진 노무사" height={760} />
          </div>

          <p className="mt-6 text-center text-sm text-zinc-700">
            폼이 보이지 않으시면 전화{' '}
            <a href={`tel:${CONTACT_PHONE.replace(/-/g, '')}`} className="font-medium text-toss underline">
              {CONTACT_PHONE}
            </a>{' '}
            또는 이메일{' '}
            <a href={`mailto:${EXPERT_PROFILE.contact.email}`} className="font-medium text-toss underline">
              {EXPERT_PROFILE.contact.email}
            </a>
            로 문의해 주세요.
          </p>

          <p className="mt-4 text-center text-sm">
            <Link to="/result" className="font-medium text-toss underline">
              진단 결과로 돌아가기
            </Link>
          </p>
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
