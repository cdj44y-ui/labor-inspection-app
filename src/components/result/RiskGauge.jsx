import { GRADE_LABELS } from '../../utils/score.js'

const TRAFFIC = {
  safe: { emoji: '🟢', label: '안전', bar: 'bg-safe' },
  caution: { emoji: '🟡', label: '주의', bar: 'bg-caution' },
  warning: { emoji: '🟠', label: '위험', bar: 'bg-warning' },
  danger: { emoji: '🔴', label: '고위험', bar: 'bg-danger' },
}

/**
 * @param {{ score: number, grade: keyof typeof GRADE_LABELS }} props
 */
export default function RiskGauge({ score, grade }) {
  const g = GRADE_LABELS[grade]
  const t = TRAFFIC[grade] || TRAFFIC.warning
  const width = Math.min(100, Math.max(0, score))

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 text-lg font-extrabold text-ink">
        <span aria-hidden>{t.emoji}</span>
        <span>
          위험 등급: <span className="text-toss">{t.label}</span>
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-600">{g.message}</p>
      <div className="mt-4 border-t border-zinc-200 pt-4">
        <p className="text-sm font-bold text-ink">
          종합 위험 점수:{' '}
          <span className="text-toss">
            {score}/100
          </span>
        </p>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${t.bar}`}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </div>
  )
}
