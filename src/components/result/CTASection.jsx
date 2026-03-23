import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PopupButton } from 'react-calendly'
import {
  CALENDLY_URL,
  FORMSPREE_FORM_ID,
  DIAGNOSIS_CTA_CLASS,
  CONSULT_BUTTON_CLASS,
} from '../../constants/contact.js'

/**
 * @param {{
 *   riskLevelLabel: string,
 *   totalPenaltyManwon: number,
 *   violationSummary: string,
 * }} props
 */
export default function CTASection({ riskLevelLabel, totalPenaltyManwon, violationSummary }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [rootEl, setRootEl] = useState(/** @type {HTMLElement | null} */ (null))

  useEffect(() => {
    setRootEl(document.getElementById('root'))
  }, [])

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus('이메일을 입력해 주세요.')
      return
    }
    if (!FORMSPREE_FORM_ID) {
      setStatus('이메일 수집 연동 준비 중입니다. 아래 무료 상담·문의를 이용해 주세요.')
      return
    }
    setStatus('전송 중…')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          riskLevel: riskLevelLabel,
          totalPenalty: totalPenaltyManwon,
          violationSummary,
          _subject: '[RISK119] 맞춤 개선 가이드 요청',
          timestamp: new Date().toISOString(),
        }),
      })
      if (res.ok) {
        setStatus('접수되었습니다. 곧 안내드리겠습니다.')
        setEmail('')
      } else {
        setStatus('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.')
      }
    } catch {
      setStatus('네트워크 오류입니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  const calendlyBaseUrl = CALENDLY_URL.replace(/\?.*$/, '')

  return (
    <section className="rounded-3xl border-2 border-toss/30 bg-white p-6 shadow-edge md:p-8">
      <h2 className="text-base font-extrabold text-ink md:text-lg">다음 단계</h2>
      <p className="mt-1 text-[11px] text-zinc-700">부담이 적은 순서로 단계별로 도와드립니다.</p>

      <div className="mt-6 space-y-8">
        {/* 1단계 */}
        <div>
          <p className="text-sm font-bold text-ink">📋 1단계: 무료 개선 가이드 받기</p>
          <form onSubmit={handleEmailSubmit} className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="cta-email">
                이메일
              </label>
              <input
                id="cta-email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-[44px] flex-1 rounded-xl border border-zinc-300 bg-white px-3 text-sm text-ink outline-none ring-toss/20 focus:border-toss focus:ring-2"
              />
              <button type="submit" className={DIAGNOSIS_CTA_CLASS + ' min-h-[44px] shrink-0 px-5 py-2.5 text-sm'}>
                받기
              </button>
            </div>
            <ul className="mt-3 space-y-1 text-[11px] text-zinc-700">
              <li>✓ 귀사 진단 결과 기반 맞춤 개선 가이드(PDF·메일 안내)</li>
              <li>✓ 영역별 우선순위 + 법령 근거 포함</li>
            </ul>
            {status && <p className="mt-2 text-[11px] font-medium text-toss">{status}</p>}
            {!FORMSPREE_FORM_ID && (
              <p className="mt-2 text-[10px] text-zinc-500">
                Formspree 폼 ID(`VITE_FORMSPREE_ID`)를 설정하면 이메일 접수가 활성화됩니다.
              </p>
            )}
          </form>
        </div>

        {/* 2단계 */}
        <div>
          <p className="text-sm font-bold text-ink">📞 2단계: 15분 무료 전화상담 예약</p>
          <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <p className="text-[11px] leading-relaxed text-zinc-800">
              &quot;진단 결과를 바탕으로 핵심 개선 포인트를 15분 안에 짚어드립니다.&quot;
            </p>
            {rootEl ? (
              <div className="mt-3">
                <PopupButton
                  url={calendlyBaseUrl}
                  rootElement={rootEl}
                  text="무료 상담 예약하기"
                  className={DIAGNOSIS_CTA_CLASS + ' w-full justify-center px-6 py-3 text-sm sm:w-auto'}
                  utm={{ utmSource: 'risk119', utmContent: riskLevelLabel, utmCampaign: 'result_cta' }}
                />
              </div>
            ) : (
              <a
                href={`${calendlyBaseUrl}?utm_source=risk119&utm_content=${encodeURIComponent(riskLevelLabel)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={DIAGNOSIS_CTA_CLASS + ' mt-3 inline-flex w-full justify-center px-6 py-3 text-sm sm:w-auto'}
              >
                무료 상담 예약하기
              </a>
            )}
          </div>
        </div>

        {/* 3단계 */}
        <div>
          <p className="text-sm font-bold text-ink">💼 3단계: 근로감독 대비 컨설팅 문의</p>
          <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <p className="text-[11px] leading-relaxed text-zinc-800">
              &quot;체계적 점검부터 감독관 대응까지, 원스톱으로 준비합니다.&quot;
            </p>
            <Link
              to="/contact"
              className={CONSULT_BUTTON_CLASS + ' mt-3 inline-flex w-full justify-center px-6 py-3 text-sm sm:w-auto'}
            >
              컨설팅 문의하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
