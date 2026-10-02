import { useEffect, useState } from 'react'

/** 랜딩 페이지 전용 속보 배너 — 중요 법령·입법 동향을 여러 건 순환 노출, 닫기 가능 */
const NEWS_ITEMS = [
  {
    body: (
      <>
        국회 본회의, 반복 산재 사망 시{' '}
        <b className="font-semibold text-toss">영업이익 최대 5% 과징금</b> 부과하는 산업안전보건법 개정안 통과
      </>
    ),
    source: '연합뉴스 2026.10.01 · 공포·시행 전',
  },
  {
    body: (
      <>
        고용노동부, <b className="font-semibold text-toss">포괄임금 오남용 하반기 기획감독</b> 시행 중 — 제조업·IT·전문서비스업
        집중 점검
      </>
    ),
    source: '고용노동부 보도자료 2026.09.15 · 감독 진행 중',
  },
  {
    body: (
      <>
        임금체불 등 벌칙 상향(3년·3천만원 → <b className="font-semibold text-toss">5년·5천만원</b>) 10월 7일 시행
      </>
    ),
    source: '근로기준법 개정 법률 제21533호',
  },
]

export default function NewsBanner() {
  const [visible, setVisible] = useState(true)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIdx((i) => (i + 1) % NEWS_ITEMS.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [])

  if (!visible) return null
  const current = NEWS_ITEMS[idx]

  return (
    <div className="bg-ink text-white/75 text-sm tracking-tight">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2.5 px-4 py-2.5 md:px-8">
        <span className="shrink-0 rounded-sm bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
          속보
        </span>
        <span className="flex-1 font-normal">{current.body}</span>
        <span className="hidden shrink-0 text-xs text-white/30 sm:inline">{current.source}</span>
        <div className="flex shrink-0 items-center gap-1.5" role="tablist" aria-label="속보 목록">
          {NEWS_ITEMS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              role="tab"
              aria-selected={i === idx}
              aria-label={`${i + 1}번째 소식 보기`}
              className={`h-1.5 w-1.5 rounded-full border-none p-0 transition ${
                i === idx ? 'bg-white/70' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
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
