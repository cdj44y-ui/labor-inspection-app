import { Link } from 'react-router-dom'
import SiteHeader from '../components/common/SiteHeader.jsx'
import SiteFooter from '../components/common/SiteFooter.jsx'
import { EXPERT_PROFILE } from '../data/expert.js'
import { CALENDLY_URL, DIAGNOSIS_CTA_CLASS, CONSULT_BUTTON_CLASS } from '../constants/contact.js'

export default function About() {
  const { name, title, tagline, specialties, achievements, testimonials, contact } = EXPERT_PROFILE

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-12 pt-6 md:px-8 md:pt-8">
        <SiteHeader />
        <main className="mt-8 space-y-10">
          <section className="rounded-3xl border-2 border-zinc-200 bg-white p-6 shadow-edge md:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-zinc-100 text-2xl font-bold text-ink"
                aria-hidden
              >
                조
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                  {name} 노무사
                </h1>
                <p className="mt-1 text-sm font-medium text-zinc-700">{title}</p>
                <blockquote className="mt-4 border-l-4 border-toss pl-4 text-[15px] leading-relaxed text-zinc-800">
                  &quot;{tagline}&quot;
                </blockquote>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">전문 분야</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {specialties.map((s) => (
                <div key={s.area} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <p className="font-extrabold text-ink">{s.area}</p>
                  <ul className="mt-2 space-y-1 text-[11px] text-zinc-700">
                    {s.details.map((d) => (
                      <li key={d}>· {d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">주요 실적</h2>
            <ul className="mt-4 space-y-2 text-[14px] text-zinc-800">
              {achievements.map((a) => (
                <li key={a.label}>
                  <span className="font-bold text-toss">{a.metric}</span> {a.label}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">고객 후기</h2>
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 text-[14px] leading-relaxed text-zinc-800"
              >
                <blockquote>&quot;{t.quote}&quot;</blockquote>
                <figcaption className="mt-3 text-[11px] text-zinc-600">
                  — {t.author}, {t.company}
                </figcaption>
              </figure>
            ))}
          </section>

          <section className="flex flex-col gap-3 sm:flex-row">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={DIAGNOSIS_CTA_CLASS + ' justify-center px-8 py-3.5 text-center text-sm font-bold'}
            >
              무료 상담 예약하기
            </a>
            <Link
              to="/contact"
              className={CONSULT_BUTTON_CLASS + ' justify-center px-8 py-3.5 text-center text-sm font-bold'}
            >
              컨설팅 문의하기
            </Link>
            <Link
              to="/diagnosis"
              className="inline-flex items-center justify-center rounded-full border-2 border-ink bg-white px-6 py-3.5 text-sm font-semibold text-ink"
            >
              자가진단 하러 가기
            </Link>
          </section>
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}
