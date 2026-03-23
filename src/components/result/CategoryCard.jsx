import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORY_LABELS } from '../../data/penalties.js'

export default function CategoryCard({ categoryKey, items }) {
  const [open, setOpen] = useState(false)
  const label = CATEGORY_LABELS[categoryKey] || categoryKey
  const sum = items.reduce((a, b) => a + (b.fineManwon || 0) + (b.adminManwon || 0), 0)

  return (
    <div className="rounded-2xl border-2 border-zinc-200 bg-white p-4 shadow-edge md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-extrabold text-ink">{label}</h3>
        <p className="text-[11px] font-semibold text-zinc-700">
          ❌ 미충족 {items.length}건 | 예상 과태료·벌금: 약 {Math.round(sum).toLocaleString('ko-KR')}만원
        </p>
      </div>
      <ul className="mt-3 space-y-2.5 border-t border-zinc-100 pt-3">
        {items.map((item) => (
          <li key={item.id} className="text-[11px] leading-relaxed text-zinc-800">
            <span className="font-semibold text-ink">• {item.question}</span>
            <span className="text-zinc-600"> — {item.penaltyDetail}</span>
            <span className="block pl-2 text-[10px] text-zinc-500">└ {item.legalBasis}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-3 text-left text-[11px] font-semibold text-toss underline decoration-toss/40"
      >
        {open ? '개선 가이드 접기' : '[이 영역 개선 가이드 보기]'}
      </button>
      {open && (
        <p className="mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-[11px] leading-relaxed text-zinc-800">
          {items[0]?.improvementGuide}
        </p>
      )}
      <Link
        to={`/contact?concerns=${encodeURIComponent(label)}`}
        className="mt-3 inline-block text-[11px] font-semibold text-zinc-600 underline decoration-zinc-400"
      >
        이 영역 상담 신청하기 →
      </Link>
    </div>
  )
}
