import { useState } from 'react'

// 2026-10-29 리포트 받기 — 결과 직후 3칸 + 필수·선택 동의 (개인정보 보호법 제15조 제2항·제22조)
const SIZES = ['5명 미만', '5~29명', '30~49명', '50~99명', '100~299명', '300명 이상']
const API = 'https://win119.site/api/report'

export default function ReportRequest({ answers, tallyUrl }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [size, setSize] = useState('')
  const [consent, setConsent] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [hp, setHp] = useState('')
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [state, setState] = useState('idle')
  const [next, setNext] = useState('')
  const [msg, setMsg] = useState('')

  const valid = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim()) && company.trim().length > 0 && consent

  async function submit(e) {
    e.preventDefault()
    if (!valid || state === 'sending') return
    setState('sending'); setMsg('')
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ site: 'risk', email: email.trim(), company: company.trim(), size, consent: true, marketing, hp, answers }) })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.ok) {
        setNext(j.next || ''); setState('done')
        try { window.va && window.va('event', { name: 'report_request', data: { site: 'risk', marketing: marketing ? 'y' : 'n' } }) } catch (_) {}
      } else {
        setState('error')
        setMsg(j.error === 'limit' ? '잠시 후 다시 시도해 주세요. 같은 주소로는 하루 5번까지 받으실 수 있습니다.' : j.error === 'company' ? '회사명에는 주소(링크)를 넣을 수 없습니다.' : j.error === 'email' ? '이메일 주소를 다시 확인해 주세요.' : '보내지 못했습니다. 잠시 후 다시 시도해 주세요.')
      }
    } catch (_) { setState('error'); setMsg('보내지 못했습니다. 잠시 후 다시 시도해 주세요.') }
  }

  const box = 'mx-auto max-w-[560px] px-5 md:px-0'
  if (state === 'done') {
    return (
      <section id="report" className="border-b border-[#E6E6E6] bg-white py-14 md:py-[72px]">
        <div className={box + ' text-center'}>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1B2A44] text-[28px] font-extrabold text-white" aria-hidden>✓</div>
          <h2 className="mt-5 text-[26px] font-extrabold tracking-[-0.6px]">리포트를 보냈습니다</h2>
          <p className="mt-3 text-[17px] leading-[1.7] text-[#444]">{email}<br />1분 안에 도착합니다. 안 보이면 스팸함을 확인해 주세요.</p>
          {next && <p className="mt-6 border-y border-[#E6E6E6] py-4 text-[17px]"><b>다음 점검일</b> {next}</p>}
          <a href={tallyUrl} target="_blank" rel="noopener noreferrer" className="mt-6 flex h-[56px] items-center justify-center bg-[#111] text-[18px] font-bold text-white no-underline visited:text-white hover:bg-[#333]">맞춤 제안 받기 →</a>
          <p className="mt-3 text-[14px] text-[#777]">범위와 비용을 먼저 안내합니다 · 유료 자문</p>
        </div>
      </section>
    )
  }

  const input = 'mt-2 h-[52px] w-full rounded-none border border-[#BDBDBD] bg-white px-4 text-[17px] text-[#111] outline-none focus:border-[#111]'
  return (
    <section id="report" className="border-b border-[#E6E6E6] bg-white py-14 md:py-[72px]">
      <form className={box} onSubmit={submit} noValidate>
        <h2 className="text-[26px] font-extrabold leading-[1.35] tracking-[-0.6px] md:text-[30px]">이 결과를 메일로 받아 보세요</h2>
        <p className="mt-2 text-[17px] leading-[1.6] text-[#555]">점수·할 일 3가지·다음 점검일을 한 장으로 보내 드립니다.</p>
        <label className="mt-7 block text-[15px] font-bold">이메일<input type="email" inputMode="email" autoComplete="email" maxLength={80} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={input} /></label>
        <label className="mt-5 block text-[15px] font-bold">회사명<input type="text" autoComplete="organization" maxLength={40} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="예: ○○산업" className={input} /></label>
        <label className="mt-5 block text-[15px] font-bold">직원 수<select value={size} onChange={(e) => setSize(e.target.value)} className={input}><option value="">선택해 주세요</option>{SIZES.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden="true" />
        <div className="mt-6 border-t border-[#E6E6E6] pt-5">
          <div className="flex items-start gap-3">
            <input id="rq-c1" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#111]" />
            <label htmlFor="rq-c1" className="text-[16px] leading-[1.5]"><b>[필수]</b> 개인정보 수집·이용 동의 <button type="button" onClick={() => setOpen1(!open1)} className="ml-1 text-[14px] text-[#666] underline">{open1 ? '닫기' : '보기'}</button></label>
          </div>
          {open1 && <p className="ml-8 mt-2 bg-[#F5F5F4] px-4 py-3 text-[14px] leading-[1.7] text-[#444]">목적 리포트 발송·요청하신 경우 맞춤 제안 회신 · 항목 이메일, 회사명, 직원 수, 진단 결과 · 보관 수집일부터 1년 · 동의하지 않으실 수 있으며, 이 경우 메일은 보내 드릴 수 없지만 화면의 결과는 그대로 보실 수 있습니다.</p>}
          <div className="mt-4 flex items-start gap-3">
            <input id="rq-c2" type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#111]" />
            <label htmlFor="rq-c2" className="text-[16px] leading-[1.5]"><span className="text-[#666]">[선택]</span> 법 개정·다음 점검일 안내 메일 받기 <button type="button" onClick={() => setOpen2(!open2)} className="ml-1 text-[14px] text-[#666] underline">{open2 ? '닫기' : '보기'}</button></label>
          </div>
          {open2 && <p className="ml-8 mt-2 bg-[#F5F5F4] px-4 py-3 text-[14px] leading-[1.7] text-[#444]">노동 법 개정 소식, 다음 점검일 알림, 위너스 자문·강의 안내 · 이메일로 월 2회 이내 · 모든 메일에서 한 번에 수신 거부 · 동의하지 않으셔도 리포트는 그대로 받으실 수 있습니다.</p>}
        </div>
        {msg && <p className="mt-4 text-[15px] font-bold text-[#111]" role="alert">{msg}</p>}
        <button type="submit" disabled={!valid || state === 'sending'} className="mt-6 flex h-[56px] w-full items-center justify-center rounded-none bg-[#111] text-[18px] font-bold text-white disabled:bg-[#BDBDBD]">{state === 'sending' ? '보내는 중…' : '리포트 받기'}</button>
        <p className="mt-3 text-[14px] text-[#777]">회원가입 없음 · <a href="https://win119.site/privacy" target="_blank" rel="noopener noreferrer" className="text-[#777] underline">개인정보 처리방침</a></p>
      </form>
    </section>
  )
}
