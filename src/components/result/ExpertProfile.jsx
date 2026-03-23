import { Link } from 'react-router-dom'
import { EXPERT_PROFILE } from '../../data/expert.js'

export default function ExpertProfile() {
  return (
    <section className="rounded-3xl border-2 border-zinc-200 bg-white p-5 shadow-edge md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-zinc-100 text-lg font-bold text-ink"
          aria-hidden
        >
          조
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">전문가</p>
          <h2 className="text-base font-extrabold text-ink md:text-lg">
            {EXPERT_PROFILE.name} {EXPERT_PROFILE.title}
          </h2>
          <p className="mt-1 text-[11px] text-zinc-700">{EXPERT_PROFILE.miniStat}</p>
          <Link
            to="/about"
            className="mt-2 inline-block text-[11px] font-semibold text-toss underline decoration-toss/40"
          >
            프로필 더 보기 →
          </Link>
        </div>
      </div>
    </section>
  )
}
