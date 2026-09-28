import { GRADE_LABELS } from '../../utils/score.js'

const TRAFFIC = {
  safe: { emoji: '🟢', label: '안전', bar: 'bg-safe', ring: '#16a34a' },
  caution: { emoji: '🟡', label: '주의', bar: 'bg-caution', ring: '#ca8a04' },
  warning: { emoji: '🟠', label: '위험', bar: 'bg-warning', ring: '#ea580c' },
  danger: { emoji: '🔴', label: '고위험', bar: 'bg-danger', ring: '#dc2626' },
}

/**
 * @param {{ score: number, grade: keyof typeof GRADE_LABELS }} props
 */
export default function RiskGauge({ score, grade }) {
  const g = GRADE_LABELS[grade]
  const t = TRAFFIC[grade] || TRAFFIC.warning
  const width = Math.min(100, Math.max(0, score))

  const size = 132
  const stroke = 11
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - width / 100)

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e4e4e7" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={t.ring}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.7s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-extrabold leading-none text-ink">{score}</span>
            <span className="mt-1 text-[11px] font-semibold text-zinc-500">/ 100점</span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-lg font-extrabold text-ink">
            <span aria-hidden>{t.emoji}</span>
            <span>
              위험 등급: <span className="text-toss">{t.label}</span>
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">{g.message}</p>
        </div>
      </div>
    </div>
  )
}
