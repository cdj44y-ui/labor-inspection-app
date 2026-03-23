import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SiteHeader from '../components/common/SiteHeader.jsx'
import SiteFooter from '../components/common/SiteFooter.jsx'
import { FORMSPREE_FORM_ID, CONSULT_BUTTON_CLASS } from '../constants/contact.js'
import { CATEGORIES } from '../data/questions.js'

const EMPLOYEE_OPTIONS = ['5인 미만', '5~29인', '30~49인', '50~99인', '100~299인', '300인 이상']
const INDUSTRY_OPTIONS = ['제조', '건설', 'IT', '서비스', '유통', '기타']

export default function Contact() {
  const [searchParams] = useSearchParams()
  const concernParam = searchParams.get('concerns')

  const [companyName, setCompanyName] = useState('')
  const [employeeCount, setEmployeeCount] = useState(EMPLOYEE_OPTIONS[1])
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0])
  const [concerns, setConcerns] = useState(() => {
    if (!concernParam) return []
    const m = CATEGORIES.find((c) => c.name === concernParam)
    return m ? [m.name] : [concernParam]
  })
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const toggleConcern = (label) => {
    setConcerns((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!FORMSPREE_FORM_ID) {
      setStatus('폼 연동 준비 중입니다. 이메일로 cdj44y@gmail.com 으로 문의해 주세요.')
      return
    }
    setStatus('전송 중…')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          companyName,
          employeeCount,
          industry,
          concerns: concerns.join(', '),
          name,
          phone,
          email,
          message,
          _subject: '[RISK119] 컨설팅 문의',
        }),
      })
      setStatus(res.ok ? '접수되었습니다. 빠르게 연락드리겠습니다.' : '전송에 실패했습니다.')
    } catch {
      setStatus('네트워크 오류입니다.')
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-12 pt-6 md:px-8 md:pt-8">
        <SiteHeader />
        <main className="mt-8">
          <h1 className="text-2xl font-extrabold">상담 신청</h1>
          <p className="mt-2 text-sm text-zinc-700">
            근로감독 대비 컨설팅·긴급 자문 요청을 남겨 주세요.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge">
            <label className="block text-xs font-semibold text-zinc-700">
              회사명
              <input
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </label>
            <label className="block text-xs font-semibold text-zinc-700">
              인원수
              <select
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
              >
                {EMPLOYEE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold text-zinc-700">
              업종
              <select
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                {INDUSTRY_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend className="text-xs font-semibold text-zinc-700">관심 영역 (복수 선택)</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleConcern(c.name)}
                    className={
                      'rounded-full border px-3 py-1.5 text-[11px] font-medium ' +
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
            <label className="block text-xs font-semibold text-zinc-700">
              담당자명
              <input
                required
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block text-xs font-semibold text-zinc-700">
              연락처
              <input
                required
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="block text-xs font-semibold text-zinc-700">
              이메일
              <input
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block text-xs font-semibold text-zinc-700">
              추가 문의 (선택)
              <textarea
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            <button type="submit" className={CONSULT_BUTTON_CLASS + ' w-full justify-center py-3 text-sm font-bold'}>
              문의 보내기
            </button>
            {status && <p className="text-center text-sm text-toss">{status}</p>}
            {!FORMSPREE_FORM_ID && (
              <p className="text-center text-[11px] text-zinc-500">
                VITE_FORMSPREE_ID 환경 변수 설정 시 이 폼이 활성화됩니다.
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm">
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
