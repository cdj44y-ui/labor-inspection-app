import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SiteHeader from '../components/common/SiteHeader.jsx'
import SiteFooter from '../components/common/SiteFooter.jsx'
import { EXPERT_LABOR } from '../data/expertLabor.js'
import { SITE_URL, FREE119_SITE_URL, CONTACT_PHONE, CALENDLY_URL } from '../constants/contact.js'

const PRIMARY = '#1B3A5C'
const ACCENT = '#FF6B35'
const TITLE = '조대진 노무사 | 안전공학 박사 · 근로감독 전문 - RISK119'
const DESC =
  '안전공학 박사, 노무사 15년. 산업안전 × 노동법 × HR 트라이브리드 전문가. 근로감독 대비 컨설팅, 중대재해처벌법 대응 체계 구축, 기업 강의.'

const TONE_BADGE = {
  safety: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  labor: 'bg-sky-50 text-sky-950 border-sky-200',
  hr: 'bg-orange-50 text-orange-950 border-orange-200',
}

const PHIL_MARK = ['①', '②', '③']

export default function About() {
  const E = EXPERT_LABOR
  const { pathname } = useLocation()
  const telHref = `tel:${E.contact.phone.replace(/-/g, '')}`

  useEffect(() => {
    const prevTitle = document.title
    document.title = TITLE
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? ''
    if (metaDesc) metaDesc.setAttribute('content', DESC)
    const upsertOg = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }
    const origin = SITE_URL.replace(/\/$/, '')
    upsertOg('og:title', '조대진 노무사 | 안전 × 노동법 × HR')
    upsertOg('og:description', '단일 분야 전문가가 아니라, 사고·책임·성과를 함께 설계합니다.')
    upsertOg('og:url', `${origin}${pathname}`)
    upsertOg('og:image', `${origin}/og/about.png`)

    return () => {
      document.title = prevTitle
      if (metaDesc) metaDesc.setAttribute('content', prevDesc)
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-6 md:px-8 md:pt-8">
        <SiteHeader />

        <main className="mt-6">
          <section
            className="rounded-2xl border border-zinc-200 px-4 py-10 sm:px-8 sm:py-14"
            style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #f5f5f7 100%)' }}
          >
            <div className="mx-auto flex max-w-3xl flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
              <div className="flex shrink-0 justify-center sm:justify-start">
                <img
                  src={E.photo}
                  alt={`${E.name} ${E.title} 프로필`}
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px] rounded-full border-4 border-white object-cover object-top shadow-lg"
                />
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="mb-1 text-[12px] font-semibold" style={{ color: PRIMARY }}>
                  {E.affiliation}
                </p>
                <h1 className="mb-3 text-[28px] font-semibold tracking-tight sm:text-[32px]" style={{ color: PRIMARY }}>
                  {E.name} {E.title}
                </h1>
                <div className="mb-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {E.credentials.map((c) => (
                    <span
                      key={c}
                      className="inline-block rounded-full border border-zinc-200 px-3 py-1.5 text-[12px] font-medium"
                      style={{ background: '#F0F4F8', color: '#2E75B6' }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mb-6 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {E.career.map((x) => (
                    <span
                      key={x.company}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-[13px] text-ink"
                    >
                      <span aria-hidden>{x.icon}</span>
                      <span className="font-medium">{x.company}</span>
                      <span className="text-zinc-600">{x.role}</span>
                    </span>
                  ))}
                </div>
                <p className="mb-3 text-[22px] font-semibold leading-snug sm:text-[24px]" style={{ color: PRIMARY }}>
                  {E.tagline}
                </p>
                <p className="mx-auto max-w-xl text-[16px] leading-relaxed text-zinc-600 sm:mx-0 sm:text-[17px]">{E.subtitle}</p>
              </div>
            </div>
          </section>

          <section className="mt-6 border-y border-zinc-200 bg-white py-12 sm:py-14">
            <h2 className="mb-10 text-center text-[22px] font-semibold sm:text-[24px]" style={{ color: PRIMARY }}>
              트라이브리드 전문 영역
            </h2>
            <div className="grid gap-4 md:grid-cols-3 md:gap-5">
              {E.specialties.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-zinc-300 bg-white p-6 shadow-card transition hover:shadow-lg"
                >
                  <span className="mb-2 block text-[32px] leading-none" aria-hidden>
                    {s.icon}
                  </span>
                  <h3 className="text-[19px] font-semibold text-ink">{s.area}</h3>
                  <p className="mt-1 text-[14px] italic text-zinc-600">{s.subtitle}</p>
                  <span
                    className={`mt-3 inline-block rounded-md border px-2.5 py-1 text-[11px] font-semibold ${TONE_BADGE[s.tone]}`}
                  >
                    {s.credentials}
                  </span>
                  <div className="mt-4 border-t border-zinc-200 pt-4">
                    <ul className="space-y-2">
                      {s.details.map((d) => (
                        <li
                          key={d}
                          className="relative pl-3 text-[14px] leading-relaxed text-zinc-700 before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-zinc-400"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-2xl border-t border-dashed border-zinc-200 pt-8 text-center text-[14px] italic leading-relaxed text-zinc-500">
              {E.triadFooter}
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 py-12 sm:py-14">
            <h2 className="mb-10 text-center text-[22px] font-semibold sm:text-[24px]" style={{ color: PRIMARY }}>
              실적
            </h2>
            <div className="grid gap-6 text-center sm:grid-cols-3 sm:gap-8">
              {E.achievements.map((a) => (
                <div key={a.label} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="mb-2 flex flex-wrap items-baseline justify-center gap-0.5">
                    <span
                      className="text-[40px] font-bold tabular-nums tracking-tight sm:text-[44px]"
                      style={{ color: PRIMARY }}
                    >
                      {a.metric}
                    </span>
                    <span className="text-[20px] font-semibold sm:text-[22px]" style={{ color: '#2E75B6' }}>
                      {a.unit}
                    </span>
                  </div>
                  <p className="mb-2 text-[15px] font-semibold text-ink">{a.label}</p>
                  <p className="text-[13px] leading-relaxed text-zinc-500">{a.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 bg-white py-12 sm:py-14">
            <div className="mx-auto max-w-[720px]">
              <h2
                className="mx-auto mb-2 w-max border-b-2 pb-3 text-center text-[22px] font-semibold sm:text-[24px]"
                style={{ color: PRIMARY, borderColor: '#1B3A5C33' }}
              >
                {E.philosophy.headline}
              </h2>
              <div className="mt-10 space-y-8">
                {E.philosophy.points.map((p, i) => (
                  <div key={p.title}>
                    <h3 className="mb-2 text-[17px] font-semibold text-zinc-900 sm:text-[18px]">
                      <span className="mr-1 text-toss">{PHIL_MARK[i]}</span>
                      {p.title}
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-zinc-600">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 py-12 sm:py-14">
            <h2 className="mb-2 text-center text-[22px] font-semibold sm:text-[24px]" style={{ color: PRIMARY }}>
              고객이 말하는 조대진 노무사
            </h2>
            <p className="mb-10 text-center text-[12px] text-zinc-500">실제 후기 확보 후 교체 예정입니다.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {E.testimonials.map((t, i) => (
                <blockquote
                  key={i}
                  className="relative rounded-xl border border-zinc-200 bg-white p-8 pt-10 shadow-sm"
                >
                  <span
                    className="absolute left-5 top-4 font-serif text-[48px] leading-none text-zinc-200 select-none"
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <p className="relative z-[1] mb-6 text-[15px] italic leading-[1.8] text-zinc-800">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="text-[14px]">
                    <p className="font-semibold text-zinc-600">{t.author}</p>
                    <p className="mt-0.5 text-zinc-500">{t.company}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>

          <section className="mt-6 pb-8">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-xl">
              <div
                className="px-6 py-10 text-center sm:px-10 sm:py-12"
                style={{ background: 'linear-gradient(160deg, #1B3A5C 0%, #152a45 100%)' }}
              >
                <h2 className="mb-3 text-[20px] font-semibold leading-snug text-white sm:text-[24px]">
                  우리 회사에도 같은 문제가 있을까?
                </h2>
                <p className="mb-8 text-[15px] leading-relaxed text-white/85 sm:text-[16px]">
                  3분 자가진단으로 확인하고,
                  <br className="hidden sm:block" />
                  전문가와 15분 무료 상담으로 해결 방향을 잡으세요.
                </p>
                <div className="mb-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    to="/diagnosis"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold transition hover:opacity-95"
                    style={{ color: PRIMARY }}
                  >
                    근로감독 자가진단 시작하기
                  </Link>
                  <a
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white transition hover:opacity-95"
                    style={{ background: ACCENT }}
                  >
                    15분 무료 상담 예약하기
                  </a>
                </div>
                <p className="mb-4 text-[12px] text-white/70">
                  FREE119(근로자성) 진단은{' '}
                  <a
                    href={`${FREE119_SITE_URL}/diagnosis`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white underline hover:text-white/90"
                  >
                    free119.site
                  </a>
                  에서 이용할 수 있습니다.
                </p>
                <div className="flex flex-col items-center justify-center gap-3 text-[13px] text-white/90 sm:flex-row sm:gap-6">
                  <a href={telHref} className="inline-flex items-center gap-1.5 font-medium hover:underline">
                    {CONTACT_PHONE}
                  </a>
                  <a href={`mailto:${E.contact.email}`} className="break-all hover:underline">
                    {E.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
