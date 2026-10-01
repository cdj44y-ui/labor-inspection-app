import { useState } from 'react'

/** 랜딩 페이지 전용 속보 배너 — 중요 법령·입법 동향을 짧게 노출, 닫기 가능 */
export default function NewsBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="bg-ink text-white/75 text-sm tracking-tight">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2.5 px-4 py-2.5 md:px-8">
        <span className="shrink-0 rounded-sm bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
          속보
        </span>
        <span className="flex-1 font-normal">
          국회 본회의, 반복 산재 사망 시{' '}
          <b className="font-semibold text-toss">영업이익 최대 5% 과징금</b> 부과하는 산업안전보건법 개정안 통과
        </span>
        <span className="hidden shrink-0 text-xs text-white/30 sm:inline">뉴스1 2026.10.01 · 공포·시행 전</span>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 cursor-pointer border-none bg-transparent p-0 text-base leading-none text-white/25 hover:text-white/60"
          aria-label="배너 닫기"
        >
          ×
        </button>
      </div>
    </div>
  )
}
